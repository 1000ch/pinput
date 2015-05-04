(function (global) {

  // common namespace
  var Pinput = global.Pinput || {};
  // background page namespace
  var Background = Pinput.Background || {};

  Background.activeTabId = 0;
  Background.activeTabUrl = '';
  Background.activeTabTitle = '';
  var chromeStorage = chrome.storage.sync;

  var keys = [
    Pinput.StorageKey.authToken,
    Pinput.StorageKey.isAuthenticated,
    Pinput.StorageKey.defaultPrivate,
    Pinput.StorageKey.defaultReadLater
  ];
  // check token authentication
  chromeStorage.get(keys, function (item) {
    Pinput.authToken = item[Pinput.StorageKey.authToken];
    Pinput.isAuthenticated = !!item[Pinput.StorageKey.isAuthenticated];
    Pinput.defaultPrivate = !!item[Pinput.StorageKey.defaultPrivate];
    Pinput.defaultReadLater = !!item[Pinput.StorageKey.defaultReadLater];
  });

  /**
   * Cache active tab information
   * @param {Number} tabId
   */
  function cacheActiveTab(tabId) {
    Background.activeTabId = tabId;
    chrome.tabs.get(tabId, function (tab) {
      Background.activeTabUrl = tab.url;
      Background.activeTabTitle = tab.title;
      updateIcon(Background.activeTabId, Background.activeTabUrl);
    });
  }

  /**
   * Check url is already bookmarked or not
   * @param {Number} tabId
   * @param {String} checkUrl
   */
  function updateIcon(tabId, checkUrl) {

    var isNotBookmarkable = 
      (checkUrl.indexOf('chrome://') !== -1) || 
      (checkUrl.indexOf('chrome-extension://') !== -1) || 
      (checkUrl.indexOf('file://') !== -1);

    // if schema is chrome related
    if (isNotBookmarkable) {
      chrome.browserAction.setBadgeText({
        text: '',
        tabId: tabId
      });
      return;
    }
    
    // if API token is authenticated
    if (Pinput.isAuthenticated) {
      // set background
      chrome.browserAction.setBadgeBackgroundColor({
        color: '#66cc33'
      });

      // request
      Pinput.API.getPost(checkUrl).done(function (data) {
        var isBookmarked = (data.posts.length !== 0);
        chrome.browserAction.setBadgeText({
          text: (isBookmarked) ? '●': '',
          tabId: tabId
        });
      }).fail(function (error) {
        chrome.browserAction.setBadgeText({
          text: '',
          tabId: tabId
        });
      });
    }
  }

  /**
   * Set extension icon checked or not
   * @param {Number} tabId
   * @param {String} checkUrl
   * @param {Bookean} isChecked
   */
  function setIcon(tabId, checkUrl, isChecked) {

    var isNotBookmarkable =
      (checkUrl.indexOf('chrome://') !== -1) ||
      (checkUrl.indexOf('chrome-extension://') !== -1) ||
      (checkUrl.indexOf('file://') !== -1);

    // if schema is chrome related
    if (isNotBookmarkable) {
      chrome.browserAction.setBadgeText({
        text: '',
        tabId: tabId
      });
      return;
    }

    // if API token is authenticated
    if (Pinput.isAuthenticated) {
      // set background
      chrome.browserAction.setBadgeBackgroundColor({
        color: '#66cc33'
      });

      // set icon checked
      chrome.browserAction.setBadgeText({
        text: isChecked ? '✓': '',
        tabId: tabId
      });
    }
  }
  
  // when the active tab is changed
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    cacheActiveTab(activeInfo.tabId);
  });

  // when a tab is updated
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.highlighted) {
      cacheActiveTab(tabId);
    }
  });
  
  // when current window is switched
  chrome.windows.onFocusChanged.addListener(function (windowId) {
    chrome.windows.getCurrent({
      populate: true
    }, function (window) {
      if (window && Array.isArray(window.tabs)) {
        window.tabs.forEach(function (tab) {
          if (tab.highlighted) {
            cacheActiveTab(tab.id);
          }
        });
      }
    });
  });
  
  // when received message, 
  // return the url and title of active tab
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.useStrict) {
      updateIcon(Background.activeTabId, Background.activeTabUrl);
    } else {
      setIcon(Background.activeTabId, Background.activeTabUrl, !!message.isBookmarked);
    }
    sendResponse({
      url: Background.activeTabUrl,
      title: Background.activeTabTitle
    });
  });
  
  chrome.commands.onCommand.addListener(function (command) {
    if ("direct-bookmark" === command) {
      Pinput.API.addPost(
        Background.activeTabUrl,
        Background.activeTabTitle,
        '',
        '',
        (Pinput.defaultPrivate ? 'no' : 'yes'),
        (Pinput.defaultReadLater ? 'yes' : 'no')
      ).done(function(data) {
        if (data.result_code !== 'done') {
          console.error(data);
          setIcon(Background.activeTabId, Background.activeTabUrl, false);
        } else {
          setIcon(Background.activeTabId, Background.activeTabUrl, true);
        }
      }).fail(function(error) {
        console.error(error);
        setIcon(Background.activeTabId, Background.activeTabUrl, false);
      });
    }
  });
  
  // launch options.html on installation
  chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == 'install'){
      chrome.tabs.create({
        url: '/html/options.html'
      });
    }
  });

  // export
  global.Pinput = Pinput;

})(this);
