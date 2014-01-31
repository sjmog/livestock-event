App.LivestockExhibitorsView = Ember.View.extend({
	templateName: 'livestock_exhibitors',
	classNames: ['tile content-tile about rabdfgreen mix visitor exhibitor general_info all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 6,
	exhibitorImportance: 3,
	generalImportance: 4,
	width: 1,
	height: 1,
	didInsertElement: function() {
		
	}
});
