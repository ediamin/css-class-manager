import { Button, RadioControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { useStates, useStore } from '../../../hooks';
import downloadJSON from '../../../utils/download-json';

import type { ClassPreset } from '../../../types';

type ExportType = 'both' | 'userDefinedOnly' | 'filteredClassOnly';

interface ExportTypeOption {
	label: string;
	value: ExportType;
}

interface States {
	exportType: ExportType;
}

const exportTypeOptions: ExportTypeOption[] = [
	{
		label: __(
			'Both User defined and filtered classes',
			'css-class-manager'
		),
		value: 'both',
	},
	{
		label: __( 'User defined classes only', 'css-class-manager' ),
		value: 'userDefinedOnly',
	},
	{
		label: __( 'Filtered classes only', 'css-class-manager' ),
		value: 'filteredClassOnly',
	},
];

const Export = () => {
	const [ states, setState ] = useStates< States >( {
		exportType: 'both',
	} );

	const { cssClassNames } = useStore();

	const setExportType = ( value: string ) => {
		setState( { exportType: value as ExportType } );
	};

	const exportList = () => {
		const classList: ClassPreset[] = cssClassNames
			.filter( ( cssClass ) => {
				if ( cssClass.isDynamic ) {
					return false;
				}

				switch ( states.exportType ) {
					case 'userDefinedOnly':
						return ! cssClass.isFilteredClassName;

					case 'filteredClassOnly':
						return cssClass.isFilteredClassName;

					case 'both':
					default:
						return true;
				}
			} )
			.map( ( cssClass ) => {
				return {
					name: cssClass.name,
					description: cssClass.description,
				};
			} );

		downloadJSON( classList, 'class-list.json' );
	};

	return (
		<>
			<RadioControl
				className="ccm-radio-control"
				label={ __( 'Class List Type', 'css-class-manager' ) }
				hideLabelFromVision
				onChange={ setExportType }
				options={ exportTypeOptions }
				selected={ states.exportType }
			/>
			<p>
				<Button variant="primary" onClick={ exportList }>
					{ __( 'Export', 'css-class-manager' ) }
				</Button>
			</p>
		</>
	);
};

export default Export;
