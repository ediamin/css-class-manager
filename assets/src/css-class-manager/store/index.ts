import { createReduxStore } from '@wordpress/data';

import { STORE_NAME } from '../constants';

import type { ClassPreset, CombinedClassPreset } from '../types';
import type { ActionCreator } from '@wordpress/data/src/types';

interface State {
	isSavingSettings: boolean;
	filteredClassNames: ClassPreset[];
	userDefinedClassNames: ClassPreset[];
}

interface Actions extends Record< string, ActionCreator > {
	startSavingSettings: () => void;
	createCssClassName: ( classPreset: ClassPreset ) => void;
	updateCssClassName: (
		previousClassPreset: ClassPreset,
		newClassPreset: ClassPreset
	) => void;
}

export interface Selectors {
	isSavingSettings: ( state: State ) => boolean;
	getCssClassNames: ( state: State ) => CombinedClassPreset[];
}

interface ReducerAction extends State {
	type: string;
}

const SAVE_CLASS_NAMES_ACTION_TYPE = 'SAVE_USER_DEFINED_CLASS_NAMES';
const SAVING_SETTINGS_ACTION_TYPE = 'SAVING_SETTINGS';

const store = createReduxStore< State, Actions, Selectors >( STORE_NAME, {
	initialState: {
		isSavingSettings: false,
		// @ts-ignore cssClassManager is a global variable.
		filteredClassNames: cssClassManager?.filteredClassNames ?? [],
		// @ts-ignore cssClassManager is a global variable.
		userDefinedClassNames: cssClassManager?.userDefinedClassNames ?? [],
	},
	reducer( state: State, action: ReducerAction ) {
		switch ( action.type ) {
			case SAVE_CLASS_NAMES_ACTION_TYPE:
				state = {
					...state,
					userDefinedClassNames: action.userDefinedClassNames,
				};
				break;
			case SAVING_SETTINGS_ACTION_TYPE:
				state = {
					...state,
					isSavingSettings: action.isSavingSettings,
				};
				break;
			default:
				break;
		}

		return state;
	},
	actions: {
		startSavingSettings() {
			return {
				type: SAVING_SETTINGS_ACTION_TYPE,
				isSavingSettings: true,
			};
		},

		completedSavingSettings() {
			return {
				type: SAVING_SETTINGS_ACTION_TYPE,
				isSavingSettings: false,
			};
		},
		createCssClassName( classPreset ) {
			// save user defined class names.
			return {
				type: SAVE_CLASS_NAMES_ACTION_TYPE,
				classNames: [],
			};
		},

		updateCssClassName( previousClassPreset, newClassPreset ) {
			// save user defined class names.
			return {
				type: SAVE_CLASS_NAMES_ACTION_TYPE,
				classNames: [],
			};
		},
	},
	selectors: {
		getCssClassNames( state ) {
			const filteredClassNames = state.filteredClassNames.map(
				( classPreset ) => {
					return {
						...classPreset,
						isFilteredClassName: true,
					};
				}
			);

			return [
				...filteredClassNames,
				...state.userDefinedClassNames,
			].sort( ( a, b ) => {
				// Convert names to lowercase for case-insensitive sorting
				const nameA = a.name.toLowerCase();
				const nameB = b.name.toLowerCase();

				if ( nameA < nameB ) {
					return -1;
				}

				if ( nameA > nameB ) {
					return 1;
				}

				// names are equal
				return 0;
			} );
		},

		isSavingSettings( state ) {
			return state.isSavingSettings;
		},
	},
} );

export default store;
