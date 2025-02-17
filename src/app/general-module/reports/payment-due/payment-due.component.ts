import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatOption } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ReportsService } from "../../../services/reports.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { SaveViewComponent } from "../../../dialogs/save-view/save-view.component";
import { DeleteViewComponent } from "../../../dialogs/delete-view/delete-view.component";
import { SnakbarService } from "../../../services/snakbar.service";

import * as _ from "lodash";
import * as moment from "moment";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { EstimateFilterComponent } from "../../../estimates-module/estimate-filter/estimate-filter.component";
import { Images } from "../../../images/images.module";
import { IServerSideDatasource } from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { AdminService } from "../../../services/admin.service";
declare var App: any;
@Component({
  selector: "app-payment-due",
  templateUrl: "./payment-due.component.html",
  styleUrls: ["./payment-due.component.scss"],
})
export class PaymentDueComponent implements OnInit {
  // @ViewChild('allSelected') private allSelected: MatOption;
  public deleteIcon: string =
    App.public_url + "signatures/assets/images/delete.svg";
    public images = Images;
    public sideBar = {
      toolPanels: [
        {
          id: "columns",
          labelDefault: "Columns",
          labelKey: "columns",
          iconKey: "columns",
          toolPanel: "agColumnsToolPanel",
        }
      ]
      // hiddenByDefault: true,
    }; 
    defaultColDef = {
      sortingOrder: ["asc", "desc"],
    };
  public rowData = [];
  public currentGridInfo: any = [];
  public viewsList = [];
  public dialogRef: any;
  public permissionForView: boolean = true;
  public isChanged: boolean = false;
  public savedViewValue: any = 1;
  public rowDataCopy: any = [];
  public dataCopy: any;
  public isInitial: boolean;
  private allAutoSizeColumns = [];
  public headersData = [];
  public columnDefs = [];
  public gridApi: any;
  public gridColumnApi;
  public tabData: any;
  public noData: any;
  public progress = true;
  public reportsSpinner: boolean = false;
  public filtersApplied: boolean = false;
  public orders: any = [];
  public organizations: any = [];
  public gridVisibility = false;
  public totalCount: number = 0;
  fetchingData = true;
  public start: any = "";
  public end: any = "";
  public today = new Date();
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  public matSelectOpen = false;
  paginationPageSize: number = 50;


  public clientsFilterCtrl: FormControl = new FormControl();
  public clients = [];
  public currencies = [];
  public gridParams: any = {
    page: 1,
    perPage: 12,
    type: "payments_due",
  }; 
   public params = {
    module: "payment_due",
  };
  private param: any = {
    search: "",
  };
  public showSaveView = true;

  protected _onDestroy = new Subject<void>();
  countries: any;

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  viewMyId: number;
  public showGrid = true;

  constructor(
    public ReportsService: ReportsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    public adminService: AdminService
  ) {
  }
  async ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.viewMyId = 0;
    this.activateRoute.params.subscribe(async (res: any) => {
      this.viewMyId = parseInt(res.id);
      if(this.viewMyId) {
        this.showGrid = false;
      } 
      setTimeout(async () => {
        await this.loadReportHeaders();
      }, 0);
    });
  }
  // tosslePerOne(all) {
  //   if (this.allSelected.selected) {
  //     this.allSelected.deselect();
  //     return false;
  //   }
  //   if (this.filtersForm.controls.currency.value.length == this.currencies.length)
  //     this.allSelected.select();

  // }
  // toggleAllSelection() {
  //   if (this.allSelected.selected) {
  //     this.filtersForm.controls.currency
  //       .patchValue([...this.currencies.map(item => item.id), 0]);
  //   } else {
  //     this.filtersForm.controls.currency.patchValue([]);
  //   }
  // }
  // ngOnDestroy() {
  //   this._onDestroy.next();
  //   this._onDestroy.complete();
  // }
  searchOrganizations() {
    if (this.matSelectOpen) {
      this.param.search = this.clientsFilterCtrl.value;
      this.ReportsService.getRequiredDataForFilters(this.param).then(
        (response) => {
          if (response.result.success) {
            this.clients = response.result.data.client;
            this.permissionForView =
              response.result.data.permissionForReportView;
            // this.currencies = response.result.data.currencys;
            // this.productTypes = response.result.data.productTypes;
            // console.log(this.statusList);
          }
        }
      );
    }
  }
  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }
  getFiltersData(): void {
    this.ReportsService.getFiltersData({
      type: "payments_due",
    }).then((response) => {
      if (response.result.success) {
        // this.permissionForView = response.result.data.permissionForReportView;
        // this.clients = response.result.data.clients;
        this.countries = response.result.data.countries;
        // console.log(this.statusList);
      } else {
      }
    });
  }

  clearFilters(e): void {
    e.stopPropagation(); 
    this.filtersApplied = false;
    // this.gridParams["endDate"] = "";
    // this.gridParams["type"] = "payments_due";
    this.gridParams = {
      page: 1,
      perPage: 12,
      type: "payments_due",
      endDate: "",
    };
    this.getGridData();
    this.filterCount = "";
  }

  async getGridData() {
    const datasource = this.ReportsService.getServerSideDatasource(
      this.gridApi,
      this.gridParams,
      `${App.base_url}getReports`,
      (listCount: number, totalCount: number, gridParams) => {
        this.listCount = listCount;
        this.totalCount = totalCount;
        this.gridParams = gridParams;
      },
      this.gridColumnApi,
      this.viewsList,
      this.viewMyId
    );
    this.gridApi.setServerSideDatasource(datasource);
  }
  cellRenderStatus = (params) => {
    // console.log(params)
    return params.data
      ? `<div class="icon-render">
              <div class="status"><span class="adStatus"
        ">
        ${params.data.status}
        </span></div>
          </div>`
      : "";
  };
  getPaymentDueExportReport(): void {
    let params = {};
    if (this.filtersApplied) {
      params = {
        type: "payments_due",
        endDate: this.savedReportData.endDate,
        file: "excel",
      };
    } else {
      params = {
        type: "payments_due",
        startDate: "",
        endDate: "",
        selectedClients: [],
        currencyTypeIds: [],
        file: "excel",
      };
    }
    this.ReportsService.getReports(params).then((response) => {
      if (response.result.success) {
        let downloadPath = response.result.data.filePath;
        window.location.href = "" + App.base_url + "" + downloadPath + "";
      } else {
      }
    });
  }

  numberFormatter(params: any, f) {
    if (params.value && params.data) {
      return params.value.toLocaleString(
        this.getLocaleFromCurrency(params.data.currency_name)
      );
      // console.log(this.agCurrencyPipe.transform(params.value, 'USD'))
      // return this.agCurrencyPipe.transform(params.value, 'USD')
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
  generateColumns = (data: any) => {
    let cols = [
      {
        headerName: "Invoice#",
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        field: "invoice_number",
        width: 300,
      },
      {
        headerName: "Client Name",
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        field: "client_name",
        width: 300,
        enableRowGroup: true,
      },

      {
        headerName: "Currency",
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        field: "currency_name",
        width: 300,
      },
      {
        headerName: " Amount",
        headerClass: "align-right",
        cellClass: "align-right",
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        aggFunc: "sum",
        valueFormatter: (params) => this.ReportsService.numberFormatter(params, "123"),
        allowedAggFuncs: ["sum"],
        field: "payments_due",
        width: 300,
        cellClassRules: {
          'total-cell': params => params.node.group // Style only footer (total rows)
        },
      },

      {
        headerName: "Country",
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        field: "bill_country",
        width: 300,
        enableRowGroup: true,
      },
    ];
    // data.map((col) => {

    //   let column = {
    //     headerName: col.headerName,
    //     editable: false,
    //     field: col.field,
    //     sortable: true,
    //     headerClass: '',
    //     cellClass: '',
    //     // width: 240,
    //   }

    //   if (col.field == "status") {
    //     column['cellRenderer'] = (params) => this.cellRenderStatus(params)
    //   }
    //   if (col.field == "product_price" || col.field == "quantity" || col.field == "total_amount") {
    //     column = {
    //       headerName: col.headerName,
    //       editable: false,
    //       field: col.field,
    //       sortable: true,
    //       headerClass: 'right-align',
    //       cellClass: 'align-right'
    //     }
    //   }
    //   cols.push(column)
    // })
    return cols;
  };

  onGridChanged(event) {
    this.isChanged = true;
    // console.log(999)
  }
  // onGridReady(params) {
  //   params.api.sizeColumnsToFit();
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   if (this.savedViewValue != 1) {
  //     this.setGridOptions(this.currentGridInfo);
  //     // params.api.sizeColumnsToFit();
  //   }
  // }
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
      const columns = this.gridColumnApi.getAllColumns();
      columns.forEach((column) => {
        allFields.push(column["colId"]);
        if (!column["visible"]) {
          this.gridColumnApi.setColumnVisible(column["colId"], true);
        }
      });
      if (columnState.length > 0) {
        this.gridColumnApi.setColumnState(columnState);
      } else {
        this.gridColumnApi.resetColumnState();
      }
      // this.visibleColumnsCount = columns.length - colKeys.length;
      this.gridColumnApi.removeRowGroupColumns(allFields);
      this.gridColumnApi.setColumnsVisible(colKeys, false);
      this.gridColumnApi.setPivotMode(pivoteMode);
      this.gridColumnApi.addRowGroupColumns(rowGroupFields);
      this.gridColumnApi.removePivotColumns(allFields);
      this.gridColumnApi.setPivotColumns(pivoteColumns);
      this.gridApi.setFilterModel(filters);
      this.gridApi.setSortModel(sortColumns);
      this.gridApi.setQuickFilter(searchInfo);

      // this.applyStickyFilters();
    }
  }
  saveView() {
    let data;
    if (this.gridColumnApi != undefined) {
      data = {
        groupInfo: this.gridColumnApi.getRowGroupColumns(),
        filterInfo: this.gridApi.getFilterModel(),
        valColumnInfo: this.gridColumnApi.getValueColumns(),
        allColumnsInfo: this.gridColumnApi.getAllColumns(),
        pivoteMode: this.gridColumnApi.isPivotMode(),
        allPivoteColumns: this.gridColumnApi.getPivotColumns(),
        sortColumns: this.gridApi.getSortModel(),
        // searchInfo: this.search.value,
        columnState: this.gridColumnApi.getColumnState(), //this.gridApi.columnController.allDisplayedColumns
      };
    } else {
      data = {
        groupInfo: [],
        filterInfo: [],
        valColumnInfo: [],
        allColumnsInfo: [],
        pivoteMode: [],
        allPivoteColumns: [],
        sortColumns: [],
        // searchInfo: this.search.value,
        columnState: [], //this.gridApi.columnController.allDisplayedColumns
      };
    }
    var filteredGridValues = this.ReportsService.getGridInfo(data);
    // console.log(filteredGridValues)
    this.dialogRef = this.dialog.open(SaveViewComponent, {
      width: "550px",
      height: "340px",
      data: {
        filterData: this.gridParams,
        gridData: filteredGridValues,
        isFiltersApplied: this.filtersApplied,
        module: "payment_due",
      },
      disableClose: true,
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        this.isChanged = false;
        this.ReportsService.setTriggerData(true);

        await this.getViewsList();
        this.fetchingData = false;
        this.reportsSpinner  = false;
        setTimeout(() => {
          this.savedViewValue = res;
        }, 100);
      }
    });
  }
  setInitialFilters() {
     this.gridParams["endDate"] = moment(
      this.today
    ).toLocaleString();
    this.filterCount = "";
  }
  public savedReportData;
  getSelectedView(id) {
    this.isChanged = false;

    if (id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getGridData();
      this.getFiltersData();
      this.filtersApplied = false;
    } else {
      this.filtersApplied = true;
      const index = _.findIndex(this.viewsList, { view_id: id });
      this.savedViewValue = id;
      const filterDataInfo =
        index > 0 ? this.viewsList[index].applied_filters : [];
      this.savedReportData = filterDataInfo;

      // console.log(filterDataInfo)
      if (filterDataInfo != "") {
        this.gridParams["endDate"] = moment(
          filterDataInfo.endDate
        ).toLocaleString();

        this.filterCount = 1;
        this.getGridData();
      } else {
        this.setInitialFilters();
        // this.gridApi.setRowData(this.rowDataCopy);
        this.getGridData();

      }

    }
  }

  deleteView = function (id, i) {
    event.stopPropagation();
    const params = {
      view_id: id,
    };
    let dialogRef = this.dialog.open(DeleteViewComponent, {
      width: "550px",
      data: {
        module: "payment_due",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.fetchingData = true;
        this.ReportsService.deleteViewItem(params).then((response) => {
          this.fetchingData = false;
          if (response.result.success) {
            this.isChanged = false;

            if (id == this.savedViewValue) {
              this.savedViewValue = 1;
              this.getSelectedView(this.savedViewValue);
            }
            this.viewsList.splice(i, 1);
            let toastMsg: object;
            toastMsg = { msg: "View deleted successfully", status: "success" };
            this.snackbar.showSnackBar(toastMsg);
          }
        });
      }
    });
  };
  public newSpinnerFlag = false;

  getViewsList = async function () {
    // const params = {
    //   module: 'by_status'
    // }
    // this.fetchingData = true;
    // this.reportsSpinner  = true;
    this.newSpinnerFlag = true;
    await this.ReportsService.getViewsList(this.params).then((response) => {
      this.newSpinnerFlag = false;
      if (response.result.success) {
        this.viewsList = response.result.data;
        this.viewsList.forEach((element) => {
          element.grid_info = JSON.parse(element.grid_info);
          element.applied_filters = JSON.parse(element.applied_filters);
        });
        if (this.viewsList.length) {
          this.viewsList.unshift({ view_name: "Default View", view_id: 1 });
        }

        if (this.viewMyId) {
          const index = _.findIndex(this.viewsList, { view_id: this.viewMyId });
          const filterDataInfo =
            index > 0 ? this.viewsList[index].applied_filters : [];
          if (filterDataInfo != "") {
            this.filterCount = 1;
          }
        } else {
          this.setInitialFilters();
        }
      }
    });
  };

  public filterCount: any = "";
  openFilters() {
    this.dialogRef = this.dialog.open(EstimateFilterComponent, {
      width: "20%",
      height: "100vh",
      position: { right: "0" },
      disableClose: true,
      data: { module: "payments_due", filterParams: this.gridParams },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res.success) {
        this.filterCount = 1;
        this.filtersApplied = true;
        this.isChanged = true;
     
        this.gridParams["endDate"] = moment(
          res.selectedFilters.end_date
        ).toLocaleString();
        this.savedReportData = this.gridParams;

        await this.getGridData();

      }
    });
  }
  async onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    await this.getFiltersData();
    await this.getViewsList();

    if (this.gridApi) {
      const datasource = this.ReportsService.getServerSideDatasource(
        this.gridApi,
        this.gridParams,
        `${App.base_url}getReports`,
        (listCount: number, totalCount: number, gridParams) => {
          this.listCount = listCount;
          this.totalCount = totalCount;
          this.gridParams = gridParams;
          // this.filterCount = filterCount;
          const index = _.findIndex(this.viewsList, { view_id: this.viewMyId });
          if (index > 0) {
            this.savedViewValue = this.viewsList[index].view_id;
          }
        },
        this.gridColumnApi,
        this.viewsList,
        this.viewMyId
      );
      params.api.setServerSideDatasource(datasource);
    }
  }
  public listCount = 0;


  async loadReportHeaders() {
    try {
      this.columnDefs = await this.ReportsService.getReportHeaders({ type: 'payments_due' });
      this.showGrid = true;
    } catch (error) {
      console.error('Error fetching report headers:', error);
    }
  }
  public sortModel = [];
  public rowModelType: any = "serverSide";
  onSortChanged(ev) {
    this.sortModel = ev.api.getSortModel();
  }
  public pageNumber = false;
  loadMore(ev) {
    this.gridParams.page = ev.page;
    this.gridParams.perPage = ev.perPage;
    const datasource = this.ReportsService.getServerSideDatasource(
      this.gridApi,
      this.gridParams,
      `${App.base_url}getReports`,
      (listCount: number, totalCount: number, gridParams) => {
        this.listCount = listCount;
        this.totalCount = totalCount;
        this.gridParams = gridParams;
      },
      this.gridColumnApi,
      this.viewsList,
      this.viewMyId
    );
    this.gridApi.setServerSideDatasource(datasource);
  }
  getGridInfo() {
    let data;
    if (this.gridColumnApi != undefined) {
      data = {
        groupInfo: this.gridColumnApi.getRowGroupColumns(),
        filterInfo: this.gridApi.getFilterModel(),
        valColumnInfo: this.gridColumnApi.getValueColumns(),
        allColumnsInfo: this.gridColumnApi.getAllColumns(),
        pivoteMode: this.gridColumnApi.isPivotMode(),
        allPivoteColumns: this.gridColumnApi.getPivotColumns(),
        sortColumns: this.gridApi.getSortModel(),
        // searchInfo: this.search.value,
        columnState: this.gridColumnApi.getColumnState(), //this.gridApi.columnController.allDisplayedColumns
      };
    } else {
      data = {
        groupInfo: [],
        filterInfo: [],
        valColumnInfo: [],
        allColumnsInfo: [],
        pivoteMode: [],
        allPivoteColumns: [],
        sortColumns: [],
        // searchInfo: this.search.value,
        columnState: [], //this.gridApi.columnController.allDisplayedColumns
      };
    }
    return data;
  }
}
