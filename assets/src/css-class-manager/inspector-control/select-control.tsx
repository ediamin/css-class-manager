import { useEffect, useMemo } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import CreatableSelect from 'react-select/creatable';

import { useClassNameList, useStore } from '../hooks';

import type { DropdownOption } from '../types';
import type { FC } from 'react';
import type { Props as ReactSelectProps } from 'react-select';

type SelectProps = ReactSelectProps< DropdownOption, true >;
type OnChangeHandler = SelectProps[ 'onChange' ];
type FormatOptionLabel = SelectProps[ 'formatOptionLabel' ];

interface SelectControlProps {
	className: string;
	isSaving: boolean;
	onChange: ( newValue: string | undefined ) => void;
	onCreateNew: ( newClassName: string ) => void;
}

const noOptionsMessage = () => {
	return <div>{ __( 'No class name found.', 'css-class-manager' ) }</div>;
};

const formatOptionLabel: FormatOptionLabel = (
	data,
	formatOptionLabelMeta
) => {
	const { name, description, value } = data;
	const { context } = formatOptionLabelMeta;

	return context === 'menu' ? (
		<>
			{ data.__isNew__ ? (
				<div>
					{ sprintf(
						// translators: %s: New class name.
						__( 'Create "%s"', 'css-class-manager' ),
						value.replaceAll( ' ', '-' )
					) }
				</div>
			) : (
				<>
					{ name }
					{ description && (
						<p className="css-class-manager__react-select__option__description">
							{ description }
						</p>
					) }
				</>
			) }
		</>
	) : (
		<div>{ name }</div>
	);
};

const SelectControl: FC< SelectControlProps > = ( {
	className,
	isSaving,
	onChange,
	onCreateNew,
} ) => {
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

	const { cssClassNames } = useStore();

	const classNameList = useClassNameList( className, cssClassNames );

	useEffect( () => {
		// Hide the default CSS class name control.
		const labels = Array.from(
			document.querySelectorAll( '.components-base-control__label' )
		).filter(
			( label ) => label.textContent === 'Additional CSS class(es)'
		);

		if ( ! labels.length ) {
			return;
		}

		labels[ 0 ]?.parentElement?.parentElement?.classList.add( 'hidden' );
	}, [] );

	const onChangeHandler: OnChangeHandler = ( newValue, actionMeta ) => {
		if ( actionMeta.action === 'create-option' ) {
			onCreateNew( actionMeta.option.value );
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

	return (
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
