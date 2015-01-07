(function (global) {

  // common namespace
  var Pinput = global.Pinput || {};
  // options page namespace
  var Options = Pinput.Options || {};

  // authentication result message
  Options.Message = {
    isBlank: 'Please input token and try to save.',
    succeed: 'API token is successfully authenticated!',
    changed: 'API token is not authenticated...',
    failed: 'API token authentication is failed...'
  };

  $(function () {
    
    var $input = $('#js-input');
    var $button = $('#js-button');
    var $alert = $('#js-alert');
    var $checkboxPrivate = $('#js-checkbox-private');
    var $checkboxReadLater = $('#js-checkbox-readlater');
    var $checkboxTagSuggestion = $('#js-checkbox-tagsuggestion');
    var chromeStorage = chrome.storage.sync;
    
    var keys = [
      Pinput.StorageKey.authToken,
      Pinput.StorageKey.defaultPrivate,
      Pinput.StorageKey.defaultReadLater,
      Pinput.StorageKey.useTagSuggestion
    ];
    // check set API token is authenticated
    chromeStorage.get(keys, function (items) {
  
      // get saved(?) token
      if (items.hasOwnProperty(Pinput.StorageKey.authToken)) {
        Pinput.authToken = items[Pinput.StorageKey.authToken];
      } else {
        Pinput.authToken = '';
      }

      if (items.hasOwnProperty(Pinput.StorageKey.defaultPrivate)) {
        Pinput.defaultPrivate = !!items[Pinput.StorageKey.defaultPrivate];
      } else {
        Pinput.defaultPrivate = false;
      }
      if (items.hasOwnProperty(Pinput.StorageKey.defaultReadLater)) {
        Pinput.defaultReadLater = !!items[Pinput.StorageKey.defaultReadLater];
      } else {
        Pinput.defaultReadLater = false;
      }
      if (items.hasOwnProperty(Pinput.StorageKey.useTagSuggestion)) {
        Pinput.useTagSuggestion = !!items[Pinput.StorageKey.useTagSuggestion];
      } else {
        Pinput.useTagSuggestion = false;
      }
      $checkboxPrivate.prop('checked', Pinput.defaultPrivate);
      $checkboxReadLater.prop('checked', Pinput.defaultReadLater);
      $checkboxTagSuggestion.prop('checked', Pinput.useTagSuggestion);
  
      if (Pinput.authToken.length !== 0) {
        // if the saved token is not blank
        Pinput.API.getPost().done(function (data) {
          $alert.removeClass('alert-info alert-warning alert-danger');
          $alert.html(Options.Message.succeed).addClass('alert-success');
          Pinput.isAuthenticated = true;
        }).fail(function (error) {
          $alert.removeClass('alert-info alert-warning alert-success');
          $alert.html(Options.Message.failed).addClass('alert-danger');
          Pinput.isAuthenticated = false;
        });
      } else {
        $alert.removeClass('alert-danger alert-warning alert-success');
        $alert.html(Options.Message.isBlank).addClass('alert-info');
        Pinput.isAuthenticated = false;
      }
      
      // set into form
      $input.val(Pinput.authToken);
    });
  
    // if input value is changed, update message
    $input.on('change', function (e) {
      $alert.removeClass('alert-info alert-success alert-danger');
      $alert.html(Options.Message.changed).addClass('alert-warning');
    });

    $checkboxPrivate.on('change', function (e) {

      // get checked or not
      Pinput.defaultPrivate = $checkboxPrivate.prop('checked');
      var storageData = {};
      storageData[Pinput.StorageKey.defaultPrivate] = Pinput.defaultPrivate;

      // save checked value to chrome storage
      chromeStorage.set(storageData, function () {});
    });

    $checkboxReadLater.on('change', function (e) {

      // get checked or not
      Pinput.defaultReadLater = $checkboxReadLater.prop('checked');
      var storageData = {};
      storageData[Pinput.StorageKey.defaultReadLater] = Pinput.defaultReadLater;

      // save checked value to chrome storage
      chromeStorage.set(storageData, function () {});
    });

    $checkboxTagSuggestion.on('change', function (e) {
      
      // get checked or not
      Pinput.useTagSuggestion = $checkboxTagSuggestion.prop('checked');
      var storageData = {};
      storageData[Pinput.StorageKey.useTagSuggestion] = Pinput.useTagSuggestion;
      
      // save checked value to chrome storage
      chromeStorage.set(storageData, function () {});
    });
    
    // if the save button is clicked
    $button.on('click', function (e) {
      
      // get put value
      Pinput.authToken = $input.val();
      var storageData = {};
      storageData[Pinput.StorageKey.authToken] = Pinput.authToken;
  
      // save put value as token to chrome storage
      chromeStorage.set(storageData, function () {
        if (Pinput.authToken.length !== 0) {
          Pinput.API.getPost().done(function (data) {
            // update as token is authenticated
            storageData[Pinput.StorageKey.isAuthenticated] = 1;
            chromeStorage.set(storageData, function () {
              $alert.removeClass('alert-info alert-warning alert-danger');
              $alert.html(Options.Message.succeed).addClass('alert-success');
              Pinput.isAuthenticated = true;
            });
          }).fail(function (error) {
            // update as token is not authenticated
            storageData[Pinput.StorageKey.isAuthenticated] = 0;
            chromeStorage.set(storageData, function () {
              $alert.removeClass('alert-info alert-warning alert-success');
              $alert.html(Options.Message.failed).addClass('alert-danger');
              Pinput.isAuthenticated = false;
            });
          });
        } else {
          // update as token is not authenticated
          storageData[Pinput.StorageKey.isAuthenticated] = 0;
          chromeStorage.set(storageData, function () {
            $alert.removeClass('alert-danger alert-warning alert-success');
            $alert.html(Options.Message.isBlank).addClass('alert-info');
            Pinput.isAuthenticated = false;
          });
        }
      });
    });
  });

  // export
  global.Pinput = Pinput;

})(this);