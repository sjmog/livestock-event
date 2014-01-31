App.ResultsView = Ember.View.extend({
	templateName: 'results',
	classNames: ['tile content-tile tab-tile rabdfblue mix innerTile rabdfInfo results exhibitor visitor general_info all tile-2-wide tile-3-tall'],
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
		//carouTabs code
		var $view = this.$();
		var $carous = $view.find('.carouTabs'); //all carousels in each carouTabs containers, which may be nested
		for (var i = 0; i < $carous.length; i++) {
			var $item = $($carous[i]);
			$item.children('.carouTab:first-of-type').addClass('activeCarou');
			$item.find('.carouTabTitle').click(function() {
				var $parent = $(this).parent('.carouTab');
			$parent.addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
		});
		};

	}
});
