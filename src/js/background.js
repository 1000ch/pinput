(function() {

  var activeTabId = 0;
  var activeTabUrl = "";
  var activeTabTitle = "";

  /**
   * Cache active tab information
   * @param {Number} tabId
   */
  function cacheActiveTab(tabId) {
    activeTabId = tabId;
    chrome.tabs.get(tabId, function(tab) {
      activeTabUrl = tab.url;
      activeTabTitle = tab.title;
    });
  }
  
  // when the active tab is changed
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    cacheActiveTab(activeInfo.tabId);
  });

  // when a tab is updated
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if(activeTabId === tabId) {
      cacheActiveTab(tabId);
    }
  });
  
  // when current window is switched
  chrome.windows.onFocusChanged.addListener(function(windowId) {
    chrome.windows.getCurrent({
      populate: true
    }, function(window) {
      window.tabs.forEach(function(tab) {
        if(tab.active) {
          cacheActiveTab(tab.id);
        }
      });
    });
  });
  
  // when received message, 
  // return the url and title of active tab
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    sendResponse({
      url: activeTabUrl,
      title: activeTabTitle
    });    
  });

})();