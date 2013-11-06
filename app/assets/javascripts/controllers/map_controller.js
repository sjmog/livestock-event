App.MapController = Ember.ObjectController.extend({
	currentObject:null,
	newObject: null,
	view: App.MapView,
	objectDidChange: function(object) {
		this.currentObject = object;
	}
});