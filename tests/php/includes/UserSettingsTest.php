<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\UserSettings;

/**
 * Integration tests for the UserSettings class.
 *
 * Verifies that user preferences are stored in user meta and that changes
 * to one user's settings do not affect other users.
 */
class UserSettingsTest extends WPTestCase
{
	/**
	 * Test user IDs created for each test.
	 *
	 * @var int[]
	 */
	private array $user_ids = [];

	/**
	 * Create test users and register the user meta before each test.
	 */
	public function set_up(): void
	{
		parent::set_up();

		// Make sure the meta is registered (normally done on the init action).
		UserSettings::register_settings();

		$this->user_ids = [
			'user_a' => self::factory()->user->create( [ 'role' => 'editor' ] ),
			'user_b' => self::factory()->user->create( [ 'role' => 'editor' ] ),
		];
	}

	/**
	 * A freshly created user should receive the default settings.
	 */
	public function test_default_settings_are_returned_for_new_user(): void
	{
		$settings = css_class_manager()->get_user_settings( $this->user_ids['user_a'] );

		$this->assertIsArray( $settings );
		$this->assertArrayHasKey( 'allowAddingClassNamesWithoutCreating', $settings );
		$this->assertArrayHasKey( 'hideThemeJSONGeneratedClasses', $settings );
		$this->assertArrayHasKey( 'inspectorControlPosition', $settings );
	}

	/**
	 * Storing a preference for one user must not affect another user.
	 */
	public function test_user_settings_are_isolated_per_user(): void
	{
		$user_a = $this->user_ids['user_a'];
		$user_b = $this->user_ids['user_b'];

		// Update user_a's preference only.
		update_user_meta(
			$user_a,
			UserSettings::META_KEY,
			[ 'inspectorControlPosition' => 'own-panel' ]
		);

		$settings_a = css_class_manager()->get_user_settings( $user_a );
		$settings_b = css_class_manager()->get_user_settings( $user_b );

		$this->assertSame( 'own-panel', $settings_a['inspectorControlPosition'] );
		$this->assertSame( 'default', $settings_b['inspectorControlPosition'] );
	}

	/**
	 * Updated settings must be merged with defaults so missing keys still resolve.
	 */
	public function test_partial_update_merges_with_defaults(): void
	{
		$user_id = $this->user_ids['user_a'];

		// Store only one key.
		update_user_meta(
			$user_id,
			UserSettings::META_KEY,
			[ 'hideThemeJSONGeneratedClasses' => true ]
		);

		$settings = css_class_manager()->get_user_settings( $user_id );

		// The stored key should reflect the update.
		$this->assertTrue( $settings['hideThemeJSONGeneratedClasses'] );

		// Other keys should still be present (merged from defaults).
		$this->assertArrayHasKey( 'allowAddingClassNamesWithoutCreating', $settings );
		$this->assertArrayHasKey( 'inspectorControlPosition', $settings );
	}

	/**
	 * get_user_settings() without a user_id argument must fall back to the current user.
	 */
	public function test_get_user_settings_defaults_to_current_user(): void
	{
		$user_id = $this->user_ids['user_a'];
		wp_set_current_user( $user_id );

		update_user_meta( $user_id, UserSettings::META_KEY, [ 'inspectorControlPosition' => 'own-panel' ] );

		$settings = css_class_manager()->get_user_settings();
		$this->assertSame( 'own-panel', $settings['inspectorControlPosition'] );
	}
}
