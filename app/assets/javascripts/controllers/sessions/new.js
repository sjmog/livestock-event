App.SessionsNewController = Ember.ObjectController.extend({
  init: function() {
    this._super();
    this.set('content', Ember.Object.create());
  },
  attemptedTransition: null,
  content: null,
  loginUser: function() {
    var self = this;
    var router = this.get('target');
    var data = this.getProperties('email', 'password');
    var attemptedTrans = this.get('attemptedTransition');

    $.post('/api/session', data, function(results) {
    	console.log(results.api_key.user_id);
      console.log(results.api_key);
    	var userId = results.api_key.user_id;
      var role = results.role;
      console.log(role);
      App.AuthManager.authenticate(results.api_key.access_token, results.api_key.user_id);
      Ember.run.next(this, function() {
        if (attemptedTrans) {
          attemptedTrans.retry();
          self.set('attemptedTransition', null);
        } else {
            if (role === "admin") {
              console.log('redirecting to admin');
              router.transitionTo('admin');
              Ember.run.next(function() {
                window.location.reload(true);
              })
            }
            else {
              console.log('redirecting to user');
              router.transitionTo('users.show', userId);
            }
        }
      })
    }).fail(function(jqxhr, textStatus, error ) {
      if (jqxhr.status === 401) {
        errs = JSON.parse(jqxhr.responseText)
        self.set('errors', errs.errors);
      }
      else {
        errs = JSON.parse(jqxhr.responseText);
        console.log(errs);
      }
    });
  }
});