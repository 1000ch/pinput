(function() {

  var activeTabUrl = "";
  var activeTabTitle = "";
  
  // when the active tab is changed
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
      activeTabUrl = tab.url;
      activeTabTitle = tab.title;
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