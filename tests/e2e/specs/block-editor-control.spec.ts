import {
	Admin,
	Editor,
	expect,
	test,
} from '@wordpress/e2e-test-utils-playwright';

import {
	createNewPost,
	openAdvancedInspectorSection,
	selectFirstBlock,
} from '../utils/helpers';

/**
 * E2E tests for the CSS class autocomplete control in the block inspector.
 *
 * These tests verify that the plugin's control replaces the WordPress core
 * "Additional CSS class(es)" input, that class names can be typed and selected
 * from the suggestions, and that the applied class persists after saving.
 */

test.describe( 'Block editor CSS class control', () => {
	let admin: Admin;
	let editor: Editor;

	test.beforeEach( async ( { page, requestUtils } ) => {
		admin = new Admin( { page, pageUtils: null as never } );
		editor = new Editor( { page } );

		// Ensure a clean state: delete all posts created in previous runs.
		await requestUtils.deleteAllPosts();

		await createNewPost( admin );
	} );

	test( 'renders the plugin CSS class control in the block inspector', async ( {
		page,
	} ) => {
		// Insert a paragraph block and select it.
		await editor.canvas
			.getByRole( 'button', { name: /add default block/i } )
			.click();
		await page.keyboard.type( 'Test paragraph.' );

		// Open the block inspector sidebar.
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		await selectFirstBlock( editor, 'Paragraph' );
		await openAdvancedInspectorSection( page );

		// The plugin replaces the core input with a react-select combobox.
		await expect(
			page.getByRole( 'combobox', { name: /additional css class/i } )
		).toBeVisible();
	} );

	test( 'applies a class from the autocomplete dropdown and it persists after save', async ( {
		page,
		requestUtils,
	} ) => {
		// Pre-seed a class name via the REST API so it appears in suggestions.
		await requestUtils.rest( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: {
				css_class_manager_class_names: [
					{ name: 'e2e-test-class', description: '' },
				],
			},
		} );

		// Insert a paragraph block.
		await editor.canvas
			.getByRole( 'button', { name: /add default block/i } )
			.click();
		await page.keyboard.type( 'Paragraph with class.' );

		// Open inspector.
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		await selectFirstBlock( editor, 'Paragraph' );
		await openAdvancedInspectorSection( page );

		// Type the class name in the autocomplete control.
		const classInput = page.getByRole( 'combobox', {
			name: /additional css class/i,
		} );
		await classInput.fill( 'e2e-test' );

		// Select the suggestion.
		await page.getByRole( 'option', { name: /e2e-test-class/i } ).click();

		// Save the post.
		await editor.publishPost();

		// Reload and confirm the class is still applied.
		await page.reload();
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		await selectFirstBlock( editor, 'Paragraph' );
		await openAdvancedInspectorSection( page );

		// The class should still be visible in the control.
		await expect( page.getByText( 'e2e-test-class' ) ).toBeVisible();
	} );
} );
