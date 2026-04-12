import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration.
 *
 * - baseURL points to the wp-env test environment (port 8889).
 * - The "setup" project logs in as admin and saves authentication state so that
 *   spec files do not have to re-authenticate on every test.
 * - Tests run in Chromium by default; Firefox and WebKit are available as
 *   optional projects by uncommenting the relevant entries below.
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig( {
	testDir: './tests/e2e/specs',

	/* These specs share a single wp-env site and mutate global WordPress state. */
	fullyParallel: false,

	/* Avoid cross-test races against shared options, posts, and user meta. */
	workers: 1,

	/* Fail the build on CI if you accidentally left test.only in the source */
	forbidOnly: !! process.env.CI,

	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,

	/* Reporter */
	reporter: [
		[ 'html', { outputFolder: 'playwright-report', open: 'never' } ],
		[ 'junit', { outputFile: 'e2e-results.xml' } ],
		[ 'list' ],
	],

	/* Increase the default assertion timeout for WordPress block editor interactions */
	expect: {
		timeout: 15000,
	},

	use: {
		/* Base URL — the wp-env tests environment */
		baseURL: 'http://localhost:8889',

		/* Collect traces on first retry for debugging */
		trace: 'on-first-retry',

		/* Record video on first retry */
		video: 'on-first-retry',
	},

	projects: [
		/* ------------------------------------------------------------------
		 * Authentication setup project — must run before any spec projects.
		 * ------------------------------------------------------------------ */
		{
			name: 'setup',
			testDir: './tests/e2e/fixtures',
			testMatch: /auth\.setup\.ts/,
		},

		/* ------------------------------------------------------------------
		 * Chromium — primary browser
		 * ------------------------------------------------------------------ */
		{
			name: 'chromium',
			use: {
				...devices[ 'Desktop Chrome' ],
				/* Reuse the authenticated admin session */
				storageState: 'tests/e2e/.auth/admin.json',
			},
			dependencies: [ 'setup' ],
		},

		/* ------------------------------------------------------------------
		 * Firefox — uncomment to enable cross-browser coverage
		 * ------------------------------------------------------------------ */
		// {
		//     name: 'firefox',
		//     use: {
		//         ...devices['Desktop Firefox'],
		//         storageState: 'tests/e2e/.auth/admin.json',
		//     },
		//     dependencies: ['setup'],
		// },

		/* ------------------------------------------------------------------
		 * WebKit / Safari — uncomment to enable cross-browser coverage
		 * ------------------------------------------------------------------ */
		// {
		//     name: 'webkit',
		//     use: {
		//         ...devices['Desktop Safari'],
		//         storageState: 'tests/e2e/.auth/admin.json',
		//     },
		//     dependencies: ['setup'],
		// },
	],
} );
