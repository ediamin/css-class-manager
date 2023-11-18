import { useDispatch, useSelect } from '@wordpress/data';

import { STORE_NAME } from '../constants';
import store from '../store';

import type { Selectors } from '../store';
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
	} = useDispatch( store );

	const {
		cssClassNames,
		userDefinedClassNames,
		isSavingSettings,
		notices,
	}: UseSelectReturn = useSelect< MapSelect >( ( select ) => {
		const dataStore = select< SelectFunctionParam >( STORE_NAME as any );
		return {
			userDefinedClassNames: dataStore.getUserDefinedClassNames(),
			cssClassNames: dataStore.getCssClassNames(),
			isSavingSettings: dataStore.isSavingSettings(),
			notices: dataStore.getNotices(),
		};
	}, [] );

	return {
		cssClassNames,
		userDefinedClassNames,
		isSavingSettings,
		notices,
		createSuccessNotice,
		createErrorNotice,
		removeNotice,
		startSavingSettings,
		completedSavingSettings,
		saveUserDefinedClassNames,
		deleteUserDefinedClassName,
	};
}

export default useStore;
