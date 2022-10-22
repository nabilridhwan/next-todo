import AxiosInstance from '../utils/axiosInstance';

export async function getAllTodos() {
	const result = await AxiosInstance.get(`/api/todo`);
	return result.data.data;
}
