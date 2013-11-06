App.OrdersEditController = Ember.ObjectController.extend({
  needs: ['application'],
  update: function(order) {
    order.one('didUpdate', this, function(){
      this.transitionToRoute('orders.show', order);
    });
    this.get('store').commit();
  },

});


