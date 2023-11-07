import { useState } from '@wordpress/element';

function useStates< T >(
	initialStates: T
): [ T, ( updatedState: Partial< T > ) => void ] {
	const [ states, setStates ] = useState< T >( initialStates );

	const setState = ( updatedState: Partial< T > ) => {
		setStates( ( nextState ) => ( {
			...nextState,
			...updatedState,
		} ) );
	};

	return [ states, setState ];
}

export default useStates;
