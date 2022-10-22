import AxiosInstance from '../utils/axiosInstance';

export async function toggleCompletedTodo({ id, completed }) {
	const result = await AxiosInstance.put(`/api/todo/${id}`, {
		completed,
	});
	return result.data.data;
}
