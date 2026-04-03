import { expect, test } from '@playwright/test';
import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';

import { createNewPost, openCssClassManagerModal } from '../utils/helpers';

/**
 * E2E tests for the CSS Class Manager preferences modal.
 *
 * Covers: opening the modal, adding / editing / deleting class names, and
 * verifying that changes are reflected in the block editor autocomplete.
 */

test.describe( 'CSS Class Manager modal', () => {
	let admin: Admin;
	let editor: Editor;

	test.beforeEach( async ( { page, requestUtils } ) => {
		admin = new Admin( { page, pageUtils: null as never } );
		editor = new Editor( { page } );

		// Start with no user-defined class names.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { css_class_manager_class_names: [] },
		} );

		await createNewPost( admin );
	} );

	test( 'can open the CSS Class Manager modal from the editor menu', async ( {
		page,
	} ) => {
		await openCssClassManagerModal( page );

		await expect(
			page.getByRole( 'dialog', { name: /css class manager/i } )
		).toBeVisible();
	} );

	test( 'can add a new class name and it appears in the list', async ( {
		page,
	} ) => {
		await openCssClassManagerModal( page );

		// Navigate to the "CSS Classes" tab.
		await page.getByRole( 'tab', { name: /css classes/i } ).click();

		// Click the "Add new class" button.
		await page.getByRole( 'button', { name: /add new class/i } ).click();

		// Fill in the class form.
		await page
			.getByRole( 'textbox', { name: /class name/i } )
			.fill( 'modal-test-class' );
		await page
			.getByRole( 'textbox', { name: /description/i } )
			.fill( 'A class added via the modal' );

		// Submit the form.
		await page.getByRole( 'button', { name: /save/i } ).click();

		// The new class should appear in the class list.
		await expect( page.getByText( 'modal-test-class' ) ).toBeVisible();
	} );

	test( 'can delete a class name', async ( { page, requestUtils } ) => {
		// Pre-seed a class to delete.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				css_class_manager_class_names: [
					{ name: 'class-to-delete', description: '' },
				],
			},
		} );

		await page.reload();
		await openCssClassManagerModal( page );

		await page.getByRole( 'tab', { name: /css classes/i } ).click();

		// Click the delete button for the seeded class.
		await page
			.getByRole( 'row', { name: /class-to-delete/i } )
			.getByRole( 'button', { name: /delete/i } )
			.click();

		// Confirm deletion in the dialog if one appears.
		const confirmBtn = page.getByRole( 'button', {
			name: /confirm|yes|ok/i,
		} );
		if ( await confirmBtn.isVisible() ) {
			await confirmBtn.click();
		}

		// The class should no longer appear.
		await expect( page.getByText( 'class-to-delete' ) ).not.toBeVisible();
	} );

	test( 'newly added class appears as autocomplete suggestion in the inspector', async ( {
		page,
		requestUtils,
	} ) => {
		// Pre-seed a class.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				css_class_manager_class_names: [
					{ name: 'autocomplete-suggest', description: '' },
				],
			},
		} );

		await page.reload();

		// Add a paragraph block.
		await editor.canvas
			.getByRole( 'button', { name: /add default block/i } )
			.click();
		await page.keyboard.type( 'Paragraph.' );

		// Open inspector and look for the class in the autocomplete.
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		await editor.canvas
			.getByRole( 'document', { name: /paragraph/i } )
			.first()
			.click();

		const classInput = page.getByRole( 'combobox', {
			name: /additional css class/i,
		} );
		await classInput.fill( 'autocomplete' );

		await expect(
			page.getByRole( 'option', { name: /autocomplete-suggest/i } )
		).toBeVisible();
	} );
} );
