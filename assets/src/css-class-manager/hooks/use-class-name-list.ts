import { useMemo } from '@wordpress/element';
import Fuse from 'fuse.js';

import type {
	ClassPreset,
	CombinedClassPreset,
	DropdownOption,
} from '../types';
import type { Props as ReactSelectProps } from 'react-select';

type ClassNameList = ReactSelectProps< DropdownOption, true >[ 'options' ];

const FUSE_OPTIONS = {
	keys: [ 'name' ],
	includeMatches: true,
	threshold: 0.3,
};

function useClassNameList(
	searchStr: string,
	cssClassNames: CombinedClassPreset[]
): ClassNameList {
	// Memoize the Fuse instance separately so the search index is only
	// rebuilt when the class names list changes, not on every keystroke.
	const fuse = useMemo( () => {
		return new Fuse< ClassPreset >( cssClassNames, FUSE_OPTIONS );
	}, [ cssClassNames ] );

	return useMemo( () => {
		if ( ! searchStr ) {
			return cssClassNames.map( ( item ) => ( {
				...item,
				value: item.name,
				label: item.name,
			} ) );
		}

		const result = fuse.search( searchStr );

		return result.map( ( itemObj ) => ( {
			...itemObj.item,
			value: itemObj.item.name,
			label: itemObj.item.name,
			matches: itemObj.matches,
		} ) );
	}, [ cssClassNames, searchStr, fuse ] );
}

export default useClassNameList;
