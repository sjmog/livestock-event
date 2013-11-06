App.AboutView = Ember.View.extend({
	templateName: 'about',
	classNames: ['tile content-tile about mix visitor general_info all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 6,
	exhibitorImportance: 9,
	generalImportance: 8,
	width: 1,
	height: 1,
	didInsertElement: function() {
		
	}
});

