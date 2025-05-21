import { __ } from '@wordpress/i18n';

const NoOptionsMessage = () => {
	return <div>{ __( 'No class name found.', 'css-class-manager' ) }</div>;
};

export default NoOptionsMessage;
