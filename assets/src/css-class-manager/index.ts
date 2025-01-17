import { register } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { registerPlugin } from '@wordpress/plugins';

import HideCoreInspectorControl from './hide-core-inspector-control';
import InspectorControl from './inspector-control';
import MenuItem from './menu-item';
import Notices from './notices';
import PreferencesModal from './preferences-modal';
import store from './store';

import './styles.scss';

// Register data store.
register( store );

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
