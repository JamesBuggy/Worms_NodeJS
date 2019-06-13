import { ApiResponse } from './apiResponse';
import { ServerAddr } from '../entities/serverAddr';

export class GetServerAddressesResponse extends ApiResponse {

    content: ServerAddr[]

    constructor() {
        super();
    }
}