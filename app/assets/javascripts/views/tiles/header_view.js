App.HeaderView = Ember.View.extend({
	templateName: 'header',
	didInsertElement: function() {
		//login/out working
		$('a.login').click(function() {
			$('.st-container').addClass('st-menu-open');
		});

		$('#sidebar-closeButton').click(function() {
			$('.st-container').removeClass('st-menu-open');
		});
	}
});



