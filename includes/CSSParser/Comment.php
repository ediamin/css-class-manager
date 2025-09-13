<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a CSS comment.
 */
class Comment extends BaseAstNode
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'comment';

	/**
	 * The content of the comment.
	 */
	private string $value;

	/**
	 * Creates a new Comment instance.
	 *
	 * @param  string $value  The content of the comment.
	 */
	public function __construct( string $value )
	{
		parent::__construct( $this->kind );

		$this->value = $value;
	}

	/**
	 * Gets the content of the comment.
	 */
	public function get_value(): string
	{
		return $this->value;
	}

	/**
	 * Get the properties of the AST node as an associative array.
	 *
	 * @return array<string, mixed> The node properties as an associative array.
	 */
	public function to_array(): array
	{
		return [
			'kind'  => $this->kind,
			'value' => $this->value,
		];
	}
}
