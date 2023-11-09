import {
	Panel,
	PanelBody,
	PanelRow,
	SearchControl,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid';

import { STORE_NAME } from '../../../constants';
import store from '../../../store';
import PreferencesModalSection from '../../preferences-modal-section';

import ClassForm from './class-form';

import type { Selectors } from '../../../store';
import type { ClassPreset, CombinedClassPreset } from '../../../types';
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

const ClassList = () => {
	const [ search, setSearch ] = useState< string >( '' );

	const {
		saveUserDefinedClassNames,
		deleteUserDefinedClassName,
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

	const filteredClassList = useMemo( () => {
		return cssClassNames.filter( ( classItem ) => {
			if ( ! search.trim() ) {
				return true;
			}

			return (
				classItem.name.includes( search ) ||
				classItem.description?.includes( search )
			);
		} );
	}, [ cssClassNames, search ] );

	// Searching for items causes sudden height-shrinking jerks.
	// Setting a minimum height for the container can fix this issue.
	const listMinHeight = useMemo( () => {
		const HEIGHT_PER_ITEM = 50;
		return `${ cssClassNames.length * HEIGHT_PER_ITEM }px`;
	}, [ cssClassNames ] );

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

	const onDeleteHandler = async (
		classPreset: CombinedClassPreset | undefined
	) => {
		if ( ! classPreset ) {
			return;
		}

		startSavingSettings();
		await deleteUserDefinedClassName( classPreset, userDefinedClassNames );
		await completedSavingSettings();
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

				<div style={ { minHeight: listMinHeight } }>
					<Panel>
						{ filteredClassList.map(
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
												onDelete={ onDeleteHandler }
											/>
										</PanelRow>
									</PanelBody>
								);
							}
						) }
					</Panel>
				</div>
			</div>
		</PreferencesModalSection>
	);
};

export default ClassList;
