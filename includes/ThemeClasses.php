<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Manages theme.json generated classes.
 */
class ThemeClasses
{
	/**
	 * Transient key for cached theme class names.
	 */
	private const TRANSIENT_KEY = 'css_class_manager_theme_classes';

	/**
	 * Add theme.json generated classes to class list.
	 *
	 * @param array<\CSSClassManager\ClassPreset> $classes List of existing classes.
	 * @return array<\CSSClassManager\ClassPreset> Updated list of classes.
	 */
	public static function add_theme_classes( array $classes ): array
	{
		$user_settings = css_class_manager()->get_user_settings();

		if ( ! empty( $user_settings['hideThemeJSONGeneratedClasses'] ) ) {
			return $classes;
		}

		$css  = wp_get_global_stylesheet( [ 'presets' ] );
		$css .= wp_get_global_stylesheet( [ 'custom-css' ] );

		/**
		 * The CSS from which class names are extracted.
		 *
		 * @param string $css The stylesheet in CSS format.
		 */
		$css = apply_filters( 'css_class_manager_theme_classes_css', $css );

		$css_hash = md5( $css );
		$cached   = get_transient( self::TRANSIENT_KEY );

		if (
			is_array( $cached )
			&& isset( $cached['hash'], $cached['classes'] )
			&& $cached['hash'] === $css_hash
			&& is_array( $cached['classes'] )
		) {
			$class_names = $cached['classes'];
		} else {
			$parser      = new ClassNameParser( $css );
			$class_names = $parser->get_classes();

			set_transient(
				self::TRANSIENT_KEY,
				[
					'classes' => $class_names,
					'hash'    => $css_hash,
				],
				DAY_IN_SECONDS
			);
		}

		foreach ( $class_names as $class_name ) {
			$classes[] = new ClassPreset( $class_name, null, true );
		}

		return $classes;
	}

	/**
	 * Clear the cached theme class names.
	 */
	public static function clear_cache(): void
	{
		delete_transient( self::TRANSIENT_KEY );
	}
}
