<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Custom settings.
 */
class Settings
{
	/**
	 * Option name for the class names.
	 */
	public const OPTION_CLASS_NAMES = 'css_class_manager_class_names';

	/**
	 * Register plugin custom settings.
	 */
	public static function register_settings(): void
	{
		// phpcs:disable SlevomatCodingStandard.Arrays.AlphabeticallySortedByKeys.IncorrectKeyOrder
		register_setting(
			'options',
			self::OPTION_CLASS_NAMES,
			[
				'type'         => 'object',
				'description'  => __( 'List of user defined class names', 'css-class-manager' ),
				'default'      => [],
				'show_in_rest' => [
					'schema' => [
						'type'  => 'array',
						'items' => [
							'type'       => 'object',
							'properties' => [
								'name'        => [
									'type'        => 'string',
									'description' => __( 'CSS class name', 'css-class-manager' ),
									'required'    => true,
								],
								'description' => [
									'type'        => 'string',
									'description' => __( 'Description of the class name', 'css-class-manager' ),
								],
							],
						],
					],
				],
			]
		);
	}
}
