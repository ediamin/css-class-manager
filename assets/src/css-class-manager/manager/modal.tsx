import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';

import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';

interface Selectors {
	isModalActive: ( state: any, modalName: string ) => boolean;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

const CSSClassManagerModal = () => {
	const isModalActive: boolean = useSelect< MapSelect >( ( select ) => {
		return select< SelectFunctionParam >(
			INTERFACE_STORE as any
		).isModalActive( MANAGER_MODAL_NAME );
	}, [] );

	const { openModal, closeModal } = useDispatch( INTERFACE_STORE );

	const toggleModal = () => {
		return isModalActive ? closeModal() : openModal( MANAGER_MODAL_NAME );
	};

	if ( ! isModalActive ) {
		return null;
	}

	return (
		<Modal
			title={ __( 'CSS Class Manager', 'css-class-manager' ) }
			closeButtonLabel={ __( 'Close', 'css-class-manager' ) }
			onRequestClose={ toggleModal }
		>
			<div>Hello world</div>
		</Modal>
	);
};

export default CSSClassManagerModal;
