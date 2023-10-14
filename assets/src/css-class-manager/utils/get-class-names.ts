import getClassNamesFromPresets from './get-class-names-from-preset';
import getFilteredClassNames from './get-filtered-class-names';
import getUserDefinedClassNames from './get-user-defined-class-names';

function getClassNames( attributeClassName: string | undefined ): string[] {
	const classNames = attributeClassName?.split( ' ' ) ?? [];

	return classNames
		.concat( getClassNamesFromPresets( getUserDefinedClassNames() ) )
		.concat( getClassNamesFromPresets( getFilteredClassNames() ) )
		.sort();
}

export default getClassNames;
