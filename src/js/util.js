'use strict';

export default {
  /**
   * Split string with whitespace
   * @param {String} val
   * @returns {String}
   */
  split : function(val = '') {
    return val.split(/ \s*/);
  },
  /**
   * Extract last
   * @param {String} term
   * @returns {String}
   */
  extractLast : function(term) {
    return this.split(term).pop();
  },
  /**
   * Serialize object to array
   * @param {Object} param
   * @returns {Array}
   */
  serializeArray : function(param = {}) {

    let array = [];
    let keys  = Object.keys(param);

    for (let key of keys) {
      array.push(key + '=' + param[key]);
    }

    return array;
  },
  /**
   * Serialize object to string
   * @param {Object} param
   * @returns {String}
   */
  serialize : function(param) {
    return this.serializeArray(param).join('&');
  }
};
