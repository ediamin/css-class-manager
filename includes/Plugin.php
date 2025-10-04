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
	public const VERSION = '1.4.2';

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
	 * @return array<\CSSClassManager\ClassPreset>
	 */
	public function get_filtered_class_names(): array
	{
		return apply_filters( 'css_class_manager_filtered_class_names', [] );
	}

	/**
	 * Get the user defined class names.
	 *
	 * @return array<\CSSClassManager\ClassPreset>
	 */
	public function get_user_defined_class_names(): array
	{
		// phpcs:ignore Generic.Commenting.DocComment.MissingShort
		/** @var array<\CSSClassManager\ClassPreset> $option Settings from the option table */
		$option = get_option( Settings::OPTION_CLASS_NAMES, [] );

		return $option;
	}

	/**
	 * Get the user settings.
	 *
	 * @param int $user_id User ID.
	 * @return array<string,string>
	 */
	public function get_user_settings( ?int $user_id = null ): array
	{
		if ( empty( $user_id ) ) {
			$user_id = get_current_user_id();
		}

		$settings   = get_metadata_default( 'user', $user_id, UserSettings::META_KEY, true );
		$raw_values = get_metadata_raw( 'user', $user_id, UserSettings::META_KEY, true );

		if ( ! empty( $raw_values ) && is_array( $raw_values ) && is_array( $settings ) ) {
			return wp_parse_args( $raw_values, $settings );
		}

		return is_array( $settings )
			? $settings
			: [];
	}
}
