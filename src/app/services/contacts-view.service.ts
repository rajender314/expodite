import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, CanActivate, Router } from '@angular/router';
import { promise } from 'protractor';
import * as _ from 'lodash';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class ContactsViewService {


  private getAllUsersList = App.base_url + 'getAllUsersList';
  private getAddUserReqList = App.base_url + 'getAddUserReqList';
  private addFromAllUser = App.base_url + 'addFromAllUser';
  public routeAllowed = false;

  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    // console.log(App)

   

    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: 'Contacts'
    });
    // console.log(i)
    if( i > -1 && App.env_configurations.env_config[i].display == 'yes') {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;

    }
     if (((ActivatedRouteSnapshot.routeConfig.path == 'contactMainView') &&
      App.user_roles_permissions.filter(function(value){return (value.code=='contactMainView' && value.selected);}).length) &&
      this.routeAllowed
     ) {
       
       return true;
     }else{
      this.router.navigate(['access-denied']);
       return false;
     }
 
   }

  public contactRowdata: any;

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  constructor(private http: HttpClient, public router: Router) { }

  getUserList(param: any): Promise<any>{

    return this.http
    .post(this.getAllUsersList, param)
    .toPromise()
    .then(response => response);
  } 

  getRolesList(param: any): Promise<any>{

    return this.http
    .post(this.getAddUserReqList, param)
    .toPromise()
    .then(response => response);
  } 

  createContact(param: any): Promise<any>{

    return this.http
    .post(this.addFromAllUser, param)
    .toPromise()
    .then(response => response);
  } 
  
}
