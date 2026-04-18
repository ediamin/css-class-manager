import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {
	Admin,
	Editor,
	expect,
	test,
} from '@wordpress/e2e-test-utils-playwright';

import {
	addCssClassInModal,
	createNewPost,
	openCssClassManagerModal,
} from '../utils/helpers';

/**
 * E2E tests for the import / export functionality.
 *
 * Tests verify that:
 * - The current class list can be exported as a JSON file.
 * - A valid JSON fixture file can be imported and classes appear in the list.
 * - An invalid file triggers an error notice.
 */

test.describe( 'Import / Export', () => {
	let admin: Admin;

	test.beforeEach( async ( { page, pageUtils, requestUtils } ) => {
		admin = new Admin( {
			page,
			pageUtils,
			editor: new Editor( { page } ),
		} );

		// Reset class names before each test.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { css_class_manager_class_names: [] },
		} );

		await createNewPost( admin );
		await openCssClassManagerModal( page );
		await page
			.getByRole( 'tab', { name: /import.*export|export.*import/i } )
			.click();
	} );

	test( 'can export the class list as a JSON file', async ( { page } ) => {
		await page.getByRole( 'tab', { name: /css classes/i } ).click();
		await addCssClassInModal( page, 'export-class', 'For export test' );
		await page
			.getByRole( 'tab', { name: /import.*export|export.*import/i } )
			.click();

		// Start waiting for the download before triggering the click.
		const [ download ] = await Promise.all( [
			page.waitForEvent( 'download' ),
			page.getByRole( 'button', { name: /export/i } ).click(),
		] );

		// Confirm a file was downloaded.
		expect( download.suggestedFilename() ).toMatch( /\.json$/ );

		// Read the file content and verify it contains the seeded class.
		const tmpPath = path.join( os.tmpdir(), download.suggestedFilename() );
		await download.saveAs( tmpPath );
		const content = JSON.parse( fs.readFileSync( tmpPath, 'utf-8' ) );

		expect( Array.isArray( content ) ).toBe( true );
		const names = content.map( ( item: { name: string } ) => item.name );
		expect( names ).toContain( 'export-class' );
	} );

	test( 'can import classes from a valid JSON file', async ( { page } ) => {
		const fixture = JSON.stringify( [
			{ name: 'imported-class-one', description: 'First import' },
			{ name: 'imported-class-two', description: 'Second import' },
		] );

		const tmpPath = path.join( os.tmpdir(), 'import-fixture.json' );
		fs.writeFileSync( tmpPath, fixture );

		// Use the file input to upload the fixture.
		const fileInput = page.locator( 'input[type="file"]' );
		await fileInput.setInputFiles( tmpPath );

		// The Import component processes the file automatically via the onChange
		// handler — there is no separate "Import" button. Wait for the success
		// snackbar to confirm the async REST save has completed before switching tabs.
		await expect(
			page.locator( '.components-snackbar__content', {
				hasText: /class list imported/i,
			} )
		).toBeVisible();

		// Switch to the CSS Classes tab to verify the imports.
		await page.getByRole( 'tab', { name: /css classes/i } ).click();

		await expect( page.getByText( 'imported-class-one' ) ).toBeVisible();
		await expect( page.getByText( 'imported-class-two' ) ).toBeVisible();
	} );

	test( 'shows an error notice when an invalid file is imported', async ( {
		page,
	} ) => {
		const tmpPath = path.join( os.tmpdir(), 'invalid-import.json' );
		// Write a valid JSON file that is not an array — this triggers the
		// plugin's own "Error: Invalid class list data." notice.
		fs.writeFileSync( tmpPath, JSON.stringify( { notAnArray: true } ) );

		const fileInput = page.locator( 'input[type="file"]' );
		await fileInput.setInputFiles( tmpPath );

		// The Import component processes the file automatically via the onChange
		// handler — there is no separate "Import" button.

		// An error snackbar notice should be displayed.
		await expect(
			page.locator( '.components-snackbar__content', {
				hasText: /invalid class list data/i,
			} )
		).toBeVisible();
	} );
} );
