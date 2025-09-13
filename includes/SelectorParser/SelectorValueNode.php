<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Represents a value node in a CSS selector.
 *
 * This class represents raw values within CSS selectors, typically found within
 * function arguments that don't need further parsing.
 */
class SelectorValueNode extends BaseSelectorAstNode
{
	/**
	 * The kind of node.
	 */
	protected string $kind = 'value';
}
