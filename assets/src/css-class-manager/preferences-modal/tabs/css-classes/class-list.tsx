import {
	Panel,
	PanelBody,
	PanelRow,
	SearchControl,
} from '@wordpress/components';
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Fuse from 'fuse.js';

import { useStore } from '../../../hooks';
import PreferencesModalSection from '../../preferences-modal-section';

import ClassForm from './class-form';

import type { ClassPreset, CombinedClassPreset } from '../../../types';
import type { FuseResultMatch } from 'fuse.js';
import type { RefObject } from 'react';

interface FilteredClassList extends CombinedClassPreset {
	matches?: ReadonlyArray< FuseResultMatch >;
}

const ClassList = () => {
	const [ search, setSearch ] = useState< string >( '' );

	const {
		cssClassNames,
		userDefinedClassNames,
		isSavingSettings,
		saveUserDefinedClassNames,
		deleteUserDefinedClassName,
		startSavingSettings,
		completedSavingSettings,
		createErrorNotice,
	} = useStore();

	const filteredClassList: FilteredClassList[] = useMemo( () => {
		if ( ! search.trim() ) {
			return cssClassNames;
		}

		const options = {
			keys: [ 'name', 'description' ],
			includeMatches: true,
			threshold: 0.3,
		};

		const fuse = new Fuse< CombinedClassPreset >( cssClassNames, options );
		const result = fuse.search( search );

		return result.map( ( itemObj ) => ( {
			...itemObj.item,
			matches: itemObj.matches,
		} ) );
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

	if ( filteredClassList.length === 0 && search.length === 0 ) {
		return (
			<PreferencesModalSection
				title={ __( 'Class List', 'css-class-manager' ) }
				description={ '' }
			>
				<p className="css-class-manager__tab-class-list-empty">
					{ __(
						'No classes found. Please add a new class from above form or use "css_class_manager_filtered_class_names" PHP filter.',
						'css-class-manager'
					) }
				</p>
			</PreferencesModalSection>
		);
	}

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
					label={ __( 'Search for a block', 'css-class-manager' ) }
					placeholder={ __(
						'Search css class name',
						'css-class-manager'
					) }
					value={ search }
					onChange={ ( nextSearch ) => setSearch( nextSearch ) }
					className="edit-post-block-manager__search"
				/>

				{ search.length > 0 && filteredClassList.length === 0 ? (
					<p className="css-class-manager__tab-class-list-empty">
						{ __( 'No classes found.', 'css-class-manager' ) }
					</p>
				) : (
					<div style={ { minHeight: listMinHeight } }>
						<Panel>
							{ filteredClassList.map(
								( classPreset: FilteredClassList ) => {
									return (
										<PanelBody
											key={ classPreset.id }
											title={ classPreset.name }
											initialOpen={ false }
										>
											<PanelRow>
												<ClassForm
													classPreset={ classPreset }
													disabled={
														isSavingSettings
													}
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
				) }
			</div>
		</PreferencesModalSection>
	);
};

export default ClassList;
