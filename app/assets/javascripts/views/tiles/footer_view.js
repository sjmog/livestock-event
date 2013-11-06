App.FooterView = Ember.View.extend({
	templateName: 'footer',
	classNames: ['tile footer tile-quarter-tall tile-n-wide rabdflightgray'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 1,
	didInsertElement: function() {
		var $copyright = this.$().find('.copyright');
		$copyright.click(function() {
			throwInfo('copyright information', "<p>Copyright and all other intellectual property rights in the material available on this site, is owned by RABDF Events Limited, RADBF and/or the applicable third parties. Such material may only be used in the ways described in this Copyright Notice.</p><p>You are not permitted to copy, broadcast, download, store (in any medium), adapt or change in any way the content of this website for any other purpose whatsoever without the prior written permission of RABDF Events Ltd or RABDF.</p><p>Except as otherwise indicated on this website you may view, or download and print a single copy of documents and graphics from this website provided that:</p><ul><li>(a) the material is used solely for research, personal or non-commercial purposes;</li><li>(b) the material is not modified or altered in anyway, and</li><li>(c) you do not remove any part of this legal notice.</li></ul><p>All other rights, title and interest not expressly granted herein are expressly reserved.</p>")
		})
	}
});


