(() => {
  const audioContext = new AudioContext();
  const audioOutput = audioContext.createMediaStreamDestination();

  const soundElements = Array.from(
    document.querySelectorAll('#igiari-data-passing audio'),
  ).reduce((acc, element) => {
    return {
      ...acc,
      [element.dataset.type]: element,
    };
  }, {});

  document.addEventListener('onigiariplay', ({ detail: { type } }) => {
    const source = audioContext.createMediaStreamSource(
      soundElements[type].captureStream(),
    );
    source.connect(audioOutput);
    soundElements[type].currentTime = 0;
    soundElements[type].addEventListener(
      'ended',
      () => {
        source.disconnect(audioOutput);
      },
      false,
    );
    soundElements[type].play();
  });

  let destructLatestStream;

  // getUserMediaを差し替える
  if (navigator.mediaDevices._getUserMedia !== undefined) return;
  navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = async (constraints) => {
    // 前回addしたtrackを外す
    destructLatestStream && destructLatestStream();
    console.log('constraints', constraints); // eslint-disable-line
    const stream = await navigator.mediaDevices._getUserMedia(constraints);
    console.log('stream', stream); // eslint-disable-line
    const isDesktopAudio =
      constraints?.audio?.mandatory?.chromeMediaSource === 'system';

    if (constraints.audio && !isDesktopAudio) {
      const audioTracks = stream.getAudioTracks();
      const micSource = audioContext.createMediaStreamSource(stream);
      micSource.connect(audioOutput);
      if (audioTracks.length) {
        const defaultAudioTrack = audioTracks[0];
        stream.removeTrack(defaultAudioTrack);
        const otherDestinationTrack = audioOutput.stream.getAudioTracks()[0];
        stream.addTrack(otherDestinationTrack);

        destructLatestStream = () => {
          stream.removeTrack(otherDestinationTrack);
          stream.addTrack(defaultAudioTrack);
        };
      }
    }
    return stream;
  };
})();
