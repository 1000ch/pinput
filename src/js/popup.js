$(function() {

  var token = "";
  var $url = $("#js-url");
  var $title = $("#js-title");
  var $tags = $("#js-tags");
  var $description = $("#js-description");
  var $private = $("#js-private");
  var $readlater = $("#js-readlater");
  var $bookmark = $("#js-bookmark");
  var $alert = $("#js-alert");
  var chromeStorage = chrome.storage.sync;

  // chrome storage key
  var storageKey = {
    APIToken: "pinput_APIToken",
    isAuthenticated: "pinput_isAuthenticated"
  };

  // add result message
  var resultMessage = {
    isBookmarked: "This URL is already bookmarked.",
    isNotAuthenticated: "API Token is not authenticated.",
    succeed: "Bookmarked successfully!",
    failed: "Bookmark is failed..."
  };

  // when popup is opened, 
  // send blank message to background
  chrome.runtime.sendMessage({}, function(response) {

    $url.val(response.url);
    $title.val(response.title);

    // get Token and check
    chromeStorage.get([storageKey.APIToken, storageKey.isAuthenticated], function(item) {

      token = item[storageKey.APIToken];

      if(!item[storageKey.isAuthenticated]) {

        // if API token is not authenticated, make me disabled.
        $alert.removeClass("alert-info alert-warning alert-success");
        $alert.html(resultMessage.isNotAuthenticated).addClass("alert-danger");
        $bookmark.attr("disabled", "disabled");
        
      } else {
        
        // create parameters
        var params = [];
        params.push("format=json");
        params.push("auth_token=" + token);
        params.push("url=" + response.url);
        params.push("_=" + Date.now());

        // check whether url is bookmarked or not
        var $jqxhrGet = $.getJSON("https://api.pinboard.in/v1/posts/get?" + params.join("&"));
        $jqxhrGet.done(function(data) {
          if(data.posts.length !== 0) {
            // if url is already bookmarked
            $tags.val(data.posts[0].tags);
            $alert.removeClass("alert-info alert-success alert-danger");
            $alert.html(resultMessage.isBookmarked).addClass("alert-warning");
          } else {
            // if url is not bookmarked
            var $jqxhrSuggest = $.getJSON("https://api.pinboard.in/v1/posts/suggest?" + params.join("&"));
            $jqxhrSuggest.done(function(array) {
              array.forEach(function(data) {
                if(Array.isArray(data.popular)) {
                  $tags.val(data.popular.join(" "));
                }
              });
            });
          }
        }).always(function() {
          // set up word suggestion
          $.getJSON("https://api.pinboard.in/v1/tags/get?format=json&auth_token=" + token).done(function(data) {
            $tags.typeahead({
              name: "tags",
              local: Object.keys(data)
            });
          });
        });

        $bookmark.on("click", function(e) {
          
          // prevent default
          e.preventDefault();

          // create query string
          var params = [];
          params.push("format=json");
          params.push("auth_token=" + token);
          params.push("url=" + encodeURIComponent($url.val()));
          params.push("description=" + encodeURIComponent($title.val()));
          params.push("extended=" + encodeURIComponent($description.val()));
          params.push("tags=" + encodeURIComponent($tags.val()));
          params.push("shared=" + ($private.prop("checked") ? "no" : "yes"));
          params.push("toread=" + ($readlater.prop("checked") ? "yes" : "no"));
          params.push("_=" + Date.now());
 
          var $jqxhrAdd = $.getJSON("https://api.pinboard.in/v1/posts/add?" + params.join("&"));
          $jqxhrAdd.done(function(data) {
            if(data.result_code !== "done") {
              $alert.removeClass("alert-info alert-warning alert-success");
              $alert.html(data.result_code).addClass("alert-danger");
            } else {
              $alert.removeClass("alert-info alert-warning alert-danger");
              $alert.html(resultMessage.succeed).addClass("alert-success");

              // close popup window
              window.setTimeout(function() {
                window.close();
              }, 500);
            }
          }).fail(function(error) {
            $alert.removeClass("alert-info alert-warning alert-success");
            $alert.html(error).addClass("alert-danger");
          });
        });
      }
    });
  });
});