App.ArticlesShowRoute = Ember.Route.extend({
	model: function(params) {
		analytics.track('Viewed an Article', {
		    article_id  : params.article_id,
		});
		return this.get('store').find('article', params.article_id);
	},
	renderTemplate: function() {
		var articlesController = this.controllerFor('articles');
		var articlesShowController = this.controllerFor('articles.show');
		this.render('articles/show', {
			into: 'application',
			controller: articlesShowController
		});
	},
});