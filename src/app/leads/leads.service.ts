import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

declare var App: any;

@Injectable()
export class LeadsService {

  dataPromise = new Subject<any>();
  constructor(private http: HttpClient) { }

  getStores(): Promise<any> {
    return this.http
      .get(App.api_url + 'getStores')
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }

  getOrgStoreAttributeList(param: any): Promise<any> {
    let url = App.api_url + 'getOrgStoreAttributesWithMeta';
    if (param && param.id) {
      url = url + '?id=' + param.id
    }
    return this.http
      .get(url)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }

  saveOrgStore(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'saveOrgStoreData', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getDetailView(id: any): Promise<any> {
    return this.http
      .get(App.api_url + 'getStores?id=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }

  createAppointment(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'addAppointments', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }

  getAppointmentList(param: any): Promise<any> {
    return this.http
      .get(App.api_url + 'getAppointments?entity_type=1&entity_id=' + param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getQuotesList(param: any): Promise<any> {
    return this.http
      .get(App.api_url + 'getQuotesList?entity_type=1&entity_id=' + param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  sentQuotesEmail(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'sentQuotesEmail', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }


  getAssigneeList(id): Promise<any> {
    return this.http
      .get(App.api_url + 'getAssigneeList?entity_id=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  deleteContact(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'deleteEntityContacts', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }

  getLeadContacts(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'getLeadContacts', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  createQuote(param: any): Promise<any> {
    return this.http
      .post(App.api_url + 'createQuotes', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getQuotePreview(param:any): Promise<any> {
    return this.http
      .get(App.api_url +'getQuotesPreview?printable=1&id=' + param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError) 

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
}
