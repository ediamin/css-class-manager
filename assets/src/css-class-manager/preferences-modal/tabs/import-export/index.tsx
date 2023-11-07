import { __ } from '@wordpress/i18n';

import PreferencesModalSection from '../../preferences-modal-section';

import Export from './export';
import Import from './import';

import type { ModalTab } from '../../../types';

const tabImportExport: ModalTab = {
	name: 'import-export',
	tabLabel: __( 'Import/Export', 'css-class-manager' ),
	content: (
		<>
			<PreferencesModalSection
				title={ __( 'Import Class List', 'css-class-manager' ) }
				description=""
			>
				<Import />
			</PreferencesModalSection>
			<PreferencesModalSection
				title={ __( 'Export Class List', 'css-class-manager' ) }
				description=""
			>
				<Export />
			</PreferencesModalSection>
		</>
	),
};

export default tabImportExport;
