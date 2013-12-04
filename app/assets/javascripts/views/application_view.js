App.ApplicationView = Em.View.extend({
	templateName: 'application',
	didInsertElement:function() {
		$('#resetAuth').click(function() {
			App.AuthManager.reset();
		})
	},
})
  
