<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Controller for the body class feature.
 */
class BodyClasses
{
	/**
	 * Post meta key for storing body classes.
	 */
	public const META_KEY = 'css_class_manager_body_classes';

	/**
	 * Register post meta.
	 */
	public static function register_post_meta(): void
	{
		// Get all post types that support the block editor.
		$post_types = get_post_types( [ 'show_in_rest' => true ] );

		foreach ( $post_types as $post_type ) {
			register_post_meta(
				$post_type,
				self::META_KEY,
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
	 * Filters the list of CSS body class names for the current post or page.
	 *
	 * @param array<string> $classes   An array of body class names.
	 */
	public static function add_body_classes( array $classes ): array
	{
		$post_id = get_the_ID();

		if ( ! $post_id ) {
			return $classes;
		}

		$custom_classes = get_post_meta( $post_id, self::META_KEY, true );

		if ( empty( $custom_classes ) ) {
			return $classes;
		}

		$custom_classes_array = explode( ' ', $custom_classes );

		return array_merge( $classes, $custom_classes_array );
	}
}
