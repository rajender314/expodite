
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { Images } from '../../../images/images.module';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import * as _ from 'lodash';
declare var App: any;
import { ReportsService } from '../../../services/reports.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  constructor(public ReportsService: ReportsService) { }

  transform(items: any[], filter: string): any {
    if (!items || !filter) {
      this.ReportsService.searchArray = items;
      return items;
    }
    this.ReportsService.searchArray = items.filter(item => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
    return items.filter(item => item.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
  }
}

@Component({
  selector: 'app-reports-dashboard',
  templateUrl: './reports-dashboard.component.html',
  styleUrls: ['./reports-dashboard.component.scss']
})
export class ReportsDashboardComponent implements OnInit {
  private images = Images;
  public search="";

  constructor(public ReportsService: ReportsService) { }
  sideListReports: Array<any> = [
    { id: 1, name: 'Orders', route: 'ordersByStatusReport', icon: this.images.roles, selected: true, code: "orders_by_status_report" },
    { id: 2, name: 'Invoices', route: 'ordersDueByClientsReport', icon: this.images.roles, selected: true, code: "orders_due_to_clients_report" },  
    { id: 5, name: 'Payments Due', route: 'paymentDueReport', icon: this.images.contactAddress, selected: true, code: "payment_due_report" },
    { id: 3, name: 'Payments Received', route: 'salesYearToDateReport', icon: this.images.containers, selected: true, code: "sales_year_to_date_report" },
    { id: 4, name: 'Product Sales', route: 'salesMonthToDateReport', icon: this.images.containers, selected: true, code: "sales_month_to_date_report" },
    { id: 7, name: 'Inventory', route: 'inventoryReport', icon: this.images.products , selected: true, code: "couriers_report"},
    { id: 6, name: 'Shipments', route: 'shipmentsReport', icon: this.images.products,  selected: true, code: "couriers_report"},
  ];
  ngOnInit() {
    this.searchReports();
  }
  searchReports(): void {

    //this.search = ev;
    //  console.log(ev);

     this.updatePermissions();

    this.sideListReports = this.sideListReports.filter(obj => {
      return obj.selected == true;
    })
    // console.log(this.sideListReports)
    
  }
  public noDataMsg = false;
  onKeyUp() {
    if(!this.ReportsService.searchArray.length) {
      this.noDataMsg = true;
    } else {
      this.noDataMsg = false;

    }
    console.log(this.ReportsService.searchArray.length)
  }
  clearSearch() {
    this.search = '';
      this.noDataMsg = false;
    

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
   

    // setTimeout(() => {
    //   this.sideListReports.filter(obj => {
    //     return obj.selected;
    //   })
    //   console.log(this.sideListReports)
    //  }, 1000);
    //  console.log(this.sideListReports)

  }

 
}
