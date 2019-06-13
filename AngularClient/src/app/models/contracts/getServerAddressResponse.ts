import { ApiResponse } from './apiResponse';
import { ServerAddr } from '../entities/serverAddr';

export class GetServerAddressResponse extends ApiResponse {

    content: ServerAddr

    constructor() {
        super();
    }
}