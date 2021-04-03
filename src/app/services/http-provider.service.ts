
import {of as observableOf,  Observable } from 'rxjs';

import {tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';

@Injectable()
export class HttpProviderService implements HttpInterceptor {

  private cache = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const dup = req.clone({setHeaders: {'Content-Type': 'application/json'}});

    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cachedResponse = this.cache[req.urlWithParams] || null;
    if (cachedResponse) {
      return observableOf(cachedResponse);
    }

    return next.handle(req).pipe(tap(event => {
      if (event instanceof HttpResponse) {
      	this.cache[req.urlWithParams] = event;
      }
    }));

    //return next.handle(dup);
  }

}
