import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ErrorAlert from '../../../components/ErrorAlert';
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

	const [due_date, setDueDate] = useState(
		todo.due_date
			? new Date(todo.due_date).toISOString().split('T')[0]
			: null
	);
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
				<ErrorAlert
					data-cy="edit_todo_error"
					errorMessage={errorMessage}
				/>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-control">
					<span className="label-text">Task Name</span>
					<input
						type="text"
						label="Task name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						data-cy="task_name_edit_todo_field"
						placeholder="Task name"
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control">
					<span class="label-text">Task Description</span>

					<textarea
						type="text"
						data-cy="description_edit_todo_field"
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
						type="date"
						value={due_date}
						onChange={(e) => setDueDate(e.target.value)}
						data-cy="date_edit_todo_field"
						placeholder="Pick date"
						className="input input-bordered w-full"
						label="Due Date"
					/>
				</div>

				<div className="form-control">
					<div className="flex gap-3">
						<Link href="/">
							<button
								className="btn btn-danger"
								data-cy="cancel_edit_todo_button"
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
							data-cy="submit_edit_todo_button"
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
