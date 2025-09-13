<?php

declare(strict_types = 1);

namespace CSSClassManager;

use CSSClassManager\CSSParser\Parser;
use CSSClassManager\CSSParser\Rule;
use CSSClassManager\CSSParser\StyleRule;
use CSSClassManager\SelectorParser\Parser as SelectorParser;
use CSSClassManager\SelectorParser\SelectorFunctionNode;
use CSSClassManager\SelectorParser\SelectorNode;

/**
 * A parser that extracts class names from CSS code.
 * Supports modern CSS syntax including nesting, combinators, and TailwindCSS classes.
 */
class ClassNameParser
{
	/**
	 * Holds the extracted class names.
	 *
	 * @var string[]
	 */
	private array $classes = [];

	/**
	 * ClassNameParser constructor.
	 *
	 * @param string $css The CSS code to parse.
	 */
	public function __construct( string $css )
	{
		$ast = Parser::parse( $css );
		$this->parse( $ast );
	}

	/**
	 * Get the unique class names extracted from the CSS.
	 *
	 * @return string[] An array of unique class names.
	 */
	public function get_classes(): array
	{
		return array_unique( $this->classes );
	}

	/**
	 * Recursively parse the AST nodes to find class names.
	 *
	 * @param \CSSClassManager\CSSParser\AstNode[] $ast The AST nodes to parse.
	 */
	private function parse( array $ast ): void
	{
		foreach ( $ast as $node ) {
			if ( $node instanceof StyleRule ) {
				$selector  = $node->get_selector();
				$selectors = SelectorParser::parse( $selector );
				$this->find_class_names( $selectors );
			}

			// Recursively process child nodes if they exist.
			if ( ! ( $node instanceof Rule ) ) {
				continue;
			}

			$this->parse( $node->get_nodes() );
		}
	}

	/**
	 * Recursively find class names in the selector nodes.
	 *
	 * @param \CSSClassManager\SelectorParser\SelectorAstNode[] $selectors The selector nodes to search.
	 */
	private function find_class_names( array $selectors ): void
	{
		foreach ( $selectors as $selector ) {
			if ( $selector instanceof SelectorNode && str_starts_with( $selector->get_value(), '.' ) ) {
				$escaped_selector = preg_replace( '/^\./', '', $selector->get_value() );

				if ( ! is_string( $escaped_selector ) ) {
					continue;
				}

				$unescaped = $this->unescape_class_name( $escaped_selector );

				if ( ! is_string( $unescaped ) ) {
					continue;
				}

				$this->classes[] = $unescaped;
			}

			if ( ! ( $selector instanceof SelectorFunctionNode ) ) {
				continue;
			}

			$this->find_class_names( $selector->get_nodes() );
		}
	}

	/**
	 * Unescape CSS class name by removing backslash escapes.
	 *
	 * @param string $class_name The escaped class name.
	 * @return string|null The unescaped class name.
	 */
	private function unescape_class_name( string $class_name ): ?string
	{
		// Convert escaped characters back to their original form
		// \: becomes :, \- becomes -, etc.
		return preg_replace( '/\\\\(.)/', '$1', $class_name );
	}
}
