var TileProto = Ember.Mixin.create({
    height: null,
    width: null,
    background: null,
    tabs: null,
    init: function() {
        this._super();
    }
});

var ContentTile = Ember.Object.extend(TileProto, {
	title: null,
	type: null,

});

var ListTile = Ember.Object.extend(TileProto, {
	items: null,

});