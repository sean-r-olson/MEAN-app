import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        })
      }))
    // subscribe to listen for response from server
      .subscribe((transformedPosts) => {
        // add response data (object) to client side posts array
        this.posts = transformedPosts;
        // this.postsUpdated.next([...this.posts]);
        console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>(
      'http://localhost:3000/api/posts/' + id
      );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{message: string, post: Post }>
      ('http://localhost:3000/api/posts',
      postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        }
        const id = responseData.postId
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title, content: content, imagePath: null};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    // replace the old post with updated post, and update the posts array
    .subscribe(response => {
        // clone the posts array and store in a new constant
        const updatedPosts = [...this.posts];
        // check if the id of the old post is equal to the id of the post we're updating
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id)
        // update the old post object
        updatedPosts[oldPostIndex] = post;
        // update the posts array with updated post object
        this.posts = updatedPosts;
        // send a copy of the updated posts array to the updated posts subject
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        console.log(postId, 'post deleted');
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }
}
