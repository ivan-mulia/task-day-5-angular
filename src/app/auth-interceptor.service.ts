import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{
  intercept(req: HttpRequest<any>, fwd: HttpHandler){
    console.log(req);
    const clonedReq = req.clone(
      {headers: req.headers.append('Basic', '12345678890')}
      ); //clone dlu karna headers immutable
    return fwd.handle(clonedReq)//forward hasil cloningan yang ud diedit via clone
    .pipe(
      tap(
        event => {
          if(event.type === HttpEventType.Response){
            console.log(event.body);
          }
        }
      )
    );
  }
}
