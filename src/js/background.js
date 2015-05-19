'use strict';

import variable from './variable';
import constant from './constant';
import API      from './api';

let activeTabId    = 0;
let activeTabUrl   = '';
let activeTabTitle = '';

const keys = [
  constant.authToken,
  constant.isAuthenticated,
  constant.defaultPrivate,
  constant.defaultReadLater
];

// check token authentication
chrome.storage.sync.get(keys, (item) => {
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
  chrome.tabs.get(tabId, (tab) => {
    activeTabUrl = tab.url;
    activeTabTitle = tab.title;
    updateIcon(activeTabId, activeTabUrl);
  });
}

const notAvailableSchemes = [
  'chrome://',
  'chrome-extension://',
  'file://'
];

function isBookmarkable(url) {
  return notAvailableSchemes.every((scheme) => {
    return url.indexOf(scheme) === -1;
  });
}

/**
 * Check URL is already bookmarked or not
 * @param {Number} tabId
 * @param {String} checkURL
 */
function updateIcon(tabId, checkURL) {

  let isNotBookmarkable = !isBookmarkable(checkURL);

  // if schema is chrome related
  if (isNotBookmarkable) {
    chrome.browserAction.setBadgeText({
      text  : '',
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

    // request
    API.getPost(checkURL).then((data) => {
      chrome.browserAction.setBadgeText({
        text  : (data.posts.length !== 0) ? '●' : '',
        tabId : tabId
      });
    }).catch((error) => {
      chrome.browserAction.setBadgeText({
        text  : '',
        tabId : tabId
      });
      console.error(error);
    });
  }
}

/**
 * Set extension icon checked or not
 * @param {Number} tabId
 * @param {String} checkURL
 * @param {Bookean} isChecked
 */
function setIcon(tabId, checkURL, isChecked) {

  let isNotBookmarkable = !isBookmarkable(checkURL);

  // if schema is chrome related
  if (isNotBookmarkable) {
    chrome.browserAction.setBadgeText({
      text  : '',
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
      text  : isChecked ? '●' : '',
      tabId : tabId
    });
  }
}

// when the active tab is changed
chrome.tabs.onActivated.addListener((activeInfo) => {
  cacheActiveTab(activeInfo.tabId);
});

// when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.highlighted) {
    cacheActiveTab(tabId);
  }
});

// when current window is switched
chrome.windows.onFocusChanged.addListener((windowId) => {

  console.debug(`windowId: ${windowId}`);

  chrome.windows.getCurrent({
    populate : true
  }, (window) => {
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

chrome.commands.onCommand.addListener((command) => {
  if (command === 'direct-bookmark') {
    API.addPost(
      activeTabUrl,
      activeTabTitle,
      '',
      '',
      variable.defaultPrivate ? 'no' : 'yes',
      variable.defaultReadLater ? 'yes' : 'no'
    ).then((data) => {
      if (data.result_code !== 'done') {
        setIcon(activeTabId, activeTabUrl, false);
      } else {
        setIcon(activeTabId, activeTabUrl, true);
      }
    }).catch((error) => {
      setIcon(activeTabId, activeTabUrl, false);
      console.error(error);
    });
  }
});

// launch options.html on installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url : '/html/options.html'
    });
  }
});
