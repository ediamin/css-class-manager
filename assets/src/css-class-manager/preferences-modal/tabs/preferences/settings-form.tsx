import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useStore } from '../../../hooks';
import PreferencesModalSection from '../../preferences-modal-section';

import type { UserSettings } from '../../../store';

const SettingsForm = () => {
	const { userSettings, updateUserSettings } = useStore();

	const updateSettings = (
		key: keyof UserSettings,
		value: UserSettings[ keyof UserSettings ]
	) => {
		updateUserSettings( {
			...userSettings,
			[ key ]: value,
		} );
	};

	return (
		<PreferencesModalSection
			title={ __( 'Preferences', 'css-class-manager' ) }
			description={ __(
				'User-specific settings for the CSS Class Manager plugin.',
				'css-class-manager'
			) }
		>
			<ToggleControl
				__nextHasNoMarginBottom
				checked={
					userSettings.inspectorControlPosition === 'own-panel'
				}
				label={ __(
					'Show the control in its own panel.',
					'css-class-manager'
				) }
				help={ __(
					'This will display the css class input field outside the advanced panel.',
					'css-class-manager'
				) }
				onChange={ ( isChecked ) =>
					isChecked
						? updateSettings(
								'inspectorControlPosition',
								'own-panel'
						  )
						: updateSettings(
								'inspectorControlPosition',
								'default'
						  )
				}
			/>
		</PreferencesModalSection>
	);
};

export default SettingsForm;
