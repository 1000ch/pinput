(function() {
  // get set url and title
  chrome.storage.local.get(["currentUrl", "currentTitle"], function(items) {

    var params = [];
    
    // pinboard API
    params.push("url=" + encodeURIComponent(items.currentUrl));
    params.push("title=" + encodeURIComponent(items.currentTitle));
    
    // clear iframe cache
    params.push("dt=" + Date.now());

    // load at iframe
    document.getElementById("js-pinboard").src = "https://pinboard.in/add?" + params.join("&");
  });
})();