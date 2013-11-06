(function() {

  $(function() {
    
    var $input = $("#js-input");
    var $button = $("#js-button");
    var $alert = $("#js-alert");
    var chromeStorage = chrome.storage.sync;

    // check set API token is authenticated
    chromeStorage.get("pinput_APIToken", function(items) {
      var token = "";
      if(items.hasOwnProperty("pinput_APIToken")) {
        token = items.pinput_APIToken;
      }
      var url = "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token;
      $.getJSON(url).done(function(data) {
        $alert.removeClass("alert-info alert-warning alert-danger").addClass("alert-success");
        $alert.html("API token is successfully authenticated!");
      }).fail(function(error) {
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
        pinput_APIToken: token
      };
      chromeStorage.set(data, function() {
        var url = "https://api.pinboard.in/v1/posts/get?format=json&auth_token=" + token;
        $.getJSON(url).done(function(data) {
          chromeStorage.set({pinput_isAuthenticated: 1}, function() {
            $alert.removeClass("alert-info alert-warning alert-danger").addClass("alert-success");
            $alert.html("API token is successfully authenticated!");
          });
        }).fail(function(error) {
          chromeStorage.set({pinput_isAuthenticated: 0}, function() {
            $alert.removeClass("alert-info alert-warning alert-success").addClass("alert-danger");
            $alert.html("API token authentication is failed...");
          });
        });
      });
    });
  });

})();