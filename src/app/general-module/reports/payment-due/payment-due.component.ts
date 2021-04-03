import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReportsService } from '../../../services/reports.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SaveViewComponent } from '../../../dialogs/save-view/save-view.component';
import { DeleteViewComponent } from '../../../dialogs/delete-view/delete-view.component';
import { SnakbarService } from '../../../services/snakbar.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
declare var App: any;
@Component({
  selector: 'app-payment-due',
  templateUrl: './payment-due.component.html',
  styleUrls: ['./payment-due.component.scss']
})
export class PaymentDueComponent implements OnInit {
  // @ViewChild('allSelected') private allSelected: MatOption;
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
  public start: any = "";
  public end: any = "";
  public today = new Date();
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  public matSelectOpen = false;
  paginationPageSize: number = 50;
  filtersForm = this.fb.group({
    // client: [[]],
    // currency: [[]],
    // start_date: [this.yearStartDate, Validators.required],
    end_date: [this.today, Validators.required],
  });
  
  public clientsFilterCtrl: FormControl = new FormControl();
  public clients = [];
  public currencies = [];
  public gridParams = {

  };
  public params = {
    module: 'payment_due'
  }
  private param: any = {
    search: '',
  }
  public showSaveView = true;

  protected _onDestroy = new Subject<void>();
  
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  viewMyId: number;
  constructor(private ReportsService: ReportsService, private fb: FormBuilder,
     public dialog: MatDialog, private snackbar: SnakbarService,
     private router: Router,private activateRoute: ActivatedRoute) { }
  ngOnInit() {
    // if (App.user_roles_permissions.length) {
    //   let i = _.findIndex(<any>App.user_roles_permissions, {
    //     name: 'Payment Due'
    //   });
		// 	if (!App.user_roles_permissions[i].selected) {
    //     this.router.navigateByUrl('reports/access-denied');
		// 	} else {
    //     this.savedViewValue = 1;
    //     this.isInitial = true;
    //     this.getViewsList();
    //     this.getPaymentDueReport();
    //     this.getFiltersData();
    //     this.clientsFilterCtrl.valueChanges
    //       .pipe(takeUntil(this._onDestroy))
    //       .subscribe(() => {
    //         this.searchOrganizations();
    //       });
    //     // this.filtersForm = this.fb.group({
    //     //   currency: new FormControl('')
    //     // });
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
      this.params.module = 'All';
      this.getViewsList();
      this.getFiltersData();
      this.getPaymentDueReport();
      setTimeout(()=>{ 
        this.getSelectedView(this.viewMyId);
      }, 1000);
      
     }else{
      this.savedViewValue = 1;
      this.isInitial = true;
      this.getPaymentDueReport();
      // console.log(this.orders)
      this.getViewsList();
      this.getFiltersData();
     }     
     

    })
    // this.savedViewValue = 1;
    // this.isInitial = true;
    // this.getViewsList();
    // this.getPaymentDueReport();
    // this.getFiltersData();
    // this.clientsFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.searchOrganizations();
    //   });


   
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
      this.ReportsService
        .getRequiredDataForFilters(this.param)
        .then(response => {
          if (response.result.success) {
            this.clients = response.result.data.client;
            this.permissionForView = response.result.data.permissionForReportView;
            // this.currencies = response.result.data.currencys;
            // this.productTypes = response.result.data.productTypes;
            // console.log(this.statusList);

          } 
        });
    }
  }
  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false
  }
  getFiltersData(): void {
    this.ReportsService
      .getRequiredDataForFilters({
        reportType: 4
      })
      .then(response => {
        if (response.result.success) {
          this.permissionForView = response.result.data.permissionForReportView;
          this.clients = response.result.data.clients;
          this.currencies = response.result.data.currencys;
          // console.log(this.statusList);

        } else {

        }

      });
  }

  clearFilters(): void {
    this.filtersApplied = false;
    this.filtersForm = this.fb.group({
      // client: [[]],
      // currency: [[]],
      // start_date: ["2020-01-01"],
      end_date: [this.today],
    });
   // this.gridParams['startDate'] = "";
    this.gridParams['endDate'] = "";
    // this.gridParams['selectedClients'] = "";
    // this.gridParams['currencyTypeIds'] = "";
    this.gridParams['type'] = "aggrid";

    this.getGridData();

  }
  filterReportData(): void {
    this.filtersApplied = true;
    this.isChanged = true;
    //this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    // this.gridParams['selectedClients'] = this.filtersForm.value.client;
    // this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;

    this.getGridData();

  }
  getGridData(): void {
    this.noData = false;
    this.reportsSpinner = true;
    this.fetchingData = true;
    this.ReportsService
      .paymentDueReport(this.gridParams)
      .then(response => {
        if (response.result.success) {
          let reportData = response.result.data;
          this.orders = reportData.finalReportData;
          this.totalCount = reportData.count;
          this.start = reportData.defaultFilters.startDate;
          this.end = reportData.defaultFilters.endDate;
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
  getPaymentDueExportReport(): void {
    let params = {}
    if (this.filtersApplied) {
      params = {
       // startDate: moment(this.filtersForm.value.start_date).toLocaleString(),
        endDate: moment(this.filtersForm.value.end_date).toLocaleString(),
       // selectedClients: this.filtersForm.value.client,
        //currencyTypeIds: this.filtersForm.value.currency,
        type: "excel"
      }
    } else {
      params = {
        startDate: "",
        endDate: "",
        selectedClients: [],
        currencyTypeIds: [],
        type: "excel"
      }
    }
    this.ReportsService
      .paymentDueReport(params)
      .then(response => {
        if (response.result.success) {
          let downloadPath = response.result.data.filePath;
          console.log(downloadPath)
          window.location.href = '' + App.base_url + '' + downloadPath + '';

        } else {

        }

      });
  }
  generateColumns = (data: any) => {

    let cols = [
      {
        headerName: 'Invoice#',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'invoice_number',
        width: 150
      },
      {
        headerName: 'Client Name',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'client_name',
        width: 150
      },

      {
        headerName: 'Currency',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'currency_name',
        width: 100
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
        field: 'due_amount',
        width: 150
      },

      
      {
        headerName: 'Country',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'country_name',
        width: 300
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
  getPaymentDueReport(): void {
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

  onGridChanged(event) {
    this.isChanged = true;
    // console.log(999)
  }
  onGridReady(params) {
    params.api.sizeColumnsToFit(); 
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if(this.savedViewValue != 1) {
      this.setGridOptions(this.currentGridInfo);
      params.api.sizeColumnsToFit(); 
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
        module: 'payment_due'
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
      client: [[]],
      currency: [[]],
      // productType: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
    });
    //this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
   // this.gridParams['selectedClients'] = this.filtersForm.value.client;
    // this.gridParams['productTypeIds'] = this.filtersForm.value.productType;
    //this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;
  }
  getSelectedView(id) {
    this.isChanged = false;

    if(id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getPaymentDueReport();
      this.getFiltersData();
      this.filtersApplied = false;
     
    } else {
      this.filtersApplied = true;
      const index = _.findIndex(this.viewsList, { view_id: id });
      this.savedViewValue = id;
      const filterDataInfo = index > 0 ? this.viewsList[index].applied_filters : [];
      // console.log(filterDataInfo)
      if(filterDataInfo != "") {
        
  
       // this.filtersForm.value.start_date = filterDataInfo.start_date;
        this.filtersForm.value.end_date = filterDataInfo.end_date;
       // this.filtersForm.value.client = filterDataInfo.client;
        //this.filtersForm.value.currency = filterDataInfo.currency;
        // this.filtersForm.value.productType = filterDataInfo.productType;

        this.filtersForm = this.fb.group({
          //client: [this.filtersForm.value.client],
          //currency: [this.filtersForm.value.currency],
          // productType: [this.filtersForm.value.productType],
          //start_date: [this.filtersForm.value.start_date],
          end_date: [this.filtersForm.value.end_date]
        });
        //this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
        this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
        //this.gridParams['selectedClients'] = this.filtersForm.value.client;
        // this.gridParams['productTypeIds'] = this.filtersForm.value.productType;
        //this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;
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
        
        module: 'payment_due'
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
    const params = {
      module: 'payment_due'
    }
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
