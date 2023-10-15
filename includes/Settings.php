<?php

declare(strict_types = 1);

namespace CSSClassManager;

/**
 * Custom settings.
 */
class Settings
{
	/**
	 * Register plugin custom settings.
	 */
	public static function register_settings(): void
	{
		// phpcs:disable SlevomatCodingStandard.Arrays.AlphabeticallySortedByKeys.IncorrectKeyOrder
		register_setting(
			'options',
			'css_class_manager',
			[
				'type'         => 'object',
				'default'      => [
					'user_defined_class_names' => [],
				],
				'show_in_rest' => [
					'schema' => [
						'type'       => 'object',
						'properties' => [
							'user_defined_class_names' => [
								'type'  => 'array',
								'items' => [
									'type'       => 'object',
									'properties' => [
										'description' => [
											'type'        => 'string',
											'description' => __( 'Description of the class name', 'css-class-manager' ),
										],
										'name'        => [
											'type'        => 'string',
											'description' => __( 'CSS class name', 'css-class-manager' ),
											'required'    => true,
										],
									],
								],
							],
						],
					],
				],
			]
		);
	}
}
