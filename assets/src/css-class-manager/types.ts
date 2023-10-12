import type { BlockEditProps as CoreBlockEditProps } from '@wordpress/blocks';

export interface ClassPreset {
	name: string;
	description?: string;
}

export interface BlockEditProps< T extends Record< string, any > >
	extends CoreBlockEditProps< T > {
	name: string;
}
