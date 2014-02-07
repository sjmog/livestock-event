App.Showform = DS.Model.extend({
  booking: DS.belongsTo('App.Booking'),
  progress: DS.attr('number'),
  verified: DS.attr('boolean'),
  company_name: DS.attr('string'),
  contact_name: DS.attr('string'),
  address: DS.attr('string'),
  telephone: DS.attr('string'),
  email: DS.attr('string'),
  website: DS.attr('string'),
  particulars: DS.attr('string'),
  dairy: DS.attr('boolean'),
  beef: DS.attr('boolean'),
  sheep: DS.attr('boolean'),
  goats: DS.attr('boolean'),
  pigs: DS.attr('boolean'),
  poultry: DS.attr('boolean'),
  arable: DS.attr('boolean'),

  complete: function() {
    if (this.get('company_name') 
      && this.get('contact_name') 
      && this.get('address') 
      && this.get('telephone') 
      && this.get('email') 
      && this.get('website') 
      && this.get('particulars')) 
      { return true; }
    else 
      { return false; }
  }.property('company_name', 'contact_name', 'address', 'telephone', 'email', 'website', 'particulars'),
});