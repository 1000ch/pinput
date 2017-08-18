import * as qs from 'querystring';
import * as util from './util';

/**
 * Check API Token
 * @param {String} authToken
 * @returns {Promise}
 */
export async function checkToken(authToken) {
  const requestURL = `https://api.pinboard.in/v1/posts/get?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    url          : '',
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
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
export async function addPost(url, title, description, tags, shared, toread, authToken) {
  const requestURL = `https://api.pinboard.in/v1/posts/add?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    url          : url,
    description  : title,
    extended     : description,
    tags         : tags,
    shared       : shared,
    toread       : toread,
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
}

/**
 * Delete a bookmark.
 * @see https://pinboard.in/api#posts_delete
 * @param {String} url
 * @param {String} authToken
 * @returns {Promise}
 */
export async function deletePost(url, authToken) {
  const requestURL = `https://api.pinboard.in/v1/posts/delete?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    url          : url,
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
}

/**
 * Returns one or more posts on a single day matching the arguments.
 * If no date or url is given, date of most recent bookmark will be used.
 * @see https://pinboard.in/api#posts_get
 * @param {String} url
 * @param {String} authToken
 * @returns {Promise}
 */
export async function getPost(url, authToken) {
  const requestURL = `https://api.pinboard.in/v1/posts/get?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    url          : url,
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
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
export async function suggestPost(url, authToken) {
  const requestURL = `https://api.pinboard.in/v1/posts/suggest?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    url          : url,
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
}

/**
 * Returns a full list of the user's tags along with the number of times they were used.
 * @see https://pinboard.in/api#tags_get
 * @param {String} authToken
 * @returns {Promise}
 */
export async function getTags(authToken) {
  const requestURL = `https://api.pinboard.in/v1/tags/get?${qs.stringify({
    format       : 'json',
    'auth_token' : authToken,
    _            : Date.now()
  })}`;

  const response = await fetch(requestURL);
  const json = await response.json();

  return json;
}
