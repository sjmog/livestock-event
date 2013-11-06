App.ArticlesEditRoute = Ember.Route.extend({
	model: function(params) {
		return this.get('store').find('article', params.article_id);
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var articlesEditController = this.controllerFor('articles.edit');
		this.render('articles/edit', {
			into: 'application',
			controller: articlesEditController
		});
	},
});