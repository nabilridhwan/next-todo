import {
	Alert,
	Box,
	Button,
	Group,
	Loader,
	Stack,
	Textarea,
	TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getTodoById } from '../../../frontend_api/getTodoById';
import { updateTodo } from '../../../frontend_api/updateTodo';

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

export default function EditTodo({ todo }) {
	const {
		data,
		status,
		isLoading,
		error,
		mutateAsync: updateTodoMutate,
	} = useMutation(['updateTodo'], (data) => updateTodo({ ...data }), {
		useErrorBoundary: false,
	});

	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (status === 'error') {
			console.log(error);
		}
	}, [status]);

	const form = useForm({
		initialValues: {
			name: todo.name,
			desc: todo.desc,
			due_date: todo.due_date ? new Date(todo.due_date) : null,
		},

		// validate: {
		// 	email: (value) =>
		// 		/^\S+@\S+$/.test(value) ? null : 'Invalid email',
		// },
	});

	async function handleSubmit(e) {
		try {
			e.preventDefault();
			console.log(form.values);

			await updateTodoMutate({ ...form.values, id: todo.id });

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
			<Box sx={{ maxWidth: 300 }} mx="auto">
				<h1>Edit Todo</h1>

				{errorMessage && (
					<Alert title="An error occurred" color="red">
						{JSON.stringify(errorMessage)}
						{/* {errorMessage.join(', ')} */}
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<Stack>
						<TextInput
							withAsterisk
							label="Task name"
							placeholder="Wash the dishes"
							{...form.getInputProps('name')}
						/>
						<Textarea
							label="Description"
							placeholder="Important stuff!!!"
							{...form.getInputProps('desc')}
						/>
						<DatePicker
							placeholder="Pick date"
							label="Due Date"
							allowFreeInput
							{...form.getInputProps('due_date')}
						/>

						<Group position="right" mt="md">
							<Link href="/">
								<Button type="submit" component="a" color="red">
									Cancel
								</Button>
							</Link>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? (
									<Loader color="white" size="sm" />
								) : (
									'Save'
								)}
							</Button>
						</Group>
					</Stack>
				</form>
			</Box>
		</div>
	);
}
