App.SupportersShowRoute = Ember.Route.extend({
	model: function(params) {
		analytics.track('Viewed a Supporter', {
			supporter_id : params.supporter_id
		});
		return this.get('store').find('supporter', params.supporter_id);
	},
	renderTemplate: function() {
		var supportersController = this.controllerFor('supporters');
		var supportersShowController = this.controllerFor('supporters.show');
		this.render('supporters/show', {
			into: 'application',
			controller: supportersShowController
		});
	},
});