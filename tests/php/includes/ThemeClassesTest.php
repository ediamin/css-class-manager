<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\ClassPreset;
use CSSClassManager\ThemeClasses;
use CSSClassManager\UserSettings;

/**
 * Integration tests for the ThemeClasses class.
 *
 * Uses the css_class_manager_theme_classes_css filter to inject mock CSS,
 * bypassing the actual theme.json calls, and verifies that the extracted
 * class names are appended to the preset list.
 */
class ThemeClassesTest extends WPTestCase
{
	/**
	 * User ID used throughout the test class.
	 *
	 * @var int
	 */
	private int $user_id;

	/**
	 * Create and authenticate a test user and register user meta before each test.
	 */
	public function set_up(): void
	{
		parent::set_up();

		UserSettings::register_settings();

		$this->user_id = self::factory()->user->create( [ 'role' => 'editor' ] );
		wp_set_current_user( $this->user_id );
	}

	/**
	 * Clean up after each test.
	 */
	public function tear_down(): void
	{
		remove_all_filters( 'css_class_manager_theme_classes_css' );
		remove_all_filters( 'css_class_manager_filtered_class_names' );
		parent::tear_down();
	}

	/**
	 * When the injected CSS contains class selectors, those class names must be
	 * appended to the preset list as dynamic ClassPreset objects.
	 */
	public function test_add_theme_classes_appends_classes_from_css(): void
	{
		// Ensure the user's preference allows theme classes.
		update_user_meta(
			$this->user_id,
			UserSettings::META_KEY,
			[ 'hideThemeJSONGeneratedClasses' => false ]
		);

		add_filter(
			'css_class_manager_theme_classes_css',
			static fn() => '.theme-color-primary { color: red; } .theme-color-secondary { color: blue; }'
		);

		$result = ThemeClasses::add_theme_classes( [] );
		$names  = array_map(
			static fn( ClassPreset $p ) => $p->get_name(),
			$result
		);

		$this->assertContains( 'theme-color-primary', $names );
		$this->assertContains( 'theme-color-secondary', $names );
	}

	/**
	 * When hideThemeJSONGeneratedClasses is true, the existing class list must
	 * be returned unchanged.
	 */
	public function test_add_theme_classes_returns_unchanged_when_hidden(): void
	{
		update_user_meta(
			$this->user_id,
			UserSettings::META_KEY,
			[ 'hideThemeJSONGeneratedClasses' => true ]
		);

		add_filter(
			'css_class_manager_theme_classes_css',
			static fn() => '.should-not-appear { color: green; }'
		);

		$initial_classes = [ new ClassPreset( 'existing' ) ];
		$result          = ThemeClasses::add_theme_classes( $initial_classes );

		// Result must be identical to the input — no classes added.
		$this->assertSame( $initial_classes, $result );
	}

	/**
	 * When the injected CSS is empty, no new presets must be added.
	 */
	public function test_add_theme_classes_handles_empty_css(): void
	{
		update_user_meta(
			$this->user_id,
			UserSettings::META_KEY,
			[ 'hideThemeJSONGeneratedClasses' => false ]
		);

		add_filter( 'css_class_manager_theme_classes_css', static fn() => '' );

		$result = ThemeClasses::add_theme_classes( [] );
		$this->assertEmpty( $result );
	}

	/**
	 * The appended presets must have isDynamic set to true.
	 */
	public function test_theme_class_presets_are_marked_as_dynamic(): void
	{
		update_user_meta(
			$this->user_id,
			UserSettings::META_KEY,
			[ 'hideThemeJSONGeneratedClasses' => false ]
		);

		add_filter(
			'css_class_manager_theme_classes_css',
			static fn() => '.dynamic-class { font-size: 1rem; }'
		);

		$result = ThemeClasses::add_theme_classes( [] );

		$this->assertNotEmpty( $result );

		foreach ( $result as $preset ) {
			$data = $preset->jsonSerialize();
			$this->assertTrue(
				$data['isDynamic'],
				'Theme-derived presets should be marked as dynamic'
			);
		}
	}
}
