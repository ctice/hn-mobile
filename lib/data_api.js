var TIMEOUT = 5000;

var getData = function(uri, callback, error) {
  var req = $.ajax({
    url: uri,
    dataType: "jsonp",
    timeout: TIMEOUT
  });

  req.success(callback);
  req.error(error);
};

exports.getArticleList = function(callback, error) {
  getData("http://api.ihackernews.com/page?format=jsonp", callback, error);
};

exports.getArticle = function(id, callback, error) {
  getData("http://api.ihackernews.com/post/" + id + "?format=jsonp", callback, error);
};

exports.getArticleText = function(url, callback, error) {
  getData("http://viewtext.org/api/text?url=" + url + "&format=json", callback, error);
};
