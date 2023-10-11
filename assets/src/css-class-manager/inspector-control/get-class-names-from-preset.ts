import type { ClassPreset } from './types';

function getClassNamesFromPresets( presets: ClassPreset[] ): string[] {
	return presets.map( ( { name } ) => name );
}

export default getClassNamesFromPresets;
