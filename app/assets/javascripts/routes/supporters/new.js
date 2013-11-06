App.SupportersNewRoute = Ember.Route.extend({
	model: function() {
	  return App.Supporter.createRecord();
	},

	deactivate: function() {
	  var model = this.get('controller.model');
	  if (!model.get('isSaving')) {
	    model.deleteRecord();
	  }
	},
	renderTemplate: function() {
		var supportersNewController = this.controllerFor('supporters.new');
		this.render('supporters/new', {
			into: 'application',
			controller: supportersNewController
		});
	},
});