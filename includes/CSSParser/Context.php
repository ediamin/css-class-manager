<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Represents a context with data and child nodes.
 */
class Context extends BaseAstNode
{
	/**
	 * The kind of the AST node.
	 */
	private string $kind = 'context';

	/**
	 * The context data as key-value pairs.
	 *
	 * @var array<string, string|bool>
	 */
	private array $context;

	/**
	 * The child nodes within this context.
	 *
	 * @var \CSSClassManager\CSSParser\AstNode[]
	 */
	private array $nodes;

	/**
	 * Creates a new Context instance.
	 *
	 * @param  array<string, string|bool>           $context  The context data as key-value pairs.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes within this context.
	 */
	public function __construct( array $context, array $nodes = [] )
	{
		parent::__construct( $this->kind );

		$this->context = $context;
		$this->nodes   = $nodes;
	}

	/**
	 * Gets the context data as key-value pairs.
	 *
	 * @return array<string, string|bool>
	 */
	public function get_context(): array
	{
		return $this->context;
	}

	/**
	 * Gets the child nodes within this context.
	 *
	 * @return \CSSClassManager\CSSParser\AstNode[]
	 */
	public function get_nodes(): array
	{
		return $this->nodes;
	}

	/**
	 * Sets the context data as key-value pairs.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes within this context.
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
			'context' => $this->context,
			'kind'    => $this->kind,
			'nodes'   => array_map( static fn ( AstNode $node ) => $node->to_array(), $this->nodes ),
		];
	}
}
