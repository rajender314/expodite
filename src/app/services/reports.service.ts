import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule, CanActivate } from '@angular/router';
import * as _ from 'lodash';

declare var App: any;

@Injectable({
  providedIn: 'root'
})
export class ReportsService implements CanActivate {
  public routeAllowed = false;
  public searchArray = [];
  public viewId;
  public reportId;
  private trigerData = new Subject<any>();

  handleError: (reason: any) => any;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: 'Reports'
    });
    // console.log(i)
    if( i > -1  && App.env_configurations.env_config[i].display == 'yes') {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
  
    }
    if (((ActivatedRouteSnapshot.routeConfig.path == 'reports') &&
     App.user_roles_permissions.filter(function (value) { return (value.code == 'reports' && value.selected); }).length) &&
     this.routeAllowed
    ) {

      return true;
    } else {
      this.router.navigate(['access-denied']);
      return false;
    }

  }

  private reloadCurrentRoute = false;
  
  
  
  
  private ordersReportApi = App.base_url + 'ordersReport';
  private ordersByStatusReportApi = App.base_url + 'ordersByStatusReport';
  private ordersDueByClientsReporttApi = App.base_url + 'ordersDueByClientsReport';
  private salesYearToDateReporttApi = App.base_url + 'salesYearToDateReport';
  private salesMonthToDateReporttApi = App.base_url + 'salesMonthToDateReport';
  private paymentDueReportApi = App.base_url + 'paymentDueReport';
  private shipmentsReportApi = App.base_url + 'shipmentsReport';
  private getRequiredDataForFiltersApi = App.base_url + 'getRequiredDataForFilters';
  private saveReportsViewsApi = App.base_url + 'saveView';
  private getReportsViewsApi = App.base_url + 'getViews';
  private deleteViewApi = App.base_url + 'deleteView'; 
  private inventoryReportApi = App.base_url + 'inventoryReport';


  

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  reloadRoute(list) {
    // console.log(list.route)
    // console.log(this.location)
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate([`/reports/` + list.route]);
    
  }

  getActiveRoute() {
    // return this.activeRoute;
  }
  
  setTriggerData(data) {
    this.trigerData.next(data)
  }

  getTriggerData() {
    return this.trigerData.asObservable();
  }

  ordersReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  ordersByStatusReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersByStatusReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  ordersByStatusReportExport(params: any): Promise<any> {
    return this.http
      .post(this.ordersByStatusReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  ordersDueByClientsReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersDueByClientsReporttApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  salesYearToDateReport(params: any): Promise<any> {
    return this.http
      .post(this.salesYearToDateReporttApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  salesMonthToDateReport(params: any): Promise<any> {
    return this.http
      .post(this.salesMonthToDateReporttApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  paymentDueReport(params: any): Promise<any> {
    return this.http
      .post(this.paymentDueReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  shipmentsReport(params: any): Promise<any> {
    return this.http
      .post(this.shipmentsReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getRequiredDataForFilters(params: any): Promise<any> {
    return this.http
      .post(this.getRequiredDataForFiltersApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  saveViews(params: any): Promise<any> {
    return this.http
      .post(this.saveReportsViewsApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  getViewsList(params: any): Promise<any> {
    return this.http
      .post(this.getReportsViewsApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  deleteViewItem(params: any): Promise<any> {
    return this.http
      .post(this.deleteViewApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  inventoryReport(params: any): Promise<any> {
    return this.http
      .post(this.inventoryReportApi, params)
      .toPromise()
      .then(response => response)
      .catch(this.handleError)
  }
  // getting grid info

  // tslint:disable-next-line:max-line-length
  getGridInfo(gridObj) {
    const rowGroupArray = [];
    gridObj.groupInfo.forEach((row: { [x: string]: any }) => {
      rowGroupArray.push(row['colId']);
    });

    const fitlerInfoArray = [];
    fitlerInfoArray.push(gridObj.filterInfo);

    const valColumnInfoArray = [];
    gridObj.valColumnInfo.forEach((row: { [x: string]: any }) => {
      valColumnInfoArray.push(row['colId']);
    });

    const inVisibleColumnsInfoArray = [];
    gridObj.allColumnsInfo.forEach((row: { [x: string]: any }) => {
      if (row['visible'] !== true) {
        inVisibleColumnsInfoArray.push(row['colId']);
      }
    });

    const pivoteModeInfo = gridObj.pivoteMode;
    const sortColumns = gridObj.sortColumns;

    const allPivoteColumnsArray = [];
    gridObj.allPivoteColumns.forEach((row: { [x: string]: any }) => {
      allPivoteColumnsArray.push(row['colId']);
    });

    const gridInfo = {
      groupInfo: rowGroupArray,
      filterInfo: fitlerInfoArray,
      valColumnInfo: valColumnInfoArray,
      inVisibleColumnsInfo: inVisibleColumnsInfoArray,
      pivoteMode: pivoteModeInfo,
      allPivoteColumns: allPivoteColumnsArray,
      sortColumns: sortColumns,
      searchInfo: gridObj.searchInfo,
      columnState: gridObj.columnState
    };

    return gridInfo;
  }

}
