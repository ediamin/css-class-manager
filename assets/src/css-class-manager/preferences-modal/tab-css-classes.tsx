import {
	Panel,
	PanelBody,
	PanelRow,
	SearchControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid';

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
import type { RefObject } from 'react';

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

interface UseSelectReturn {
	cssClassNames: ReturnType< Selectors[ 'getCssClassNames' ] >;
	isSavingSettings: ReturnType< Selectors[ 'isSavingSettings' ] >;
	userDefinedClassNames: ReturnType<
		Selectors[ 'getUserDefinedClassNames' ]
	>;
}

const AddCSSClassForm = () => {
	const {
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useDispatch( store );

	const { userDefinedClassNames, isSavingSettings }: UseSelectReturn =
		useSelect< MapSelect >( ( select ) => {
			const dataStore = select< SelectFunctionParam >(
				STORE_NAME as any
			);
			return {
				userDefinedClassNames: dataStore.getUserDefinedClassNames(),
				isSavingSettings: dataStore.isSavingSettings(),
			};
		}, [] );

	const onSubmitHandler = async (
		newClassPreset: ClassPreset,
		inputRef: RefObject< HTMLInputElement >
	) => {
		if ( ! newClassPreset.name.trim() ) {
			createErrorNotice(
				__( 'Class Name cannot be empty', 'css-class-manager' )
			);

			inputRef.current?.focus();
			return;
		}

		startSavingSettings();
		await saveUserDefinedClassNames(
			newClassPreset,
			userDefinedClassNames
		);
		await completedSavingSettings();

		inputRef.current?.focus();
	};

	return (
		<PreferencesModalSection
			title={ __( 'Add CSS Class', 'css-class-manager' ) }
			description=""
		>
			<ClassForm
				disabled={ isSavingSettings }
				onSubmit={ onSubmitHandler }
			/>
		</PreferencesModalSection>
	);
};

const ClassList = () => {
	const [ search, setSearch ] = useState< string >( '' );

	const {
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useDispatch( store );

	const {
		cssClassNames,
		userDefinedClassNames,
		isSavingSettings,
	}: UseSelectReturn = useSelect< MapSelect >( ( select ) => {
		const dataStore = select< SelectFunctionParam >( STORE_NAME as any );
		return {
			userDefinedClassNames: dataStore.getUserDefinedClassNames(),
			cssClassNames: dataStore.getCssClassNames(),
			isSavingSettings: dataStore.isSavingSettings(),
		};
	}, [] );

	const onSubmitHandler = ( previousClassPreset: CombinedClassPreset ) => {
		return async (
			newClassPreset: ClassPreset,
			inputRef: RefObject< HTMLInputElement >
		) => {
			if ( ! newClassPreset.name.trim() ) {
				createErrorNotice(
					__( 'Class Name cannot be empty', 'css-class-manager' )
				);

				inputRef.current?.focus();
				return;
			}

			startSavingSettings();
			await saveUserDefinedClassNames(
				newClassPreset,
				userDefinedClassNames,
				previousClassPreset
			);
			await completedSavingSettings();

			inputRef.current?.focus();
		};
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
									key={ classPreset.id }
									title={ classPreset.name }
									initialOpen={ false }
								>
									<PanelRow>
										<ClassForm
											classPreset={ classPreset }
											disabled={ isSavingSettings }
											onSubmit={ onSubmitHandler(
												classPreset
											) }
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
