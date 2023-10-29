import { InspectorControls } from '@wordpress/block-editor';
import { hasBlockSupport } from '@wordpress/blocks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useDispatch } from '@wordpress/data';
import { useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Select from 'react-select';

import { INTERFACE_STORE, MANAGER_MODAL_NAME } from '../constants';
import useClassNameList from '../hooks/use-class-name-list';

import OptionTemplate from './option';

import type { BlockEditProps, DropdownOption } from '../types';
import type { FC, MouseEvent } from 'react';
import type { Props as ReactSelectProps } from 'react-select';

interface Attributes {
	className: string;
}

type BlockEditType = FC< BlockEditProps< Attributes > >;
type OnChangeHandler = ReactSelectProps< DropdownOption, true >[ 'onChange' ];

const withCSSClassManagerInspectorControl = createHigherOrderComponent<
	BlockEditType,
	BlockEditType
>(
	( BlockEdit ) => ( props ) => {
		const { name, isSelected, attributes, setAttributes } = props;
		const { className } = attributes;

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

		const { openModal } = useDispatch( INTERFACE_STORE );
		const classNameList = useClassNameList( className );

		const onChangeHandler: OnChangeHandler = ( newValue ) => {
			setAttributes( {
				className: newValue.length
					? newValue.map( ( item ) => item.value ).join( ' ' )
					: undefined,
			} );
		};

		const noOptionsMessage = () => {
			return (
				<div>{ __( 'No class name found.', 'css-class-manager' ) }</div>
			);
		};

		const openManager = ( event: MouseEvent< HTMLAnchorElement > ) => {
			event.preventDefault();
			openModal( MANAGER_MODAL_NAME );
		};

		const hasCustomClassName = hasBlockSupport(
			name,
			'customClassName',
			true
		);

		if ( ! isSelected || ! hasCustomClassName ) {
			return <BlockEdit { ...props } />;
		}

		return (
			<>
				<BlockEdit { ...props } />
				{ /* @ts-ignore 3RD_PARTY_PACKAGE_IS_MISSING_TYPE */ }
				<InspectorControls group="advanced">
					<div className="css-class-manager__inspector-control">
						<label
							htmlFor="css-class-manager__select"
							className="css-class-manager__inspector-control__label"
						>
							{ __(
								'Additional CSS class(es)',
								'css-class-manager'
							) }
						</label>
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
							placeholder={ __(
								'Select class names',
								'css-class-manager'
							) }
							components={ {
								DropdownIndicator: null,
								Option: OptionTemplate,
							} }
						/>
						<p className="css-class-manager__inspector-control__help-text">
							{ __(
								'Click on the dropdown box and select one or more class names.',
								'css-class-manager'
							) }
						</p>
						<p className="css-class-manager__inspector-control__help-text">
							<a
								href="#open-css-class-manager"
								onClick={ openManager }
							>
								{ __(
									'Open Class Manager',
									'css-class-manager'
								) }
							</a>
						</p>
					</div>
				</InspectorControls>
			</>
		);
	},
	'withCSSClassManagerInspectorControl'
);

export default withCSSClassManagerInspectorControl;
