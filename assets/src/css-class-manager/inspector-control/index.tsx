import { InspectorControls } from '@wordpress/block-editor';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addFilter } from '@wordpress/hooks';

const withCSSClassManagerInspectorControl = createHigherOrderComponent(
	( BlockEdit ) => ( props ) => {
		return (
			<>
				{ /* @ts-ignore 3RD_PARTY_PACKAGE_IS_MISSING_TYPE */ }
				<InspectorControls group="styles">
					<p>Controls</p>
				</InspectorControls>
				<BlockEdit { ...props } />
			</>
		);
	},
	'withCSSClassManagerInspectorControl'
);
addFilter(
	'editor.BlockEdit',
	'additional-css-class-manager/block-editor/inspector-control',
	withCSSClassManagerInspectorControl
);
