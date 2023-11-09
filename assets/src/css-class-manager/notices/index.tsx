import { SnackbarList } from '@wordpress/components';
import { createPortal } from '@wordpress/element';

import { useStore } from '../hooks';

const SnackbarListNotice = () => {
	const { notices, removeNotice } = useStore();

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
