import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


declare var App: any;

@Injectable()
export class CampaignService {

  private getListCampaignApi = App.base_url + 'listCampaign';
  private viewCampaignApi = App.base_url + 'viewCampaign';

  constructor(private http: HttpClient) { }

  getCampaignsList(param: any): Promise<any> {
    return this.http
      .post(this.getListCampaignApi, param)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  viewCampaign(param: any): Promise<any> {
    return this.http
      .post(this.viewCampaignApi, param)
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
