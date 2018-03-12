/*
 * ChordPlus class
 * 
 * Text to chord sheet scripting language
 */

String.prototype.replaceAll = function ( search, replacement ) {
	return this.split( search ).join( replacement );
};

var ChordPlus = {
	keys: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'],
	flatKeys: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
	sharpKeys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
	keysWithFlats: ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
	symbolsLookup: ['[[:', '[[', '[[_', ':]]', '|'],
	notesDurationLookup: ['1', '2', '4', '8', '16', '1.', '2.', '4.', '8.', '16.', '1_', '2_', '4_', '8_', '16_', '1._', '2._', '4._', '8._', '16._'],
	useFlats: false,
	steps: 0,
	transposeNote: function ( note ) {

		var indexOfKey = ChordPlus.sharpKeys.indexOf( note );
		if ( indexOfKey === -1 ) {
			indexOfKey = ChordPlus.flatKeys.indexOf( note );
		}

		var indexOfNewKey = indexOfKey + ChordPlus.steps;

		if ( indexOfNewKey < 0 ) {
			indexOfNewKey = ChordPlus.sharpKeys.length + indexOfNewKey;
		} else if ( indexOfNewKey >= ChordPlus.sharpKeys.length ) {
			indexOfNewKey = indexOfNewKey - ChordPlus.sharpKeys.length;
		}

		if ( ChordPlus.useFlats ) {
			return ChordPlus.flatKeys[indexOfNewKey];
		} else {
			return ChordPlus.sharpKeys[indexOfNewKey];
		}
	},
	transposeChord: function ( chord ) {

		var currentNote = chord.substr( 0, 1 );

		if ( ChordPlus.noteNames.indexOf( currentNote ) === -1 )
			throw new Error( 'Error: Invalid note name --> ' + currentNote );

		var chordType = chord.substr( 1 );
		var secondCharacter = chord.substr( 1, 1 );

		if ( secondCharacter === '#' ) {
			currentNote += '#';
			chordType = chord.substr( 2 );
		} else if ( secondCharacter === 'b' ) {
			currentNote += 'b';
			chordType = chord.substr( 2 );
		}

		currentNote = ChordPlus.transposeNote( currentNote );

		chord = currentNote + chordType;

		// Transpose over key note
		if ( chord.indexOf( '/' ) > -1 ) {
			var overKey = chord.substr( chord.indexOf( '/' ) + 1 );
			chord = chord.substr( 0, chord.indexOf( '/' ) ) + '/' + ChordPlus.transposeNote( overKey );
		}

		return chord;
	},
	getItemType: function ( value ) {

		var firstCharacter = value.substr( 0, 1 );
		var lastCharacter = value.substr( value.length - 1, 1 );
		var firstThreeCharacters = value.substr( 0, 3 );

		if ( firstCharacter === '[' && lastCharacter === ']' ) {

			return {
				type: 'section',
				value: value.substr( 1, value.length - 2 ).replaceAll( '-', ' ' )
			};

		} else if ( ChordPlus.symbolsLookup.indexOf( firstThreeCharacters ) !== -1 ) {

			if ( firstThreeCharacters === ':]]' ) {
				var times = value.length > 3 ? value.substr( 3 ) : null;

				return {
					type: 'repeat',
					value: firstCharacter,
					times: parseInt( times ) === 2 ? null : times
				};
			}

			return {
				type: 'symbol',
				value: value
			};

		} else if ( firstCharacter === '"' ) {

			return {
				type: 'label',
				value: value.replaceAll( '"', '' ).replaceAll( '-', ' ' )
			};

		} else if ( firstCharacter === '\'' ) {

			return {
				type: 'comment',
				value: value.replaceAll( '\'', '' ).replaceAll( '-', ' ' )
			};

		} else if ( value.substr( 0, 2 ) === '[[' ) {

			// Update useflats
			var newKeyInLine = value.substr( 2 );
			useFlats = ChordPlus.keysWithFlats.indexOf( newKeyInLine ) > -1;

		} else if ( firstCharacter === '(' ) {

			value = value.replaceAll( '(', '' ).replaceAll( ')', '' );

			var splittedNotes = value.split( ',' );
			var noteSeries = [];

			splittedNotes.forEach( function ( splittedValue ) {
				if ( ChordPlus.steps !== 0 || ChordPlus.useFlats ) {
					noteSeries.push( ChordPlus.transposeNote( splittedValue ) );
				} else {
					noteSeries.push( splittedValue );
				}
			} );

			return {
				type: 'chord',
				value: '(' + noteSeries.join( ',' ) + ')'
			};

		} else {

			var chord = value;
			var timing = null;
			var type = 'chord';

			var hasTiming = chord.indexOf( ':' ) !== -1;

			if ( hasTiming ) {

				var splittedValue = value.split( ':' );

				chord = splittedValue[0];
				timing = splittedValue[1];
				timing = timing.split( ',' ).map( function ( item ) {
					if ( ChordPlus.notesDurationLookup.indexOf( item ) === -1 )
						throw new Error( 'Error: Invalid note duration --> ' + item );

					return item;
				} );

				if ( chord === 'r' )
					type = 'rest';
			}

			return {
				type: type,
				value: chord === 'x' || chord === 'r' ? null : ChordPlus.transposeChord( chord ),
				timing: timing
			};
		}

		return {
			type: null,
			value: null
		};
	},
	parse: function ( sourceCode, newKey ) {

		var song = {
			title: null,
			artists: null,
			key: 'C',
			comment: null,
			bpm: 100,
			meter: '4/4',
			body: []
		};

		var songBody = '';

		// Split source code lines
		var lines = sourceCode.trim().split( /\s*[\r\n]+\s*/g );

		if ( lines.length === 0 ) {
			return;
		}

		// Map to song object properties
		var propertyCount = 7;

		lines.forEach( function ( value, index ) {
			if ( index < propertyCount ) {
				var splittedValue = value.split( ':' );
				song[splittedValue[0]] = splittedValue[1];
			} else {
				songBody += value + '\r\n';
			}
		} );

		// Parse song body
		var indexOfKey = ChordPlus.sharpKeys.indexOf( song.key );
		if ( indexOfKey === -1 ) {
			indexOfKey = ChordPlus.flatKeys.indexOf( song.key );
		}

		if ( typeof newKey !== 'undefined' && newKey !== '' ) {

			var indexOfNewKey = ChordPlus.sharpKeys.indexOf( newKey );
			if ( indexOfNewKey === -1 ) {
				indexOfNewKey = ChordPlus.flatKeys.indexOf( newKey );
			}

			// Calculate semitone steps
			ChordPlus.steps = indexOfNewKey - indexOfKey;

			// Determine if flat notes should be used
			ChordPlus.useFlats = ChordPlus.keysWithFlats.indexOf( newKey ) > -1;

			if ( ChordPlus.steps !== 0 || ChordPlus.useFlats ) {
				song.key = ChordPlus.transposeNote( song.key );
			}

		}

		var songBodyItems = songBody.trim().split( ' ' );

		song.body = [];

		songBodyItems.forEach( function ( value ) {

			if ( value === 'v2' || value === '' )
				return;

			// Check for line break
			if ( ( value.match( /\s*[\r\n]+\s*/g ) || [] ).length ) {

				var values = value.trim().split( /\s*[\r\n]+\s*/g );

				values.forEach( function ( value, index ) {
					song.body.push( ChordPlus.getItemType( value ) );

					if ( index < ( values.length - 1 ) ) {
						song.body.push( { type: 'break' } );
					}
				} );

			} else {

				song.body.push( ChordPlus.getItemType( value ) );
			}

		} );

		return song;
	}
};

module.exports = {
	parse: ChordPlus.parse,
	keys: ChordPlus.keys
};