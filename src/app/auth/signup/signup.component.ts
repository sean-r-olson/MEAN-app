import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

// turn class into a component w/ component decorator
@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {
  isLoading = false;

  onSignup(form: NgForm){
    console.log(form.value);
  }
}
