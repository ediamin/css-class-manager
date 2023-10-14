import type { ClassPreset } from '../types';

function getUserDefinedClassNames(): ClassPreset[] {
	return [
		{
			name: 'mb-10',
		},
		{
			name: 'mt-10',
		},
		{
			name: 'pt-10',
			description: 'padding-top: 10px;',
		},
		{
			name: 'desktop-only',
			description: 'Show only in desktop view',
		},
	];
}

export default getUserDefinedClassNames;
