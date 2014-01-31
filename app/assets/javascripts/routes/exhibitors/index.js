App.ExhibitorsIndexRoute = Ember.Route.extend({
	model: function() {
		analytics.track('Viewed public Exhibitor list');
		return this.get('store').find('exhibitor');
	}
});
