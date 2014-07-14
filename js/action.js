
/*
 * Action javascript framework
 * 
 * by HyukJin Son
 */

function $_( action ) {
	return new Action( action );
}

function Action( action ) {
	
	// Private
	this._url = action + '.html';
	this._form = null;
	this._method = 'post';
	this._params = null;
	
	if ( this._url.substring( 0, 1 ) == '/' ) this._url = Config.contextPath + this._url;
	
	this.defaultHandlerOnFieldError = function( fieldErrors ) {
		
		for ( var i = 0; i < fieldErrors.length; i++ ) {
			if ( this._form != null ) {
				var target = this._form.find( '.validationMessage[field=' + fieldErrors[ i ].field + ']' );
				
				if ( fieldErrors[ i ].index != null && target.length != null && fieldErrors[ i ].index < target.length )
					target = $( target[ fieldErrors[ i ].index ] );
				
				target.html( fieldErrors[ i ].message );
			}
		}
		
		var form = this._form;
		
		// focus first field
		form.find( '.validationMessage' ).each( function() {
			if ( $( this ).html() != '' ) {
				form.find( ':input[name=' + $( this ).attr( 'field' ) + ']' ).focus();
				return false;
			}
		} );
	};
	
	this._onSuccess = function( data ) {};
	
	this._onFieldError = function( fieldErrors ) {
		return this.defaultHandlerOnFieldError( fieldErrors );
	};
	
	this._onException = function( exception ) {
		if ( exception.type == 'com.prandy.contentmanager.common.LoginNeededException' )
			location.reload();
		else
			alert( exception.message );
	};
	
	// Public
	this.params = function( paramsJSON ) {
		if ( this._params == null )
			this._params = $.param( paramsJSON, true );
		else
			this._params += '&' + $.param( paramsJSON, true );
		return this;
	};
	
	this.formParams = function( formSelector ) {
		this._form = $( formSelector );
		if ( this._params == null )
			this._params = this._form.serialize();
		else
			this._params += '&' + this._form.serialize();
		return this;
	};
	
	this.success = function( onSuccess ) {
		this._onSuccess = onSuccess;
		return this;
	};
	
	this.fieldError = function( onFieldError ) {
		this._onFieldError = onFieldError;
		return this;
	};
	
	this.exception = function( onException ) {
		this._onException = onException;
		return this;
	};
	
	this.getUrl = function() {
		return this._url + ( this._params == null || this._params == '' ? '' : '?' + this._params );
	};
	
	this.go = function() {
		location.href = this.getUrl();
	};
	
	this.invoke = function() {
		
		var obj = this;
		
		$.post( this._url, this._params, function( data ) {
			// Initialize validation message
			if ( obj._form != null ) obj._form.find( '.validationMessage' ).html( '' );
			
			if ( data._fieldError != null )
				obj._onFieldError( data._fieldError );
			else if ( data._exception != null )
				obj._onException( data._exception );
			else
				obj._onSuccess( data );
		} );
	};
	
	this.update = function( selector ) {
		
		var obj = this;
		
		$.get( this._url, this._params, function( data ) {
			
			if ( data._fieldError != null )
				obj._onFieldError( data._fieldError );
			else if ( data._exception != null )
				obj._onException( data._exception );
			else {
				$( selector ).html( data );
				obj._onSuccess( data );
			}
		} );
	};
}
