import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Param } from '../custom-format/param';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  private getQuesListApi = App.base_url + 'quesList';
  private getEmailControllerListApi = App.base_url + 'emailControllerList';
  private getCronsListApi = App.base_url + 'clientChannelsCronsList';
  private getEmailControllerMessageApi = App.base_url + 'showEmailControllerMessage';
  private getSystemErrorsApi = App.base_url + 'getSystemErrors';


  constructor(private http: HttpClient) { }

  getQuesList(): Promise<any> {
    return this.http
      .get(this.getQuesListApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCronsList(): Promise<any> {
    return this.http
      .get(this.getCronsListApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getEmailControllerList(param: any): Promise<any> {
    return this.http
    .post(this.getEmailControllerListApi, param)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  getEmailControllerMessage(id: any): Promise<any> {
    return this.http
    .post(this.getEmailControllerMessageApi, id)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  getSystemErrors(param): Promise<any> {
    return this.http
      .post(this.getSystemErrorsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }


  /* For Demo Purpose */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
