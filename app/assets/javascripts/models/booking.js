App.Booking = DS.Model.extend({

  order: DS.belongsTo('App.Order'),

  exhibitorList: DS.attr('boolean'),

  companyName: DS.attr('string'),

  requirements: DS.attr('string'),

  standNumber: DS.attr('string'),

  stand: DS.belongsTo('App.Stand'),

  placements: DS.attr('boolean'),

  corporateMembership: DS.attr('boolean'),

  correspondenceAddress: DS.attr('string'),

  invoiceAddress: DS.attr('string'),

  tcAgreed: DS.attr('boolean'),

  showArea: DS.attr('string'),

  zone: DS.attr('string'),

  sameAs2013: DS.attr('boolean'),

  standType: DS.attr('string'),

  frontage: DS.attr('number'),

  depth: DS.attr('number'),

  position: DS.attr('string'),

  requiresLeaflets: DS.attr('boolean'),

  numberLeaflets: DS.attr('number'),

  pdfLeaflet: DS.attr('boolean'),

  machineryMotion: DS.attr('boolean'),

  mobileUnit: DS.attr('boolean'),

  livestockStand: DS.attr('boolean'),

  newProducts: DS.attr('boolean'),

  philipAward:  DS.attr('boolean'),

  livestockAward:  DS.attr('boolean'),

  exports:  DS.attr('boolean'),

  exhibitorList: DS.attr('boolean'),

  website: DS.attr('string'),

  contactName: DS.attr('string'),

  telephone: DS.attr('string'),

  email: DS.attr('string'),

  notes: DS.attr('string'),

  exhibitingName: DS.attr('string'),

  poNumber: DS.attr('string'),

  financeContact: DS.attr('string'),

  financeTelephone: DS.attr('string'),

  contractorCompanyName: DS.attr('string'),

  contractorContactName: DS.attr('string'),

  contractorAddress: DS.attr('string'),

  contractorTelephone: DS.attr('string'),

  contractorEmail: DS.attr('string'),

  theDeposit: DS.attr('number'),

  theTotal: DS.attr('number'),

  area: function() {
    return this.get('frontage') * this.get('depth');
  }.property('frontage', 'depth'),

  freeTickets: function() {
    var showArea = this.get('showArea');
    var area = this.get('area');
    var freeTickets;
    switch(showArea){
      case "indoor":
        if(area <= 12 && area >=9) {freeTickets = 6}
        else if(area>=13 && area < 26) {freeTickets = 8}
        else if(area>=26 && area < 37) {freeTickets = 12}
        else if(area>=37 && area < 48) {freeTickets = 14}
        else if(area>=48 && area < 70) {freeTickets = 18}
        else if(area>=70) {freeTickets = 24}
        else {freeTickets = 0};
        break
      case "outdoor":
        if(area <= 12 && area >=9) {freeTickets = 6}
        else if(area>=13 && area < 72) {freeTickets = 10}
        else if(area>=72 && area < 150) {freeTickets = 14}
        else if(area>=150 && area < 200) {freeTickets = 18}
        else if(area>=200) {freeTickets = 24}
        else {freeTickets = 0};
        break
      case "machinery hall":
        if(area <= 12 && area >=9) {freeTickets = 6}
        else if(area>=13 && area < 72) {freeTickets = 10}
        else if(area>=72 && area < 150) {freeTickets = 14}
        else if(area>=150 && area < 200) {freeTickets = 18}
        else if(area>=200) {freeTickets = 24}
        else {freeTickets = 0};
        break
      case "livestock hall":
        freeTickets = 0;
        break;
    }
    return freeTickets;
  }.property('showArea', 'area'),

  price: function() {
    var showArea = this.get('showArea');
    var standType = this.get('standType');
    var area = this.get('area');
    var breed = this.get('breedSociety');
    var price;
    switch(showArea){
      case "indoor":
        switch(standType){
            case "clear":
              if(area >= 200) {price = 42*area}
                else {price = 45*area}
              break;
            case "modular":
              price = 100*area;
              break;
        }
        break
      case "outdoor":
        if(area <100) {price = 16*area}
        else if(area>=100 && area < 200) {price=15*area}
        else {price=14*area};
        break;
      case "machinery hall":
        if(area <100) {price = 18*area}
        else if(area>=100 && area < 200) {price=17*area}
        else {price=16*area};
        break;
      case "livestock hall":
        if(breed === "dairy") {price = 0}
        else if(breed === "beef") {price = 850}
        else if(breed === "sheep") {price = 360}
        else {price = 0}
        break;
    }
    return Math.round(price);
  }.property('standType', 'showArea', 'area', 'breedSociety'),

  surcharge: function() {
    var position = this.get('position');
    var showArea = this.get('showArea');
    var surcharge;
    switch(showArea){
          case "indoor":
            switch(position) {
              case 'standard':
                surcharge = 0
                break;
              case 'corner':
                surcharge =  Math.round(this.get('price')*0.1)
                break;
              case 'peninsula':
                surcharge = Math.round(this.get('price')*0.15)
                break;
              case 'island':
                surcharge = Math.round(this.get('price')*0.2)
                break;
            }
            break;
          case "outdoor":
            surcharge = 0
            break;
          case "machinery hall":
            surcharge = 0
            break;
          case "livestock hall":
            surcharge = 0
            break;
        };
    return surcharge;
  }.property('price', 'position'),

  total: function() {
    return Math.round(this.get('price') + this.get('surcharge'))
  }.property('price', 'surcharge'),

  totalIncVat: function() {
    var theTotal = Math.round((this.get('price') + this.get('surcharge'))*1.2);
    this.set('theTotal', theTotal);
    return theTotal;
  }.property('price', 'surcharge'),

  depositExVat: function() {
    return Math.round(this.get('total')*0.3);
  }.property('total'),

  deposit: function() {
    theDeposit = Math.round((this.get('total')*0.3*1.2)); //including VAT at 20%
    this.set('theDeposit', theDeposit);
    return theDeposit;
  }.property('total'),

  balanceExVat: function() {
    return Math.round(this.get('total') - this.get('depositExVat')); //excluding VAT
  }.property('total'),

  balance: function() {
    return Math.round((this.get('total') - this.get('depositExVat'))*1.2); //including VAT
  }.property('total'),


  depositPaid: DS.attr('boolean'),

  totalPaid: DS.attr('boolean'),

  breedSociety: DS.attr('string'),

  user: DS.belongsTo('App.User'),

});


