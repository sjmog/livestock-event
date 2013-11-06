App.Permission = Ember.Object.extend({
  content: null,
  currentUserBinding: "App.currentUser"
});

App.Permissions = {
    _perms:    {},
    register: function(name, klass) { this._perms[name] = klass; },
    get:      function(name, attrs) { return this._perms[name].create(attrs); },
    can:      function(name, attrs) { return this.get(name, attrs).get("can"); }
};

App.Permissions.register("createArticle", App.Permission.extend({
   can: function() {
     return this.get("currentUser.isAdmin");
   }.property("currentUser.isAdmin")
 }));

 App.Permissions.register("showBooking", App.Permission.extend({
   can: function(){
     return this.get("currentUser.isAdmin") || this.get("content.author.id") == this.get("currentUser.id");
   }.property("currentUser.isAdmin", "content")
 }));