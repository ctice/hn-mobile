var core = require('bolt/core');
var Model = require('bolt/model').Model;

exports.Article = core.createClass({
  name: 'Article',
  extend: Model
});
