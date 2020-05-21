(async () => {
  let changeColor = document.getElementById('changeColor');

  changeColor.onclick = function () {
    chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: 'alert' });
      });
    });
  };
})();
