import { ReportsComponent } from "./../reports-list/reports.component";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ReportsService } from "../../../services/reports.service";
import {
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { SaveViewComponent } from "../../../dialogs/save-view/save-view.component";
import { DeleteViewComponent } from "../../../dialogs/delete-view/delete-view.component";
import { SnakbarService } from "../../../services/snakbar.service";
import { type } from "os";
import * as moment from "moment";
import * as _ from "lodash";
import { Observable } from "rxjs/Observable";
import { filter } from "rxjs/operators";
import { Images } from "../../../images/images.module";
import { EstimateFilterComponent } from "../../../estimates-module/estimate-filter/estimate-filter.component";
import { IServerSideDatasource } from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { AdminService } from "../../../services/admin.service";
declare var App: any;

@Component({
  selector: "firc-reports",
  templateUrl: "./firc-reports.component.html",
  styleUrls: ["./firc-reports.component.scss"],
  providers: [ReportsComponent],
})
export class FircReportsComponent implements OnInit {
  public deleteIcon: string =
    App.public_url + "signatures/assets/images/delete.svg";
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
  public rowData = [];
  public currentGridInfo: any = [];
  public viewsList = [];
  public dialogRef: any;
  public permissionForView: boolean = true;
  public isChanged: boolean = false;
  public savedViewValue: any = 1;
  public isInitial: boolean;
  public rowDataCopy: any;
  private allAutoSizeColumns = [];
  public headersData = [];
  public columnDefs = [];
  public gridApi: any;
  public gridColumnApi;
  public tabData: any;
  public noData: any;
  public progress = true;
  public countries = [];
  public reportsSpinner: boolean = false;
  public filtersApplied: boolean = false;
  public gridVisibility = false;
  public totalCount: number = 0;
  fetchingData = true;
  paginationPageSize: number = 50;
  public statusList = [];
  public today = new Date();
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  public images = Images;
  public params = {
    module: "firc_report",
  };

  public gridParams: any = {
    page: 1,
    perPage: 12,
    type: "firc",
  };
  public rowModelType: any = "serverSide";

  viewMyId: number;
  public showSaveView = true;
  fircData: any;
  constructor(
    public ReportsService: ReportsService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    public reportsComponent: ReportsComponent,
    private snackbar: SnakbarService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    public adminService: AdminService
  ) {}
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  public showGrid = true;

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

  getFircExportReport(): void {
    let params = {};
    if (this.filtersApplied) {
      params = {
        type: "firc",
        startDate: this.savedReportData.startDate,
        endDate: this.savedReportData.endDate,
        countryIds: this.savedReportData.countryIds,
        file: "excel",
      };
    } else {
      params = {
        type: "firc",
        startDate: "",
        endDate: "",
        countryIds: [],
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
    let cols = data;
    cols.map((ele: any) => {
      ele.sortingOrder = ["asc", "desc"];
      if (ele.type == "price") {
        ele.cellClass = "align-right";
        ele.headerClass = "right-align";
      }
    });
    return cols;
  };
  getFircReport(): void {
    this.getGridData();
    this.sideBar = {
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
  }
  getFiltersData(): void {
    this.ReportsService.getFiltersData({
      type: "firc",
    }).then((response) => {
      if (response.result.success) {
        // this.permissionForView = response.result.data.permissionForReportView;
        this.countries = response.result.data.countries;
      } else {
      }
    });
  }
  clearFilters(e): void {
    e.stopPropagation();
    this.filtersApplied = false;
    // this.gridParams["startDate"] = "";

    // this.gridParams["endDate"] = "";
    // this.gridParams["type"] = "firc";
    // this.gridParams["countryIds"] = [];
    this.gridParams = {
      page: 1,
      perPage: 12,
      startDate: "",
      endDate: "",
      type: "firc",
      countryIds: [],
    };
    this.getGridData();
    this.filterCount = "";
  }
  defaultColDef = {
    sortingOrder: ['asc', 'desc']
  };
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
      disableClose: true,
      data: {
        filterData: this.gridParams,
        gridData: filteredGridValues,
        isFiltersApplied: this.filtersApplied,
        module: "firc_report",
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        this.isChanged = false;
        this.params.module = "firc_report";
        // this.reportsComponent.getViewsList('flag');
        this.ReportsService.setTriggerData(true);
        await this.getViewsList();
        this.fetchingData = false;
        this.reportsSpinner = false;
        setTimeout(() => {
          this.savedViewValue = res;
        }, 100);
      }
    });
  }
  setInitialFilters() {
    this.gridParams["startDate"] = moment(this.yearStartDate).toLocaleString();
    this.gridParams["endDate"] = moment(this.today).toLocaleString();
    this.gridParams["countryIds"] = [];
    this.filterCount = "";
  }
  public savedReportData;
  getSelectedView(id) {
    this.isChanged = false;
    if (id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      // this.getViewsList();
      this.getFiltersData();
      this.getGridData();
      this.filtersApplied = false;
    } else {
      this.filtersApplied = true;
      //this.savedViewValue = id;
      this.savedViewValue = id;
      const index = _.findIndex(this.viewsList, { view_id: id });
      const filterDataInfo =
        index > 0 ? this.viewsList[index].applied_filters : [];
      this.savedReportData = filterDataInfo;

      if (filterDataInfo != "") {
        this.gridParams["startDate"] = moment(
          filterDataInfo.startDate
        ).toLocaleString();
        this.gridParams["endDate"] = moment(
          filterDataInfo.endDate
        ).toLocaleString();
        this.gridParams["countryIds"] = filterDataInfo.countryIds;
        this.filterCount = filterDataInfo?.countryIds?.length + 2;
        this.getGridData();
        //this.gridApi.sizeColumnsToFit();
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
        module: "firc_report",
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
            this.filterCount =
              filterDataInfo?.countryIds?.length +
              2;
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
      data: {
        module: "firc_report",
        filterParams: this.gridParams,
        countries: this.countries,
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res.success) {
        this.filterCount = res?.selectedFilters?.countryIds?.length + 2;
        this.filtersApplied = true;
        this.isChanged = true;
        this.gridParams["startDate"] = moment(
          res.selectedFilters.start_date
        ).toLocaleString();
        this.gridParams["endDate"] = moment(
          res.selectedFilters.end_date
        ).toLocaleString();
        this.gridParams["countryIds"] = res.selectedFilters.countryIds;
        this.savedReportData = this.gridParams;

        await this.getGridData();

      }
    });
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
  public sortModel = [];
  onSortChanged(ev) {
    this.sortModel = ev.api.getSortModel();
  }
  async loadReportHeaders() {
    try {
      this.columnDefs = await this.ReportsService.getReportHeaders({ type: 'firc' });
      this.showGrid = true;
    } catch (error) {
      console.error('Error fetching report headers:', error);
    }
  }
}
