import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { RouterModule, CanActivate, Router } from "@angular/router";
import { Subject, BehaviorSubject } from "rxjs";
import * as _ from "lodash";

declare var App: any;

@Injectable({
  providedIn: "root",
})
export class OrganizationsService implements CanActivate {
  public productsList = new Subject<any>();
  public clientCurrency = new Subject();
  public allCountries = [];
  // public clientCurrency = new BehaviorSubject('');
  // currentMessage = this.clientCurrency.asObservable();

  private listOrganizationsApi = App.base_url + "listOrganizations";
  private getCancelledPFI = App.base_url + "getCancelledPFI";

  private addorganizationsApi = App.base_url + "addOrganizations";
  private addProductsApi = App.base_url + "addMyProducts";
  private addfob = App.base_url + "addFob";
  private organizationsDetailsApi = App.base_url + "organizationsDetails";
  private ListAddressApi = App.base_url + "listAddressOrg";
  private OrganizationAddressApi = App.base_url + "addOrgAddress";
  private ChangeOrgStatusApi = App.base_url + "changeOrgStatus";
  private SaveDocumentTypesApi = App.base_url + "addOrgDcmType";
  private saveProductTypesApi = App.base_url + "saveOrgProducts";
  private preDeleteOrgAddressApi = App.base_url + "preDeleteOrgAddr";
  private DeleteOrgAddressApi = App.base_url + "deleteOrgAddr";

  private ListDocumentsOrgApi = App.base_url + "listDocumentsOrg";
  private addSettingsApi = App.base_url + "userRegister";
  private deleteuploadedTLAApi = App.base_url + "deleteuploadedTLA";

  private listRolesApi = App.base_url + "listRoles";
  private myProductApi = App.base_url + "listMyProducts";
  private addRoleApi = App.base_url + "addRole";
  private getGlobalPermissionsApi = App.base_url + "getGlobalData";
  private getSelectedRoleApi = App.base_url + "roleDetails";
  private getGlobalOrganizationsApi = App.base_url + "getGlobalOrg";
  private ListProductsOrgApi = App.base_url + "getOrgProducts";
  private downloadProductCertificate =
    App.base_url + "downloadProductCertificate";
  private OrganisationsContactsApi = App.base_url + "addOrgContacts";
  private listContactsApi = App.base_url + "getListContactOrg";
  private deleteContactsApi = App.base_url + "deleteOrgContactId";

  private ClientSettingsApi = App.base_url + "clientDetails";
  private addOrgSpclInsApi = App.base_url + "addOrgSpclIns";
  private listOrgSpclInsApi = App.base_url + "listOrgSpclIns";
  private deleteOrgSpclInsApi = App.base_url + "deleteOrgSpclIns";
  private getTLAapi = App.base_url + "getuploadedTLA";
  private deleteTLAapi = App.base_url + "deleteuploadedTLA";
  private getProductsFilesApi = App.base_url + "getProductsFiles";
  private deleteProductsFilesApi = App.base_url + "deleteProductsFiles";
  private getCertAttachDetailsApi = App.base_url + "getCertAttachDetails";
  private companyDetailsApi = App.base_url + "getCompanyDetails";
  private saveorganizationsApi = App.base_url + "saveCompanyDetails";
  public routeAllowed = false;

  // clientProfile = App.user_roles_permissions.code;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: "Clients",
    });
    if (i > -1 && App.env_configurations.env_config[i].display == "yes") {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
    }

    // if (((ActivatedRouteSnapshot.routeConfig.path === 'clients') &&
    //   App.user_roles_permissions.filter(function (value) { return (value.code === 'clients' && value.selected); }).length)
    // ) {

    //   return true;
    // } else {
    //   return false;
    // }

    if (
      ActivatedRouteSnapshot.routeConfig.path == "clients" &&
      App.user_roles_permissions.filter(function (value) {
        return value.code == "clients" && value.selected;
      }).length &&
      this.routeAllowed
    ) {
      //  console.log(ActivatedRouteSnapshot)
      return true;
    } else {
      this.router.navigate(["access-denied"]);
      return false;
    }
  }
  constructor(private http: HttpClient, public router: Router) {}

  //  checkClientProfilePermission(){
  //   let index = this.clientProfile.findIndex(x => x.code == "client_interface" && x.selected == true);
  //    return (index > -1);
  // }
  getOrganizationsList(param: any): Promise<any> {
    return this.http
      .post(this.listOrganizationsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getCancelledPFICount(param: any): Promise<any> {
    return this.http
      .post(this.getCancelledPFI, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  // changeMessage(message: string) {
  //   this.clientCurrency.next(message);
  // }

  getOrganizationsDetails(param: any): Promise<any> {
    return this.http
      .post(this.organizationsDetailsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addfobvalue(param: any): Promise<any> {
    return this.http
      .post(this.addfob, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addorganizations(param: any): Promise<any> {
    return this.http
      .post(this.addorganizationsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addProducts(param: any): Promise<any> {
    return this.http
      .post(this.addProductsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  /* For Demo Purpose */
  private handleError(error: any): Promise<any> {
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }

  getRolesList(param: any): Promise<any> {
    return this.http
      .post(this.listRolesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getMyProductList(param: any): Promise<any> {
    return this.http
      .post(this.myProductApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getProductsFiles(param: any): Promise<any> {
    return this.http
      .post(this.getProductsFilesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteProductsFiles(param: any): Promise<any> {
    return this.http
      .post(this.deleteProductsFilesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getCertAttachDetails(param: any): Promise<any> {
    return this.http
      .post(this.getCertAttachDetailsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getTLA(param: any): Promise<any> {
    return this.http
      .post(this.getTLAapi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteTLA(param: any): Promise<any> {
    return this.http
      .post(this.deleteTLAapi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addRole(param: any): Promise<any> {
    return this.http
      .post(this.addRoleApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getGlobalPermissions(): Promise<any> {
    return this.http
      .get(this.getGlobalPermissionsApi)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addSettings(data: any): Promise<any> {
    return this.http
      .post(this.addSettingsApi, data)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getSelectedRole(param: any): Promise<any> {
    return this.http
      .post(this.getSelectedRoleApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getGlobalOrganizations(): Promise<any> {
    return this.http
      .get(this.getGlobalOrganizationsApi)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  ListAddress(param: any): Promise<any> {
    return this.http
      .post(this.ListAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  OrganizationAddress(param: any): Promise<any> {
    return this.http
      .post(this.OrganizationAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  changeOrgStatus(param: any): Promise<any> {
    return this.http
      .post(this.ChangeOrgStatusApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveDocumentTypes(param: any): Promise<any> {
    return this.http
      .post(this.SaveDocumentTypesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveProductTypes(param: any): Promise<any> {
    return this.http
      .post(this.saveProductTypesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteOrgAddress(param: any): Promise<any> {
    return this.http
      .post(this.DeleteOrgAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  predeleteOrgAddress(param: any): Promise<any> {
    return this.http
      .post(this.preDeleteOrgAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDocumentsList(param: any): Promise<any> {
    return this.http
      .post(this.ListDocumentsOrgApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  listContacts(param: any): Promise<any> {
    return this.http
      .post(this.listContactsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  clientDetails(param: any): Promise<any> {
    return this.http
      .post(this.ClientSettingsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  OrganizationContacts(param: any): Promise<any> {
    return this.http
      .post(this.OrganisationsContactsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  OrganizationContactsDelete(param: any): Promise<any> {
    return this.http
      .post(this.deleteContactsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getProductsList(param: any): Promise<any> {
    return this.http
      .post(this.ListProductsOrgApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  downloadCertificates(param: any): Promise<any> {
    return this.http
      .post(this.downloadProductCertificate, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getaddOrgSpclIns(param: any): Promise<any> {
    return this.http
      .post(this.addOrgSpclInsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getlistOrgSpclIns(param: any): Promise<any> {
    return this.http
      .post(this.listOrgSpclInsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDeleteOrgSpclInsApi(param: any): Promise<any> {
    return this.http
      .post(this.deleteOrgSpclInsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deluploadedTLA(param: any): Promise<any> {
    return this.http
      .post(this.deleteuploadedTLAApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getCompanyDetails(): Promise<any> {
    return this.http
      .get(this.companyDetailsApi)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveCompanyDetails(param: any): Promise<any> {
    return this.http
      .post(this.saveorganizationsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
}
