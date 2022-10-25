import { IconPlus } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
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
				<h1>Next Todo Application</h1>

				<p>
					An application that quickly showcases the basic features of
					Next.js along with Cypress testing
				</p>

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

				{/* Overlay if the todos are being refetched or is loading */}
				{/* <LoadingOverlay
					overlayOpacity={0.2}
					overlayColor="black"
					loaderProps={{ color: 'white' }}
					visible={isRefetching || isLoading}
					zIndex={5}
				/> */}

				{status === 'error' && error && (
					<div className="alert shadow-lg">
						{JSON.stringify(error)}
					</div>
				)}

				{/* {isLoading && (
					<Center>
						<Loader />
					</Center>
				)} */}

				{status === 'success' && (
					<div data-cy="todo_list">
						{todos.map((todo, index) => (
							<Todo key={todo.id} {...todo} />
						))}
					</div>
				)}
			</main>
		</div>
	);
}
