import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
// import { InvoiceDetailsComponent } from './../invoices/invoice-details/invoice-details.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const routes: Routes = [
  {   path: '', component: InvoicesComponent },
  { path: ':id', component: InvoiceDetailsComponent },
 
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
