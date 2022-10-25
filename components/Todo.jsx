import { IconPencil, IconTrash } from '@tabler/icons';
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
		<div className="card shadow-md my-3">
			<div className="card-body">
				<div className="flex items-center">
					{/* Overlay when delete or toggle completed is in process */}
					{/* <LoadingOverlay
				overlayOpacity={0.2}
				overlayColor="black"
				loaderProps={{ color: 'white' }}
				visible={deleteTodoIsLoading || toggleCompletedIsLoading}
				zIndex={5}
			/> */}

					<input
						type="checkbox"
						onChange={handleChecked}
						checked={completed}
						className="checkbox checkbox-accent checkbox-sm mr-3"
					/>

					<div style={{ flex: 1 }}>
						{/* Task name */}
						<Link href={`/todo/${id}`}>
							<a
								className={
									completed
										? 'line-through link text-neutral-content/50'
										: 'link'
								}
							>
								{name}
							</a>
						</Link>

						{!completed && (
							<p className="text-sm text-neutral-content/60">
								{/* Shorten the desc to 30 characters and add ellipses if needed */}
								{desc.length > 30
									? `${desc.substring(0, 30)}...`
									: desc}
							</p>
						)}

						<span className="block mt-2">
							{!completed &&
								(due_date ? (
									<p
										className={
											DateTime.fromISO(due_date)
												.diffNow()
												.as('days') <= 7
												? 'text-red-500 text-sm'
												: ' text-sm'
										}
									>
										{DateTime.fromISO(
											due_date
										).toRelative()}
									</p>
								) : (
									<p
									// size={'sm'} color="dimmed"
									>
										No due date
									</p>
								))}
						</span>
					</div>

					{/* Action buttons */}
					<div className="flex">
						<Link href={`/todo/edit/${id}`}>
							<button className="btn btn-square btn-sm btn-ghost">
								<IconPencil size={20} />
							</button>
						</Link>

						<button
							className="btn btn-square btn-ghost btn-sm text-red-500"
							onClick={handleDelete}
						>
							<IconTrash size={20} />
						</button>
					</div>

					{/* <Menu shadow="md" width={200}>
					<Menu.Target>
						<ActionIcon
							data-cy={`menu-${id}-todo-button`}
							variant="default"
						>
							<IconDots size={16} />
						</ActionIcon>
					</Menu.Target>

					<Menu.Dropdown>
						<Menu.Item
							component="a"
							href={`/todo/edit/${id}`}
							icon={<IconPencil size={14} />}
							data-cy={`edit-${id}-todo-button`}
						>
							Edit
						</Menu.Item>

						<Menu.Item
							color="red"
							icon={<IconTrash size={14} />}
							onClick={handleDelete}
							data-cy={`delete-${id}-todo-button`}
						>
							Delete
						</Menu.Item>
					</Menu.Dropdown>
				</Menu> */}
				</div>
			</div>
		</div>
	);
}
