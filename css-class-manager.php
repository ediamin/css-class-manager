<?php
/**
 * Plugin Name: CSS Class Manager
 * Plugin URI: https://github.com/ediamin/css-class-manager
 * Description: CSS Class Manager for WordPress Blocks.
 * Version: 1.0.0
 * Author: Edi Amin
 * Author URI: https://github.com/ediamin
 * Text Domain: css-class-manager
 * Domain Path: /languages/
 *
 * @package ediamin/css-class-manager
 */

declare(strict_types = 1);

use CSSClassManager\Bootstrap;

// Do not call the file directly.
defined( 'ABSPATH' ) || exit;

class_exists( 'CSSClassManager\Bootstrap' ) || require_once __DIR__ . '/vendor/autoload.php';

define( 'CSS_CLASS_MANAGER_FILE', __FILE__ );
define( 'CSS_CLASS_MANAGER_ABSPATH', dirname( CSS_CLASS_MANAGER_FILE ) );
define( 'CSS_CLASS_MANAGER_URL', plugins_url( '', CSS_CLASS_MANAGER_FILE ) );

// Initialize the plugin.
new Bootstrap();
