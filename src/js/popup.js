$(function() {

  var token = "";
  var $url = $("#js-url");
  var $title = $("#js-title");
  var $tags = $("#js-tags");
  var $description = $("#js-description");
  var $private = $("#js-private");
  var $readlater = $("#js-readlater");
  var $bookmark = $("#js-bookmark");

  // chrome storage key
  var storageKey = {
    APIToken: "pinput_APIToken",
    isAuthenticated: "pinput_isAuthenticated"
  };

  // when popup is opened, 
  // send blank message to background
  chrome.runtime.sendMessage({}, function(response) {

    $url.val(response.url);
    $title.val(response.title);

    // get Token and check
    chrome.storage.sync.get([storageKey.APIToken, storageKey.isAuthenticated], function(item) {

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

        $bookmark.on("click", function(e) {
          
          e.preventDefault();
          
          var data = {
            format: "json",
            auth_token: token,
            url: $url.val(),
            title: $title.val(),
            description: $description.val(),
            tags: $tags.val(),
            private: $private.prop("checked"),
            toread: $readlater.prop("checked")
          };
          
          $.ajax({
            url: "https://api.pinboard.in/v1/posts/add?auth_token=" + token,
            crossDomain: true,
            data: data,
            dataType: "json",
            type: "post"
          }).done(function(data) {
            console.log("done");
            console.log(data);
          }).fail(function(error) {
            console.log("fail");
            console.log(error);
          });

          //var params = [];
          //params.push("format=json");
          //params.push("auth_token=" + token);
          //params.push("url=" + encodeURIComponent($url.val()));
          //params.push("title=" + encodeURIComponent($title.val()));
          
          //var url = "https://api.pinboard.in/v1/posts/add?" + params.join("&");
          //$.getJSON(url).done(function(data) {
          //  console.log(data);
          //});
        });
      }
    });
  });
});