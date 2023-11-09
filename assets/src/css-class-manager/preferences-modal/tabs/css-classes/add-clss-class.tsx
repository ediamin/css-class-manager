import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid';

import { STORE_NAME } from '../../../constants';
import store from '../../../store';
import PreferencesModalSection from '../../preferences-modal-section';

import ClassForm from './class-form';

import type { Selectors } from '../../../store';
import type { ClassPreset } from '../../../types';
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

const AddCSSClass = () => {
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

export default AddCSSClass;
