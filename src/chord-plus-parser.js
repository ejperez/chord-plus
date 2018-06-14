/*
 * ChordPlusParser class
 * 
 * Convert text source code to object
 */

String.prototype.replaceAll = function (search, replacement) {
	return this.split(search).join(replacement);
};

var ChordPlusParser = {
	keys: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'],
	flatKeys: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
	sharpKeys: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
	noteNames: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
	keysWithFlats: ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'],
	symbolsLookup: ['[[:', '[[', '[[_', ':]]', '|'],
	notesDurationLookup: ['1', '2', '4', '8', '16', '1.', '2.', '4.', '8.', '16.', '1_', '2_', '4_', '8_', '16_', '1._', '2._', '4._', '8._', '16._', '8_3', '4_3'],
	useFlats: false,
	steps: 0,
	transposeNote: function (note) {

		var indexOfKey = ChordPlusParser.sharpKeys.indexOf(note);
		if (indexOfKey === -1) {
			indexOfKey = ChordPlusParser.flatKeys.indexOf(note);
		}

		var indexOfNewKey = indexOfKey + ChordPlusParser.steps;

		if (indexOfNewKey < 0) {
			indexOfNewKey = ChordPlusParser.sharpKeys.length + indexOfNewKey;
		} else if (indexOfNewKey >= ChordPlusParser.sharpKeys.length) {
			indexOfNewKey = indexOfNewKey - ChordPlusParser.sharpKeys.length;
		}

		if (ChordPlusParser.useFlats) {
			return ChordPlusParser.flatKeys[indexOfNewKey];
		} else {
			return ChordPlusParser.sharpKeys[indexOfNewKey];
		}
	},
	transposeChord: function (chord) {

		var currentNote = chord.substr(0, 1);

		if (ChordPlusParser.noteNames.indexOf(currentNote) === -1)
			throw new Error('Error: Invalid note name --> ' + currentNote);

		var chordType = chord.substr(1);
		var secondCharacter = chord.substr(1, 1);

		if (secondCharacter === '#') {
			currentNote += '#';
			chordType = chord.substr(2);
		} else if (secondCharacter === 'b') {
			currentNote += 'b';
			chordType = chord.substr(2);
		}

		currentNote = ChordPlusParser.transposeNote(currentNote);

		chord = currentNote + chordType;

		// Transpose over key note
		if (chord.indexOf('/') > -1) {
			var overKey = chord.substr(chord.indexOf('/') + 1);
			chord = chord.substr(0, chord.indexOf('/')) + '/' + ChordPlusParser.transposeNote(overKey);
		}

		return chord;
	},
	getItemType: function (value) {

		var firstCharacter = value.substr(0, 1);
		var lastCharacter = value.substr(value.length - 1, 1);
		var firstThreeCharacters = value.substr(0, 3);

		if (firstCharacter === '[' && lastCharacter === ']') {

			return {
				type: 'section',
				value: value.substr(1, value.length - 2).replaceAll('-', ' ')
			};

		} else if (ChordPlusParser.symbolsLookup.indexOf(firstThreeCharacters) !== -1) {

			if (firstThreeCharacters === ':]]') {
				var times = value.length > 3 ? value.substr(3) : null;

				return {
					type: 'repeat',
					value: firstThreeCharacters,
					times: parseInt(times) === 2 ? null : times
				};
			}

			return {
				type: 'symbol',
				value: value
			};

		} else if (firstCharacter === '"') {

			return {
				type: 'label',
				value: value.replaceAll('"', '').replaceAll('-', ' ')
			};

		} else if (firstCharacter === '\'') {

			return {
				type: 'comment',
				value: value.replaceAll('\'', '').replaceAll('-', ' ')
			};

		} else if (value.substr(0, 2) === '[[') {

			// Update useflats
			var newKeyInLine = value.substr(2);
			ChordPlusParser.useFlats = ChordPlusParser.keysWithFlats.indexOf(newKeyInLine) > -1;

		} else if (firstCharacter === '(') {

			value = value.replaceAll('(', '').replaceAll(')', '');

			var splittedNotes = value.split(',');
			var noteSeries = [];

			splittedNotes.forEach(function (splittedValue) {
				if (ChordPlusParser.steps !== 0 || ChordPlusParser.useFlats) {
					noteSeries.push(ChordPlusParser.transposeNote(splittedValue));
				} else {
					noteSeries.push(splittedValue);
				}
			});

			return {
				type: 'chord',
				value: '(' + noteSeries.join(',') + ')'
			};

		} else {

			var chord = value;
			var timing = null;
			var type = 'chord';

			var hasTiming = chord.indexOf(':') !== -1;

			if (hasTiming) {

				var splittedValue = value.split(':');

				chord = splittedValue[0];
				timing = splittedValue[1];
				timing = timing.split(',').map(function (item) {
					if (ChordPlusParser.notesDurationLookup.indexOf(item) === -1)
						throw new Error('Error: Invalid note duration --> ' + item);

					return item;
				});

				if (chord === 'r')
					type = 'rest';
			}

			return {
				type: type,
				value: (function () {
					if (chord === 'x' || chord === 'r')
						return null;
					else if (chord === '%')
						return chord;
					else
						return ChordPlusParser.transposeChord(chord);
				})(),
				timing: timing
			};
		}

		return {
			type: null,
			value: null
		};
	},
	parse: function (sourceCode, key, newKey) {

		ChordPlusParser.steps = 0;
		ChordPlusParser.useFlats = false;

		if (typeof key === 'undefined' || key === '' || !key) {
			key = 'C';
			ChordPlusParser.useFlats = true;			
		}

		if (ChordPlusParser.keys.indexOf(key) === -1) {
			throw new Error('Error: Invalid value for key --> ' + key);
		}

		// Parse song body
		var indexOfKey = ChordPlusParser.sharpKeys.indexOf(key);
		if (indexOfKey === -1) {
			indexOfKey = ChordPlusParser.flatKeys.indexOf(key);
		}

		if (typeof newKey !== 'undefined' && newKey !== '' && newKey) {

			if (ChordPlusParser.keys.indexOf(newKey) === -1) {
				throw new Error('Error: Invalid value for new key --> ' + key);
			}

			var indexOfNewKey = ChordPlusParser.sharpKeys.indexOf(newKey);
			if (indexOfNewKey === -1) {
				indexOfNewKey = ChordPlusParser.flatKeys.indexOf(newKey);
			}

			// Calculate semitone steps
			ChordPlusParser.steps = indexOfNewKey - indexOfKey;

			// Determine if flat notes should be used
			ChordPlusParser.useFlats = ChordPlusParser.keysWithFlats.indexOf(newKey) > -1;

			if (ChordPlusParser.steps !== 0 || ChordPlusParser.useFlats) {
				key = ChordPlusParser.transposeNote(key);
			}
		}

		var songBodyItems = sourceCode.trim().split(' ');
		var songBody = [];

		songBodyItems.forEach(function (value) {

			if (value === '') {
				return;
			}

			// Check for line break
			if ((value.match(/\s*[\r\n]+\s*/g) || []).length) {

				var values = value.trim().split(/\s*[\r\n]+\s*/g);

				values.forEach(function (value, index) {
					songBody.push(ChordPlusParser.getItemType(value));

					if (index < (values.length - 1)) {
						songBody.push({ type: 'break' });
					}
				});

			} else {

				songBody.push(ChordPlusParser.getItemType(value));
			}

		});

		return songBody;
	}
};

module.exports = {
	parse: ChordPlusParser.parse,
	keys: ChordPlusParser.keys
};