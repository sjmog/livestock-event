App.SupportersIndexController = Ember.ArrayController.extend({
	needs: ['application'],
	sortedSupporters: function() {
		var controller = this;
		var sortedResult = Em.ArrayProxy.createWithMixins(
		    Ember.SortableMixin, 
		    { content:controller.get('content'), sortProperties: ['category'], sortAscending: true }
	 	);
	    return sortedResult;
	}.property('content.@each'),
	init:function() {
		this._super();
	}
});
