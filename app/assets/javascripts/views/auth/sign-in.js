
  App.AuthSignInView = Em.View.extend({
    templateName: 'auth/sign-in',
    email: null,
    password: null,
    remember: false,
    submit: function(event, view) {
      console.log('current view controller is ' + this.get('controller'));
      event.preventDefault();
      event.stopPropagation();
      return this.get('controller.controllers.currentUser').login({
        data: {
          email: this.get('controller.email'),
          password: this.get('controller.password'),
          remember: this.get('controller.remember')
        }
      });
    }
  });

