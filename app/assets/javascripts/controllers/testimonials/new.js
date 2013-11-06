

// inherit from edit controller
App.TestimonialsNewController = App.TestimonialsEditController.extend({

	init:function() {
		this._super();
		this.set('span', 4);
	},


});


