App.ExhibitorsShowRoute = Ember.Route.extend({
	model: function(params) {
		analytics.track('Viewed an Exhibitor', {
			exhibitor_id : params.exhibitor_id
		});
		return this.get('store').find('exhibitor', params.exhibitor_id);
	},
	renderTemplate: function() {
		var exhibitorsController = this.controllerFor('exhibitors');
		var exhibitorsShowController = this.controllerFor('exhibitors.show');
		this.render('exhibitors/show', {
			into: 'application',
			controller: exhibitorsShowController
		});
	},
});