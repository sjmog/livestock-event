App.BookingsEditController = Ember.ObjectController.extend({
  needs: ['application'],
  update: function(booking) {
    booking.one('didUpdate', this, function(){
      this.transitionToRoute('bookings.show', booking);
    });
    this.get('store').commit();
  },

  showAreas: [
    {fullName: "Please Select...", value: ''},
  	{fullName: "Indoor", value: 'indoor'},
  	{fullName: "Outdoor", value: 'outdoor'},
  	{fullName: "Machinery Hall", value: 'machinery hall'},
  	{fullName: "Livestock Hall", value: 'livestock hall'}
  ],
  selectedArea: null,
  standTypes: [
    {fullName: "Please Select...", value: ''},
  	{fullName: "Clear Stand Space", value: 'clear'},
  	{fullName: "Shell Scheme", value: 'modular'}
  ],
  selectedStand: null,
  positions: [
    {fullName: "Please Select...", value: ''},
    {fullName: "Standard – open on 1 side", value: 'standard'},
  	{fullName: "Corner – open on 2 sides", value: 'corner'},
  	{fullName: "Peninsula – open on 3 sides", value:'peninsula'},
  	{fullName: "Island – open on all 4 sides", value: 'island'}
  ],
  positionsAlt: [
    {fullName: "Please Select...", value: ''},
    {fullName: "Standard – open on 1 side", value: 'standard'},
    {fullName: "Corner – open on 2 sides", value: 'corner'},
  ],
  selectedPosition: null,
  breedSocieties: [
    {fullName: "Please Select...", value: ''},
  	{fullName: "Dairy", value: 'dairy'},
  	{fullName: "Beef", value: 'beef'},
  	{fullName: "Sheep", value: 'sheep'}
  ],
  selectedBreedSociety: null,
  zones: [
    {fullName: "Please Select...", value: ''},
    {fullName: "Animal Health", value: 'animal health'},
    {fullName: "Business Management", value: 'business management'},
    {fullName: "Diversifarm & Renewables", value: 'diversifarm and renewables'},
    {fullName: "Feeds & Forage", value: 'feeds and forage'},
    {fullName: "Genetics", value: 'genetics'},
    {fullName: "Housing & Storage", value: 'housing and storage'},
    {fullName: "Livestock Equipment & Machinery", value: 'livestock equipment and machinery'},
    {fullName: "Milking", value: 'milking'},
    {fullName: "Milkmade", value: 'milkmade'},
    {fullName: "Slurry, Muck & Irrigation", value: 'slurry, muck and irrigation'}
  ],
  selectedZone: null,

});


