import {
	Button,
	Flex,
	FlexItem,
	__experimentalInputControl as InputControl,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import type { ClassPreset } from '../types';
import type { FC, FormEventHandler } from 'react';

interface ClassFormProps {
	classPreset?: ClassPreset;
	disabled: boolean;
	onSubmit: ( classPreset: ClassPreset ) => void;
}

interface States extends ClassPreset {
	showConfirmMsg: boolean;
}

const ClassForm: FC< ClassFormProps > = ( {
	classPreset,
	disabled,
	onSubmit,
} ) => {
	const [ states, setStates ] = useState< States >( {
		name: classPreset?.name ?? '',
		description: classPreset?.description ?? '',
		showConfirmMsg: false,
	} );

	const inputRef = useRef< HTMLInputElement >( null );

	const isNewForm = typeof classPreset === 'undefined' ? true : false;

	const toggleConfirmationMsg = () => {
		setStates( {
			...states,
			showConfirmMsg: ! states.showConfirmMsg,
		} );
	};

	const onSubmitHandler: FormEventHandler< HTMLFormElement > = ( event ) => {
		event.preventDefault();
		onSubmit( { name: states.name, description: states.description } );
	};

	useEffect( () => {
		inputRef.current?.focus();
	}, [] );

	return (
		<form
			className="css-class-manager__class-form"
			onSubmit={ onSubmitHandler }
		>
			<fieldset disabled={ disabled }>
				<InputControl
					label={ __( 'Class name', 'css-class-manager' ) }
					__next40pxDefaultSize
					ref={ inputRef }
					value={ states.name }
					onChange={ ( nextValue ) =>
						setStates( {
							...states,
							name: nextValue ?? '',
						} )
					}
				/>

				<InputControl
					label={ __(
						'Description (optional)',
						'css-class-manager'
					) }
					__next40pxDefaultSize
					value={ states.description }
					onChange={ ( nextValue ) =>
						setStates( {
							...states,
							description: nextValue ?? '',
						} )
					}
				/>
				{ ! isNewForm ? (
					<Flex>
						<FlexItem>
							<Button variant="primary" type="submit">
								{ __( 'Update', 'css-class-manager' ) }
							</Button>
						</FlexItem>
						<FlexItem>
							{ ! states.showConfirmMsg ? (
								<Button
									onClick={ () => toggleConfirmationMsg() }
								>
									{ __( 'Delete', 'css-class-manager' ) }
								</Button>
							) : (
								<>
									<Button isDestructive>
										{ __(
											'Confirm Delete',
											'css-class-manager'
										) }
									</Button>
									<Button
										onClick={ () => {
											toggleConfirmationMsg();
											inputRef.current?.focus();
										} }
									>
										{ __( 'Cancel', 'css-class-manager' ) }
									</Button>
								</>
							) }
						</FlexItem>
					</Flex>
				) : (
					<Flex>
						<FlexItem>
							<Button variant="primary" type="submit">
								{ __( 'Add Class', 'css-class-manager' ) }
							</Button>
						</FlexItem>
					</Flex>
				) }
			</fieldset>
		</form>
	);
};

export default ClassForm;
