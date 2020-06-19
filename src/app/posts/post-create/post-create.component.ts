import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';

// @ symbol indicates "decorator" in typescript
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();
  post: Post;

  onAddPost(form: NgForm){
    if (form.invalid) {
      return;
    }
     this.post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(this.post);
    console.log(this.post);
  }

}
