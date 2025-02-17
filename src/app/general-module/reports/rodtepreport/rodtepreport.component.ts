import { ReportsComponent } from "./../reports-list/reports.component";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ReportsService } from "../../../services/reports.service";
import { FormControl, FormBuilder } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import { SaveViewComponent } from "../../../dialogs/save-view/save-view.component";
import { DeleteViewComponent } from "../../../dialogs/delete-view/delete-view.component";
import { SnakbarService } from "../../../services/snakbar.service";
import * as moment from "moment";
import * as _ from "lodash";
import { Images } from "../../../images/images.module";
import { OrdersService } from "../../../services/orders.service";
import { EstimateFilterComponent } from "../../../estimates-module/estimate-filter/estimate-filter.component";
import { IServerSideDatasource } from "ag-grid-community";
import { HttpClient } from "@angular/common/http";
import { CustomLoadingCellRenderer } from "../../../shared/ag-grid-view/custom-ag-loader";
import { AdminService } from "../../../services/admin.service";
declare var App: any;
@Component({
  selector: 'app-rodtepreport',
  templateUrl: './rodtepreport.component.html',
  styleUrls: ['./rodtepreport.component.scss']
})
export class RodtepreportComponent implements OnInit {

  public deleteIcon: string =
    App.public_url + "signatures/assets/images/delete.svg";
  public sideBar = {
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
  public orders: any = [];
  public gridVisibility = false;
  public totalCount: number = 0;
  fetchingData = true;
  paginationPageSize: number = 50;
  public statusList = [];
  public today = new Date();
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  public images = Images;
  public params = {
    module: "rodtep",
  };

  slectedStatus = new FormControl([]);
  public gridParams: any = {
    page: 1,
    perPage: 12,
    type: "rodtep",
  };
  private param: any = {
    flag: "rodtep",
  };
  defaultColDef = {
    sortingOrder: ["asc", "desc"],
  };
  viewMyId: number;
  public showSaveView = true;
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
    public adminService:  AdminService
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

  getOrdersExportReport(): void {
    let params = {};
    const sortModel = this.gridApi.getSortModel();
    const visibleColumns = this.gridColumnApi.getAllDisplayedColumns();
    const visibleColumnFields = visibleColumns.map((col) => col.getColDef().field);
    params["sort_key"] = sortModel.length ? sortModel[0].colId : "";
    params["sort"] = sortModel.length ? sortModel[0].sort : "";
    params["visible_columns"] = visibleColumnFields;
    if (this.filtersApplied) {
      params = {
        ...params,
        type: "orders",
        startDate: this.savedReportData.startDate,
        endDate: this.savedReportData.endDate,
        selectedStatuses: this.savedReportData.selectedStatuses,
        countryIds: this.savedReportData.countryIds,

        file: "excel",
      };
    } else {
      params = {
        ...params,
        type: "orders",
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
    }
    // if (params.node.group && params.node.aggData) {
    //   const currency = params.columnApi.getRowGroupColumns().some(col => col.getColId() === "currency")
    //     ? params.node.allLeafChildren[0]?.data?.currency
    //     : "USD";
    //   return params.value.toLocaleString(this.getLocaleFromCurrency(currency));
    // }
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

  getOrdersReport(): void {
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
    let param = {};
    this.OrdersService.getOrderFilterData(this.param).then((response) => {
      if (response.result.success) {
        this.statusList = response.result.data.orderTypes;
        // this.permissionForView = response.result.data.permissionForReportView;
        // console.log(this.statusList);
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
    // this.gridParams["selectedStatuses"] = [];
    // this.gridParams["type"] = "orders";
    // this.gridParams["countryIds"] = [];
    this.gridParams = {
      page: 1,
      perPage: 12,
      type: "orders",
      startDate: "",
      endDate: "",
      selectedStatuses: [],
      countryIds: [],
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
  // onGridReady(params) {
  //   // console.log(params)
  //   params.api.sizeColumnsToFit();
  //   this.gridApi = params.api;
  //   this.gridColumnApi = params.columnApi;
  //   if (this.savedViewValue != 1) {
  //     this.setGridOptions(this.currentGridInfo);
  //     // params.api.sizeColumnsToFit();
  //   }
  // }

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
        module: "by_status",
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        this.isChanged = false;
        this.params.module = "by_status";
        // this.reportsComponent.getViewsList('flag');
        this.ReportsService.setTriggerData(true);

        this.getViewsList();
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
    this.gridParams["selectedStatuses"] = [];
    this.gridParams["countryIds"] = [];
    this.filterCount = "";
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
      this.savedReportData = filterDataInfo;
      if (filterDataInfo != "") {
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
        this.getGridData();
      } else {
        this.setInitialFilters();
        // this.gridApi.setRowData(this.rowDataCopy);
        this.getGridData();
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
      const columns = this.gridColumnApi.getAllColumns();
      columns.forEach((column) => {
        allFields.push(column["colId"]);
        if (!column["visible"]) {
          this.gridColumnApi.setColumnVisible(column["colId"], true);
        }
      });
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
      if (columnState.length > 0) {
        this.gridColumnApi.setColumnState(columnState);
      } else {
        this.gridColumnApi.resetColumnState();
      }
      // this.applyStickyFilters();
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
        module: "by_status",
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
            console.log(filterDataInfo)
          if (filterDataInfo != "") {
            this.filterCount =
              filterDataInfo?.selectedStatuses?.length +
              filterDataInfo?.countryIds?.length +
              2;
          } else {
            this.gridParams = {
              page: 1,
              perPage: 12,
              type: "orders",
              startDate: "",
              endDate: "",
              selectedStatuses: [],
              countryIds: [],
            };
          }
        } else {
          this.setInitialFilters();
        }
      }
    });
  };
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.name : "";
  }

  removeClient(clientId: string, selectedList): void {
    const selectedClients = selectedList.value.filter((id) => id !== clientId);
    selectedList.setValue(selectedClients);
  }
  public filterCount = "";
  openFilters() {
    this.dialogRef = this.dialog.open(EstimateFilterComponent, {
      width: "20%",
      height: "100vh",
      position: { right: "0" },
      disableClose: true,
      data: {
        module: "orders",
        statusList: this.statusList,
        filterParams: this.gridParams,
        countries: this.countries,
      },
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res.success) {
        this.filterCount =
          res?.selectedFilters?.status?.length +
          res?.selectedFilters?.countryIds?.length +
          2;
        this.filtersApplied = true;
        this.isChanged = true;
        this.gridParams["startDate"] = moment(
          res.selectedFilters.start_date
        ).toLocaleString();
        this.gridParams["endDate"] = moment(
          res.selectedFilters.end_date
        ).toLocaleString();
        this.gridParams["selectedStatuses"] = res.selectedFilters.status;
        this.gridParams["countryIds"] = res.selectedFilters.countryIds;
        this.savedReportData = this.gridParams;

        await this.getGridData();

        // this.getSelectedView();
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
      this.columnDefs = await this.ReportsService.getReportHeaders({
        type: "rodtep",
      });
      this.showGrid = true;

    } catch (error) {
      console.error("Error fetching report headers:", error);
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
