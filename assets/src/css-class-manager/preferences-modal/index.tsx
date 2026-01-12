import { Modal } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
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
} from '@wordpress/data';

interface Selectors {
	isModalActive: ( state: any, modalName: string ) => boolean;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

const HAS_CLICKED_RATING = 'css_class_manager_has_clicked_rating';

const PreferencesModal = () => {
	const [ hasRated, setHasRated ] = useState< boolean >( false );

	const isModalActive: boolean = useSelect< MapSelect >( ( select ) => {
		return select< SelectFunctionParam >(
			INTERFACE_STORE as any
		).isModalActive( MANAGER_MODAL_NAME );
	}, [] );

	const { openModal, closeModal } = useDispatch( INTERFACE_STORE );

	useEffect( () => {
		const rated = localStorage.getItem( HAS_CLICKED_RATING );
		setHasRated( rated === 'true' );
	}, [] );

	const handleRatingClick = () => {
		localStorage.setItem( HAS_CLICKED_RATING, 'true' );
		setHasRated( true );
	};

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
			{ ! hasRated && (
				<p className="css-class-manager__preferences-modal__rate-plugin">
					<a
						href="https://wordpress.org/support/plugin/css-class-manager/reviews/?rate=5#new-post"
						target="_blank"
						rel="noreferrer"
						onClick={ handleRatingClick }
						className="css-class-manager__rating-link"
					>
						{ __( 'Rate the plugin', 'css-class-manager' ) } ★★★★★
					</a>
				</p>
			) }
		</Modal>
	);
};

export default PreferencesModal;
