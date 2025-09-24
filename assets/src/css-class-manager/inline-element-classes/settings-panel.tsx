import { Panel, PanelBody } from '@wordpress/components';
import { _x } from '@wordpress/i18n';

import SelectControl from '../select-control';

import type { FC } from 'react';

interface SettingsPanelProps {
	classNames: string;
	onChangeHandler: ( newValue: string | undefined ) => void;
}

const SettingsPanel: FC< SettingsPanelProps > = ( {
	classNames,
	onChangeHandler,
} ) => {
	return (
		<Panel
			header={ _x(
				'Add CSS Classes',
				'panel header',
				'css-class-manager'
			) }
			className="css-class-manager__inline-element-classes__settings-panel"
		>
			<PanelBody opened={ true }>
				<SelectControl
					className={ classNames }
					onChange={ onChangeHandler }
					isSaving={ false }
				/>
			</PanelBody>
		</Panel>
	);
};

export default SettingsPanel;
