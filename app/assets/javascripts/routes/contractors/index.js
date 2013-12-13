App.ContractorsIndexRoute = Ember.Route.extend({
	model: function() {
		analytics.track('Viewed all Contractors');
		return this.get('store').find('contractor');
	}
});
