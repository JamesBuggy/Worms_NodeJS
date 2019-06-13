import { ApiResponse } from './apiResponse';

export class GetProfileImagesResponse extends ApiResponse {

    content: string[]

    constructor() {
        super();
    }
}