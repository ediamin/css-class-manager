import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo } from '@wordpress/element';

import { STORE_NAME } from '../constants';
import store from '../store';

import type { Selectors } from '../store';
import type { UserSettings } from '../types';
import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

interface UseSelectReturn {
	cssClassNames: ReturnType< Selectors[ 'getCssClassNames' ] >;
	isSavingSettings: ReturnType< Selectors[ 'isSavingSettings' ] >;
	userDefinedClassNames: ReturnType<
		Selectors[ 'getUserDefinedClassNames' ]
	>;
	notices: ReturnType< Selectors[ 'getNotices' ] >;
	userSettings: UserSettings;
	panelLabel: string;
}

function useStore() {
	const {
		createSuccessNotice,
		createErrorNotice,
		removeNotice,
		startSavingSettings,
		completedSavingSettings,
		saveUserDefinedClassNames,
		deleteUserDefinedClassName,
		updateUserSettings,
	} = useDispatch( store );

	const {
		cssClassNames,
		userDefinedClassNames,
		isSavingSettings,
		notices,
		userSettings,
		panelLabel,
	}: UseSelectReturn = useSelect< MapSelect >( ( select ) => {
		const dataStore = select< SelectFunctionParam >( STORE_NAME as any );
		return {
			userDefinedClassNames: dataStore.getUserDefinedClassNames(),
			cssClassNames: dataStore.getCssClassNames(),
			isSavingSettings: dataStore.isSavingSettings(),
			notices: dataStore.getNotices(),
			userSettings: dataStore.getUserSettings(),
			panelLabel: dataStore.getPanelLabel(),
		};
	}, [] );

	const cssUniqueClassNames = useMemo( () => {
		const uniqueClasses: Record< string, boolean > = {};

		if ( cssClassNames && Array.isArray( cssClassNames ) ) {
			cssClassNames.forEach( ( item ) => {
				uniqueClasses[ item.name ] = true;
			} );
		}

		return uniqueClasses;
	}, [ cssClassNames ] );

	return {
		cssClassNames,
		cssUniqueClassNames,
		userDefinedClassNames,
		isSavingSettings,
		notices,
		userSettings,
		panelLabel,
		createSuccessNotice,
		createErrorNotice,
		removeNotice,
		startSavingSettings,
		completedSavingSettings,
		saveUserDefinedClassNames,
		deleteUserDefinedClassName,
		updateUserSettings,
	};
}

export default useStore;
