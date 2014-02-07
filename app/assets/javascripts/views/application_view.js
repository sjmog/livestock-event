App.ApplicationView = Em.View.extend({
	templateName: 'application',
	didInsertElement:function() {
		var $page = this.$().find('#pageContainer');
		var $page = this.$().find('#pageContainer');
		var $pusher = this.$().find('#pusherContainer');
		Ember.run.later(function() {
		$page.addClass('in');
		}, 1);
	},
})
  
