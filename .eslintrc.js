const defaultConfig = require( '@wordpress/scripts/config/.eslintrc' );

module.exports = {
	...defaultConfig,
	rules: {
		...defaultConfig.rules,
		'@wordpress/i18n-text-domain': [
			'error',
			{
				allowedTextDomain: [ 'css-class-manager' ],
			},
		],
		// The plugin is using some `__experimental` APIs.
		'@wordpress/no-unsafe-wp-apis': 'off',
		'import/order': [
			'error',
			{
				groups: [
					'builtin',
					'external',
					'parent',
					'sibling',
					'index',
					'type',
				],
				pathGroups: [
					{
						group: 'external',
						pattern: '@wordpress/**',
					},
				],
				alphabetize: {
					caseInsensitive: true,
					order: 'asc',
				},
				pathGroupsExcludedImportTypes: [ 'type' ],
				'newlines-between': 'always',
			},
		],
		'sort-imports': [
			'error',
			{
				// Handled by the import/order.
				ignoreDeclarationSort: true,
			},
		],
	},
};
