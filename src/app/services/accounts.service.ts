import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule, CanActivate, Router } from '@angular/router';
import { promise } from 'protractor';
import * as _ from 'lodash';
declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) { }
  getListIGST(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'getListIGST', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getIGSTGlobalFilters(): Promise<any> {
    return this.http
      .get(App.base_url + 'getIGSTGlobalFilters')
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  updateAmounts(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'updateAmounts', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getListCreditNotes(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'getListCreditNotes', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getNotesFilters(): Promise<any> {
    return this.http
      .get(App.base_url + 'getNotesFilters')
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }


  getAmountsHist(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'getAmountsHist', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  updateHistAmount(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'updateHistAmount', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  NotesDrpDwn(param): Promise<any> {
    return this.http
    .post(App.base_url + 'getNotesDrpDwn', param) 
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  saveCreditNote(param): Promise<any> {
    return this.http
    .post(App.base_url + 'saveCreditNote', param) 
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  getListDebitNotes(param: any): Promise<any> {
    return this.http
      .post(App.base_url + 'getListDebitNotes', param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }

  
  saveDebitNote(param): Promise<any> {
    return this.http
    .post(App.base_url + 'saveDebitNote', param) 
      .toPromise()
      .then(response => response)
      .catch(this.handleError)

  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

}
