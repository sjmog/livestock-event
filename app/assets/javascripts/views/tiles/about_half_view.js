App.AboutHalfView = Ember.View.extend({
	templateName: 'about_half',
	classNames: ['tile content-tile about-half rabdfblue content-tile mix exhibitor visitor tile-half-tall general_info tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 2,
	exhibitorImportance: 2,
	generalImportance: 2,
	width: 1,
	height: 1,
	didInsertElement: function() {
		//for the flipping
		this.$().find('.help').click(function() {
			this.$().find('.front').addClass('flipped');
			this.$().find('.back').addClass('flipped');
		});
		//flip back
		this.$().find('.help').click(function() {
			this.$().find('.front').removeClass('flipped');
			this.$().find('.back').removeClass('flipped');
		});
	}
});
