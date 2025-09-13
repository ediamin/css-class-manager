<?php

declare(strict_types = 1);

namespace CSSClassManager\SelectorParser;

/**
 * Parses CSS selectors into an AST structure.
 */
class Parser
{
	// Character code constants.
	private const BACKSLASH = 0x5C;

	private const CLOSE_BRACKET = 0x5D;

	private const CLOSE_PAREN = 0x29;

	private const COLON = 0x3A;

	private const COMMA = 0x2C;

	private const DOUBLE_QUOTE = 0x22;

	private const FULL_STOP = 0x2E;

	private const GREATER_THAN = 0x3E;

	private const NEWLINE = 0x0A;

	private const NUMBER_SIGN = 0x23;

	private const OPEN_BRACKET = 0x5B;

	private const OPEN_PAREN = 0x28;

	private const PLUS = 0x2B;

	private const SINGLE_QUOTE = 0x27;

	private const SPACE = 0x20;

	private const TAB = 0x09;

	private const TILDE = 0x7E;

	/**
	 * Parse a CSS selector into an AST.
	 *
	 * @param  string $input  The CSS selector to parse.
	 * @return array<\CSSClassManager\SelectorParser\SelectorAstNode> The parsed AST.
	 * @throws \Exception If the selector contains invalid syntax.
	 */
	public static function parse( string $input ): array
	{
		$input = str_replace( "\r\n", "\n", $input );

		$ast    = [];
		$stack  = [];
		$parent = null;
		$buffer = '';
		$total  = strlen( $input );

		for ( $i = 0; $i < $total; $i++ ) {
			$current_char = ord( $input[ $i ] );

			switch ( $current_char ) {
				case self::COMMA:
				case self::GREATER_THAN:
				case self::NEWLINE:
				case self::SPACE:
				case self::PLUS:
				case self::TAB:
				case self::TILDE:
					// Handle everything before the combinator as a selector.
					if ( strlen( $buffer ) > 0 ) {
						$node = new SelectorNode( $buffer );

						if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
							$parent->add_node( $node );
						} else {
							$ast[] = $node;
						}

						$buffer = '';
					}

					// Look ahead and find the end of the combinator.
					$start        = $i;
					$end          = $i + 1;
					$input_length = strlen( $input );

					for ( ; $end < $input_length; $end++ ) {
						$peek_char = ord( $input[ $end ] );

						if (
							$peek_char !== self::COMMA &&
							$peek_char !== self::GREATER_THAN &&
							$peek_char !== self::NEWLINE &&
							$peek_char !== self::SPACE &&
							$peek_char !== self::PLUS &&
							$peek_char !== self::TAB &&
							$peek_char !== self::TILDE
						) {
							break;
						}
					}

					$i = $end - 1;

					$contents = substr( $input, $start, $end - $start );
					$node     = trim( $contents ) === ','
						? new SelectorSeparatorNode( $contents )
						: new SelectorCombinatorNode( $contents );

					if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
						$parent->add_node( $node );
					} else {
						$ast[] = $node;
					}

					break;
				case self::OPEN_PAREN:
					$node   = new SelectorFunctionNode( $buffer, [] );
					$buffer = '';

					// If the function is not one of these pseudo-class selectors,
					// we combine all its contents into a single value node.
					if (
						$node->get_value() !== ':not' &&
						$node->get_value() !== ':where' &&
						$node->get_value() !== ':has' &&
						$node->get_value() !== ':is'
					) {
						// Find the end of the function call.
						$start        = $i + 1;
						$nesting      = 0;
						$input_length = strlen( $input );

						// Find the closing parenthesis.
						for ( $j = $i + 1; $j < $input_length; $j++ ) {
							$peek_char = ord( $input[ $j ] );

							if ( $peek_char === self::OPEN_PAREN ) {
								++$nesting;

								continue;
							}

							if ( $peek_char !== self::CLOSE_PAREN ) {
								continue;
							}

							if ( $nesting === 0 ) {
								$i = $j;

								break;
							}

							--$nesting;
						}

						$end = $i;
						$node->add_node( new SelectorValueNode( substr( $input, $start, $end - $start ) ) );
						$buffer = '';

						if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
							$parent->add_node( $node );
						} else {
							$ast[] = $node;
						}

						break;
					}

					if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
						$parent->add_node( $node );
					} else {
						$ast[] = $node;
					}

					$stack[] = $node;
					$parent  = $node;

					break;
				case self::CLOSE_PAREN:
					$tail = array_pop( $stack );

					// Handle everything before the closing paren as a selector.
					if ( strlen( $buffer ) > 0 ) {
						$node = new SelectorNode( $buffer );

						if ( $tail !== null ) {
							$tail->add_node( $node );
						}

						$buffer = '';
					}

					$parent = count( $stack ) > 0
						? $stack[ count( $stack ) - 1 ]
						: null;

					break;
				case self::FULL_STOP:
				case self::COLON:
				case self::NUMBER_SIGN:
					// Handle everything before as a selector and start a new one.
					if ( strlen( $buffer ) > 0 ) {
						$node = new SelectorNode( $buffer );

						if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
							$parent->add_node( $node );
						} else {
							$ast[] = $node;
						}
					}

					$buffer = chr( $current_char );

					break;
				case self::OPEN_BRACKET:
					// Handle everything before as a selector.
					if ( strlen( $buffer ) > 0 ) {
						$node = new SelectorNode( $buffer );

						if ( $parent !== null && $parent instanceof SelectorFunctionNode ) {
							$parent->add_node( $node );
						} else {
							$ast[] = $node;
						}
					}

					$buffer = '';

					$start        = $i;
					$nesting      = 0;
					$input_length = strlen( $input );

					// Find the closing bracket.
					for ( $j = $i + 1; $j < $input_length; $j++ ) {
						$peek_char = ord( $input[ $j ] );

						if ( $peek_char === self::OPEN_BRACKET ) {
							++$nesting;

							continue;
						}

						if ( $peek_char !== self::CLOSE_BRACKET ) {
							continue;
						}

						if ( $nesting === 0 ) {
							$i = $j;

							break;
						}

						--$nesting;
					}

					// Adjust buffer to include the attribute selector.
					$buffer .= substr( $input, $start, $i - $start + 1 );

					break;
				case self::SINGLE_QUOTE:
				case self::DOUBLE_QUOTE:
					$start        = $i;
					$input_length = strlen( $input );

					// Find the matching closing quote.
					for ( $j = $i + 1; $j < $input_length; $j++ ) {
						$peek_char = ord( $input[ $j ] );

						// Current character is a backslash, the next is escaped.
						if ( $peek_char === self::BACKSLASH ) {
							++$j;
						} elseif ( $peek_char === $current_char ) {
							// End of the string.
							$i = $j;

							break;
						}
					}

					// Add the string to the buffer.
					$buffer .= substr( $input, $start, $i - $start + 1 );

					break;
				case self::BACKSLASH:
					if ( $i + 1 < strlen( $input ) ) {
						$next_char = ord( $input[ $i + 1 ] );
						$buffer   .= chr( $current_char ) . chr( $next_char );
						++$i;
					}

					break;
				default:
					$buffer .= chr( $current_char );
			}
		}

		// Collect any remaining buffer content as a selector.
		if ( strlen( $buffer ) > 0 ) {
			$ast[] = new SelectorNode( $buffer );
		}

		return $ast;
	}
}
