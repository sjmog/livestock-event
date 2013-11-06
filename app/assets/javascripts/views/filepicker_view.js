App.FilePickerField = Ember.TextField.extend({
  type: 'filepicker-dragdrop',
  didInsertElement: function() {
    filepicker.constructWidget(this);
  },
  apiKey: 'Aie8gfPORKaz1u4LnppPGz',
  change: function(evt) {
    console.log(JSON.stringify(e.fpfile));
  }
});