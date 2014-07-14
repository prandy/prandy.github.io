
/*
 * jQuery Plugins
 * 
 * by HyukJin Son
 */
( function( $ ) {
	
	// Set value of form's input
	$.fn.setInputValue = function( inputName, value ) {
		
		if ( value == null ) value = '';
		
		return this.each( function() {
			var input = $( this ).find( ':input[name=' + inputName + ']' );
			if ( input.attr( 'type' ) == 'radio' || input.attr( 'type' ) == 'checkbox' ) {
				input.attr( 'checked', false );
				$( this ).find( ':input[name=' + inputName + '][value=' + value + ']' ).attr( 'checked', true );
			}
			else
				input.val( value );
		} );
	};
	
	// Set values of form's inputs by JSON object
	$.fn.setInputValues = function( obj ) {
		
		return this.each( function() {
			
			var form = $( this );
			
			form.find( ':input' ).each( function() {
				if ( $( this ).attr( 'type' ) == 'button' || $( this ).attr( 'type' ) == 'submit' || $( this ).attr( 'type' ) == 'reset' ) return;
				var inputName = $( this ).attr( 'name' );
				form.setInputValue( inputName, obj[ inputName ] );
			} );
		} );
	};
	
	$.fn.clearValues = function() {
		
		return this.each( function() {
			
			var form = $( this );
			
			form.find( ':input' ).each( function() {
				form.setInputValue( $( this ).attr( 'name' ), '' );
			} );
		} );
	};
	
	// Enable/Disable elements
	$.fn.enable = function() {
		return this.each( function() {
			$( this ).removeAttr( 'disabled' );
		} );
	};
	
	$.fn.disable = function() {
		return this.each( function() {
			$( this ).attr( 'disabled', 'disabled' );
		} );
	};
	
	// Set elements as read only
	$.fn.readOnly = function( readOnly ) {
		
		if ( readOnly == null ) readOnly = true;
		
		return this.each( function() {
			if ( readOnly )
				$( this ).attr( 'readonly', 'readonly' );
			else
				$( this ).removeAttr( 'readonly' );
		} );
	};
	
	// File uploader
	$.fn.fileUploader = function( fieldName, handlerOnUploadComplete ) {
		
		return this.each( function() {
			
			var container = $( this );
			var contextPath = Config.contextPath;
			
			container.addClass( 'fileUploader' );
			container.html( '<iframe frameborder="0" scrolling="no"></iframe>' );
			
			var iframe = container.find( 'iframe' );
			
			var initFrame = function() {
				iframe.attr( 'src', contextPath + '/fileUploader/iframe' );
				iframe.show();
			};
			
			initFrame();
			
			iframe.load( function() {
				
				iframe.contents().find( 'form' ).css( { float: 'left' } );
				iframe.contents().find( 'div' ).css( { width: '230px', float: 'left' } );
				iframe.contents().find( 'input' ).css( { width: '100%' } );
				iframe.contents().find( 'button' ).css( {
					background: '#739ba8',
					border: '1px solid #739ba8',
					color: 'white',
					fontWeight: 'bold',
					cursor: 'pointer',
					fontSize: '8pt',
					fontFamily: 'verdana',
					float: 'left'
				} );
				
				iframe.contents().find( 'form' ).submit( function() {
					
					$( this ).attr( 'action', contextPath + '/fileUploader/upload' );
					
					if ( $( this ).find( 'input' ).val() == '' ) {
						alert( 'Choose file to upload' );
						return false;
					}
					
					iframe.hide();
					container.append( '<div class="fileItem"><div class="fileInfo"></div><div class="barBorder"><div class="progress"></div><div class="bar"></div></div><div class="speed"></div></div>' );
					
					var fileInfo = container.find( 'div.fileInfo' );
					var progress = container.find( 'div.progress' );
					var bar = container.find( 'div.bar' );
					var speed = container.find( 'div.speed' );
					
					fileInfo.html( 'Preparing...' );
					
					// Every seconds
					var timer = function() {
						
						$.post( contextPath + '/fileUploader/status', function( data ) {
							
							if ( data.status == 'UPLOADING' ) {
							
								fileInfo.html( data.fileName );
								progress.html( data.rate );
								bar.css( { width: data.rate.replace( ' ', '' ) } );
								speed.html( data.speed );
								
								setTimeout( timer, 1000 );
							}
							else if ( data.status == 'DONE' ) {
							
								fileInfo.html( data.fileName + ' (' + data.fileSize + ')' );
								bar.parent().remove();
								speed.remove();
								
								fileInfo.after( '<input type="hidden" name="' + fieldName + '" value="' + data.fileId + '"/><button type="button" class="delete" fileId="' + data.fileId + '">X</button>' );
								fileInfo.nextAll( 'button.delete' ).click( function() {
									if ( confirm( 'Are you sure to delete?' ) ) {
										$.post( contextPath + '/fileUploader/delete', { fileId: data.fileId }, function() {
											fileInfo.parent().remove();
											initFrame();
										} );
									}
								} );
								
								if ( handlerOnUploadComplete != null ) handlerOnUploadComplete( data );
							}
							else if ( data.status == 'ERROR' ) {
								fileInfo.html( 'Error occoured' );
								initFrame();
							}
						} );
					};
					
					setTimeout( timer, 1000 );
					
					return true;
				} );
			} );
		} );
	};
	
	$.fn.reset = function() { 		
		$(this).each(function(index){
			$(this).find("input[type=text]:hidden").val('');
			$(this).find("input[type=hidden]:hidden").val('');			
			this.reset();
		});
	};
	
} )( jQuery );
