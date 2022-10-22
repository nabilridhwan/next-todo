import AxiosInstance from '../utils/axiosInstance';

export async function addTodo({ name, desc, due_date }) {
	console.log({ name, desc, due_date });

	if (due_date) {
		due_date = new Date(due_date).toISOString();
	}
	const result = await AxiosInstance.post('/api/todo', {
		name,
		desc,
		due_date,
	});
	return result.data.data;
}
