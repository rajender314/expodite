import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Subject } from "rxjs";

declare var App: any;

@Injectable({
  providedIn: "root",
})
export class LeadsService {
  dataPromise = new Subject<any>();
  SharingData = new Subject();
  FormSharingData = new Subject();
  formValidationErrors = new Subject();
  constructor(private http: HttpClient) {}
  private apiResponseSource = new BehaviorSubject<any>(null);
  private dynamicDropdownsSource = new BehaviorSubject<any>(null);
  apiResponse$ = this.apiResponseSource.asObservable();
  dynamicDropdowns = this.dynamicDropdownsSource.asObservable();
  sendApiResponse(data: any) {
    this.apiResponseSource.next(data);
  }
  sendDynaDropDownResponse(data: any) {
    this.dynamicDropdownsSource.next(data);
  }
  clearApiResponse() {
    this.apiResponseSource.next(null);
  }
  getStores(): Promise<any> {
    return this.http
      .get(App.api_url + "getStores")
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getOrgStoreAttributeList(param: any): Promise<any> {
    let url = App.base_url + "getOrgStoreAttributesWithMeta";
    if (param) {
      url =
        url +
        `?module=${param.module}&type=${
          param.editTypeForRestrict ? "edit" : ""
        }`;
    }
    return this.http
      .get(url)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  saveOrgStore(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "saveOrgStoreData", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDetailView(id: any): Promise<any> {
    return this.http
      .get(App.base_url + "getStores?id=" + id)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  createAppointment(param: any): Promise<any> {
    return this.http
      .post(App.api_url + "addAppointments", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getAppointmentList(param: any): Promise<any> {
    return this.http
      .get(App.api_url + "getAppointments?entity_type=1&entity_id=" + param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getQuotesList(param: any): Promise<any> {
    return this.http
      .get(App.api_url + "getQuotesList?entity_type=1&entity_id=" + param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  sentQuotesEmail(param: any): Promise<any> {
    return this.http
      .post(App.api_url + "sentQuotesEmail", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getAssigneeList(id): Promise<any> {
    return this.http
      .get(App.api_url + "getAssigneeList?entity_id=" + id)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteContact(param: any): Promise<any> {
    return this.http
      .post(App.api_url + "deleteEntityContacts", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getLeadContacts(param: any): Promise<any> {
    return this.http
      .post(App.api_url + "getLeadContacts", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  createQuote(param: any): Promise<any> {
    return this.http
      .post(App.api_url + "createQuotes", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getQuotePreview(param: any): Promise<any> {
    return this.http
      .get(App.api_url + "getQuotesPreview?printable=1&id=" + param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  saveAttributes(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "saveAttributeValues", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getAttributes(param: any): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `${
            param.overrideForm ? "overrideFormData" : "getAttributeValues"
          }?form_id=${param.module}&related_to_id=${
            param.related_to_id ? param.related_to_id : ""
          }&id=${param.id || ""}`
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  postDetailsData(data) {
    this.dataPromise.next(data);
  }

  getDetailsData() {
    return this.dataPromise.asObservable();
  }
  getFormDropdowns(param: any): Promise<any> {
    return this.http
      .get(param.api)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getShipmentProducts(param: any): Promise<any> {
    return this.http
      .post(`${App.base_url}getShipmentProducts`, param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getDropdowns(param: any): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `getDropdowns?module=${param.module}&form_control_name=${
            param.form_control_name ? param.form_control_name : ""
          }&search=${param.search ? param.search : ""}&type=${
            param.type ? param.type : ""
          }&id=${param.id ? param.id : ""}${
            param.related_to_id ? `&related_to_id=${param.related_to_id}` : ""
          }`
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getPaymentBalanceById(param: any): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `getPaymentBalanceById?id=${param.id}`
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getQuoteDropdowns(): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `getQuotations
          `
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getDependentDDS(param: any): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `getDependentDDS?module=${param.module}&id=${
            param.id
          }&form_control_name=${
            param.form_control_name ? param.form_control_name : ""
          }&type=${param.type ? param.type : ""}&related_to_id=${
            param.related_to_id ? param.related_to_id : ""
          } `
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getModuleSavedList(param: any): Promise<any> {
    return this.http
      .get(
        App.base_url +
          `getModuleSavedList?form_id=${param.form_id}&search=${
            param.search ? param.search : ""
          }&perPage=${param.perPage ? param.perPage : ""}&page=${
            param.page ? param.page : ""
          }&related_to_id=${param.related_to_id ? param.related_to_id : ""} `
      )
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getValidationTypes() {
    return this.http
      .get(App.base_url + `getValidationTypes`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
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
  getAttributesValues(param: any): Promise<any> {
    return this.http
      .get(App.base_url + `getAttributeValues?id=${param.id}&is_custom=true`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getEditPFiStoreAttributeList(param: any): Promise<any> {
    let url = App.base_url + "getFormFieldsMultiple";
    if (param) {
      url = url + "?name=" + param.module;
    }
    return this.http
      .get(url)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getPFIPOprodList(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "getPFIPOprodList", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getShipmentProductList(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "getShipmentProductList", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getOrderProducts(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "getOrderProducts", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getPoProducts(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "getPOProducts", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  verifyShipment(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "verifyShipment", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  createPO(param: any): Promise<any> {
    return this.http
      .post(App.base_url + "createPO", param)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getValidationTypesAdmin(params: any) {
    return this.http
      .get(App.base_url + `getValidationTypes?slug=${params.slug}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getFormatTypes(params: any) {
    return this.http
      .get(App.base_url + `getUploadTypes?slug=${params.slug}`)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
}
