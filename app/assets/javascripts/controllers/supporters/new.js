// inherit from edit controller
App.SupportersNewController = App.SupportersEditController.extend({

	init: function() {
		this._super();
		this.set('image', 'http://placehold.it/310x310');
	}
});
