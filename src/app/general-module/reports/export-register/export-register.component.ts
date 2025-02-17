import { ReportsComponent } from "../reports-list/reports.component";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ReportsService } from "../../../services/reports.service";
import { OrdersService } from "../../../services/orders.service";
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
  selector: "app-export-register",
  templateUrl: "./export-register.component.html",
  styleUrls: ["./export-register.component.scss"],
  providers: [ReportsComponent],
})
export class ExportRegisterComponent implements OnInit {
  public deleteIcon: string =
    App.public_url + "signatures/assets/images/delete.svg";
  public sideBar: any = {
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
  };;
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
  public today = new Date();
  public monthStartDate = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    1
  );
  public images = Images;
  fetchingData = true;
  paginationPageSize: number = 50;
  public pageNumber = false;
  public productTypes = [];
  public catagiries = [];
  public countries = [];
  public currencies = [];
  public gridParams: any = {
    page: 1,
    perPage: 12,
    type: "export_register",
  };
    public statuses;
  public params = {
    module: "export_register",
  };
  defaultColDef = {
    sortingOrder: ['asc', 'desc']
  };
  private autoGroupColumnDef;
  private aggFuncs;
  public showSaveView = true;
  private param: any = {
    flag: "export_register",
  };
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  viewMyId: number;
  public rowModelType: any = "serverSide";
  public showGrid = true;

  constructor(
    public ReportsService: ReportsService,
    private OrdersService: OrdersService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    public adminService: AdminService
  ) {}
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
  getFiltersData(): void {
    this.OrdersService.getOrderFilterData(this.param).then((response) => {
      if (response.result.success) {
        this.statuses = response.result.data.status;
      } else {
      }
    });
  }

  clearFilters(e): void {
    e.stopPropagation();
    this.filtersApplied = false;
    // this.gridParams["startDate"] = "";
    // this.gridParams["endDate"] = "";
    // this.gridParams["selectedStatuses"] = "";
    // // this.gridParams['categoryIds'] = "";
    // // this.gridParams['currencyTypeIds'] = "";
    // this.gridParams["type"] = "export_register";

    this.gridParams = {
      page: 1,
      perPage: 12,
      startDate: "",
      endDate: "",
      type: "export_register",
      selectedStatuses: [],
    };
    this.getGridData();
    this.filterCount = "";
  }

  cellRenderStatus = (params) => {
    return params.data
      ? `<div class="icon-render">
              <div class="status"><span class="adStatus"
        ">
        ${params.data.status}
        </span></div>
          </div>`
      : "";
  };
  getRegiterExportReport(): void {
    let params = {};
    if (this.filtersApplied) {
      params = {
        startDate: this.savedReportData.startDate,
        endDate: this.savedReportData.endDate,
        selectedStatuses: this.savedReportData.selectedStatuses,
        type: "export_register",
        file: "excel"
      };
    } else {
      params = {
        startDate: "",
        endDate: "",
        selectedStatuses: [],
        type: "export_register",
        file: "excel"
      };
    }
    this.ReportsService.exportRegister(params).then((response) => {
      if (response.result.success) {
        let downloadPath = response.result.data.filePath;
        window.location.href = "" + App.base_url + "" + downloadPath + "";
      } else {
      }
    });
  }


  onGridChanged(event) {
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
  public listCount = 0;

  setGridOptions(gridinfo) {
    let allFields = [],
      colKeys = [],
      rowGroupFields = [],
      filters = [],
      pivoteMode = false,
      pivoteColumns = [],
      sortColumns = [],
      searchInfo = "",
      columnState = [];
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
        module: "export_register",
      },
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
   
    this.gridParams["startDate"] = moment(
      this.yearStartDate
    ).toLocaleString();
    this.gridParams["endDate"] = moment(
      this.today
    ).toLocaleString();
    this.gridParams["selectedStatuses"] = [];
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
      // console.log(filterDataInfo)
      this.savedReportData = filterDataInfo
      if (filterDataInfo != "") {
     
        this.gridParams["startDate"] =filterDataInfo.startDate;
        this.gridParams["endDate"] =filterDataInfo.endDate;
    
        // this.gridParams['categoryIds'] = this.filtersForm.value.catType;
        this.gridParams["selectedStatuses"] = filterDataInfo.selectedStatuses;
        this.filterCount = filterDataInfo?.selectedStatuses?.length + 2
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
      disableClose: true,
      data: {
        module: "export_register",
      },
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
      data: { module: "export_register", filterParams: this.gridParams , statusList: this.statuses},
    });
    this.dialogRef.afterClosed().subscribe(async (res) => {
      if (res.success) {
       
        this.filtersApplied = true;
        this.isChanged = true;
     
        this.gridParams["endDate"] = moment(
          res.selectedFilters.end_date
        ).toLocaleString();
        this.gridParams["selectedStatuses"] = res.selectedFilters.status;
        this.filterCount = res.selectedFilters.status.length + 2;
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

  async loadReportHeaders() {
    try {
      this.columnDefs = await this.ReportsService.getReportHeaders({ type: 'export_register' });
      this.showGrid = true;
    } catch (error) {
      console.error('Error fetching report headers:', error);
    }
  }
  public sortModel = [];
  onSortChanged(ev) {
    this.sortModel = ev.api.getSortModel();
  }
}
