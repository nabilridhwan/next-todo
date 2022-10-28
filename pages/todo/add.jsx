import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ErrorAlert from '../../components/ErrorAlert';
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

			const finalObj = {
				name,
				desc,
				due_date,
			};

			if (!due_date) {
				finalObj.due_date = null;
			}

			await addTodoMutate(finalObj);

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
				<ErrorAlert
					data-cy="add_todo_error"
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
						data-cy="task_name_add_todo_field"
						placeholder="Task name"
						className="input input-bordered w-full"
					/>
				</div>

				<div className="form-control">
					<span className="label-text">Task Description</span>

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
					<span className="label-text">Due Date</span>
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
