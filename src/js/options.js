(function() {

  $(function() {
    
    var $input = $("#js-input");
    var $button = $("#js-button");
    var $alert = $("#js-alert");
    var chromeStorage = chrome.storage.sync;

    chromeStorage.get("pinput_apitoken_key", function(items) {
      var token = "";
      if(items.hasOwnProperty("pinput_apitoken_key")) {
        token = items["pinput_apitoken_key"];
      }
      $.ajax({
        url: "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token,
        method: "post",
        type: "json"
      }).success(function(data) {
          $alert.removeClass("alert-info alert-warning alert-danger").addClass("alert-success");
          $alert.html("API token is successfully authenticated!");
        }).error(function(error) {
          $alert.removeClass("alert-info alert-warning alert-success").addClass("alert-danger");
          $alert.html("API token authentication is failed...");
        });
      $input.val(token);
    });

    $input.on("change", function(e) {
      $alert.removeClass("alert-info alert-success alert-danger").addClass("alert-warning");
      $alert.html("API token is not authenticated...");
    });
    
    $button.on("click", function(e) {
      var token = $input.val();
      var data = {
        pinput_apitoken_key: token
      };
      chromeStorage.set(data, function() {
        $.ajax({
          url: "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token,
          method: "post",
          type: "json"
        }).success(function(data) {
          chromeStorage.set({pinput_is_authenticated: 1}, function() {
            $alert.removeClass("alert-info alert-warning alert-danger").addClass("alert-success");
            $alert.html("API token is successfully authenticated!");
          });
        }).error(function(error) {
          chromeStorage.set({pinput_is_authenticated: 0}, function() {
            $alert.removeClass("alert-info alert-warning alert-success").addClass("alert-danger");
            $alert.html("API token authentication is failed...");
          });
        });
      });
    });
  });

})();