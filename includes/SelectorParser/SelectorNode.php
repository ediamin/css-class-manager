<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Represents a selector node in a CSS selector.
 *
 * This class represents basic CSS selectors like class names, element names, etc.
 */
class SelectorNode extends BaseSelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind = 'selector';
}
