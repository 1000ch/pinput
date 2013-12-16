// autofocus attribute is not working on chrome extension :(
// https://code.google.com/p/chromium/issues/detail?id=111660#c7
if(location.search !== "?foo") {
  location.search = "?foo";
  throw new Error();
  // load everything on the next page;
  // stop execution on this page
}

var Pinput = Pinput || {};
var Popup = Pinput.Popup || {};

Popup.Message = {
  isBookmarked: "This URL is already bookmarked.",
  isNotAuthenticated: "API Token is not authenticated.",
  succeed: "Bookmarked successfully!",
  failed: "Bookmark is failed..."
};

$(function() {

  var $form = $("#js-form");
  var $url = $("#js-url");
  var $title = $("#js-title");
  var $tags = $("#js-tags");
  var $description = $("#js-description");
  var $private = $("#js-private");
  var $readlater = $("#js-readlater");
  var $bookmark = $("#js-bookmark");
  var $alert = $("#js-alert");
  var chromeStorage = chrome.storage.sync;

  // when popup is opened,
  // send blank message to background
  chrome.runtime.sendMessage({}, function(response) {
    // get url and title of current tab
    $url.val(response.url);
    $title.val(response.title);
    
    // focus to tag area
    $tags.focus();

    // get Token and check
    chromeStorage.get([Pinput.StorageKey.APIToken, Pinput.StorageKey.isAuthenticated], function(item) {
      // cache token
      Pinput.authToken = item[Pinput.StorageKey.APIToken];

      if(!item[Pinput.StorageKey.isAuthenticated]) {
        // if API token is not authenticated, make me disabled.
        $alert.removeClass("alert-info alert-warning alert-success");
        $alert.html(Popup.Message.isNotAuthenticated).addClass("alert-danger");
        $bookmark.attr("disabled", "disabled");
      } else {
        // check whether url is bookmarked or not
        Pinput.API.getPost(response.url).done(function(data) {
          if(data.posts.length !== 0) {
            // if url is already bookmarked
            $tags.val(data.posts.shift().tags);
            $alert.removeClass("alert-info alert-success alert-danger");
            $alert.html(Popup.Message.isBookmarked).addClass("alert-warning");
          } else {
            // if url is not bookmarked
            Pinput.API.suggestPost(response.url).done(function(array) {
              array.forEach(function(data) {
                if(Array.isArray(data.popular)) {
                  $tags.val(data.popular.join(" "));
                }
              });
            });
          }
        }).always(function() {
          // set up word suggestion
          Pinput.API.getTags().done(function(data) {
            var availableTags = Object.keys(data);
            $tags.bind("keydown", function(event) {
              if(event.keyCode === $.ui.keyCode.TAB && $(this).data("ui-autocomplete").menu.active) {
                event.preventDefault();
              }
            }).autocomplete({
              minLength: 0,
              max: 5,
              autoFocus: true,
              source: function(request, response) {
                // delegate back to autocomplete, but extract the last term
                response($.ui.autocomplete.filter(availableTags, Pinput.Util.extractLast(request.term)).slice(0, 5));
              },
              focus: function() {
                // prevent value inserted on focus
                return false;
              },
              select: function(event, ui) {
                var terms = Pinput.Util.split(this.value);
                // remove the current input
                terms.pop();
                // add the selected item
                terms.push(ui.item.value);
                // add placeholder to get the comma-and-space at the end
                terms.push("");
                this.value = terms.join(" ");
                return false;
              }
            });
          });
        });

        $form.on("submit", function(e) {
          // prevent default
          e.preventDefault();
          
          Pinput.API.addPost({
            url: $url.val(),
            description: $title.val(),
            extended: $description.val(),
            tags: $tags.val(),
            shared: ($private.prop("checked") ? "no" : "yes"),
            toread: ($readlater.prop("checked") ? "yes" : "no")
          }).done(function(data) {
            if(data.result_code !== "done") {
              $alert.removeClass("alert-info alert-warning alert-success");
              $alert.html(data.result_code).addClass("alert-danger");
            } else {
              $alert.removeClass("alert-info alert-warning alert-danger");
              $alert.html(Popup.Message.succeed).addClass("alert-success");

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

        $bookmark.on("click", function(e) {
          // prevent default
          e.preventDefault();

          Pinput.API.addPost({
            url: $url.val(),
            description: $title.val(),
            extended: $description.val(),
            tags: $tags.val(),
            shared: ($private.prop("checked") ? "no" : "yes"),
            toread: ($readlater.prop("checked") ? "yes" : "no")
          }).done(function(data) {
            if(data.result_code !== "done") {
              $alert.removeClass("alert-info alert-warning alert-success");
              $alert.html(data.result_code).addClass("alert-danger");
            } else {
              $alert.removeClass("alert-info alert-warning alert-danger");
              $alert.html(Popup.Message.succeed).addClass("alert-success");

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