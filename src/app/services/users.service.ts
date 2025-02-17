import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { RouterModule, CanActivate, Router } from '@angular/router';
import { Param } from '../custom-format/param';
import * as _ from 'lodash';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class UsersService implements CanActivate {
  public routeAllowed = false;
  public selectedEmail = '';

  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: 'Users'
    });
    // console.log(i)
    if( i > -1  && App.env_configurations.env_config[i].display == 'yes') {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
  
    }
     if (((ActivatedRouteSnapshot.routeConfig.path == 'users') &&
      App.user_roles_permissions.filter(function(value){return (value.code=='users' && value.selected);}).length) &&
      this.routeAllowed 
     ) {
       
       return true;
     }else{
      this.router.navigate(['access-denied']);
       return false;
     }
 
   }
  private getUsersApi = App.base_url + 'getUsersDropdown';
  private getSelectedUserApi = App.base_url + 'userDetails';
  private getUserPermissionsApi = App.base_url + 'getPermissions';
  private getGlobalPermissionsApi = App.base_url + 'getGlobalData';
  private addUserApi = App.base_url + 'userRegister';
  private changePasswordApi = App.base_url + 'changePassword';
  private reportsUserListApi = App.base_url + 'getUsersListForReportViews';

  constructor(private http: HttpClient,
    public router: Router) { }

  getUsersList(param): Promise<any> {
    return this.http
      .post(this.getUsersApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getSelectedUser(param: any): Promise<any> {
    return this.http
      .post(this.getSelectedUserApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getPermissions(param: any): Promise<any> {
    return this.http
      .post(this.getUserPermissionsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getGlobalPermissions(): Promise<any> {
    return this.http
      .get(this.getGlobalPermissionsApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  addUser(data: any): Promise<any>{
    return this.http
    .post(this.addUserApi, data)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  changePassword(param: any): Promise<any>{
    return this.http
    .post(this.changePasswordApi, param)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  getUserList(data: any): Promise<any>{
    return this.http
    .post(this.reportsUserListApi, data)
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
