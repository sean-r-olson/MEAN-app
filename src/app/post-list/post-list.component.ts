import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Post } from '../posts/post.model';
import { PostsService } from '../posts/post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '../auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { Router } from '@angular/router';


@Component ({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy{
  posts: Post[] = [];
  totalPosts = 0;
  postsPerPage = 18;
  pageSizeOptions = [6, 18, 54];
  currentPage = 1;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  panelOpenState = false;
  @Input() confirm: boolean;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService, private authService: AuthService, private dialog: MatDialog, private router: Router) {}

  ngOnInit(){
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: { posts: Post[], postCount: number }) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    console.log('this is the page data:', pageData);
  }

  openDeleteDialog(){
    this.dialog.open(ConfirmationComponent);
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.currentPage = 1;
    if (confirm('are you sure?')){
      console.log('user clicked ok');
      this.postsService.deletePost(postId).subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    })
  } else {
      console.log('user clicked cancel');
      this.isLoading = false
      this.router.navigate(['/']);
  }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
