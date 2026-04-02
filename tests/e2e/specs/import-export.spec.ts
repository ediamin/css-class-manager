import path from 'path';
import fs from 'fs';
import os from 'os';

import { expect, test } from '@playwright/test';
import { Admin } from '@wordpress/e2e-test-utils-playwright';

import { createNewPost, openCssClassManagerModal } from '../utils/helpers';

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

	test.beforeEach( async ( { page, requestUtils } ) => {
		admin = new Admin( { page, pageUtils: null as never } );

		// Reset class names before each test.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				css_class_manager_class_names: [
					{ name: 'export-class', description: 'For export test' },
				],
			},
		} );

		await createNewPost( admin );
		await openCssClassManagerModal( page );
		await page
			.getByRole( 'tab', { name: /import.*export|export.*import/i } )
			.click();
	} );

	test( 'can export the class list as a JSON file', async ( { page } ) => {
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

		// Confirm the import if a dialog or button appears.
		const importBtn = page.getByRole( 'button', { name: /^import$/i } );
		if ( await importBtn.isVisible() ) {
			await importBtn.click();
		}

		// Switch to the CSS Classes tab to verify the imports.
		await page.getByRole( 'tab', { name: /css classes/i } ).click();

		await expect( page.getByText( 'imported-class-one' ) ).toBeVisible();
		await expect( page.getByText( 'imported-class-two' ) ).toBeVisible();
	} );

	test( 'shows an error notice when an invalid file is imported', async ( {
		page,
	} ) => {
		const tmpPath = path.join( os.tmpdir(), 'invalid-import.json' );
		fs.writeFileSync( tmpPath, 'this is not valid json {{{' );

		const fileInput = page.locator( 'input[type="file"]' );
		await fileInput.setInputFiles( tmpPath );

		const importBtn = page.getByRole( 'button', { name: /^import$/i } );
		if ( await importBtn.isVisible() ) {
			await importBtn.click();
		}

		// An error notice or message should be displayed.
		await expect(
			page
				.getByRole( 'alert' )
				.or( page.getByText( /invalid|error|failed/i ) )
		).toBeVisible();
	} );
} );
