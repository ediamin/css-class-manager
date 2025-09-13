<?php

declare(strict_types = 1);

define( 'TESTS_PLUGIN_DIR', dirname( __DIR__ ) );

// Determine correct location for plugins directory to use.
if ( getenv( 'WP_PLUGIN_DIR' ) !== false ) {
	define( 'WP_PLUGIN_DIR', getenv( 'WP_PLUGIN_DIR' ) );
} else {
	define( 'WP_PLUGIN_DIR', dirname( TESTS_PLUGIN_DIR ) );
}

// When run in wp-env context, set the test config file path.
if ( ! defined( 'WP_TESTS_CONFIG_FILE_PATH' ) && getenv( 'WP_PHPUNIT__TESTS_CONFIG' ) !== false ) {
	define( 'WP_TESTS_CONFIG_FILE_PATH', getenv( 'WP_PHPUNIT__TESTS_CONFIG' ) );
}

// Load Composer dependencies if applicable.
if ( file_exists( TESTS_PLUGIN_DIR . '/vendor/autoload.php' ) ) {
	require_once TESTS_PLUGIN_DIR . '/vendor/autoload.php';
}

/**
 * Retrieves the path to the WordPress `tests/phpunit/` directory.
 *
 * The path will be determined based on the following, in this order:
 * - The `WP_TESTS_DIR` environment variable, if set.
 *   This environment variable can be set in the OS or via a custom `phpunit.xml` file
 *   and should point to the `tests/phpunit` directory of a WordPress clone.
 *
 * - The `WP_DEVELOP_DIR` environment variable, if set.
 *   This environment variable can be set in the OS or via a custom `phpunit.xml` file
 *   and should point to the root directory of a WordPress clone.
 *
 * - The plugin potentially being installed in a WordPress install.
 *   In that case, the plugin is expected to be in the `src/wp-content/plugin/plugin-name` directory.
 *
 * - The plugin using a test setup as typically created by the WP-CLI scaffold command,
 *   which creates directories with the relevant test files in the system temp directory.
 *
 * Note: The path will be checked to make sure it is a valid path and actually points to
 * a directory containing the `includes/bootstrap.php` file which is required as this file is
 * used to load WP environment to run tests.
 */
if ( getenv( 'WP_TESTS_DIR' ) !== false ) {
	$_test_root = getenv( 'WP_TESTS_DIR' );
} elseif ( getenv( 'WP_DEVELOP_DIR' ) !== false ) {
	$_test_root = getenv( 'WP_DEVELOP_DIR' ) . '/tests/phpunit';
} elseif ( getenv( 'WP_PHPUNIT__DIR' ) !== false ) {
	$_test_root = getenv( 'WP_PHPUNIT__DIR' );
} elseif ( file_exists( TESTS_PLUGIN_DIR . '/../../../../tests/phpunit/includes/functions.php' ) ) {
	$_test_root = TESTS_PLUGIN_DIR . '/../../../../tests/phpunit';
} else {
	// Fallback.
	$_test_root = '/tmp/wordpress-tests-lib';
}

// Force plugin to be active.
// phpcs:ignore SlevomatCodingStandard.Variables.DisallowSuperGlobalVariable.DisallowedSuperGlobalVariable
$GLOBALS['wp_tests_options'] = [
	'active_plugins' => [ basename( TESTS_PLUGIN_DIR ) . '/css-class-manager.php' ],
];

// Add filter to ensure the plugin's admin integration and all modules are loaded for tests.
require_once $_test_root . '/includes/functions.php';
tests_add_filter(
	'plugins_loaded',
	static function (): void {
		require_once TESTS_PLUGIN_DIR . '/css-class-manager.php';
	},
	1
);

// Start up the WP testing environment.
require $_test_root . '/includes/bootstrap.php';
