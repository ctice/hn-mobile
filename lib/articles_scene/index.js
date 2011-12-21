var core = require('bolt/core');
var util = require('bolt/util');
var Collection = require('bolt/collection').Collection;

var Scene = require('bolt_touch/views/scene').Scene;
var ScrollView = require('bolt_touch/views/scroll_view').ScrollView;

var api = require('./data_api');
var Article = require('./models/Article').Article;
var ArticleList = require('./views/article_list').ArticleList;
var PostScene = require('./post_scene').PostScene;
var InfoScene = require('./info_scene').InfoScene;
var Header = require('./views/header').Header;

exports.ArticlesScene = core.createClass({
  name: 'ArticlesScene',
  extend: Scene,

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
          additionalClasses: 'refreshButton button',
          content: '&#x21BB;',
          onclick: 'refreshList'
        },
        {
          additionalClasses: 'aboutButton button',
          content: 'i',
          onclick: 'showInfo'
        },
        {
          ref: 'scroller',
          view: ScrollView,
          flex: 1,

          childViews: [
            {
              ref: 'articles',
              view: ArticleList
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
    this.articleList = new Collection();
    this.findRef('articles').setCollection(this.articleList);

    this.refreshList();
  },

  scrollToTop: function() {
    this.refs.scroller.scrollTo(0, 0, 150);
  },

  refreshList: function() {
    this.articleList.clear();
    this.refs.loading.setContent('loading...');
    this.refs.loading.show();

    api.getArticleList(util.bind(function(list) {
      util.forEach(list.items, function(data) {
        var article = new Article(data);
        this.articleList.add(article);
      }, this);

      this.refs.loading.hide();
      setTimeout(util.bind(function() {
        this.refs.scroller.refresh();
      }, this), 10);
    }, this), util.bind(function() {
      var tryAgain = this.build({
        childViews: [
          {
            content: 'error retrieving article list!'
          },
          {
            tagName: 'a',
            content: 'try refreshing',
            onclick: util.bind(this.refreshList, this)
          }
        ]
      });

      this.refs.loading.setContent('');
      this.refs.loading.append(tryAgain);
    }, this));
  },

  articleClicked: function(article) {
    this.getStack().push({
      view: PostScene,
      article: article
    }, { transition: 'slide' });
  },

  showInfo: function() {
    this.getStack().pushModal({
      view: InfoScene
    }, { transition: 'drawer' });
  }
});
