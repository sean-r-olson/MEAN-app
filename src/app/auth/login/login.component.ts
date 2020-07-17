import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

// turn class into a component w/ component decorator
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;

  constructor(public authService: AuthService) {}

  onLogin(form: NgForm){
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.loginUser(form.value.email, form.value.password);
  }
}
