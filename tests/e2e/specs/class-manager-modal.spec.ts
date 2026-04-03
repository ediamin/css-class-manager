import {
	Admin,
	Editor,
	expect,
	test,
} from '@wordpress/e2e-test-utils-playwright';

import {
	createNewPost,
	openAdvancedInspectorSection,
	openCssClassManagerModal,
} from '../utils/helpers';

/**
 * E2E tests for the CSS Class Manager preferences modal.
 *
 * Covers: opening the modal, adding / editing / deleting class names, and
 * verifying that changes are reflected in the block editor autocomplete.
 */

test.describe( 'CSS Class Manager modal', () => {
	let admin: Admin;
	let editor: Editor;

	test.beforeEach( async ( { page, pageUtils, requestUtils } ) => {
		editor = new Editor( { page } );
		admin = new Admin( { page, pageUtils, editor } );

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

		// Fill in the class form (the form is directly visible — no "Add" button needed).
		await page
			.getByRole( 'textbox', { name: /class name/i } )
			.fill( 'modal-test-class' );
		await page
			.getByRole( 'textbox', { name: /description/i } )
			.fill( 'A class added via the modal' );

		// Submit the form.
		await page.getByRole( 'button', { name: /add class/i } ).click();

		// The new class should appear in the class list (exact text on the panel toggle).
		await expect(
			page.getByText( 'modal-test-class', { exact: true } )
		).toBeVisible();
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

		// Expand the collapsible panel for the class to delete.
		const classPanel = page.getByRole( 'button', {
			name: /class-to-delete/i,
		} );
		await classPanel.click();

		// Click the delete button for the seeded class.
		await page.getByRole( 'button', { name: /^delete$/i } ).click();

		// Confirm deletion.
		await page.getByRole( 'button', { name: /confirm delete/i } ).click();

		// The class panel should no longer appear (exact text on the panel toggle).
		await expect(
			page.getByText( 'class-to-delete', { exact: true } )
		).not.toBeVisible();
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

		await openAdvancedInspectorSection( page );

		const classInput = page.getByRole( 'combobox', {
			name: /additional css class/i,
		} );
		await classInput.fill( 'autocomplete' );

		await expect(
			page.getByRole( 'option', { name: /autocomplete-suggest/i } )
		).toBeVisible();
	} );
} );
