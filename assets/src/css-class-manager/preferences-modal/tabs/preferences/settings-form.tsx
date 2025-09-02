import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useStore } from '../../../hooks';
import PreferencesModalSection from '../../preferences-modal-section';

import type { UserSettings } from '../../../types';

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

			<ToggleControl
				__nextHasNoMarginBottom
				checked={ userSettings.hideThemeJSONGeneratedClasses }
				label={ __(
					'Hide theme.json generated classes.',
					'css-class-manager'
				) }
				help={ __(
					'This will hide the automatically generated CSS classes from theme.json files. Please refresh your browser if you change this setting.',
					'css-class-manager'
				) }
				onChange={ ( isChecked ) =>
					isChecked
						? updateSettings(
								'hideThemeJSONGeneratedClasses',
								true
						  )
						: updateSettings(
								'hideThemeJSONGeneratedClasses',
								false
						  )
				}
			/>
		</PreferencesModalSection>
	);
};

export default SettingsForm;
