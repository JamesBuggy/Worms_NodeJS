import { Injectable } from '@angular/core';
import { ValidatorFn, AsyncValidatorFn, AbstractControl, ValidationErrors, Validators, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { ValidateFieldsResult } from '../models/entities/validateFieldsResult';

@Injectable({ 
    providedIn: 'root' 
})
export class InputValidators {

    constructor(private authService: AuthService) {
        
    }

    // Input field validators
    username: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let required = Validators.required(control);
        let minLength = Validators.minLength(5)(control);
        let maxLength = Validators.maxLength(15)(control);
        let pattern = Validators.pattern('[a-zA-Z0-9]*')(control);
        let errors = { ...required, ...minLength, ...maxLength, ...pattern };
        return errors;
    }

    upperCaseRequired: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        return /[A-Z]/.test(control.value) ? null : { upperCaseRequired: true };
    }

    numberRequired: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        return /\d/.test(control.value) ? null : { numberRequired: true };
    }

    whitespace: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        return control.value.includes(' ') ? { whitespace: true } : null;
    }

    password: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let required = Validators.required(control);
        let minLength = Validators.minLength(5)(control);
        let maxLength = Validators.maxLength(15)(control);
        let whitespace = this.whitespace(control);
        let errors = { ...required, ...minLength, ...maxLength, ...whitespace };
        return errors;
    }

    realName: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let maxLength = Validators.maxLength(50)(control);
        let errors = { ...maxLength };
        return errors;
    }

    location: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let maxLength = Validators.maxLength(15)(control);
        let errors = { ...maxLength };
        return errors;
    }

    description: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let maxLength = Validators.maxLength(100)(control);
        let errors = {...maxLength };
        return errors;
    }

    teamName: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let required = Validators.required(control);
        let minLength = Validators.minLength(5)(control);
        let maxLength = Validators.maxLength(15)(control);
        let pattern = Validators.pattern('[a-zA-Z0-9 ]*')(control);
        let errors = { ...required, ...minLength, ...maxLength, ...pattern };
        return errors;
    }

    wormName: ValidatorFn = (control: AbstractControl) : ValidationErrors => {
        let required = Validators.required(control);
        let minLength = Validators.minLength(2)(control);
        let maxLength = Validators.maxLength(10)(control);
        let pattern = Validators.pattern('[a-zA-Z0-9]*')(control);
        let errors = { ...required, ...minLength, ...maxLength, ...pattern };
        return errors;
    }

    // Form group validators
    checkPasswords: ValidatorFn = (group: FormGroup): ValidationErrors => {
        var password = group.controls.password.value;
        var confirmPassword = group.controls.confirmPassword.value;
        return password === confirmPassword ? null : { notSame: true };
    }

    // Async validators
    usernameExists: AsyncValidatorFn = (control: AbstractControl) : Observable<ValidationErrors> => {
        if(!this.username(control)) {
            return null;
        }

        return this.authService.validateUsername(control.value).pipe(
            map((response: ValidateFieldsResult) => {
                return response.fields.username ? null : { usernameExists: true };
            })
        );
      }
}

