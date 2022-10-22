import AxiosInstance from '../utils/axiosInstance';

export async function updateTodo({ name, desc, completed, due_date, id }) {
	return AxiosInstance.put(`/api/todo/${id}`, {
		name,
		desc,
		due_date,
		completed,
	});
}
