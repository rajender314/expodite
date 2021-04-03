import { Router, ActivatedRoute   } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReportsService } from '../../../services/reports.service';
import { OrganizationsService } from '../../../services/organizations.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SaveViewComponent } from '../../../dialogs/save-view/save-view.component';
import {DeleteViewComponent } from '../../../dialogs/delete-view/delete-view.component';
import { SnakbarService } from '../../../services/snakbar.service';
import { InventoryService } from '../../../services/inventory.service';


import * as _ from 'lodash';
import * as moment from 'moment';
import { Images } from '../../../images/images.module';
declare var App: any;
@Component({
  selector: 'app-invetory-reports',
  templateUrl: './invetory-reports.component.html',
  styleUrls: ['./invetory-reports.component.scss']
})


export class InvetoryReportsComponent implements OnInit {
  public deleteIcon: string = App.public_url + 'signatures/assets/images/delete.svg';
  public sideBar: any;
  public rowData = [];
  public currentGridInfo: any = [];
  public viewsList = [];
  public dialogRef: any;
  public permissionForView: boolean = true;
  public isChanged: boolean = false;
  public savedViewValue: any;
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
  paginationPageSize: number = 50;
  public today = new Date();
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  public images = Images;
  filtersForm = this.fb.group({
    start_date: [this.yearStartDate, Validators.required],
    end_date: [this.today, Validators.required],
    Category: [[]],
    status:[[]],
  });
  public statusList = [];

  public Categories = [];
  public gridParams = {
    reports:true
  };
  public params = {
    module: 'inventory'
  }
  public showSaveView = true;
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  viewMyId: number;
  constructor(private ReportsService: ReportsService, private fb: FormBuilder, public dialog: MatDialog, 
    private snackbar: SnakbarService, private router: Router,private InventoryService: InventoryService,private activateRoute: ActivatedRoute) { }
  ngOnInit() {
    // if (App.user_roles_permissions.length) {
    //   let i = _.findIndex(<any>App.user_roles_permissions, {
    //     name: 'Couriers'
    //   });
		// 	if (!App.user_roles_permissions[i].selected) {
    //     this.router.navigateByUrl('reports/access-denied');
		// 	} else {
    //     this.savedViewValue = 1;
    //     this.isInitial = true;
    //     this.getViewsList();
    //     this.getShipmentsReport();
    //     this.getFiltersData();
    //   }
		 
    // }
    this.viewMyId=0;  
    this.activateRoute.params.subscribe((res: any) => {
      if (typeof (res.id) != 'undefined') {  
      this.viewMyId=parseInt(res.id);  
      this.showSaveView = false;
      this.ReportsService.viewId =  this.viewMyId;
      } else {
        this.showSaveView = true;

      }
     if(this.viewMyId){
      this.savedViewValue = 1;
      this.isInitial = true;
      this.params.module = 'All'
      this.getViewsList();
      this.getFiltersData();
      this.getShipmentsReport();

      setTimeout(()=>{ 
        this.getSelectedView(this.viewMyId);
      }, 1000);
      
     }else{
      this.savedViewValue = 1;
      this.isInitial = true;
      this.getShipmentsReport();
      // console.log(this.orders)
      this.getViewsList();
      this.getFiltersData();
     }     
     

    })

    // this.savedViewValue = 1;
    // this.isInitial = true;
    // this.getViewsList();
    // this.getShipmentsReport();
    // this.getFiltersData();
    
  }
  getFiltersData(): void {
    this.ReportsService
      .getRequiredDataForFilters({
        reportType:6
      })
      .then(response => {
        if (response.result.success) {
          this.Categories = response.result.data.category;
          this.permissionForView = response.result.data.permissionForReportView;
          this.statusList = response.result.data.status;
        } else {

        }

      });
  }

  clearFilters(): void {
    this.filtersApplied = false;
    this.filtersForm = this.fb.group({
      Category: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
      status:[[]],
    });
    this.gridParams['startDate'] = "";
    this.gridParams['endDate'] = "";
    this.gridParams['InvproductsArr'] = [];
    this.gridParams['type'] = "aggrid";
    this.gridParams['batchStatusArr'] = [];
    this.getGridData();

  }
  filterReportData(): void {
    this.filtersApplied = true;
    this.isChanged = true;
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    this.gridParams['InvproductsArr'] = this.filtersForm.value.Category;
    this.gridParams['batchStatusArr'] = this.filtersForm.value.status;

    this.getGridData();

  }
  getGridData(): void {
    this.noData = false;
    this.reportsSpinner = true;
    this.fetchingData = true;
    this.InventoryService
      .BatchesList(this.gridParams)
      .then(response => {
        if (response.result.success) {
          let reportData = response.result.data;
          this.orders = reportData.finalReportData;
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
 
  getShipmentsExportReport(): void {
    let params = {}
    if (this.filtersApplied) {
      params = {
        startDate: moment(this.filtersForm.value.start_date).toLocaleString(),
        endDate: moment(this.filtersForm.value.end_date).toLocaleString(),
        InvproductsArr: this.filtersForm.value.Category,
        batchStatusArr:this.filtersForm.value.status,
        type: "excel",
        reports: true
      }
    } else {
      params = {
        startDate: "",
        endDate: "",
        InvproductsArr: [],
        batchStatusArr: [],
        type: "excel",
        reports: true
      }
    }
    this.InventoryService
    .BatchesList(params)
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
        headerName: 'Batch',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'batch_nbr',
        width: 150
      },
      {
        headerName: 'Category',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'category_name',
        width: 150
      },
      {
        headerName: 'Product',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'product_name',
        width: 180
      },
      {
        headerName: 'Mfg. Date',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'mfd_date',
        width: 200,
     
      },
      {
        headerName: 'Exp. Date',
        // headerClass: 'right-align',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'exp_date',
        // cellClass: 'align-right',
        width: 200,
      
        
      },
      {
        headerName: 'Quantity',
        // headerClass: 'right-align',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'tot_qty',
        // cellClass: 'align-right',
        width: 150,
        
      },
      {
        headerName: 'Unit',
        // headerClass: 'right-align',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'uom_name',
        // cellClass: 'align-right',
        width: 150,
        
      },
      {
        headerName: 'Remaining Quantity',
        // headerClass: 'right-align',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'remain_quan',
        // cellClass: 'align-right',
        width: 200,
        
      },
      {
        headerName: 'Status',
        // headerClass: 'right-align',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'status_name',
        // cellClass: 'align-right',
        width: 150,
        
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
  getShipmentsReport(): void {
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

  onGridChanged() {
    this.isChanged = true;
    // console.log(999)
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if(this.savedViewValue != 1) {
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
        module: 'inventory'
      }
    });
    this.dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.isChanged = false;
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
      Category: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
    });
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    this.gridParams['InvproductsArr'] = this.filtersForm.value.Category;
    this.gridParams['batchStatusArr'] = this.filtersForm.value.status;

  }
  getSelectedView(id) {
    this.isChanged = false;

    if(id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getShipmentsReport();
      this.getFiltersData();
      this.filtersApplied = false;
    } else {
      this.filtersApplied = true;
      const index = _.findIndex(this.viewsList, { view_id: id });
      this.savedViewValue = id;
      const filterDataInfo = index > 0 ? this.viewsList[index].applied_filters : [];
      // console.log(filterDataInfo)
      if(filterDataInfo != "") {
        console.log(filterDataInfo)
  
        this.filtersForm.value.start_date = filterDataInfo.start_date;
        this.filtersForm.value.end_date = filterDataInfo.end_date;
        this.filtersForm.value.Category = filterDataInfo.Category;
        this.filtersForm.value.status = filterDataInfo.status;

        this.filtersForm = this.fb.group({
          Category: [this.filtersForm.value.Category],
          start_date: [this.filtersForm.value.start_date],
          end_date: [this.filtersForm.value.end_date],
          status:[this.filtersForm.value.status],
        });
        this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
        this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
        this.gridParams['InvproductsArr'] = this.filtersForm.value.Category;
        this.gridParams['batchStatusArr'] = this.filtersForm.value.status;

        this.getGridData();
        
      } else {
          this.setInitialFilters();
          this.gridApi.setRowData(this.rowDataCopy); 
      }
      this.currentGridInfo = index > 0 ? this.viewsList[index].grid_info : [];
      this.setGridOptions(this.currentGridInfo);
      
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
        
        module: 'shipment'
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
    })
    
  }
 
  getViewsList = function() {
    // const params = {
    //   module: 'inventory'
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