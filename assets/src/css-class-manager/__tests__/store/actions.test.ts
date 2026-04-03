/**
 * Store action tests.
 *
 * Synchronous action creators are tested by verifying the action objects they
 * return using an isolated registry.
 *
 * Async actions use the global default registry because the store's thunks
 * internally call `select( STORE_NAME )` and `dispatch( STORE_NAME )` from
 * the top-level `@wordpress/data` module, which always operates on the
 * default registry.
 */
import apiFetch from '@wordpress/api-fetch';
import {
	createRegistry,
	dispatch as globalDispatch,
	register as globalRegister,
	select as globalSelect,
} from '@wordpress/data';

import { STORE_NAME } from '../../constants';
import store from '../../store';

jest.mock( '@wordpress/api-fetch' );

const mockedApiFetch = apiFetch as jest.MockedFunction< typeof apiFetch >;

// ---------------------------------------------------------------------------
// Helper — isolated registry for synchronous-only tests
// ---------------------------------------------------------------------------

function createStoreRegistry() {
	const registry = createRegistry();
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const freshStore = require( '../../store' ).default;
	registry.register( freshStore );
	return registry;
}

// ---------------------------------------------------------------------------
// Synchronous actions
// ---------------------------------------------------------------------------

describe( 'startSavingSettings / completedSavingSettings', () => {
	it( 'toggles isSavingSettings', () => {
		const registry = createStoreRegistry();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe(
			false
		);

		registry.dispatch( STORE_NAME ).startSavingSettings();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe( true );

		registry.dispatch( STORE_NAME ).completedSavingSettings();
		expect( registry.select( STORE_NAME ).isSavingSettings() ).toBe(
			false
		);
	} );
} );

describe( 'createSuccessNotice', () => {
	it( 'adds a notice with status "success"', () => {
		const registry = createStoreRegistry();
		registry
			.dispatch( STORE_NAME )
			.createSuccessNotice( 'Added class: btn' );

		const [ notice ] = registry.select( STORE_NAME ).getNotices();
		expect( notice ).toMatchObject( {
			content: 'Added class: btn',
			status: 'success',
		} );
		expect( typeof notice.id ).toBe( 'string' );
	} );
} );

describe( 'createErrorNotice', () => {
	it( 'adds a notice with status "error" and explicitDismiss', () => {
		const registry = createStoreRegistry();
		registry
			.dispatch( STORE_NAME )
			.createErrorNotice( 'Something failed.' );

		const [ notice ] = registry.select( STORE_NAME ).getNotices();
		expect( notice ).toMatchObject( {
			content: 'Something failed.',
			status: 'error',
			explicitDismiss: true,
		} );
	} );
} );

describe( 'removeNotice', () => {
	it( 'removes the notice with the given id', () => {
		const registry = createStoreRegistry();
		registry.dispatch( STORE_NAME ).createSuccessNotice( 'notice 1' );
		registry.dispatch( STORE_NAME ).createSuccessNotice( 'notice 2' );

		const notices = registry.select( STORE_NAME ).getNotices();
		expect( notices ).toHaveLength( 2 );

		registry.dispatch( STORE_NAME ).removeNotice( notices[ 0 ].id );
		const remaining = registry.select( STORE_NAME ).getNotices();

		expect( remaining ).toHaveLength( 1 );
		expect( remaining[ 0 ].content ).toBe( 'notice 2' );
	} );
} );

// ---------------------------------------------------------------------------
// Async actions — use the default global registry because the store's thunks
// internally reference the global `select` and `dispatch`.
// ---------------------------------------------------------------------------

describe( 'saveUserDefinedClassNames', () => {
	beforeAll( () => {
		globalRegister( store );
	} );

	beforeEach( () => {
		mockedApiFetch.mockResolvedValue( {} );
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'persists a new class name via apiFetch and adds it to the store', async () => {
		await globalDispatch( STORE_NAME ).saveUserDefinedClassNames(
			{ name: 'new-class', description: 'My new class' },
			[] // no existing user-defined classes
		);

		expect( mockedApiFetch ).toHaveBeenCalledWith(
			expect.objectContaining( {
				path: '/wp/v2/settings',
				method: 'post',
			} )
		);

		const userDefined =
			globalSelect( STORE_NAME ).getUserDefinedClassNames();
		const names = userDefined.map( ( c ) => c.name );
		expect( names ).toContain( 'new-class' );
	} );

	it( 'updates an existing class name when previousClassPreset is provided', async () => {
		const existing = {
			name: 'old-class',
			id: 'existing-id',
			description: '',
		};

		await globalDispatch( STORE_NAME ).saveUserDefinedClassNames(
			{ name: 'updated-class', description: '' },
			[ existing ],
			existing
		);

		const userDefined =
			globalSelect( STORE_NAME ).getUserDefinedClassNames();
		const names = userDefined.map( ( c ) => c.name );

		expect( names ).toContain( 'updated-class' );
		expect( names ).not.toContain( 'old-class' );
	} );

	it( 'dispatches an error notice when apiFetch rejects', async () => {
		mockedApiFetch.mockRejectedValue( new Error( 'Network error' ) );

		await globalDispatch( STORE_NAME ).saveUserDefinedClassNames(
			{ name: 'fail-class' },
			[]
		);

		const notices = globalSelect( STORE_NAME ).getNotices();
		expect( notices.some( ( n ) => n.status === 'error' ) ).toBe( true );
	} );
} );

// ---------------------------------------------------------------------------
// Async action: deleteUserDefinedClassName
// ---------------------------------------------------------------------------

describe( 'deleteUserDefinedClassName', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'removes the class name from the store and calls apiFetch', async () => {
		mockedApiFetch.mockResolvedValue( {} );

		const classToDelete = { name: 'to-delete', id: 'del-id' };

		await globalDispatch( STORE_NAME ).saveUserDefinedClassNames(
			{ name: 'to-delete' },
			[]
		);

		await globalDispatch( STORE_NAME ).deleteUserDefinedClassName(
			classToDelete,
			globalSelect( STORE_NAME ).getUserDefinedClassNames()
		);

		const names = globalSelect( STORE_NAME )
			.getUserDefinedClassNames()
			.map( ( c ) => c.name );

		expect( names ).not.toContain( 'to-delete' );
	} );

	it( 'dispatches an error notice when apiFetch rejects', async () => {
		mockedApiFetch.mockRejectedValue( new Error( 'Server error' ) );

		await globalDispatch( STORE_NAME ).deleteUserDefinedClassName(
			{ name: 'some-class', id: 'id-1' },
			[ { name: 'some-class', id: 'id-1' } ]
		);

		const notices = globalSelect( STORE_NAME ).getNotices();
		expect( notices.some( ( n ) => n.status === 'error' ) ).toBe( true );
	} );
} );

// ---------------------------------------------------------------------------
// Async action: updateUserSettings
// ---------------------------------------------------------------------------

describe( 'updateUserSettings', () => {
	afterEach( () => {
		jest.clearAllMocks();
	} );

	it( 'updates user settings in the store after a successful save', async () => {
		mockedApiFetch.mockResolvedValue( {} );

		const newSettings = {
			inspectorControlPosition: 'own-panel' as const,
			hideThemeJSONGeneratedClasses: true,
			allowAddingClassNamesWithoutCreating: true,
		};

		await globalDispatch( STORE_NAME ).updateUserSettings( newSettings );

		expect( globalSelect( STORE_NAME ).getUserSettings() ).toEqual(
			newSettings
		);
	} );

	it( 'dispatches an error notice when the save fails', async () => {
		mockedApiFetch.mockRejectedValue( new Error( 'Unauthorized' ) );

		await globalDispatch( STORE_NAME ).updateUserSettings( {
			inspectorControlPosition: 'default',
			hideThemeJSONGeneratedClasses: false,
			allowAddingClassNamesWithoutCreating: false,
		} );

		const notices = globalSelect( STORE_NAME ).getNotices();
		expect( notices.some( ( n ) => n.status === 'error' ) ).toBe( true );
	} );
} );
