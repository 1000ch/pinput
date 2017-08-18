import { storageKey, mark } from './constant';
import * as API from './api';
import { getData, isBookmarkable } from './util';

let activeTabId    = 0;
let activeTabUrl   = '';
let activeTabTitle = '';
let bookmarkedURLs = new Set();

let authToken;
let isAuthenticated;
let defaultPrivate;
let defaultReadLater;

// check token authentication
getData([
  storageKey.authToken,
  storageKey.isAuthenticated,
  storageKey.defaultPrivate,
  storageKey.defaultReadLater
]).then(items => {
  authToken        = String(items[storageKey.authToken]);
  isAuthenticated  = Boolean(items[storageKey.isAuthenticated]);
  defaultPrivate   = Boolean(items[storageKey.defaultPrivate]);
  defaultReadLater = Boolean(items[storageKey.defaultReadLater]);
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
 * Check an URL is bookmarked or not
 **/
async function isBookmarked(url) {
  const u = new URL(url);
  const data = await API.getPost(`${u.origin}${u.pathname}`, authToken);

  return data.posts.length !== 0;
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
  if (isAuthenticated) {
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
  if (isAuthenticated) {
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
      defaultPrivate ? 'no' : 'yes',
      defaultReadLater ? 'yes' : 'no',
      authToken
    ).then(data => {
      if (data.result_code === 'done') {
        bookmarkedURLs.add(activeTabUrl);
        setIcon(activeTabId, activeTabUrl, true);
      } else {
        bookmarkedURLs.delete(activeTabUrl);
        setIcon(activeTabId, activeTabUrl, false);
      }
    }).catch(() => {
      bookmarkedURLs.delete(activeTabUrl);
      setIcon(activeTabId, activeTabUrl, false);
    });
  }
});

// launch options.html on installation
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.tabs.create({
      url : '../html/options.html'
    });
  }
});
