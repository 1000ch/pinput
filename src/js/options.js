(function(global) {

  // common namespace
  var Pinput = global.Pinput || {};
  // options page namespace
  var Options = Pinput.Options || {};

  // authentication result message
  Options.Message = {
    isBlank: "Please input token and try to save.",
    succeed: "API token is successfully authenticated!",
    changed: "API token is not authenticated...",
    failed: "API token authentication is failed..."
  };

  $(function() {
    
    var $input = $("#js-input");
    var $button = $("#js-button");
    var $alert = $("#js-alert");
    var chromeStorage = chrome.storage.sync;
    
    // check set API token is authenticated
    chromeStorage.get(Pinput.StorageKey.APIToken, function(items) {
  
      // get saved(?) token
      if (items.hasOwnProperty(Pinput.StorageKey.APIToken)) {
        Pinput.authToken = items[Pinput.StorageKey.APIToken];
      } else {
        Pinput.authToken = '';
      }
  
      if (Pinput.authToken.length !== 0) {
        // if the saved token is not blank
        Pinput.API.getPost().done(function(data) {
          $alert.removeClass("alert-info alert-warning alert-danger");
          $alert.html(Options.Message.succeed).addClass("alert-success");
          Pinput.isAuthenticated = true;
        }).fail(function(error) {
          $alert.removeClass("alert-info alert-warning alert-success");
          $alert.html(Options.Message.failed).addClass("alert-danger");
          Pinput.isAuthenticated = false;
        });
      } else {
        $alert.removeClass("alert-danger alert-warning alert-success");
        $alert.html(Options.Message.isBlank).addClass("alert-info");
        Pinput.isAuthenticated = false;
      }
      
      // set into form
      $input.val(Pinput.authToken);
    });
  
    // if input value is changed, update message
    $input.on("change", function(e) {
      $alert.removeClass("alert-info alert-success alert-danger");
      $alert.html(Options.Message.changed).addClass("alert-warning");
    });
    
    // if the save button is clicked
    $button.on("click", function(e) {
      
      // get put value
      var token = $input.val();
      var storageData = {};
      storageData[Pinput.StorageKey.APIToken] = token;
  
      // save put value as token to chrome storage
      chromeStorage.set(storageData, function() {
        if (token.length !== 0) {
          Pinput.API.getPost().done(function(data) {
            // update as token is authenticated
            storageData[Pinput.StorageKey.isAuthenticated] = 1;
            chromeStorage.set(storageData, function() {
              $alert.removeClass("alert-info alert-warning alert-danger");
              $alert.html(Options.Message.succeed).addClass("alert-success");
            });
          }).fail(function(error) {
            // update as token is not authenticated
            storageData[Pinput.StorageKey.isAuthenticated] = 0;
            chromeStorage.set(storageData, function() {
              $alert.removeClass("alert-info alert-warning alert-success");
              $alert.html(Options.Message.failed).addClass("alert-danger");
            });
          });
        } else {
          // update as token is not authenticated
          storageData[Pinput.StorageKey.isAuthenticated] = 0;
          chromeStorage.set(storageData, function() {
            $alert.removeClass("alert-danger alert-warning alert-success");
            $alert.html(Options.Message.isBlank).addClass("alert-info");
          });
        }
      });
    });
  });

})(this);