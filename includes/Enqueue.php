<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Register and enqueue general assets.
 */
class Enqueue
{
	/**
	 * Style handle.
	 */
	public const STYLE_HANDLE = Plugin::ID . '-style';

	/**
	 * Script handle.
	 */
	public const SCRIPT_HANDLE = Plugin::ID . '-script';

	/**
	 * Register scripts.
	 */
	public static function register_scripts(): void
	{
		$asset = require_once Plugin::ASSETS_DIST_PATH . '/css-class-manager/index.asset.php';

		wp_register_style(
			self::STYLE_HANDLE,
			Plugin::ASSETS_DIST_URL . '/css-class-manager/styles.css',
			[],
			$asset['version']
		);

		wp_register_script(
			self::SCRIPT_HANDLE,
			Plugin::ASSETS_DIST_URL . '/css-class-manager/index.js',
			$asset['dependencies'],
			$asset['version'],
			true
		);

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'cssClassManager',
			[
				'filteredClassNames'    => css_class_manager()->get_filtered_class_names(),
				'userDefinedClassNames' => css_class_manager()->get_user_defined_class_names(),
			]
		);
	}

	/**
	 * Enqueue assets in block editor.
	 */
	public static function enqueue_block_editor_assets(): void
	{
		wp_enqueue_style( self::STYLE_HANDLE );
		wp_enqueue_script( self::SCRIPT_HANDLE );
	}
}
