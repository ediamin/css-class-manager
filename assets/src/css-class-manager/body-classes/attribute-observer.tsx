import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { PluginPostStatusInfo, store as editorStore } from '@wordpress/editor';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';

interface HookPayload {
	newClasses: string;
	oldClasses: string;
}

// Constants for configuration
const IFRAME_SELECTOR = 'iframe[name="editor-canvas"]';
const IFRAME_BODY_CLASS = 'block-editor-iframe__body';
const POLLING_INTERVAL = 100;
const MAX_RETRY_ATTEMPTS = 50; // 5 seconds max

// Utility functions.
const parseClasses = ( classes: string ): string[] => {
	return classes?.trim().split( /\s+/ ).filter( Boolean ) || [];
};

const getEditorIframe = (): HTMLIFrameElement | null => {
	return document.querySelector< HTMLIFrameElement >( IFRAME_SELECTOR );
};

const AttributeObserver = () => {
	const [ needToInitialised, setNeedToInitialised ] = useState( true );
	const timeoutRef = useRef< NodeJS.Timeout | null >( null );
	const retryCountRef = useRef( 0 );

	const { postType, editorMode } = useSelect( ( select: any ) => {
		const dataStore = select( editorStore );

		return {
			postType: dataStore.getCurrentPostType(),
			editorMode: dataStore.getEditorMode(),
		};
	}, [] );

	const [ meta ] = useEntityProp( 'postType', postType, 'meta' );
	const metaValue = meta?.css_class_manager_body_classes || '';
	const bodyClasses = parseClasses( metaValue );

	// Clear any pending timeout on unmount
	useEffect( () => {
		return () => {
			if ( timeoutRef.current ) {
				clearTimeout( timeoutRef.current );
			}
		};
	}, [] );

	const setInitialBodyClasses = useCallback( () => {
		// Clear any existing timeout
		if ( timeoutRef.current ) {
			clearTimeout( timeoutRef.current );
		}

		// Check if we've exceeded max retry attempts
		if ( retryCountRef.current >= MAX_RETRY_ATTEMPTS ) {
			setNeedToInitialised( false );
			return;
		}

		timeoutRef.current = setTimeout( () => {
			const iframe = getEditorIframe();

			if ( ! iframe?.contentWindow?.document?.body ) {
				retryCountRef.current++;
				setInitialBodyClasses();
				return;
			}

			const classList = iframe.contentWindow.document.body.classList;

			if ( classList.contains( IFRAME_BODY_CLASS ) ) {
				if ( bodyClasses.length > 0 ) {
					classList.add( ...bodyClasses );
				}

				setNeedToInitialised( false );
				// Reset counter on success.
				retryCountRef.current = 0;
			} else {
				retryCountRef.current++;
				setInitialBodyClasses();
			}
		}, POLLING_INTERVAL );
	}, [ bodyClasses ] );

	// Set the body classes at initial render or editor mode change.
	useEffect( () => {
		if ( editorMode === 'text' ) {
			setNeedToInitialised( true );
			retryCountRef.current = 0;
			return;
		}

		if ( ! needToInitialised ) {
			return;
		}

		setInitialBodyClasses();
	}, [ needToInitialised, editorMode, setInitialBodyClasses ] );

	// Sync body classes from settings panel to editor canvas iframe.
	useEffect( () => {
		const handleBodyClassChange = ( {
			newClasses,
			oldClasses,
		}: HookPayload ) => {
			const iframe = getEditorIframe();

			if ( ! iframe?.contentWindow?.document?.body ) {
				return;
			}

			const iframeBodyClassList =
				iframe.contentWindow.document.body.classList;
			const oldClassArray = parseClasses( oldClasses );
			const newClassArray = parseClasses( newClasses );

			if ( oldClassArray.length > 0 ) {
				iframeBodyClassList.remove( ...oldClassArray );
			}
			if ( newClassArray.length > 0 ) {
				iframeBodyClassList.add( ...newClassArray );
			}
		};

		cssClassManager.hooks.addAction(
			'bodyClasses.settingsPanel.changed',
			'bodyClasses/attributeObserver',
			handleBodyClassChange
		);

		return () => {
			cssClassManager.hooks.removeAction(
				'bodyClasses.settingsPanel.changed',
				'bodyClasses/attributeObserver'
			);
		};
	}, [] ); // Remove metaValue dependency to prevent unnecessary re-registrations

	return (
		<PluginPostStatusInfo>
			<span></span>
		</PluginPostStatusInfo>
	);
};

export default AttributeObserver;
