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
import { ExportRegisterComponent } from './reports/export-register/export-register.component';
import { FircReportsComponent } from './reports/firc-reports/firc-reports.component';
import { InsuranceReportComponent } from './reports/insurance-report/insurance-report.component';
import { ForexReportComponent } from './reports/forex-report/forex-report.component';
import { ThreeMonthsForexComponent } from './reports/three-months-forex/three-months-forex.component';
import { RodtepreportComponent } from './reports/rodtepreport/rodtepreport.component';
import { DutydrawbackReportComponent } from './reports/dutydrawback-report/dutydrawback-report.component';



const routes: Routes = [

    { path: '', component: ReportsComponent,
    children: [
        { path: '', component: ReportsDashboardComponent },
        { path: 'ordersReport', component: OrdersbyStatusComponent },
        { path: 'ordersReport/:id', component: OrdersbyStatusComponent },
        { path: 'invoicesReport', component: OrdersDuebyClientsComponent },
        { path: 'invoicesReport/:id', component: OrdersDuebyClientsComponent },
        { path: 'paymentsRecievedReport', component: SalesYtdComponent },
        { path: 'paymentsRecievedReport/:id', component: SalesYtdComponent },
        { path: 'productSalesReport', component: SalesMtdComponent },
        { path: 'productSalesReport/:id', component: SalesMtdComponent },
        { path: 'paymentsDueReport', component: PaymentDueComponent },
        { path: 'paymentsDueReport/:id', component: PaymentDueComponent },
        { path: 'shipmentsReport', component: ShipmentsReportComponent },
        { path: 'shipmentsReport/:id', component: ShipmentsReportComponent },
        { path: 'access-denied', component: AccessDeniedComponent },
        { path: 'inventoryReport', component: InvetoryReportsComponent },
        { path: 'inventoryReport/:id', component: InvetoryReportsComponent },
        { path: 'exportRegisterReport', component: ExportRegisterComponent },
        { path: 'exportRegisterReport/:id', component: ExportRegisterComponent },
        { path: 'fircReport', component: FircReportsComponent },
        { path: 'fircReport/:id', component: FircReportsComponent },
        { path: 'insuranceReport', component: InsuranceReportComponent },
        { path: 'insuranceReport/:id', component: InsuranceReportComponent },
        { path: 'forexReport', component: ForexReportComponent },
        { path: 'forexReport/:id', component: ForexReportComponent },
        { path: 'forexreportGrouped', component: ThreeMonthsForexComponent },
        { path: 'rodtep_report', component: RodtepreportComponent },
        { path: 'duty_drawback_report', component: DutydrawbackReportComponent },
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
