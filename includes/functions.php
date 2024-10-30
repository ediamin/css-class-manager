<?php

declare(strict_types = 1);

use CSSClassManager\Plugin;

/**
 * CSS Class Manager plugin instance.
 */
function css_class_manager(): Plugin
{
	static $plugin;

	if ( is_null( $plugin ) ) {
		$plugin = new Plugin();
	}

	return $plugin;
}

/**
 * A simplistic version of sanitize_html_class method.
 *
 * Unlike sanitize_html_class, this function allows colon (:) in the class name.
 *
 * @param string $class_name Class name to be sanitized.
 * @return string Sanitized class name.
 */
function css_class_manager_sanitize_html_class( string $class_name ): string
{
	// Strip out any percent-encoded characters.
	$sanitized = preg_replace( '|%[a-fA-F0-9][a-fA-F0-9]|', '', $class_name );

	// Limit to A-Z, a-z, 0-9, '_', '-' and ':'.
	$sanitized = preg_replace( '/[^A-Za-z0-9_:-]/', '', $sanitized );

	return $sanitized;
}
