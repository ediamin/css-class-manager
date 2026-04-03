import path from 'path';

import { test as setup } from '@playwright/test';

/**
 * Authentication setup.
 *
 * Logs in as the WordPress admin user and saves the browser storage state to
 * a JSON file. All spec projects reference this file via `storageState` so
 * that individual tests never need to re-authenticate.
 */

const AUTH_STATE_FILE = path.join( __dirname, '../.auth/admin.json' );

setup( 'authenticate as admin', async ( { page, context } ) => {
	// Navigate directly — redirects to wp-login.php when not authenticated.
	await page.goto( '/wp-admin/' );

	// If already on wp-admin, a cached session is still valid.
	if ( ! page.url().includes( 'wp-login.php' ) ) {
		await context.storageState( { path: AUTH_STATE_FILE } );
		return;
	}

	// Fill in the login form.
	await page.fill( '#user_login', 'admin' );
	await page.fill( '#user_pass', 'password' );
	await page.click( '#wp-submit' );

	await page.waitForURL( '**/wp-admin/**' );

	// Persist the authenticated session.
	await context.storageState( { path: AUTH_STATE_FILE } );
} );
