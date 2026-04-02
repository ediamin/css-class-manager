import { expect, test } from '@playwright/test';
import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';

import { createNewPost, openCssClassManagerModal } from '../utils/helpers';

/**
 * E2E tests for the body classes feature.
 *
 * Verifies that custom classes stored in the body class meta are applied to
 * the <body> element on the front end when the feature is enabled, and that
 * they are absent when the feature is toggled off.
 */

const BODY_CLASS = 'e2e-body-class';

test.describe( 'Body classes', () => {
	let admin: Admin;
	let editor: Editor;
	let postUrl: string;

	test.beforeEach( async ( { page } ) => {
		admin = new Admin( { page, pageUtils: null as never } );
		editor = new Editor( { page } );
	} );

	test( 'body class is applied to the <body> element on the front end', async ( {
		page,
	} ) => {
		await createNewPost( admin );

		// Open the inspector and navigate to the Body Classes panel.
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		// Find the body class input in the inspector (expected in "Post" tab).
		await page.getByRole( 'tab', { name: /post/i } ).click();

		const bodyClassInput = page.getByRole( 'textbox', {
			name: /body class/i,
		} );

		if ( await bodyClassInput.isVisible() ) {
			await bodyClassInput.fill( BODY_CLASS );
		} else {
			// If the input is inside the preferences, open the modal.
			await openCssClassManagerModal( page );
			const input = page.getByRole( 'textbox', {
				name: /body class/i,
			} );
			await input.fill( BODY_CLASS );
		}

		// Publish the post.
		postUrl = await editor.publishPost();

		// Visit the front-end URL.
		await page.goto( postUrl );

		// The class must appear on the <body> element.
		const bodyClasses = await page.evaluate(
			() => document.body.className
		);
		expect( bodyClasses ).toContain( BODY_CLASS );
	} );

	test( 'body class is absent when not configured', async ( { page } ) => {
		await createNewPost( admin );

		// Create and publish a post without configuring body classes.
		await editor.canvas
			.getByRole( 'button', { name: /add default block/i } )
			.click();
		await page.keyboard.type( 'Post without body class.' );

		postUrl = await editor.publishPost();
		await page.goto( postUrl );

		const bodyClasses = await page.evaluate(
			() => document.body.className
		);
		expect( bodyClasses ).not.toContain( BODY_CLASS );
	} );
} );
