import { ConversionRatesComponent } from "./conversion-rates/conversion-rates.component";
import { PrimaryPackagingComponent } from "./primary-packaging/primary-packaging.component";
import { VendorComponent } from "./vendor/vendor.component";
// import { VendorComponent } from './../admin/vendor/vendor.component';
// import { AdminComponent } from './../admin/admin.component';
import { CompanyComponent } from "./../admin-module/company/company.component";
import { AuthorizeMailComponent } from "./../admin-module/authorize-mail/authorize-mail.component";
import { LeadAttributesComponent } from "./../admin-module/lead-attributes/lead-attributes.component";
import { CategoryComponent } from "./../admin-module/category/category.component";
import { ShipmentsComponent } from "./../admin-module/shipments/shipments.component";
import { ProductsComponent } from "./../admin-module/products/products.component";
import { ContactAddressComponent } from "./../admin-module/contact-address/contact-address.component";
import { ContainersComponent } from "./../admin-module/containers/containers.component";
import { RolesComponent } from "./../admin-module/roles/roles.component";
import { AdminComponent } from "./../admin-module/adminlist/admin.component";
// import { InvoiceDetailsComponent } from './../invoices/invoice-details/invoice-details.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UsersComponent } from "../users/users.component";
import { SettingsComponent } from "../admin-module/settings/settings.component";
import { IncotermsComponent } from "./incoterms/incoterms.component";
import { DocumentTemplateComponent } from "./document-template/document-template.component";
import { CustomsAddressComponent } from "./customs-address/customs-address.component";
import { InsurancePercentageComponent } from "./insurance-percentage/insurance-percentage.component";
import { QuotationSettingsComponent } from "./quotation-settings/quotation-settings.component";
import { OrderSettingsComponent } from "./order-settings/order-settings.component";
import { PoSettingsComponent } from "./po-settings/po-settings.component";
import { DefaultRouteResolver } from "./admin-route-resolver";
import { DefaultRouteGuard } from "./admin-routeguard";
import { InvoiceSettingsComponent } from "./invoice-settings/invoice-settings.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    // canActivate: [DefaultRouteGuard],
    children: [
      // { path: "", redirectTo: DefaultRouteGuard, pathMatch: "full" },
      // {
      //   path: '',
      //   redirectTo: '', // Placeholder to be dynamically resolved
      //   pathMatch: 'full',
      //   resolve: {
      //     defaultRoute: DefaultRouteResolver,
      //   },
      // },
      { path: "roles", component: RolesComponent },
      { path: "users", component: UsersComponent },
      { path: "containers", component: ContainersComponent },
      { path: "packaging", component: PrimaryPackagingComponent },
      { path: "admin_contact_addresses", component: ContactAddressComponent },
      { path: "products", component: ProductsComponent },
      { path: "carriers", component: ShipmentsComponent },
      { path: "categories", component: CategoryComponent },
      { path: "form_builder", component: LeadAttributesComponent },
      { path: "authorize_gmail", component: AuthorizeMailComponent },
      { path: "company", component: CompanyComponent },
      { path: "settings", component: SettingsComponent },
      { path: "conversion_rates", component: ConversionRatesComponent },
      { path: "inco_terms", component: IncotermsComponent },
      { path: "document_template", component: DocumentTemplateComponent },
      { path: "admin_custom_addresses", component: CustomsAddressComponent },
      { path: "insurance_percentage", component: InsurancePercentageComponent },
      { path: "quotation-settings", component: QuotationSettingsComponent },
      { path: "order-settings", component: OrderSettingsComponent },
      { path: "po-settings", component: PoSettingsComponent },
      { path: "invoice-settings", component: InvoiceSettingsComponent },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
