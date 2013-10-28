(function() {

  chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab) {
      return;
    }

    chrome.storage.local.set({
      currentUrl: tab.url,
      currentTitle: tab.title
    }, function() {
      chrome.browserAction.setPopup({
        tabId: tab.id,
        popup: "/src/html/popup.html"
      });
    });
  });

})();