import { IconPlus } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import Todo from '../components/Todo';
import { getAllTodos } from '../frontend_api/getAllTodos';

export default function Home() {
	const {
		data: todos,
		status,
		isLoading,
		refetch,
		error,
		isRefetching,
	} = useQuery(['getAllTodos'], () => getAllTodos());

	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (status === 'error') {
			if (error instanceof AxiosError) {
				const {
					data: { data },
				} = error.response;
				setErrorMessage(data);
			}
		}
	}, [status, error]);

	return (
		<div>
			<Head>
				<title>Todo Application</title>
				<meta
					name="description"
					content="An application to manage your todos"
				/>
				{/* <link rel="icon" href="/favicon.ico" /> */}

				<link
					href="data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAm/eANTU1AAAAMcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzMzMzAAAAADMzMzMAAAAzMxERMzMAADMzEREzMwAAMxERIhEzMwAzEREiETMzADMzEREiETMAMzMRESIRMwAAMzMzEREzAAAzMzMRETMzAAAAMxEzMzMAAAAzETMzAAAzADMzMwAAADMAMzMzAAAzADMzAAAAADMAMzMAAADwDwAA8A8AAMADAADAAwAAwAAAAMAAAADAAAAAwAAAAPAAAADwAAAAPwAAAD8AAADzAwAA8wMAAMw/AADMPwAA"
					rel="icon"
					type="image/x-icon"
				/>
			</Head>

			<main>
				<header className="my-10">
					<h1>Next Todo Application</h1>

					<p>
						An application that quickly showcases the basic features
						of Next.js along with Cypress testing
					</p>
				</header>

				<div className="flex gap-2 justify-end mt-5">
					<button
						className={`btn ${
							isRefetching || isLoading ? 'loading' : ''
						}`}
						data-cy="refresh_todos_button"
						onClick={refetch}
					>
						Refresh
					</button>

					<Link href="/todo/add" passHref>
						<button
							className="btn btn-primary flex flex-row gap-1"
							data-cy="add_todo_button"
						>
							<IconPlus size={16} />
							Add
						</button>
					</Link>
				</div>

				{/* Error alert box */}
				{errorMessage && (
					<ErrorAlert
						data-cy="todo_error"
						errorMessage={errorMessage}
					/>
				)}

				{status === 'success' && (
					<div data-cy="todo_list">
						{todos.map((todo, index) => (
							<Todo key={todo.id} {...todo} />
						))}
					</div>
				)}

				{status === 'success' && todos.length === 0 && (
					<div className="flex my-48 justify-center items-center text-center">
						<div className="text-white/50">
							No todos found :(
							<br />
							Click the &quot;Add&quot; button to add a new todo
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
