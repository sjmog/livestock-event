App.SvgmapController = Ember.ObjectController.extend({
	currentObject:null,
	newObject: null,
	view: App.SvgmapView,
	stands: null,
	objectDidChange: function(object) {
		this.currentObject = object;
	},
	init: function() {
		this._super();
		this.set('stands', App.Stand.find());
	},
	selectStand: function(id) {
		stands = this.get('stands');
		selectedStand = stands.filterBy('number', id);
		console.log(selectedStand);
		return selectedStand;
	}
});