import sanitizeHtmlClass from '../../utils/sanitize-html-class';

describe( 'sanitizeHtmlClass', () => {
	it( 'passes alphanumeric characters through unchanged', () => {
		expect( sanitizeHtmlClass( 'myClass123' ) ).toBe( 'myClass123' );
	} );

	it( 'allows hyphens and underscores', () => {
		expect( sanitizeHtmlClass( 'my-class_name' ) ).toBe( 'my-class_name' );
	} );

	it( 'allows colons for Tailwind utility classes', () => {
		expect( sanitizeHtmlClass( 'sm:text-lg' ) ).toBe( 'sm:text-lg' );
		expect( sanitizeHtmlClass( 'dark:bg-gray-950' ) ).toBe(
			'dark:bg-gray-950'
		);
		expect( sanitizeHtmlClass( 'hover:decoration-2' ) ).toBe(
			'hover:decoration-2'
		);
	} );

	it( 'strips spaces from the class name', () => {
		expect( sanitizeHtmlClass( 'my class' ) ).toBe( 'myclass' );
	} );

	it( 'removes percent-encoded sequences', () => {
		expect( sanitizeHtmlClass( 'my%20class' ) ).toBe( 'myclass' );
		expect( sanitizeHtmlClass( 'my%2Fclass' ) ).toBe( 'myclass' );
	} );

	it( 'strips disallowed special characters', () => {
		expect( sanitizeHtmlClass( 'my-class!' ) ).toBe( 'my-class' );
		expect( sanitizeHtmlClass( 'my.class' ) ).toBe( 'myclass' );
		expect( sanitizeHtmlClass( 'my@class' ) ).toBe( 'myclass' );
	} );

	it( 'returns an empty string for empty input', () => {
		expect( sanitizeHtmlClass( '' ) ).toBe( '' );
	} );

	it( 'returns an empty string when all characters are invalid', () => {
		expect( sanitizeHtmlClass( '!@#$%^&*()' ) ).toBe( '' );
	} );
} );
