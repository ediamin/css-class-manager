<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

/**
 * Integration tests for the plugin Bootstrap class.
 *
 * Verifies that plugin initialisation hooks fire correctly and that the
 * global helper returns a valid Plugin instance.
 */
class BootstrapTest extends WPTestCase
{
	/**
	 * The plugin should be active in the test environment.
	 */
	public function test_plugin_is_active(): void
	{
		$active_plugins = (array) get_option( 'active_plugins', [] );
		$this->assertContains( 'css-class-manager/css-class-manager.php', $active_plugins );
	}

	/**
	 * The global css_class_manager() helper must return the Plugin instance.
	 */
	public function test_global_helper_returns_plugin_instance(): void
	{
		$plugin = css_class_manager();
		$this->assertInstanceOf( \CSSClassManager\Plugin::class, $plugin );
	}

	/**
	 * The css_class_manager_init action must have been fired during boot.
	 */
	public function test_init_action_was_fired(): void
	{
		// The action fires during plugin load. By the time the test runs,
		// did_action() should report at least one invocation.
		$this->assertGreaterThanOrEqual( 1, did_action( 'css_class_manager_init' ) );
	}

	/**
	 * The css_class_manager_before_init action must have been fired before init.
	 */
	public function test_before_init_action_was_fired(): void
	{
		$this->assertGreaterThanOrEqual( 1, did_action( 'css_class_manager_before_init' ) );
	}
}
