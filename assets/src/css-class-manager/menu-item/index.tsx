import { useDispatch } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';

const MenuItem = () => {
	const { openModal } = useDispatch( INTERFACE_STORE );
	const handleOnClick = () => openModal( MANAGER_MODAL_NAME );

	return (
		<PluginMoreMenuItem icon={ settings } onClick={ handleOnClick }>
			{ __( 'CSS Class Manager', 'css-class-manager' ) }
		</PluginMoreMenuItem>
	);
};

export default MenuItem;
