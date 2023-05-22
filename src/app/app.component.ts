import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { map } from 'rxjs/operators';
import { createViewChild } from '@angular/compiler/src/core';
import { NgForm } from '@angular/forms';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  endPointURL:string = 'https://http-angular-project-d3063-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL+'post.json';
  loadedPosts = [];
  showLoading = false;
  updateDataPost =[];
  error = null;
  errorSub: Subscription;
  @ViewChild('updateForm') updateForm: NgForm;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe(
      error =>{
        this.error=error;
      }
    );
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    console.log(postData);
    // this.http.post(this.postURL, postData).subscribe(
    //   (data)=> {
    //     console.log(data);
    //   }
    // )
    this.postService.createAndPost(postData).subscribe(
      (data)=>{
        console.log(data);
       
      }, error => { //ini macam catch nya

      }, () => { //FINALLY kalau di try catch
        this.onFetchPosts();
      }
    );
    //this.onFetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.showLoading=true;
    this.postService.deletePosts().subscribe(
      (data)=>{
        this.showLoading=false;
        //this.loadedPosts = [];
        this.fetchPosts();
      }
    );
    
  }

  onUpdateData(postData: { contentEdit: string; idEdit: string; titleEdit: string; }){
    console.log("ABCDEFG");
    console.log(postData);

    const updateFormatted = {
      [postData.idEdit]:{
        'title' : postData.titleEdit, 'content' :postData.contentEdit
      }
    }
    
    this.http.patch(this.postURL, updateFormatted).subscribe(
      (data)=> {
        console.log(data);
        //this.fetchPosts();
      }
    );
    this.fetchPosts();
    
  }

  selectData(data: Post){
    this.updateForm.setValue({
      idEdit: data.id,
      contentEdit : data.content,
      titleEdit : data.title
    });
    
  }


  private fetchPosts(){
    this.showLoading = false;
    this.postService.fetchPosts()
    .subscribe(
      posts => {
        this.showLoading = false;
        this.loadedPosts = posts;
        console.log(posts);
      }, error => { //ini macam catch nya
        console.log(error);
        this.error = error;
      }
    );
  }

  
}
