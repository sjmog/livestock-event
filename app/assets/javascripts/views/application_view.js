App.ApplicationView = Em.View.extend({
	templateName: 'application',
	didInsertElement:function() {
		var $page = this.$().find('#pageContainer');
		var $page = this.$().find('#pageContainer');
		var $pusher = this.$().find('#pusherContainer');
		$('#resetAuth').click(function() {
			App.AuthManager.reset();
		});
		Ember.run.later(function() {
		$page.addClass('in');
		}, 1);
	},
})
  
