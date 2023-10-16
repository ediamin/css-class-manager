import {
	Panel,
	PanelBody,
	PanelRow,
	SearchControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { STORE_NAME } from '../constants';
import store from '../store';

import ClassForm from './class-form';
import PreferencesModalSection from './preferences-modal-section';

import type { Selectors } from '../store';
import type { ClassPreset, CombinedClassPreset, ModalTab } from '../types';
import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

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
	const [ search, setSearch ] = useState< string >( '' );

	const { cssClassNames, isSavingSettings } = useSelect< MapSelect >(
		( select ) => {
			const dataStore = select< SelectFunctionParam >(
				STORE_NAME as any
			);

			return {
				cssClassNames: dataStore.getCssClassNames(),
				isSavingSettings: dataStore.isSavingSettings(),
			};
		},
		[]
	);

	const { startSavingSettings } = useDispatch( store );

	const onSubmitHandler = ( classPreset: ClassPreset ) => {
		startSavingSettings();
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
					{ cssClassNames.map(
						( classPreset: CombinedClassPreset ) => {
							return (
								<PanelBody
									key={ classPreset.name }
									title={ classPreset.name }
									initialOpen={ false }
								>
									<PanelRow>
										<ClassForm
											classPreset={ classPreset }
											disabled={ isSavingSettings }
											onSubmit={ onSubmitHandler }
										/>
									</PanelRow>
								</PanelBody>
							);
						}
					) }
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
