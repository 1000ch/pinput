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
 * Serialize object to array
 * @param {Object} param
 * @returns {Array}
 */
export function serializeArray(param = {}) {
  let array = [];
  let keys  = Object.keys(param);

  for (let key of keys) {
    array.push(`${key}=${param[key]}`);
  }

  return array;
}

/**
 * Serialize object to string
 * @param {Object} param
 * @returns {String}
 */
export function serialize(param) {
  return serializeArray(param).join('&');
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
