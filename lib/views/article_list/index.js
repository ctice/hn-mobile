var core = require('bolt/core');
var util = require('bolt/util');

var CollectionView = require('bolt/collection_view').CollectionView;

var View = require('bolt_touch/view').View;
var Actionable = require('bolt_touch/mixins/actionable').Actionable;
var parseUri = require('../../parseuri').parseUri;

exports.ArticleList = core.createClass({
  name: 'ArticleList',
  extend: CollectionView,

  viewForModel: function(model) {
    var view = new ArticleView({ owner: this.getOwner() });

    view.setBinding(
      model, [
        { property: 'title' },
        { property: 'url'   },
        { property: 'commentCount' },
        { property: 'points' },
        { property: 'postedAgo' }
      ]
    );

    return view;
  }
});

var ArticleView = core.createClass({
  name: 'ArticleView',
  extend: View,

  mixins: [Actionable],

  delegateProperties: {
    headerText: [{ alias: 'title', name: 'content' }],
    timestamp: [{ alias: 'postedAgo', name: 'content' }]
  },

  declare: function() {
    return {

      childViews: [
        {
          boxOrientation: 'horizontal',
          additionalClasses: 'textContainer',

          childViews: [
            {
              ref: 'headerText',
              additionalClasses: 'title'
            },
            {
              ref: 'urlText',
              additionalClasses: 'urlText'
            }
          ]
        },
        {
          boxOrientation: 'horizontal',
          additionalClasses: 'postDetails',

          childViews: [
            {
              ref: 'comments',
              additionalClasses: 'detail'
            },
            { content: '|' },
            {
              ref: 'points',
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
    };
  },

  ready: function() {
    this.setAction(util.bind(this.articleClicked, this));
  },

  setUrl: function(url) {
    var uri = parseUri(url);
    this.refs.urlText.setContent(uri.host);
  },

  setCommentCount: function(count) {
    this.refs.comments.setContent(count + ' comments');
  },

  setPoints: function(points) {
    this.refs.points.setContent(points + ' points');
  },

  articleClicked: function() {
    this.getOwner().articleClicked(this.getModel());
  }
});
