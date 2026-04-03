<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\BodyClasses;
use ReflectionClass;

/**
 * Integration tests for the BodyClasses feature.
 *
 * Confirms that custom body classes and post classes are appended (or not)
 * based on the stored post meta values.
 */
class BodyClassesTest extends WPTestCase
{
	/**
	 * Post ID used across tests in this class.
	 *
	 * @var int
	 */
	private int $post_id;

	/**
	 * Create a test post and register post meta before each test.
	 */
	public function set_up(): void
	{
		parent::set_up();

		// Make sure meta is registered (normally on the init action).
		BodyClasses::register_post_meta();

		$this->post_id = self::factory()->post->create( [ 'post_status' => 'publish' ] );
	}

	// -------------------------------------------------------------------------
	// body_class filter
	// -------------------------------------------------------------------------

	/**
	 * When a post has body classes stored in meta and is singular,
	 * add_body_classes() must append them to the class list.
	 */
	public function test_add_body_classes_appends_custom_classes(): void
	{
		update_post_meta( $this->post_id, BodyClasses::META_KEY_BODY_CLASSES, 'bg-blue card' );

		// Simulate a singular post request.
		$this->go_to( get_permalink( $this->post_id ) );

		global $post;
		$post = get_post( $this->post_id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$classes = apply_filters( 'body_class', [] );

		$this->assertContains( 'bg-blue', $classes );
		$this->assertContains( 'card', $classes );
	}

	/**
	 * When the body class meta is empty, the class list must remain unchanged.
	 */
	public function test_add_body_classes_does_nothing_without_meta(): void
	{
		$this->go_to( get_permalink( $this->post_id ) );

		global $post;
		$post = get_post( $this->post_id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$original = [ 'existing-class' ];
		$classes  = apply_filters( 'body_class', $original );

		$this->assertSame( $original, $classes );
	}

	/**
	 * Body classes must not be added when the request is not singular.
	 */
	public function test_add_body_classes_skips_non_singular_context(): void
	{
		update_post_meta( $this->post_id, BodyClasses::META_KEY_BODY_CLASSES, 'my-class' );

		// Simulate a non-singular context by navigating to the home page.
		$this->go_to( '/' );

		$classes = apply_filters( 'body_class', [] );

		$this->assertNotContains( 'my-class', $classes );
	}

	// -------------------------------------------------------------------------
	// post_class filter
	// -------------------------------------------------------------------------

	/**
	 * add_post_classes() must append classes when meta is set and
	 * use_in_post_loop is truthy.
	 */
	public function test_add_post_classes_appends_custom_classes(): void
	{
		update_post_meta( $this->post_id, BodyClasses::META_KEY_BODY_CLASSES, 'featured highlight' );
		update_post_meta( $this->post_id, BodyClasses::META_KEY_USE_IN_POST_LOOP, true );

		global $post;
		$post = get_post( $this->post_id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$classes = apply_filters( 'post_class', [], '', $this->post_id );

		$this->assertContains( 'featured', $classes );
		$this->assertContains( 'highlight', $classes );
	}

	/**
	 * add_post_classes() must not add anything when use_in_post_loop is false.
	 */
	public function test_add_post_classes_skips_when_use_in_post_loop_is_false(): void
	{
		update_post_meta( $this->post_id, BodyClasses::META_KEY_BODY_CLASSES, 'my-class' );
		update_post_meta( $this->post_id, BodyClasses::META_KEY_USE_IN_POST_LOOP, false );

		global $post;
		$post = get_post( $this->post_id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$classes = apply_filters( 'post_class', [], '', $this->post_id );

		$this->assertNotContains( 'my-class', $classes );
	}

	// -------------------------------------------------------------------------
	// sanitize_classes()
	// -------------------------------------------------------------------------

	/**
	 * sanitize_classes() must trim extra whitespace and return unique classes.
	 */
	public function test_sanitize_classes_deduplicates_and_trims(): void
	{
		$result = BodyClasses::sanitize_classes( 'btn  btn  card ' );
		$this->assertSame( 'btn card', $result );
	}

	/**
	 * sanitize_classes() must strip characters outside the allowed set.
	 */
	public function test_sanitize_classes_strips_invalid_characters(): void
	{
		$result = BodyClasses::sanitize_classes( 'valid invalid!class' );
		$this->assertStringNotContainsString( '!', $result );
	}

	/**
	 * sanitize_classes() must return an empty string for empty input.
	 */
	public function test_sanitize_classes_returns_empty_for_empty_input(): void
	{
		$this->assertSame( '', BodyClasses::sanitize_classes( '' ) );
	}

	// -------------------------------------------------------------------------
	// get_supported_post_types()
	// -------------------------------------------------------------------------

	/**
	 * The default supported post types list must contain 'post' and 'page'.
	 */
	public function test_get_supported_post_types_includes_standard_types(): void
	{
		$types = BodyClasses::get_supported_post_types();

		$this->assertContains( 'post', $types );
		$this->assertContains( 'page', $types );
	}

	/**
	 * The filter css_class_manager_body_class_unsupported_post_types must be
	 * able to exclude a post type from the supported list.
	 */
	public function test_unsupported_post_types_filter_excludes_type(): void
	{
		// Reset static cache to force re-computation.
		$reflection = new ReflectionClass( BodyClasses::class );
		$property   = $reflection->getProperty( 'cached_supported_post_types' );
		$property->setAccessible( true );
		$property->setValue( null, [] );

		add_filter(
			'css_class_manager_body_class_unsupported_post_types',
			static fn( $types ) => array_merge( $types, [ 'post' ] )
		);

		$types = BodyClasses::get_supported_post_types();
		$this->assertNotContains( 'post', $types );

		// Clean up: reset the cache again and remove filter.
		$property->setValue( null, [] );
		remove_all_filters( 'css_class_manager_body_class_unsupported_post_types' );
	}
}
