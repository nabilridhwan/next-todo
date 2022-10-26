// Import yup
import * as yup from 'yup';

export const updateTodoSchema = yup.object().shape({
	name: yup.string().required('Task name is required'),
	desc: yup.string().notRequired(),
	completed: yup.bool().notRequired(),
	due_date: yup.date().nullable(),
});

export const newTodoSchema = yup.object().shape({
	name: yup.string().required('Task name is required'),
	desc: yup.string().default(''),
	due_date: yup.date().nullable(),
});
