App.NewsView = Ember.View.extend({
	templateName: 'news',

	classNames: ['tile content-tile news list-tile mix exhibitor visitor general_info all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 4,
	exhibitorImportance: 4,
	generalImportance: 4,
	width: 1,
	height: 1,
	didInsertElement: function() {
		this._super();
	    //truncate long excerpts
	    $('.newsContent').succinct({
	        size: 100
	    });
	},
});


