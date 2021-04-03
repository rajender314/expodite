
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, tap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { TokenExpiredComponent } from '../dialogs/token-expired/token-expired.component';



declare var App: any;
@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {
  public dialogShow = true;
  constructor(
    public dialog: MatDialog,
  ) {

  }
  returnUrl = App.base_url + 'do-logout';
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = App.token;
  
  
    const customReq = request.clone({ setHeaders: { 'X-JWT-Token': token } });
    return next
      .handle(customReq).pipe(
      tap((ev: HttpEvent<any>) => {
        if (ev instanceof HttpResponse) {
          if (ev.body.result.status_code === 1000) {

            if(this.dialogShow) {
              this.dialogShow = false;
              let dialogRef = this.dialog.open(TokenExpiredComponent, {
                panelClass: 'alert-dialog',
                disableClose: true,
                width: '600px'
              });
              dialogRef.afterClosed().subscribe(result => {
                if (result.success) {
                  location.href = this.returnUrl;

                }
              });
            }
          
            setTimeout(() => {
            
              location.href = this.returnUrl;
            }, 2000);
          
          
          }
        }
      }),
      catchError(response => {
        if (response instanceof HttpErrorResponse) {
          // console.log('Processing http error', response);
        }

        return observableThrowError(response);
      }),);
  }
}
