import { ReportsComponent } from './reports/reports-list/reports.component';
import { AccessDeniedComponent } from './../access-denied/access-denied.component';
import { ShipmentsReportComponent } from './reports/shipments-report/shipments-report.component';
import { PaymentDueComponent } from './reports/payment-due/payment-due.component';
import { SalesMtdComponent } from './reports/sales-mtd/sales-mtd.component';
import { SalesYtdComponent } from './reports/sales-ytd/sales-ytd.component';
import { OrdersDuebyClientsComponent } from './reports/orders-dueby-clients/orders-dueby-clients.component';
import { OrdersbyStatusComponent } from './reports/ordersby-status/ordersby-status.component';
import { ReportsDashboardComponent } from './reports/reports-dashboard/reports-dashboard.component';


import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvetoryReportsComponent } from './reports/invetory-reports/invetory-reports.component';



const routes: Routes = [
   
    { path: '', component: ReportsComponent,
    children: [
        { path: '', component: ReportsDashboardComponent },
        { path: 'ordersByStatusReport', component: OrdersbyStatusComponent },
        { path: 'ordersByStatusReport/:id', component: OrdersbyStatusComponent },
        { path: 'ordersDueByClientsReport', component: OrdersDuebyClientsComponent },
        { path: 'ordersDueByClientsReport/:id', component: OrdersDuebyClientsComponent },
        { path: 'salesYearToDateReport', component: SalesYtdComponent },
        { path: 'salesYearToDateReport/:id', component: SalesYtdComponent },
        { path: 'salesMonthToDateReport', component: SalesMtdComponent },
        { path: 'salesMonthToDateReport/:id', component: SalesMtdComponent },
        { path: 'paymentDueReport', component: PaymentDueComponent },
        { path: 'paymentDueReport/:id', component: PaymentDueComponent },
        { path: 'shipmentsReport', component: ShipmentsReportComponent },
        { path: 'shipmentsReport/:id', component: ShipmentsReportComponent },
        { path: 'access-denied', component: AccessDeniedComponent },
        { path: 'inventoryReport', component: InvetoryReportsComponent },
        { path: 'inventoryReport/:id', component: InvetoryReportsComponent },

      
      // { path: 'containers', component: ContainersComponent },
      // { path: 'address', component: ContactAddressComponent },
      // { path: 'products', component: ProductsComponent },

    ]  
}
      
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GeneralRoutingModule {}