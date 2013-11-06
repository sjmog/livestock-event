App.ContractorsEditView = Ember.View.extend({
	templateName: 'contractors/edit',
	classNames: ['tile innerTile content-tile contractors  scrollTile general_info all tile-2-tall tile-2-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 2,
	height: 2,
	controller: this.controller,
	didInsertElement: function() {
		//sidebar
		$('.sidebarHolder').animate({height: (this.$().height() + 10)}, 600);
		//uploader
		$('.uploadPlus').click(function() {
			$('#ajax-upload').click();
			$('.imageUploader').css('opacity', 1);
		});
		//filepicker init
		filepicker.setKey('Aie8gfPORKaz1u4LnppPGz');
		//prep the image uploader
		var view = this;
		$('input[type="file"]#ajax-upload').change(function(){
		    var output = $("#ajax-upload-output");
		    var info = $("#ajax-upload-info");
		    filepicker.store(this, {location: 'S3'}, function(InkBlob){
		    	console.log(InkBlob.url);
		    	console.log(view.controller);
		    	console.log(view.controller.get('content'));
		    	console.log(view.get('controller'));
		        view.controller.set('content.image', InkBlob.url);
		        info.text('Uploaded: '+InkBlob.filename+'');

		    }, function(fperror){
		        info.text(fperror.toString());
		    }, function(progress){
		        info.text("Uploading... ("+progress+"%)");
		    });
		});
	}
});
