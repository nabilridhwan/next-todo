import {
	Box,
	Button,
	Checkbox,
	Container,
	Group,
	Space,
	Text,
	Title,
} from '@mantine/core';
import { IconArrowLeft, IconPencil, IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
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
		<Container>
			<Box mx="auto" my="lg">
				<Link href={`/`} passHref>
					<Button
						component="a"
						leftIcon={<IconArrowLeft size={16} />}
						variant="outline"
					>
						Back
					</Button>
				</Link>

				<Group my="lg" over>
					<Checkbox
						color="gray"
						onChange={handleChecked}
						checked={completed}
					/>

					<Title order={2}>{name}</Title>
				</Group>

				{desc ? (
					<Text>{desc}</Text>
				) : (
					<Text italic>No description provided</Text>
				)}

				<Space h="lg" />

				<Text color="dimmed" size="sm">
					Due on {DateTime.fromISO(due_date).toFormat('dd LLL yyyy')}{' '}
					({DateTime.fromISO(due_date).toRelative()})
				</Text>

				<Text color="dimmed" size="sm">
					Created at{' '}
					{DateTime.fromISO(created_at).toFormat('dd LLL yyyy')} (
					{DateTime.fromISO(created_at).toRelative()})
				</Text>

				<Text color="dimmed" size="sm">
					Last updated {DateTime.fromISO(updated_at).toRelative()}
				</Text>

				<Group position="right" my="lg">
					<Button
						color="red"
						component="a"
						leftIcon={<IconTrash size={16} />}
						onClick={handleDelete}
					>
						Delete
					</Button>

					<Link href={`/todo/edit/${id}`} passHref>
						<Button
							component="a"
							leftIcon={<IconPencil size={16} />}
						>
							Edit
						</Button>
					</Link>
				</Group>
			</Box>
		</Container>
	);
}
