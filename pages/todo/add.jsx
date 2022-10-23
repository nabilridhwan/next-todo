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
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { addTodo } from '../../frontend_api/addTodo';

export default function AddTodo() {
	const {
		data,
		status,
		isLoading,
		error,
		mutateAsync: addTodoMutate,
	} = useMutation(['addTodo'], (data) => addTodo({ ...data }), {
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
			name: '',
			desc: '',
			due_date: null,
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

			await addTodoMutate(form.values);

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
			<Head>
				<title>Add todo</title>
			</Head>
			<Box sx={{ maxWidth: 300 }} mx="auto">
				<h1>Add Todo</h1>

				{errorMessage && (
					<Alert title="An error occurred" color="red">
						{errorMessage.join(', ')}
					</Alert>
				)}

				<form onSubmit={handleSubmit}>
					<Stack>
						<TextInput
							withAsterisk
							label="Task name"
							placeholder="Task name"
							{...form.getInputProps('name')}
						/>
						<Textarea
							autosize
							label="Description"
							placeholder="Task description"
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
									'Add todo'
								)}
							</Button>
						</Group>
					</Stack>
				</form>
			</Box>
		</div>
	);
}
