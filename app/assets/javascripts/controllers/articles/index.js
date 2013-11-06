App.ArticlesIndexController = Ember.ArrayController.extend({
	sortedArticles: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('content'), sortProperties: ['published'], sortAscending: false }
	 	);
	    return sortedResult;
	}.property('content.@each'),
	init:function() {
		this._super();
	}
});
