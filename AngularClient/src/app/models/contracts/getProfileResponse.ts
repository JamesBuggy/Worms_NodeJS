import { ApiResponse } from './apiResponse';
import { Profile } from '../entities/profile';

export class GetProfileResponse extends ApiResponse {

    content: Profile

    constructor() {
        super();
    }
}