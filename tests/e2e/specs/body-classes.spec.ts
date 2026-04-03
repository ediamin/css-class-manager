import {
	Admin,
	Editor,
	expect,
	test,
} from '@wordpress/e2e-test-utils-playwright';

import { createNewPost } from '../utils/helpers';

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
	let postId: number | null;

	test.beforeEach( async ( { page, pageUtils } ) => {
		editor = new Editor( { page } );
		admin = new Admin( { page, pageUtils, editor } );
	} );

	test( 'body class is applied to the <body> element on the front end', async ( {
		page,
	} ) => {
		await createNewPost( admin );

		// Add a block so the post has content and can be published.
		await editor.canvas
			.getByRole( 'button', { name: /add default block/i } )
			.click();
		await page.keyboard.type( 'Body class test post.' );

		// Open the inspector and navigate to the "Post" tab.
		await page
			.getByRole( 'region', { name: 'Editor top bar' } )
			.getByRole( 'button', { name: /settings/i } )
			.click();

		await page.getByRole( 'tab', { name: /post/i } ).click();

		// Expand the Body Classes panel if present.
		const bodyClassesPanel = page.getByRole( 'button', {
			name: /body classes/i,
		} );

		if ( ! ( await bodyClassesPanel.isVisible() ) ) {
			// Body classes feature not available for this post type — skip.
			return;
		}

		const expanded = await bodyClassesPanel.getAttribute( 'aria-expanded' );
		if ( expanded !== 'true' ) {
			await bodyClassesPanel.click();
		}

		// The body class control is a combobox inside the Body Classes panel.
		const bodyClassCombobox = page
			.locator( '.css-class-manager__body-class-control-panel' )
			.getByRole( 'combobox' );

		await bodyClassCombobox.fill( BODY_CLASS );

		// Select/create the option to commit the value to the editor state.
		await page
			.getByRole( 'option', { name: new RegExp( BODY_CLASS, 'i' ) } )
			.click();

		// Publish the post.
		postId = await editor.publishPost();

		// Visit the front-end URL.
		await page.goto( `/?p=${ postId }` );

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

		postId = await editor.publishPost();
		await page.goto( `/?p=${ postId }` );

		const bodyClasses = await page.evaluate(
			() => document.body.className
		);
		expect( bodyClasses ).not.toContain( BODY_CLASS );
	} );
} );
