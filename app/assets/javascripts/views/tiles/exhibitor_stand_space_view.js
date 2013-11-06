App.ExhibitorStandSpaceView = Ember.View.extend({
	templateName: 'exhibitor_stand_space',
	classNames: ['tile content-tile rabdforange mix exhibitor exhibitor_stand_space tile-1-wide tile-half-tall'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 9,
	exhibitorImportance: 1,
	generalImportance: 4,
	width: 1,
	height: 0.5
});


