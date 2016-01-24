import * as constant from './constant';
import * as util from './util';

/**
 * Check API Token
 * @param {String} authToken
 * @returns {Promise}
 */
export function checkToken(authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    url          : '',
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/posts/get?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}

/**
 * Add a bookmark.
 * @see https://pinboard.in/api#posts_add
 * @param {String} url [required]
 * @param {String} title [required]
 * @param {String} description
 * @param {String} tags
 * @param {String} shared
 * @param {String} toread
 * @param {String} authToken
 * @returns {Promise}
 */
export function addPost(url, title, description, tags, shared, toread, authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    url          : encodeURIComponent(url),
    description  : encodeURIComponent(title),
    extended     : encodeURIComponent(description),
    tags         : encodeURIComponent(tags),
    shared       : shared,
    toread       : toread,
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/posts/add?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}

/**
 * Delete a bookmark.
 * @see https://pinboard.in/api#posts_delete
 * @param {String} url
 * @param {String} authToken
 * @returns {Promise}
 */
export function deletePost(url, authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    url          : encodeURIComponent(url),
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/posts/delete?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}

/**
 * Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 * @see https://pinboard.in/api#posts_get
 * @param {String} url
 * @param {String} authToken
 * @returns {Promise}
 */
export function getPost(url, authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    url          : encodeURIComponent(url),
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/posts/get?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}

/**
 * Returns a list of popular tags and recommended tags for a given URL.
 * Popular tags are tags used site-wide for the url;
 * recommended tags are drawn from the user's own tags.
 * @see https://pinboard.in/api#posts_suggest
 * @param {String} url [required]
 * @param {String} authToken
 * @returns {Promise}
 */
export function suggestPost(url, authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    url          : encodeURIComponent(url),
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/posts/suggest?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}

/**
 * Returns a full list of the user's tags along with the number of times they were used.
 * @see https://pinboard.in/api#tags_get
 * @param {String} authToken
 * @returns {Promise}
 */
export function getTags(authToken) {
  let queryString = util.serialize({
    format       : 'json',
    'auth_token' : authToken,
    _            : Date.now()
  });
  let requestURL = `https://api.pinboard.in/v1/tags/get?${queryString}`;

  return fetch(requestURL).then(response => response.json());
}
