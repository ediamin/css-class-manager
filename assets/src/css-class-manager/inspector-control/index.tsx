import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';

import SelectControl from './select-control';

import type { BlockEditProps } from '../types';
import type { FC, MouseEvent } from 'react';

interface Attributes {
	className: string;
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

		const openManager = ( event: MouseEvent< HTMLAnchorElement > ) => {
			event.preventDefault();
			openModal( MANAGER_MODAL_NAME );
		};

		const onChangeHandler = ( newValue: string | undefined ) => {
			setAttributes( { className: newValue } );
		};

		const hasCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);

		if ( ! isSelected || ! hasCustomClassName ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ /* @ts-ignore 3RD_PARTY_PACKAGE_IS_MISSING_TYPE */ }
				<InspectorControls group="advanced">
					<div className="css-class-manager__inspector-control">
						<label
							htmlFor="css-class-manager__select"
							className="css-class-manager__inspector-control__label"
						>
							{ __(
								'Additional CSS class(es)',
								'css-class-manager'
							) }
						</label>

						<SelectControl
							className={ className }
							onChange={ onChangeHandler }
						/>

						<p className="css-class-manager__inspector-control__help-text">
							{ __(
								'Click on the dropdown box and select one or more class names.',
								'css-class-manager'
							) }
						</p>
						<p className="css-class-manager__inspector-control__help-text">
							<a
								href="#open-css-class-manager"
								onClick={ openManager }
							>
								{ __(
									'Open Class Manager',
									'css-class-manager'
								) }
							</a>
						</p>
					</div>
				</InspectorControls>
			</>
		);
	},
	'withCSSClassManagerInspectorControl'
);

export default withCSSClassManagerInspectorControl;
