App.ContractorsEditRoute = Ember.Route.extend({
	model: function(params) {
		return this.get('store').find('contractor', params.contractor_id);
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var contractorsEditController = this.controllerFor('contractors.edit');
		this.render('contractors/edit', {
			into: 'application',
			controller: contractorsEditController
		});
	},
});