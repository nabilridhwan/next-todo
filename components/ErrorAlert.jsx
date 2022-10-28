export default function ErrorAlert({ errorMessage }) {
	// TODO: Check if errorMessage is array or JSON or string

	return (
		<div
			className="alert alert-error"
			title="An error occurred"
			data-cy="add_todo_error"
		>
			<div>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="stroke-current flex-shrink-0 h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span></span>

				{/* TODO: Make a proper error message */}
				{JSON.stringify(errorMessage)}
			</div>
		</div>
	);
}
