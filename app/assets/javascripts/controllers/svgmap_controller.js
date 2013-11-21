App.SvgmapController = Ember.ObjectController.extend({
	currentObject:null,
	newObject: null,
	view: App.SvgmapView,
	objectDidChange: function(object) {
		this.currentObject = object;
	}
});