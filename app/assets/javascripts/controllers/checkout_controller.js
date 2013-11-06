App.CheckoutController = Ember.ObjectController.extend({

  actions: {
    pay: function() {
      var router = this.get('target');

      $.post('http://livestockevent-co-uk.herokuapp.com/api/users.json', { user: data }, function(results) {
        App.AuthManager.authenticate(results.api_key.access_token, results.api_key.user_id);
        router.transitionTo('bookings.new');

      }).fail(function(jqxhr, textStatus, error ) {
        if (jqxhr.status === 422) {
          errs = JSON.parse(jqxhr.responseText)
          user.set('errors', errs.errors);
        }
      });
    }
  }

});

