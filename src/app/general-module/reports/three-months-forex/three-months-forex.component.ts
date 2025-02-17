import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import moment = require("moment");
import { DeleteViewComponent } from "../../../dialogs/delete-view/delete-view.component";
import { SaveViewComponent } from "../../../dialogs/save-view/save-view.component";
import { EstimateFilterComponent } from "../../../estimates-module/estimate-filter/estimate-filter.component";
import { Images } from "../../../images/images.module";
import { SnakbarService } from "../../../services/snakbar.service";
import { ReportsComponent } from "../reports-list/reports.component";
import { ReportsService } from "../../../services/reports.service";
import { OrdersService } from "../../../services/orders.service";
import * as _ from "lodash";
import {
  GridApi,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { AnyARecord } from "dns";
import { CustomLoadingCellRenderer } from "../../../shared/ag-grid-view/custom-ag-loader";
import { AdminService } from "../../../services/admin.service";

declare var App: any;

@Component({
  selector: "app-three-months-forex",
  templateUrl: "./three-months-forex.component.html",
  styleUrls: ["./three-months-forex.component.scss"],
})
export class ThreeMonthsForexComponent implements OnInit {
  public pageNumber = false;
  public savedViewValue: any;
  public durationName = "";
  public dialogRef: any;
  public pageParams = {
    page: 1,
    perPage: 12,
    type: "forex_grouped",
  };
  public images = Images;
  public columnDefs: any = [];
  public defaultColDef: any = {
    flex: 1,
    suppressMovable: true,
  };
  public currency = [];
  public durations = [];
  public invoiceNumber = [];
  public clients = [];
  public countries = [];
  public statusList = [];
  public rowModelType: any = "serverSide";
  gridOptions = {
    overlayNoRowsTemplate:
      '<span class="ag-overlay-no-rows-center">No data available</span>',
  };
  public detailCellRendererParams: any = {
    detailGridOptions: {
      getRowHeight: () => 40,
      getHeaderHeight: () => 40,
      defaultColDef: {
        flex: 1,
      },
      class: "123",
      rowClass: 'custom-detail-grid-row',
      overlayNoRowsTemplate:
        '<span class="ag-overlay-no-rows-center">No data Found</span>',
        frameworkComponents: {
          customLoadingOverlay: CustomLoadingCellRenderer,
        },
        loadingOverlayComponent: 'customLoadingOverlay',
    },
    getDetailRowData: (params) => {
      console.log(params)
      params.successCallback(params.data.details);
    },
  } as any;
  public rowData!: any[];
  sideBar = {
    toolPanels: [
      {
        id: "columns",
        labelDefault: "Columns",
        labelKey: "columns",
        iconKey: "columns",
        toolPanel: "agColumnsToolPanel",
      },
    ],
    // hiddenByDefault: true,
  };
  constructor(
    private http: HttpClient,
    public ReportsService: ReportsService,
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.getReportHeaders();

  }
  public gridApi: GridApi;
  public totalCount = 0;
  public listCount = 0;
  public gridColumnApi;
  async onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    await this.getFiltersData();

    if (this.gridApi) {
      const datasource = this.ReportsService.getServerSideDatasource(
        this.gridApi,
        this.pageParams,
        `${App.base_url}getReports`,
        (listCount: number, totalCount: number) => {
          this.listCount = listCount;
          this.totalCount = totalCount;
        }
      );
      params.api.setServerSideDatasource(datasource);
    }
  }
  public filterCount: any = "";
  loadMore(ev) {
    this.pageParams.page = ev.page;
    this.pageParams.perPage = ev.perPage;
    const datasource = this.ReportsService.getServerSideDatasource(
      this.gridApi,
      this.pageParams,
      `${App.base_url}getReports`,
      (listCount: number, totalCount: number) => {
        this.listCount = listCount;
        this.totalCount = totalCount;
      }
    );
    this.gridApi.setServerSideDatasource(datasource);
  }

  async getGridData() {
    const datasource = this.ReportsService.getServerSideDatasource(
      this.gridApi,
      this.pageParams,
      `${App.base_url}getReports`,
      (listCount: number, totalCount: number) => {
        this.listCount = listCount;
        this.totalCount = totalCount;
      }
    );
    this.gridApi.setServerSideDatasource(datasource);
  }

  getSelectedView(id) {
    const indx = _.findIndex(this.durations, { id: id });
    this.durationName = this.durations[indx].name;
    this.pageParams["selectedDuration"] = id;
    this.getGridData();
  }

  getReportHeaders() {
    this.ReportsService.getReportHeaders2({ type: "forex_grouped" }).then(
      (response) => {
        if (response.result.success) {
          const data = response.result.data;
          this.columnDefs = data.masterHeaders;
          this.detailCellRendererParams.detailGridOptions.columnDefs =
            data.detailHeaders;
          this.columnDefs.map((ele) => {
            ele.sortingOrder = ["asc", "desc"];
            if (ele.field == "invoice_no") {
              ele.sort = "asc";
            }
            if (ele.type == "price") {
              ele.cellClass = "align-right";
              ele.headerClass = "right-align";
            }
          });
          this.detailCellRendererParams.detailGridOptions.columnDefs.map(
            (ele) => {
              ele.sortingOrder = ["asc", "desc"];
              ele["tooltipValueGetter"] = (params) => params.value;
              if (ele.type == "price") {
                ele.cellClass = "align-right";
                ele.headerClass = "right-align";
              }
            }
          );
        }
      }
    );
  }
  public sortModel = [];
  onSortChanged(ev) {
    this.sortModel = ev.api.getSortModel();
  }

  clearFilters(e): void {
    e.stopPropagation();
    this.pageParams["startDate"] = "";
    this.pageParams["endDate"] = "";
    this.pageParams["selectedCurrency"] = "";
    this.pageParams["selectedDuration"] = "";
    this.pageParams["selectedClients"] = "";
    this.pageParams["type"] = "forex_grouped";
    this.pageParams["countryIds"] = [];
    this.getGridData();
    this.filterCount = "";
  }
  public filtersApplied: boolean = false;
  public isChanged: boolean = false;
  public savedReportData;

  openFilters() {
    this.dialogRef = this.dialog.open(EstimateFilterComponent, {
      width: "20%",
      height: "100vh",
      position: { right: "0" },
      disableClose: true,
      data: {
        module: "three_months_forex_report",
        filterParams: this.pageParams,
        clients: this.clients,
        currency: this.currency,
        durations: this.durations,
        invoiceNumber: this.invoiceNumber,
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res.success) {
        this.filtersApplied = true;
        this.isChanged = true;
        this.pageParams["startDate"] = moment(
          res.selectedFilters.start_date
        ).toLocaleString();
        this.pageParams["endDate"] = moment(
          res.selectedFilters.end_date
        ).toLocaleString();
        this.pageParams["selectedClients"] = res.selectedFilters.clients;
        this.pageParams["selectedCurrency"] = res.selectedFilters.currency;
        this.filterCount =
          res.selectedFilters.clients.length +
          res.selectedFilters.currency.length +
          2;
        if (res.selectedFilters.duration) {
          this.filterCount++;
        }
        this.savedReportData = this.pageParams;
        await this.getGridData();
      }
    });
  }
  async getFiltersData() {
    await this.OrdersService.getOrderFilterData({ flag: "forex_report" }).then(
      (response) => {
        if (response.result.success) {
          this.statusList = response.result.data.orderTypes;
          // this.permissionForView = response.result.data.permissionForReportView;
          // console.log(this.statusList);
          this.clients = response.result.data.client;
          this.countries = response.result.data.countries;
          this.currency = response.result.data.currency;
          this.durations = response.result.data.durations;
          this.invoiceNumber = response.result.data.invoice_number;
          this.savedViewValue = this.durations[1].id;
          this.durationName = this.durations[1].name;
          this.pageParams["selectedDuration"] = this.durations[1].id;
        } else {
        }
      }
    );
  }

  getForexExportReport() {
    let params = {};
    if (this.filtersApplied) {
      params = {
        type: "forex_grouped",
        startDate: this.savedReportData.startDate,
        endDate: this.savedReportData.startDate,
        selectedClients: this.savedReportData.selectedClients,
        selectedCurrency: this.savedReportData.selectedCurrency,
        file: "excel",
        offset: new Date().getTimezoneOffset(),
      };
    } else {
      params = {
        type: "forex_grouped",
        startDate: "",
        endDate: "",
        selectedClients: [],
        selectedCurrency: [],
        file: "excel",
        offset: new Date().getTimezoneOffset(),
      };
    }
    this.ReportsService.getReports(params).then((response) => {
      let toastMsg: object;
      if (response.result.success) {
        let downloadPath = response.result.data.filePath;
        window.location.href = "" + App.base_url + "" + downloadPath + "";
        toastMsg = { msg: "Data Exported successfully", status: "success" };
        this.snackbar.showSnackBar(toastMsg);
      } else {
        toastMsg = { msg: "Failed to Export", status: "error" };
        this.snackbar.showSnackBar(toastMsg);
      }
    });
  }



  async loadReportHeaders() {
    try {
      this.columnDefs = await this.ReportsService.getReportHeaders({ type: 'forex_grouped' });
    } catch (error) {
      console.error('Error fetching report headers:', error);
    }
  }
}
