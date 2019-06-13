import { Directive } from "@angular/core";
import { Validator, NG_VALIDATORS, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { InputValidators } from '../common/inputValidators';

@Directive({
    selector: "[no-whitespace]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: NoWhitespaceDirective,
        multi: true
    }]
})
export class NoWhitespaceDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.inputValidators.whitespace(control);
    }
}

@Directive({
    selector: "[team-name]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: TeamNameDirective,
        multi: true
    }]
})
export class TeamNameDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {
        console.log('TeamNameDirective');
    }

    validate: ValidatorFn = (control: AbstractControl): ValidationErrors => {
        let errors = this.inputValidators.teamName(control);
        console.log(errors);
        return errors;
    }
}

@Directive({
    selector: "[worm-name]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: WormNameDirective,
        multi: true
    }]
})
export class WormNameDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.inputValidators.wormName(control);
    }
}

@Directive({
    selector: "[real-name]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: RealNameDirective,
        multi: true
    }]
})
export class RealNameDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.inputValidators.realName(control);
    }
}

@Directive({
    selector: "[location]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: LocationDirective,
        multi: true
    }]
})
export class LocationDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.inputValidators.location(control);
    }
}

@Directive({
    selector: "[description]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: DescriptionDirective,
        multi: true
    }]
})
export class DescriptionDirective implements Validator
{
    constructor(private inputValidators: InputValidators) {

    }

    validate(control: AbstractControl): ValidationErrors | null {
        return this.inputValidators.description(control);
    }
}