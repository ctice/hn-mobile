var TIMEOUT = 30000;

var JSONP = require('./vendor/jsonp');

exports.getArticleList = function(callback, error) {
  JSONP.get('http://api.ihackernews.com/page', {
    format: 'jsonp'
  }, 'callback', callback, null, TIMEOUT, error);
};

exports.getArticle = function(id, callback, error) {
  JSONP.get('http://api.ihackernews.com/post/' + id, {
    format: 'jsonp'
  }, 'callback', callback, null, TIMEOUT, error);
};

exports.getArticleText = function(url, callback, error) {
  JSONP.get('http://viewtext.org/api/text', {
    format: 'jsonp',
    url: url
  }, 'callback', callback, null, TIMEOUT, error);
};
