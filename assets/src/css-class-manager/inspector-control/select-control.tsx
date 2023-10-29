import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Select from 'react-select';

import useClassNameList from '../hooks/use-class-name-list';

import type { DropdownOption } from '../types';
import type { FC } from 'react';
import type { Props as ReactSelectProps } from 'react-select';

type SelectProps = ReactSelectProps< DropdownOption, true >;
type OnChangeHandler = SelectProps[ 'onChange' ];
type FormatOptionLabel = SelectProps[ 'formatOptionLabel' ];

interface SelectControlProps {
	className: string;
	onChange: ( newValue: string | undefined ) => void;
}

const SelectControl: FC< SelectControlProps > = ( { className, onChange } ) => {
	const selectedValue = useMemo( () => {
		return typeof className === 'string'
			? className.split( ' ' ).map( ( item ) => ( {
					value: item,
					label: item,
					name: '',
					description: '',
			  } ) )
			: [];
	}, [ className ] );

	const classNameList = useClassNameList( className );

	const noOptionsMessage = () => {
		return <div>{ __( 'No class name found.', 'css-class-manager' ) }</div>;
	};

	const formatOptionLabel: FormatOptionLabel = (
		data,
		formatOptionLabelMeta
	) => {
		const { value, description } = data;
		const { context } = formatOptionLabelMeta;

		return context === 'menu' ? (
			<>
				{ value }
				{ description && (
					<p className="css-class-manager__react-select__option__description">
						{ description }
					</p>
				) }
			</>
		) : (
			<div>{ value }</div>
		);
	};

	const onChangeHandler: OnChangeHandler = ( newValue ) => {
		onChange(
			newValue.length
				? newValue.map( ( item ) => item.value ).join( ' ' )
				: undefined
		);
	};

	return (
		<Select
			id="css-class-manager__select"
			className="css-class-manager__react-select"
			classNamePrefix="css-class-manager__react-select"
			isMulti
			options={ classNameList }
			onChange={ onChangeHandler }
			value={ selectedValue }
			closeMenuOnSelect={ false }
			noOptionsMessage={ noOptionsMessage }
			formatOptionLabel={ formatOptionLabel }
			placeholder={ __( 'Select class names', 'css-class-manager' ) }
			components={ {
				DropdownIndicator: null,
			} }
		/>
	);
};

export default SelectControl;
