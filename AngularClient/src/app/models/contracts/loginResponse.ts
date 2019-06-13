import { ApiResponse } from './apiResponse';

export class LoginResponse extends ApiResponse {

    content : {
        token: string,
        expires: number
    }

    constructor() {
        super();
    }
}