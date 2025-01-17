import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import { useStore } from '../hooks';

import SelectControl from './select-control';

import type { BlockEditProps } from '../types';
import type { FC, MouseEvent } from 'react';

interface Attributes {
	className: string | undefined;
}

type BlockEditType = FC< BlockEditProps< Attributes > >;

const withCSSClassManagerInspectorControl = createHigherOrderComponent<
	BlockEditType,
	BlockEditType
>(
	( BlockEdit ) => ( props ) => {
		const { name, isSelected, attributes, setAttributes } = props;
		const { className } = attributes;

		const { openModal } = useDispatch( INTERFACE_STORE );
		const {
			userDefinedClassNames,
			userSettings: { inspectorControlPosition },
			isSavingSettings,
			panelLabel,
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
			setAttributes( { className: newValue } );
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

		const hasCustomClassNameSupport = useMemo(
			() => hasBlockSupport( name, 'customClassName', true ),
			[ name ]
		);

		const controlGroup = useMemo( () => {
			if ( inspectorControlPosition === 'own-panel' ) {
				if (
					hasBlockSupport( name, 'layout' as any ) ||
					hasBlockSupport( name, '__experimentalLayout' as any )
				) {
					return 'default';
				}
				return 'styles';
			}
			return 'advanced';
		}, [ name, inspectorControlPosition ] );

		if ( ! isSelected || ! hasCustomClassNameSupport ) {
			return <BlockEdit { ...props } />;
		}

		const inspectorControlContent = (
			<>
				<SelectControl
					className={ className ?? '' }
					isSaving={ isSavingSettings }
					onChange={ onChangeHandler }
					onCreateNew={ onCreateNewHandler }
				/>

				<p className="css-class-manager__inspector-control__help-text">
					{ __(
						'Select one or more class names from the dropdown by clicking on the options.',
						'css-class-manager'
					) }
				</p>
				<p className="css-class-manager__inspector-control__help-text">
					<a href="#open-css-class-manager" onClick={ openManager }>
						{ __( 'Open Class Manager', 'css-class-manager' ) }
					</a>
				</p>
			</>
		);

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls group={ controlGroup }>
					{ controlGroup === 'advanced' ? (
						<div className="css-class-manager__inspector-control">
							<label
								htmlFor="css-class-manager__select"
								className="css-class-manager__inspector-control__label"
							>
								{ panelLabel }
							</label>
							{ inspectorControlContent }
						</div>
					) : (
						<PanelBody title={ panelLabel } initialOpen={ true }>
							{ inspectorControlContent }
						</PanelBody>
					) }
				</InspectorControls>
			</>
		);
	},
	'withCSSClassManagerInspectorControl'
);

export default withCSSClassManagerInspectorControl;
