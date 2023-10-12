import { registerPlugin } from '@wordpress/plugins';

import CSSClassManagerModal from './modal';

registerPlugin( 'css-class-manager-preference-modal', {
	render: CSSClassManagerModal,
} );
