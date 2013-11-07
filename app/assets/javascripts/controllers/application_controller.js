App.ApplicationController = Ember.Controller.extend({
needs: ['sessionsNew'],
email: null,
password: null,
remember: false,
currentUser: function() {
    return App.AuthManager.get('apiKey.user')
  }.property('App.AuthManager.apiKey'),

  isAuthenticated: function() {
    return App.AuthManager.isAuthenticated()
  }.property('App.AuthManager.apiKey'),
  isIndex: function() {
  	if(this.get('currentPath') === 'index') {
  		return true;
  	} else {
  		console.log(this.get('currentPath'));
  		return false;
  	};
  }.property('currentPath'),
  message: {
    name: null,
    email: null,
    body: null,
  },
  messageSent: false,
  actions: {
    sendMessage: function() {
      var router = this.get('target');
      var name = $('#yourName').val();
      var email = $('#yourEmail').val();
      var message = $('#contactMessage').val();
      console.log(name);
      console.log(email);
      console.log(message);
      var data = {name: name, email: email, body: message};
      var self = this;
      $.post('http://www.livestockevent.co.uk/api/contact.json', { message: data }, function(results) {
        self.set('messageSent', true);

      }).fail(function(jqxhr, textStatus, error ) {
        if (jqxhr.status === 422) {
          errs = JSON.parse(jqxhr.responseText)
          user.set('errors', errs.errors);
        }
      });
    }
  }
});
