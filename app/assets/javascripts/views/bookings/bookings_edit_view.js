App.BookingsEditView = Ember.View.extend({
	templateName: 'bookings/edit',
	classNames: ['tile content-tile rabdforange scrollTile mix general_info all tile-12-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 3,
	controller: this.controller,
	pricebar: function() {
		var view = this;
		view.createChildView(App.PricebarView).appendTo('body')
	},

	removePricebar: function() {
		App.PricebarView.remove();
	},
	willDestroyElement: function() {
		var view = this;
		
	},
	didInsertElement: function() {
		window.scrollTo(0,0);
		//stop submission on enter
		$('.grid-form').bind("keyup keypress", function(e) {
		  var code = e.keyCode || e.which; 
		  if (code  == 13) {               
		    e.preventDefault();
		    return false;
		  }
		});

		var view = this;
		//add the price bar
		view.pricebar();
		//nullifying styles on select elements
		//$('.select').dropkick();
		//hiding and showing sections
		

		$('.closeFormInfo').click(function() {
			$('.standTypeRow').fadeOut();
			$('.zoneRow').fadeOut();
			$('.positionRow').fadeOut();
			$('.outdoorRow').fadeOut();
			$('.machineryHallRow').fadeOut();
		});
		$('.copier#exhibiting_name_copier').click(function() {
			if($('#company_name').val()) {
				$('#exhibiting_name').val($('#company_name').val());
				$('#exhibiting_label').text('Exhibiting Name (copied from Company Name)')
			} else {
				console.log('fill out the company name first')
			}
		});
		$('.copier#invoice_address_copier').click(function() {
			if($('#correspondence_address').val()) {
				$('#invoice_address').val($('#correspondence_address').val());
				$('#invoice_label').text('Invoice Address (copied from Correspondence Address)')
			} else {
				console.log('fill out the correspondence address first')
			}
		});
		Ember.run.scheduleOnce('afterRender', view, function() {
			Ember.run.sync();
		})
	}
});
