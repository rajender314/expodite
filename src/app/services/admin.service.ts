import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { RouterModule, CanActivate } from "@angular/router";
import * as _ from "lodash";
import { FormGroup } from "@angular/forms";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

declare var App: any;

@Injectable({
  providedIn: "root",
})
export class AdminService implements CanActivate {
  public routeAllowed = false;
  public instanceName = "";
  public loggedUserEmail = "";
  public uomData = [];
  public manageAccount = "";
  public isRoleEditable = false;

  public isAddProducts = false;
  public isClient = false;
  public rolePermissions: any = []
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    // console.log(ActivatedRouteSnapshot)

    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: "Admin",
    });
    // console.log(i)
    if (i > -1 && App.env_configurations.env_config[i].display == "yes") {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
    }
    if (
      ActivatedRouteSnapshot.routeConfig.path == "admin" &&
      App.user_roles_permissions.filter(function (value) {
        return value.code == "admin" && value.selected;
      }).length &&
      this.routeAllowed
    ) {
      return true;
    } else {
      this.router.navigate(["access-denied"]);
      return false;
    }
  }
  public appFnvironment = "";
  private reloadCurrentRoute = false;
  private activeRoute = "roles";
  private listClientsApi = App.base_url + "listClients";
  private updateConvRatesApi = App.base_url + "updateConvRates";
  private addClientApi = App.base_url + "addClient";
  //private getSocialMediaApi = App.base_url + 'getSocialMedia';

  private listRolesApi = App.base_url + "listRoles";
  // private listContactsApi = App.base_url + "getCompanyShpAddr";
  private listContactsApi = App.base_url + "getCompanyShipperAddress";

  private listCustomsAddrApi = App.base_url + "getCustomsAddr";
  //private listProductsApi = App.base_url + 'getListProductsTypes';
  private listProductsApi = App.base_url + "getProductTypes";
  private delContactApi = App.base_url + "deleteShpAddr";
  private delCustomsAddrApi = App.base_url + "deleteCustomsAddr";
  private delProductTypeApi = App.base_url + "deleteProductTypes";

  private addRoleApi = App.base_url + "addRole";

  private listContainersApi = App.base_url + "getListContainers";
  private categoryDataApi = App.base_url + "categoryDt";
  private getAuthorizemail = App.base_url + "getauthorizeUrl";
  private getauthorizeUser = App.base_url + "getauthorizeUser";

  private addContainerApi = App.base_url + "addContainers";
  private addShipmentApi = App.base_url + "addModeTransport";
  private addCategoryApi = App.base_url + "addCategories";
  private deleteContainerApi = App.base_url + "deleteContainer";
  private addContactAddressApi = App.base_url + "addCompanyShpAddr";
  private addCustomsAddressApi = App.base_url + "addCustomsAddr";
  private addProductTypeApi = App.base_url + "addProductsTypes";
  private getGlobalPermissionsApi = App.base_url + "getGlobalData";
  private listShipmentApi = App.base_url + "getListModeTransport";
  private listCategoryApi = App.base_url + "getListCategories";
  //private getRolePermissionsApi = App.base_url + 'getPermissions';
  private getSelectedRoleApi = App.base_url + "roleDetails";
  private addCountryApi = App.base_url + "addCountry";
  private addStateApi = App.base_url + "addState";
  private envConfigurations = App.base_url + "envConfigurations";
  // private getaatributeApi = App.api_url + "getAttributes";
  private getaatributeApi = App.base_url + "getAttributes";
  private getModulesApi = App.base_url + "getModules";
  // private addatributeApi = App.api_url + "addStoreAttributes";
  private addatributeApi = App.base_url + "addStoreAttributes";
  // private allFormFieldsApi = App.api_url + "listOfUielements";
  private allFormFieldsApi = App.base_url + "listOfUielements";
  // private attributeDetail = App.api_url + "attributeDetails";
  private attributeDetail = App.base_url + "attributeDetails";
  private adminSettings = App.base_url + "saveSettings";
  private getadminSettings = App.base_url + "getSettings";
  private uomDataApi = App.base_url + "getUomData";
  private getConvRates = App.base_url + "getConvRates";
  private icegateExchrates = App.base_url + "icegateExchrates";
  private addicegateExchRates = App.base_url + "addIceGateExchRates";
  private generateEinvoiceApi = App.base_url + "generateEinvoice";
  private cancelEinvoiceApi = App.base_url + "cancelEinvoice";
  private showEinvoiceApi = App.base_url + "showEinvoice";

  /**  PVM feature API */
  private addIncoTermtApi = App.base_url + "addIncoTerms";
  private importFileuploader = App.base_url + "importData";
  private listIncoTermApi = App.base_url + "getIncoTerms";
  private sampleFile = App.base_url + "sampleDownload";
  private sampleAvl = App.base_url + "isSampleFileAvailable";
  private importfile = App.base_url + "importData";
  private saveBankdetails = App.base_url + "saveBankDetails";
  private bankList = App.base_url + "listBanks";
  private prdeleteBanks = App.base_url + "preDeleteBank";
  private deleteBankitem = App.base_url + "deleteBank";
  private OrganisationsContactsApi = App.base_url + "addOrgContacts";
  private dropdownDataApi = App.base_url + "DropdownData";
  private getgridList = App.base_url + "getGridList";
  private documentTemplateApi = App.base_url + "documentTemplate";
  private documentTemplatesApi = App.base_url + "getDocumentTemplates";
  private getDocumentDefaultTemplatesApi =
    App.base_url + "getDocumentDefaultTemplates";
  private postCreateNewForm = App.base_url + "createNewForm";
  private DocumentTemplateTypes = App.base_url + "getDocumentTemplateTypes";
  private saveNumberSeriesSettings = App.base_url + "saveNumberSeriesSettings";

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  reloadRoute(list) {
    // console.log(list.route)
    // console.log(this.location)
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate([`/admin/` + list.route]);
    this.activeRoute = list.route;
  }

  getActiveRoute() {
    return this.activeRoute;
  }

  getClientsList(param: any): Promise<any> {
    return this.http
      .post(this.listClientsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  updateConvRates(param: any): Promise<any> {
    return this.http
      .post(this.updateConvRatesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addicegateExchRateApi(param) {
    return this.http
      .post(this.addicegateExchRates, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  icegateExchRateApi(param) {
    return this.http
      .post(this.icegateExchrates, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getConversionRateData() {
    return this.http
      .post(this.getConvRates, {})
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getEnvDetails(param) {
    return this.http
      .post(this.envConfigurations, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getEnvConfigs(param: any): Observable<any> {
    return this.http.post<any>(this.envConfigurations, param);
  }

  generateEinvoice(param: any): Promise<any> {
    return this.http
      .post(this.generateEinvoiceApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  cancelEinvoice(param: any): Promise<any> {
    return this.http
      .post(this.cancelEinvoiceApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  showEinvoice(param: any): Promise<any> {
    return this.http
      .post(this.showEinvoiceApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addClient(param: any): Promise<any> {
    return this.http
      .post(this.addClientApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addCountry(param: any): Promise<any> {
    return this.http
      .post(this.addCountryApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addState(param: any): Promise<any> {
    return this.http
      .post(this.addStateApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
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
    console.error("An error occurred", error);
    return Promise.reject(error.message || error);
  }

  getCategoryData() {
    return this.http
      .get(this.categoryDataApi)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getAuthrozemail() {
    return this.http
      .get(this.getAuthorizemail)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getAuthUser(param: any): Promise<any> {
    return this.http
      .post(this.getauthorizeUser, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getRolesList(param: any): Promise<any> {
    return this.http
      .post(this.listRolesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getContactsList(param: any): Promise<any> {
    return this.http
      .post(this.listContactsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getCustomsAddrList(param: any): Promise<any> {
    return this.http
      .post(this.listCustomsAddrApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getProductsList(param: any): Promise<any> {
    return this.http
      .post(this.listProductsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getUomData(param: any): Promise<any> {
    return this.http
      .post(this.uomDataApi, param)
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

  addContactAddress(param: any): Promise<any> {
    return this.http
      .post(this.addContactAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addCustomsAddr(param: any): Promise<any> {
    return this.http
      .post(this.addCustomsAddressApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addProductType(param: any): Promise<any> {
    return this.http
      .post(this.addProductTypeApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getContainersList(param: any): Promise<any> {
    return this.http
      .post(this.listContainersApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getShipmentsList(param: any): Promise<any> {
    return this.http
      .post(this.listShipmentApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getCategoryList(param: any): Promise<any> {
    return this.http
      .post(this.listCategoryApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addShipment(param: any): Promise<any> {
    return this.http
      .post(this.addShipmentApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addCategory(param: any): Promise<any> {
    return this.http
      .post(this.addCategoryApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addContainer(param: any): Promise<any> {
    return this.http
      .post(this.addContainerApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  deleteContainer(param: any): Promise<any> {
    return this.http
      .post(this.deleteContainerApi, param)
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

  getGlobalRolePermissions(param: any): Promise<any> {
    return this.http
      .get(this.getGlobalPermissionsApi)
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

  //delete
  deleteContactAddress(param: any): Promise<any> {
    return this.http
      .post(this.delContactApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteCustomsAddr(param: any): Promise<any> {
    return this.http
      .post(this.delCustomsAddrApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteProductType(param: any): Promise<any> {
    return this.http
      .post(this.delProductTypeApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getAttributes(param: any): Promise<any> {
    return this.http
      .post(this.getaatributeApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  addAttributes(param: any): Promise<any> {
    return this.http
      .post(this.addatributeApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  allforrmFields(param: any): Promise<any> {
    return this.http
      .get(this.allFormFieldsApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  attributeDetails(param: any): Promise<any> {
    return this.http
      .post(this.attributeDetail, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveSettings(param: any): Promise<any> {
    return this.http
      .post(this.adminSettings, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getSettings(): Promise<any> {
    return this.http
      .get(this.getadminSettings)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  /*getPermissions(param: any): Promise<any> {
    return this.http
      .post(this.getRolePermissionsApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }*/

  /****** PVM features ************************/
  getIncoTermList(param: any): Promise<any> {
    return this.http
      .post(this.listIncoTermApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  addIncoTerms(param: any): Promise<any> {
    return this.http
      .post(this.addIncoTermtApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  importFileupload(param: any): Promise<any> {
    return this.http
      .post(this.importFileuploader, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  sampleDownloadFile(param: any): Promise<any> {
    return this.http
      .post(this.sampleFile, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  sampleAvailable(param: any): Promise<any> {
    return this.http
      .post(this.sampleAvl, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  importFile(param: any): Promise<any> {
    return this.http
      .post(this.importfile, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  saveDankDetails(param: any): Promise<any> {
    return this.http
      .post(this.saveBankdetails, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  // bankdDetailsList(param: any): Promise<any>{
  //   return this.http
  //   .post(this.bankList, param)
  //   .toPromise()
  //   .then(response => response)
  //   .catch(this.handleError)
  // }
  bankdDetailsList(): Promise<any> {
    return this.http
      .get(this.bankList)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  prdeleteBank(param: any): Promise<any> {
    return this.http
      .post(this.prdeleteBanks, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteBank(param: any): Promise<any> {
    return this.http
      .post(this.deleteBankitem, param)
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

  getTaxTypeList(): Promise<any> {
    return this.http
      .get(this.dropdownDataApi + "?type=tax_type")
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getMasterDDList(param): Promise<any> {
    return this.http
      .get(`${this.dropdownDataApi}?type=${param.type}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getModules(param: any): Promise<any> {
    return this.http
      .post(this.getModulesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  public moduleName = "";
  formEmitEvent(ev: FormGroup, form: FormGroup, module?: string) {
    form.markAsDirty();
    this.moduleName = module;
    console.log(ev, form);
    if (ev.invalid === true) {
      form.setErrors({ invalid: true });
    } else {
      form.setErrors(null);
      form.updateValueAndValidity();
    }
  }
  getGridList(param: any): Promise<any> {
    console.log(param, "name");
    return this.http
      .get(
        App.base_url + `getGridList?name=${param.name}&search=${param.search} `
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveDocumentTemplate(param: any): Promise<any> {
    return this.http
      .post(this.documentTemplateApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDocumentTemplates(param: any): Promise<any> {
    return this.http
      .post(this.documentTemplatesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getDocumentDefaultTemplates(param: any): Promise<any> {
    return this.http
      .post(this.getDocumentDefaultTemplatesApi, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  updateDocumentTemplate(param: any, id: any): Promise<any> {
    return this.http
      .put(`${this.documentTemplateApi}/${id}`, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDocumentTemplateTypes(): Promise<any> {
    return this.http
      .get(`${this.DocumentTemplateTypes}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  // getSecondLevelMenus(): Promise<any> {
  //   return this.http
  //     .get(`${App.base_url}secondLevelMenus`)
  //     .toPromise()
  //     .then((response) => response)
  //     .catch(this.handleError);
  // }
  createNewForm(param: any): Promise<any> {
    return this.http
      .post(this.postCreateNewForm, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  public permissionsSubject =  new BehaviorSubject<any>([]);
  getUserPermissionsApi() : any{
     return this.http.get<any>(App.base_url + 'getUserPermissions').
      subscribe(((res) => {
        this.permissionsSubject.next(res.result.data); 
        // this.setPermissions(res)
      }),
      catchError(this.handleError)
    );
    // this.permissionsSubject.next("123"); 
  }
  public SecondLevelMenus  =  new BehaviorSubject<any>([]);
  getSecondLevelMenus(): any {
    return this.http.get<any>(App.base_url + 'secondLevelMenus').
      subscribe(((res) => {
        this.SecondLevelMenus.next(res.result.data.env_config); 
        // this.setPermissions(res)
      }),
      catchError(this.handleError)
    );
  }
  getPermissions() {
    return this.permissionsSubject.asObservable();
  }
  setPermissions(res) {
  this.permissionsSubject.next(res); 
  }
  public blue = new BehaviorSubject<boolean>(false);

  setBlue(changeToggle: boolean) {
    this.blue.next(changeToggle);
  }

  getBlue() {
    return this.blue.asObservable();
  }

  public modulueTypeId = new BehaviorSubject<string>("");
  setModuleId(Id) {
    this.modulueTypeId.next(Id);
  }
  getModuleId() {
    return this.modulueTypeId.asObservable();
  }
  public globalPermissions$ = new BehaviorSubject<any>("")
  setGlobalPerm(changeToggle: any) {
    this.globalPermissions$.next(changeToggle);
  }

  getGlobalPerm() {
    return this.globalPermissions$.asObservable();
  }
  public permissionDeps;
  getPermissionDependencies() {
    return this.http
      .get(App.base_url + 'getPermissionDependencies')
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveNumberSeriesSettingsApi(param: any): Promise<any> {
    return this.http
      .post(this.saveNumberSeriesSettings, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getNumberSeriesSettings(param: any): Promise<any> {
    return this.http
      .get(App.base_url + `getNumberSeriesSettings?type=${param.type}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  // getPermissions(): string[] {
  //   return this.permissionsSubject.value;
  // }

  // hasPermission(permission: string): boolean {
  //   return this.getPermissions().includes(permission);
  // }
}
