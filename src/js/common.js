var Pinput = Pinput || {};

Pinput.authToken = '';

Pinput.Util = {
  /**
   * Split string with whitespace
   * @param {String} val
   * @returns {String}
   */
  split: function(val) {
    return val.split(/ \s*/);
  },
  /**
   * Extract last
   * @param {String} term
   * @returns {String}
   */
  extractLast: function(term) {
    return this.split(term).pop();
  },
  /**
   * Serialize object to array
   * @param {Object} param
   * @returns {Array}
   */
  serializeArray: function(param) {
    // array to return
    var array = [];
    // fix argument
    param = param || {};

    Object.keys(param).forEach(function(key) {
      array.push(key + "=" + param[key]);
    });
    return array;
  }
};

Pinput.StorageKey = {
  APIToken: "pinput_APIToken",
  isAuthenticated: "pinput_isAuthenticated"
};

Pinput.API = {
  addPost: function(url, title, description, tags, shared, toread) {
    var params = Pinput.Util.serializeArray({
      format: "json",
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
  getPost: function(url) {
    var params = Pinput.Util.serializeArray({
      format: "json",
      auth_token: Pinput.authToken,
      url: url ? encodeURIComponent(url) : '',
      _: Date.now()
    });
    // all of API is get method
    return $.getJSON('https://api.pinboard.in/v1/posts/get?' + params.join('&'));
  },
  suggestPost: function(url) {
    var params = Pinput.Util.serializeArray({
      format: "json",
      auth_token: Pinput.authToken,
      url: encodeURIComponent(url),
      _: Date.now()
    });
    // all of API is get method
    return $.getJSON('https://api.pinboard.in/v1/posts/suggest?' + params.join('&'));
  },
  getTags: function() {
    var params = Pinput.Util.serializeArray({
      format: "json",
      auth_token: Pinput.authToken,
      _: Date.now()
    });
    return $.getJSON('https://api.pinboard.in/v1/tags/get?' + params.join('&'));
  }
};