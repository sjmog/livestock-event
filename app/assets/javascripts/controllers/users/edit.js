App.UsersEditController = Ember.ObjectController.extend({
  updateUser: function() {
    var router = this.get('target');
    var data = this.getProperties('id', 'name', 'email', 'password', 'password_confirmation');
    var user = this.get('model');

    $.ajax({
        url: 'http://livestockevent-co-uk.herokuapp.com/api/users/',
        data: {user: data},
        type: 'PUT',
        success: function(result) {
            router.transitionTo('users.show', user);
        }


    }).fail(function(jqxhr, textStatus, error ) {
      if (jqxhr.status === 422) {
        errs = JSON.parse(jqxhr.responseText)
        user.set('errors', errs.errors);
      }
    });
  }
});