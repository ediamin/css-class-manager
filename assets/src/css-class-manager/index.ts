import { register } from '@wordpress/data';
import { addFilter, removeFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';
import { registerPlugin } from '@wordpress/plugins';

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

// Remove the default CSS Class name inspector control.
removeFilter(
	'editor.BlockEdit',
	'core/editor/custom-class-name/with-inspector-controls'
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
