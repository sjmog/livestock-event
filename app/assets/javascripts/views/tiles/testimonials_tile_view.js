App.TestimonialsTileView = Ember.View.extend({
	templateName: 'testimonials_tile',
	classNames: ['tile testimonials mix exhibitor visitor all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 4,
	exhibitorImportance: 4,
	generalImportance: 1,
	width: 1,
	height: 1,
	didInsertElement: function() {
	
	},
});


