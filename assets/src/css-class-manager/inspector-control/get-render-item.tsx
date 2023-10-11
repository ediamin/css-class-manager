import getFilteredClassNames from './get-filtered-class-names';
import getUserDefinedClassNames from './get-user-defined-class-names';

import type { ClassPreset } from './types';
import type { ReactNode } from 'react';

interface ClassNamesPreset {
	[ name: string ]: ClassPreset;
}

const getRenderItem = ( item: string ): ReactNode => {
	const classNamesPreset: ClassNamesPreset = [
		...getUserDefinedClassNames(),
		...getFilteredClassNames(),
	].reduce< ClassNamesPreset >( ( presets, presetItem ) => {
		presets[ presetItem.name ] = presetItem;
		return presets;
	}, {} );

	return (
		<div>
			<span>{ item }</span>
			{ classNamesPreset?.[ item ]?.description && (
				<p style={ { margin: 0, opacity: 0.5 } }>
					<small>{ classNamesPreset[ item ].description }</small>
				</p>
			) }
		</div>
	);
};

export default getRenderItem;
