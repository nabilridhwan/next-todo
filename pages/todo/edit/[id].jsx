import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTodoById } from '../../../frontend_api/getTodoById';
import { updateTodo } from '../../../frontend_api/updateTodo';

export async function getServerSideProps(context) {
	try {
		const { id } = context.params;

		const data = await getTodoById({ id });

		console.log(data);

		if (!data || data.length === 0) {
			throw new Error('No todo found');
		}

		return {
			props: { todo: data[0] }, // will be passed to the page component as props
		};
	} catch (error) {
		return {
			redirect: {
				permanent: false,
				destination: `/`,
			},
		};
	}
}

export default function EditTodo({ todo }) {
	const [name, setName] = useState(todo.name);
	const [desc, setDesc] = useState(todo.desc);

	// TODO: Fix date!
	const [due_date, setDueDate] = useState();

	const [errorMessage, setErrorMessage] = useState('');

	const {
		data,
		status,
		isLoading,
		error,
		mutateAsync: updateTodoMutate,
	} = useMutation(['updateTodo'], (data) => updateTodo({ ...data }), {
		useErrorBoundary: false,
	});

	useEffect(() => {
		if (status === 'error') {
			console.log(error);
		}
	}, [status, error]);

	async function handleSubmit(e) {
		try {
			e.preventDefault();
			await updateTodoMutate({ name, desc, due_date, id: todo.id });

			window.location = '/';
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) {
				const {
					data: { data },
				} = error.response;
				setErrorMessage(data);
			}
		}
	}

	return (
		<div>
			<Head>
				<title>Edit &quot;{todo.name}&quot;</title>
			</Head>
			<h1>Edit Todo</h1>

			{/* Error alert box */}
			{errorMessage && (
				<div
					className="alert"
					title="An error occurred"
					color="red"
					data-cy="add_todo_error"
				>
					<div className="alert alert-error shadow-lg">
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
							{errorMessage.join(', ')}
						</div>
					</div>
				</div>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-control">
					<span class="label-text">Task Name</span>
					<input
						type="text"
						label="Task name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						data-cy="task_name_add_todo_field"
						placeholder="Task name"
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control">
					<span class="label-text">Task Description</span>

					<textarea
						type="text"
						data-cy="description_add_todo_field"
						label="Description"
						value={desc}
						onChange={(e) => setDesc(e.target.value)}
						placeholder="Task description"
						className="textarea textarea-bordered w-full"
					/>
				</div>

				<div className="form-control">
					<span class="label-text">Due Date</span>
					<input
						type={'datetime-local'}
						value={due_date}
						onChange={(e) => setDueDate(e.target.value)}
						data-cy="date_add_todo_field"
						placeholder="Pick date"
						className="input input-bordered w-full"
						label="Due Date"
					/>
				</div>

				<div className="form-control">
					<div className="flex">
						<Link href="/">
							<button
								className="btn btn-danger"
								data-cy="cancel_add_todo_button"
								type="submit"
								component="a"
								color="red"
							>
								Cancel
							</button>
						</Link>
						<button
							className={`btn btn-primary ${
								isLoading ? 'loading' : ''
							}`}
							data-cy="submit_add_todo_button"
							type="submit"
							disabled={isLoading}
						>
							Save
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
