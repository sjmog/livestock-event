App.NaasEntryView = Ember.View.extend({
	templateName: 'naas-entry',
	classNames: ['tile content-tile innerTile mix general_info all tile-3-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 3,

	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		//contenteditable
		var editable = document.getElementById('cattle_entry');

		$(editable).on('blur', function () {
		  // lame that we're hooking the blur event
		  localStorage.setItem('contenteditable', this.innerHTML);
		  document.designMode = 'off';
		});

		$(editable).on('focus', function () {
		  document.designMode = 'on';
		});

		// addEvent(document.getElementById('clear'), 'click', function () {
		//   localStorage.clear();
		//   window.location = window.location; // refresh
		// });

		if (localStorage.getItem('contenteditable')) {
		  editable.innerHTML = localStorage.getItem('contenteditable');
		}
	}
});