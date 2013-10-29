(function() {

  // when popup is opened, 
  // send blank message to background
  chrome.runtime.sendMessage({}, function(response) {
    var params = [];

    // query string for pinboard API
    params.push("url=" + encodeURIComponent(response.url));
    params.push("title=" + encodeURIComponent(response.title));

    // clear iframe cache
    params.push("dt=" + Date.now());

    // load at iframe
    document.getElementById("js-pinboard").src = "https://pinboard.in/add?" + params.join("&");
  });

})();