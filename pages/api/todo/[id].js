import * as yup from 'yup';
import BadRequest from '../../../classes/responses/BadRequest';
import InternalServerError from '../../../classes/responses/InternalServerError';
import Success from '../../../classes/responses/Success';
import supabaseClient from '../../../database/supabaseClient';
import { updateTodoSchema } from '../../../schemas/todos';

export default async function handler(req, res) {
	const { id } = req.query;

	if (req.method === 'GET') {
		try {
			const { data, error } = await supabaseClient
				.from('todo')
				.select('*')
				.eq('id', id);

			if (error) {
				return new InternalServerError({ error }).handleResponse(
					req,
					res
				);
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

	if (req.method === 'PUT') {
		try {
			const { data: getTodoData, error: getTodoError } =
				await supabaseClient.from('todo').select('*').eq('id', id);

			// Get the first todo
			const t = getTodoData[0];

			if (!t) {
				return new InternalServerError('Todo not found').handleResponse(
					req,
					res
				);
			}

			// Append the todo and the request body behind it
			let tObj = { ...t, ...req.body };

			// Get the final validated object
			const validated = await updateTodoSchema.validate(tObj);

			const { data, error } = await supabaseClient
				.from('todo')
				.update({ ...validated, updated_at: new Date() })
				.eq('id', id);

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

	if (req.method === 'DELETE') {
		try {
			const { data, error } = await supabaseClient
				.from('todo')
				.update({ archived: true, updated_at: new Date() })
				.eq('id', id);

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
