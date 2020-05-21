// constant
const sounds = [
  { type: 'alert', path: 'sounds/metalgear-alert.wav' },
  { type: 'igiari', path: 'sounds/igiari.wav' },
  { type: 'matta', path: 'sounds/matta.wav' },
];

window.addEventListener(
  'load',
  () => {
    const igiariDataPassingElement = document.createElement('div');
    igiariDataPassingElement.id = 'igiari-data-passing';
    igiariDataPassingElement.style.display = 'none';

    const loadSounds = () => {
      sounds.forEach(async ({ type, path }) => {
        const audio = document.createElement('audio');
        audio.src = chrome.runtime.getURL(path);
        audio.dataset.type = type;
        igiariDataPassingElement.appendChild(audio);
      });
      document.body.appendChild(igiariDataPassingElement);
    };

    const loadScript = async () => {
      const res = await fetch(chrome.runtime.getURL('contentscript.js'), {
        method: 'GET',
      });
      const js = await res.text();
      const script = document.createElement('script');
      script.textContent = js;
      document.body.insertBefore(script, document.body.firstChild);
    };

    loadSounds();
    loadScript();
  },
  false,
);

chrome.runtime.onMessage.addListener(({ type }) => {
  document.dispatchEvent(new CustomEvent('onigiariplay', { detail: { type } }));
});
