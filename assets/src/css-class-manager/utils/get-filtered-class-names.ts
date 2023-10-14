import type { ClassPreset } from '../types';

function getFilteredClassNames(): ClassPreset[] {
	// @ts-ignore cssClassManager is a global variable.
	return cssClassManager?.filteredClassNames ?? [];
}

export default getFilteredClassNames;
