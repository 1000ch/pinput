(function (global) {

  var Pinput = global.Pinput || {};
  
  Pinput.authToken = '';
  Pinput.isAuthenticated = false;
  
  Pinput.Util = {
    syncAuthStatus: function () {
      if (Pinput.authToken === '' || !Pinput.isAuthenticated) {
        // check token authentication
        chrome.storage.sync.get([Pinput.StorageKey.authToken, Pinput.StorageKey.isAuthenticated], function (item) {
          Pinput.authToken = item[Pinput.StorageKey.authToken];
          Pinput.isAuthenticated = !!item[Pinput.StorageKey.isAuthenticated];
        });
      }
    },
    /**
     * Split string with whitespace
     * @param {String} val
     * @returns {String}
     */
    split: function (val) {
      return val.split(/ \s*/);
    },
    /**
     * Extract last
     * @param {String} term
     * @returns {String}
     */
    extractLast: function (term) {
      return this.split(term).pop();
    },
    /**
     * Serialize object to array
     * @param {Object} param
     * @returns {Array}
     */
    serializeArray: function (param) {
      // array to return
      var array = [];
      // fix argument
      param = param || {};
  
      Object.keys(param).forEach(function (key) {
        array.push(key + '=' + param[key]);
      });
      return array;
    }
  };

  Pinput.StorageKey = {
    authToken: 'pinput_authToken',
    isAuthenticated: 'pinput_isAuthenticated',
    useTagSuggestion: 'pinput_useTagSuggestion'
  };
  
  Pinput.API = {
    /**
     * Add a bookmark.
     * @see https://pinboard.in/api#posts_add
     * @param {String} url [required]
     * @param {String} title [required]
     * @param {String} description
     * @param {String} tags
     * @param {String} shared
     * @param {String} toread
     * @returns {$.Deferred}
     */
    addPost: function (url, title, description, tags, shared, toread) {
      
      // synchronize authentication status
      Pinput.Util.syncAuthStatus();

      var params = Pinput.Util.serializeArray({
        format: 'json',
        auth_token: Pinput.authToken,
        url: encodeURIComponent(url),
        description: encodeURIComponent(title),
        extended: encodeURIComponent(description),
        tags: encodeURIComponent(tags),
        shared: shared,
        toread: toread,
        _: Date.now()
      });
      // all of API is get method
      return $.getJSON('https://api.pinboard.in/v1/posts/add?' + params.join('&'));
    },
    /**
     * Delete a bookmark.
     * @see https://pinboard.in/api#posts_delete
     * @param {String} url
     * @returns {$.Deferred}
     */
    deletePost: function (url) {

      // synchronize authentication status
      Pinput.Util.syncAuthStatus();

      var params = Pinput.Util.serializeArray({
        format: 'json',
        auth_token: Pinput.authToken,
        url: encodeURIComponent(url),
        _: Date.now()
      });
      // all of API is get method
      return $.getJSON('https://api.pinboard.in/v1/posts/delete?' + params.join('&'));
    },
    /**
     * Returns one or more posts on a single day matching the arguments.
     * If no date or url is given, date of most recent bookmark will be used.
     * @see https://pinboard.in/api#posts_get
     * @param {String} url
     * @returns {$.Deferred}
     */
    getPost: function (url) {

      // synchronize authentication status
      Pinput.Util.syncAuthStatus();

      var params = Pinput.Util.serializeArray({
        format: 'json',
        auth_token: Pinput.authToken,
        url: url ? encodeURIComponent(url) : '',
        _: Date.now()
      });
      // all of API is get method
      return $.getJSON('https://api.pinboard.in/v1/posts/get?' + params.join('&'));
    },
    /**
     * Returns a list of popular tags and recommended tags for a given URL.
     * Popular tags are tags used site-wide for the url;
     * recommended tags are drawn from the user's own tags.
     * @see https://pinboard.in/api#posts_suggest
     * @param {String} url
     * @returns {$.Deferred}
     */
    suggestPost: function (url) {
      var params = Pinput.Util.serializeArray({
        format: 'json',
        auth_token: Pinput.authToken,
        url: encodeURIComponent(url),
        _: Date.now()
      });
      // all of API is get method
      return $.getJSON('https://api.pinboard.in/v1/posts/suggest?' + params.join('&'));
    },
    /**
     * Returns a full list of the user's tags along with the number of times they were used.
     * @see https://pinboard.in/api#tags_get
     * @returns {$.Deferred}
     */
    getTags: function () {

      // synchronize authentication status
      Pinput.Util.syncAuthStatus();

      var params = Pinput.Util.serializeArray({
        format: 'json',
        auth_token: Pinput.authToken,
        _: Date.now()
      });
      return $.getJSON('https://api.pinboard.in/v1/tags/get?' + params.join('&'));
    }
  };

  // export
  global.Pinput = Pinput;

})(this);