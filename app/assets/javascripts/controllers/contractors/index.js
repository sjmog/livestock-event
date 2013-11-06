App.ContractorsIndexController = Ember.ArrayController.extend({
	sortedContractors: function() {
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
