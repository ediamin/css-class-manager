const fs = require( 'fs' );
const path = require( 'path' );

const lines = [
	{
		file: 'composer.json',
		line: 4,
	},
	{
		file: 'css-class-manager.php',
		line: 6,
	},
	{
		file: 'includes/Plugin.php',
		line: 30,
	},
	{
		file: 'package-lock.json',
		line: 3,
	},
	{
		file: 'package-lock.json',
		line: 9,
	},
	{
		file: 'readme.txt',
		line: 7,
	},
];

// Get command line arguments
const [ , , fromVersion, toVersion ] = process.argv;

if ( ! fromVersion || ! toVersion ) {
	// eslint-disable-next-line no-console
	console.error(
		'Usage: node version-update.js <from-version> <to-version>'
	);
	process.exit( 1 );
}

// Update each file.
lines.forEach( ( { file, line } ) => {
	try {
		const filePath = path.join( __dirname, file );
		const content = fs.readFileSync( filePath, 'utf8' ).split( '\n' );

		// Replace version at specific line (zero-based index).
		content[ line - 1 ] = content[ line - 1 ].replace(
			fromVersion,
			toVersion
		);

		// Write back to file.
		fs.writeFileSync( filePath, content.join( '\n' ) );

		// eslint-disable-next-line no-console
		console.log( `Updated ${ file } successfully` );
	} catch ( error ) {
		// eslint-disable-next-line no-console
		console.error( `Error updating ${ file }:`, error.message );
	}
} );
