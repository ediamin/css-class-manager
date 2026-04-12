/** @type {import('jest').Config} */
const config = {
	...require( '@wordpress/scripts/config/jest-unit.config' ),
	setupFiles: [ './tests/jest/setup.js' ],
	collectCoverageFrom: [
		'assets/src/**/*.{ts,tsx}',
		'!assets/src/**/*.d.ts',
		'!assets/src/**/types.ts',
	],
	coverageDirectory: 'coverage/js',
	coverageReporters: [ 'lcov', 'text-summary' ],
};

module.exports = config;
