import { registerPlugin } from '@wordpress/plugins';

import MoreMenuItem from './more-menu-item';

registerPlugin( 'css-class-manager-preference-menu-item', {
	render: MoreMenuItem,
} );
