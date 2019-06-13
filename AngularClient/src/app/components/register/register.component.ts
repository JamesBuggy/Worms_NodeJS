import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service'
import { InputValidators } from '../../common/inputValidators'
import { FormErrorStateMatcher } from '../../common/formErrorStateMatcher'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  formPasswords: FormGroup;
  errorMatcher: FormErrorStateMatcher;

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private router: Router,
              private inputValidators: InputValidators) {

    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.errorMatcher = new FormErrorStateMatcher();

    this.form = this.fb.group({
      username: ['', this.inputValidators.username, [this.inputValidators.usernameExists]]
    });

    this.formPasswords = this.fb.group({
      password: ['', [this.inputValidators.password, this.inputValidators.upperCaseRequired, this.inputValidators.numberRequired]],
      confirmPassword: ['']
    },
    {
      validator: this.inputValidators.checkPasswords
    });
  }

  signUp(): void {
    if(this.form.invalid || this.formPasswords.invalid) {
      return;
    }
    const form = this.form.value;
    const passwords = this.formPasswords.value;
    this.authService.register(form.username, passwords.password).subscribe((response: boolean) => {
        if(response) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
