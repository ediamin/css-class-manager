import { PluginMoreMenuItem } from '@wordpress/edit-post';
import { __ } from '@wordpress/i18n';
import { settings } from '@wordpress/icons';
import { registerPlugin } from '@wordpress/plugins';

registerPlugin( 'css-class-manager-preference-menu-item', {
	render() {
		return (
			<PluginMoreMenuItem icon={ settings } onClick={ () => {} }>
				{ __( 'CSS Class Manager', 'css-class-manager' ) }
			</PluginMoreMenuItem>
		);
	},
} );
