import { type Page, expect } from '@playwright/test';
import {
	Admin,
	Editor,
	type RequestUtils,
} from '@wordpress/e2e-test-utils-playwright';

/**
 * Navigate to a new post in the block editor.
 * @param admin
 * @param postType
 */
export async function createNewPost(
	admin: Admin,
	postType: string = 'post'
): Promise< void > {
	await admin.createNewPost( { postType } );
}

/**
 * Open the CSS Class Manager preferences modal via the editor "Tools" menu.
 * @param page
 */
export async function openCssClassManagerModal( page: Page ): Promise< void > {
	// Click the three-dot "Options" menu in the editor toolbar.
	await page
		.getByRole( 'region', { name: 'Editor top bar' } )
		.getByRole( 'button', { name: /options/i } )
		.click();

	// Click the "CSS Class Manager" menu item (exact match avoids the admin-bar link).
	await page
		.getByRole( 'menuitem', { name: 'CSS Class Manager', exact: true } )
		.click();

	// Wait for the modal to become visible.
	await expect(
		page.getByRole( 'dialog', { name: /css class manager/i } )
	).toBeVisible();
}

/**
 * Select a block in the editor by its block name and return the block element.
 * @param editor
 * @param blockName
 */
export async function selectFirstBlock(
	editor: Editor,
	blockName: string
): Promise< void > {
	const blockSlug = blockName.toLowerCase().replaceAll( /\s+/g, '-' );
	const block = editor.canvas
		.locator( `[data-type="core/${ blockSlug }"]` )
		.first();

	if ( ( await block.count() ) > 0 ) {
		await editor.selectBlocks( block );
		return;
	}

	await editor.selectBlocks(
		editor.canvas
			.getByRole( 'document', { name: new RegExp( blockName, 'i' ) } )
			.first()
	);
}

/**
 * Reset plugin-specific user settings so e2e runs do not depend on previous
 * manual editor preferences.
 * @param requestUtils
 */
export async function resetCssClassManagerUserSettings(
	requestUtils: RequestUtils
): Promise< void > {
	await requestUtils.resetPreferences();

	await requestUtils.rest( {
		path: '/wp/v2/users/me',
		method: 'PUT',
		data: {
			meta: {
				css_class_manager_user_settings: {
					allowAddingClassNamesWithoutCreating: false,
					hideThemeJSONGeneratedClasses: false,
					inspectorControlPosition: 'default',
				},
			},
		},
	} );
}

/**
 * Open the "Advanced" section of the block inspector panel.
 *
 * Waits for the Block tab to be selected and the Advanced panel button to
 * become visible before attempting to expand it. This avoids race conditions
 * where the inspector is still switching from the Post tab to the Block tab
 * when this helper is called.
 * @param page
 */
export async function openAdvancedInspectorSection(
	page: Page
): Promise< void > {
	const settingsToggle = page
		.getByRole( 'region', { name: 'Editor top bar' } )
		.getByRole( 'button', { name: 'Settings', exact: true } );
	const settingsExpanded =
		await settingsToggle.getAttribute( 'aria-expanded' );

	if ( settingsExpanded === 'false' ) {
		await settingsToggle.click();
	}

	// Ensure the Block tab is active so block-level settings are visible.
	const blockTab = page.getByRole( 'tab', { name: /^block$/i } );
	await expect( blockTab ).toBeVisible( { timeout: 10000 } );

	const isSelected = await blockTab.getAttribute( 'aria-selected' );
	if ( isSelected !== 'true' ) {
		await blockTab.click( { force: true } );
		await expect( blockTab ).toHaveAttribute( 'aria-selected', 'true' );
	}

	const classControl = page.getByRole( 'combobox', {
		name: /additional css class/i,
	} );

	if ( await classControl.isVisible() ) {
		return;
	}

	const ownPanel = page.getByRole( 'button', {
		name: /additional css class\(es\)/i,
	} );
	if ( await ownPanel.isVisible() ) {
		const expanded = await ownPanel.getAttribute( 'aria-expanded' );
		if ( expanded !== 'true' ) {
			await ownPanel.click();
		}

		return;
	}

	// Wait for the Advanced section button to appear (it only exists on the Block tab).
	const advanced = page.getByRole( 'button', { name: /^advanced$/i } );
	await advanced.waitFor( { state: 'visible', timeout: 10000 } );

	const expanded = await advanced.getAttribute( 'aria-expanded' );
	if ( expanded !== 'true' ) {
		await advanced.click();
	}
}
