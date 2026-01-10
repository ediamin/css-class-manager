<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * User specific settings.
 *
 * Settings stored into user meta.
 */
class UserSettings
{
	/**
	 * Option name for user settings.
	 */
	public const META_KEY = 'css_class_manager_user_settings';

	/**
	 * Register plugin custom settings.
	 *
	 * @see UserSettings interface in the JavaScript.
	 */
	public static function register_settings(): void
	{
		register_meta(
			'user',
			self::META_KEY,
			[
				'default'      => [
					'allowAddingClassNamesWithoutCreating' => false,
					'hideThemeJSONGeneratedClasses'        => false,
					'inspectorControlPosition'             => 'default',
				],
				'show_in_rest' => [
					'schema' => [
						'properties' => [
							'allowAddingClassNamesWithoutCreating' => [
								'default' => false,
								'type'    => 'boolean',
							],
							'hideThemeJSONGeneratedClasses' => [
								'default' => true,
								'type'    => 'boolean',
							],
							'inspectorControlPosition' => [
								'default' => 'default',
								'enum'    => [ 'default', 'own-panel' ],
								'type'    => 'string',
							],
						],
						'type'       => 'object',
					],
				],
				'single'       => true,
				'type'         => 'object',
			]
		);
	}
}
