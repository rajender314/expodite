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
import { DeleteViewComponent } from '../../../dialogs/delete-view/delete-view.component';
import { SnakbarService } from '../../../services/snakbar.service';

import * as _ from 'lodash';
import * as moment from 'moment';

declare var App: any;
@Component({
  selector: 'app-sales-mtd',
  templateUrl: './sales-mtd.component.html',
  styleUrls: ['./sales-mtd.component.scss']
})
export class SalesMtdComponent implements OnInit {
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
  public today = new Date();
  public monthStartDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  fetchingData = true;
  paginationPageSize: number = 50;
  filtersForm = this.fb.group({
    country: [[]],
    currency: [[]],
    start_date: [this.monthStartDate, Validators.required],
    end_date: [this.today, Validators.required],
    productType: [[]],
    catType:[[]],
  });
  public productTypes = [];
  public catagiries = [];
  public countries = [];
  public currencies = [];
  public gridParams = {

  };
  public params = {
    module: 'month_to_date'
  }
  private autoGroupColumnDef;
  private aggFuncs;
  public showSaveView = true;

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
    //     name: 'Sales Month To Date'
    //   });
		// 	if (!App.user_roles_permissions[i].selected) {
    //     this.router.navigateByUrl('reports/access-denied');
		// 	} else {
    //     this.savedViewValue = 1;
    //     this.isInitial = true;
    //     this.getViewsList();
    //     this.getSalesMonthToDateReport();
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
      this.params.module = 'All';
      this.getViewsList();
      this.getFiltersData();
      this.getSalesMonthToDateReport();

      setTimeout(()=>{ 
        this.getSelectedView(this.viewMyId);
      }, 3000);
      
     }else{
      this.savedViewValue = 1;
      this.isInitial = true;
      this.getSalesMonthToDateReport();
      // console.log(this.orders)
      this.getViewsList();
      this.getFiltersData();
     }     
     

    })

    // this.savedViewValue = 1;
    //     this.isInitial = true;
    //     this.getViewsList();
    //     this.getSalesMonthToDateReport();
    //     this.getFiltersData();

   
  }
  getFiltersData(): void {
    this.ReportsService
      .getRequiredDataForFilters({
        status: "",
        reportType:5
      })
      .then(response => {
        if (response.result.success) {
          this.permissionForView = response.result.data.permissionForReportView;
          this.countries = response.result.data.countrys;
          this.currencies = response.result.data.currencys;
          this.productTypes = response.result.data.productTypes;
          this.catagiries = response.result.data.category;
          // console.log(this.statusList);

        } else {

        }

      });
  }

  clearFilters(): void {
    this.filtersApplied = false;
    this.filtersForm = this.fb.group({
      country: [[]],
      currency: [[]],
      start_date: ["2020-10-01"],
      end_date: [this.today],
      catType: [[]],
    });
    this.gridParams['startDate'] = "";
    this.gridParams['endDate'] = "";
    // this.gridParams['countryIds'] = "";
    this.gridParams['categoryIds'] = "";
    // this.gridParams['currencyTypeIds'] = "";
    this.gridParams['type'] = "aggrid";

    this.getGridData();

  }
  filterReportData(): void {
    this.filtersApplied = true;
    this.isChanged = true;
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    // this.gridParams['countryIds'] = this.filtersForm.value.country;
    this.gridParams['categoryIds'] = this.filtersForm.value.catType;
    // this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;

    this.getGridData();

  }
  getGridData(): void {
    this.noData = false;
    this.reportsSpinner = true;
    this.fetchingData = true;
    this.ReportsService
      .salesMonthToDateReport(this.gridParams)
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
  getSalesMonthToDateExportReport(): void {
    let params = {}
    if (this.filtersApplied) {
      params = {
        startDate: moment(this.filtersForm.value.start_date).toLocaleString(),
        endDate: moment(this.filtersForm.value.end_date).toLocaleString(),
        // countryIds: this.filtersForm.value.country,
        // productTypeIds: this.filtersForm.value.productType,
        // currencyTypeIds: this.filtersForm.value.currency,
        type: "excel",
        categoryIds:this.filtersForm.value.catType,

      }
    } else {
      params = {
        startDate: "",
        endDate: "",
        // countryIds: [],
        // productTypeIds: [],
        // currencyTypeIds: [],
        type: "excel",
        categoryIds:[]
      }
    }
    this.ReportsService
      .salesMonthToDateReport(params)
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
        headerName: 'Category',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        field: 'category_name',
        width: 200
      },
      {
        headerName: 'Product',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        field: 'product_name',
        width: 200
      },
      {
        headerName: 'Batch',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        enableValue: true,
        // aggFunc: 'sum',
        field: 'batch_number',
        width: 150
      },
      
      {
        headerName: 'Quantity',
        headerClass: 'right-align',
        cellClass: 'align-right',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        enableValue: true,
        aggFunc: 'sum',
        field: 'quantity',
        width: 150
      },
      {
        headerName: 'Unit',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true,
        enableValue: true,
        // aggFunc: 'sum',
        field: 'uom_name',
        width: 150
      },
      {
        headerName: 'Currency',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'currency',
        width: 150
      },
      {
        headerName: 'Amount',
        headerClass: 'center-align',
        cellClass: 'align-right',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'total_price',
        width: 150
      },
      
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
        headerName: 'Date',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'invoice_date',
        width: 200
      },
      {
        headerName: 'Client Name',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'client_name',
        width: 150,

      },
      {
        headerName: 'Country',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'country_name',
        width: 150
      },
     
      // {
      //   headerName: 'Total Price',
      //   headerClass: 'right-align',
      //   cellClass: 'align-right',
      //   editable: false,
      //   sortable: true,
      //   resizable: true,
      //   rowGroup: false,
      //   enableRowGroup: true,
      //   enableValue: true,
      //   // aggFunc: 'sum',
      //   field: 'total_price',
      //   width: 150
      // },
    ];
    // this.autoGroupColumnDef = {
    //   headerName: 'Athlete',
    //   field: 'athlete',
    //   minWidth: 250
    // }
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
  getSalesMonthToDateReport(): void {
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
  };
  onGridChanged(event) {
    this.isChanged = true;
  }
  onGridReady(params) {
    this.gridApi = params.api;
  // params.api.sizeColumnsToFit(); 
    this.gridColumnApi = params.columnApi;
    if(this.savedViewValue != 1) {
      this.setGridOptions(this.currentGridInfo);
     // params.api.sizeColumnsToFit(); 
    }
    // 
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
        module: 'month_to_date'
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
      country: [[]],
      currency: [[]],
      catType: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
    });
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    // this.gridParams['countryIds'] = this.filtersForm.value.country;
    // this.gridParams['productTypeIds'] = this.filtersForm.value.productType;
    // this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;
    this.gridParams['categoryIds'] = this.filtersForm.value.catType;
  }
  getSelectedView(id) {
    this.isChanged = false;

    if(id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getSalesMonthToDateReport();
      this.getFiltersData();
      this.filtersApplied = false;
     
    } else {
      this.filtersApplied = true;
      const index = _.findIndex(this.viewsList, { view_id: id });
      this.savedViewValue = id;
      const filterDataInfo = index > 0 ? this.viewsList[index].applied_filters : [];
      // console.log(filterDataInfo)
      if(filterDataInfo != "") {
        
  
        this.filtersForm.value.start_date = filterDataInfo.start_date;
        this.filtersForm.value.end_date = filterDataInfo.end_date;
        // this.filtersForm.value.country = filterDataInfo.country;
        this.filtersForm.value.catType = filterDataInfo.catType;
        // this.filtersForm.value.productType = filterDataInfo.productType;

        this.filtersForm = this.fb.group({
          catType: [this.filtersForm.value.catType],
          start_date: [this.filtersForm.value.start_date],
          end_date: [this.filtersForm.value.end_date]
        });
        this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();
        this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
        // this.gridParams['countryIds'] = this.filtersForm.value.country;
        this.gridParams['categoryIds'] = this.filtersForm.value.catType;
        // this.gridParams['currencyTypeIds'] = this.filtersForm.value.currency;
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
        
        module: 'sales_mtd'
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
    //   module: 'month_to_date'
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
