App.TestimonialsEditView = Ember.View.extend({
	templateName: 'testimonials/edit',
	classNames: ['tile content-tile rabdfblue mix general_info all tile-3-tall tile-n-wide'],
	attributeBindings: ['width:data-width', 'height:data-height'],
	width: 'n',
	height: 2,
	didInsertElement: function() {
		//filepicker init
		filepicker.setKey('Aie8gfPORKaz1u4LnppPGz');
		//prep the image uploader
		$('input[type="file"]#ajax-upload').change(function(){
		    var output = $("#ajax-upload-output");
		    var info = $("#ajax-upload-info");
		    filepicker.store(this, {location: 'S3'}, function(InkBlob){
		    	console.log(InkBlob.url);
		        view.controller.set('model.image', InkBlob.url);
		        info.text('Uploaded: '+InkBlob.filename+'');

		    }, function(fperror){
		        output.text(fperror.toString());
		    }, function(progress){
		        output.text("Uploading... ("+progress+"%)");
		    });
		});
}
});
