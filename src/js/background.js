import variable from './variable';
import constant from './constant';
import mark     from './mark';
import API      from './api';

let activeTabId    = 0;
let activeTabUrl   = '';
let activeTabTitle = '';
let bookmarkedURLs = new Set();

const keys = [
  constant.authToken,
  constant.isAuthenticated,
  constant.defaultPrivate,
  constant.defaultReadLater
];

// check token authentication
chrome.storage.sync.get(keys, item => {
  variable.authToken        = String(item[constant.authToken]);
  variable.isAuthenticated  = Boolean(item[constant.isAuthenticated]);
  variable.defaultPrivate   = Boolean(item[constant.defaultPrivate]);
  variable.defaultReadLater = Boolean(item[constant.defaultReadLater]);
});

/**
 * Cache active tab information
 * @param {Number} tabId
 */
function cacheActiveTab(tabId) {
  activeTabId = tabId;
  chrome.tabs.get(tabId, tab => {
    activeTabUrl = tab.url;
    activeTabTitle = tab.title;
    updateIcon(activeTabId, activeTabUrl);
  });
}

/**
 * Check an URL is bookmarkable or not
 **/
function isBookmarkable(url) {
  let protocol = new URL(url).protocol;
  if (protocol === 'http:') {
    return true;
  } else if (protocol === 'https:') {
    return true;
  }
  return false;
}

/**
 * Check an URL is bookmarked or not
 **/
function isBookmarked(url) {
  return new Promise((resolve, reject) => {
    API.getPost(url).then(data => {
      if (data.posts.length !== 0) {
        resolve();
      } else {
        reject();
      }
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

/**
 * Check an URL is already bookmarked or not
 * @param {Number} tabId
 * @param {String} url
 */
function updateIcon(tabId, url) {
  // if schema is chrome related
  if (!isBookmarkable(url)) {
    setIcon(tabId, url, false);
    return;
  }

  // if API token is authenticated
  if (variable.isAuthenticated) {
    // set background
    chrome.browserAction.setBadgeBackgroundColor({
      color : '#66cc33'
    });

    if (bookmarkedURLs.has(url)) {
      chrome.browserAction.setBadgeText({
        text  : mark.bookmarked,
        tabId : tabId
      });
      return;
    }

    isBookmarked(url).then(() => {
      bookmarkedURLs.add(url);
      chrome.browserAction.setBadgeText({
        text  : mark.bookmarked,
        tabId : tabId
      });
    }).catch(() => {
      bookmarkedURLs.delete(url);
      chrome.browserAction.setBadgeText({
        text  : mark.notYet,
        tabId : tabId
      });
    });
  }
}

/**
 * Set extension icon checked or not
 * @param {Number} tabId
 * @param {String} url
 * @param {Boolean} isChecked
 */
function setIcon(tabId, url, isChecked) {
  // if schema is chrome related
  if (!isBookmarkable(url)) {
    chrome.browserAction.setBadgeText({
      text  : mark.notYet,
      tabId : tabId
    });
    return;
  }

  // if API token is authenticated
  if (variable.isAuthenticated) {
    // set background
    chrome.browserAction.setBadgeBackgroundColor({
      color : '#66cc33'
    });

    // set icon checked
    chrome.browserAction.setBadgeText({
      text  : isChecked ? mark.bookmarked : mark.notYet,
      tabId : tabId
    });
  }
}

// when the active tab is changed
chrome.tabs.onActivated.addListener(activeInfo => {
  cacheActiveTab(activeInfo.tabId);
});

// when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.highlighted) {
    cacheActiveTab(tabId);
  }
});

// when current window is switched
chrome.windows.onFocusChanged.addListener(() => {
  chrome.windows.getCurrent({
    populate : true
  }, window => {
    if (window && Array.isArray(window.tabs)) {
      for (let tab of window.tabs) {
        if (tab.highlighted) {
          cacheActiveTab(tab.id);
        }
      }
    }
  });
});

// when received message,
// return the url and title of active tab
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.isBookmarked) {
    bookmarkedURLs.add(activeTabUrl);
  } else {
    bookmarkedURLs.delete(activeTabUrl);
  }

  if (message.useStrict) {
    updateIcon(activeTabId, activeTabUrl);
  } else {
    setIcon(activeTabId, activeTabUrl, !!message.isBookmarked);
  }

  sendResponse({
    url   : activeTabUrl,
    title : activeTabTitle
  });
});

chrome.commands.onCommand.addListener(command => {
  if (command === 'direct-bookmark') {
    API.addPost(
      activeTabUrl,
      activeTabTitle,
      '',
      '',
      variable.defaultPrivate ? 'no' : 'yes',
      variable.defaultReadLater ? 'yes' : 'no'
    ).then(data => {
      if (data.result_code === 'done') {
        bookmarkedURLs.add(activeTabUrl);
        setIcon(activeTabId, activeTabUrl, true);
      } else {
        bookmarkedURLs.delete(activeTabUrl);
        setIcon(activeTabId, activeTabUrl, false);
      }
    }).catch(error => {
      bookmarkedURLs.delete(activeTabUrl);
      setIcon(activeTabId, activeTabUrl, false);
      console.error(error);
    });
  }
});

// launch options.html on installation
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url : 'html/options.html'
    });
  }
});

// add open pinboard to browser action right click menu
chrome.contextMenus.create({
  title    : 'Open Pinboard',
  id       : 'Open Pinboard',
  contexts : ['browser_action'],
});

chrome.contextMenus.onClicked.addListener(({menuItemId}) => {
  if (menuItemId == 'Open Pinboard') {
    chrome.tabs.create({url : 'https://pinboard.in/'});
  }
});
