<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a base AST node.
 *
 * This class serves as a base for all AST nodes in the structure.
 */
class BaseAstNode implements AstNode
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind;

	/**
	 * Creates a new BaseAstNode instance.
	 *
	 * @param  string $kind  The kind of the AST node.
	 */
	public function __construct( string $kind )
	{
		$this->kind = $kind;
	}

	/**
	 * Gets the child nodes contained in this AST node.
	 *
	 * @return string The kind of the AST node.
	 */
	public function get_kind(): string
	{
		return $this->kind;
	}

	/**
	 * Get the properties of the AST node as an associative array.
	 *
	 * This method is intended to be overridden by subclasses to provide
	 *
	 * @return array<string, mixed> The node properties as an associative array.
	 */
	public function to_array(): array
	{
		return [
			'kind' => $this->kind,
		];
	}
}
