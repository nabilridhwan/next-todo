export default class BaseResponse {
	constructor(statusCode, data = {}) {
		this.statusCode = statusCode;
		this.error = false;
		this.data = data;

		if (statusCode >= 400) {
			this.error = true;
		}
	}

	handleResponse(req, res) {
		const returnData = {
			error: this.error,
			data: this.data,
			status: this.statusCode,
		};

		return res.status(this.statusCode).json(returnData);
	}
}
