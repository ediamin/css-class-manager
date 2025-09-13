<?php

declare(strict_types = 1);

namespace CSSClassManager\Tests;

use CSSClassManager\Plugin;
use Yoast\PHPUnitPolyfills\TestCases\TestCase;

class PluginTest extends TestCase
{
	public function test_id_constant(): void
	{
		$this->assertEquals( 'css-class-manager', Plugin::ID );
	}
}
