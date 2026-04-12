/**
 * Store selector tests.
 *
 * Each test registers the store into an isolated @wordpress/data registry so
 * that state mutations in one test do not bleed into another. The
 * cssClassManager global is configured by tests/jest/setup.js.
 */
import { createRegistry } from '@wordpress/data';

import { STORE_NAME } from '../../constants';

import type { UserSettings } from '../../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a fresh @wordpress/data registry with the store registered.
 * Importing the store module inside jest.isolateModules() ensures a clean
 * initialState for each test group.
 */
function createStoreRegistry() {
	const registry = createRegistry() as ReturnType< typeof createRegistry > & {
		register: ( store: unknown ) => void;
	};

	// Load a fresh copy of the store so that initialState is not shared.
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const store = require( '../../store' ).default;
	registry.register( store );

	return registry;
}

// ---------------------------------------------------------------------------
// isSavingSettings
// ---------------------------------------------------------------------------

describe( 'isSavingSettings', () => {
	it( 'returns false by default', () => {
		const registry = createStoreRegistry();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe(
			false
		);
	} );

	it( 'returns true after startSavingSettings is dispatched', () => {
		const registry = createStoreRegistry();
		registry.dispatch( STORE_NAME ).startSavingSettings();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe( true );
	} );

	it( 'returns false after completedSavingSettings is dispatched', () => {
		const registry = createStoreRegistry();
		registry.dispatch( STORE_NAME ).startSavingSettings();
		registry.dispatch( STORE_NAME ).completedSavingSettings();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe(
			false
		);
	} );
} );

// ---------------------------------------------------------------------------
// getNotices / createSuccessNotice / createErrorNotice / removeNotice
// ---------------------------------------------------------------------------

describe( 'notices', () => {
	it( 'returns an empty list by default', () => {
		const registry = createStoreRegistry();
		expect( registry.select( STORE_NAME ).getNotices() ).toEqual( [] );
	} );

	it( 'appends a success notice', () => {
		const registry = createStoreRegistry();
		registry.dispatch( STORE_NAME ).createSuccessNotice( 'Class added.' );

		const notices = registry.select( STORE_NAME ).getNotices();
		expect( notices ).toHaveLength( 1 );
		expect( notices[ 0 ] ).toMatchObject( {
			content: 'Class added.',
			status: 'success',
		} );
	} );

	it( 'appends an error notice with explicitDismiss', () => {
		const registry = createStoreRegistry();
		registry
			.dispatch( STORE_NAME )
			.createErrorNotice( 'Something went wrong.' );

		const notices = registry.select( STORE_NAME ).getNotices();
		expect( notices[ 0 ] ).toMatchObject( {
			content: 'Something went wrong.',
			status: 'error',
			explicitDismiss: true,
		} );
	} );

	it( 'removes a notice by id', () => {
		const registry = createStoreRegistry();
		registry
			.dispatch( STORE_NAME )
			.createSuccessNotice( 'Temporary notice.' );

		const [ notice ] = registry.select( STORE_NAME ).getNotices();
		registry.dispatch( STORE_NAME ).removeNotice( notice.id );

		expect( registry.select( STORE_NAME ).getNotices() ).toHaveLength( 0 );
	} );
} );

// ---------------------------------------------------------------------------
// getUserSettings
// ---------------------------------------------------------------------------

describe( 'getUserSettings', () => {
	it( 'returns the initial user settings from the global', () => {
		const registry = createStoreRegistry();
		const settings = registry
			.select( STORE_NAME )
			.getUserSettings() as UserSettings;

		expect( settings ).toMatchObject( {
			inspectorControlPosition: 'default',
			hideThemeJSONGeneratedClasses: false,
			allowAddingClassNamesWithoutCreating: false,
		} );
	} );
} );

// ---------------------------------------------------------------------------
// getPanelLabel
// ---------------------------------------------------------------------------

describe( 'getPanelLabel', () => {
	it( 'returns the initial panel label from the global', () => {
		const registry = createStoreRegistry();
		expect( registry.select( STORE_NAME ).getPanelLabel() ).toBe(
			'CSS Classes'
		);
	} );
} );

// ---------------------------------------------------------------------------
// getCssClassNames — sorting logic
// ---------------------------------------------------------------------------

describe( 'getCssClassNames', () => {
	it( 'returns an empty list when no class names are defined', () => {
		const registry = createStoreRegistry();
		expect( registry.select( STORE_NAME ).getCssClassNames() ).toEqual(
			[]
		);
	} );

	it( 'sorts class names case-insensitively by name', () => {
		// Seed the global cssClassManager mock with out-of-order names so the
		// store's initialState is populated, then read back via getCssClassNames.
		const original = cssClassManager.filteredClassNames;

		cssClassManager.filteredClassNames = [
			{ name: 'Zebra', description: '' },
			{ name: 'apple', description: '' },
			{ name: 'Mango', description: '' },
		];

		// createStoreRegistry uses require() to get a fresh store copy so it
		// picks up the updated global.
		jest.resetModules();
		const registry = createStoreRegistry();

		const names = registry
			.select( STORE_NAME )
			.getCssClassNames()
			.map( ( c: { name: string } ) => c.name );

		const sorted = [ ...names ].sort( ( a, b ) =>
			a.toLowerCase().localeCompare( b.toLowerCase() )
		);
		expect( names ).toEqual( sorted );

		// Restore original value.
		cssClassManager.filteredClassNames = original;
		jest.resetModules();
	} );
} );
