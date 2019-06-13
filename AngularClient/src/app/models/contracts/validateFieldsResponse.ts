import { ApiResponse } from './apiResponse';
import { ValidateFieldsResult } from '../entities/validateFieldsResult'

export class ValidateFieldsResponse extends ApiResponse {
    
    content: ValidateFieldsResult;

    constructor() {
        super();
    }
}