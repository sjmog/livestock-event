App.ContractorsShowRoute = Ember.Route.extend({
	model: function(params) {
		return this.get('store').find('contractor', params.contractor_id);
	},
	renderTemplate: function() {
		var contractorsController = this.controllerFor('contractors');
		var contractorsShowController = this.controllerFor('contractors.show');
		this.render('contractors/show', {
			into: 'application',
			controller: contractorsShowController
		});
	},
});