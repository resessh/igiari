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
    soundElements[type].play();
  });

  // getUserMediaを差し替える
  if (navigator.mediaDevices._getUserMedia !== undefined) return;
  navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;
  navigator.mediaDevices.getUserMedia = async (constraints) => {
    console.log('constraints', constraints); // eslint-disable-line
    const stream = await navigator.mediaDevices._getUserMedia(constraints);
    console.log('stream', stream); // eslint-disable-line
    const isDesktopAudio =
      constraints?.video?.mandatory?.chromeMediaSource === 'system';

    if (constraints.audio && !isDesktopAudio) {
      const audioTracks = stream.getAudioTracks();
      const micSource = audioContext.createMediaStreamSource(stream);
      micSource.connect(audioOutput);
      if (audioTracks.length) {
        stream.removeTrack(audioTracks[0]);
        stream.addTrack(audioOutput.stream.getAudioTracks()[0]);
      }
    }
    return stream;
  };
})();
