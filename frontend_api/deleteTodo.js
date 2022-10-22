import AxiosInstance from '../utils/axiosInstance';

export async function deleteTodo({ id }) {
	const result = await AxiosInstance.delete(`/api/todo/${id}`);
	return result.data.data;
}
