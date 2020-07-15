import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

// turn class into a component w/ component decorator
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  isLoading = false;

  onLogin(form: NgForm){
    console.log(form.value);
  }
}
