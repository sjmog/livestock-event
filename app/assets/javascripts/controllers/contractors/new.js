// inherit from edit controller
App.ContractorsNewController = App.ContractorsEditController.extend({

	init: function() {
		this._super();
		this.set('image', 'http://placehold.it/310x310');
	}
});
