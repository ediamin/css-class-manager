const path = require( 'path' );

const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

function resolve( ...paths ) {
	return path.resolve( __dirname, ...paths );
}

const plugins = [];

defaultConfig.plugins.forEach( ( item ) => {
	if ( item.constructor.name.toLowerCase() === 'minicssextractplugin' ) {
		item.options.filename = '[name]/styles.css';
	}

	plugins.push( item );
} );

/** @type {import('webpack').Configuration} */
module.exports = {
	...defaultConfig,

	plugins,

	devtool: 'source-map',

	entry: {
		'css-class-manager': resolve(
			'assets',
			'src',
			'css-class-manager',
			'index.ts'
		),
	},

	output: {
		filename: '[name]/index.js',
		path: resolve( 'assets', 'dist' ),
	},
};
