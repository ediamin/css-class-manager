import { useMemo } from '@wordpress/element';
import Fuse from 'fuse.js';

import type {
	ClassPreset,
	CombinedClassPreset,
	DropdownOption,
} from '../types';
import type { Props as ReactSelectProps } from 'react-select';

type ClassNameList = ReactSelectProps< DropdownOption, true >[ 'options' ];

function useClassNameList(
	searchStr: string,
	cssClassNames: CombinedClassPreset[]
): ClassNameList {
	return useMemo( () => {
		if ( ! searchStr ) {
			return cssClassNames.map( ( item ) => ( {
				...item,
				value: item.name,
				label: item.name,
			} ) );
		}

		const options = {
			keys: [ 'name' ],
			includeMatches: true,
			threshold: 0.3,
		};

		const fuse = new Fuse< ClassPreset >( cssClassNames, options );

		const result = fuse.search( searchStr );

		return result.map( ( itemObj ) => ( {
			...itemObj.item,
			value: itemObj.item.name,
			label: itemObj.item.name,
			matches: itemObj.matches,
		} ) );
	}, [ cssClassNames, searchStr ] );
}

export default useClassNameList;
