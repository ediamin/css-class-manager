function downloadJSON(
	arrayOfObjects: any[],
	filename: string = 'data.json'
): void {
	const json = JSON.stringify( arrayOfObjects, null, 2 );
	const blob = new Blob( [ json ], { type: 'application/json' } );
	const url = URL.createObjectURL( blob );

	const a = document.createElement( 'a' );
	a.href = url;
	a.download = filename;

	const event = new MouseEvent( 'click', {
		view: window,
		bubbles: true,
		cancelable: false,
	} );
	a.dispatchEvent( event );

	URL.revokeObjectURL( url );
}

export default downloadJSON;
