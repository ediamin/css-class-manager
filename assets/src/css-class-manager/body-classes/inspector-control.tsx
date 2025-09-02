import { ToggleControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

import SelectControl from '../select-control';

interface InspectorControlProps {
	bodyClasses: string;
	useInPostLoop: boolean;
	postType: string;
	postTypeLabel: string;
	onChangeHandler: ( newValue: string | undefined ) => void;
	onUseInPostLoopChangeHandler: () => void;
}

const UNSUPPORTED_USE_IN_POST_LOOP = [ 'page' ];

const InspectorControl = ( {
	bodyClasses,
	useInPostLoop,
	postType,
	postTypeLabel,
	onChangeHandler,
	onUseInPostLoopChangeHandler,
}: InspectorControlProps ) => {
	return (
		<SelectControl
			className={ bodyClasses }
			isSaving={ false }
			onChange={ onChangeHandler }
		>
			<p className="css-class-manager__inspector-control__help-text">
				{ sprintf(
					/* translators: %s: post type name */
					__(
						'CSS <body> class names for the current %s. Select one or more class names from the dropdown by clicking on the options.',
						'css-class-manager'
					),
					postTypeLabel
				) }
			</p>
			{ ! UNSUPPORTED_USE_IN_POST_LOOP.includes( postType ) && (
				<ToggleControl
					className="css-class-manager__inspector-control__use-in-post-loop"
					checked={ useInPostLoop }
					label={ __(
						'Use in a post or query loop',
						'css-class-manager'
					) }
					help={ __(
						'If enabled, the selected class names will be added to the post in a post loop using the post_class filter.',
						'css-class-manager'
					) }
					onChange={ onUseInPostLoopChangeHandler }
				/>
			) }
		</SelectControl>
	);
};

export default InspectorControl;
