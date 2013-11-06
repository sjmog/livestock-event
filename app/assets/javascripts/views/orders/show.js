App.OrdersShowView = Ember.View.extend({
	templateName: 'orders/show',
	classNames: ['tile innerTile content-tile rabdforange exhibitor all tile-4-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 4,
	controller: this.controller,
	didInsertElement: function() {
		window.scrollTo(0,0);
		jQuery(function($) {
		  $('#payment-form').submit(function(event) {
		    var $form = $(this);

		    // Disable the submit button to prevent repeated clicks
		    $form.find('button').prop('disabled', true);
		    console.log('creating Stripe token');
		    Stripe.card.createToken($form, stripeResponseHandler);

		    // Prevent the form from submitting with the default action
		    return false;
		  });
		});
		var stripeResponseHandler = function(status, response) {
		  var $form = $('#payment-form');

		  if (response.error) {
		    // Show the errors on the form
		    $form.find('.payment-errors').text(response.error.message);
		    $form.find('button').prop('disabled', false);
		  } else {
		    // token contains id, last4, and card type
		    var token = response.id;
		    // Insert the token into the form so it gets submitted to the server
		    $form.append($('<input type="hidden" name="stripeToken" />').val(token));
		    // and submit
		    $form.get(0).submit();
		  }
		};
	}
});