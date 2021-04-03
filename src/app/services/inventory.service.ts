import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { RouterModule, CanActivate, Router } from '@angular/router';

declare var App: any;


@Injectable({
  providedIn: 'root'
})
export class InventoryService implements CanActivate {
  public routeAllowed = false;
  public selectedBatch: Object;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    // console.log(App)

   

    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: 'Inventory'
    });
    // console.log(i)
    if( i > -1 && App.env_configurations.env_config[i].display == 'yes') {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;

    }
     if (((ActivatedRouteSnapshot.routeConfig.path == 'inventory') &&
      App.user_roles_permissions.filter(function(value){return (value.code=='inventory' && value.selected);}).length) &&
      this.routeAllowed
     ) {
       
       return true;
     }else{
      this.router.navigate(['access-denied']);
       return false;
     }
 
   }
 
private BatchesListApi = App.base_url + 'getListBatches';
private addBatchApi = App.base_url + 'addBatches';
private deleteBatchApi = App.base_url + 'deleteBatche';
private getBatchCoaApi = App.base_url + 'getBatchCoa';
private addBatchReportApi = App.base_url + 'addBatchReport';
private getBatchClientDetailsApi = App.base_url + 'getBtchClientDetails';
private OrdersListBatchApi = App.base_url + 'getOrdLstBtc';
 constructor(private http: HttpClient, 
  public router: Router) { }


 private handleError(error: any): Promise<any> {
    // console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  
  BatchesList(param: any): Promise<any> {
    return this.http
      .post(this.BatchesListApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
	}
  addBatch(param: any): Promise<any> {
    return this.http
      .post(this.addBatchApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
	}
  deleteBatch(param:any):Promise<any> {
    return this.http
          .post(this.deleteBatchApi,param)
          .toPromise()
          .then(response => response)
          .catch(this.handleError)
  }
  getBatchCoa(param:any):Promise<any> {
    return this.http
          .post(this.getBatchCoaApi,param)
          .toPromise()
          .then(response => response)
          .catch(this.handleError)
  }
  saveReportData(param:any):Promise<any> {
    return this.http
          .post(this.addBatchReportApi,param)
          .toPromise()
          .then(response => response)
          .catch(this.handleError)
  }
   OrdersListBatch(param:any):Promise<any> {
    return this.http
          .post(this.OrdersListBatchApi,param)
          .toPromise()
          .then(response => response)
          .catch(this.handleError)
  }
  getBatchClientDetails(param:any):Promise<any> {
    return this.http
            .post(this.getBatchClientDetailsApi,param)
            .toPromise()
            .then(response => response)
            .catch(this.handleError)
  }
}
