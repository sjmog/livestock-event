App.SponsorView = Ember.View.extend({
	templateName: 'sponsor',
	classNames: ['tile content-tile sponsor rabdfblue content-tile mix exhibitor visitor tile-half-tall general_info tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 5,
	exhibitorImportance: 5,
	generalImportance: 5,
	width: 1,
	height: 1,
	didInsertElement: function() {

	}
});
