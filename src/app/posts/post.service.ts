import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
      .pipe(map(postData => {
          return {
          posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            content2: post.content2,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }),
        maxPosts: postData.maxPosts
      };
      }))
    // subscribe to listen for response from server
      .subscribe((transformedPostsData) => {
        console.log(transformedPostsData);
        // add response data (object) to client side posts array
        this.posts = transformedPostsData.posts;
        // this.postsUpdated.next([...this.posts]);
        console.log(this.posts);
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostsData.maxPosts
        });
      });
  }

  getPostUpdateListener(){
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, content2: string, imagePath: string, creator: string}>(
      'http://localhost:3000/api/posts/' + id
      );
  }

  addPost(title: string, content: string, content2: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('content2', content2);
    postData.append('image', image, title);
    this.http
      .post<{message: string, post: Post }>
      ('http://localhost:3000/api/posts',
      postData)
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string, content2: string, image: File | string ) {
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('content2', content2);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        content2: content2,
        imagePath: image,
        creator: null
      }
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData)
    // replace the old post with updated post, and update the posts array
    .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete('http://localhost:3000/api/posts/' + postId)
  }
}
