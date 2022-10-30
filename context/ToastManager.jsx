import React, { useEffect } from "react";
import { v4 as uuid } from "uuid";
import Toast from "../components/Toast";

export const ToastManagerContext = React.createContext();

const ALL_TOAST_TYPES = [
	"alert-info",
	"alert-success",
	"alert-warning",
	"alert-error",
];

export function ToastManagerProvider({ children }) {
	const [toasts, setToasts] = React.useState([]);

	// ID of the current toast that will be removed
	const [removing, setRemoving] = React.useState("");

	// Add toast
	const addToast = ({ message, type }) => {
		// If the toast type is not valid, default to alert-info
		if (!ALL_TOAST_TYPES.includes(type)) {
			type = "alert-info";
		}

		// Add a toast
		setToasts((toasts) => [...toasts, { message, type, id: uuid() }]);
	};

	// Remove toast
	const removeToast = (id) => {
		setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
	};

	// Remove toast after 5 seconds
	useEffect(() => {
		// If there is a previous toast
		if (toasts.length > 1) {
			// Remove the second last one (the one that was added before the last one)
			setRemoving(toasts[toasts.length - 2].id);
		}

		if (toasts.length > 0) {
			// Remove the last toast after 5 seconds
			setTimeout(() => {
				setRemoving(toasts[toasts.length - 1].id);
			}, 5000);
		}
	}, [toasts]);

	// View video on why we have different useEffect: https://youtu.be/kkA_iMkSJDk?t=3700
	useEffect(() => {
		if (removing) {
			removeToast(removing);
		}
	}, [removing]);

	return (
		<ToastManagerContext.Provider
			value={{ showToast: addToast, removeToast }}
		>
			{children}

			{toasts &&
				toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						id={toast.id}
						removeToast={removeToast}
					/>
				))}
		</ToastManagerContext.Provider>
	);
}
