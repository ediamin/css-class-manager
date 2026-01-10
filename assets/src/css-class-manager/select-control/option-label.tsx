import type { DropdownOption } from '../types';
import type { FC } from 'react';

const OptionLabel: FC< DropdownOption > = ( {
	name,
	label,
	description,
	__isNew__,
	matches,
} ) => {
	const renderHighlightedName = () => {
		if ( ! matches?.[ 0 ]?.indices?.length ) {
			return name;
		}

		const result = [];
		let lastIndex = 0;

		matches[ 0 ].indices.forEach( ( [ start, end ] ) => {
			// Add text before match.
			if ( start > lastIndex ) {
				result.push( name.substring( lastIndex, start ) );
			}

			// Add highlighted match.
			result.push(
				<span
					key={ start }
					className="css-class-manager__react-select__option__highlighted"
				>
					{ name.substring( start, end + 1 ) }
				</span>
			);
			lastIndex = end + 1;
		} );

		// Add remaining text after last match.
		if ( lastIndex < name.length ) {
			result.push( name.substring( lastIndex ) );
		}

		return result;
	};

	return (
		<>
			{ __isNew__ ? (
				<div>{ label }</div>
			) : (
				<>
					{ renderHighlightedName() }
					{ description && (
						<p className="css-class-manager__react-select__option__description">
							{ description }
						</p>
					) }
				</>
			) }
		</>
	);
};

export default OptionLabel;
