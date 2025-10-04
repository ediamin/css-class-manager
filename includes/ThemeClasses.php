<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Manages theme.json generated classes.
 */
class ThemeClasses
{
	/**
	 * Add theme.json generated classes to class list.
	 *
	 * @param array<array<string,string>> $classes List of existing classes.
	 * @return array<array<string,string>> Updated list of classes.
	 */
	public static function add_theme_classes( array $classes ): array
	{
		$user_settings = css_class_manager()->get_user_settings();

		if ( $user_settings['hideThemeJSONGeneratedClasses'] ) {
			return $classes;
		}

		$css  = wp_get_global_stylesheet( [ 'presets' ] );
		$css .= wp_get_global_stylesheet( [ 'custom-css' ] );

		/**
		 * Filter the CSS used to extract theme.json generated classes.
		 *
		 * @param string $css The stylesheet in CSS format.
		 */
		$css = apply_filters( 'css_class_manager_theme_classes_css', $css );

		$parser      = new ClassNameParser( $css );
		$class_names = $parser->get_classes();

		foreach ( $class_names as $class_name ) {
			$classes[] = [
				'isDynamic' => true,
				'name'      => $class_name,
			];
		}

		return $classes;
	}
}
