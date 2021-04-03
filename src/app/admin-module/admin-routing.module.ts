import { PrimaryPackagingComponent } from './primary-packaging/primary-packaging.component';
import { VendorComponent } from './vendor/vendor.component';
// import { VendorComponent } from './../admin/vendor/vendor.component';
// import { AdminComponent } from './../admin/admin.component';
import { CompanyComponent } from './../admin-module/company/company.component';
import { AuthorizeMailComponent } from './../admin-module/authorize-mail/authorize-mail.component';
import { LeadAttributesComponent } from './../admin-module/lead-attributes/lead-attributes.component';
import { CategoryComponent } from './../admin-module/category/category.component';
import { ShipmentsComponent } from './../admin-module/shipments/shipments.component';
import { ProductsComponent } from './../admin-module/products/products.component';
import { ContactAddressComponent } from './../admin-module/contact-address/contact-address.component';
import { ContainersComponent } from './../admin-module/containers/containers.component';
import { RolesComponent } from './../admin-module/roles/roles.component';
import { AdminComponent } from './../admin-module/adminlist/admin.component';
// import { InvoiceDetailsComponent } from './../invoices/invoice-details/invoice-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from '../users/users.component';
import { SettingsComponent } from '../admin-module/settings/settings.component';




const routes: Routes = [
    {
        path: '', component: AdminComponent,
        children: [
          { path: '', redirectTo: 'company', pathMatch: 'full' },
          { path: 'roles', component: RolesComponent },
          { path: 'users', component: UsersComponent },
          { path: 'containers', component: ContainersComponent },
          { path: 'primary-packaging', component: PrimaryPackagingComponent },
          { path: 'address', component: ContactAddressComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'shipments', component: ShipmentsComponent },
          { path: 'category', component: CategoryComponent },
          { path: 'lead-attribute', component: LeadAttributesComponent },
          { path: 'authorize-gmail', component: AuthorizeMailComponent },
          { path: 'company', component: CompanyComponent },
          { path: 'settings', component: SettingsComponent },
    
    
    
        ]
      },
     
      
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
