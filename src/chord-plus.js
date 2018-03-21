var formatter = require( '../src/chord-plus-formatter.js' );
var parser = require( '../src/chord-plus-parser.js' );

window['ChordPlus'] = {
	getHTML: function( sourceCode, key, newKey ){
		var parsed = parser.parse( sourceCode, key, newKey );

		return formatter.format( parsed );
	}
};