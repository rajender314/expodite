import { ReportsComponent } from './../reports-list/reports.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SaveViewComponent } from '../../../dialogs/save-view/save-view.component';
import { DeleteViewComponent } from '../../../dialogs/delete-view/delete-view.component';
import { SnakbarService } from '../../../services/snakbar.service';
import { type } from 'os';
import { constructor } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Images } from '../../../images/images.module';
declare var App: any;

@Component({
  selector: 'app-ordersby-status',
  templateUrl: './ordersby-status.component.html',
  styleUrls: ['./ordersby-status.component.scss'],
  providers:[ReportsComponent]
})
export class OrdersbyStatusComponent implements OnInit {
  public deleteIcon: string = App.public_url + 'signatures/assets/images/delete.svg';
  public sideBar: any;
  public rowData = [];
  public currentGridInfo: any = [];
  public viewsList = [];
  public dialogRef: any;
  public permissionForView: boolean = true;
  public isChanged: boolean = false;
  public savedViewValue: any;
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
    module: 'by_status'
  }
  filtersForm = this.fb.group({
    status: [[]],
    start_date: [this.yearStartDate, Validators.required],
    end_date: [this.today, Validators.required],
    country:[[]],
  });
  public gridParams = {
    
  }; 
  
  viewMyId: number;
  public showSaveView = true;
  constructor(private ReportsService: ReportsService, private fb: FormBuilder, public dialog: MatDialog,
    public reportsComponent: ReportsComponent, 
    private snackbar: SnakbarService,
    private router: Router,private activateRoute: ActivatedRoute,) { }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  ngOnInit() {
   this.viewMyId=0;  
    this.activateRoute.params.subscribe((res: any) => {
      console.log(res)
      if (typeof (res.id) != 'undefined') {  
      this.viewMyId=parseInt(res.id);  
      this.ReportsService.viewId =  this.viewMyId;
      this.showSaveView = false;
      } else {
        this.showSaveView = true;

      }
     if(this.viewMyId){
      this.savedViewValue = 1;
      this.isInitial = true;
      this.params.module = 'All';
      this.getViewsList();
      this.getOrdersByStatusReport();

      this.getFiltersData();
      setTimeout(()=>{ 
        this.getSelectedView(this.viewMyId);
      }, 1000);
      
     }else{
      this.savedViewValue = 1;
      this.isInitial = true;
      this.getOrdersByStatusReport();
      // console.log(this.orders)
      this.getViewsList();
      this.getFiltersData();
     }     
     

    })


    // if (App.user_roles_permissions.length) {
    //   let i = _.findIndex(<any>App.user_roles_permissions, {
    //     name: 'Orders By Status'
    //   });
		// 	if (!App.user_roles_permissions[i].selected) {
    //     this.router.navigateByUrl('reports/access-denied');
		// 	} else {
    //     this.savedViewValue = 1;
    //     this.isInitial = true;
    //     this.getOrdersByStatusReport();
    //     // console.log(this.orders)
    //     this.getViewsList();
    //     this.getFiltersData();
    //   }
		 
    // }

 
   
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
      : '';

  }
  getOrdersByStatusExportReport(): void {
    // this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();    
    // this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    // this.gridParams['selectedStatuses'] = this.filtersForm.value.status;
    // console.log(this.gridParams['startDate'])
    let params = {}
    if (this.filtersApplied) {
      params = {
        startDate: moment(this.filtersForm.value.start_date).toLocaleString(),
        endDate: moment(this.filtersForm.value.end_date).toLocaleString(),
        selectedStatuses: this.filtersForm.value.status,
        countryIds:this.filtersForm.value.country,
        type: "excel"
      }
    } else {
      params = {
        startDate: "",
        endDate: "",
        selectedStatuses: [],
        countryIds:[],
        type: "excel"
      }
    }
    this.ReportsService
      .ordersByStatusReportExport(params)
    .then(response => {
      if (response.result.success) {
        let downloadPath = response.result.data.filePath;
        window.location.href = '' + App.base_url + '' + downloadPath + '';
      } else {
        
      }

    });
  }
  generateColumns = (data: any) => {
    
    let cols = [
      {
        headerName: 'Order #',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'order_no',
        width: 150
      },
      {
        headerName: 'Date',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'date_added',
        width: 150
      },
      {
        headerName: 'Status',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'status',
        width: 150
      },
      // {
      //   headerName: 'Product Name',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true, 
      //   field: 'product_name',
      //   width: 300
      // },
      // {
      //   headerName: 'Product Price',
      //   headerClass: 'right-align',
      //   cellClass: 'align-right',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true, 
      //   field: 'product_price',
      //   width: 150
      // },
      // {
      //   headerName: 'Quantity',
      //   headerClass: 'right-align',
      //   cellClass: 'align-right',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true, 
      //   field: 'quantity',
      //   enableValue: true,
      //   aggFunc: 'sum',
      //   width: 150
      // },
      {
        headerName: 'Client Name',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'client_name',
        width: 200,

      },
      {
        headerName: 'Currency',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'currency_name',
        width: 100,
      },
      
      {
        headerName: ' Amount',
        headerClass: 'center-align',
        cellClass: 'align-right',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'total_amount',
        width: 200
      },
      
      // {
      //   headerName: 'Shipping Company Name',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true, 
      //   field: 'shipping_company_name',
      //   width: 200
      // },
      // {
      //   headerName: 'Ship State',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true, 
      //   field: 'ship_state',
      //   width: 150
      // },
      {
        headerName: 'Country',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'ship_country',
        width: 200
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
    return cols
  }
  getOrdersByStatusReport(): void {
    this.getGridData();
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
        },
      ],
      // hiddenByDefault: true,
    }
    
  }
  getFiltersData(): void{
    this.ReportsService
      .getRequiredDataForFilters({
        status: "",
        reportType:1
      })
    .then(response => {
      if (response.result.success) {
        this.statusList = response.result.data.statuses;
        this.permissionForView = response.result.data.permissionForReportView;
        // console.log(this.statusList);
        this.countries = response.result.data.countrys;

      } else {

      }

  });
  }
  clearFilters(): void {
    this.filtersApplied = false;
    this.filtersForm = this.fb.group({
      status: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
      country:[[]],
    });
    this.gridParams['startDate'] = "";    
    this.gridParams['endDate'] = "";
    this.gridParams['selectedStatuses'] = [];
    this.gridParams['type'] = "aggrid";
    
    this.gridParams['countryIds'] = [];
    this.getGridData();
    
  }
  filterOrdersReportData(): void {
    this.filtersApplied = true;
    this.isChanged = true;
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();    
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    this.gridParams['selectedStatuses'] = this.filtersForm.value.status;
    this.gridParams['countryIds'] = this.filtersForm.value.country;
    this.getGridData();
    
  }

  getGridData() {
    this.noData = false;
    this.reportsSpinner = true;
    this.fetchingData = true;
    this.ReportsService
      .ordersByStatusReport(this.gridParams)
      .then(response => {
        if (response.result.success) {
          let reportData = response.result.data;
          this.orders = reportData.finalReportData;
          // if(this.isInitial) {
          //   this.ordersCopy = this.orders;
          // }
          
          this.totalCount = reportData.count;
          this.fetchingData = false;
          if (!this.orders.length) {
            this.noData = true;
            // this.adsService.showExportButton = false;
          }
          // console.log(reportData)
          this.columnDefs = this.generateColumns(reportData.headers);
          this.rowData = reportData.finalReportData;
          if(this.isInitial) {
            this.rowDataCopy = this.rowData;
            this.isInitial = false;
          }
          this.reportsSpinner = false;
        } else {

        }

      });

  }
  onGridChanged() {
    this.isChanged = true;
  }
  onGridReady(params) {
    // console.log(params)
    params.api.sizeColumnsToFit(); 
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if(this.savedViewValue != 1) {
      this.setGridOptions(this.currentGridInfo);
      params.api.sizeColumnsToFit(); 
    }
  }
  
  saveView() {

    let data;
    if(this.gridColumnApi != undefined) {
       data = {
        groupInfo: this.gridColumnApi.getRowGroupColumns(),
        filterInfo: this.gridApi.getFilterModel(),
        valColumnInfo: this.gridColumnApi.getValueColumns(),
        allColumnsInfo: this.gridColumnApi.getAllColumns(),
        pivoteMode: this.gridColumnApi.isPivotMode(),
        allPivoteColumns: this.gridColumnApi.getPivotColumns(),
        sortColumns: this.gridApi.getSortModel(),
        // searchInfo: this.search.value,
        columnState: this.gridColumnApi.getColumnState() //this.gridApi.columnController.allDisplayedColumns
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
        columnState: [] //this.gridApi.columnController.allDisplayedColumns
      };
    }
    var filteredGridValues = this.ReportsService.getGridInfo(data);
    // console.log(filteredGridValues)
    this.dialogRef = this.dialog.open(SaveViewComponent, {
      width: '550px',
      height: '340px',
      data: {
        filterData: this.filtersForm.value,
        gridData: filteredGridValues,
        isFiltersApplied: this.filtersApplied,
        module: 'by_status'
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isChanged = false;
          this.params.module = 'All'
          // this.reportsComponent.getViewsList('flag');
          this.ReportsService.setTriggerData(true)

         this.getViewsList();
         setTimeout(() => {
          this.savedViewValue = res;
         }, 100);
        
      }
    });
  }
  setInitialFilters() {
    this.filtersForm = this.fb.group({
      status: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
      country:[[]],
    });
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();    
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    this.gridParams['selectedStatuses'] = this.filtersForm.value.status;
    this.gridParams['countryIds'] = this.filtersForm.value.country;
  }
  getSelectedView(id) {
    this.isChanged = false;
    if(id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getOrdersByStatusReport();
      // this.getViewsList();
      this.getFiltersData();
      this.filtersApplied = false;

    } else {
      this.filtersApplied = true;
      //this.savedViewValue = id;
      this.savedViewValue = id;
      const index = _.findIndex(this.viewsList, { view_id: id });
      const filterDataInfo = index > 0 ? this.viewsList[index].applied_filters : [];
       
      if(filterDataInfo != "") {
        this.filtersForm.value.start_date = filterDataInfo.start_date;
        this.filtersForm.value.end_date = filterDataInfo.end_date;
        this.filtersForm.value.status = filterDataInfo.status;
        this.filtersForm.value.country = filterDataInfo.country;

        this.filtersForm = this.fb.group({
          status: [this.filtersForm.value.status],
          start_date: [this.filtersForm.value.start_date],
          end_date: [this.filtersForm.value.end_date],
          country: [this.filtersForm.value.country],
        });
        this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();    
        this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
        this.gridParams['selectedStatuses'] = this.filtersForm.value.status;
        this.gridParams['countryIds'] = this.filtersForm.value.country;
        this.getGridData();
        //this.gridApi.sizeColumnsToFit(); 
        
      } else {
        this.setInitialFilters();
        this.gridApi.setRowData(this.rowDataCopy);
      }
      
     
        this.currentGridInfo = index > 0 ? this.viewsList[index].grid_info : [];
        this.setGridOptions(this.currentGridInfo);
      
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
      searchInfo = '',
      columnState = [];
    // console.log(gridinfo)
      if (gridinfo) {
        colKeys = gridinfo['inVisibleColumnsInfo'] || [];
        filters = gridinfo['filterInfo'] ? gridinfo['filterInfo'][0] || [] : [];
        rowGroupFields = gridinfo['groupInfo'] || [];
        pivoteMode = gridinfo['pivoteMode'] || false;
        pivoteColumns = gridinfo['pivoteColumns'] || [];
        sortColumns = gridinfo['sortColumns'] || [];
        searchInfo = gridinfo['searchInfo'] || '';
        columnState = gridinfo['columnState'] || [];
      }
      if (this.gridColumnApi) {
        const columns = this.gridColumnApi.getAllColumns();
        columns.forEach(column => {
          allFields.push(column['colId']);
          if (!column['visible']) {
            this.gridColumnApi.setColumnVisible(column['colId'], true);
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
  deleteView = function(id, i) {
    event.stopPropagation();
    const params = {
      view_id : id
    }
    let dialogRef = this.dialog.open(DeleteViewComponent, {
      width: '550px',
      data: {
        
        module: 'by_status'
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ReportsService.deleteViewItem(params)
        .then(response => {
          if (response.result.success) {
            this.isChanged = false;
          
            if(id == this.savedViewValue) {
                this.savedViewValue = 1;
                this.getSelectedView(this.savedViewValue)
            }
            this.viewsList.splice(i, 1);
            let toastMsg: object;
                toastMsg = { msg: 'View deleted successfully', status: 'success' };
                this.snackbar.showSnackBar(toastMsg);
          } 
        })
      }
    });
    
  }
  getViewsList = function() {
    // const params = {
    //   module: 'by_status'
    // }
    this.ReportsService.getViewsList(this.params)
      .then(response => {
        if (response.result.success) {
          this.viewsList = response.result.data;
          this.viewsList.forEach(element => {
            element.grid_info = JSON.parse(element.grid_info);
            element.applied_filters = JSON.parse(element.applied_filters);
          });
          if(this.viewsList.length) {
            this.viewsList.unshift({ view_name: 'Default View', view_id: 1 });
          }
          
          // console.log(this.viewsList)
        } 
      })
  }
}

