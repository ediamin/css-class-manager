import { SnackbarList } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { createPortal } from '@wordpress/element';

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
	notices: ReturnType< Selectors[ 'getNotices' ] >;
}

const SnackbarListNotice = () => {
	const { removeNotice } = useDispatch( store );
	const { notices }: UseSelectReturn = useSelect< MapSelect >( ( select ) => {
		const dataStore = select< SelectFunctionParam >( STORE_NAME as any );

		return {
			notices: dataStore.getNotices(),
		};
	}, [] );

	return (
		<SnackbarList
			className="css-class-manager__snackbar-list"
			notices={ notices }
			onRemove={ removeNotice }
		/>
	);
};

const Notices = () => {
	return createPortal( <SnackbarListNotice />, document.body );
};

export default Notices;
