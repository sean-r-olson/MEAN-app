import { Component, OnInit, OnDestroy } from "@angular/core";
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/post.service';
import { Subscription } from 'rxjs';

@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSub: Subscription;

  constructor(public postsService: PostsService) {}

  onDelete(postId: string){
    this.postsService.deletePost(postId);
  }

  ngOnInit(){
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}

