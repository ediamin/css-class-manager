import { __ } from '@wordpress/i18n';

import { useStore } from '../../../hooks';
import PreferencesModalSection from '../../preferences-modal-section';

import ClassForm from './class-form';

import type { ClassPreset } from '../../../types';
import type { RefObject } from 'react';

const AddCSSClass = () => {
	const {
		userDefinedClassNames,
		isSavingSettings,
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useStore();

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
