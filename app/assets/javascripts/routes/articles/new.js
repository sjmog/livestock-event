App.ArticlesNewRoute = Ember.Route.extend({
	model: function() {
	  return App.Article.createRecord();
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var articlesNewController = this.controllerFor('articles.new');
		this.render('articles/new', {
			into: 'application',
			controller: articlesNewController
		});
	},
});