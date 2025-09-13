<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Represents a separator node in a CSS selector.
 *
 * This class represents separators between selectors, such as commas.
 */
class SelectorSeparatorNode extends BaseSelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind = 'separator';
}
