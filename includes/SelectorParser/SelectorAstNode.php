<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Interface for Selector AST nodes.
 *
 * This interface defines the structure for nodes in the selector AST (Abstract Syntax Tree).
 * Each node represents a part of the selector and provides a method to retrieve its value.
 */
interface SelectorAstNode
{
	/**
	 * Get the kind of node.
	 */
	public function get_kind(): string;

	/**
	 * Get the value of the node.
	 */
	public function get_value(): string;
}
