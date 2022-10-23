import {
	Alert,
	Box,
	Button,
	Center,
	Container,
	Divider,
	Group,
	Loader,
	LoadingOverlay,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { IconPlus, IconRefresh } from '@tabler/icons';
import { useQuery } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import Todo from '../component/Todo';
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

			<Container>
				<Stack my="lg">
					<Title order={1} align="center">
						Next Todo Application
					</Title>

					<Text align="center">
						An application that quickly showcases the basic features
						of Next.js along with Cypress testing
					</Text>
				</Stack>

				<Divider />

				<Group position="right" my="lg">
					<Button
						leftIcon={<IconRefresh size={14} />}
						variant="outline"
						color="gray"
						onClick={refetch}
					>
						Refresh
					</Button>

					<Link href="/todo/add" passHref>
						<Button component="a" leftIcon={<IconPlus size={14} />}>
							Add
						</Button>
					</Link>
				</Group>

				<Box my="lg">
					{/* Overlay if the todos are being refetched or is loading */}
					<LoadingOverlay
						overlayOpacity={0.2}
						overlayColor="black"
						loaderProps={{ color: 'white' }}
						visible={isRefetching || isLoading}
						zIndex={5}
					/>

					{status === 'error' && error && (
						<Alert title="An error occurred" color="red">
							{JSON.stringify(error)}
						</Alert>
					)}

					{isLoading && (
						<Center>
							<Loader />
						</Center>
					)}

					{status === 'success' && (
						<Stack>
							{todos.map((todo, index) => (
								<Todo key={todo.id} {...todo} />
							))}
						</Stack>
					)}
				</Box>
			</Container>
		</div>
	);
}
