$(function() {
  
  var $input = $("#js-input");
  var $button = $("#js-button");
  var $alert = $("#js-alert");
  var chromeStorage = chrome.storage.sync;
  
  // chrome storage key
  var storageKey = {
    APIToken: "pinput_APIToken",
    isAuthenticated: "pinput_isAuthenticated"
  };
  
  // authentication result message
  var resultMessage = {
    isBlank: "Please input token and try to save.",
    succeed: "API token is successfully authenticated!",
    changed: "API token is not authenticated...",
    failed: "API token authentication is failed..."
  };

  // check set API token is authenticated
  chromeStorage.get(storageKey.APIToken, function(items) {

    // get saved(?) token
    var token;
    if (items.hasOwnProperty(storageKey.APIToken)) {
      token = items[storageKey.APIToken];
    } else {
      token = "";
    }

    if (token.length !== 0) {

      // if the saved token is not blank
      var url = "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token;
      $.getJSON(url).done(function(data) {
        $alert.removeClass("alert-info alert-warning alert-danger");
        $alert.html(resultMessage.succeed).addClass("alert-success");
      }).fail(function(error) {
        $alert.removeClass("alert-info alert-warning alert-success");
        $alert.html(resultMessage.failed).addClass("alert-danger");
      });

    } else {

      $alert.removeClass("alert-danger alert-warning alert-success");
      $alert.html(resultMessage.isBlank).addClass("alert-info");

    }
    
    // set into form
    $input.val(token);
  });

  // if input value is changed, update message
  $input.on("change", function(e) {
    $alert.removeClass("alert-info alert-success alert-danger");
    $alert.html(resultMessage.changed).addClass("alert-warning");
  });
  
  // if the save button is clicked
  $button.on("click", function(e) {
    
    // get put value
    var token = $input.val();
    var storageData = {};
    storageData[storageKey.APIToken] = token;

    // save put value as token to chrome storage
    chromeStorage.set(storageData, function() {

      if (token.length !== 0) {

        // if the saved token is not blank
        var url = "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token;
        $.getJSON(url).done(function(data) {
          // update as token is authenticated
          storageData[storageKey.isAuthenticated] = 1;
          chromeStorage.set(storageData, function() {
            $alert.removeClass("alert-info alert-warning alert-danger");
            $alert.html(resultMessage.succeed).addClass("alert-success");
          });
        }).fail(function(error) {
          // update as token is not authenticated
          storageData[storageKey.isAuthenticated] = 0;
          chromeStorage.set(storageData, function() {
            $alert.removeClass("alert-info alert-warning alert-success");
            $alert.html(resultMessage.failed).addClass("alert-danger");
          });
        });

      } else {

        // update as token is not authenticated
        storageData[storageKey.isAuthenticated] = 0;
        chromeStorage.set(storageData, function() {
          $alert.removeClass("alert-danger alert-warning alert-success");
          $alert.html(resultMessage.isBlank).addClass("alert-info");
        });

      }

    });
  });
});