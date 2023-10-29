import { useMemo } from '@wordpress/element';

import type { ClassPreset, DropdownOption } from '../types';
import type { Props as ReactSelectProps } from 'react-select';

type ClassNameList = ReactSelectProps< DropdownOption, true >[ 'options' ];

function useClassNameList(
	attributeClassName: string | undefined,
	cssClassNames: any
): ClassNameList {
	const classNames: ClassPreset[] = useMemo( () => {
		return (
			attributeClassName
				?.split( ' ' )
				.map( ( item ) => ( { name: item } ) ) ?? []
		);
	}, [ attributeClassName ] );

	return useMemo( () => {
		return classNames
			.concat( cssClassNames )
			.sort()
			.map( ( item ) => ( {
				value: item.name,
				label: item.name,
				...item,
			} ) );
	}, [ classNames, cssClassNames ] );
}

export default useClassNameList;
