App.NewsController = Ember.ArrayController.extend({
	needs: ['application'],
	init:function() {
		this._super();
		this.set('articles', App.Article.find());
	}
});
