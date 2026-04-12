/**
 * Ambient global declarations for Jest APIs.
 *
 * Jest injects these into the global scope at runtime. TypeScript needs to
 * know about them at compile time. `@jest/globals` ships the same types but
 * as named module exports, not as globals. This file re-exposes them as
 * ambient globals so test files can use them without explicit imports.
 */
import type {
	afterAll as _afterAll,
	afterEach as _afterEach,
	beforeAll as _beforeAll,
	beforeEach as _beforeEach,
	describe as _describe,
	expect as _expect,
	it as _it,
	jest as _jest,
	test as _test,
} from '@jest/globals';

declare global {
	const afterAll: typeof _afterAll;
	const afterEach: typeof _afterEach;
	const beforeAll: typeof _beforeAll;
	const beforeEach: typeof _beforeEach;
	const describe: typeof _describe;
	const expect: typeof _expect;
	const it: typeof _it;
	const jest: typeof _jest;
	const test: typeof _test;

	namespace jest {
		type Mock< T extends ( ...args: any[] ) => any = ( ...args: any[] ) => any > =
			import( 'jest-mock' ).Mock< T >;
		type MockedFunction<
			T extends ( ...args: any[] ) => any = ( ...args: any[] ) => any,
		> = import( 'jest-mock' ).MockedFunction< T >;
		type MockedClass< T extends new ( ...args: any[] ) => any > =
			import( 'jest-mock' ).MockedClass< T >;
		type SpyInstance<
			T extends ( ...args: any[] ) => any = ( ...args: any[] ) => any,
		> = import( 'jest-mock' ).MockInstance< T >;
	}
}
