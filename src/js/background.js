(function(global) {

  // common namespace
  var Pinput = global.Pinput || {};
  // background page namespace
  var Background = Pinput.Background || {};

  var activeTabId = 0;
  var activeTabUrl = "";
  var activeTabTitle = "";
  var checkedUrl = "";
  var chromeStorage = chrome.storage.sync;

  // check token authentication
  chromeStorage.get([Pinput.StorageKey.APIToken, Pinput.StorageKey.isAuthenticated], function(item) {
    Pinput.authToken = item[Pinput.StorageKey.APIToken];
    Pinput.isAuthenticated = !!item[Pinput.StorageKey.isAuthenticated];
  });

  /**
   * Cache active tab information
   * @param {Number} tabId
   */
  function cacheActiveTab(tabId) {
    activeTabId = tabId;
    chrome.tabs.get(tabId, function(tab) {
      activeTabUrl = tab.url;
      activeTabTitle = tab.title;
      updateIcon(activeTabId, activeTabUrl);
    });
  }

  /**
   * Check url is already bookmarked or not
   * @param {Number} tabId
   * @param {String} checkUrl
   */
  function updateIcon(tabId, checkUrl) {
    var isNotBookmarkable = 
      (checkUrl.indexOf("chrome://") !== -1) || 
      (checkUrl.indexOf("chrome-extension://") !== -1) || 
      (checkUrl.indexOf("file://") !== -1);

    // if schema is chrome related
    if (isNotBookmarkable) {
      chrome.browserAction.setBadgeText({
        text: "",
        tabId: tabId
      });
      return;
    }

    // filter 2nd check
    if (checkedUrl === checkUrl) {
      return;
    } else {
      checkedUrl = checkUrl;
    }

    // if API token is authenticated
    if (Pinput.isAuthenticated) {
      // set background
      chrome.browserAction.setBadgeBackgroundColor({
        color: "#66cc33"
      });

      // request
      Pinput.API.getPost(checkUrl).done(function(data) {
        var isBookmarked = (data.posts.length !== 0);
        chrome.browserAction.setBadgeText({
          text: (isBookmarked) ? "✓": "",
          tabId: tabId
        });
      }).fail(function(error) {
        chrome.browserAction.setBadgeText({
          text: "",
          tabId: tabId
        });
      });
    }
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

})(this);