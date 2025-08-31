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

		// Custom settings.
		add_action( 'init', [ UserSettings::class, 'register_settings' ] );
		add_action( 'rest_api_init', [ Settings::class, 'register_settings' ] );

		// Body classes.
		add_action( 'init', [ BodyClasses::class, 'register_post_meta' ] );
		add_filter( 'body_class', [ BodyClasses::class, 'add_body_classes' ] );

		// General assets.
		add_action( 'init', [ Enqueue::class, 'register_scripts' ] );
		add_action( 'enqueue_block_editor_assets', [ Enqueue::class, 'enqueue_block_editor_assets' ] );
	}
}
