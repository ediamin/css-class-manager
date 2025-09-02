import { useDispatch } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CreatableSelect from 'react-select/creatable';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import { useClassNameList, useStore } from '../hooks';

import NoOptionsMessage from './no-options-message';
import OptionLabel from './option-label';

import type { DropdownOption } from '../types';
import type { FC, MouseEvent } from 'react';
import type { InputActionMeta, Props as ReactSelectProps } from 'react-select';

type SelectProps = ReactSelectProps< DropdownOption, true >;
type OnChangeHandler = SelectProps[ 'onChange' ];
type FormatOptionLabel = SelectProps[ 'formatOptionLabel' ];
type FilterOptionOption = SelectProps[ 'filterOption' ];

interface SelectControlProps {
	className: string;
	isSaving: boolean;
	onChange: ( newValue: string | undefined ) => void;
	children?: React.ReactNode;
}

const formatOptionLabel: FormatOptionLabel = (
	data,
	formatOptionLabelMeta
) => {
	const { name } = data;
	const { context } = formatOptionLabelMeta;

	return context === 'menu' ? (
		<OptionLabel { ...data } />
	) : (
		<div>{ name }</div>
	);
};

const SelectControl: FC< SelectControlProps > = ( {
	className,
	isSaving,
	onChange,
	children,
} ) => {
	const [ searchStr, setSearchStr ] = useState( '' );
	const { cssClassNames, cssUniqueClassNames } = useStore();
	const classNameList = useClassNameList( searchStr, cssClassNames );

	const selectedValue = useMemo( () => {
		return className.length
			? className
					.split( ' ' )
					.filter( ( str ) => str.trim().length )
					.map( ( item ) => ( {
						value: item,
						label: item,
						name: item,
						description: '',
					} ) )
			: [];
	}, [ className ] );

	const { openModal } = useDispatch( INTERFACE_STORE );

	const {
		userDefinedClassNames,
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useStore();

	const openManager = ( event: MouseEvent< HTMLAnchorElement > ) => {
		event.preventDefault();
		openModal( MANAGER_MODAL_NAME );
	};

	const onCreateNewHandler = async ( newClassName: string ) => {
		if ( ! newClassName.trim() ) {
			createErrorNotice(
				__( 'Class Name cannot be empty', 'css-class-manager' )
			);

			return;
		}

		startSavingSettings();
		await saveUserDefinedClassNames(
			{ name: newClassName.replaceAll( ' ', '-' ), description: '' },
			userDefinedClassNames
		);
		await completedSavingSettings();
	};

	const onChangeHandler: OnChangeHandler = ( newValue, actionMeta ) => {
		if ( actionMeta.action === 'create-option' ) {
			onCreateNewHandler( actionMeta.option.value );
		}

		onChange(
			newValue.length
				? newValue
						.map( ( item ) => item.value.replaceAll( ' ', '-' ) )
						.join( ' ' )
						.trim()
				: undefined
		);
	};

	const onInputChangeHandler = (
		newValue: string,
		actionMeta: InputActionMeta
	) => {
		if ( actionMeta.action === 'input-change' ) {
			setSearchStr( newValue );
			return;
		}

		setSearchStr( '' );
	};

	const filterOption: FilterOptionOption = ( option, inputValue ) => {
		if (
			option.data.__isNew__ &&
			cssUniqueClassNames[ inputValue.trim().replaceAll( ' ', '-' ) ]
		) {
			return false;
		}

		return true;
	};

	return (
		<>
			<CreatableSelect
				id="css-class-manager__select"
				className="css-class-manager__react-select"
				classNamePrefix="css-class-manager__react-select"
				menuPlacement="auto"
				isMulti
				isDisabled={ isSaving }
				isLoading={ isSaving }
				options={ classNameList }
				onChange={ onChangeHandler }
				value={ selectedValue }
				closeMenuOnSelect={ false }
				noOptionsMessage={ NoOptionsMessage }
				formatOptionLabel={ formatOptionLabel }
				filterOption={ filterOption }
				onInputChange={ onInputChangeHandler }
				placeholder={ __( 'Select class names', 'css-class-manager' ) }
				components={ {
					DropdownIndicator: null,
				} }
			/>
			{ children }
			<p className="css-class-manager__inspector-control__help-text">
				<a href="#open-css-class-manager" onClick={ openManager }>
					{ __( 'Open Class Manager', 'css-class-manager' ) }
				</a>
			</p>
		</>
	);
};

export default SelectControl;
