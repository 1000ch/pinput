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
    bookmarked: "This URL is already bookmarked.",
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

      if(item[storageKey.isAuthenticated]) {
        
        var params = [];
        params.push("format=json");
        params.push("auth_token=" + token);
        params.push("url=" + response.url);

        var url = "https://api.pinboard.in/v1/posts/suggest?" + params.join("&");

        $.getJSON(url).done(function(array) {
          array.forEach(function(data) {
            if(Array.isArray(data.recommended)) {
              $tags.val(data.recommended.join(" "));
            }
          });
        });
        
        url = "https://api.pinboard.in/v1/posts/get?" + params.join("&");
        $.getJSON(url).done(function(data) {
          if(data.posts.length !== 0) {
            $alert.removeClass("alert-info alert-success alert-danger");
            $alert.html(resultMessage.bookmarked).addClass("alert-warning");
          }
        });

        $bookmark.on("click", function(e) {
          
          e.preventDefault();

          var params = [];
          params.push("format=json");
          params.push("auth_token=" + token);
          params.push("url=" + encodeURIComponent($url.val()));
          params.push("description=" + encodeURIComponent($title.val()));
          params.push("extended=" + encodeURIComponent($description.val()));
          params.push("tags=" + encodeURIComponent($tags.val()));
          params.push("private=" + $private.prop("checked"));
          params.push("toread=" + $readlater.prop("checked"));
          params.push("_=" + Date.now());
          
          var url = "https://api.pinboard.in/v1/posts/add?" + params.join("&");
 
          $.getJSON(url).done(function(data) {
            if(data.result_code !== "done") {
              $alert.removeClass("alert-info alert-warning alert-success");
              $alert.html(data.result_code).addClass("alert-danger");
            } else {
              $alert.removeClass("alert-info alert-warning alert-danger");
              $alert.html(resultMessage.succeed).addClass("alert-success");
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