import { __, _n, sprintf } from '@wordpress/i18n';

import type { DropdownOption } from '../types';
import type { ReactNode } from 'react';

function getNewOptionData(
	inputVal: string,
	optionLabel: ReactNode,
	allowAddingClassNamesWithoutCreating: boolean
): DropdownOption {
	if ( ! allowAddingClassNamesWithoutCreating ) {
		optionLabel = (
			<>
				{ sprintf(
					// translators: %s: New class name.
					__( 'Create "%s"', 'css-class-manager' ),
					inputVal.replaceAll( ' ', '-' )
				) }
			</>
		);
	} else {
		optionLabel = (
			<>
				{ sprintf(
					// translators: %s: New class name.
					__( 'Press Enter to create "%s"', 'css-class-manager' ),
					inputVal.replaceAll( ' ', '-' )
				) }
				<p className="css-class-manager__react-select__skip-create-instruction">
					{ _n(
						'or press Space to add the class name without creating it.',
						'or press Space to add the class names without creating them.',
						inputVal.trim().split( /\s+/ ).length,
						'css-class-manager'
					) }
				</p>
			</>
		);
	}

	return {
		name: 'new-option',
		label: optionLabel,
		value: inputVal,
		__isNew__: true,
	};
}

export default getNewOptionData;
