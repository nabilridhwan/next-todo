import BaseResponse from './BaseResponse';

export default class BadRequest extends BaseResponse {
	constructor(data) {
		super(400, data);
	}
}
