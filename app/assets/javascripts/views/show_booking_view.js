App.ShowBookingView = Ember.View.extend({
	templateName: 'show-booking',
	classNames: ['tile content-tile tab-tile rabdfblue mix innerTile rabdfInfo show-booking exhibitor visitor general_info all tile-2-wide tile-3-tall'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,
	didInsertElement: function() {
		//foundation orbit
		this.$().foundation('orbit', {
		  timer_speed: 999999999,
		  animation_speed: 250,
		  navigation_arrows: false,
		  slide_number: false,
		  bullets: false,
		  timer:false,
		});
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		//tabs
		var $tabs = this.$().find('.tab');
		var $prevTab;
		$tabs.click(function() {
			$tabs.not(this).removeClass('currentTab');
			$(this).addClass('currentTab');
			$prevTab = $(this).prev('.tab');
			$tabs.not($prevTab).removeClass('prevTab');
			$prevTab.addClass("prevTab");
		});
	}
});
