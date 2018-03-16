var formatter = require( '../src/chord-plus-formatter.js' );
var parser = require( '../src/chord-plus-parser.js' );

window['ChordPlus'] = {
	getHTML: function( sourceCode ){
		var parsed = parser.parse( sourceCode );

		return formatter.format( parsed );
	}
};