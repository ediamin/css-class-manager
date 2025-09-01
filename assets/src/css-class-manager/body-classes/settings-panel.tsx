import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { PluginDocumentSettingPanel } from '@wordpress/editor';
import { __, sprintf } from '@wordpress/i18n';

import SelectControl from '../select-control';

import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';

interface Selectors {
	getCurrentPostType: ( state: Object ) => string;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

const SettingsPanel = () => {
	const postType: string = useSelect< MapSelect >(
		( select ) =>
			select< SelectFunctionParam >(
				'core/editor' as any
			).getCurrentPostType(),
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );

	const bodyClasses = meta?.css_class_manager_body_classes || '';

	const onChangeHandler = ( newValue: string | undefined ) => {
		const oldClasses = bodyClasses;

		setMeta( {
			...meta,
			css_class_manager_body_classes: newValue,
		} );

		cssClassManager.hooks.doAction( 'bodyClasses.settingsPanel.changed', {
			newClasses: newValue,
			oldClasses,
		} );
	};

	return (
		<PluginDocumentSettingPanel
			name="css-class-manager-body-class-control-panel"
			title={ __( 'Body Classes', 'css-class-manager' ) }
			className="css-class-manager__body-class-control-panel"
		>
			<SelectControl
				className={ bodyClasses }
				isSaving={ false }
				onChange={ onChangeHandler }
				helpText={ sprintf(
					/* translators: %s: post type name */
					__(
						'CSS <body> class names for the current %s. Select one or more class names from the dropdown by clicking on the options.',
						'css-class-manager'
					),
					postType
				) }
			/>
		</PluginDocumentSettingPanel>
	);
};

export default SettingsPanel;
