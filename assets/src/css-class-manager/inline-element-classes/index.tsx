import { RichTextToolbarButton } from '@wordpress/block-editor';
import { Popover } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	applyFormat,
	getActiveFormat,
	removeFormat,
	useAnchor,
} from '@wordpress/rich-text';

import Icon from '../icon';

import SettingsPanel from './settings-panel';

import type { RichTextValue } from '@wordpress/rich-text';
import type { FC } from 'react';

const name = 'css-class-manager/inline-element-classes';
const title = __( 'Add CSS Classes', 'css-class-manager' );

interface ValueWithClassAttribute extends RichTextValue {
	attributes?: {
		class?: string;
	};
}

interface InlineElementClassesProps {
	isActive: boolean;
	onChange: ( newValue: ValueWithClassAttribute ) => void;
	value: ValueWithClassAttribute;
	contentRef: React.RefObject< HTMLElement >;
}

const InlineElementClasses: FC< InlineElementClassesProps > = ( {
	isActive,
	value,
	onChange,
	contentRef,
} ) => {
	const popoverAnchor = useAnchor( {
		editableContentElement: contentRef.current,
		settings: { ...settings, isActive } as any,
	} );

	const [ isPopoverVisible, setIsPopoverVisible ] = useState( false );
	const [ classNames, setClassNames ] = useState< string >( '' );

	// Get the active format and populate the classNames state.
	useEffect( () => {
		if ( isPopoverVisible ) {
			const activeFormat = getActiveFormat(
				value,
				name
			) as unknown as ValueWithClassAttribute;
			const existingClassNames = activeFormat?.attributes?.class || '';
			setClassNames( existingClassNames );
		}
	}, [ isPopoverVisible, value ] );

	const onChangeHandler = ( newValue: string | undefined ) => {
		if ( ! newValue?.trim() ) {
			onChange( removeFormat( value, name ) );
		} else {
			const format = {
				type: name,
				attributes: {
					class: newValue.trim(),
				},
			};
			onChange( applyFormat( value, format ) );
		}
	};

	return (
		<>
			<RichTextToolbarButton
				icon={ Icon }
				title={ title }
				onClick={ () => setIsPopoverVisible( ! isPopoverVisible ) }
				isActive={ isActive }
			/>
			{ isPopoverVisible && (
				<Popover
					className="css-class-manager__inline-element-classes__popover"
					anchor={ popoverAnchor }
					onClose={ () => setIsPopoverVisible( false ) }
					offset={ 10 }
				>
					<SettingsPanel
						classNames={ classNames }
						onChangeHandler={ onChangeHandler }
					/>
				</Popover>
			) }
		</>
	);
};

export const settings = {
	name,
	title,
	tagName: 'span',
	className: 'ccm-inline-class',
	attributes: {
		class: 'class',
	},
	edit: InlineElementClasses,
	interactive: false,
	object: false,
};
