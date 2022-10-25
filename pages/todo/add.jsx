import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { addTodo } from '../../frontend_api/addTodo';

export default function AddTodo() {
	const {
		data,
		status,
		isLoading,
		error,
		mutateAsync: addTodoMutate,
	} = useMutation(['addTodo'], (data) => addTodo({ ...data }), {
		useErrorBoundary: false,
	});

	const [errorMessage, setErrorMessage] = useState('');
	const [name, setName] = useState('');
	const [desc, setDesc] = useState('');
	const [due_date, setDueDate] = useState('');

	useEffect(() => {
		if (status === 'error') {
			console.log(error);
		}
	}, [status, error]);

	async function handleSubmit(e) {
		try {
			e.preventDefault();
			// console.log(form.values);

			await addTodoMutate({ name, desc, due_date });

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
				<title>Add todo</title>
			</Head>
			<h1>Add Todo</h1>

			{/* Error alert box */}
			{errorMessage && (
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
						{errorMessage.join(', ')}
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
						type="date"
						value={due_date}
						onChange={(e) => setDueDate(e.target.value)}
						data-cy="date_add_todo_field"
						placeholder="Pick date"
						className="input input-bordered w-full"
						label="Due Date"
					/>
				</div>

				{/* <Group position="right" mt="md">
							
						</Group> */}

				<div className="form-control">
					<div className="flex gap-3">
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
							Add
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
