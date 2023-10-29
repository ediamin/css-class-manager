import { select } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

import { STORE_NAME } from '../constants';

import type { ClassPreset, DropdownOption } from '../types';
import type { OptionsOrGroups, Props as ReactSelectProps } from 'react-select';

type ClassNameList = ReactSelectProps< DropdownOption, true >[ 'options' ];

function useClassNameList(
	attributeClassName: string | undefined
): ClassNameList {
	const classNames: ClassPreset[] = useMemo( () => {
		return (
			attributeClassName
				?.split( ' ' )
				.map( ( item ) => ( { name: item } ) ) ?? []
		);
	}, [ attributeClassName ] );

	return useMemo( () => {
		const cssClassNames = select( STORE_NAME ).getCssClassNames();

		return classNames
			.concat( cssClassNames )
			.sort()
			.map( ( item ) => ( {
				value: item.name,
				label: item.name,
				...item,
			} ) );
	}, [ classNames ] );
}

export default useClassNameList;
