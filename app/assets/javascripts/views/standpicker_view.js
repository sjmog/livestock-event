App.StandPicker = Ember.TextField.extend({
  change: function(event) {
    var value = this.$().val();
    this.get('controller').send('setStand', value);
  },
  didInsertElement: function() {
  }
});