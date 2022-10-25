import { IconArrowLeft, IconPencil, IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import Head from 'next/head';
import Link from 'next/link';
import { deleteTodo } from '../../frontend_api/deleteTodo';
import { getTodoById } from '../../frontend_api/getTodoById';
import { toggleCompletedTodo } from '../../frontend_api/toggleCompletedTodo';

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

export default function EditTodo({
	todo: { id, name, completed, desc, due_date, created_at, updated_at },
}) {
	const queryClient = useQueryClient();

	const {
		mutateAsync: toggleCompletedTodoMutation,
		isLoading: toggleCompletedIsLoading,
	} = useMutation(['toggleCompletedTodo', id], (completed) =>
		toggleCompletedTodo({ id, completed })
	);

	const { mutateAsync: deleteTodoMutation, isLoading: deleteTodoIsLoading } =
		useMutation(['deleteTodo', id], () => deleteTodo({ id }));

	async function handleDelete(event) {
		await deleteTodoMutation();

		await queryClient.invalidateQueries(['getAllTodos']);

		window.location = '/';
	}

	async function handleChecked(event) {
		const { checked } = event.currentTarget;
		console.log(checked);

		await toggleCompletedTodoMutation(checked);
		await queryClient.invalidateQueries(['getAllTodos']);

		window.location.reload();
	}

	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>

			<Link href={`/`} passHref>
				<button
					className="btn"
					component="a"
					leftIcon={<IconArrowLeft size={16} />}
					variant="outline"
				>
					Back
				</button>
			</Link>

			{/* <Checkbox
						color="gray"
						onChange={handleChecked}
						checked={completed}
					/> */}

			<h1>{name}</h1>

			<p>
				{desc ? (
					<span>{desc}</span>
				) : (
					<span className="text-gray-500">No description</span>
				)}
			</p>

			<p>
				Due on {DateTime.fromISO(due_date).toFormat('dd LLL yyyy')} (
				{DateTime.fromISO(due_date).toRelative()})
			</p>

			<p>
				Created at{' '}
				{DateTime.fromISO(created_at).toFormat('dd LLL yyyy')} (
				{DateTime.fromISO(created_at).toRelative()})
			</p>

			<p>Last updated {DateTime.fromISO(updated_at).toRelative()}</p>

			<div className="flex">
				<button className="btn" component="a" onClick={handleDelete}>
					<IconTrash size={16} />
					Delete
				</button>

				<Link href={`/todo/edit/${id}`} passHref>
					<button className="btn btn-primary" component="a">
						<IconPencil size={16} />
						Edit
					</button>
				</Link>
			</div>
		</div>
	);
}
