import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service'
import { InputValidators } from '../../common/inputValidators'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  returnUrl: string;

  constructor(private fb: FormBuilder, 
              private authService: AuthService, 
              private router: Router, 
              private route: ActivatedRoute,
              private inputValidators: InputValidators) {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/servers';
    if(this.authService.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', this.inputValidators.username],
      password: ['', this.inputValidators.password]
    });
  }

  login(): void {
    const form = this.form.value;
    if (form.username && form.password) {
      this.authService.login(form.username, form.password).subscribe((response: boolean) => {
          if(response) {
            this.router.navigateByUrl(this.returnUrl);
          }
        }
      );
    }
  }
}