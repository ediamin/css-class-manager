import { useEffect } from '@wordpress/element';

import { useStore } from '../hooks';

const Control = () => {
	const { panelLabel } = useStore();

	useEffect( () => {
		// Hide the default CSS class name control.
		const labels = Array.from(
			document.querySelectorAll( '.components-base-control__label' )
		).filter( ( label ) => label.textContent === panelLabel );

		if ( ! labels.length ) {
			return;
		}

		labels[ 0 ]?.parentElement?.parentElement?.classList.add( 'hidden' );
	}, [ panelLabel ] );

	return <></>;
};

export default Control;
