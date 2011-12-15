var core = require('bolt/core');
var util = require('bolt/util');
var Collection = require('bolt/collection').Collection;

var Scene = require('bolt_touch/views/scene').Scene;
var ScrollView = require('bolt_touch/views/scroll_view').ScrollView;

var api = require('./data_api');
var Comment = require('./models/comment').Comment;
var CommentCollectionView = require('./views/comment_collection_view').CommentCollectionView;
var Header = require('./views/header').Header;
var TextScene = require('./text_scene').TextScene;

exports.PostScene = core.createClass({
  name: 'PostScene',
  extend: Scene,

  properties: {
    article: null
  },

  declare: function(options) {
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
          additionalClasses: 'container',

          childViews: [
            {
              ref: 'name',
              additionalClasses: 'name',
              onclick: 'viewText'
            },
            {
              additionalClasses: 'postDetails',
              boxOrientation: 'horizontal',

              childViews: [
                {
                  ref: 'points',
                  additionalClasses: 'detail'
                },
                { content: '|' },
                {
                  ref: 'commentCount',
                  additionalClasses: 'detail'
                },
                { content: '|' },
                {
                  ref: 'timestamp',
                  additionalClasses: 'detail'
                }
              ]
            }
          ]
        },
        {
          ref: 'scroller',
          view: ScrollView,
          flex: 1,
          childViews: [
            {
              ref: 'comments',
              view: CommentCollectionView
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
    this.article = this.getArticle();

    this.commentList = new Collection();
    this.findRef('comments').setCollection(this.commentList);

    this.refreshComments();
    this.findRef('name').setContent(this.article.get('title'));
    this.findRef('points').setContent(this.article.get('points') + ' points');
    this.findRef('commentCount').setContent(this.article.get('commentCount') +
      ' comments');
    this.findRef('timestamp').setContent(this.article.get('postedAgo'));
  },

  refreshComments: function() {
    this.refs.loading.show();

    api.getArticle(this.article.get('id'), util.bind(function(article) {
      util.forEach(article.comments, function(data) {
        var comment = new Comment(data);
        this.commentList.add(comment);
      }, this);

      this.refs.loading.hide();
      setTimeout(util.bind(function() {
        this.refs.scroller.refresh();
      }, this), 10);
    }, this), util.bind(function() {
      this.refs.loading.setContent('error retrieving comments!');
    }, this));
  },

  goBack: function() {
    this.getStack().pop();
  },

  scrollToTop: function() {
    this.refs.scroller.scrollTo(0, 0, 150);
  },

  viewText: function() {
    this.getStack().push({
      view: TextScene,
      article: this.article
    }, { transition: 'slide' });
  }
});
