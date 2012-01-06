var core = require('bolt/core');

var SceneStack = require('bolt_touch/views/scene_stack').SceneStack;

var ArticlesScene = require('./scenes/articles_scene').ArticlesScene;

document.addEventListener('DOMContentLoaded', function() {
  var owner = {};
  require('bolt/builder').build({
    ref: 'stack',
    view: SceneStack,
    disableHeaders: true
  }, owner).placeIn(document.body);

  owner.refs['stack'].push({
    view: ArticlesScene
  });
});
