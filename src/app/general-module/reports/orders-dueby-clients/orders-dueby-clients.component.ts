import { Router, ActivatedRoute  } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../services/reports.service';
import { FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatDatepicker } from '@angular/material/datepicker';
import { SaveViewComponent } from '../../../dialogs/save-view/save-view.component';
import { DeleteViewComponent } from '../../../dialogs/delete-view/delete-view.component';
import { SnakbarService } from '../../../services/snakbar.service';
import * as _ from 'lodash';
import { constructor } from 'moment';
import * as moment from 'moment';
import { Images } from '../../../images/images.module';
declare var App: any;
@Component({
  selector: 'app-orders-dueby-clients',
  templateUrl: './orders-dueby-clients.component.html',
  styleUrls: ['./orders-dueby-clients.component.scss']
})
export class OrdersDuebyClientsComponent implements OnInit {
  public deleteIcon: string = App.public_url + 'signatures/assets/images/delete.svg';
  public sideBar: any;
  public rowData = [];
  public currentGridInfo: any = [];
  public viewsList = [];
  public dialogRef: any;
  public isChanged: boolean = false;
  public savedViewValue: any;
  public permissionForView: boolean = true;
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
  public reportsSpinner: boolean = false;
  public filtersApplied: boolean = false;
  public orders: any = [];
  public clients: any = [];
  public gridVisibility = false;
  public totalCount: number = 0;
  fetchingData = true;
  paginationPageSize: number = 50;
  public today = new Date();
  public images = Images;
  public yearStartDate = new Date(this.today.getFullYear(), 0, 1);
  filtersForm = this.fb.group({
    status: [[]],
    start_date: [this.yearStartDate, Validators.required],
    end_date: [this.today, Validators.required],
    country:[[]],
  });
  public countries = [];
  public gridParams = {

  }; 
  public params = {
    module: 'by_clients'
  }
  public statusList = [];
  public showSaveView = true;

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  viewMyId: number;
  constructor(private ReportsService: ReportsService, private fb: FormBuilder,
     public dialog: MatDialog,private snackbar: SnakbarService,
     private router: Router,private activateRoute: ActivatedRoute
     ) { }
  ngOnInit() {
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
      this.getOrdersDueByClientsReport();

      this.getFiltersData();
      setTimeout(()=>{ 
        this.getSelectedView(this.viewMyId);
      }, 1000);
      
     }else{
      this.savedViewValue = 1;
      this.isInitial = true;
      this.getOrdersDueByClientsReport();
      // console.log(this.orders)
      this.getViewsList();
      this.getFiltersData();
     }     
     

    })
  
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
  getFiltersData(): void {
    this.ReportsService
      .getRequiredDataForFilters({
        status: "",
        reportType:2
      })
      .then(response => {
        if (response.result.success) {
          this.statusList = response.result.data.invoiceStatus;
          this.clients = response.result.data.clients;
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
    this.gridParams['countryIds'] = [];
    this.gridParams['type'] = "aggrid";
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
 
  
  getGridData(): void {
    this.noData = false;
    this.reportsSpinner = true;
    this.fetchingData = true;
    this.ReportsService
      .ordersDueByClientsReport(this.gridParams)
      .then(response => {
        if (response.result.success) {
          let reportData = response.result.data;
          this.orders = reportData.finalReportData;
          this.totalCount = 50 //reportData.count;
          this.fetchingData = false;
          if (!this.orders.length) {
            this.noData = true;
            // this.adsService.showExportButton = false;
          }
          // console.log(reportData)
          this.columnDefs = this.generateColumns(reportData.headers);
          // console.log(this.columnDefs)
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
 
  getOrdersDueByClientsExportReport(): void {
    let params ={}
    console.log(this.filtersForm.value.client)
    if(this.filtersApplied){
      params = {
        startDate: moment(this.filtersForm.value.start_date).toLocaleString(),
        endDate: moment(this.filtersForm.value.end_date).toLocaleString(),
        selectedStatuses: this.filtersForm.value.status,
        countryIds:this.filtersForm.value.country,
        type: "excel"
      }
    }else{
      params = {
        startDate: "",
        endDate: "",
        selectedStatuses: [],
        countryIds:[],
        type: "excel"
      }
    }
    this.ReportsService
      .ordersDueByClientsReport(params)
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
        headerName: 'Invoice #',
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
      },{
        headerName: 'Client Name',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'client_name',
        width: 150,

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
      //   enableValue: true,
      //   aggFunc: 'sum',
      //   field: 'quantity',
      //   width: 150
      // },

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
        headerName: 'Amount',
        headerClass: 'center-align',
        cellClass: 'align-right',
        editable: false,
        sortable: true,
        resizable: true,
        rowGroup: false,
        enableRowGroup: true, 
        field: 'total_amount',
        width: 150
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
        width: 150
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
  
  getOrdersDueByClientsReport(): void {
    this.getGridData()
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
    //console.log(params)
    params.api.sizeColumnsToFit(); 
    // console.log(params)
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    if(this.savedViewValue != 1) {
      params.api.sizeColumnsToFit(); 
      this.setGridOptions(this.currentGridInfo);
    }
  }
 
  saveView() {
   // console.log(this.gridColumnApi)
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
        module: 'by_clients'
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
      status: [[]],
      start_date: ["2020-01-01"],
      end_date: [this.today],
      country:[[]],
    });
    this.gridParams['startDate'] = moment(this.filtersForm.value.start_date).toLocaleString();    
    this.gridParams['endDate'] = moment(this.filtersForm.value.end_date).toLocaleString();
    this.gridParams['selectedStatuses'] = this.filtersForm.value.status;
    this.gridParams['countryIds'] = this.filtersForm.value.country;
   
    this.gridParams['selectedClients'] = this.filtersForm.value.client;
  }
  getSelectedView(id) {
    this.isChanged = false;
   

    if(id == 1) {
      this.currentGridInfo = [];
      this.setInitialFilters();
      this.getOrdersDueByClientsReport();
      // this.getViewsList();
      this.getFiltersData();
      this.filtersApplied = false;
     
    } else {
      this.filtersApplied = true;
      const index = _.findIndex(this.viewsList, { view_id: id });
      this.savedViewValue = id
      const filterDataInfo = index > 0 ? this.viewsList[index].applied_filters : [];
      console.log(filterDataInfo)
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
        
        module: 'by_clients'
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
    //   module: 'by_clients'
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
