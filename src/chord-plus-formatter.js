/*
 * ChordPlusFormatter class
 * 
 * Convert parsed song body to HTML
 */

var ChordPlusFormatter = {
	dot: '<span class="dot">.</span>',
	format: function ( songBody ) {				
		require( '../src/sass/styles.scss' );
		var chordsTemplate = require( '../src/templates/chords.ejs' );

		return chordsTemplate( { songBody : songBody } );
	}
}

/*
 * Declare lookup properties
 */
ChordPlusFormatter.symbolsLookup = {
	'[[:': '{',
	'[[': '"',
	'[[_': 'V',
	':]]': '}',
	'|': '\\'
};

ChordPlusFormatter.notesDurationLookup = {
	'1': 'w',
	'2': 'h',
	'4': 'q',
	'8': 'e',
	'16': 's',
	'1.': 'R',
	'2.': 'd',
	'4.': 'j',
	'8.': 'i',
	'16.': 's' + ChordPlusFormatter.dot,
	'1_': 'wU',
	'2_': 'hU',
	'4_': 'qU',
	'8_': 'eU',
	'16_': 'sU',
	'1._': 'RU',
	'2._': 'dU',
	'4._': 'jU',
	'8._': 'iU',
	'16._': 's' + ChordPlusFormatter.dot + 'U'
};

ChordPlusFormatter.restsDurationLookup = {
	'1': 'W',
	'2': 'H',
	'4': 'Q',
	'8': 'E',
	'16': 'S',
	'1.': 'W' + ChordPlusFormatter.dot,
	'2.': 'D',
	'4.': 'J',
	'8.': 'I',
	'16.': 'S' + ChordPlusFormatter.dot,
	'1_': 'WU',
	'2_': 'HU',
	'4_': 'QU',
	'8_': 'EU',
	'16_': 'SU',
	'1._': 'W' + ChordPlusFormatter.dot + 'U',
	'2._': 'DU',
	'4._': 'JU',
	'8._': 'IU',
	'16._': 'S' + ChordPlusFormatter.dot + 'U'
};

ChordPlusFormatter.beamsLookup = {
	'16,16,8': 'M',
	'16,16': 'N',
	'16,8.': 'O',
	'8_3': 'T',
	'8,8,8,8': 'Y',
	'8,16,16': 'm',
	'8,8': 'n',
	'8.,16': 'o',
	'4_3': 't',
	'16,16,16,16': 'y',
	'8,8,8': '§',
	'16,16,16': '³',
	'16,8,16': '¾'
};

module.exports = {
	format: ChordPlusFormatter.format
};