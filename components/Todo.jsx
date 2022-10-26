import { IconPencil, IconTrash } from '@tabler/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { ToastManagerContext } from '../context/ToastManager';
import { deleteTodo } from '../frontend_api/deleteTodo';
import { toggleCompletedTodo } from '../frontend_api/toggleCompletedTodo';

export default function Todo({ id, name, completed, desc, due_date }) {
	const queryClient = useQueryClient();

	const { showToast, removeToast } = useContext(ToastManagerContext);

	const {
		mutateAsync: toggleCompletedTodoMutation,
		isLoading: toggleCompletedIsLoading,
	} = useMutation(['toggleCompletedTodo', id], (completed) =>
		toggleCompletedTodo({ id, completed })
	);

	const { mutateAsync: deleteTodoMutation, isLoading: deleteTodoIsLoading } =
		useMutation(['deleteTodo', id], () => deleteTodo({ id }));

	const [disableButton, setDisableButton] = useState(
		toggleCompletedIsLoading || deleteTodoIsLoading
	);

	async function handleChecked(event) {
		const { checked } = event.currentTarget;
		console.log(checked);

		// Show the toast message saying that the todo is marked as completed / incomplete
		showToast({
			message: `Todo is marking as ${
				checked ? 'completed' : 'incomplete'
			}`,
			type: 'alert-info',
		});

		await toggleCompletedTodoMutation(checked);

		await queryClient.invalidateQueries(['getAllTodos']);
		// Show toast message saying that the todo has been updated
		showToast({
			message: `Todo has been marked as ${
				checked ? 'completed' : 'incomplete'
			}`,
			type: 'alert-success',
		});
	}

	async function handleDelete(event) {
		// Show the toast message saying that the todo is deleting
		const toastId = showToast({
			message: `Deleting todo...`,
			type: 'alert-info',
		});

		await deleteTodoMutation();

		await queryClient.invalidateQueries(['getAllTodos']);
		// Show toast message saying that the todo has been deleted
		showToast({
			message: `Todo has been deleted`,
			type: 'alert-error',
		});
	}

	return (
		<div
			className="card shadow-lg outline outline-1 outline-white/10 my-3 todo-card"
			id={`todo-${id}`}
		>
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
						disabled={disableButton}
						className="checkbox checkbox-sm mr-4"
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
										className="text-sm"
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
							<button
								disabled={disableButton}
								className="btn btn-square btn-sm btn-ghost"
							>
								<IconPencil size={20} />
							</button>
						</Link>

						<button
							disabled={disableButton}
							className="btn btn-square btn-ghost btn-sm text-red-500"
							onClick={handleDelete}
						>
							<IconTrash size={20} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
