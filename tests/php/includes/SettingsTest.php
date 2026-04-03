<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\Settings;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Integration tests for the Settings class and its REST API registration.
 */
class SettingsTest extends WPTestCase
{
	/**
	 * REST server instance.
	 *
	 * @var WP_REST_Server
	 */
	private WP_REST_Server $server;

	/**
	 * Set up the REST server and authenticate as an administrator.
	 */
	public function set_up(): void
	{
		parent::set_up();

		global $wp_rest_server;
		$wp_rest_server = new WP_REST_Server(); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$this->server   = $wp_rest_server;
		do_action( 'rest_api_init' );

		// Authenticate as an administrator so that settings endpoints are accessible.
		$admin_id = self::factory()->user->create( [ 'role' => 'administrator' ] );
		wp_set_current_user( $admin_id );
	}

	/**
	 * Tear down the REST server after each test.
	 */
	public function tear_down(): void
	{
		global $wp_rest_server;
		$wp_rest_server = null; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		parent::tear_down();
	}

	/**
	 * The plugin's option key must be present in the /wp/v2/settings schema.
	 */
	public function test_settings_key_exists_in_rest_schema(): void
	{
		$request  = new WP_REST_Request( 'OPTIONS', '/wp/v2/settings' );
		$response = $this->server->dispatch( $request );
		$data     = $response->get_data();

		$this->assertArrayHasKey(
			'schema',
			$data,
			'OPTIONS response should contain a schema'
		);
		$this->assertArrayHasKey(
			Settings::OPTION_CLASS_NAMES,
			$data['schema']['properties'],
			'Plugin option key must appear in the settings schema'
		);
	}

	/**
	 * A GET request to /wp/v2/settings must return the plugin's option key.
	 */
	public function test_get_settings_returns_plugin_key(): void
	{
		$request  = new WP_REST_Request( 'GET', '/wp/v2/settings' );
		$response = $this->server->dispatch( $request );

		$this->assertSame( 200, $response->get_status() );
		$data = $response->get_data();

		$this->assertArrayHasKey( Settings::OPTION_CLASS_NAMES, $data );
	}

	/**
	 * Valid class names submitted via POST must be persisted and retrievable.
	 */
	public function test_post_valid_class_names_saves_them(): void
	{
		$class_names = [
			[ 'name' => 'my-button', 'description' => 'Primary button' ],
			[ 'name' => 'card-header', 'description' => '' ],
		];

		$request = new WP_REST_Request( 'POST', '/wp/v2/settings' );
		$request->set_param( Settings::OPTION_CLASS_NAMES, $class_names );
		$response = $this->server->dispatch( $request );

		$this->assertSame( 200, $response->get_status() );

		$stored = get_option( Settings::OPTION_CLASS_NAMES, [] );
		$names  = array_column( (array) $stored, 'name' );

		$this->assertContains( 'my-button', $names );
		$this->assertContains( 'card-header', $names );
	}

	/**
	 * Class names containing disallowed characters must be stripped by the sanitize callback.
	 */
	public function test_sanitize_callback_strips_invalid_characters(): void
	{
		$class_names = [
			[ 'name' => 'valid-class', 'description' => '' ],
			[ 'name' => 'invalid class!', 'description' => '' ],
		];

		$request = new WP_REST_Request( 'POST', '/wp/v2/settings' );
		$request->set_param( Settings::OPTION_CLASS_NAMES, $class_names );
		$this->server->dispatch( $request );

		$stored = get_option( Settings::OPTION_CLASS_NAMES, [] );
		$names  = array_column( (array) $stored, 'name' );

		// The invalid characters (space, !) must have been stripped by the sanitize callback.
		$this->assertContains( 'valid-class', $names );
		$this->assertNotContains( 'invalid class!', $names );
	}

	/**
	 * Duplicate class names must be deduplicated by the sanitize callback.
	 */
	public function test_sanitize_callback_deduplicates_class_names(): void
	{
		$class_names = [
			[ 'name' => 'my-class', 'description' => 'First' ],
			[ 'name' => 'my-class', 'description' => 'Duplicate' ],
		];

		$request = new WP_REST_Request( 'POST', '/wp/v2/settings' );
		$request->set_param( Settings::OPTION_CLASS_NAMES, $class_names );
		$this->server->dispatch( $request );

		$stored = get_option( Settings::OPTION_CLASS_NAMES, [] );
		$names  = array_column( (array) $stored, 'name' );

		$this->assertSame(
			count( array_unique( $names ) ),
			count( $names ),
			'Duplicate class names should not be stored'
		);
	}

	/**
	 * Empty class names must be discarded by the sanitize callback.
	 */
	public function test_sanitize_callback_discards_empty_names(): void
	{
		$class_names = [
			[ 'name' => '', 'description' => '' ],
			[ 'name' => 'valid-class', 'description' => '' ],
		];

		$request = new WP_REST_Request( 'POST', '/wp/v2/settings' );
		$request->set_param( Settings::OPTION_CLASS_NAMES, $class_names );
		$this->server->dispatch( $request );

		$stored = get_option( Settings::OPTION_CLASS_NAMES, [] );

		foreach ( (array) $stored as $item ) {
			$this->assertNotEmpty( $item['name'], 'Empty names must not be stored' );
		}
	}
}
