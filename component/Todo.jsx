import {
	ActionIcon,
	Anchor,
	Checkbox,
	Group,
	LoadingOverlay,
	Menu,
	Paper,
	Space,
	Text,
	Tooltip,
} from '@mantine/core';
import { IconDots, IconPencil, IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { deleteTodo } from '../frontend_api/deleteTodo';
import { toggleCompletedTodo } from '../frontend_api/toggleCompletedTodo';

export default function Todo({ id, name, completed, desc, due_date }) {
	const queryClient = useQueryClient();

	const {
		mutateAsync: toggleCompletedTodoMutation,
		isLoading: toggleCompletedIsLoading,
	} = useMutation(['toggleCompletedTodo', id], (completed) =>
		toggleCompletedTodo({ id, completed })
	);

	const { mutateAsync: deleteTodoMutation, isLoading: deleteTodoIsLoading } =
		useMutation(['deleteTodo', id], () => deleteTodo({ id }));

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
		<Paper shadow="xs" withBorder p="md" radius="lg">
			{/* Overlay when delete or toggle completed is in process */}
			<LoadingOverlay
				overlayOpacity={0.2}
				overlayColor="black"
				loaderProps={{ color: 'white' }}
				visible={deleteTodoIsLoading || toggleCompletedIsLoading}
				zIndex={5}
			/>

			<Group>
				<Checkbox
					color="gray"
					onChange={handleChecked}
					checked={completed}
				/>
				<div style={{ flex: 1 }}>
					<Link href={`/todo/${id}`}>
						<Anchor component={'a'} color="gray.3">
							{!completed ? (
								<Text>{name}</Text>
							) : (
								<Text strikethrough color="dimmed">
									{name}
								</Text>
							)}
						</Anchor>
					</Link>

					{!completed && (
						<Tooltip position="bottom-start" label={desc} withArrow>
							<Text color="dimmed" size="sm">
								{desc &&
									`${desc.slice(0, 40)}${
										desc.length > 40 ? '...' : ''
									}`}
							</Text>
						</Tooltip>
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
						<ActionIcon variant="default">
							<IconDots size={16} />
						</ActionIcon>
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
