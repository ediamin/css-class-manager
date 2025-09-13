<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a node in an Abstract Syntax Tree (AST).
 *
 * This interface defines the structure for AST nodes, which can be
 * used to represent various elements in a programming language or
 * data structure.
 */
interface AstNode
{
	/**
	 * Gets the child nodes contained in this AST node.
	 *
	 * @return string The kind of the AST node.
	 */
	public function get_kind(): string;

	/**
	 * Get the properties of the AST node as an associative array.
	 *
	 * @return array<string, mixed> The node properties as an associative array.
	 */
	public function to_array(): array;
}
