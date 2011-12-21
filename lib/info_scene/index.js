var core = require('bolt/core');
var util = require('bolt/util');

var Scene = require('bolt_touch/views/scene').Scene;

var Header = require('./views/header').Header;

exports.InfoScene = core.createClass({
  name: 'InfoScene',
  extend: Scene,

  declare: function() {
    return {
      boxOrientation: 'vertical',

      childViews: [
        {
          view: Header,
          content: 'About'
        },
        {
          additionalClasses: 'backButton',
          content: '&#x2193',
          onclick: 'goBack'
        },
        {
          additionalClasses: 'textContent',

          childViews: [
            {
              content: 'Hacker News API available at ' +
                '<a href="http://api.ihackernews.com" ' +
                'target="_blank">api.ihackernews.com</a>',
              tagName: 'p'
            },
            {
              content: 'ViewText API available at ' +
                '<a href="http://viewtext.org/help/api" ' +
                'target="_blank">viewtext.org/help/api</a>',
              tagName: 'p'
            }
          ]
        }
      ]
    };
  },

  goBack: function() {
    this.getStack().pop();
  }
});
