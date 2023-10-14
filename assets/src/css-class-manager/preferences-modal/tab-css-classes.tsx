import {
	Panel,
	PanelBody,
	PanelRow,
	SearchControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import getFilteredClassNames from '../utils/get-filtered-class-names';
import getUserDefinedClassNames from '../utils/get-user-defined-class-names';

import ClassForm from './class-form';
import PreferencesModalSection from './preferences-modal-section';

import type { ClassPreset, ModalTab } from '../types';

const AddCSSClassForm = () => {
	const [ isDisabled, setIsDisabled ] = useState< boolean >( false );
	const onSubmitHandler = ( classPreset: ClassPreset ) => {
		setIsDisabled( true );
		// console.log( { newClass: classPreset } );
	};

	return (
		<PreferencesModalSection
			title={ __( 'Add CSS Class', 'css-class-manager' ) }
			description=""
		>
			<ClassForm disabled={ isDisabled } onSubmit={ onSubmitHandler } />
		</PreferencesModalSection>
	);
};

const ClassList = () => {
	const [ isDisabled, setIsDisabled ] = useState< boolean >( false );
	const [ search, setSearch ] = useState< string >( '' );
	const [ myClasses, setMyClasses ] = useState< ClassPreset[] >( [
		...getFilteredClassNames(),
		...getUserDefinedClassNames(),
	] );

	const onSubmitHandler = ( classPreset: ClassPreset ) => {
		setIsDisabled( true );
		// console.log( { existing: classPreset } );
	};

	return (
		<PreferencesModalSection
			title={ __( 'Class List', 'css-class-manager' ) }
			description={ __(
				'These classes will appear in the Additional CSS Class(es) control dropdown.',
				'css-class-manager'
			) }
		>
			<div className="css-class-manager__tab-class-list">
				<SearchControl
					__nextHasNoMarginBottom
					label={ __( 'Search for a block', 'css-class-manager' ) }
					placeholder={ __(
						'Search css class name',
						'css-class-manager'
					) }
					value={ search }
					onChange={ ( nextSearch ) => setSearch( nextSearch ) }
					className="edit-post-block-manager__search"
				/>

				<Panel>
					{ myClasses.map( ( classPreset ) => {
						return (
							<PanelBody
								key={ classPreset.name }
								title={ classPreset.name }
								initialOpen={ false }
							>
								<PanelRow>
									<ClassForm
										classPreset={ classPreset }
										disabled={ isDisabled }
										onSubmit={ onSubmitHandler }
									/>
								</PanelRow>
							</PanelBody>
						);
					} ) }
				</Panel>
			</div>
		</PreferencesModalSection>
	);
};

const tabCssClasses: ModalTab = {
	name: 'css-classes',
	tabLabel: __( 'CSS Classes', 'css-class-manager' ),
	content: (
		<>
			<AddCSSClassForm />
			<ClassList />
		</>
	),
};

export default tabCssClasses;
