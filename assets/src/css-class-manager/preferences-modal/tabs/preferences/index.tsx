import { __ } from '@wordpress/i18n';

import SettingsForm from './settings-form';

import type { ModalTab } from '../../../types';

const tabPreferences: ModalTab = {
	name: 'user-settings',
	tabLabel: __( 'Preferences', 'css-class-manager' ),
	content: (
		<>
			<SettingsForm />
		</>
	),
};

export default tabPreferences;
