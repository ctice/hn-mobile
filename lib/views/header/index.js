var core = require('bolt/core');
var View = require('bolt/view').View;

exports.Header = core.createClass({
  name: 'Header',
  extend: View,

  delegateProperties: {
    node: [{ alias: 'content', name: 'innerHTML' }]
  }
});
