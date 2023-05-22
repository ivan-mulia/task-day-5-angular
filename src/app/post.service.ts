import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpEventType } from '@angular/common/http';
import { Post } from './post.model';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  endPointURL:string = 'https://http-angular-project-d3063-default-rtdb.asia-southeast1.firebasedatabase.app/';
  postURL: string = this.endPointURL+'post.json';
  errorHandling =  new Subject<any> ();
  constructor(private http: HttpClient) { }

  createAndPost(postData: Post){
    return this.http.post<{name:string}>(this.postURL, postData,{
      observe: 'response', // default is body
      responseType: 'json'
    });
  }

  fetchPosts(){
    let customParam = new HttpParams();
    customParam = customParam.append('print','ATTACK-ON-TITAN');
    return this.http.get<{[key: string]: Post}>(this.postURL,{
      //cara menambahkan header baru
      headers: new HttpHeaders({
        'app-token-YES' : 'ALOHA'
      }), 
      // koma ke 2 custom params
      params: customParam,
    })
    .pipe(
      map(responseData =>{
        const postArray: Post[] = [];
        for(const key in responseData){
          if(responseData.hasOwnProperty(key)){
            postArray.push({...responseData[key],id: key})
          }
        }
        return postArray;
      })
    )
  }

  deletePosts(){
    return this.http.delete(this.postURL,{
      observe: 'events'
    }).pipe(
      tap(event => {
      console.log(event);
      if(event.type === HttpEventType.Sent){

      }if(event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }));
  }
}
