import path from 'path';

import { test as setup } from '@playwright/test';
import { RequestUtils } from '@wordpress/e2e-test-utils-playwright';

/**
 * Authentication setup.
 *
 * Logs in via RequestUtils (HTTP-based) which also:
 * - Obtains the REST API nonce
 * - Saves cookies + nonce + rootURL to the auth state file
 * - Activates the css-class-manager plugin so all spec tests can rely on it
 */

const AUTH_STATE_FILE = path.join( __dirname, '../.auth/admin.json' );

setup( 'authenticate as admin', async () => {
	const requestUtils = await RequestUtils.setup( {
		user: { username: 'admin', password: 'password' },
		storageStatePath: AUTH_STATE_FILE,
		baseURL: 'http://localhost:8889',
	} );

	// Login and get the REST API nonce; persists cookies + nonce + rootURL.
	await requestUtils.setupRest();

	// Guarantee the plugin is active for all specs.
	await requestUtils.activatePlugin( 'css-class-manager' );

	// Ensure a proper theme is active so the front end renders with body classes.
	await requestUtils.activateTheme( 'twentytwentyfive' );
} );
