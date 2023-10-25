function sanitizedHtmlClass( classname: string ): string {
	// Strip out any percent-encoded characters.
	let sanitized = classname.replace( /%[a-fA-F0-9][a-fA-F0-9]/g, '' );

	// Limit to A-Z, a-z, 0-9, '_', '-'.
	sanitized = sanitized.replace( /[^A-Za-z0-9_\-]/g, '' );

	return sanitized;
}

export default sanitizedHtmlClass;
