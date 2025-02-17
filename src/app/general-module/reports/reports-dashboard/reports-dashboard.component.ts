
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { Images } from '../../../images/images.module';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import * as _ from 'lodash';
declare var App: any;
import { ReportsService } from '../../../services/reports.service';
import { Pipe, PipeTransform } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

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

  constructor(public ReportsService: ReportsService,    public adminService:  AdminService
    ) { }
  sideListReports: Array<any> = [
    { id: 1, name: 'Orders', route: 'ordersReport', icon: this.images.roles, selected: true, code: "ordersReport" },
    { id: 2, name: 'Invoices', route: 'invoicesReport', icon: this.images.roles, selected: true, code: "invoicesReport" },
    { id: 5, name: 'Payments Due', route: 'paymentsDueReport', icon: this.images.contactAddress, selected: true, code: "paymentsDueReport" },
    { id: 3, name: 'Payments Received', route: 'paymentsRecievedReport', icon: this.images.containers, selected: true, code: "paymentsRecievedReport" },
    { id: 4, name: 'Product Sales', route: 'productSalesReport', icon: this.images.containers, selected: true, code: "productSalesReport" },
    { id: 7, name: 'Inventory', route: 'inventoryReport', icon: this.images.products , selected: true, code: "inventoryReport"},
    { id: 6, name: 'Shipments', route: 'shipmentsReport', icon: this.images.products,  selected: true, code: "shipmentsReport"},
    { id: 8, name: 'Export Register', route: 'exportRegisterReport', icon: this.images.products , selected: true, code: "exportRegisterReport"},
    { id: 8, name: 'F.I.R.C Report', route: 'fircReport', icon: this.images.products , selected: true, code: "fircReport"},
    { id: 9, name: 'Insurance Report', route: 'insuranceReport', icon: this.images.products , selected: true, code: "insuranceReport"},
    { id: 9, name: 'Forex Gain/Loss Report', route: 'forexReport', icon: this.images.products , selected: true, code: "forexReport"},
    { id: 10, name: 'Forex Gain/Loss Report(Grouped)', route: 'forexreportGrouped', icon: this.images.products , selected: true, code: "forexreportGrouped"},
    { id: 11, name: 'Duty Drawback Report', route: 'duty_drawback_report', icon: this.images.products , selected: true, code: "duty_drawback_report"},
    { id: 12, name: 'RoDTEP Report', route: 'rodtep_report', icon: this.images.products , selected: true, code: "rodtep_report"},

  ];
  ngOnInit() {
    // this.searchReports();
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.updatePermissions();

  
  }
  searchReports(): void {

    //this.search = ev;
    //  console.log(ev);

     this.updatePermissions();

    
    
    // console.log(this.sideListReports)

  }
  public noDataMsg = false;
  onKeyUp() {
    if(!this.ReportsService.searchArray.length) {
      this.noDataMsg = true;
    } else {
      this.noDataMsg = false;

    }
  }
  clearSearch() {
    this.search = '';
      this.noDataMsg = false;


  }
  updatePermissions() {
    this.sideListReports = this.sideListReports.filter((obj: any) => {
      return this.adminService.rolePermissions[obj.code] === 1;
    });
  }


}
