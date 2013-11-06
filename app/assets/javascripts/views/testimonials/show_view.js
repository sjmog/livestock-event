App.TestimonialsShowView = Ember.View.extend({
	templateName: 'testimonials/show',
	classNames: ['tile content-tile rabdfblue mix general_info exhibitor visitor all tile-2-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,

	didInsertElement: function() {

	}
});