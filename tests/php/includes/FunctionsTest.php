<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use Yoast\PHPUnitPolyfills\TestCases\TestCase;

/**
 * Tests for global helper functions in functions.php.
 */
class FunctionsTest extends TestCase
{
	/**
	 * Standard alphanumeric characters must pass through unchanged.
	 */
	public function test_alphanumeric_characters_pass_through(): void
	{
		$this->assertSame( 'myClass123', css_class_manager_sanitize_html_class( 'myClass123' ) );
	}

	/**
	 * Hyphens and underscores are valid in CSS class names.
	 */
	public function test_hyphens_and_underscores_are_allowed(): void
	{
		$this->assertSame( 'my-class_name', css_class_manager_sanitize_html_class( 'my-class_name' ) );
	}

	/**
	 * Colons are allowed — they are used by Tailwind CSS utility classes.
	 */
	public function test_colon_is_allowed_for_tailwind_utilities(): void
	{
		$this->assertSame( 'sm:text-lg', css_class_manager_sanitize_html_class( 'sm:text-lg' ) );
		$this->assertSame( 'dark:bg-gray-950', css_class_manager_sanitize_html_class( 'dark:bg-gray-950' ) );
		$this->assertSame( 'hover:decoration-2', css_class_manager_sanitize_html_class( 'hover:decoration-2' ) );
	}

	/**
	 * Spaces must be stripped out because they delimit separate class names.
	 */
	public function test_spaces_are_stripped(): void
	{
		$this->assertSame( 'my-class', css_class_manager_sanitize_html_class( 'my class' ) );
	}

	/**
	 * Percent-encoded sequences must be removed entirely.
	 */
	public function test_percent_encoded_characters_are_removed(): void
	{
		$this->assertSame( 'myclass', css_class_manager_sanitize_html_class( 'my%20class' ) );
		$this->assertSame( 'myclass', css_class_manager_sanitize_html_class( 'my%2Fclass' ) );
	}

	/**
	 * Special characters that are not in the allowed set must be stripped.
	 */
	public function test_special_characters_are_stripped(): void
	{
		$this->assertSame( 'my-class', css_class_manager_sanitize_html_class( 'my-class!' ) );
		$this->assertSame( 'myclass', css_class_manager_sanitize_html_class( 'my.class' ) );
		$this->assertSame( 'myclass', css_class_manager_sanitize_html_class( 'my@class' ) );
	}

	/**
	 * An empty string must remain empty.
	 */
	public function test_empty_string_returns_empty_string(): void
	{
		$this->assertSame( '', css_class_manager_sanitize_html_class( '' ) );
	}

	/**
	 * A string consisting only of stripped characters must become empty.
	 */
	public function test_all_invalid_characters_returns_empty_string(): void
	{
		$this->assertSame( '', css_class_manager_sanitize_html_class( '!@#$%^&*()' ) );
	}
}
