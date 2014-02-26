Ember.View.reopen({
  didInsertElement : function(){
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },
  afterRenderEvent : function(){
    // implement this hook in your own subclasses and run your jQuery logic there
  }
});

//make everything require the application controller so we can access some site-wide constants
Ember.Controller.reopen({
    needs: ['application'],
    siteContent: Ember.computed.alias("controllers.application.siteContent")
});

Ember.ObjectController.reopen({
    needs: ['application'],
    siteContent: Ember.computed.alias("controllers.application.siteContent")
});

Ember.ArrayController.reopen({
    needs: ['application'],
    siteContent: Ember.computed.alias("controllers.application.siteContent")
});