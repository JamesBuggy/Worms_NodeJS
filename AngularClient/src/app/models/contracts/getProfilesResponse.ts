import { ApiResponse } from './apiResponse';
import { Profile } from '../entities/profile';

export class GetProfilesResponse extends ApiResponse {

    content: Profile[]

    constructor() {
        super();
    }
}