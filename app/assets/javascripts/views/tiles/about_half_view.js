App.AboutHalfView = Ember.View.extend({
	templateName: 'about_half',
	classNames: ['tile content-tile about-half rabdfblue content-tile mix exhibitor visitor tile-half-tall general_info tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 2,
	exhibitorImportance: 2,
	generalImportance: 2,
	width: 1,
	height: 1,
	flipped:false,
	didInsertElement: function() {
		var $view = this.$();
		//for the flipping
		$view.find('.help').click(function() {
			$view.find('.front').addClass('flipped');
			$view.find('.back').addClass('flipped');
		});
		//flip back
		$view.find('.help').click(function() {
			$view.find('.front').removeClass('flipped');
			$view.find('.back').removeClass('flipped');
		});
	}
});
