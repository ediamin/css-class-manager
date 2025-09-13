<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\ClassNameParser;
use Yoast\PHPUnitPolyfills\TestCases\TestCase;

/**
 * Test class for the CSS class parser.
 */
class ClassNameParserTest extends TestCase
{
	/**
	 * Test basic class extraction.
	 */
	public function test_basic_classes(): void
	{
		$css    = '.class1 { color: red; } .class2 { font-size: 14px; }';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [ 'class1', 'class2' ];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test complex selectors with multiple classes.
	 */
	public function test_complex_selectors(): void
	{
		$css    = '.container .header .nav-item { display: flex; } .btn.btn-primary { padding: 10px; }';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [ 'container', 'header', 'nav-item', 'btn', 'btn-primary' ];
		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test CSS combinators.
	 */
	public function test_combinators(): void
	{
		$css    = '.parent > .child { margin: 0; } .nav + .menu { padding: 5px; }';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [ 'parent', 'child', 'nav', 'menu' ];
		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test nested CSS with nesting.
	 */
	public function test_nesting(): void
	{
		$css    = '.parent { .child { color: blue; } &.active { background: red; } }';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [ 'parent', 'child', 'active' ];
		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test TailwindCSS style classes.
	 */
	public function test_tailwind_css(): void
	{
		$css    = '.bg-blue-500 { background-color: #3b82f6; } .text-center { text-align: center; }
				.hover:hover { transition: all 0.2s; } .sm\:text-lg { font-size: 1.125rem; }
				.md\:max-w-3xl { max-width: 48rem; }

				.dark\:\[--pattern-fg\:var\(--color-white\)\]\/10 {
					@media (prefers-color-scheme: dark) {
						--pattern-fg: color-mix(in srgb, #fff 10%, transparent);
						@supports (color: color-mix(in lab, red, red)) {
							--pattern-fg: color-mix(in oklab, var(--color-white) 10%, transparent);
						}
					}
				}

				.\[--pattern-fg\:var\(--color-gray-950\)\]\/5 {
					--pattern-fg: color-mix(in srgb, oklch(13% 0.028 261.692) 5%, transparent);
					@supports (color: color-mix(in lab, red, red)) {
						--pattern-fg: color-mix(in oklab, var(--color-gray-950) 5%, transparent);
					}
				}

				.bg-\[image\:repeating-linear-gradient\(315deg\,_var\(--pattern-fg\)_0\,_var\(--pattern-fg\)_1px\,_transparent_0\,_transparent_50\%\)\] {
					background-image: repeating-linear-gradient(315deg, var(--pattern-fg) 0, var(--pattern-fg) 1px, transparent 0, transparent 50%);
				}
				.w-5\.5 {
					width: calc(var(--spacing) * 5.5);
				}
		';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [
			'bg-blue-500',
			'text-center',
			'hover',
			'sm:text-lg',
			'md:max-w-3xl',
			'dark:[--pattern-fg:var(--color-white)]/10',
			'[--pattern-fg:var(--color-gray-950)]/5',
			'bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]',
			'w-5.5',
		];

		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test comment removal functionality.
	 */
	public function test_comments(): void
	{
		$css    = '/* This is a comment */ .class1 { color: red; } /* Another comment */';
		$parser = new ClassNameParser( $css );
		$result = $parser->get_classes();

		$expected = [ 'class1' ];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test edge cases.
	 */
	public function test_edge_cases(): void
	{
		// Empty CSS.
		$parser = new ClassNameParser( '' );
		$result = $parser->get_classes();
		$this->assertEmpty( $result );

		// Invalid selectors that should not crash.
		$css      = 'invalid { color: red; } .class1 { padding: 10px; }';
		$parser   = new ClassNameParser( $css );
		$result   = $parser->get_classes();
		$expected = [ 'class1' ];

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Test at-rules
	 */
	public function test_at_rules(): void
	{
		$css      = '
            @media (min-width: 768px) {
                .responsive-class { display: flex; }
                .md-only { width: 50%; }
            }

            @supports (display: grid) {
                .grid-container { display: grid; }
            }

            @container (min-width: 400px) {
                .container-query { font-size: 1.2em; }
            }
        ';
		$parser   = new ClassNameParser( $css );
		$result   = $parser->get_classes();
		$expected = [ 'container-query', 'grid-container', 'md-only', 'responsive-class' ];

		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	public function test_class_names_inside_pseudo_classes(): void
	{
		$css      = '
			html {
			font-family: sans-serif;
			font-size: 150%;
			}

			:is(section.is-styling, aside.is-styling, footer.is-styling) a {
			color: red;
			}

			:where(section.where-styling, aside.where-styling, footer.where-styling) a {
			color: orange;
			}
		';
		$parser   = new ClassNameParser( $css );
		$result   = $parser->get_classes();
		$expected = [ 'is-styling', 'where-styling' ];

		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}

	public function test_tailwindcss_playground_style(): void
	{
		$css      = '
			/*! tailwindcss v4.1.13 | MIT License | https://tailwindcss.com */
			@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-space-y-reverse:0;--tw-border-style:solid;--tw-font-weight:initial}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-sky-300:#77d4ff;--color-sky-400:#00bcfe;--color-sky-800:#005986;--color-gray-100:#f3f4f6;--color-gray-300:#d1d5dc;--color-gray-700:#364153;--color-gray-950:#030712;--color-white:#fff;--spacing:.25rem;--container-lg:32rem;--text-sm:.875rem;--font-weight-medium:500;--font-weight-semibold:600;--radius-xl:.75rem;--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}@supports (color:lab(0% 0 0)){:root,:host{--color-sky-300:lab(80.3307% -20.2945 -31.385);--color-sky-400:lab(70.687% -23.6078 -45.9483);--color-sky-800:lab(35.164% -9.57692 -34.4068);--color-gray-100:lab(96.1596% -.0823438 -1.13575);--color-gray-300:lab(85.1236% -.612259 -3.7138);--color-gray-700:lab(27.1134% -.956401 -12.3224);--color-gray-950:lab(1.90334% .278696 -5.48866)}}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}}@layer components;@layer utilities{.relative{position:relative}.-top-px{top:-1px}.-right-px{right:-1px}.-bottom-px{bottom:-1px}.-left-px{left:-1px}.col-span-full{grid-column:1/-1}.col-start-1{grid-column-start:1}.col-start-2{grid-column-start:2}.col-start-3{grid-column-start:3}.col-start-4{grid-column-start:4}.row-span-full{grid-row:1/-1}.row-start-1{grid-row-start:1}.row-start-2{grid-row-start:2}.row-start-3{grid-row-start:3}.row-start-4{grid-row-start:4}.my-6{margin-block:calc(var(--spacing)*6)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-11\.5{margin-bottom:calc(var(--spacing)*11.5)}.ml-3{margin-left:calc(var(--spacing)*3)}.flex{display:flex}.grid{display:grid}.h-6{height:calc(var(--spacing)*6)}.h-\[1lh\]{height:1lh}.h-px{height:1px}.min-h-screen{min-height:100vh}.w-5\.5{width:calc(var(--spacing)*5.5)}.w-full{width:100%}.max-w-lg{max-width:var(--container-lg)}.shrink-0{flex-shrink:0}.grid-cols-\[1fr_2\.5rem_auto_2\.5rem_1fr\]{grid-template-columns:1fr 2.5rem auto 2.5rem 1fr}.grid-rows-\[1fr_1px_auto_1px_1fr\]{grid-template-rows:1fr 1px auto 1px 1fr}.flex-col{flex-direction:column}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-6>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*6)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*6)*calc(1 - var(--tw-space-y-reverse)))}.rounded-xl{border-radius:var(--radius-xl)}.border-x{border-inline-style:var(--tw-border-style);border-inline-width:1px}.border-\(--pattern-fg\){border-color:var(--pattern-fg)}.border-x-\(--pattern-fg\){border-inline-color:var(--pattern-fg)}.bg-\(--pattern-fg\){background-color:var(--pattern-fg)}.bg-gray-100{background-color:var(--color-gray-100)}.bg-white{background-color:var(--color-white)}.bg-\[image\:repeating-linear-gradient\(315deg\,_var\(--pattern-fg\)_0\,_var\(--pattern-fg\)_1px\,_transparent_0\,_transparent_50\%\)\]{background-image:repeating-linear-gradient(315deg,var(--pattern-fg)0,var(--pattern-fg)1px,transparent 0,transparent 50%)}.bg-\[size\:10px_10px\]{background-size:10px 10px}.bg-fixed{background-attachment:fixed}.fill-sky-400\/25{fill:#00bcfe40}@supports (color:color-mix(in lab, red, red)){.fill-sky-400\/25{fill:color-mix(in oklab,var(--color-sky-400)25%,transparent)}}.stroke-sky-400\/25{stroke:#00bcfe40}@supports (color:color-mix(in lab, red, red)){.stroke-sky-400\/25{stroke:color-mix(in oklab,var(--color-sky-400)25%,transparent)}}.stroke-sky-800{stroke:var(--color-sky-800)}.p-2{padding:calc(var(--spacing)*2)}.p-10{padding:calc(var(--spacing)*10)}.font-mono{font-family:var(--font-mono)}.text-sm\/7{font-size:var(--text-sm);line-height:calc(var(--spacing)*7)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.text-gray-700{color:var(--color-gray-700)}.text-gray-950{color:var(--color-gray-950)}.underline{text-decoration-line:underline}.decoration-sky-400{text-decoration-color:var(--color-sky-400)}.underline-offset-3{text-underline-offset:3px}.\[--pattern-fg\:var\(--color-gray-950\)\]\/5{--pattern-fg:#0307120d}@supports (color:color-mix(in lab, red, red)){.\[--pattern-fg\:var\(--color-gray-950\)\]\/5{--pattern-fg:color-mix(in oklab,var(--color-gray-950)5%,transparent)}}@media not (prefers-color-scheme:dark){.not-dark\:hidden{display:none}}@media (hover:hover){.hover\:decoration-2:hover{text-decoration-thickness:2px}}@media (prefers-color-scheme:dark){.dark\:hidden{display:none}}@media (prefers-color-scheme:dark){.dark\:bg-gray-950{background-color:var(--color-gray-950)}}@media (prefers-color-scheme:dark){.dark\:bg-white\/10{background-color:#ffffff1a}@supports (color:color-mix(in lab, red, red)){.dark\:bg-white\/10{background-color:color-mix(in oklab,var(--color-white)10%,transparent)}}}@media (prefers-color-scheme:dark){.dark\:stroke-sky-300{stroke:var(--color-sky-300)}}@media (prefers-color-scheme:dark){.dark\:text-gray-300{color:var(--color-gray-300)}}@media (prefers-color-scheme:dark){.dark\:text-white{color:var(--color-white)}}@media (prefers-color-scheme:dark){.dark\:\[--pattern-fg\:var\(--color-white\)\]\/10{--pattern-fg:#ffffff1a}@supports (color:color-mix(in lab, red, red)){.dark\:\[--pattern-fg\:var\(--color-white\)\]\/10{--pattern-fg:color-mix(in oklab,var(--color-white)10%,transparent)}}}}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-font-weight{syntax:"*";inherits:false}
		';
		$parser   = new ClassNameParser( $css );
		$result   = $parser->get_classes();
		$expected = [
			'relative',
			'-top-px',
			'-right-px',
			'-bottom-px',
			'-left-px',
			'col-span-full',
			'col-start-1',
			'col-start-2',
			'col-start-3',
			'col-start-4',
			'row-span-full',
			'row-start-1',
			'row-start-2',
			'row-start-3',
			'row-start-4',
			'my-6',
			'mb-3',
			'mb-11.5',
			'ml-3',
			'flex',
			'grid',
			'h-6',
			'h-[1lh]',
			'h-px',
			'min-h-screen',
			'w-5.5',
			'w-full',
			'max-w-lg',
			'shrink-0',
			'grid-cols-[1fr_2.5rem_auto_2.5rem_1fr]',
			'grid-rows-[1fr_1px_auto_1px_1fr]',
			'flex-col',
			'space-y-3',
			'space-y-6',
			'rounded-xl',
			'border-x',
			'border-(--pattern-fg)',
			'border-x-(--pattern-fg)',
			'bg-(--pattern-fg)',
			'bg-gray-100',
			'bg-white',
			'bg-[image:repeating-linear-gradient(315deg,_var(--pattern-fg)_0,_var(--pattern-fg)_1px,_transparent_0,_transparent_50%)]',
			'bg-[size:10px_10px]',
			'bg-fixed',
			'fill-sky-400/25',
			'stroke-sky-400/25',
			'stroke-sky-800',
			'p-2',
			'p-10',
			'font-mono',
			'text-sm/7',
			'font-medium',
			'font-semibold',
			'text-gray-700',
			'text-gray-950',
			'underline',
			'decoration-sky-400',
			'underline-offset-3',
			'[--pattern-fg:var(--color-gray-950)]/5',
			'not-dark:hidden',
			'hover:decoration-2',
			'dark:hidden',
			'dark:bg-gray-950',
			'dark:bg-white/10',
			'dark:stroke-sky-300',
			'dark:text-gray-300',
			'dark:text-white',
			'dark:[--pattern-fg:var(--color-white)]/10',
		];

		sort( $expected );
		sort( $result );

		$this->assertEquals( $expected, $result );
	}
}
