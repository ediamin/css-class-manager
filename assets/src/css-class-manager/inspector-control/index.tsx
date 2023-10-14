import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { FormTokenField } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import getClassNames from '../utils/get-class-names';

import getRenderItem from './get-render-item';

import type { BlockEditProps } from '../types';
import type { FormTokenFieldProps } from '@wordpress/components/build-types/form-token-field/types';
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

		const handleOnChangeFormtoken: FormTokenFieldProps[ 'onChange' ] = (
			value
		) => {
			setAttributes( {
				className: value.length ? value.join( ' ' ) : undefined,
			} );
		};

		const renderItem: FormTokenFieldProps[ '__experimentalRenderItem' ] =
			( { item } ) => getRenderItem( item );

		const openManager = ( event: MouseEvent< HTMLAnchorElement > ) => {
			event.preventDefault();
			openModal( MANAGER_MODAL_NAME );
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
					<div className="components-base-control">
						<FormTokenField
							__experimentalAutoSelectFirstMatch
							__experimentalExpandOnFocus
							label={ __(
								'Additional CSS class(es)',
								'css-class-manager'
							) }
							onChange={ handleOnChangeFormtoken }
							suggestions={ getClassNames( className ) }
							value={ className?.split( ' ' ) ?? [] }
							__experimentalRenderItem={ renderItem }
						/>
						<a
							href="#open-css-class-manager"
							onClick={ openManager }
							style={ {
								display: 'block',
								marginTop: '-0.7em',
								fontSize: '12px',
							} }
						>
							{ __(
								'Open CSS Class Manager',
								'css-class-manager'
							) }
						</a>
					</div>
				</InspectorControls>
			</>
		);
	},
	'withCSSClassManagerInspectorControl'
);

export default withCSSClassManagerInspectorControl;
