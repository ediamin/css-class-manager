<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a CSS declaration with a property, value, and importance flag.
 */
class Declaration extends BaseAstNode
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'declaration';

	/**
	 * The CSS property name.
	 */
	private string $property;

	/**
	 * The value of the CSS property.
	 */
	private ?string $value;

	/**
	 * Whether the declaration has the !important flag.
	 */
	private bool $important;

	/**
	 * Creates a new Declaration instance.
	 *
	 * @param  string      $property  The CSS property name.
	 * @param  string|null $value  The value of the CSS property.
	 * @param  bool        $important  Whether the declaration has the !important flag.
	 */
	public function __construct( string $property, ?string $value = null, bool $important = false )
	{
		parent::__construct( $this->kind );

		$this->property  = $property;
		$this->value     = $value;
		$this->important = $important;
	}

	/**
	 * Gets the CSS property name.
	 */
	public function get_property(): string
	{
		return $this->property;
	}

	/**
	 * Gets the value of the CSS property.
	 */
	public function get_value(): ?string
	{
		return $this->value;
	}

	/**
	 * Sets the value of the CSS property.
	 *
	 * @param  string|null $value  The new value of the CSS property.
	 */
	public function set_value( ?string $value ): void
	{
		$this->value = $value;
	}

	/**
	 * Gets whether the declaration has the !important flag.
	 */
	public function is_important(): bool
	{
		return $this->important;
	}

	/**
	 * Sets whether the declaration has the !important flag.
	 *
	 * @param  bool $important  Whether the declaration has the !important flag.
	 */
	public function set_important( bool $important ): void
	{
		$this->important = $important;
	}

	/**
	 * Get the properties of the AST node as an associative array.
	 *
	 * @return array<string, mixed> The node properties as an associative array.
	 */
	public function to_array(): array
	{
		return [
			'important' => $this->important,
			'kind'      => $this->kind,
			'property'  => $this->property,
			'value'     => $this->value,
		];
	}
}
