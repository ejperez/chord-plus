var chordPlus = require( '../src/chord-plus.js' );
var assert = require( 'assert' );

var tests = [
	{
		title: 'Defaults',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n";
			var result = chordPlus.parse( testString );

			assert( result.title === '', 'Title should be empty' );
			assert( result.artists === '', 'Artists should be empty' );
			assert( result.key === 'C', 'Key should be C' );
			assert( result.comment === '', 'Comment should be empty' );
			assert( result.bpm === '100', 'BPM should be 100' );
			assert( result.meter === '4/4', 'Meter should be 4/4' );
			assert( result.body.length === 0, 'Body should be empty array' );
		}
	},
	{
		title: 'Section with chords',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n[Intro] C G";
			var result = chordPlus.parse( testString );

			assert( result.body[0].type === 'section', 'First item must be a section' );
			assert( result.body[1].type === 'chord', 'Second item must be a chord' );
			assert( result.body[2].type === 'chord', 'Third item must be a chord' );
		}
	},
	{
		title: 'Symbols and Repetition',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n[[: | [[ [[_  :]]3 :]]2";
			var result = chordPlus.parse( testString );

			assert( result.body[0].type === 'symbol', 'First item must be a symbol' );
			assert( result.body[1].type === 'symbol', 'Second item must be a symbol' );
			assert( result.body[2].type === 'symbol', 'Third item must be a symbol' );
			assert( result.body[3].type === 'symbol', 'Fourth item must be a symbol' );
			assert( result.body[4].type === 'repeat', 'Fifth item must be a repeat' );
			assert( result.body[4].times === '3', 'Fifth item repeat must be 3' );
			assert( result.body[5].type === 'repeat', 'Sixth item must be a repeat' );
			assert( result.body[5].times === null, 'Sixth item repeat must be null' );
		}
	},
	{
		title: 'Labels and Comments',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\n\"This-is-a-label '(This-is-a-comment)";
			var result = chordPlus.parse( testString );

			assert( result.body[0].type === 'label', 'First item must be a label' );
			assert( result.body[0].value.indexOf( '-' ), 'Hypens must be replaced' );
			assert( result.body[1].type === 'comment', 'Second item must be a comment' );
			assert( result.body[1].value.indexOf( '-' ), 'Hypens must be replaced' );
		}
	},
	{
		title: 'Transpose Up',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\nC Dm Em F G A Bdim";
			var result = chordPlus.parse( testString, 'D' );
			var stringResult = result.body.map( function ( item ) { return item.value; } ).join( ' ' )
			var expectedResult = 'D Em F#m G A B C#dim';

			assert( stringResult === expectedResult, 'Should be ' + expectedResult );
		}
	},
	{
		title: 'Transpose Down',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\nC Dm Em F G A Bdim";
			var result = chordPlus.parse( testString, 'Bb' );
			var stringResult = result.body.map( function ( item ) { return item.value; } ).join( ' ' )
			var expectedResult = 'Bb Cm Dm Eb F G Adim';

			assert( stringResult === expectedResult, 'Should be ' + expectedResult );
		}
	},
	{
		title: 'Invalid Timing',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\nC:1,2,4,8,16,1.,2.,4.,8.,16.,1_,2_,4_,8_,16_,1._,2._,4._,8._,16._,12";

			assert.throws( function () {
				chordPlus.parse( testString )
			}, /Invalid note duration/, 'Should throw invalid note duration' );
		}
	},
	{
		title: 'Invalid Note',
		test: function () {
			var testString = "title:\nartists:\nkey:C\ncomment:\nbpm:100\nmeter:4/4\nbody:\nA B C D E F G x r H";

			assert.throws( function () {
				chordPlus.parse( testString )
			}, /Invalid note name/, 'Should throw invalid note name' );
		}
	}
];

for ( var key in tests ) {
	var test = tests[key];

	test.test();
	console.log( 'TEST ' + ( parseInt( key ) + 1 ) + ': ' + test.title + ' PASSED' );
}