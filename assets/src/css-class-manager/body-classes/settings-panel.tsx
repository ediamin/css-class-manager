import { Spinner } from '@wordpress/components';
import { useEntityProp, useEntityRecord } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import {
	store as EDITOR_STORE,
	PluginDocumentSettingPanel,
} from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { getPath } from '@wordpress/url';

import InspectorControl from './inspector-control';

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

interface PostTypeRecord {
	labels: {
		singular_name: string;
	};
}

const isSiteEditor = getPath( window.location.href )?.includes(
	'site-editor.php'
);

const SettingsPanel = () => {
	const postType: string = useSelect< MapSelect >(
		( select ) =>
			select< SelectFunctionParam >(
				EDITOR_STORE as any
			).getCurrentPostType(),
		[]
	);

	const [ meta, setMeta ] = useEntityProp( 'postType', postType, 'meta' );
	const postTypeRecord = useEntityRecord< PostTypeRecord >(
		'root',
		'postType',
		postType
	);

	if (
		isSiteEditor ||
		! cssClassManager.bodyClasses.supportedPostTypes.includes( postType )
	) {
		return null;
	}

	// Show loading spinner while the post type record is being fetched
	if ( ! postTypeRecord.hasResolved ) {
		return (
			<PluginDocumentSettingPanel
				name="css-class-manager-body-class-control-panel"
				title={ __( 'Body Classes', 'css-class-manager' ) }
				className="css-class-manager__body-class-control-panel"
			>
				<div style={ { textAlign: 'center', padding: '20px' } }>
					<Spinner />
				</div>
			</PluginDocumentSettingPanel>
		);
	}

	const bodyClasses = meta?.css_class_manager_body_classes || '';
	const useInPostLoop = meta?.css_class_manager_use_in_post_loop || false;

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

	const onUseInPostLoopChangeHandler = () => {
		setMeta( {
			...meta,
			css_class_manager_use_in_post_loop: ! useInPostLoop,
		} );
	};

	return (
		<PluginDocumentSettingPanel
			name="css-class-manager-body-class-control-panel"
			title={ __( 'Body Classes', 'css-class-manager' ) }
			className="css-class-manager__body-class-control-panel"
		>
			<InspectorControl
				bodyClasses={ bodyClasses }
				useInPostLoop={ useInPostLoop }
				postType={ postType }
				postTypeLabel={
					postTypeRecord.record?.labels.singular_name ?? ''
				}
				onChangeHandler={ onChangeHandler }
				onUseInPostLoopChangeHandler={ onUseInPostLoopChangeHandler }
			/>
		</PluginDocumentSettingPanel>
	);
};

export default SettingsPanel;
