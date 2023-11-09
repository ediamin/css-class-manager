import { Button, RadioControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { STORE_NAME } from '../../../../constants';
import useStates from '../../../../hooks/use-states';
import downloadJSON from '../../../../utils/download-json';

import type { Selectors } from '../../../../store';
import type { ClassPreset } from '../../../../types';
import type {
	MapSelect,
	ReduxStoreConfig,
	StoreDescriptor,
} from '@wordpress/data/src/types';

type ExportType = 'both' | 'userDefinedOnly' | 'filteredClassOnly';

interface ExportTypeOption {
	label: string;
	value: ExportType;
}

interface States {
	exportType: ExportType;
}

interface SelectFunctionParam
	extends StoreDescriptor< ReduxStoreConfig< any, any, Selectors > > {}

interface UseSelectReturn {
	cssClassNames: ReturnType< Selectors[ 'getCssClassNames' ] >;
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

	const { cssClassNames }: UseSelectReturn = useSelect< MapSelect >(
		( select ) => {
			const dataStore = select< SelectFunctionParam >(
				STORE_NAME as any
			);
			return {
				cssClassNames: dataStore.getCssClassNames(),
			};
		},
		[]
	);

	const setExportType = ( value: string ) => {
		setState( { exportType: value as ExportType } );
	};

	const exportList = () => {
		const classList: ClassPreset[] = cssClassNames
			.filter( ( cssClass ) => {
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
