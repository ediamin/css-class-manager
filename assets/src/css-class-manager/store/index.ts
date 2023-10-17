import { createReduxStore } from '@wordpress/data';
// @ts-ignore Not sure why it shows the error.
import { nanoid } from 'nanoid';

import { STORE_NAME } from '../constants';

import type { ClassPreset, CombinedClassPreset } from '../types';
import type { ActionCreator } from '@wordpress/data/src/types';

interface State {
	isSavingSettings: boolean;
	filteredClassNames: CombinedClassPreset[];
	userDefinedClassNames: CombinedClassPreset[];
}

interface Actions extends Record< string, ActionCreator > {
	startSavingSettings: () => void;
	completedSavingSettings: () => void;
	saveUserDefinedClassNames: ( classPresets: CombinedClassPreset[] ) => void;
}

export interface Selectors {
	isSavingSettings: ( state: State ) => boolean;
	getCssClassNames: ( state: State ) => CombinedClassPreset[];
	getUserDefinedClassNames: ( state: State ) => CombinedClassPreset[];
}

interface ReducerAction extends State {
	type: string;
}

const ACTION_TYPE = {
	SAVING_SETTINGS: 'SAVING_SETTINGS',
	SAVE_USER_DEFINED_CLASS_NAMES: 'SAVE_USER_DEFINED_CLASS_NAMES',
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

			default:
				break;
		}

		return state;
	},

	actions: {
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

		saveUserDefinedClassNames( classPresets: ClassPreset[] ) {
			return {
				type: ACTION_TYPE.SAVE_USER_DEFINED_CLASS_NAMES,
				userDefinedClassNames: classPresets,
			};
		},
	},

	selectors: {
		isSavingSettings( state ) {
			return state.isSavingSettings;
		},

		getUserDefinedClassNames( state ) {
			return state.userDefinedClassNames;
		},

		getCssClassNames( state ) {
			return [
				...state.filteredClassNames,
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
	},
} );

export default store;
