<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Base class for Selector AST nodes.
 *
 * This abstract class provides common properties and methods for all selector AST nodes.
 */
abstract class BaseSelectorAstNode implements SelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind;

	/**
	 * The value of the node.
	 */
	protected string $value;

	/**
	 * Class constructor.
	 *
	 * @param  string $value  The value of the node.
	 */
	public function __construct( string $value )
	{
		$this->value = $value;
	}

	/**
	 * Get the node kind.
	 */
	public function get_kind(): string
	{
		return $this->kind;
	}

	/**
	 * Get the node value.
	 */
	public function get_value(): string
	{
		return $this->value;
	}
}
