import { __ } from '@wordpress/i18n';

import AddCSSClass from './add-clss-class';
import ClassList from './class-list';

import type { ModalTab } from '../../../types';

const tabCssClasses: ModalTab = {
	name: 'css-classes',
	tabLabel: __( 'CSS Classes', 'css-class-manager' ),
	content: (
		<>
			<AddCSSClass />
			<ClassList />
		</>
	),
};

export default tabCssClasses;
