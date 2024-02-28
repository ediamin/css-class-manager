import { useDispatch } from '@wordpress/data';
import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import Icon from '../icon';

const MenuItem = () => {
	const { openModal } = useDispatch( INTERFACE_STORE );
	const handleOnClick = () => openModal( MANAGER_MODAL_NAME );

	return (
		<PluginMoreMenuItem icon={ Icon } onClick={ handleOnClick }>
			{ __( 'CSS Class Manager', 'css-class-manager' ) }
		</PluginMoreMenuItem>
	);
};

export default MenuItem;
