import { ReportsService } from './../../../services/reports.service';
import { Images } from './../../../images/images.module';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Subject } from 'rxjs';


import * as _ from 'lodash';
import { AdminService } from '../../../services/admin.service';
import { HttpClient } from '@angular/common/http';

declare var App: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('ReportsListAnimate', [
      transition(':enter', [
        style({ transform: 'translateX(-100px)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ],
  providers: [Title, ReportsService]
})
  export class ReportsComponent implements OnInit {
    // viewsList: Subject<any[]> = new Subject<any[]>()


  private routerActive = '';
  private images = Images;
  private timeout;
  searching: boolean;
  public viewsList =[];
  activeModule ='';
  activeModuleName:any;
  // sideListReports: Array<any> = [
  //   { id: 1, name: 'Orders', route: 'ordersReport', icon: this.images.roles, selected: true, code: "orders_by_status_report"},
  //   { id: 2, name: 'Invoices', route: 'invoicesReport', icon: this.images.roles , selected: true, code: "orders_due_to_clients_report"},
  //   { id: 3, name: 'Payments Received', route: 'paymentsRecievedReport', icon: this.images.containers , selected: true, code: "sales_year_to_date_report"},
  //   { id: 5, name: 'Payments Due', route: 'paymentsDueReport', icon: this.images.contactAddress , selected: true, code: "payment_due_report"},
  //   { id: 4, name: 'Product Sales', route: 'productSalesReport', icon: this.images.containers , selected: true, code: "sales_month_to_date_report"},
  //   { id: 7, name: 'Inventory', route: 'inventoryReport', icon: this.images.products , selected: true, code: "inventory_report"},
  //   { id: 6, name: 'Shipments', route: 'shipmentsReport', icon: this.images.products , selected: true, code: "couriers_report"},
  //   { id: 8, name: 'Export Register', route: 'exportRegisterReport', icon: this.images.products , selected: true, code: "export_register"},
  //   { id: 9, name: 'F.I.R.C Report', route: 'fircReport', icon: this.images.products , selected: true, code: "firc_report"},
  //   { id: 10, name: 'Insurance Report', route: 'insuranceReport', icon: this.images.products , selected: true, code: "insurance_report"},
  //   { id: 11, name: 'Forex Gain/Loss Report', route: 'forexReport', icon: this.images.products , selected: true, code: "forex_report"},
  //   { id: 12, name: 'Forex Gain/Loss Report(Grouped)', route: 'forexreportGrouped', icon: this.images.products , selected: true, code: "three_months_forex_report"},

  // ];
  search: string;
  labelObj = {
    "by_status":"Orders",
    "by_clients":"Invoice",
    "year_to_date":"Payments Received",
    "payment_due":"Payments Due",
    "month_to_date":"Product Sales",
    "inventory":"Inventory",
    "shipment":"Shipments" ,
    "export_register":"Export Register",
    "firc_report":"F.I.R.C Report",
    "insurance_report":"Insurance Report",
    "forex_report":"Forex Gain/Loss Report",


  }

  constructor(
    private titleService: Title,
    public ReportsService: ReportsService,
    private router: Router,
    private changeDetection: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private adminService: AdminService,
    private http: HttpClient
  ) { }
    public moduleId = ""
  ngOnInit() {
    // console.log( this.activatedRoute);
    this.activatedRoute.params.subscribe(url => {
    });
    this.titleService.setTitle('Expodite - Reports');
		// if (App.user_roles_permissions.length) {
    //   let i = _.findIndex(<any>App.user_roles_permissions, {
    //     name: 'Reports'
    //   });
		// 	if (!App.user_roles_permissions[i].selected) {
    //     this.router.navigateByUrl('access-denied');
		// 	}

    // }
  this.getViewsList();
    // this.updatePermissions();
    this.ReportsService.getTriggerData().subscribe(response => {
      // console.log(response)
      if(response) {
        this.getViewsList();
      }
      //
    })
    // this.adminService.getModuleId().subscribe((res) => {
    //   this.moduleId = res;
    // })

    this.getSecondLevelMenus();
  }
  public sideList = []
  getSecondLevelMenus() {
    const path = window.location.pathname
    const parts = path.split("/").filter(Boolean);
    this.http
      .get<any>(`${App.base_url}${"secondLevelMenus"}?type=${parts[0]}`)
      .subscribe(async (res) => {
        if (res.result.success) {
          const data = res.result.data;
          this.sideList = data.env_config;
          // if(this.sideList.length && parts.length < 2) {
          // this.router.navigate([`reports/${this.sideList[0].routerlink}`]);
          // }
        }
      });
  }

  // updatePermissions() {
  //   // console.log('sdsdsd')
  //   for(let i = 0; i < App.user_roles_permissions.length; i++) {
  //     // console.log('sdsdsd')
  //     if(!App.user_roles_permissions[i].selected) {
  //       // console.log('sdsdsd')
  //     for(let j = 0; j < this.sideListReports.length; j++) {
  //       // console.log('sdsdsd')
  //       if(App.user_roles_permissions[i].code.trim() == this.sideListReports[j].code.trim()) {
  //         // console.log('sdsdsd')
  //         this.sideListReports[j].selected = App.user_roles_permissions[i].selected;
  //       }
  //     }
  //    }
  //   }
  //   // console.log(this.sideListReports)
  // }

  goToList(list) {
    this.ReportsService.reloadRoute(list);
  }
  searchReports(search: string, event?: any): void {
    this.search = search;
    // console.log(this.search);
		// this.page = 1;
		// this.searching = true;
		// if (this.timeout) {
		// 	clearTimeout(this.timeout);
		// }
		// this.timeout = setTimeout(() => {
    //   this.sideListReports(true);
		// }, 1000);
  }
  public viewId;
  reportView(data){
   this.ReportsService.viewId = data.view_id;
   this.ReportsService.reportId = '';
    // let modulName = data.module
    // if(modulName == 'by_status'){
    // this.activeModule ='ordersReport'

    // }else if(modulName == 'by_clients'){
    //   this.activeModule ='invoicesReport'
    // }else if(modulName == 'year_to_date'){
    //   this.activeModule ='paymentsRecievedReport'
    // }else if(modulName == 'payment_due'){
    //   this.activeModule ='paymentsDueReport'
    // }else if(modulName == 'month_to_date'){
    //   this.activeModule ='productSalesReport'
    // }else if(modulName == 'inventory'){
    //   this.activeModule ='inventoryReport'
    // }else if(modulName == 'shipment'){
    //   this.activeModule ='shipmentsReport'
    // }else if(modulName == 'export_register'){
    //   this.activeModule ='exportRegisterReport'
    // }else if(modulName == 'firc_report'){
    //   this.activeModule ='fircReport'
    // }else if(modulName == 'insurance_report'){
    //   this.activeModule ='insuranceReport'
    // } else if(modulName == 'forex_report'){
    //   this.activeModule ='forexReport'
    // }
    // //this.router.navigate(['reports/'+this.activeModule,data ]);
    // this.router.navigate(['reports/'+this.activeModule + '/' + data.view_id ]);
  }
  mainReportView(data) {
    this.ReportsService.reportId = data.id;
    this.ReportsService.viewId = ''
  }
  getViewsList = function(flag?) {
    // console.log(flag)
    const params = {
      module: 'All'
    }
    this.ReportsService.getViewsList(params)
      .then(response => {
        if (response.result.success) {
          this.viewsList =  response.result.data;
          // this.viewsList.next([ ...response.result.data ])


          this.changeDetection.detectChanges();
          // console.log(          this.changeDetection.detectChanges()
          // )
          //   console.log(this.viewsList)
            

          this.viewsList.forEach(element => {
            element.grid_info = JSON.parse(element.grid_info);
            element.applied_filters = JSON.parse(element.applied_filters);

            if(element.module == 'by_status'){
              element.route =`ordersReport/${element.view_id}`
              }else if(element.module == 'by_clients'){
                element.route =`invoicesReport/${element.view_id}` 
              }else if(element.module == 'year_to_date'){
                element.route =`paymentsRecievedReport/${element.view_id}`
              }else if(element.module == 'payment_due'){
                element.route =`paymentsDueReport/${element.view_id}`
              }else if(element.module == 'month_to_date'){
                element.route =`productSalesReport/${element.view_id}`
              }else if(element.module == 'inventory'){
                element.route =`inventoryReport/${element.view_id}`
              }else if(element.module == 'shipment'){
                element.route =`shipmentsReport/${element.view_id}`
              }else if(element.module == 'export_register'){
                element.route =`exportRegisterReport/${element.view_id}`
              }else if(element.module == 'firc_report'){
                element.route =`fircReport/${element.view_id}`
              }else if(element.module == 'insurance_report'){
                element.route =`insuranceReport/${element.view_id}`
              } else if(element.module == 'forex_report'){
                element.route =`forexReport/${element.view_id}`
              }
          });
          // if(this.viewsList.length) {
          //   this.viewsList.unshift({ view_name: 'Default View', view_id: 1 });
          // }
          //this.obj = {key:'by_status',value}
          // this.viewsList.forEach(element => {
          //   console.log(element.module)
          // if(element.module == 'by_status'){
          //   this.activeModuleName='Orders'
          //   }else if(element.module  == 'by_clients'){
          //     this.activeModuleName ='Invoices'
          //   }else if(element.module  == 'year_to_date'){
          //     this.activeModuleName ='Payments Received'
          //   }else if(element.module  == 'payment_due'){
          //     this.activeModuleName ='Payments Due'
          //   }else if(element.module  == 'month_to_date'){
          //     this.activeModuleName ='Product Sales'
          //   }else if(element.module  == 'inventory'){
          //     this.activeModuleName ='Inventory'
          //   }else if(element.module  == 'shipment'){
          //     this.activeModuleName ='Shipments'
          //   }
          // })
          // console.log(this.viewsList)
        }
      })
  }
}
