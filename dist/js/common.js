!function(a){var b=a.Pinput||{};b.authToken="",b.isAuthenticated=!1,b.Util={split:function(a){return a.split(/ \s*/)},extractLast:function(a){return this.split(a).pop()},serializeArray:function(a){var b=[];return a=a||{},Object.keys(a).forEach(function(c){b.push(c+"="+a[c])}),b}},b.StorageKey={authToken:"pinput_authToken",isAuthenticated:"pinput_isAuthenticated",useTagSuggestion:"pinput_useTagSuggestion"},b.API={addPost:function(a,c,d,e,f,g){var h=b.Util.serializeArray({format:"json",auth_token:b.authToken,url:encodeURIComponent(a),description:encodeURIComponent(c),extended:encodeURIComponent(d),tags:encodeURIComponent(e),shared:f,toread:g,_:Date.now()});return $.getJSON("https://api.pinboard.in/v1/posts/add?"+h.join("&"))},deletePost:function(a){var c=b.Util.serializeArray({format:"json",auth_token:b.authToken,url:encodeURIComponent(a),_:Date.now()});return $.getJSON("https://api.pinboard.in/v1/posts/delete?"+c.join("&"))},getPost:function(a){var c=b.Util.serializeArray({format:"json",auth_token:b.authToken,url:a?encodeURIComponent(a):"",_:Date.now()});return $.getJSON("https://api.pinboard.in/v1/posts/get?"+c.join("&"))},suggestPost:function(a){var c=b.Util.serializeArray({format:"json",auth_token:b.authToken,url:encodeURIComponent(a),_:Date.now()});return $.getJSON("https://api.pinboard.in/v1/posts/suggest?"+c.join("&"))},getTags:function(){var a=b.Util.serializeArray({format:"json",auth_token:b.authToken,_:Date.now()});return $.getJSON("https://api.pinboard.in/v1/tags/get?"+a.join("&"))}},a.Pinput=b}(this);