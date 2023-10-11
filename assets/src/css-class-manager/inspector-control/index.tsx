import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

import withCSSClassManagerInspectorControl from './with-css-class-manager-inspector-control';

addFilter(
	'editor.BlockEdit',
	'additional-css-class-manager/block-editor/inspector-control',
	withCSSClassManagerInspectorControl
);
