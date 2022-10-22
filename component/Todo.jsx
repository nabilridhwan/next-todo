import {
	Button,
	Checkbox,
	Group,
	Menu,
	Paper,
	Space,
	Text,
} from '@mantine/core';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { deleteTodo } from '../frontend_api/deleteTodo';
import { toggleCompletedTodo } from '../frontend_api/toggleCompletedTodo';

export default function Todo({ id, name, completed, desc, due_date }) {
	const queryClient = useQueryClient();

	const { mutateAsync: toggleCompletedTodoMutation } = useMutation(
		['toggleCompletedTodo', id],
		(completed) => toggleCompletedTodo({ id, completed })
	);

	const { mutateAsync: deleteTodoMutation } = useMutation(
		['deleteTodo', id],
		() => deleteTodo({ id })
	);

	async function handleChecked(event) {
		const { checked } = event.currentTarget;
		console.log(checked);

		await toggleCompletedTodoMutation(checked);
		await queryClient.invalidateQueries(['getAllTodos']);
	}

	async function handleDelete(event) {
		await deleteTodoMutation();
		await queryClient.invalidateQueries(['getAllTodos']);
	}

	return (
		<Paper shadow="md" withBorder p="sm">
			<Group>
				<Checkbox
					color="gray"
					onChange={handleChecked}
					checked={completed}
				/>
				<div style={{ flex: 1 }}>
					{!completed ? (
						<Text>{name}</Text>
					) : (
						<Text strikethrough color="dimmed">
							{name}
						</Text>
					)}

					{!completed && (
						<Text color="dimmed" size="sm">
							{desc &&
								`${desc.slice(0, 40)}${
									desc.length > 40 ? '...' : ''
								}`}
						</Text>
					)}

					<Space h="xs" />

					{!completed &&
						(due_date ? (
							<Text
								size={'sm'}
								color={
									DateTime.fromISO(due_date)
										.diffNow()
										.as('days') <= 7
										? 'red.5'
										: 'dimmed'
								}
							>
								{DateTime.fromISO(due_date).toRelative()}
							</Text>
						) : (
							<Text size={'sm'} color="dimmed">
								No due date
							</Text>
						))}
				</div>

				<Menu shadow="md" width={200}>
					<Menu.Target>
						<Button variant="subtle" size="xs" color="dark">
							<IconDots size={14} />
						</Button>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							component="a"
							href={`/todo/edit/${id}`}
							icon={<IconPencil size={14} />}
						>
							Edit
						</Menu.Item>

						<Menu.Item
							color="red"
							icon={<IconTrash size={14} />}
							onClick={handleDelete}
						>
							Delete
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Paper>
	);
}
