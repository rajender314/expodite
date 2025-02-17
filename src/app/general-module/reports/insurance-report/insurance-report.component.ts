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
import { OrdersService } from "../../../services/orders.service";
import { EstimateFilterComponent } from "../../../estimates-module/estimate-filter/estimate-filter.component";
import { IServerSideDatasource } from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { AdminService } from "../../../services/admin.service";
declare var App: any;

@Component({
  selector: "app-insurance-report",
  templateUrl: "./insurance-report.component.html",
  styleUrls: ["./insurance-report.component.scss"],
  providers: [ReportsComponent],
})
export class InsuranceReportComponent implements OnInit {
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
    module: "insurance_report",
  };
  public filterParam = {
    flag:"insurance",
  }

  public gridParams: any = {
    page: 1,
    perPage: 12,
    type: "insurance",
  };
  viewMyId: number;
  public showSaveView = true;
  policy_types: any;
  insuranceData: any;
  policy_providers: any;
  duration:any;
  defaultColDef = {
    sortingOrder: ['asc', 'desc']
  };
  public showGrid = true;

  constructor(
    public ReportsService: ReportsService,
    private OrdersService: OrdersService,
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
  public rowModelType: any = "serverSide";
  public sortModel = [];
  onSortChanged(ev) {
    this.sortModel = ev.api.getSortModel();
  }
  getInsuranceExportReport(): void {
    let params = {};
    if (this.filtersApplied) {
      params = {
        type: "insurance",
        startDate: this.savedReportData.startDate,
        endDate: this.savedReportData.endDate,
        selectedStatuses: this.savedReportData.selectedStatuses,
        policyProviderIds: this.savedReportData.policyProviderIds,
        policyTypeIds: this.savedReportData.policyTypeIds,
        file: "excel",
      };
    } else {
      params = {
        type: "insurance",
        startDate: "",
        endDate: "",
        selectedStatuses: [],
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

  getFiltersData(): void {
    this.OrdersService.getOrderFilterData(this.filterParam).then((response) => {
      if (response.result.success) {
        this.statusList = response.result.data.statuses;
        // console.log(this.statusList);
        this.policy_providers = response.result.data.policy_provider;
        this.policy_types = response.result.data.policy_types;
      } else {
      }
    });
  }
  clearFilters(e): void {
    e.stopPropagation();
    this.filtersApplied = false;
    // this.gridParams["startDate"] = "";
    // this.gridParams["endDate"] = "";
    // this.gridParams["selectedStatuses"] = [];
    // this.gridParams["policyProviderIds"] = [];
    // this.gridParams["policyTypeIds"] = [];
    this.gridParams = {
      page: 1,
      perPage: 12,
      startDate: "",
      endDate: "",
      type: "insurance",
      policyTypeIds: [],
      selectedStatuses: [],
      policyProviderIds: [],
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
  onGridChanged() {
    this.isChanged = true;
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
        module: "insurance_report",
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        this.isChanged = false;
        this.params.module = "insurance_report";
        // this.reportsComponent.getViewsList('flag');
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
    this.gridParams["startDate"] = moment(
      this.yearStartDate
    ).toLocaleString();
    this.gridParams["endDate"] = moment(
      this.today
    ).toLocaleString();
    this.gridParams["selectedDuration"] = [];
  }
  public savedReportData;

  getSelectedView(id) {
    this.isChanged = false;
    if (id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getGridData();
      // this.getViewsList();
      this.getFiltersData();
      this.filtersApplied = false;
    } else {
      this.filtersApplied = true;
      //this.savedViewValue = id;
      this.savedViewValue = id;
      const index = _.findIndex(this.viewsList, { view_id: id });
      const filterDataInfo =
        index > 0 ? this.viewsList[index].applied_filters : [];
        this.savedReportData = filterDataInfo

      if (filterDataInfo != "") {
        this.gridParams["startDate"] = moment(
          filterDataInfo.startDate
        ).toLocaleString();
        this.gridParams["endDate"] = moment(
          filterDataInfo.endDate
        ).toLocaleString();
        this.gridParams["selectedStatuses"] = filterDataInfo.selectedStatuses;
        this.gridParams["policyProviderIds"] = filterDataInfo.countryIds;
        this.gridParams["policyTypeIds"] = filterDataInfo.countryIds;
        this.filterCount = filterDataInfo?.selectedStatuses?.length + filterDataInfo?.countryIds?.length + 2
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
        module: "insurance_report",
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
              filterDataInfo?.selectedStatuses?.length +
              filterDataInfo?.policyProviderIds?.length +
              filterDataInfo?.policyTypeIds?.length +
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
    data: { module: "insurance_report", filterParams: this.gridParams, statusList: this.statusList, policyProvider: this.policy_providers, policyType: this.policy_types },
  });
  this.dialogRef.afterClosed().subscribe(async (res) => {
    if (res.success) {
      this.filterCount = res?.selectedFilters?.status?.length + res?.selectedFilters?.policyProviders?.length + res?.selectedFilters?.policyType?.length + 2;
      this.filtersApplied = true;
      this.isChanged = true;
      this.gridParams["startDate"] = moment(
        res.selectedFilters.start_date
      ).toLocaleString();
      this.gridParams["endDate"] = moment(
        res.selectedFilters.end_date
      ).toLocaleString();
      this.gridParams["selectedStatuses"] = res.selectedFilters.status;
      this.gridParams["policyProviderIds"] = res.selectedFilters.policyProviders;
      this.gridParams["policyTypeIds"] = res.selectedFilters.policyType;
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

async loadReportHeaders() {
  try {
    this.columnDefs = await this.ReportsService.getReportHeaders({ type: 'insurance' });
    this.showGrid = true;
  } catch (error) {
    console.error('Error fetching report headers:', error);
  }
}
}
