import { Button, FormFileUpload } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid/non-secure';

import { STORE_NAME } from '../../../constants';
import store from '../../../store';

import type { Selectors } from '../../../store';
import type { ClassPreset, CombinedClassPreset } from '../../../types';
import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';
import type { FormEvent } from 'react';

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

interface UseSelectReturn {
	cssClassNames: ReturnType< Selectors[ 'getCssClassNames' ] >;
	isSavingSettings: ReturnType< Selectors[ 'isSavingSettings' ] >;
	userDefinedClassNames: ReturnType<
		Selectors[ 'getUserDefinedClassNames' ]
	>;
}

const Import = () => {
	const {
		saveUserDefinedClassNames,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
		createSuccessNotice,
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

	const onFileLoadHandler = async ( event: ProgressEvent< FileReader > ) => {
		const fileData = event.target?.result;

		if ( ! fileData ) {
			return;
		}

		try {
			const parsedData: ClassPreset[] = JSON.parse( fileData as string );

			if ( ! Array.isArray( parsedData ) ) {
				throw new Error(
					__( 'Error: Invalid class list data.', 'css-class-manager' )
				);
			}

			const classList: CombinedClassPreset[] = parsedData
				.filter( ( item ) => item.name )
				.map( ( item ) => {
					return {
						name: item.name,
						description: item.description ?? '',
						id: nanoid(),
					};
				} );

			if ( ! classList.length ) {
				throw new Error(
					__(
						'Error: Your file does not contain any valid class lists.',
						'css-class-manager'
					)
				);
			}

			startSavingSettings();
			await saveUserDefinedClassNames(
				{ name: '' },
				userDefinedClassNames.concat( classList )
			);
			completedSavingSettings();

			createSuccessNotice(
				__( 'Class list imported successfully', 'css-class-manager' )
			);
		} catch ( error: unknown ) {
			// @ts-ignore Not sure how to handle the unknown type here.
			if ( error?.message ) {
				// @ts-ignore Related to the above.
				createErrorNotice( error.message );
			}
		}
	};

	const onChangeFileUploadHandler = (
		event: FormEvent< HTMLInputElement >
	) => {
		if ( ! event?.currentTarget?.files ) {
			return;
		}

		for ( const file of event.currentTarget.files ) {
			const reader = new FileReader();
			reader.onload = onFileLoadHandler;
			reader.readAsText( file );
		}
	};

	return (
		<FormFileUpload
			accept="application/json"
			onChange={ onChangeFileUploadHandler }
			render={ ( { openFileDialog } ) => (
				<Button
					className="ccm-is-big ccm-is-full-width"
					variant="primary"
					onClick={ openFileDialog }
					isBusy={ isSavingSettings }
				>
					{ isSavingSettings
						? __( 'Importing Class List', 'css-class-manager' )
						: __( 'Select JSON File', 'css-class-manager' ) }
				</Button>
			) }
		/>
	);
};

export default Import;
