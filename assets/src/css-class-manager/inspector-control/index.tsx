import { InspectorControls } from '@wordpress/block-editor';
import { getBlockSupport, hasBlockSupport } from '@wordpress/blocks';
import { PanelBody } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { useStore } from '../hooks';
import SelectControl from '../select-control';

import { hasStyleSupport } from './block-support';

import type { BlockEditProps } from '../types';
import type { FC } from 'react';

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

		const {
			userSettings: { inspectorControlPosition },
			isSavingSettings,
			panelLabel,
		} = useStore();

		const onChangeHandler = ( newValue: string | undefined ) => {
			setAttributes( { className: newValue } );
		};

		// Check if the block supports custom class name.
		const hasCustomClassNameSupport = useMemo(
			() => hasBlockSupport( name, 'customClassName', true ),
			[ name ]
		);

		// Determine the control group to render.
		const controlGroup = useMemo( () => {
			if ( inspectorControlPosition === 'own-panel' && isSelected ) {
				const layoutSupport = getBlockSupport(
					name,
					'layout' as any
				) as boolean | { allowEditing: boolean };

				let hasLayoutSupport: boolean = false;

				if ( typeof layoutSupport === 'boolean' ) {
					hasLayoutSupport = layoutSupport;
				} else if ( typeof layoutSupport === 'object' ) {
					if ( layoutSupport.allowEditing === undefined ) {
						hasLayoutSupport = true;
					} else {
						hasLayoutSupport = layoutSupport?.allowEditing;
					}
				}

				if (
					! hasStyleSupport( name ) ||
					hasLayoutSupport ||
					hasBlockSupport( name, '__experimentalLayout' as any )
				) {
					return 'default';
				}

				return 'styles';
			}
			return 'advanced';
		}, [ inspectorControlPosition, isSelected, name ] );

		// Check if the tablist is present in the inspector controls.
		const [ hasTablist, setHasTablist ] = useState( false );
		useEffect( () => {
			if ( ! isSelected ) {
				return;
			}

			setHasTablist( false );

			// This is not a perfect solution, but it works for now.
			setTimeout( () => {
				const tabListElement = document.querySelector(
					'.block-editor-block-inspector__tabs > [role=tablist]'
				);

				if ( tabListElement && controlGroup === 'styles' ) {
					setHasTablist( true );
				}
			}, 100 );
		}, [ controlGroup, isSelected ] );

		if ( ! isSelected || ! hasCustomClassNameSupport ) {
			return <BlockEdit { ...props } />;
		}

		const inspectorControlContent = (
			<SelectControl
				className={ className ?? '' }
				isSaving={ isSavingSettings }
				onChange={ onChangeHandler }
			>
				<p className="css-class-manager__inspector-control__help-text">
					{ __(
						'Select one or more class names from the dropdown by clicking on the options.',
						'css-class-manager'
					) }
				</p>
			</SelectControl>
		);

		return (
			<>
				<BlockEdit { ...props } />
				<InspectorControls
					group={ hasTablist ? 'default' : controlGroup }
				>
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
