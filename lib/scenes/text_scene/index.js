var core = require('bolt/core');
var util = require('bolt/util');

var Scene = require('bolt_touch/views/scene').Scene;
var ScrollView = require('bolt_touch/views/scroll_view').ScrollView;

var api = require('../../data_api');
var Header = require('../../views/header').Header;

exports.TextScene = core.createClass({
  name: 'TextScene',
  extend: Scene,

  properties: {
    article: null
  },

  declare: function() {
    return {
      boxOrientation: 'vertical',

      childViews: [
        {
          view: Header,
          content: 'Hacker News Mobile',
          onclick: 'scrollToTop'
        },
        {
          additionalClasses: 'backButton',
          content: '&#x2190;',
          onclick: 'goBack'
        },
        {
          ref: 'scroller',
          view: ScrollView,
          flex: 1,

          childViews: [
            {
              ref: 'textContent',
              additionalClasses: 'textContent'
            }
          ]
        },
        {
          ref: 'loading',
          content: 'loading...',
          additionalClasses: 'loading'
        }
      ]
    };
  },

  ready: function() {
    this.loading = this.findRef('loading');
    this.article = this.getArticle();
    window.scroller = this.refs.scroller;

    api.getArticleText(this.article.get('url'), util.bind(function(data) {
      this.loading.hide();
      this.findRef('textContent').setContent(data.content);

      setTimeout(util.bind(function() {
        this.refs.scroller.refresh();
      }, this), 100);
    }, this), util.bind(function() {
      this.refs.loading.setContent('error retrieving text!');
    }, this));
  },

  scrollToTop: function() {
    this.findRef('scroller').scrollTo(0, 0, 150);
  },

  goBack: function() {
    this.getStack().pop();
  }
});
