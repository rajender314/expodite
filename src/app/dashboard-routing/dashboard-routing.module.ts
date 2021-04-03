import { OrganizationsComponent } from './../admin-module/organizations/organizations.component';
import { VendorComponent } from './../admin-module/vendor/vendor.component';
import { AccessDeniedComponent } from './../access-denied/access-denied.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from '../users/change-password/change-password.component';
import { CreateOrderComponent } from '../dialogs/create-order/create-order.component';
import { AlertDialogComponent } from '../dialogs/alert-dialog/alert-dialog.component';



declare var App: any;

const routes: Routes = [
  
  
  
  
  { path: 'clients', component: OrganizationsComponent },
  { path: 'vendors', component: VendorComponent },
  { path: 'contactMainView', loadChildren: () => import('../contact-module/contact.module').then(m =>  m.ContactModule)},
  { path: 'orders', loadChildren: () => import('../orders-module/orders.module').then(m => m.OrdersModule) },
  { path: 'overview', loadChildren: () => import('../overview-module/overview.module').then(m =>  m.OverviewModule) },
  { path: 'inventory', loadChildren: () => import('../inventory-module/inventory.module').then(m =>  m.InventoryModule) },
  { path: 'reports', loadChildren: () => import('../general-module/general.module').then(m => m.GeneralModule) },
  { path: 'invoices', loadChildren: () => import('../invoice-module/invoice.module').then(m => m.InvoiceModule) },
  {
    path: 'leads',
    loadChildren: () => import('../leads/leads.module').then(m => m.LeadsModule)
  },
  {  path: 'admin', loadChildren: () => import('../admin-module/admin.module').then(m => m.AdminModule)  },
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'clients', component: OrganizationsComponent },
  { path: 'vendors', component: VendorComponent },
  { path: 'access-denied', component: AccessDeniedComponent },
  { path: 'change-password', component: ChangePasswordComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }