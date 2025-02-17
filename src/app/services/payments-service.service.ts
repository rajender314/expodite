import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {

  constructor(private http: HttpClient) { }
  getGridList(param: any): Promise<any> {
    return (
      this.http
        // .get(
        //   App.base_url +
        //     `getGridList?name=${param.name}&page=${param.page}&search=${param.search}&perPage=${param.perPage}`
        // )
        .post(App.base_url + "getGridList", param)
        .toPromise()
        .then((response) => response)
        .catch(this.handleError)
    );
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
