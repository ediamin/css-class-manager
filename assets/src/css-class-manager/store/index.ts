import apiFetch from '@wordpress/api-fetch';
import { createReduxStore, dispatch, select } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid/non-secure';

import { STORE_NAME } from '../constants';

import type { ClassPreset, CombinedClassPreset } from '../types';
import type { SnackbarListProps } from '@wordpress/components/src/snackbar/types';
import type { ActionCreator } from '@wordpress/data/src/types';

type Notices = SnackbarListProps[ 'notices' ];
type RemoveNotice = SnackbarListProps[ 'onRemove' ];

interface State {
	isSavingSettings: boolean;
	filteredClassNames: CombinedClassPreset[];
	userDefinedClassNames: CombinedClassPreset[];
	notices: Notices;
}

export interface Selectors {
	isSavingSettings: ( state: State ) => boolean;
	getCssClassNames: ( state: State ) => CombinedClassPreset[];
	getFilteredClassNames: ( state: State ) => CombinedClassPreset[];
	getUserDefinedClassNames: ( state: State ) => CombinedClassPreset[];
	getNotices: ( state: State ) => Notices;
}

interface ReducerAction extends State {
	type: string;
	notice: Notices[ number ];
	noticeId: string;
}

interface Actions extends Record< string, ActionCreator > {
	createSuccessNotice: ( content: string ) => void;
	createErrorNotice: ( content: string ) => void;
	removeNotice: RemoveNotice;
	startSavingSettings: () => void;
	completedSavingSettings: () => void;
	saveUserDefinedClassNames: (
		classPreset: ClassPreset,
		userDefinedClassNames: CombinedClassPreset[],
		previousClassPreset?: CombinedClassPreset
	) => void;
	deleteUserDefinedClassName: (
		classPreset: CombinedClassPreset,
		userDefinedClassNames: CombinedClassPreset[]
	) => void;
}

const ACTION_TYPE = {
	SAVING_SETTINGS: 'SAVING_SETTINGS',
	SAVE_USER_DEFINED_CLASS_NAMES: 'SAVE_USER_DEFINED_CLASS_NAMES',
	CREATE_NOTICE: 'CREATE_NOTICE',
	REMOVE_NOTICE: 'REMOVE_NOTICE',
	NONE: 'NONE',
};

function withNanoId(
	classPresets: ClassPreset[] | undefined,
	isFilteredClassName: boolean = false
): CombinedClassPreset[] {
	if ( ! classPresets ) {
		return [];
	}

	return classPresets.map( ( classPreset: ClassPreset ) => {
		return {
			...classPreset,
			isFilteredClassName,
			id: nanoid(),
		};
	} );
}

const store = createReduxStore< State, Actions, Selectors >( STORE_NAME, {
	initialState: {
		isSavingSettings: false,
		filteredClassNames: withNanoId(
			// @ts-ignore cssClassManager is a global variable.
			cssClassManager?.filteredClassNames,
			true
		),
		userDefinedClassNames: withNanoId(
			// @ts-ignore cssClassManager is a global variable.
			cssClassManager?.userDefinedClassNames
		),
		notices: [],
	},

	selectors: {
		isSavingSettings( state ) {
			return state.isSavingSettings;
		},

		getFilteredClassNames( state ) {
			return state.filteredClassNames;
		},

		getUserDefinedClassNames( state ) {
			return state.userDefinedClassNames;
		},

		getCssClassNames( state ) {
			return [
				...state.filteredClassNames,
				...state.userDefinedClassNames,
			].sort( ( a, b ) => {
				// Convert names to lowercase for case-insensitive sorting.
				const nameA = a.name.toLowerCase();
				const nameB = b.name.toLowerCase();

				if ( nameA < nameB ) {
					return -1;
				}

				if ( nameA > nameB ) {
					return 1;
				}

				// Names are equal.
				return 0;
			} );
		},

		getNotices( state ) {
			return state.notices;
		},
	},

	reducer( state: State, action: ReducerAction ) {
		switch ( action.type ) {
			case ACTION_TYPE.SAVING_SETTINGS:
				state = {
					...state,
					isSavingSettings: action.isSavingSettings,
				};
				break;

			case ACTION_TYPE.SAVE_USER_DEFINED_CLASS_NAMES:
				state = {
					...state,
					userDefinedClassNames: action.userDefinedClassNames,
				};
				break;

			case ACTION_TYPE.CREATE_NOTICE:
				state = {
					...state,
					notices: [ ...state.notices, action.notice ],
				};
				break;

			case ACTION_TYPE.REMOVE_NOTICE:
				state = {
					...state,
					notices: state.notices.filter(
						( notice ) => notice.id !== action.noticeId
					),
				};
				break;

			default:
				break;
		}

		return state;
	},

	actions: {
		createSuccessNotice( content ) {
			return {
				type: ACTION_TYPE.CREATE_NOTICE,
				notice: {
					id: nanoid(),
					content,
					status: 'success',
				},
			};
		},

		createErrorNotice( content ) {
			return {
				type: ACTION_TYPE.CREATE_NOTICE,
				notice: {
					id: nanoid(),
					content,
					status: 'error',
					explicitDismiss: true,
				},
			};
		},

		removeNotice( id ) {
			return {
				type: ACTION_TYPE.REMOVE_NOTICE,
				noticeId: id,
			};
		},

		startSavingSettings() {
			return {
				type: ACTION_TYPE.SAVING_SETTINGS,
				isSavingSettings: true,
			};
		},

		completedSavingSettings() {
			return {
				type: ACTION_TYPE.SAVING_SETTINGS,
				isSavingSettings: false,
			};
		},

		async saveUserDefinedClassNames(
			classPreset: ClassPreset,
			userDefinedClassNames: CombinedClassPreset[],
			previousClassPreset?: CombinedClassPreset
		) {
			let updatedClassNames: CombinedClassPreset[] = [];
			const actions = dispatch( STORE_NAME ) as Actions;

			if ( previousClassPreset ) {
				updatedClassNames = userDefinedClassNames.map(
					( item: CombinedClassPreset ) => {
						if ( item.name === previousClassPreset.name ) {
							return {
								...classPreset,
								id: previousClassPreset.id,
							};
						}

						return item;
					}
				);
			} else {
				updatedClassNames = [
					...userDefinedClassNames,
					{
						...classPreset,
						id: nanoid(),
					},
				];
			}

			const filteredClassNames: CombinedClassPreset[] =
				select( STORE_NAME ).getFilteredClassNames();

			const uniqueClassNames: Record< string, boolean > =
				filteredClassNames.reduce< Record< string, boolean > >(
					function ( acc, item ) {
						acc[ item.name ] = true;
						return acc;
					},
					{}
				);

			// Upload non-empty and unique class names.
			updatedClassNames = updatedClassNames.filter(
				( { name, isFilteredClassName } ) => {
					if ( ! name ) {
						return false;
					}

					// Do not include the classes added using PHP filter.
					if ( isFilteredClassName ) {
						return false;
					}

					if ( uniqueClassNames[ name ] ) {
						return false;
					}

					uniqueClassNames[ name ] = true;

					return true;
				}
			);

			try {
				await apiFetch( {
					path: '/wp/v2/settings',
					method: 'post',
					data: {
						css_class_manager_class_names: updatedClassNames.map(
							( { name, description } ) => ( {
								name,
								description,
							} )
						),
					},
				} );

				let noticeContent;

				if ( classPreset.name ) {
					noticeContent = sprintf(
						// translators: %s: Class name.
						__( 'Added class: %s', 'css-class-manager' ),
						classPreset.name
					);
				}

				if ( previousClassPreset ) {
					noticeContent = sprintf(
						// translators: %s: Class name.
						__( 'Updated class: %s', 'css-class-manager' ),
						classPreset.name
					);
				}

				if ( noticeContent ) {
					actions.createSuccessNotice( noticeContent );
				}

				return {
					type: ACTION_TYPE.SAVE_USER_DEFINED_CLASS_NAMES,
					userDefinedClassNames: updatedClassNames,
				};
			} catch ( error: unknown ) {
				// @ts-ignore Not sure how to handle the unknown type here.
				if ( error?.message ) {
					// @ts-ignore Related to the above.
					actions.createErrorNotice( error.message );
				}

				return {
					type: ACTION_TYPE.NONE,
				};
			}
		},

		async deleteUserDefinedClassName(
			classPreset: CombinedClassPreset,
			userDefinedClassNames: CombinedClassPreset[]
		) {
			const actions = dispatch( STORE_NAME ) as Actions;
			const updatedClassNames = userDefinedClassNames.filter(
				( item ) => {
					return item.name !== classPreset.name;
				}
			);

			try {
				await apiFetch( {
					path: '/wp/v2/settings',
					method: 'post',
					data: {
						css_class_manager_class_names: updatedClassNames.map(
							( { name, description } ) => ( {
								name,
								description,
							} )
						),
					},
				} );

				const noticeContent = sprintf(
					// translators: %s: Class name.
					__( 'Deleted class: %s', 'css-class-manager' ),
					classPreset.name
				);

				actions.createSuccessNotice( noticeContent );

				return {
					type: ACTION_TYPE.SAVE_USER_DEFINED_CLASS_NAMES,
					userDefinedClassNames: updatedClassNames,
				};
			} catch ( error: unknown ) {
				// @ts-ignore Not sure how to handle the unknown type here.
				if ( error?.message ) {
					// @ts-ignore Related to the above.
					actions.createErrorNotice( error.message );
				}

				return {
					type: ACTION_TYPE.NONE,
				};
			}
		},
	},
} );

export default store;
