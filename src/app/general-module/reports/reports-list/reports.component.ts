import { ReportsService } from './../../../services/reports.service';
import { Images } from './../../../images/images.module';
import { Router, ActivatedRoute } from '@angular/router';

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { Subject } from 'rxjs';


import * as _ from 'lodash';

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
  sideListReports: Array<any> = [
    { id: 1, name: 'Orders', route: 'ordersByStatusReport', icon: this.images.roles, selected: true, code: "orders_by_status_report"},
    { id: 2, name: 'Invoices', route: 'ordersDueByClientsReport', icon: this.images.roles , selected: true, code: "orders_due_to_clients_report"},
    { id: 3, name: 'Payments Received', route: 'salesYearToDateReport', icon: this.images.containers , selected: true, code: "sales_year_to_date_report"},
    { id: 5, name: 'Payments Due', route: 'paymentDueReport', icon: this.images.contactAddress , selected: true, code: "payment_due_report"},
    { id: 4, name: 'Product Sales', route: 'salesMonthToDateReport', icon: this.images.containers , selected: true, code: "sales_month_to_date_report"},
    { id: 7, name: 'Inventory', route: 'inventoryReport', icon: this.images.products , selected: true, code: "inventory_report"},
    { id: 6, name: 'Shipments', route: 'shipmentsReport', icon: this.images.products , selected: true, code: "couriers_report"},
  ];
  search: string;
  labelObj = {
    "by_status":"Orders",
    "by_clients":"Invoice",
    "year_to_date":"Payments Received",
    "payment_due":"Payments Due",
    "month_to_date":"Product Sales",
    "inventory":"Inventory",
    "shipment":"Shipments"   
  }
 
  constructor(
    private titleService: Title,
    public ReportsService: ReportsService,
    private router: Router,
    private changeDetection: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,


  ) { }

  ngOnInit() {
    // console.log( this.activatedRoute);
    // this.activatedRoute.url.subscribe(url => {
    //   console.log(url);
    // });
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
    this.updatePermissions();
    this.ReportsService.getTriggerData().subscribe(response => {
      // console.log(response)
      if(response) {
        this.getViewsList();
      }
      // 
    })
  }

  updatePermissions() {
    // console.log('sdsdsd')
    for(let i = 0; i < App.user_roles_permissions.length; i++) {
      // console.log('sdsdsd')
      if(!App.user_roles_permissions[i].selected) {
        // console.log('sdsdsd')
      for(let j = 0; j < this.sideListReports.length; j++) {
        // console.log('sdsdsd')
        if(App.user_roles_permissions[i].code.trim() == this.sideListReports[j].code.trim()) {
          // console.log('sdsdsd')
          this.sideListReports[j].selected = App.user_roles_permissions[i].selected;
        }
      }
     }
    }
    // console.log(this.sideListReports)
  }

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
    // console.log(data)
   this.ReportsService.viewId = data.view_id;
   this.ReportsService.reportId = '';
    let modulName = data.module
    if(modulName == 'by_status'){
    this.activeModule ='ordersByStatusReport'
    
    }else if(modulName == 'by_clients'){
      this.activeModule ='ordersDueByClientsReport'
    }else if(modulName == 'year_to_date'){
      this.activeModule ='salesYearToDateReport'
    }else if(modulName == 'payment_due'){
      this.activeModule ='paymentDueReport'
    }else if(modulName == 'month_to_date'){
      this.activeModule ='salesMonthToDateReport'
    }else if(modulName == 'inventory'){
      this.activeModule ='inventoryReport'
    }else if(modulName == 'shipment'){
      this.activeModule ='shipmentsReport'
    }
    //this.router.navigate(['reports/'+this.activeModule,data ]);
    this.router.navigate(['reports/'+this.activeModule + '/' + data.view_id ]);
  }
  mainReportView(data) {
    // console.log(data)
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
