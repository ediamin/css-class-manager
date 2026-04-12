<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\BodyClasses;
use CSSClassManager\Enqueue;
use CSSClassManager\L10N;
use CSSClassManager\Settings;
use CSSClassManager\ThemeClasses;
use CSSClassManager\UserSettings;

/**
 * Integration tests for hook registrations in the Hooks class.
 *
 * Each assertion confirms that a specific WordPress action or filter is
 * attached at the expected priority.
 */
class HooksTest extends WPTestCase
{
	/**
	 * The textdomain loader must be registered on the init action.
	 */
	public function test_l10n_load_textdomain_hook(): void
	{
		$this->assertNotFalse(
			has_action( 'init', [ L10N::class, 'load_plugin_textdomain' ] )
		);
	}

	/**
	 * User settings registration must be hooked to init.
	 */
	public function test_user_settings_register_hook(): void
	{
		$this->assertNotFalse(
			has_action( 'init', [ UserSettings::class, 'register_settings' ] )
		);
	}

	/**
	 * REST settings registration must be hooked to rest_api_init.
	 */
	public function test_settings_rest_register_hook(): void
	{
		$this->assertNotFalse(
			has_action( 'rest_api_init', [ Settings::class, 'register_settings' ] )
		);
	}

	/**
	 * Body classes post meta registration must be hooked to init at priority 1000.
	 */
	public function test_body_classes_register_post_meta_hook(): void
	{
		$this->assertSame(
			1000,
			has_action( 'init', [ BodyClasses::class, 'register_post_meta' ] )
		);
	}

	/**
	 * The body classes localized data filter must be registered.
	 */
	public function test_body_classes_localized_data_filter(): void
	{
		$this->assertNotFalse(
			has_filter( 'css_class_manager_localized_data', [ BodyClasses::class, 'add_localized_data' ] )
		);
	}

	/**
	 * The body_class filter must be registered.
	 */
	public function test_body_class_filter(): void
	{
		$this->assertNotFalse(
			has_filter( 'body_class', [ BodyClasses::class, 'add_body_classes' ] )
		);
	}

	/**
	 * The post_class filter must be registered.
	 */
	public function test_post_class_filter(): void
	{
		$this->assertNotFalse(
			has_filter( 'post_class', [ BodyClasses::class, 'add_post_classes' ] )
		);
	}

	/**
	 * Script registration must be hooked to init.
	 */
	public function test_enqueue_register_scripts_hook(): void
	{
		$this->assertNotFalse(
			has_action( 'init', [ Enqueue::class, 'register_scripts' ] )
		);
	}

	/**
	 * Block editor asset enqueueing must be hooked to enqueue_block_editor_assets.
	 */
	public function test_enqueue_block_editor_assets_hook(): void
	{
		$this->assertNotFalse(
			has_action( 'enqueue_block_editor_assets', [ Enqueue::class, 'enqueue_block_editor_assets' ] )
		);
	}

	/**
	 * The theme classes filter must be registered on css_class_manager_filtered_class_names.
	 */
	public function test_theme_classes_filter(): void
	{
		$this->assertNotFalse(
			has_filter(
				'css_class_manager_filtered_class_names',
				[ ThemeClasses::class, 'add_theme_classes' ]
			)
		);
	}
}
