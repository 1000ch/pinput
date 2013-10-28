(function() {
  chrome.storage.local.get(["currentUrl", "currentTitle"], function(items) {

    var params = [];
    params.push("url=" + encodeURIComponent(items.currentUrl));
    params.push("title=" + encodeURIComponent(items.currentTitle));
    //params.push("description=" + encodeURIComponent(description));

    var pinboardFrame = document.createElement("iframe");
    pinboardFrame.width = "100%";
    pinboardFrame.height = "100%";
    pinboardFrame.src = "https://pinboard.in/add?" + params.join("&");

    document.body.innerHTML = "";
    document.body.appendChild(pinboardFrame);
  });
})();