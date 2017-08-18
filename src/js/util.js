/**
 * Split string with whitespace
 * @param {String} val
 * @returns {String}
 */
export function split(val = '') {
  return val.split(/ \s*/);
}

/**
 * Extract last
 * @param {String} term
 * @returns {String}
 */
export function extractLast(term) {
  return split(term).pop();
}

/**
 * Check an URL is bookmarkable or not
 **/
export function isBookmarkable(url) {
  let protocol = new URL(url).protocol;
  if (protocol === 'http:') {
    return true;
  } else if (protocol === 'https:') {
    return true;
  }
  return false;
}

export function getData(keys) {
  return new Promise(resolve => {
    chrome.storage.sync.get(keys, resolve);
  });
}

export function setData(data) {
  return new Promise(resolve => {
    chrome.storage.sync.set(data, resolve);
  });
}
