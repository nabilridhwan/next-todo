import { IconX } from '@tabler/icons';
import React from 'react';

export const ToastManagerContext = React.createContext();

const ALL_TYPES = [
	'alert-info',
	'alert-success',
	'alert-warning',
	'alert-error',
];

export function ToastManagerProvider({ children }) {
	const [currentToast, setCurrentToast] = React.useState();

	const showToast = ({ message, type }) => {
		if (ALL_TYPES.includes(type) === false) {
			type = 'alert-info';
		}

		setCurrentToast({ message, type });

		setTimeout(() => {
			removeToast();
		}, 8000);
	};

	const removeToast = () => {
		setCurrentToast();
	};

	return (
		<ToastManagerContext.Provider value={{ showToast, removeToast }}>
			{children}

			{currentToast && (
				<div className="toast toast-top toast-end">
					<div className={`alert ${currentToast.type} shadow-lg`}>
						<div>
							<span>{currentToast.message}</span>
						</div>

						{/* Close button */}
						<div className="flex-none">
							<button
								onClick={removeToast}
								className="btn btn-sm btn-square btn-ghost"
							>
								<IconX size={18} />
							</button>
						</div>
					</div>
				</div>
			)}
		</ToastManagerContext.Provider>
	);
}
