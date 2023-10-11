import type { ClassPreset } from './types';

function getFilteredClassNames(): ClassPreset[] {
	return [
		{
			name: 'pb-10',
			description: 'padding-bottom: 10px',
		},
		{
			name: 'border',
			description: 'border: 1px',
		},
	];
}

export default getFilteredClassNames;
