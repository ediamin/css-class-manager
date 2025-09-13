<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a rule in the AST structure.
 */
interface Rule extends AstNode
{
	/**
	 * Gets the child nodes contained in this rule.
	 *
	 * @return \CSSClassManager\CSSParser\AstNode[] The child nodes.
	 */
	public function get_nodes(): array;

	/**
	 * Adds a child node to this rule.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode $node  The child node to add.
	 */
	public function add_node( AstNode $node ): void;

	/**
	 * Sets the child nodes contained in this rule.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes to set.
	 */
	public function set_nodes( array $nodes ): void;
}
