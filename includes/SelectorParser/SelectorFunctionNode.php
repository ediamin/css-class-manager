<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Represents a function node in a CSS selector.
 *
 * This class represents CSS function nodes like :not(), :has(), etc. that can contain
 * other selector nodes as children.
 */
class SelectorFunctionNode extends BaseSelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind = 'function';

	/**
	 * Child nodes contained within this function.
	 *
	 * @var array<\CSSClassManager\SelectorParser\SelectorAstNode>
	 */
	private array $nodes;

	/**
	 * Class constructor.
	 *
	 * @param  string                                                 $value  The value of the node (function name).
	 * @param  array<\CSSClassManager\SelectorParser\SelectorAstNode> $nodes  The child nodes within this function.
	 */
	public function __construct( string $value, array $nodes = [] )
	{
		parent::__construct( $value );

		$this->nodes = $nodes;
	}

	/**
	 * Get the child nodes contained within this function.
	 *
	 * @return array<\CSSClassManager\SelectorParser\SelectorAstNode>
	 */
	public function get_nodes(): array
	{
		return $this->nodes;
	}

	/**
	 * Set the child nodes for this function.
	 *
	 * @param  array<\CSSClassManager\SelectorParser\SelectorAstNode> $nodes  The nodes to set.
	 */
	public function set_nodes( array $nodes ): void
	{
		$this->nodes = $nodes;
	}

	/**
	 * Add a node to the child nodes of this function.
	 *
	 * @param  \CSSClassManager\SelectorParser\SelectorAstNode $node  The node to add.
	 */
	public function add_node( SelectorAstNode $node ): void
	{
		$this->nodes[] = $node;
	}
}
