import AxiosInstance from '../utils/axiosInstance';

export async function getTodoById({ id }) {
	const result = await AxiosInstance.get(`/api/todo/${id}`);
	return result.data.data;
}
