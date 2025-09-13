<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

/**
 * Provides functions for creating and manipulating AST nodes.
 *
 * This class contains static factory methods that create instances of various AST node types.
 */
class Ast
{
	/**
	 * The '@' sign character used for at-rule detection.
	 */
	private const AT_SIGN = '@';

	/**
	 * Creates a new StyleRule instance.
	 *
	 * @param  string                               $selector  The CSS selector for this rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes contained in this rule.
	 * @return \CSSClassManager\CSSParser\StyleRule The created StyleRule instance.
	 */
	public static function style_rule( string $selector, array $nodes = [] ): StyleRule
	{
		return new StyleRule( $selector, $nodes );
	}

	/**
	 * Creates a new AtRule instance.
	 *
	 * @param  string                               $name  The name of the at-rule (e.g., '@media', '@keyframes').
	 * @param  string                               $params  The parameters for the at-rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes contained in this at-rule.
	 * @return \CSSClassManager\CSSParser\AtRule The created AtRule instance.
	 */
	public static function at_rule( string $name, string $params = '', array $nodes = [] ): AtRule
	{
		return new AtRule( $name, $params, $nodes );
	}

	/**
	 * Creates a new StyleRule or AtRule instance based on the selector.
	 *
	 * If the selector starts with '@', it creates an AtRule, otherwise a StyleRule.
	 *
	 * @param  string                               $selector  The CSS selector or at-rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes contained in this rule.
	 * @return \CSSClassManager\CSSParser\Rule The created StyleRule or AtRule instance.
	 */
	public static function rule( string $selector, array $nodes = [] ): Rule
	{
		if ( str_starts_with( $selector, self::AT_SIGN ) ) {
			return Parser::parse_at_rule( $selector, $nodes );
		}

		return self::style_rule( $selector, $nodes );
	}

	/**
	 * Creates a new Declaration instance.
	 *
	 * @param  string      $property  The CSS property name.
	 * @param  string|null $value  The value of the CSS property.
	 * @param  bool        $important  Whether the declaration has the !important flag.
	 * @return \CSSClassManager\CSSParser\Declaration The created Declaration instance.
	 */
	public static function decl( string $property, ?string $value = null, bool $important = false ): Declaration
	{
		return new Declaration( $property, $value, $important );
	}

	/**
	 * Creates a new Comment instance.
	 *
	 * @param  string $value  The content of the comment.
	 * @return \CSSClassManager\CSSParser\Comment The created Comment instance.
	 */
	public static function comment( string $value ): Comment
	{
		return new Comment( $value );
	}

	/**
	 * Creates a new Context instance.
	 *
	 * @param  array<string, string|bool>           $context  The context data as key-value pairs.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes within this context.
	 * @return \CSSClassManager\CSSParser\Context The created Context instance.
	 */
	public static function context( array $context, array $nodes ): Context
	{
		return new Context( $context, $nodes );
	}

	/**
	 * Creates a new AtRoot instance.
	 *
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes at the root level.
	 * @return \CSSClassManager\CSSParser\AtRoot The created AtRoot instance.
	 */
	public static function at_root( array $nodes ): AtRoot
	{
		return new AtRoot( $nodes );
	}
}
