App.TestimonialsTileView = Ember.View.extend({
	templateName: 'testimonials_tile',
	classNames: ['tile testimonials mix exhibitor visitor all tile-1-wide'],
	attributeBindings: ['width:data-width', 'height:data-height', 'visitorImportance:data-visitorimportance', 'exhibitorImportance:data-exhibitorimportance', 'generalImportance:data-generalimportance'],
	visitorImportance: 4,
	exhibitorImportance: 4,
	generalImportance: 1,
	width: 1,
	height: 1,
	interval: null,
	didInsertElement: function() {
		//autoRotation
		var view = this;
		var count = 1;
		var interval = window.setInterval(function() {
			console.log('rotatingCarou');
			$('#' + count).addClass('activeCarou').siblings('.activeCarou').removeClass('activeCarou');
			if(count<13) {count++} else {count = 0};
		},12000);
		view.set('interval', interval);		
	},
	willDestroyElement: function() {
		var view = this;
		var interval = view.get('interval');
		window.clearInterval(interval);
	}
});


