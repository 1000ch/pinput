(function() {

  // if icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    if(!tab) {
      return;
    }

    // set current url and title
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