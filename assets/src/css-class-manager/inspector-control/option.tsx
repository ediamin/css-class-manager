import type { DropdownOption } from '../types';
import type { CSSProperties, FC } from 'react';
import type { OptionProps } from 'react-select';

type OptionTemplateProps = OptionProps< DropdownOption, true >;

const Option: FC< OptionTemplateProps > = ( props ) => {
	const {
		children,
		isDisabled,
		isFocused,
		isSelected: isSelectedOption,
		innerRef,
		innerProps,
		cx,
		getStyles,
		getClassNames,
		className,
		data,
	} = props;

	const name = 'option';
	const style = getStyles( name, props ) as CSSProperties;

	return (
		<div
			style={ style }
			className={ cx(
				{
					option: true,
					'option--is-disabled': isDisabled,
					'option--is-focused': isFocused,
					'option--is-selected': isSelectedOption,
				},
				getClassNames( name, props ),
				className
			) }
			ref={ innerRef }
			aria-disabled={ isDisabled }
			{ ...innerProps }
		>
			{ children }
			{ data.description && (
				<p className="css-class-manager__react-select__option__description">
					{ data.description }
				</p>
			) }
		</div>
	);
};

export default Option;
