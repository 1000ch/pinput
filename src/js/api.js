import variable from './variable';
import constant from './constant';
import util     from './util';

export default {

  /**
   * Sync auth status
   * @returns {Promise}
   */
  syncAuthStatus: function () {

    return new Promise((resolve, reject) => {

      if (variable.authToken === '' || !variable.isAuthenticated) {

        const keys = [
          constant.authToken,
          constant.isAuthenticated
        ];

        chrome.storage.sync.get(keys, (item) => {

          variable.authToken       = item[constant.authToken];
          variable.isAuthenticated = !!item[constant.isAuthenticated];
          
          if (variable.authToken === '' || !variable.isAuthenticated) {
            reject(new Error('API Token is not authenticated.'));
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  },
  /**
   * Check API Token
   * @returns {Promise}
   */
  checkToken: function () {
    
    return new Promise((resolve, reject) => {

      let queryString = util.serialize({
        format    : 'json',
        auth_token: variable.authToken,
        url       : '',
        _         : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/posts/get?${queryString}`)
        .then((response) => response.json())
        .then((data) => resolve())
        .catch((error) => reject(error));
    });
  },
  /**
   * Add a bookmark.
   * @see https://pinboard.in/api#posts_add
   * @param {String} url [required]
   * @param {String} title [required]
   * @param {String} description
   * @param {String} tags
   * @param {String} shared
   * @param {String} toread
   * @returns {Promise}
   */
  addPost: function (url, title, description, tags, shared, toread) {

    return this.syncAuthStatus().then(() => {

      let queryString = util.serialize({
        format     : 'json',
        auth_token : variable.authToken,
        url        : encodeURIComponent(url),
        description: encodeURIComponent(title),
        extended   : encodeURIComponent(description),
        tags       : encodeURIComponent(tags),
        shared     : shared,
        toread     : toread,
        _          : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/posts/add?${queryString}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  },
  /**
   * Delete a bookmark.
   * @see https://pinboard.in/api#posts_delete
   * @param {String} url
   * @returns {Promise}
   */
  deletePost: function (url) {

    return this.syncAuthStatus().then(() => {

      let queryString = util.serialize({
        format    : 'json',
        auth_token: variable.authToken,
        url       : encodeURIComponent(url),
        _         : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/posts/delete?${queryString}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  },
  /**
   * Returns one or more posts on a single day matching the arguments.
   * If no date or url is given, date of most recent bookmark will be used.
   * @see https://pinboard.in/api#posts_get
   * @param {String} url
   * @returns {Promise}
   */
  getPost: function (url) {

    // synchronize authentication status
    return this.syncAuthStatus().then(() => {

      let queryString = util.serialize({
        format    : 'json',
        auth_token: variable.authToken,
        url       : url ? encodeURIComponent(url) : '',
        _         : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/posts/get?${queryString}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  },
  /**
   * Returns a list of popular tags and recommended tags for a given URL.
   * Popular tags are tags used site-wide for the url;
   * recommended tags are drawn from the user's own tags.
   * @see https://pinboard.in/api#posts_suggest
   * @param {String} url
   * @returns {Promise}
   */
  suggestPost: function (url) {

    return this.syncAuthStatus().then(() => {

      let queryString = util.serialize({
        format    : 'json',
        auth_token: variable.authToken,
        url       : encodeURIComponent(url),
        _         : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/posts/suggest?${queryString}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  },
  /**
   * Returns a full list of the user's tags along with the number of times they were used.
   * @see https://pinboard.in/api#tags_get
   * @returns {Promise}
   */
  getTags: function () {

    return this.syncAuthStatus().then(() => {

      let queryString = util.serialize({
        format    : 'json',
        auth_token: variable.authToken,
        _         : Date.now()
      });

      return fetch(`https://api.pinboard.in/v1/tags/get?${queryString}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
    });
  }
};