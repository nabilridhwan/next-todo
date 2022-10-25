import * as yup from 'yup';
import BadRequest from '../../../classes/responses/BadRequest';
import InternalServerError from '../../../classes/responses/InternalServerError';
import Success from '../../../classes/responses/Success';
import supabaseClient from '../../../database/supabaseClient';

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
		// Post function
		const putTodoSchema = yup.object().shape({
			name: yup.string().required('Task name is required'),
			desc: yup.string(),
			completed: yup.bool().notRequired(),
			due_date: yup.string().nullable(),
		});

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

			let tObj = { ...t, ...req.body };

			const validated = await putTodoSchema.validate(tObj);

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
