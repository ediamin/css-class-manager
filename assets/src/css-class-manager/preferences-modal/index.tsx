import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';

import PreferencesModalTabs from './preferences-modal-tabs';
import tabCssClass from './tabs/css-classes';
import tabImportExport from './tabs/import-export';
import tabPreferences from './tabs/preferences';

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

const PreferencesModal = () => {
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

	const sections = [ tabCssClass, tabPreferences, tabImportExport ];

	return (
		<Modal
			// This class has been used by PreferencesModal component in @wordpress/interface.
			className="preferences-modal css-class-manager__preferences-modal"
			title={ __( 'CSS Class Manager', 'css-class-manager' ) }
			onRequestClose={ toggleModal }
		>
			<PreferencesModalTabs sections={ sections } />
		</Modal>
	);
};

export default PreferencesModal;
