// Import propTypes
import PropTypes from "prop-types";

const Toast = ({ message, type, id, removeToast }) => {
	return (
		<div className={`toast toast-top toast-end`}>
			<div className={`alert ${type} shadow-lg`}>
				<div>
					<span>{message}</span>
				</div>
			</div>
		</div>
	);
};

Toast.propTypes = {
	message: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	removeToast: PropTypes.func.isRequired,
};

export default Toast;
