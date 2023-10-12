import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { FormTokenField } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { __ } from '@wordpress/i18n';

import getClassNames from './get-class-names';
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
			// console.log( 'open manager' );
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
							style={ { fontSize: '12px' } }
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
