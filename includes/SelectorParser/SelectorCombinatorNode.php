<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Represents a combinator node in the selector AST.
 *
 * Combinators define the relationship between selectors, such as descendant (` `),
 * child (`>`), adjacent sibling (`+`), and general sibling (`~`).
 */
class SelectorCombinatorNode extends BaseSelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind = 'combinator';
}
