App.UsersNewView = Ember.View.extend({
	templateName: 'users/new',
	classNames: ['tile content-tile rabdforange usersnew mix general_info all tile-3-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 3,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		//for the flipping
		$('#registrationHelp').click(function() {
			$('.tile.usersnew .front').addClass('flipped');
			$('.tile.usersnew .back').addClass('flipped');
		});
		//flip back
		$('#usersnew-closeButton').click(function() {
			$('.tile.usersnew .front').removeClass('flipped');
			$('.tile.usersnew .back').removeClass('flipped');
		});
		$('#usersnew-confirmButton').click(function() {
			$('.tile.usersnew .front').removeClass('flipped');
			$('.tile.usersnew .back').removeClass('flipped');
		});
	}
});