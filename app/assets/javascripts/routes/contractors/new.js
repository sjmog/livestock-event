App.ContractorsNewRoute = Ember.Route.extend({
	model: function() {
	  return App.Contractor.createRecord();
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var contractorsNewController = this.controllerFor('contractors.new');
		this.render('contractors/new', {
			into: 'application',
			controller: contractorsNewController
		});
	},
});