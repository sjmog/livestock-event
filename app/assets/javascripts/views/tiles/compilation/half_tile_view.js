App.HalfTileView = Ember.View.extend({
	templateName: 'half-tile',
	classNames: ['tile tile-half-tall tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 1,
	exhibitorImportance: 1,
	generalImportance: 1,
	width: 1,
	height: 0.5,
	flipped:false,
	toggleFlip: function() {
		var view = this;
		var flipped = view.flipped;
		if(flipped) {
			view.set('flipped', false);
		}
		else {
			view.set('flipped', true);
		}
	},
	didInsertElement: function() {

	}
});
