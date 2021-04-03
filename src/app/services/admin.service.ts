import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Router,ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule, CanActivate } from '@angular/router';
import * as _ from 'lodash';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class AdminService implements CanActivate{
  public routeAllowed = false;
  public instanceName = '';
  public loggedUserEmail = '';
  public uomData = [];
  public manageAccount = '';
  public isRoleEditable = false;

  public isAddProducts = false;
  public isClient = false;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    // console.log(ActivatedRouteSnapshot)
  

  let i = _.findIndex(<any>App.env_configurations.env_config, {
    name: 'Admin'
  });
  // console.log(i)
  if( i > -1  && App.env_configurations.env_config[i].display == 'yes') {
    this.routeAllowed = true;
  } else {
    this.routeAllowed = false;

  }
     if (((ActivatedRouteSnapshot.routeConfig.path == 'admin') &&
      App.user_roles_permissions.filter(function(value){return (value.code=='admin' && value.selected);}).length) &&
      this.routeAllowed
     ) {
       
       return true;
     }else{
      this.router.navigate(['access-denied']);
       return false;
     }
 
   }
   public appFnvironment = '';
  private reloadCurrentRoute = false;
  private activeRoute = 'roles';
  private listClientsApi = App.base_url + 'listClients';
  private addClientApi = App.base_url + 'addClient';
  //private getSocialMediaApi = App.base_url + 'getSocialMedia';
  

  private listRolesApi = App.base_url + 'listRoles';
  private listContactsApi = App.base_url + 'getCompanyShpAddr';
  //private listProductsApi = App.base_url + 'getListProductsTypes';
  private listProductsApi = App.base_url + 'getProductTypes';
  private delContactApi = App.base_url + 'deleteShpAddr';
  private delProductTypeApi = App.base_url +  'deleteProductTypes';

  private addRoleApi = App.base_url + 'addRole';
  

  private listContainersApi = App.base_url + 'getListContainers';
  private categoryDataApi = App.base_url + 'categoryDt';
  private getAuthorizemail = App.base_url + 'getauthorizeUrl';
  private getauthorizeUser = App.base_url + 'getauthorizeUser';

  private addContainerApi = App.base_url + 'addContainers';
  private addShipmentApi = App.base_url + 'addModeTransport';
  private addCategoryApi = App.base_url + 'addCategories';
  private deleteContainerApi = App.base_url + 'deleteContainer';
  private addContactAddressApi = App.base_url + 'addCompanyShpAddr';
  private addProductTypeApi = App.base_url + 'addProductsTypes';
  private getGlobalPermissionsApi = App.base_url + 'getGlobalData';
  private listShipmentApi = App.base_url + 'getListModeTransport';
  private listCategoryApi = App.base_url + 'getListCategories';
  //private getRolePermissionsApi = App.base_url + 'getPermissions';
  private getSelectedRoleApi = App.base_url + 'roleDetails';
  private addCountryApi = App.base_url + 'addCountry';
  private addStateApi = App.base_url + 'addState';
  private envConfigurations = App.base_url + 'envConfigurations';
  private getaatributeApi = App.api_url + 'getAttributes';
  private addatributeApi = App.api_url + 'addStoreAttributes';
  private allFormFieldsApi = App.api_url + 'listOfUielements';
  private attributeDetail = App.api_url + 'attributeDetails';
  private adminSettings = App.base_url+ 'saveSettings';
  private getadminSettings = App.base_url + 'getSettings';
   private uomDataApi = App.base_url + 'getUomData';


  //private getSocialMediaApi = App.base_url + 'getSocialMedia';

  

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  reloadRoute(list){
    // console.log(list.route)
    // console.log(this.location)
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate([`/admin/`+list.route]);
    this.activeRoute = list.route;
  }

  getActiveRoute(){
    return this.activeRoute;
  }

  getClientsList(param: any): Promise<any> {
    return this.http
      .post(this.listClientsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  getEnvDetails(param) {
    return this.http
      .post(this.envConfigurations, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  addClient(param: any): Promise<any> {
    return this.http
      .post(this.addClientApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  addCountry(param: any): Promise<any> {
    return this.http
      .post(this.addCountryApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  addState(param: any): Promise<any> {
    return this.http
      .post(this.addStateApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }


  /*getSocialMedia(): Promise<any> {
    return this.http
      .get(this.getSocialMediaApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }*/


  /* For Demo Purpose */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getCategoryData(){
    return this.http
    .get(this.categoryDataApi)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  getAuthrozemail(){
    return this.http
    .get(this.getAuthorizemail)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }


  getAuthUser(param:any): Promise<any>{
    return this.http
    .post(this.getauthorizeUser,param)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }

  getRolesList(param: any): Promise<any> {
    return this.http
      .post(this.listRolesApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getContactsList(param: any): Promise<any> {
    return this.http
      .post(this.listContactsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getProductsList(param: any): Promise<any> {
    return this.http
      .post(this.listProductsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  getUomData(param: any): Promise<any> {
    return this.http
      .post(this.uomDataApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  addRole(param: any): Promise<any> {
    return this.http
      .post(this.addRoleApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  

  addContactAddress(param: any): Promise<any> {
    return this.http
      .post(this.addContactAddressApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  addProductType(param: any): Promise<any> {
    return this.http
      .post(this.addProductTypeApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  getContainersList(param: any): Promise<any> {
    return this.http
      .post(this.listContainersApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getShipmentsList(param: any): Promise<any>{
    return this.http
    .post(this.listShipmentApi, param)
    .toPromise()
    .then(response => response)
    .catch(this.handleError)
  }
  getCategoryList(param: any): Promise<any>{
    return this.http
    .post(this.listCategoryApi, param)
    .toPromise()
    .then(response => response)
    .catch(this.handleError)
  }


addShipment(param: any): Promise<any>{
  return this.http
  .post(this.addShipmentApi, param)
  .toPromise()
  .then(response => response)
  .catch(this.handleError)
}

addCategory(param: any): Promise<any>{
  return this.http
  .post(this.addCategoryApi, param)
  .toPromise()
  .then(response => response)
  .catch(this.handleError)
}
  addContainer(param: any): Promise<any> {
    return this.http
      .post(this.addContainerApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  deleteContainer(param: any): Promise<any> {
    return this.http
      .post(this.deleteContainerApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  
  getGlobalPermissions(): Promise<any> {
    return this.http
      .get(this.getGlobalPermissionsApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getGlobalRolePermissions(param: any): Promise<any> {
    return this.http
      .get(this.getGlobalPermissionsApi)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getSelectedRole(param: any): Promise<any> {
    return this.http
      .post(this.getSelectedRoleApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }
  
  //delete
   deleteContactAddress(param: any): Promise<any> {
    return this.http
      .post(this.delContactApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  deleteProductType(param: any): Promise<any> {
    return this.http
      .post(this.delProductTypeApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getAttributes(param: any): Promise<any> {
    return this.http
      .post(this.getaatributeApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  addAttributes(param: any): Promise<any> {
    return this.http
      .post(this.addatributeApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  
  allforrmFields(param: any): Promise<any> {
    return this.http
      .get(this.allFormFieldsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  
  attributeDetails(param: any): Promise<any> {
    return this.http
      .post(this.attributeDetail, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  saveSettings(param: any): Promise<any> {
    return this.http
      .post(this.adminSettings, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getSettings(): Promise<any> {
    return this.http
      .get(this.getadminSettings)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  /*getPermissions(param: any): Promise<any> {
    return this.http
      .post(this.getRolePermissionsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }*/

}
