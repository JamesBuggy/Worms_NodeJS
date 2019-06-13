import { ApiResponse } from './apiResponse';
import { Team } from '../entities/team';

export class GetTeamResponse extends ApiResponse {

    content: Team

    constructor() {
        super();
    }
}