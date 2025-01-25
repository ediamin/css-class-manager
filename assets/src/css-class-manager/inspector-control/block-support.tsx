import { hasBlockSupport } from '@wordpress/blocks';

export const LINE_HEIGHT_SUPPORT_KEY = 'typography.lineHeight';
export const FONT_FAMILY_SUPPORT_KEY = 'typography.__experimentalFontFamily';
export const FONT_SIZE_SUPPORT_KEY = 'typography.fontSize';
export const TEXT_ALIGN_SUPPORT_KEY = 'typography.textAlign';

const LETTER_SPACING_SUPPORT_KEY = 'typography.__experimentalLetterSpacing';
const TEXT_TRANSFORM_SUPPORT_KEY = 'typography.__experimentalTextTransform';
const TEXT_DECORATION_SUPPORT_KEY = 'typography.__experimentalTextDecoration';
const TEXT_COLUMNS_SUPPORT_KEY = 'typography.textColumns';
const FONT_STYLE_SUPPORT_KEY = 'typography.__experimentalFontStyle';
const FONT_WEIGHT_SUPPORT_KEY = 'typography.__experimentalFontWeight';
const WRITING_MODE_SUPPORT_KEY = 'typography.__experimentalWritingMode';
export const TYPOGRAPHY_SUPPORT_KEY = 'typography';
export const TYPOGRAPHY_SUPPORT_KEYS = [
	LINE_HEIGHT_SUPPORT_KEY,
	FONT_SIZE_SUPPORT_KEY,
	FONT_STYLE_SUPPORT_KEY,
	FONT_WEIGHT_SUPPORT_KEY,
	FONT_FAMILY_SUPPORT_KEY,
	TEXT_ALIGN_SUPPORT_KEY,
	TEXT_COLUMNS_SUPPORT_KEY,
	TEXT_DECORATION_SUPPORT_KEY,
	WRITING_MODE_SUPPORT_KEY,
	TEXT_TRANSFORM_SUPPORT_KEY,
	LETTER_SPACING_SUPPORT_KEY,
];

export const BORDER_SUPPORT_KEY = '__experimentalBorder';
export const SHADOW_SUPPORT_KEY = 'shadow';

export const COLOR_SUPPORT_KEY = 'color';

export const DIMENSIONS_SUPPORT_KEY = 'dimensions';
export const SPACING_SUPPORT_KEY = 'spacing';

export const BACKGROUND_SUPPORT_KEY = 'background';

const styleSupportKeys = [
	...TYPOGRAPHY_SUPPORT_KEYS,
	BORDER_SUPPORT_KEY,
	COLOR_SUPPORT_KEY,
	DIMENSIONS_SUPPORT_KEY,
	BACKGROUND_SUPPORT_KEY,
	SPACING_SUPPORT_KEY,
	SHADOW_SUPPORT_KEY,
];

export const hasStyleSupport = ( nameOrType: string ) =>
	styleSupportKeys.some( ( key: string ) => {
		return hasBlockSupport( nameOrType, key as any );
	} );
