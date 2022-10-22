import BaseResponse from './BaseResponse';

export default class InternalServerError extends BaseResponse {
	constructor(data) {
		super(500, data);
	}
}
