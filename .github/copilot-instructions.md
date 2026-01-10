# GitHub Copilot Instructions for CSS Class Manager

## Project Overview

CSS Class Manager is a modern WordPress plugin that enhances the block editor's CSS class management capabilities. It provides an advanced autocomplete control to replace the default "Additional CSS Class(es)" input, along with comprehensive class management tools.

**Key Features:**
- Advanced autocomplete CSS class control with fuzzy search
- CSS class manager with add/edit/delete functionality
- Body and post classes support
- Theme.json integration for class suggestions
- Import/export functionality
- User preferences and settings

## Architecture & Technology Stack

### Backend (PHP)
- **Namespace**: `CSSClassManager\`
- **PHP Version**: 7.4+ with strict typing (`declare(strict_types = 1)`)
- **WordPress Version**: 6.6+
- **Architecture**: Object-oriented with PSR-4 autoloading
- **Code Quality**: PHPStan level 9, WordPress VIP coding standards

### Frontend (TypeScript/React)
- **Framework**: React with WordPress Gutenberg components
- **Language**: TypeScript with strict configuration
- **Build Tool**: WordPress Scripts (Webpack-based)
- **State Management**: WordPress Data stores (@wordpress/data)
- **UI Library**: WordPress Components (@wordpress/components)

## Coding Standards & Conventions

### PHP Standards
1. **Strict Typing**: Always use `declare(strict_types = 1)` at the top of PHP files
2. **Namespace**: All classes use `CSSClassManager\` namespace
3. **Class Naming**: PascalCase for classes, camelCase for methods
4. **Constants**: Use class constants with SCREAMING_SNAKE_CASE
5. **Type Hints**: Always provide parameter and return type hints
6. **Documentation**: Follow WordPress PHPDoc standards with typed annotations
7. **Hooks**: Use class-based hook registration through `Hooks` class
8. **Security**: Sanitize all user inputs, use WordPress functions for data handling

### TypeScript Standards
1. **Strict Mode**: Enable all strict TypeScript compiler options
2. **Types**: Create explicit interfaces for all data structures
3. **React Components**: Use functional components with TypeScript props interfaces
4. **WordPress Integration**: Leverage @wordpress/* packages for core functionality
5. **Global Types**: Declare global objects (like `cssClassManager`) in types.ts
6. **State Management**: Use WordPress Data store pattern for state management

### File Organization

#### PHP Structure
```
includes/
├── Bootstrap.php          # Plugin initialization
├── Plugin.php            # Main plugin class with constants
├── Hooks.php             # Filter and action registration
├── Enqueue.php           # Asset registration and localization
├── Settings.php          # REST API settings registration
├── UserSettings.php      # User-specific settings
├── BodyClasses.php       # Body/post classes functionality
├── ThemeClasses.php      # Theme.json integration
├── L10N.php              # Internationalization
└── functions.php         # Global utility functions
```

#### TypeScript Structure
```
assets/src/css-class-manager/
├── index.ts              # Main entry point
├── types.ts              # TypeScript interfaces
├── constants.ts          # Application constants
├── icon.tsx              # Plugin icon component
├── styles.scss           # Plugin styles
├── store/                # WordPress Data store
├── inspector-control/    # Block inspector control
├── select-control/       # Autocomplete select component
├── preferences-modal/    # Settings modal
├── body-classes/         # Body classes functionality
├── menu-item/           # Editor menu integration
├── notices/             # Notification system
├── hooks/               # Custom React hooks
└── utils/               # Utility functions
```

## Development Patterns

### PHP Development Patterns

1. **Plugin Initialization**:
```php
// Main plugin file pattern
declare(strict_types = 1);
use CSSClassManager\Bootstrap;
defined( 'ABSPATH' ) || exit;
class_exists( 'CSSClassManager\Bootstrap' ) || require_once __DIR__ . '/vendor/autoload.php';
new Bootstrap();
```

2. **Class Structure**:
```php
declare(strict_types = 1);
namespace CSSClassManager;

class ExampleClass
{
    public const CONSTANT_NAME = 'value';

    public function __construct()
    {
        // Constructor logic
    }

    public static function static_method(): void
    {
        // Static method logic
    }

    private function private_method(): string
    {
        return 'example';
    }
}
```

3. **Settings Registration**:
```php
// Use register_setting with detailed schema
register_setting(
    'options',
    self::OPTION_NAME,
    [
        'type'              => 'object',
        'description'       => __( 'Description', 'css-class-manager' ),
        'default'           => [],
        'sanitize_callback' => [ self::class, 'sanitize_callback' ],
        'show_in_rest'      => [
            'schema' => [
                // Detailed REST API schema
            ],
        ],
    ]
);
```

### TypeScript Development Patterns

1. **Component Structure**:
```tsx
import type { FC } from 'react';

interface ComponentProps {
    prop1: string;
    prop2?: boolean;
}

const Component: FC<ComponentProps> = ({ prop1, prop2 = false }) => {
    return <div>{prop1}</div>;
};

export default Component;
```

2. **Data Store Pattern**:
```typescript
import { createReduxStore } from '@wordpress/data';

interface State {
    property: string;
}

interface Actions {
    actionName: (param: string) => void;
}

interface Selectors {
    getProperty: (state: State) => string;
}

const store = createReduxStore<State, Actions, Selectors>(STORE_NAME, {
    // Store configuration
});
```

3. **WordPress Integration**:
```typescript
// Use WordPress hooks and components
import { useSelect, useDispatch } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
```

## WordPress-Specific Guidelines

### Block Editor Integration
1. **Higher-Order Components**: Use `createHigherOrderComponent` for block modifications
2. **Block Supports**: Check block supports before adding controls
3. **Inspector Controls**: Place controls in appropriate inspector sections
4. **Filters**: Use `addFilter` for extending block editor functionality

### Data Management
1. **REST API**: Use WordPress REST API endpoints for data persistence
2. **Options API**: Store plugin settings using WordPress options
3. **User Meta**: Store user-specific settings in user meta
4. **Localization**: Use `wp_localize_script` for passing PHP data to JavaScript

### Security & Sanitization
1. **Input Sanitization**: Always sanitize user inputs using WordPress functions
2. **Nonce Verification**: Use nonces for form submissions
3. **Capability Checks**: Verify user capabilities before actions
4. **Escaping**: Escape all output using WordPress escaping functions

## Testing & Quality Assurance

### PHP Testing
- **PHPStan**: Level 9 static analysis with WordPress extension
- **Code Standards**: WordPress VIP coding standards via PHPCS
- **PHP Compatibility**: Test against PHP 7.4+ using PHPCompatibility

### JavaScript Testing
- **TypeScript**: Strict type checking enabled
- **Linting**: ESLint with WordPress standards
- **Style Linting**: Stylelint for SCSS files

## Build & Development

### Commands
```bash
# Development
npm run dev              # Start development build
npm run build           # Production build
npm run lint            # Run all linting
npm run php:analyze     # PHPStan analysis

# Environment
npm run env:start       # Start wp-env
npm run env:stop        # Stop wp-env

# Utilities
npm run make-pot        # Generate translation files
npm run zip             # Create distribution zip
```

### Asset Structure
- **Entry Point**: `assets/src/css-class-manager/index.ts`
- **Output**: `assets/dist/css-class-manager/`
- **Styles**: SCSS compiled to CSS
- **Dependencies**: Managed via WordPress Scripts

## Internationalization

### PHP
```php
// Text domain: 'css-class-manager'
__( 'Text to translate', 'css-class-manager' )
_n( 'Singular', 'Plural', $count, 'css-class-manager' )
```

### JavaScript
```typescript
import { __ } from '@wordpress/i18n';
__( 'Text to translate', 'css-class-manager' )
```

## Performance Considerations

1. **Lazy Loading**: Load assets only when needed
2. **Conditional Loading**: Check for block editor context
3. **Efficient Queries**: Minimize database queries
4. **Caching**: Use WordPress caching mechanisms where appropriate
5. **Asset Optimization**: Minimize and compress assets for production

## Common Pitfalls to Avoid

1. **Missing Type Declarations**: Always provide TypeScript types
2. **Unsafe PHP**: Avoid using unsafe functions, use WordPress equivalents
3. **Global Scope Pollution**: Use proper namespacing
4. **Missing Sanitization**: Always sanitize user inputs
5. **Hardcoded Text**: Use translation functions for all user-facing text
6. **Missing Capability Checks**: Verify user permissions for sensitive operations

## Integration Points

### Filters & Actions
- `css_class_manager_filtered_class_names`: Add custom class names
- `css_class_manager_localized_data`: Modify localized JavaScript data
- `css_class_manager_body_class_unsupported_post_types`: Modify unsupported post types for body classes.
- `css_class_manager_theme_classes_css`: The CSS from which class names are extracted.
- `css_class_manager_before_init`: Hook before plugin initialization
- `css_class_manager_init`: Hook after plugin initialization

### REST API Endpoints
- `/wp/v2/settings`: Plugin settings management
- `/wp/v2/users/me`: User-specific preferences

When contributing to this project, follow these patterns and conventions to maintain code quality and consistency across the codebase.
