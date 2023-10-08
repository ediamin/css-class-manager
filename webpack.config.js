const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

function resolve( ...paths ) {
    return path.resolve( __dirname, ...paths );
}

/** @type {import('webpack').Configuration} */
module.exports = {
    ...defaultConfig,

    entry: {
        'css-class-manager': resolve( 'assets', 'src', 'css-class-manager', 'index.ts' ),
    },

    output: {
        filename: '[name]/index.js',
        path: resolve( 'assets', 'dist' ),
    },
};
