const playButtons = document.querySelectorAll('.play');
playButtons.forEach((element) => {
  element.addEventListener('click', () => {
    chrome.tabs.query({ url: 'https://meet.google.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { type: element.dataset.type });
      });
    });
  });
});
