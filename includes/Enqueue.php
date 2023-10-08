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
		// Register scripts here.
	}
}
