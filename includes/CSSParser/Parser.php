<?php

declare(strict_types = 1);

namespace CSSClassManager\CSSParser;

use Exception;

/**
 * Parser for CSS code.
 */
class Parser
{
	private const BACKSLASH        = 0x5C;
	private const SLASH            = 0x2F;
	private const ASTERISK         = 0x2A;
	private const DOUBLE_QUOTE     = 0x22;
	private const SINGLE_QUOTE     = 0x27;
	private const COLON            = 0x3A;
	private const SEMICOLON        = 0x3B;
	private const LINE_BREAK       = 0x0A;
	private const SPACE            = 0x20;
	private const TAB              = 0x09;
	private const OPEN_CURLY       = 0x7B;
	private const CLOSE_CURLY      = 0x7D;
	private const OPEN_PAREN       = 0x28;
	private const CLOSE_PAREN      = 0x29;
	private const OPEN_BRACKET     = 0x5B;
	private const CLOSE_BRACKET    = 0x5D;
	private const DASH             = 0x2D;
	private const AT_SIGN          = 0x40;
	private const EXCLAMATION_MARK = 0x21;

	/**
	 * Parses a CSS string into an AST.
	 *
	 * This method transforms a CSS string into an array of AST nodes representing
	 * the structure and content of the CSS.
	 *
	 * @param  string $input  The CSS string to parse.
	 * @return \CSSClassManager\CSSParser\AstNode[] An array of AST nodes.
	 * @throws \Exception If the CSS contains syntax errors.
	 */
	public static function parse( string $input ): array
	{
		if ( strncmp( $input, "\xEF\xBB\xBF", 3 ) === 0 ) {
			$input = substr( $input, 3 );
		}

		$input                 = str_replace( "\r\n", "\n", $input );
		$ast                   = [];
		$license_comments      = [];
		$stack                 = [];
		$parent                = null;
		$node                  = null;
		$buffer                = '';
		$closing_bracket_stack = '';
		$peek_char             = null;

		$input_length = strlen( $input );
		for ( $i = 0; $i < $input_length; $i++ ) {
			$current_char = ord( $input[ $i ] );

			if ( $current_char === self::BACKSLASH ) {
				$buffer .= substr( $input, $i, 2 );
				++$i;
			} elseif (
				$current_char === self::SLASH
				&& $i + 1 < $input_length
				&& ord( $input[ $i + 1 ] ) === self::ASTERISK
			) {
				$start = $i;

				for ( $j = $i + 2; $j < $input_length; $j++ ) {
					$peek_char = ord( $input[ $j ] );

					if ( $peek_char === self::BACKSLASH ) {
						++$j;
					} elseif (
						$peek_char === self::ASTERISK
						&& $j + 1 < $input_length
						&& ord( $input[ $j + 1 ] ) === self::SLASH
					) {
						$i = $j + 1;

						break;
					}
				}

				$comment_string = substr( $input, $start, $i - $start + 1 );

				if ( strlen( $comment_string ) > 2 && ord( $comment_string[2] ) === self::EXCLAMATION_MARK ) {
					$license_comments[] = Ast::comment( substr( $comment_string, 2, -2 ) );
				}
			} elseif ( $current_char === self::SINGLE_QUOTE || $current_char === self::DOUBLE_QUOTE ) {
				$start = $i;

				for ( $j = $i + 1; $j < $input_length; $j++ ) {
					$peek_char = ord( $input[ $j ] );

					if ( $peek_char === self::BACKSLASH ) {
						++$j;
					} elseif ( $peek_char === $current_char ) {
						$i = $j;

						break;
					} elseif (
						$peek_char === self::SEMICOLON && $j + 1 < $input_length &&
							ord( $input[ $j + 1 ] ) === self::LINE_BREAK
					) {
						throw new Exception(
							esc_html(
								sprintf(
									'Unterminated string: %s%s',
									substr( $input, $start, $j - $start + 1 ),
									chr( $current_char )
								)
							)
						);
					} elseif ( $peek_char === self::LINE_BREAK ) {
						throw new Exception(
							esc_html(
								sprintf(
									'Unterminated string: %s%s',
									substr( $input, $start, $j - $start + 1 ),
									chr( $current_char )
								)
							)
						);
					}
				}

				$buffer .= substr( $input, $start, $i - $start + 1 );
			} elseif (
				(
					$current_char === self::SPACE ||
					$current_char === self::LINE_BREAK ||
					$current_char === self::TAB
				) &&
					$i + 1 < $input_length &&
					// phpcs:ignore SlevomatCodingStandard.ControlStructures.AssignmentInCondition.AssignmentInCondition, Squiz.PHP.DisallowMultipleAssignments.FoundInControlStructure
					( $peek_char = ord( $input[ $i + 1 ] ) ) &&
					( $peek_char === self::SPACE || $peek_char === self::LINE_BREAK || $peek_char === self::TAB )
			) {
				continue;
			} elseif ( $current_char === self::LINE_BREAK ) {
				if ( strlen( $buffer ) === 0 ) {
					continue;
				}

				$peek_char = ord( $buffer[ strlen( $buffer ) - 1 ] );
				if ( $peek_char !== self::SPACE && $peek_char !== self::LINE_BREAK && $peek_char !== self::TAB ) {
					$buffer .= ' ';
				}
			} elseif (
				$current_char === self::DASH && $i + 1 < $input_length &&
					ord( $input[ $i + 1 ] ) === self::DASH && strlen( $buffer ) === 0
			) {
				$custom_bracket_stack = '';
				$start                = $i;
				$colon_idx            = -1;

				for ( $j = $i + 2; $j < $input_length; $j++ ) {
					$peek_char = ord( $input[ $j ] );

					if ( $peek_char === self::BACKSLASH ) {
						++$j;
					} elseif (
						$peek_char === self::SLASH && $j + 1 < $input_length &&
							ord( $input[ $j + 1 ] ) === self::ASTERISK
					) {
						for ( $k = $j + 2; $k < $input_length; $k++ ) {
							$peek_char = ord( $input[ $k ] );

							if ( $peek_char === self::BACKSLASH ) {
								++$k;
							} elseif (
								$peek_char === self::ASTERISK && $k + 1 < $input_length &&
									ord( $input[ $k + 1 ] ) === self::SLASH
							) {
								$j = $k + 1;

								break;
							}
						}
					} elseif ( $colon_idx === -1 && $peek_char === self::COLON ) {
						$colon_idx = strlen( $buffer ) + $j - $start;
					} elseif ( $peek_char === self::SEMICOLON && $custom_bracket_stack === '' ) {
						$buffer .= substr( $input, $start, $j - $start );
						$i       = $j;

						break;
					} elseif ( $peek_char === self::OPEN_PAREN ) {
						$custom_bracket_stack .= ')';
					} elseif ( $peek_char === self::OPEN_BRACKET ) {
						$custom_bracket_stack .= ']';
					} elseif ( $peek_char === self::OPEN_CURLY ) {
						$custom_bracket_stack .= '}';
					} elseif (
						( $peek_char === self::CLOSE_CURLY || $j === $input_length - 1 ) &&
							$custom_bracket_stack === ''
					) {
						$i       = $j - 1;
						$buffer .= substr( $input, $start, $j - $start );

						break;
					} elseif (
						$peek_char === self::CLOSE_PAREN ||
							$peek_char === self::CLOSE_BRACKET ||
							$peek_char === self::CLOSE_CURLY
					) {
						if (
							$custom_bracket_stack !== '' &&
							$input[ $j ] === $custom_bracket_stack[ strlen( $custom_bracket_stack ) - 1 ]
						) {
							$custom_bracket_stack = substr( $custom_bracket_stack, 0, -1 );
						}
					}
				}

				$declaration = self::parse_declaration( $buffer, $colon_idx );
				if ( ! $declaration ) {
					throw new Exception( 'Invalid custom property, expected a value' );
				}

				if ( $parent ) {
					$parent->add_node( $declaration );
				} else {
					$ast[] = $declaration;
				}

				$buffer = '';
			} elseif (
				$current_char === self::SEMICOLON &&
				strlen( $buffer ) > 0 &&
				ord( $buffer[0] ) === self::AT_SIGN
			) {
				$node = self::parse_at_rule( $buffer );

				if ( $parent ) {
					$parent->add_node( $node );
				} else {
					$ast[] = $node;
				}

				$buffer = '';
				$node   = null;
			} elseif (
				$current_char === self::SEMICOLON &&
					( strlen( $closing_bracket_stack ) === 0 || $closing_bracket_stack[ strlen(
						$closing_bracket_stack
					) - 1 ] !== ')' )
			) {
				$declaration = self::parse_declaration( $buffer );
				if ( ! $declaration ) {
					if ( strlen( $buffer ) === 0 ) {
						throw new Exception( 'Unexpected semicolon' );
					}

					throw new Exception( esc_html( sprintf( 'Invalid declaration: `%s`', trim( $buffer ) ) ) );
				}

				if ( $parent ) {
					$parent->add_node( $declaration );
				} else {
					$ast[] = $declaration;
				}

				$buffer = '';
			} elseif (
				$current_char === self::OPEN_CURLY &&
					( strlen( $closing_bracket_stack ) === 0 || $closing_bracket_stack[ strlen(
						$closing_bracket_stack
					) - 1 ] !== ')' )
			) {
				$closing_bracket_stack .= '}';

				$buffer = trim( $buffer );

				$node = strlen( $buffer ) > 0 && $buffer[0] === '@'
					? self::parse_at_rule(
						$buffer,
						[]
					)
					: Ast::style_rule(
						$buffer,
						[]
					);

				if ( $parent ) {
					$parent->add_node( $node );
				}

				$stack[] = $parent;

				$parent = $node;

				$buffer = '';
				$node   = null;
			} elseif (
				$current_char === self::CLOSE_CURLY &&
					( strlen( $closing_bracket_stack ) === 0 || $closing_bracket_stack[ strlen(
						$closing_bracket_stack
					) - 1 ] !== ')' )
			) {
				if ( strlen( $closing_bracket_stack ) === 0 ) {
					throw new Exception( 'Missing opening {' );
				}

				$closing_bracket_stack = substr( $closing_bracket_stack, 0, -1 );

				if ( strlen( $buffer ) > 0 ) {
					if ( ord( $buffer[0] ) === self::AT_SIGN ) {
						$node = self::parse_at_rule( $buffer );

						if ( $parent ) {
							$parent->add_node( $node );
						} else {
							$ast[] = $node;
						}
					} else {
						$colon_idx = strpos( $buffer, ':' );

						if ( $parent && $colon_idx !== false ) {
							$node = self::parse_declaration( $buffer, $colon_idx );
							if ( ! $node ) {
								throw new Exception(
									esc_html( sprintf( 'Invalid declaration: `%s`', trim( $buffer ) ) )
								);
							}

							$parent->add_node( $node );
						}
					}
				}

				$grand_parent = array_pop( $stack );

				if ( $grand_parent === null && $parent ) {
					$ast[] = $parent;
				}

				$parent = $grand_parent;

				$buffer = '';
				$node   = null;
			} elseif ( $current_char === self::OPEN_PAREN ) {
				$closing_bracket_stack .= ')';
				$buffer                .= '(';
			} elseif ( $current_char === self::CLOSE_PAREN ) {
				if (
					strlen( $closing_bracket_stack ) === 0
					|| $closing_bracket_stack[ strlen( $closing_bracket_stack ) - 1 ] !== ')'
				) {
					throw new Exception( 'Missing opening (' );
				}

				$closing_bracket_stack = substr( $closing_bracket_stack, 0, -1 );
				$buffer               .= ')';
			} else {
				if (
					strlen( $buffer ) === 0 &&
					(
						$current_char === self::SPACE ||
						$current_char === self::LINE_BREAK ||
						$current_char === self::TAB
					)
				) {
					continue;
				}

				$buffer .= chr( $current_char );
			}
		}

		if ( strlen( $buffer ) > 0 && ord( $buffer[0] ) === self::AT_SIGN ) {
			$ast[] = self::parse_at_rule( $buffer );
		}

		if ( strlen( $closing_bracket_stack ) > 0 && $parent ) {
			if ( $parent instanceof StyleRule ) {
				throw new Exception(
					esc_html(
						sprintf( 'Missing closing } at %s', $parent->get_selector() )
					)
				);
			}
			if ( $parent instanceof AtRule ) {
				throw new Exception(
					esc_html(
						sprintf( 'Missing closing } at %s %s', $parent->get_name(), $parent->get_params() )
					)
				);
			}
		}

		if ( count( $license_comments ) > 0 ) {
			return array_merge( $license_comments, $ast );
		}

		return $ast;
	}

	/**
	 * Parses an at-rule from a buffer string.
	 *
	 * @param  string                               $buffer  The buffer containing the at-rule.
	 * @param  \CSSClassManager\CSSParser\AstNode[] $nodes  The child nodes for the at-rule.
	 * @return \CSSClassManager\CSSParser\AtRule The parsed at-rule node.
	 */
	public static function parse_at_rule( string $buffer, array $nodes = [] ): AtRule
	{
		$buffer_length = strlen( $buffer );
		for ( $i = 5; $i < $buffer_length; $i++ ) {
			$current_char = ord( $buffer[ $i ] );
			if ( $current_char === self::SPACE || $current_char === self::OPEN_PAREN ) {
				$name   = trim( substr( $buffer, 0, $i ) );
				$params = trim( substr( $buffer, $i ) );

				return Ast::at_rule( $name, $params, $nodes );
			}
		}

		return Ast::at_rule( trim( $buffer ), '', $nodes );
	}

	/**
	 * Parses a CSS declaration.
	 *
	 * Extracts property, value, and importance flag from a CSS declaration string.
	 *
	 * @param  string         $buffer  The buffer containing the declaration.
	 * @param  int|false|null $colon_idx  Optional index of the colon in the buffer.
	 * @return \CSSClassManager\CSSParser\Declaration|null The parsed declaration, or null if invalid.
	 */
	private static function parse_declaration( string $buffer, $colon_idx = null ): ?Declaration
	{
		if ( $colon_idx === null ) {
			$colon_idx = strpos( $buffer, ':' );
		}

		if ( $colon_idx === false ) {
			return null;
		}

		$important_idx = strpos( $buffer, '!important', (int) $colon_idx + 1 );

		$length = $important_idx !== false
			? $important_idx - $colon_idx - 1
			: 0;

		return Ast::decl(
			trim( substr( $buffer, 0, $colon_idx ) ),
			trim( substr( $buffer, $colon_idx + 1, $length ) ),
			$important_idx !== false
		);
	}
}
