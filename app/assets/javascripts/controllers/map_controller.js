App.MapController = Ember.ObjectController.extend({
	needs: ['application'],
	currentObject:null,
	newObject: null,
	view: App.MapView,
	objectDidChange: function(object) {
		this.currentObject = object;
	}
});