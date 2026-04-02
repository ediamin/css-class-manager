<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use WP_UnitTestCase;

/**
 * Base test case for WordPress integration tests.
 *
 * Extends WP_UnitTestCase to gain access to factory helpers and automatic
 * database rollback between tests, while keeping the namespace consistent
 * with the rest of the test suite.
 */
class WPTestCase extends WP_UnitTestCase
{
}
