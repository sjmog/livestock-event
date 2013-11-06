App.NewsController = Ember.ArrayController.extend({
	init:function() {
		this._super();
		this.set('articles', App.Article.find());
	}
});
