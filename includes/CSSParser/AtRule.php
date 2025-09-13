<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a CSS at-rule with a name, parameters, and child nodes.
 */
class AtRule extends BaseAstNode implements Rule
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'at-rule';

	/**
	 * The name of the at-rule (e.g., '@media', '@keyframes').
	 */
	private string $name;

	/**
	 * The parameters for the at-rule.
	 */
	private string $params;

	/**
	 * The child nodes contained in this at-rule.
	 *
	 * @var \CSSClassManager\CSSParser\AstNode[]
	 */
	private array $nodes;

	/**
	 * Creates a new AtRule instance.
	 *
	 * @param  string                               $name  The name of the at-rule (e.g., '@media', '@keyframes').
	 * @param  string                               $params  The parameters for the at-rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes contained in this at-rule.
	 */
	public function __construct( string $name, string $params = '', array $nodes = [] )
	{
		parent::__construct( $this->kind );

		$this->name   = $name;
		$this->params = $params;
		$this->nodes  = $nodes;
	}

	/**
	 * Gets the name of the at-rule.
	 */
	public function get_name(): string
	{
		return $this->name;
	}

	/**
	 * Sets the name of the at-rule.
	 *
	 * @param  string $name  The name to set.
	 */
	public function set_name( string $name ): void
	{
		$this->name = $name;
	}

	/**
	 * Gets the parameters for the at-rule.
	 */
	public function get_params(): string
	{
		return $this->params;
	}

	/**
	 * Sets the parameters for the at-rule.
	 *
	 * @param  string $params  The parameters to set.
	 */
	public function set_params( string $params ): void
	{
		$this->params = $params;
	}

	/**
	 * Gets the child nodes contained in this at-rule.
	 *
	 * @return \CSSClassManager\CSSParser\AstNode[]
	 */
	public function get_nodes(): array
	{
		return $this->nodes;
	}

	/**
	 * Adds a child node to this at-rule.
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
			'kind'   => $this->kind,
			'name'   => $this->name,
			'nodes'  => array_map( static fn ( AstNode $node ) => $node->to_array(), $this->nodes ),
			'params' => $this->params,
		];
	}

	/**
	 * Get a deep clone of the nodes array.
	 */
	public function __clone()
	{
				$this->nodes = array_map( static fn ( AstNode $node ) => clone $node, $this->nodes );
	}
}
