import { ApiResponse } from './apiResponse';
import { Match } from '../entities/match';

export class GetMatchesResponse extends ApiResponse {

    content: Match[]

    constructor() {
        super();
    }
}