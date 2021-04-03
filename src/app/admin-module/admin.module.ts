import { PipesModule } from './../pipes-module/pipes.module';
import { MyFilterPipe } from './../general-module/reports/reports-dashboard/reports-dashboard.component';
import { PowerConversionPipe } from './../pipes/power-conversion.pipe';
import { LetterPipe } from './../custom-pipes/letter.pipe';
import { ContactImageNamePipe } from './../custom-pipes/contact-image-name.pipe';
import { EpiCurrencyPipe } from './../invoice-module/invoice-details/invoice-details.component';
import { DeleteInstructionsComponent } from './../dialogs/delete-instructions/delete-instructions.component';
import { ProductsDeleteComponent } from './../dialogs/products-delete/products-delete.component';
import { AlertMessageComponent } from './../dialogs/alert-message/alert-message.component';
import { AddressDeleteComponent } from './../dialogs/address-delete/address-delete.component';
import { ContactDeleteAlertComponent } from './../dialogs/contact-delete-alert/contact-delete-alert.component';
import { ContactsComponent } from './../dialogs/contacts/contacts.component';
import { AlertDialogComponent } from './../dialogs/alert-dialog/alert-dialog.component';
import { MoreEmailsComponent } from './../dialogs/more-emails/more-emails.component';
import { DeleteUploadComponent } from './../dialogs/delete-upload/delete-upload.component';
import { ViewInstructionComponent } from './../dialogs/view-instruction/view-instruction.component';

import { UserPermissionsComponent } from './../users/user-permissions/user-permissions.component';
import { VendorDelteInstrnsComponent } from './../dialogs/vendor-delte-instrns/vendor-delte-instrns.component';
import { VendorInstructionsComponent } from './../dialogs/vendor-instructions/vendor-instructions.component';
import { VendorAddressComponent } from './../dialogs/vendor-address/vendor-address.component';
import { VendorclientSettingsComponent } from './vendor/vendorclient-settings/vendorclient-settings.component';
import { VendorclientProductsComponent } from './vendor/vendorclient-products/vendorclient-products.component';
import { VendorDetailsComponent } from './vendor/vendor-details/vendor-details.component';
import { VendorCertificationsComponent } from './vendor/vendor-certifications/vendor-certifications.component';
import { VendorDocumentsComponent } from './vendor/vendor-documents/vendor-documents.component';
import { VendorProductsComponent } from './vendor/vendor-products/vendor-products.component';
import { VendorContactsComponent } from './vendor/vendor-contacts/vendor-contacts.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorComponent } from './vendor/vendor.component';
import { ClientProductsComponent } from './organizations/client-products/client-products.component';
import { ClientInstructionComponent } from './../dialogs/client-instruction/client-instruction.component';
import { OrganizationsCertificationsComponent } from './organizations/organizations-certifications/organizations-certifications.component';
import { UserAccessComponent } from './../dialogs/user-access/user-access.component';
import { OrganizationsSettingsComponent } from './organizations/organizations-settings/organizations-settings.component';
import { OrganizationsProductsComponent } from './organizations/organizations-products/organizations-products.component';
import { OrganizationDocumentsComponent } from './organizations/organization-documents/organization-documents.component';
import { OrgAddressComponent } from './address/address.component';
import { AddressComponent } from './../dialogs/address/address.component';
import { OrganizationsContactsComponent } from './organizations/organizations-contacts/organizations-contacts.component';
import { DialogComponent } from './../dialog/dialog.component';
import { OrganizationsListComponent } from './organizations/organizations-list/organizations-list.component';
import { OrganizationsDetailsComponent } from './organizations/organizations-details/organizations-details.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ContactAddressPermissionsComponent } from './contact-address/contact-address-permissions/contact-address-permissions.component';
import { ContactAddressDetailsComponent } from './contact-address/contact-address-details/contact-address-details.component';
import { ContactAddressListComponent } from './contact-address/contact-address-list/contact-address-list.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PaginationComponent } from './../pagination/pagination.component';
import { CategoryDetailsComponent } from './category/category-details/category-details.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { ShipmentListComponent } from './shipments/shipment-list/shipment-list.component';
import { ShipmentDetailsComponent } from './shipments/shipment-details/shipment-details.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ContainersDetailsComponent } from './containers/containers-details/containers-details.component';
import { ContainerDetailsComponent } from './containers/container-details/container-details.component';
import { ContainersListComponent } from './containers/containers-list/containers-list.component';
import { UserDetailsComponent } from './../users/user-details/user-details.component';
import { ContainerDeleteComponent } from './../dialogs/container-delete/container-delete.component';
import { AddAutoAttibuteComponent } from './lead-attributes/add-auto-attibute/add-auto-attibute.component';
import { AddAttributeComponent } from './lead-attributes/add-attribute/add-attribute.component';
import { LeadAtrbtDetailComponent } from './lead-attributes/lead-atrbt-detail/lead-atrbt-detail.component';
import { LeadAtrbtListComponent } from './lead-attributes/lead-atrbt-list/lead-atrbt-list.component';
import { SettingsComponent } from './settings/settings.component';
import { CompanyComponent } from './company/company.component';
import { LeadAttributesComponent } from './lead-attributes/lead-attributes.component';
import { CategoryComponent } from './category/category.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { ContactAddressComponent } from './contact-address/contact-address.component';
import { ProductsComponent } from './products/products.component';
import { ContainersComponent } from './containers/containers.component';
import { UsersComponent } from './../users/users.component';
import { RolesPermissionsComponent } from './roles/roles-permissions/roles-permissions.component';
import { RolesDetailsComponent } from './roles/roles-details/roles-details.component';
import { RolesListComponent } from './roles/roles-list/roles-list.component';
import { RolesComponent } from './roles/roles.component';
import { AdminComponent } from './adminlist/admin.component';
import { HttpInterceptorService } from './../services/http-interceptor.service';
import { EpiCurrencyDirective } from './../directives/epi-currency.directive';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

//import { AgeditComponent } from '../admin/agedit/agedit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateFormats, NGX_MAT_DATE_FORMATS, NgxMatNativeDateModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { InputNumberDirective } from '../directives/input-number.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ScrollingModule } from '@angular/cdk/scrolling';
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS"
  },    
  display: {
    dateInput: 'MMM Do YYYY, h:mm a',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { VendorDialogComponent } from '../vendor-dialog/vendor-dialog.component';
import { PrimaryPackagingComponent } from './primary-packaging/primary-packaging.component';
import { PrimaryPackageListComponent } from './primary-packaging/primary-package-list/primary-package-list.component';
import { PrimaryPackageDetailsComponent } from './primary-packaging/primary-package-details/primary-package-details.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     

@NgModule({
  declarations: [ 
    AdminComponent,
    RolesComponent,
    RolesListComponent,
    RolesDetailsComponent,
    RolesPermissionsComponent,
    UsersComponent,
    UserDetailsComponent,
    ContainersComponent,
    ProductsComponent,
    ContactAddressComponent,
    ShipmentsComponent,
    CategoryComponent,
    LeadAttributesComponent,
    CompanyComponent,
    SettingsComponent,
    LeadAtrbtListComponent,
    LeadAtrbtDetailComponent,
    AddAttributeComponent,
    AddAutoAttibuteComponent,
    ContainerDeleteComponent,
    ContainersListComponent,
    ContainerDetailsComponent, 
    ContainersDetailsComponent,
    ProductListComponent,
    ProductDetailsComponent,
    ShipmentDetailsComponent,
    ShipmentListComponent,
    CategoryListComponent,
    CategoryDetailsComponent,
    // PaginationComponent,
    ContactAddressListComponent,
    ContactAddressDetailsComponent,
    ContactAddressPermissionsComponent,
    OrganizationsComponent,
    OrganizationsDetailsComponent,
    OrganizationsListComponent,
    DialogComponent,
    OrganizationsContactsComponent,
    AddressComponent,
    OrgAddressComponent,
    OrganizationDocumentsComponent,
    OrganizationsProductsComponent,
    OrganizationsSettingsComponent,
    UserAccessComponent,
    OrganizationsCertificationsComponent,
    ClientInstructionComponent,
    ClientProductsComponent,
    VendorComponent,
    VendorListComponent,
    VendorContactsComponent,
    VendorProductsComponent,
    VendorDocumentsComponent,
    VendorCertificationsComponent,
    VendorDetailsComponent,
    VendorclientProductsComponent,
    VendorclientSettingsComponent,
    VendorDialogComponent,
    VendorAddressComponent,
    VendorInstructionsComponent,
    VendorDelteInstrnsComponent,
    UserPermissionsComponent,
    ViewInstructionComponent,
    DeleteUploadComponent,
    MoreEmailsComponent,
    AlertDialogComponent,
    ContactsComponent,
    ContactDeleteAlertComponent,
    AddressDeleteComponent,
    AlertMessageComponent,
    ProductsDeleteComponent,
    DeleteInstructionsComponent,
    PrimaryPackagingComponent,
    PrimaryPackageListComponent,
    PrimaryPackageDetailsComponent,
    
  ],
  imports: [
   
    AdminRoutingModule,
    SharedModule,
    
    
  ],
  providers: [
  
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // PipesModule
   
   
   
  ],
})
export class AdminModule { }
