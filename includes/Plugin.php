<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Plugin main class instance.
 */
class Plugin
{
	/**
	 * Plugin absolute path.
	 */
	public const ABSPATH = CSS_CLASS_MANAGER_ABSPATH;

	/**
	 * Main plugin file path.
	 */
	public const FILE_PATH = CSS_CLASS_MANAGER_FILE;

	/**
	 * Plugin URL.
	 */
	public const URL = CSS_CLASS_MANAGER_URL;

	/**
	 * Plugin version number.
	 */
	public const VERSION = '1.0.0';

	/**
	 * Plugin ID to use in script handles, actions, filters etc.
	 */
	public const ID = 'css-class-manager';

	/**
	 * Absolute path of the src directory.
	 */
	public const INC_PATH = self::ABSPATH . '/includes';

	/**
	 * Public URL of the assets dist directory.
	 */
	public const ASSETS_DIST_URL = self::URL . '/assets/dist';

	/**
	 * Absoulute path of the assets dist directory.
	 */
	public const ASSETS_DIST_PATH = self::ABSPATH . '/assets/dist';

	/**
	 * Absolute path of the templates directory.
	 */
	public const TEMPLATES_PATH = self::ABSPATH . '/templates';

	/**
	 * Get the filtered class names provided by themes and plugins.
	 *
	 * @return array<array<string,string>>
	 */
	public function get_filtered_class_names(): array
	{
		return apply_filters( 'css_class_manager_filtered_class_names', [] );
	}

	/**
	 * Get the user defined class names.
	 *
	 * @return array<array<string,string>>
	 */
	public function get_user_defined_class_names(): array
	{
		// phpcs:ignore Generic.Commenting.DocComment.MissingShort
		/** @var array<array<string,string>> $option Settings from the option table */
		$option = get_option( Settings::OPTION_CLASS_NAMES, [] );

		return $option;
	}
}
