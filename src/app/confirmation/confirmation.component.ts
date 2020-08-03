import { Component, Output} from '@angular/core';

@Component ({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

export class ConfirmationComponent {

  @Output() confirm = true;

  confirmAction($event){
    this.confirm = true;
    console.log(this.confirm);
  }

  cancelAction($event){
    this.confirm = false;
    console.log(this.confirm);
  }
}

