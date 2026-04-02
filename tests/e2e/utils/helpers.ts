import { expect, type Page } from '@playwright/test';
import { Admin, Editor } from '@wordpress/e2e-test-utils-playwright';

/**
 * Navigate to a new post in the block editor.
 */
export async function createNewPost(
	admin: Admin,
	postType: string = 'post'
): Promise< void > {
	await admin.visitAdminPage( 'post-new.php', `post_type=${ postType }` );
}

/**
 * Open the CSS Class Manager preferences modal via the editor "Tools" menu.
 */
export async function openCssClassManagerModal( page: Page ): Promise< void > {
	// Click the three-dot "Options" menu in the editor toolbar.
	await page
		.getByRole( 'region', { name: 'Editor top bar' } )
		.getByRole( 'button', { name: /options/i } )
		.click();

	// Click the "CSS Class Manager" menu item.
	await page.getByRole( 'menuitem', { name: /css class manager/i } ).click();

	// Wait for the modal to become visible.
	await expect(
		page.getByRole( 'dialog', { name: /css class manager/i } )
	).toBeVisible();
}

/**
 * Select a block in the editor by its block name and return the block element.
 */
export async function selectFirstBlock(
	editor: Editor,
	blockName: string
): Promise< void > {
	await editor.canvas
		.getByRole( 'document', { name: new RegExp( blockName, 'i' ) } )
		.first()
		.click();
}

/**
 * Open the "Advanced" section of the block inspector panel.
 */
export async function openAdvancedInspectorSection(
	page: Page
): Promise< void > {
	const advanced = page.getByRole( 'button', { name: /advanced/i } );

	if ( await advanced.isVisible() ) {
		const expanded = await advanced.getAttribute( 'aria-expanded' );

		if ( expanded !== 'true' ) {
			await advanced.click();
		}
	}
}
