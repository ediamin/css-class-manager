import { useEntityProp } from '@wordpress/core-data';
import { useDispatch, useSelect } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __, sprintf } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import { useStore } from '../hooks';
import SelectControl from '../inspector-control/select-control';

import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';
import type { MouseEvent } from 'react';

interface Selectors {
	getCurrentPostType: ( state: Object ) => string;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

const BodyClassControlPanel = () => {
	const postType: string = useSelect< MapSelect >(
		( select ) =>
			select< SelectFunctionParam >(
				'core/editor' as any
			).getCurrentPostType(),
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	const metaValue = meta?.css_class_manager_body_classes || '';

	const { openModal } = useDispatch( INTERFACE_STORE );
	const {
		userDefinedClassNames,
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useStore();

	const openManager = ( event: MouseEvent< HTMLAnchorElement > ) => {
		event.preventDefault();
		openModal( MANAGER_MODAL_NAME );
	};

	const onChangeHandler = ( newValue: string | undefined ) => {
		setMeta( {
			...meta,
			css_class_manager_body_classes: newValue,
		} );
	};

	const onCreateNewHandler = async ( newClassName: string ) => {
		if ( ! newClassName.trim() ) {
			createErrorNotice(
				__( 'Class Name cannot be empty', 'css-class-manager' )
			);

			return;
		}

		startSavingSettings();
		await saveUserDefinedClassNames(
			{ name: newClassName.replaceAll( ' ', '-' ), description: '' },
			userDefinedClassNames
		);
		await completedSavingSettings();
	};

	return (
		<PluginDocumentSettingPanel
			name="css-class-manager-body-class-control-panel"
			title={ __( 'Body Classes', 'css-class-manager' ) }
			className="css-class-manager__body-class-control-panel"
		>
			<SelectControl
				className={ metaValue }
				isSaving={ false }
				onChange={ onChangeHandler }
				onCreateNew={ onCreateNewHandler }
			/>

			<p className="css-class-manager__inspector-control__help-text">
				{ sprintf(
					/* translators: %s: post type name */
					__(
						'CSS <body> class names for the current %s. Select one or more class names from the dropdown by clicking on the options.',
						'css-class-manager'
					),
					postType
				) }
			</p>
			<p className="css-class-manager__inspector-control__help-text">
				<a href="#open-css-class-manager" onClick={ openManager }>
					{ __( 'Open Class Manager', 'css-class-manager' ) }
				</a>
			</p>
		</PluginDocumentSettingPanel>
	);
};

export default BodyClassControlPanel;
