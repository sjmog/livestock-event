App.StatsView = Ember.View.extend({
	templateName: 'stats',
	classNames: ['tile content-tile mix general_info all tile-1-tall tab-tile tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 1,
	didInsertElement: function() {
		//slider
		//foundation orbit
		this.$().foundation('orbit', {
		  timer_speed: 999999999,
		  animation_speed: 250,
		  navigation_arrows: false,
		  slide_number: false,
		  bullets: false,
		  timer:false,
		});
		//settings for OOcharts
		oo.setAPIKey("a8af4a9ca3a7fd5f86a6db4fec210d693c7d693b");
		oo.load(function() {
			//Do charts here
			$('#analyticsTimeline').removeClass('disparu').animo({animation:'fadeInUp', duration:0.6});

		});
	}
});
