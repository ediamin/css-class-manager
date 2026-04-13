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
	 * Valid values for inspector control position.
	 */
	private const VALID_POSITIONS = [ 'default', 'own-panel' ];

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
				'default'           => [
					'allowAddingClassNamesWithoutCreating' => false,
					'hideThemeJSONGeneratedClasses'        => false,
					'inspectorControlPosition'             => 'default',
				],
				'sanitize_callback' => [ self::class, 'sanitize_settings' ],
				'show_in_rest'      => [
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
								'enum'    => self::VALID_POSITIONS,
								'type'    => 'string',
							],
						],
						'type'       => 'object',
					],
				],
				'single'            => true,
				'type'              => 'object',
			]
		);
	}

	/**
	 * Sanitize user settings.
	 *
	 * @param mixed $value The meta value to sanitize.
	 * @return array<string,mixed>
	 */
	public static function sanitize_settings( $value ): array
	{
		if ( ! is_array( $value ) ) {
			return [
				'allowAddingClassNamesWithoutCreating' => false,
				'hideThemeJSONGeneratedClasses'        => false,
				'inspectorControlPosition'             => 'default',
			];
		}

		return [
			'allowAddingClassNamesWithoutCreating' => ! empty( $value['allowAddingClassNamesWithoutCreating'] ),
			'hideThemeJSONGeneratedClasses'        => ! empty( $value['hideThemeJSONGeneratedClasses'] ),
			'inspectorControlPosition'             => isset( $value['inspectorControlPosition'] )
				&& in_array( $value['inspectorControlPosition'], self::VALID_POSITIONS, true )
					? $value['inspectorControlPosition']
					: 'default',
		];
	}
}
