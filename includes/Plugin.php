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
	public const VERSION = '0.0.1';

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
	 * Class constructor
	 */
	public function __construct()
	{
		// Code goes here.
	}
}
