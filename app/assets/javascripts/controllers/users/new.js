App.UsersNewController = Ember.ObjectController.extend({

  createUser: function() {
    var router = this.get('target');
    this.set('role', 'standard');
    var data = this.getProperties('name', 'email', 'password', 'password_confirmation', 'role')
    var user = this.get('model');

    $.post('http://livestockevent.co.uk/api/users.json', { user: data }, function(results) {
      App.AuthManager.authenticate(results.api_key.access_token, results.api_key.user_id);
      router.transitionTo('bookings.new');

    }).fail(function(jqxhr, textStatus, error ) {
      if (jqxhr.status === 422) {
        errs = JSON.parse(jqxhr.responseText)
        user.set('errors', errs.errors);
      }
    });
  }
});