<?php

declare(strict_types = 1);

namespace CSSClassManager;

use WP_Post;

/**
 * Controller for the body class feature.
 */
class BodyClasses
{
	/**
	 * Post meta key for storing body classes.
	 */
	public const META_KEY_BODY_CLASSES = 'css_class_manager_body_classes';

	/**
	 * Post meta key for storing post classes.
	 */
	public const META_KEY_USE_IN_POST_LOOP = 'css_class_manager_use_in_post_loop';

	/**
	 * Cache for supported post types.
	 *
	 * @var array<string, array{has_archive: bool}>
	 */
	private static array $cached_supported_post_types = [];

	/**
	 * Get supported post types for the body class feature.
	 *
	 * @return string[] List of supported post types.
	 */
	public static function get_supported_post_types(): array
	{
		if ( ! empty( self::$cached_supported_post_types ) ) {
			return self::$cached_supported_post_types;
		}

		/**
		 * Get all post types that support the block editor.
		 *
		 * @var string[] $post_types
		 */
		$post_types = get_post_types_by_support( 'custom-fields' );

		$unsupported_post_types = apply_filters(
			'css_class_manager_body_class_unsupported_post_types',
			[
				'wp_block',
			]
		);

		self::$cached_supported_post_types = array_reduce(
			$post_types,
			static function ( $acc, $post_type ) use ( $unsupported_post_types ) {
				if ( ! in_array( $post_type, $unsupported_post_types, true ) ) {
					$acc[] = $post_type;
				}

				return $acc;
			},
			[]
		);

		return self::$cached_supported_post_types;
	}

	/**
	 * Register post meta.
	 */
	public static function register_post_meta(): void
	{
		$post_types = self::get_supported_post_types();

		foreach ( $post_types as $post_type ) {
			register_post_meta(
				$post_type,
				self::META_KEY_BODY_CLASSES,
				[
					'auth_callback'     => static function () {
						return current_user_can( 'edit_posts' );
					},
					'default'           => '',
					'sanitize_callback' => [ self::class, 'sanitize_classes' ],
					'show_in_rest'      => true,
					'single'            => true,
					'type'              => 'string',
				]
			);

			register_post_meta(
				$post_type,
				self::META_KEY_USE_IN_POST_LOOP,
				[
					'auth_callback' => static function () {
						return current_user_can( 'edit_posts' );
					},
					'default'       => false,
					'show_in_rest'  => true,
					'single'        => true,
					'type'          => 'boolean',
				]
			);
		}
	}

	/**
	 * Sanitize the class names
	 *
	 * @param string $classes The class names to sanitize.
	 * @return string Sanitized class names.
	 */
	public static function sanitize_classes( string $classes ): string
	{
		if ( empty( $classes ) ) {
			return '';
		}

		// Split by spaces then sanitize each class.
		$class_array = preg_split( '/\s+/', $classes );
		$sanitized   = [];

		foreach ( $class_array as $class ) {
			$clean_class = css_class_manager_sanitize_html_class( $class );

			if ( empty( $clean_class ) ) {
				continue;
			}

			$sanitized[] = $clean_class;
		}

		return implode( ' ', array_unique( $sanitized ) );
	}

	/**
	 * Add localized data for the body class feature.
	 *
	 * @param array<string, mixed> $data Existing localized data.
	 * @return array<string, mixed> Modified localized data.
	 */
	public static function add_localized_data( array $data ): array
	{
		$data['bodyClasses'] = [
			'supportedPostTypes' => self::get_supported_post_types(),
		];

		return $data;
	}

	/**
	 * Filters the list of CSS body class names for the current post or page.
	 *
	 * @param string[] $classes   An array of body class names.
	 */
	public static function add_body_classes( array $classes ): array
	{
		global $post;

		if (
			! is_single()
			|| ! $post instanceof WP_Post
			|| ! in_array( $post->post_type, self::get_supported_post_types(), true )
		) {
			return $classes;
		}

		$custom_classes = get_post_meta( $post->ID, self::META_KEY_BODY_CLASSES, true );

		if ( empty( $custom_classes ) ) {
			return $classes;
		}

		$custom_classes_array = explode( ' ', $custom_classes );

		return array_merge( $classes, $custom_classes_array );
	}

	/**
	 * Filters the list of CSS class names for the current post.
	 *
	 * @param string[] $classes An array of post class names.
	 * @return string[] Modified array of post class names.
	 */
	public static function add_post_classes( array $classes ): array
	{
		global $post;

		if ( ! $post instanceof WP_Post || ! in_array( $post->post_type, self::get_supported_post_types(), true ) ) {
			return $classes;
		}

		$custom_classes   = get_post_meta( $post->ID, self::META_KEY_BODY_CLASSES, true );
		$use_in_post_loop = get_post_meta( $post->ID, self::META_KEY_USE_IN_POST_LOOP, true );

		if ( empty( $custom_classes ) || ! $use_in_post_loop ) {
			return $classes;
		}

		$custom_classes_array = explode( ' ', $custom_classes );

		return array_merge( $classes, $custom_classes_array );
	}
}
