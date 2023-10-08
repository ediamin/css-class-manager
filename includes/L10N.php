<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Plugin localization.
 */
class L10N
{
	/**
	 * Load plugin textdomain.
	 */
	public static function load_plugin_textdomain(): void
	{
		load_plugin_textdomain(
			'css-class-manager',
			false,
			dirname( plugin_basename( Plugin::FILE_PATH ) ) . '/languages/'
		);
	}
}
