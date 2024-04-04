/* eslint-disable */
// @ts-nocheck
// Source: https://github.com/WordPress/gutenberg/blob/235a9da5f3e07fbe554dd34e79b044d353684c2b/packages/interface/src/components/preferences-modal-section/index.js
// Note: Since @wordpress/interface is bundled we cannot use this component directly.

const Section = ( { description, title, children } ) => (
	<fieldset className="preferences-modal__section">
		<legend className="preferences-modal__section-legend">
			<h2 className="preferences-modal__section-title">
				{ title }
			</h2>
			{ description && (
				<p className="preferences-modal__section-description">
					{ description }
				</p>
			) }
		</legend>
		{ children }
	</fieldset>
);

export default Section;
