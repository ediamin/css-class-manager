import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';

import PreferencesModalSection from './preferences-modal-section';
import PreferencesModalTabs from './preferences-modal-tabs';

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

	const sections = [
		{
			name: 'css-classes',
			tabLabel: __( 'CSS Classes', 'css-class-manager' ),
			content: (
				<PreferencesModalSection
					title={ __( 'Class List', 'css-class-manager' ) }
					description={ __(
						'These classes will appear in the Additional CSS Class(es) control dropdown.',
						'css-class-manager'
					) }
				>
					<div>Class list...</div>
				</PreferencesModalSection>
			),
		},
		{
			name: 'import-export',
			tabLabel: __( 'Import/Export', 'css-class-manager' ),
			content: (
				<>
					<PreferencesModalSection
						title={ __( 'Import Class List', 'css-class-manager' ) }
						description=""
					>
						<div>Import...</div>
					</PreferencesModalSection>
					<PreferencesModalSection
						title={ __( 'Export Class List', 'css-class-manager' ) }
						description=""
					>
						<div>Export...</div>
					</PreferencesModalSection>
				</>
			),
		},
	];

	return (
		<Modal
			// This class has been used by PreferencesModal component in @wordpress/interface.
			className="interface-preferences-modal"
			title={ __( 'CSS Class Manager', 'css-class-manager' ) }
			onRequestClose={ toggleModal }
		>
			<PreferencesModalTabs sections={ sections } />
		</Modal>
	);
};

export default PreferencesModal;
