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
				'type'              => 'object',
				'description'       => __( 'List of user defined class names', 'css-class-manager' ),
				'default'           => [],
				'sanitize_callback' => [ self::class, 'sanitize_class_names' ],
				'show_in_rest'      => [
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

	/**
	 * Sanitize user defined class names settings.
	 *
	 * @param array<array<string,string>> $value Settings value to be sanitized.
	 * @return array<array<string,string>>
	 */
	public static function sanitize_class_names( array $value ): array
	{
		if ( ! is_array( $value ) || empty( $value ) ) {
			return [];
		}

		$class_names  = [];
		$unique_names = array_reduce(
			css_class_manager()->get_filtered_class_names(),
			static function ( $acc, $item ) {
				$acc[ $item['name'] ] = true;

				return $acc;
			},
			[]
		);

		foreach ( $value as $class_name ) {
			$name = sanitize_html_class( $class_name['name'] );

			if ( isset( $unique_names[ $name ] ) ) {
				continue;
			}

			if ( empty( trim( $name ) ) ) {
				continue;
			}

			$unique_names[ $name ] = true;

			$description = isset( $class_name['description'] )
				? sanitize_text_field( $class_name['description'] )
				: '';

			$class_names[] = [
				'name'        => $name,
				'description' => $description,
			];
		}

		usort(
			$class_names,
			static function ( $a, $b ) {
				// Convert names to lowercase for case-insensitive sorting.
				$name_a = strtolower( $a['name'] );
				$name_b = strtolower( $b['name'] );

				if ( $name_a < $name_b ) {
					return -1;
				}

				if ( $name_a > $name_b ) {
					return 1;
				}

				// Names are equal.
				return 0;
			}
		);

		return $class_names;
	}
}
