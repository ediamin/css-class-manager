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
