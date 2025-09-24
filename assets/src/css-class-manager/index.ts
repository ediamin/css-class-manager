import { register } from '@wordpress/data';
import { addFilter, createHooks } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';
import { registerFormatType } from '@wordpress/rich-text';

import { AttributeObserver, SettingsPanel } from './body-classes';
import HideCoreInspectorControl from './hide-core-inspector-control';
import { settings as inlineElementClassSettings } from './inline-element-classes';
import InspectorControl from './inspector-control';
import MenuItem from './menu-item';
import Notices from './notices';
import PreferencesModal from './preferences-modal';
import store from './store';

import './styles.scss';

// Create action and filter constructor hooks.
cssClassManager.hooks = createHooks();

// Register data store.
register( store );

// The body class settings panel.
registerPlugin( 'css-class-manager-body-class-settings-panel', {
	render: SettingsPanel,
} );

// The body class attribute observer.
registerPlugin( 'css-class-manager-body-class-attribute-observer', {
	render: AttributeObserver,
} );

// The inspector control for the blocks.
addFilter(
	'editor.BlockEdit',
	'css-class-manager/block-editor/inspector-control',
	InspectorControl
);

// Hide the core additional CSS classes inspector control.
addFilter(
	'editor.BlockEdit',
	'css-class-manager/block-editor/hide-core-inspector-control',
	HideCoreInspectorControl
);

// Inline element class control for rich text.
registerFormatType(
	inlineElementClassSettings.name,
	inlineElementClassSettings
);

// The preference or settings modal.
registerPlugin( 'css-class-manager-preference-modal', {
	render: PreferencesModal,
} );

// The menu item in options menu.
registerPlugin( 'css-class-manager-menu-item', {
	render: MenuItem,
} );

// The snackbar notice list.
registerPlugin( 'css-class-manager-notices', {
	render: Notices,
} );
