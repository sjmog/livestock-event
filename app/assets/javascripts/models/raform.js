
App.Raform = DS.Model.extend({
  booking: DS.belongsTo('App.Booking'),
  hazards: DS.hasMany('App.Hazard'),
  particulars: DS.attr('string'),
  equipment: DS.attr('string'),
  complex: DS.attr('boolean'),
  company_name: DS.attr('string'),
  conducted_by: DS.attr('string'),
  signature: DS.attr('string'),
  date: DS.attr('string'),
  verified: DS.attr('boolean'),
  complete: function() {
    if (this.get('company_name') 
    	&& this.get('conducted_by') 
    	&& this.get('signature') 
    	&& this.get('date'))
    	{ return true; } 
    else 
    	{ return false; }
  }.property('company_name', 'conducted_by', 'signature', 'date'),

});