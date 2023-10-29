import { useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Select from 'react-select';

import { STORE_NAME } from '../constants';
import useClassNameList from '../hooks/use-class-name-list';

import type { Selectors } from '../store';
import type { DropdownOption } from '../types';
import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';
import type { FC } from 'react';
import type { Props as ReactSelectProps } from 'react-select';

type SelectProps = ReactSelectProps< DropdownOption, true >;
type OnChangeHandler = SelectProps[ 'onChange' ];
type FormatOptionLabel = SelectProps[ 'formatOptionLabel' ];
type FilterOption = SelectProps[ 'filterOption' ];

interface SelectControlProps {
	className: string;
	onChange: ( newValue: string | undefined ) => void;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

interface UseSelectReturn {
	cssClassNames: ReturnType< Selectors[ 'getCssClassNames' ] >;
}

const SelectControl: FC< SelectControlProps > = ( { className, onChange } ) => {
	const selectedValue = useMemo( () => {
		return typeof className === 'string'
			? className.split( ' ' ).map( ( item ) => ( {
					value: item,
					label: item,
					name: item,
					description: '',
			  } ) )
			: [];
	}, [ className ] );

	const { cssClassNames }: UseSelectReturn = useSelect< MapSelect >(
		( select ) => {
			const dataStore = select< SelectFunctionParam >(
				STORE_NAME as any
			);
			return {
				cssClassNames: dataStore.getCssClassNames(),
			};
		},
		[]
	);

	const classNameList = useClassNameList( className, cssClassNames );

	const noOptionsMessage = () => {
		return <div>{ __( 'No class name found.', 'css-class-manager' ) }</div>;
	};

	const formatOptionLabel: FormatOptionLabel = (
		data,
		formatOptionLabelMeta
	) => {
		const { name, description } = data;
		const { context } = formatOptionLabelMeta;

		return context === 'menu' ? (
			<>
				{ name }
				{ description && (
					<p className="css-class-manager__react-select__option__description">
						{ description }
					</p>
				) }
			</>
		) : (
			<div>{ name }</div>
		);
	};

	const filterOption: FilterOption = ( option, inputValue ) => {
		const { name, description } = option.data;

		return (
			name.includes( inputValue ) ||
			( description && description.includes( inputValue ) ) ||
			false
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
			filterOption={ filterOption }
			placeholder={ __( 'Select class names', 'css-class-manager' ) }
			components={ {
				DropdownIndicator: null,
			} }
		/>
	);
};

export default SelectControl;
