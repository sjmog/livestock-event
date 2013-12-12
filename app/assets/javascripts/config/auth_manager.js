var User = App.User;

App.AuthManager = Ember.Object.extend({
  apiKey: null,
  // Load the current user if the cookies exist and is valid
  init: function() {
    this._super();
    var accessToken = $.cookie('access_token');
    var authUserId  = $.cookie('auth_user');
    if (!Ember.isEmpty(accessToken) && !Ember.isEmpty(authUserId)) {
      this.authenticate(accessToken, authUserId);
    } else {
      this.resetWithoutRedirecting();
    }
  },

  // Determine if the user is currently authenticated.
  isAuthenticated: function() {
    return !Ember.isEmpty(this.get('apiKey.accessToken')) && !Ember.isEmpty(this.get('apiKey.user'));
  },

  // Authenticate the user. Once they are authenticated, set the access token to be submitted with all
  // future AJAX requests to the server.
  authenticate: function(accessToken, userId) {
    console.log('authenticating...');
    console.log(accessToken);
    console.log(userId);
      var date = new Date();
      var minutes = 240; //4 hour expiry
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      var self = this;
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer ' + accessToken }
      });
      //creates an API key, which fires the apiKeyObserver
      App.User.find(userId).then(function(user) {
        console.log('creating API key in AuthManager');
       self.set('apiKey', App.ApiKey.create({
         accessToken: accessToken,
         user: user,
         expiredAt: date, 
         }));
       });
    
  },

  // Log out the user
  reset: function() {
    App.__container__.lookup("route:application").transitionTo('index');
    Ember.run.sync();
    Ember.run.next(this, function(){
      this.set('apiKey', null);
      $.cookie('access_token', null);
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer none' }
      });
    });
  },

  //just reset the api key
  resetWithoutRedirecting: function() {
    Ember.run.next(this, function() {
      this.set('apiKey', null);
      $.cookie('access_token', null);
      $.ajaxSetup({
        headers: { 'Authorization': 'Bearer none' }
      });
    });
  },

  // Ensure that when the apiKey changes, we store the data in cookies in order for us to load
  // the user when the browser is refreshed.
  apiKeyObserver: function() {
    if (Ember.isEmpty(this.get('apiKey'))) {
      console.log('removing API key');
      $.removeCookie('access_token');
      $.removeCookie('auth_user');
    } else {
      console.log('setting API key cookies');
      
        $.cookie('access_token', this.get('apiKey.accessToken'), {expires: this.get('apiKey.expiredAt')});
        $.cookie('auth_user', this.get('apiKey.user.id'), {expires: this.get('apiKey.expiredAt')});
      
    }
  }.observes('apiKey')
});

// Reset the authentication if any ember data request returns a 401 unauthorized error
DS.rejectionHandler = function(reason) {
  if (reason.status === 401) {
    App.AuthManager.reset();
  }
  throw reason;
};
