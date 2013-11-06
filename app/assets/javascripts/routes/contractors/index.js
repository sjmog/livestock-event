App.ContractorsIndexRoute = Ember.Route.extend({
	model: function() {
		return this.get('store').find('contractor');
	}
});
