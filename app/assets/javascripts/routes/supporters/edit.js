App.SupportersEditRoute = Ember.Route.extend({
	model: function(params) {
		return this.get('store').find('supporter', params.supporter_id);
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var supportersEditController = this.controllerFor('supporters.edit');
		this.render('supporters/edit', {
			into: 'application',
			controller: supportersEditController
		});
	},
});