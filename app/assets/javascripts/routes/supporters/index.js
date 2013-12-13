App.SupportersIndexRoute = Ember.Route.extend({
	model: function() {
		analytics.track('Viewed all Supporters');
		return this.get('store').find('supporter');
	}
});
