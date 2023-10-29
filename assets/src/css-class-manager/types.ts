import type { BlockEditProps as CoreBlockEditProps } from '@wordpress/blocks';
import type { ReactNode } from 'react';

export interface ClassPreset {
	name: string;
	description?: string;
}

export interface CombinedClassPreset extends ClassPreset {
	isFilteredClassName?: boolean;
	id: string;
}

export interface BlockEditProps< T extends Record< string, any > >
	extends CoreBlockEditProps< T > {
	name: string;
}

export interface ModalTab {
	name: string;
	tabLabel: string;
	content: ReactNode;
}

export interface DropdownOption extends ClassPreset {
	label: string;
	value: string;
}
