import BaseResponse from './BaseResponse';

export default class Success extends BaseResponse {
	constructor(data) {
		super(200, data);
	}
}
