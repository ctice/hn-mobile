var core = require('bolt/core');
var util = require('bolt/util');

var View = require('bolt_touch/view').View;
var Collection = require('bolt/collection').Collection;
var CollectionView = require('bolt/collection_view').CollectionView;

var Comment = require('../models/comment').Comment;

var CommentCollectionView = exports.CommentCollectionView = core.createClass({
  name: 'CommentCollectionView',
  extend: CollectionView,

  viewForModel: function(model) {
    var view = new CommentView({ owner: this.getOwner() });

    view.setBinding(
      model, [
        { property: 'postedBy' },
        { property: 'postedAgo' },
        { property: 'comment' },
        { property: 'children' }
      ]
    );

    return view;
  }
});

var CommentView = core.createClass({
  name: 'CommentView',
  extend: View,

  delegateProperties: {
    user: [{ alias: 'postedBy', name: 'content' }],
    timestamp: [{ alias: 'postedAgo', name: 'content' }]
  },

  declare: function() {
    return {
      childViews: [
        {
          additionalClasses: 'postDetails',
          boxOrientation: 'horizontal',

          childViews: [
            {
              ref: 'user',
              additionalClasses: 'detail'
            },
            { content: '|' },
            {
              ref: 'timestamp',
              additionalClasses: 'detail'
            }
          ]
        },
        {
          ref: 'comment',
          additionalClasses: 'comment'
        },
        {
          ref: 'childrenComments',
          view: CommentCollectionView
        }
      ]
    };
  },

  ready: function() {
    this.childrenComments = this.findRef('childrenComments');
  },

  setComment: function(comment) {
    this.refs.comment.setContent(comment);
  },

  setChildren: function(children) {
    if (children.length === 0) {
      return;
    }

    var collection = new Collection();
    util.forEach(children, function(child) {
      var comment = new Comment(child);
      collection.add(comment);
    });

    this.childrenComments.setCollection(collection);
    this.childrenComments.placeIn(this.getNode());
  }
});
