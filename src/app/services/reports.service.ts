import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { RouterModule, CanActivate } from "@angular/router";
import * as _ from "lodash";
import { IServerSideDatasource } from "ag-grid-community";
import moment = require("moment");
import { CustomLoadingCellRenderer } from "../shared/ag-grid-view/custom-ag-loader";

declare var App: any;

@Injectable({
  providedIn: "root",
})
export class ReportsService implements CanActivate {
  public routeAllowed = false;
  public searchArray = [];
  public viewId;
  public reportId;
  private trigerData = new Subject<any>();
  private gridFilterCount = new Subject<any>();
  public gridOptions = {
    frameworkComponents: {
      customLoadingOverlay: CustomLoadingCellRenderer,
    },
    loadingOverlayComponent: 'customLoadingOverlay',
  };

  setFilterData(data) {
    this.gridFilterCount.next(data);
  }
  getFilterData() {
    return this.gridFilterCount.asObservable();
  }
  handleError: (reason: any) => any;
  canActivate(ActivatedRouteSnapshot?, RouterStateSnapshot?) {
    let i = _.findIndex(<any>App.env_configurations.env_config, {
      name: "Reports",
    });
    // console.log(i)
    if (i > -1 && App.env_configurations.env_config[i].display == "yes") {
      this.routeAllowed = true;
    } else {
      this.routeAllowed = false;
    }
    if (
      ActivatedRouteSnapshot.routeConfig.path == "reports" &&
      App.user_roles_permissions.filter(function (value) {
        return value.code == "reports" && value.selected;
      }).length &&
      this.routeAllowed
    ) {
      return true;
    } else {
      this.router.navigate(["access-denied"]);
      return false;
    }
  }

  private reloadCurrentRoute = false;

  private ordersReportApi = App.base_url + "ordersReport";
  private ordersByStatusReportApi = App.base_url + "ordersByStatusReport";
  private ordersDueByClientsReporttApi =
    App.base_url + "ordersDueByClientsReport";
  private salesYearToDateReporttApi = App.base_url + "salesYearToDateReport";
  private salesMonthToDateReporttApi = App.base_url + "salesMonthToDateReport";
  private paymentDueReportApi = App.base_url + "paymentDueReport";
  private shipmentsReportApi = App.base_url + "shipmentsReport";
  private getRequiredDataForFiltersApi =
    App.base_url + "getRequiredDataForFilters";
  private saveReportsViewsApi = App.base_url + "saveView";
  private getReportsViewsApi = App.base_url + "getViews";
  private deleteViewApi = App.base_url + "deleteView";
  private inventoryReportApi = App.base_url + "inventoryReport";
  // private exportRegisterApi = App.base_url + 'getExportRegister';
  private exportRegisterApi = App.base_url + "getReports";

  private getReportsApi = App.base_url + "getReports";
  private getFiltersDataApi = App.base_url + "getReportsFiltersData";

  public noRowsTemplate;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {
    this.noRowsTemplate = `<span>No Data Found</span>`;
  }

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
    this.trigerData.next(data);
  }

  getTriggerData() {
    return this.trigerData.asObservable();
  }

  ordersReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  ordersByStatusReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersByStatusReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  ordersByStatusReportExport(params: any): Promise<any> {
    return this.http
      .post(this.ordersByStatusReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  ordersDueByClientsReport(params: any): Promise<any> {
    return this.http
      .post(this.ordersDueByClientsReporttApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  salesYearToDateReport(params: any): Promise<any> {
    return this.http
      .post(this.salesYearToDateReporttApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  salesMonthToDateReport(params: any): Promise<any> {
    return this.http
      .post(this.salesMonthToDateReporttApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  paymentDueReport(params: any): Promise<any> {
    return this.http
      .post(this.paymentDueReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  shipmentsReport(params: any): Promise<any> {
    return this.http
      .post(this.shipmentsReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getRequiredDataForFilters(params: any): Promise<any> {
    return this.http
      .post(this.getRequiredDataForFiltersApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getFiltersData(params: any): Promise<any> {
    return this.http
      .post(this.getFiltersDataApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  saveViews(params: any): Promise<any> {
    return this.http
      .post(this.saveReportsViewsApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getViewsList(params: any): Promise<any> {
    return this.http
      .post(this.getReportsViewsApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  deleteViewItem(params: any): Promise<any> {
    return this.http
      .post(this.deleteViewApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  inventoryReport(params: any): Promise<any> {
    return this.http
      .post(this.inventoryReportApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  exportRegister(params: any): Promise<any> {
    return this.http
      .post(this.exportRegisterApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }

  getReports(params: any): Promise<any> {
    return this.http
      .post(this.getReportsApi, params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  getReportHeaders2(params: any): Promise<any> {
    return this.http
      .post(App.base_url + "getReportHeaders", params)
      .toPromise()
      .then((response) => response)
      .catch(this.handleError);
  }
  gridColumnApi;
  viewMyId;

  getServerSideDatasource(
    gridApi: any,
    gridParams: any,
    apiUrl: string,
    updateCounts: (
      listCount: number,
      totalCount: number,
      gridParams: any
    ) => void,
    gridColumnApi?: any,
    viewlist?: any,
    routeId?: any
  ): IServerSideDatasource {
    this.gridColumnApi = gridColumnApi;

    if (routeId) {
      this.getSelectedView(routeId, viewlist);
    } else {
      this.savedViewValue = 1;
    }
    return {
      getRows: (params) => {
        setTimeout(() => {
          gridApi.showLoadingOverlay();

          const sortModel = gridApi.getSortModel();
          if (sortModel.length) {
            gridParams["sort_key"] = sortModel.length ? sortModel[0].colId : "";
            gridParams["sort"] = sortModel.length ? sortModel[0].sort : "";
            gridParams["offset"] = new Date().getTimezoneOffset();
            this.gridParams = {
              ...this.gridParams,
              ...gridParams,
            };

            this.http.post(apiUrl, this.gridParams).subscribe(
              (res: any) => {
                if (res.result.success) {
                  const data = res.result.data;
                  const totalCount = data.total_count;
                  const listCount = data.items_count;
                  // if(this.gridParams.clear) {
                  //   this.filterCount = ""
                  // }
                  updateCounts(listCount, totalCount, this.gridParams);

                  setTimeout(() => {
                    if (listCount) {
                      gridApi.hideOverlay();
                    } else {
                      gridApi.showNoRowsOverlay();
                    }
                    params.successCallback(data.finalReportData, listCount);
                    const index = _.findIndex(viewlist, { view_id: routeId });
                    this.currentGridInfo =
                      index > 0 ? viewlist[index].grid_info : null;
                    if (this.currentGridInfo) {
                      // this.setGridOptions(this.currentGridInfo);
                    } else {
                      if(this.gridColumnApi) {
                        this.gridColumnApi.resetColumnState();
                      }
                    }
                  }, 200);
                } else {
                  params.failCallback();
                }
              },
              (error) => {
                console.error("Error fetching data:", error);
                params.failCallback();
              }
            );
          }
        }, 0);
      },
    };
  }

  public savedReportData;
  public gridParams: any = {};
  savedViewValue;
  filterCount: any = "";
  currentGridInfo;
  getSelectedView(id, viewlist) {
    if (id == 1) {
    } else {
      const index = _.findIndex(viewlist, { view_id: id });
      this.savedViewValue = id;
      const filterDataInfo = index > 0 ? viewlist[index].applied_filters : [];
      this.savedReportData = filterDataInfo;
      if (filterDataInfo != "") {
        if (viewlist[index].module == "forex_report") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedClients"] = filterDataInfo.selectedClients;
          this.gridParams["selectedCurrency"] = filterDataInfo.selectedCurrency;
          this.filterCount =
            filterDataInfo?.selectedClients?.length +
            filterDataInfo?.selectedCurrency?.length +
            2;
          if (filterDataInfo?.selectedDuration) {
            this.filterCount++;
          }
        } else if (
          viewlist[index].module == "by_status" ||
          viewlist[index].module == "by_clients"
        ) {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedStatuses"] = filterDataInfo.selectedStatuses;
          this.gridParams["countryIds"] = filterDataInfo.countryIds;
          this.filterCount =
            filterDataInfo?.selectedStatuses?.length +
            filterDataInfo?.countryIds?.length +
            2;
        } else if (viewlist[index].module == "year_to_date") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.filterCount = 2;
        } else if (viewlist[index].module == "payment_due") {
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.filterCount = 1;
        } else if (viewlist[index].module == "inventory") {
          this.gridParams["categoryIds"] = filterDataInfo.categoryIds;
          this.filterCount = filterDataInfo?.categoryIds?.length;
        } else if (viewlist[index].module == "shipment") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedClients"] = filterDataInfo.selectedClients;
          this.filterCount = filterDataInfo?.selectedClients?.length + 2;
        } else if (viewlist[index].module == "export_register") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedStatuses"] = filterDataInfo.selectedStatuses;
          this.filterCount = filterDataInfo?.selectedStatuses?.length + 2;
        } else if (viewlist[index].module == "firc_report") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["countryIds"] = filterDataInfo.countryIds;
          this.filterCount = filterDataInfo?.countryIds?.length + 2;
        } else if (viewlist[index].module == "insurance_report") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedStatuses"] = filterDataInfo.selectedStatuses;
          this.gridParams["policyProviderIds"] =
            filterDataInfo.policyProviderIds;
          this.gridParams["policyTypeIds"] = filterDataInfo.policyTypeIds;
          this.filterCount =
            filterDataInfo?.selectedStatuses?.length +
            filterDataInfo?.policyProviderIds?.length +
            filterDataInfo?.policyTypeIds?.length +
            2;
        } else if (viewlist[index].module == "forex_report") {
          this.gridParams["startDate"] = moment(
            filterDataInfo.startDate
          ).toLocaleString();
          this.gridParams["endDate"] = moment(
            filterDataInfo.endDate
          ).toLocaleString();
          this.gridParams["selectedCurrency"] = filterDataInfo.selectedCurrency;
          this.gridParams["selectedDuration"] = filterDataInfo.selectedDuration;
          this.gridParams["selectedClients"] = filterDataInfo.selectedClients;
          this.filterCount =
            filterDataInfo?.selectedStatuses?.length +
            filterDataInfo?.selectedCurrency?.length +
            2;
            if (filterDataInfo?.selectedDuration) {
              this.filterCount++;
            }
        }
      } else {
      }
    }
  }
  setGridOptions(gridinfo) {
    // tslint:disable-next-line:prefer-const
    let allFields = [],
      colKeys = [],
      rowGroupFields = [],
      filters = [],
      pivoteMode = false,
      pivoteColumns = [],
      sortColumns = [],
      searchInfo = "",
      columnState = [];
    // console.log(gridinfo)
    if (gridinfo) {
      colKeys = gridinfo["inVisibleColumnsInfo"] || [];
      filters = gridinfo["filterInfo"] ? gridinfo["filterInfo"][0] || [] : [];
      rowGroupFields = gridinfo["groupInfo"] || [];
      pivoteMode = gridinfo["pivoteMode"] || false;
      pivoteColumns = gridinfo["pivoteColumns"] || [];
      sortColumns = gridinfo["sortColumns"] || [];
      searchInfo = gridinfo["searchInfo"] || "";
      columnState = gridinfo["columnState"] || [];
    }
    if (this.gridColumnApi) {
      // const columns = this.gridColumnApi.getAllColumns();
      // columns.forEach((column) => {
      //   allFields.push(column["colId"]);
      //   if (!column["visible"]) {
      //     this.gridColumnApi.setColumnVisible(column["colId"], true);
      //   }
      // });
      // // this.visibleColumnsCount = columns.length - colKeys.length;
      // this.gridColumnApi.removeRowGroupColumns(allFields);
      // this.gridColumnApi.setColumnsVisible(colKeys, false);
      // this.gridColumnApi.setPivotMode(pivoteMode);
      // this.gridColumnApi.addRowGroupColumns(rowGroupFields);
      // this.gridColumnApi.removePivotColumns(allFields);
      // this.gridColumnApi.setPivotColumns(pivoteColumns);
      // this.gridApi.setFilterModel(filters);
      // this.gridApi.setSortModel(sortColumns);
      // this.gridApi.setQuickFilter(searchInfo);
      if (columnState.length > 0) {
        this.gridColumnApi.setColumnState(columnState);
      } else {
        this.gridColumnApi.resetColumnState();
      }
      // this.applyStickyFilters();
    }
  }

  getReportHeaders(params: { type: string }): Promise<any> {
    return this.http
      .post(`${App.base_url}getReportHeaders`, params)
      .toPromise()
      .then((response: any) => {
        if (response.result.success) {
          const data = response.result.data;
          const columnDefs = data.masterHeaders;

          // Process column definitions
          columnDefs.map((ele) => {
            ele.sortingOrder = ["asc", "desc"];
            if (ele.field === "invoice_no") {
              ele.sort = "asc";
            }
            if (ele.type === "price") {
              ele.cellClass = "align-right";
              ele.headerClass = "right-align";
            }
            if (ele.field === "status") {
              ele.cellRenderer = (params) =>
                params.value ? this.StatusAppearance(params.value) : "--";
              ele.cellClass = "status-column";
            }
            ele.filterParams = {
              debounceMs: 500, // Optional: debounce filter updates
            };
            ele.minWidth = 150;

            ele["tooltipValueGetter"] = (params) => params.value;
            ele.maxWidth = 400;
          });
          return columnDefs;
        } else {
          throw new Error(response.result.message || "Failed to fetch headers");
        }
      });
  }

  onFirstDataRendered(params: any) {
    setTimeout(() => {
      const allColumnIds = params.columnApi.getAllColumns().map((col) => {
        return col.getColId();
      });
      params.columnApi.autoSizeColumns(allColumnIds);
      params.api.sizeColumnsToFit();
    }, 100);
  }

  numberFormatter(params: any, f) {
    if (params.value && params.data) {
      return params.value.toLocaleString(
        this.getLocaleFromCurrency(params.data.currency_name)
      );
    }

    if (params.node.group && params.node.aggData) {
      const groupedColumns = params.columnApi
        .getRowGroupColumns()
        .map((col) => col.getColId());

      let currency: string;
      if (groupedColumns.includes("currency_name")) {
        currency = params.node.key;
      } else {
        currency = params.node.allLeafChildren[0]?.data?.currency_name || "";
      }
      return `${currency} ${params.value.toLocaleString(
        this.getLocaleFromCurrency(currency)
      )}`;
    }
  }

  public currencyLocaleMap = {
    USD: "en-US",
    EUR: "en-GB", // Euro often uses UK English conventions
    GBP: "en-GB",
    CAD: "en-CA",
    TRY: "tr-TR",
    JPY: "ja-JP",
    AUD: "en-AU",
    CHF: "de-CH",
    CNY: "zh-CN",
    HKD: "zh-HK",
    NZD: "en-NZ",
    KRW: "ko-KR",
    SGD: "en-SG",
    NOK: "nb-NO",
    MXN: "es-MX",
    RUB: "ru-RU",
    ZAR: "en-ZA",
    TWD: "zh-TW",
    PLN: "pl-PL",
    THB: "th-TH",
    IDR: "id-ID",
    HUF: "hu-HU",
    CZK: "cs-CZ",
    ILS: "he-IL",
    CLP: "es-CL",
    PHP: "fil-PH",
    AED: "ar-AE",
    COP: "es-CO",
    SAR: "ar-SA",
    MYR: "ms-MY",
    RON: "ro-RO",
    INR: "hi-IN",
  };

  getLocaleFromCurrency(currencyCode) {
    return this.currencyLocaleMap[currencyCode] || "en-US"; // Default to en-US if not found
  }

  // getting grid info

  // tslint:disable-next-line:max-line-length
  getGridInfo(gridObj) {
    const rowGroupArray = [];
    gridObj.groupInfo.forEach((row: { [x: string]: any }) => {
      rowGroupArray.push(row["colId"]);
    });

    const fitlerInfoArray = [];
    fitlerInfoArray.push(gridObj.filterInfo);

    const valColumnInfoArray = [];
    gridObj.valColumnInfo.forEach((row: { [x: string]: any }) => {
      valColumnInfoArray.push(row["colId"]);
    });

    const inVisibleColumnsInfoArray = [];
    gridObj.allColumnsInfo.forEach((row: { [x: string]: any }) => {
      if (row["visible"] !== true) {
        inVisibleColumnsInfoArray.push(row["colId"]);
      }
    });

    const pivoteModeInfo = gridObj.pivoteMode;
    const sortColumns = gridObj.sortColumns;

    const allPivoteColumnsArray = [];
    gridObj.allPivoteColumns.forEach((row: { [x: string]: any }) => {
      allPivoteColumnsArray.push(row["colId"]);
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
      columnState: gridObj.columnState,
    };

    return gridInfo;
  }

  StatusAppearance(val) {
    return `<span class="grid-status-column ${this.getStatusClassName(
      val
    )}">${val}</span>`;
  }

  getStatusClassName(value: string) {
    switch (value) {
      case "Order Ready": {
        return "order_ready";
      }
      case "Accepted": {
        return "accepted";
      }
      case "Ready for Dispatch": {
        return "ready_for_Dispatch";
      }
      case "Docs Completed": {
        return "docs_completed";
      }
      case "Processed ": {
        return "processed";
      }
      case "Received": {
        return "received";
      }
      case "Delivered": {
        return "delivered";
      }
      case "Customs Clearance": {
        return "customs_clearance";
      }
      case "Cancelled": {
        return "cancelled";
      }
      case "Order Confirmed": {
        return "order_confirmed";
      }
      case "Created": {
        return "processed";
      }
      case "Confirmed": {
        return "order_confirmed";
      }
      case "Partially Processed": {
        return "accepted";
      }
      case "Due": {
        return "due";
      }
      case "Paid": {
        return "paid";
      }
      case "Partially Paid": {
        return "partially_paid";
      }
      case "active": {
        return "active";
      }
      case "In Active": {
        return "in_active";
      }
      case "Active": {
        return "active";
      }
      case "Inactive": {
        return "in_active";
      }
      case "Pending": {
        return "pending";
      }
      case "Shipped": {
        return "shipped";
      }
      case "In Transit": {
        return "in_transit";
      }

      default: {
        return "accepted";
      }
    }
  }
}
