<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a CSS style rule with a selector and child nodes.
 */
class StyleRule extends BaseAstNode implements Rule
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'rule';

	/**
	 * The CSS selector for this rule.
	 */
	private string $selector;

	/**
	 * The child nodes contained in this rule.
	 *
	 * @var \CSSClassManager\CSSParser\AstNode[]
	 */
	private array $nodes;

	/**
	 * Creates a new StyleRule instance.
	 *
	 * @param  string                               $selector  The CSS selector for this rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes contained in this rule.
	 */
	public function __construct( string $selector, array $nodes = [] )
	{
		parent::__construct( $this->kind );

		$this->selector = $selector;
		$this->nodes    = $nodes;
	}

	/**
	 * Gets the CSS selector for this rule.
	 */
	public function get_selector(): string
	{
		return $this->selector;
	}

	/**
	 * Sets the CSS selector for this rule.
	 *
	 * @param  string $selector  The CSS selector to set.
	 */
	public function set_selector( string $selector ): void
	{
		$this->selector = $selector;
	}

	/**
	 * Gets the child nodes contained in this rule.
	 *
	 * @return \CSSClassManager\CSSParser\AstNode[]
	 */
	public function get_nodes(): array
	{
		return $this->nodes;
	}

	/**
	 * Adds a child node to this rule.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode $node  The child node to add.
	 */
	public function add_node( AstNode $node ): void
	{
		$this->nodes[] = $node;
	}

	/**
	 * Sets the child nodes contained in this at-rule.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes to set.
	 */
	public function set_nodes( array $nodes ): void
	{
		$this->nodes = $nodes;
	}

	/**
	 * Get the properties of the AST node as an associative array.
	 *
	 * @return array<string, mixed> The node properties as an associative array.
	 */
	public function to_array(): array
	{
		return [
			'kind'     => $this->kind,
			'nodes'    => array_map( static fn ( AstNode $node ) => $node->to_array(), $this->nodes ),
			'selector' => $this->selector,
		];
	}
}
