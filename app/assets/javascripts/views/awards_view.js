App.AwardsView = Ember.View.extend({
	templateName: 'awards',
	classNames: ['tile tab-tile rabdfblue scrollTile innerTile content-tile mix rabdfInfo exhibitor visitor general_info all tile-2-wide tile-4-tall'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 3,
	exhibitorImportance: 2,
	generalImportance: 3,
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
