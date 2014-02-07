App.Hsform = DS.Model.extend({
  booking: DS.belongsTo('App.Booking'),
  progress: DS.attr('number'),
  company_name: DS.attr('string'),
  name: DS.attr('string'),
  mobile: DS.attr('string'),
  particulars: DS.attr('string'),
  policy: DS.attr('boolean'),
  public_insurance: DS.attr('boolean'),
  employee_insurance: DS.attr('boolean'),
  tick_1: DS.attr('boolean'),
  tick_2: DS.attr('boolean'),
  tick_3: DS.attr('boolean'),
  tick_4: DS.attr('boolean'),
  tick_5: DS.attr('boolean'),
  tick_6: DS.attr('boolean'),
  tick_7: DS.attr('boolean'),
  agreed: DS.attr('boolean'),
  completed_by: DS.attr('string'),
  date: DS.attr('string'),

  complete: function() {
    if (this.get('company_name') 
      && this.get('name') 
      && this.get('mobile') 
      && this.get('particulars') 
      && this.get('public_insurance') 
      && this.get('employee_insurance') 
      && this.get('agreed') 
      && this.get('completed_by') 
      && this.get('date'))
      { return true; } 
    else 
      { return false; }
  }.property('company_name', 'name', 'mobile', 'particulars', 'public_insurance', 'employee_insurance', 'agreed', 'completed_by', 'date'),
});