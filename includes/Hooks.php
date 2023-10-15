<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Filter and action hooks.
 */
class Hooks
{
	/**
	 * Add filter hooks.
	 */
	public function filters(): void
	{
		// Code goes here.
	}

	/**
	 * Add action hooks.
	 */
	public function actions(): void
	{
		// Load the plugin textdomain.
		add_action( 'init', [ L10N::class, 'load_plugin_textdomain' ] );

		// General assets.
		add_action( 'init', [ Enqueue::class, 'register_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ Enqueue::class, 'enqueue_block_editor_assets' ] );

		// Custom settings.
		add_action( 'rest_api_init', [ Settings::class, 'register_settings' ] );
	}
}
