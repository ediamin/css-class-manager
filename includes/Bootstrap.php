<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Bootstrap the plugin.
 */
class Bootstrap
{
	/**
	 * Class constructor.
	 */
	public function __construct()
	{
		/**
		 * Fires right before the plugin loads its logics.
		 */
		do_action( 'css_class_manager_before_init' );

		$this->init_hooks();

		/**
		 * Fires after plugin finished loading its logics.
		 */
		do_action( 'css_class_manager_init' );
	}

	/**
	 * Load plugin core.
	 */
	private function init_hooks(): void
	{
		$hooks = new Hooks();
		$hooks->filters();
		$hooks->actions();
	}
}
