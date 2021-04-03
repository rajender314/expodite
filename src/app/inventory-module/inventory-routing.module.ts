import { InventoryComponent } from './inventory/inventory.component';
import { InventoryMergeComponent } from './inventory/inventory-merge/inventory-merge.component';
import { InventoryInfoComponent } from './inventory/inventory-info/inventory-info.component';
// import { InvoiceDetailsComponent } from './../invoices/invoice-details/invoice-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';




const routes: Routes = [
   { path: '', component: InventoryComponent },
   { path: ':id', component: InventoryInfoComponent },
{ path: 'inventory/inventory-merge', component: InventoryMergeComponent },
   
    
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
