App.WhyVisitView = Ember.View.extend({
	templateName: 'why_visit',
	classNames: ['tile content-tile why-visit rabdfpink content-tile mix visitor tile-half-tall general_info tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 1,
	exhibitorImportance: 2,
	generalImportance: 2,
	width: 1,
	height: 1,
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

