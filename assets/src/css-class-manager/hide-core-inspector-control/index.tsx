import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';

import Control from './control';

import type { BlockEditProps } from '../types';
import type { FC } from 'react';

interface Attributes {
	className: string | undefined;
}

type BlockEditType = FC< BlockEditProps< Attributes > >;

const withHideCoreAdditionalCSSClassesInspectorControl =
	createHigherOrderComponent< BlockEditType, BlockEditType >(
		( BlockEdit ) => ( props ) => {
			const { name, isSelected } = props;

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
					<InspectorControls group="advanced">
						<Control />
					</InspectorControls>
				</>
			);
		},
		'withHideCoreAdditionalCSSClassesInspectorControl'
	);

export default withHideCoreAdditionalCSSClassesInspectorControl;
