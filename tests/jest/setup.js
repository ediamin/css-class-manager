/**
 * Jest global setup: provides a minimal cssClassManager window global so that
 * the store module can initialise without the WordPress runtime being present.
 */

const defaultUserSettings = {
	inspectorControlPosition: 'default',
	hideThemeJSONGeneratedClasses: false,
	allowAddingClassNamesWithoutCreating: false,
};

global.cssClassManager = {
	filteredClassNames: [],
	userDefinedClassNames: [],
	userSettings: defaultUserSettings,
	panelLabel: 'CSS Classes',
	bodyClasses: {
		supportedPostTypes: [ 'post', 'page' ],
	},
	hooks: null,
};
