import * as yup from 'yup';
import BadRequest from '../../../classes/responses/BadRequest';
import InternalServerError from '../../../classes/responses/InternalServerError';
import Success from '../../../classes/responses/Success';
import supabaseClient from '../../../database/supabaseClient';

export default async function handler(req, res) {
	if (req.method === 'GET') {
		// Get function
		let { data: todo, error } = await supabaseClient
			.from('todo')
			.select('*')
			.order('completed')
			.order('due_date')
			.eq('archived', 'false');

		if (error) {
			return new BadRequest({ error }).handleResponse(req, res);
		}

		return new Success(todo).handleResponse(req, res);
	}

	if (req.method === 'POST') {
		// Post function
		const postTodoSchema = yup.object().shape({
			name: yup.string().required('Task name is required'),
			desc: yup.string().default(''),
			due_date: yup.string().nullable(),
		});

		try {
			const validated = await postTodoSchema.validate(req.body);

			const { name, desc, due_date } = validated;

			const { data, error } = await supabaseClient
				.from('todo')
				.insert([{ name, desc, due_date }])
				.select('*');

			if (error) {
				return new InternalServerError(error).handleResponse(req, res);
			}

			return new Success(data).handleResponse(req, res);
		} catch (error) {
			console.log(error);

			// Is the error passed through a ValidationError
			if (error instanceof yup.ValidationError) {
				return new BadRequest(error.errors).handleResponse(req, res);
			}
		}
	}

	res.status(200).json({ name: { person: 'Nabil' } });
}
