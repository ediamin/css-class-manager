import { register } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

import InspectorControl from './inspector-control';
import MenuItem from './menu-item';
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

// The preference or settings modal.
registerPlugin( 'css-class-manager-preference-modal', {
	render: PreferencesModal,
} );

// The menu item in options menu.
registerPlugin( 'css-class-manager-menu-item', {
	render: MenuItem,
} );
