<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents the root level of an AST structure with a collection of nodes.
 */
class AtRoot extends BaseAstNode
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'at-root';

	/**
	 * The child nodes at the root level.
	 *
	 * @var \CSSClassManager\CSSParser\AstNode[]
	 */
	private array $nodes;

	/**
	 * Creates a new AtRoot instance.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes at the root level.
	 */
	public function __construct( array $nodes = [] )
	{
		parent::__construct( $this->kind );

		$this->nodes = $nodes;
	}

	/**
	 * Gets the child nodes at the root level.
	 *
	 * @return \CSSClassManager\CSSParser\AstNode[]
	 */
	public function get_nodes(): array
	{
		return $this->nodes;
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
			'nodes' => array_map( static fn ( AstNode $node ) => $node->to_array(), $this->nodes ),
		];
	}
}
