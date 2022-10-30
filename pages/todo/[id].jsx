import { IconCheck, IconPencil, IconTrash } from "@tabler/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import BackButton from "../../components/BackButton";
import { ToastManagerContext } from "../../context/ToastManager";
import { deleteTodo } from "../../frontend_api/deleteTodo";
import { getTodoById } from "../../frontend_api/getTodoById";
import { toggleCompletedTodo } from "../../frontend_api/toggleCompletedTodo";

export async function getServerSideProps(context) {
	try {
		const { id } = context.params;

		const data = await getTodoById({ id });

		if (!data || data.length === 0) {
			throw new Error("No todo found");
		}

		const firstTodo = data[0];

		return {
			props: { ...firstTodo }, // will be passed to the page component as props
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
	id,
	name,
	completed,
	desc,
	due_date,
	created_at,
	updated_at,
}) {
	const queryClient = useQueryClient();
	const { showToast } = useContext(ToastManagerContext);

	const {
		mutateAsync: toggleCompletedTodoMutation,
		isLoading: toggleCompletedIsLoading,
	} = useMutation(["toggleCompletedTodo", id], (completed) =>
		toggleCompletedTodo({ id, completed })
	);

	const { mutateAsync: deleteTodoMutation, isLoading: deleteTodoIsLoading } =
		useMutation(["deleteTodo", id], () => deleteTodo({ id }));

	async function handleDelete(event) {
		await deleteTodoMutation();

		await queryClient.invalidateQueries(["getAllTodos"]);

		window.location = "/";
	}

	async function handleChecked() {
		showToast({
			message: `Todo is marking as ${
				!completed ? "completed" : "incomplete"
			}`,
			type: "alert-info",
		});

		await toggleCompletedTodoMutation(!completed);

		showToast({
			message: `Todo has been marked as ${
				!completed ? "completed" : "incomplete"
			}`,
			type: "alert-success",
		});

		await queryClient.invalidateQueries(["getAllTodos"]);

		window.location.reload();
	}

	return (
		<div>
			<Head>
				<title>{name}</title>
			</Head>

			<BackButton href={"/"} />

			<h1
				className={
					completed ? "line-through text-neutral-content/50" : ""
				}
			>
				{name}
			</h1>

			<p className="text-white/70">
				{desc ? <span>{desc}</span> : <span>No description</span>}
			</p>

			<div className="card bg-base-300 shadow-lg p-5 my-10 text-white/50">
				<p>
					Due on:{" "}
					{due_date ? (
						<>
							{DateTime.fromISO(due_date).toFormat(
								"dd LLL yyyy HH:mm:ss a"
							)}
						</>
					) : (
						<span>No due date</span>
					)}
				</p>

				<p>
					Created at:{" "}
					{DateTime.fromISO(created_at).toFormat(
						"dd LLL yyyy HH:mm:ss a"
					)}
				</p>

				<p>
					Last updated:{" "}
					{DateTime.fromISO(updated_at).toFormat(
						"dd LLL yyyy HH:mm:ss a"
					)}
				</p>
			</div>

			<div className="flex flex-wrap gap-3">
				<button
					className="btn btn-error"
					component="a"
					onClick={handleDelete}
				>
					<IconTrash size={16} />
					Delete
				</button>

				<Link href={`/todo/edit/${id}`} passHref>
					<button className="btn btn-primary" component="a">
						<IconPencil size={16} />
						Edit
					</button>
				</Link>

				<button
					className="btn btn-secondary"
					component="a"
					onClick={handleChecked}
				>
					<IconCheck size={16} />
					Mark {completed ? "Incomplete" : "Complete"}
				</button>
			</div>
		</div>
	);
}
