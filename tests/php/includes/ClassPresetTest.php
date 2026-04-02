<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\ClassPreset;
use CSSClassManager\Settings;

/**
 * Integration tests for the ClassPreset class and Settings::sanitize_class_names().
 */
class ClassPresetTest extends WPTestCase
{
	/**
	 * Clean up the stored option after every test.
	 */
	public function tear_down(): void
	{
		delete_option( Settings::OPTION_CLASS_NAMES );
		parent::tear_down();
	}

	// -------------------------------------------------------------------------
	// ClassPreset unit-style tests (no WP DB required but grouped here for
	// convenience because they test the same domain object used in settings).
	// -------------------------------------------------------------------------

	/**
	 * get_name() must return the name passed to the constructor.
	 */
	public function test_get_name_returns_constructor_value(): void
	{
		$preset = new ClassPreset( 'my-class' );
		$this->assertSame( 'my-class', $preset->get_name() );
	}

	/**
	 * jsonSerialize() must include at minimum the name and priority keys.
	 */
	public function test_json_serialize_includes_required_keys(): void
	{
		$preset = new ClassPreset( 'btn', 'A button class', false, 5 );
		$data   = $preset->jsonSerialize();

		$this->assertSame( 'btn', $data['name'] );
		$this->assertSame( 5, $data['priority'] );
		$this->assertSame( 'A button class', $data['description'] );
		$this->assertFalse( $data['isDynamic'] );
	}

	/**
	 * Optional description and isDynamic must be omitted when not set.
	 */
	public function test_json_serialize_omits_null_optional_fields(): void
	{
		$preset = new ClassPreset( 'btn' );
		$data   = $preset->jsonSerialize();

		$this->assertArrayNotHasKey( 'description', $data );
		$this->assertArrayNotHasKey( 'isDynamic', $data );
	}

	// -------------------------------------------------------------------------
	// Settings::sanitize_class_names() integration tests
	// -------------------------------------------------------------------------

	/**
	 * An empty array must produce an empty array.
	 */
	public function test_sanitize_empty_input_returns_empty_array(): void
	{
		$result = Settings::sanitize_class_names( [] );
		$this->assertSame( [], $result );
	}

	/**
	 * Valid class names must survive sanitization unchanged.
	 */
	public function test_sanitize_valid_class_names(): void
	{
		$input  = [
			[ 'name' => 'my-button', 'description' => 'A button' ],
			[ 'name' => 'card-header', 'description' => '' ],
		];
		$result = Settings::sanitize_class_names( $input );
		$names  = array_column( $result, 'name' );

		$this->assertContains( 'my-button', $names );
		$this->assertContains( 'card-header', $names );
	}

	/**
	 * Duplicates in the input must be collapsed to a single entry.
	 */
	public function test_sanitize_deduplicates_entries(): void
	{
		$input  = [
			[ 'name' => 'btn', 'description' => 'First' ],
			[ 'name' => 'btn', 'description' => 'Second (duplicate)' ],
		];
		$result = Settings::sanitize_class_names( $input );
		$names  = array_column( $result, 'name' );

		$this->assertCount( 1, array_keys( $names, 'btn' ) );
	}

	/**
	 * Entries with blank names must be discarded.
	 */
	public function test_sanitize_discards_empty_names(): void
	{
		$input  = [
			[ 'name' => '', 'description' => '' ],
			[ 'name' => 'valid', 'description' => '' ],
		];
		$result = Settings::sanitize_class_names( $input );

		foreach ( $result as $item ) {
			$this->assertNotEmpty( $item['name'] );
		}
	}

	/**
	 * The output must be sorted alphabetically (case-insensitive) by name.
	 */
	public function test_sanitize_sorts_results_alphabetically(): void
	{
		$input  = [
			[ 'name' => 'zebra', 'description' => '' ],
			[ 'name' => 'apple', 'description' => '' ],
			[ 'name' => 'Mango', 'description' => '' ],
		];
		$result = Settings::sanitize_class_names( $input );
		$names  = array_column( $result, 'name' );

		$sorted = $names;
		usort(
			$sorted,
			static fn( $a, $b ) => strcasecmp( $a, $b )
		);

		$this->assertSame( $sorted, $names );
	}

	/**
	 * Descriptions must be sanitized as plain text (no HTML).
	 */
	public function test_sanitize_strips_html_from_description(): void
	{
		$input  = [
			[
				'name'        => 'my-class',
				'description' => '<script>alert("xss")</script>My description',
			],
		];
		$result = Settings::sanitize_class_names( $input );

		$this->assertStringNotContainsString( '<script>', $result[0]['description'] );
		$this->assertStringContainsString( 'My description', $result[0]['description'] );
	}

	/**
	 * Options stored and then retrieved must match the sanitized input.
	 */
	public function test_update_and_retrieve_option(): void
	{
		$class_names = [
			[ 'name' => 'header-bg', 'description' => 'Header background' ],
		];

		update_option( Settings::OPTION_CLASS_NAMES, $class_names );
		$stored = get_option( Settings::OPTION_CLASS_NAMES, [] );

		$this->assertSame( $class_names, $stored );
	}
}
