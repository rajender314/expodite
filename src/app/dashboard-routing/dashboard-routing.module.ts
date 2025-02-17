import { OrganizationsComponent } from "./../admin-module/organizations/organizations.component";
import { VendorComponent } from "./../admin-module/vendor/vendor.component";
import { AccessDeniedComponent } from "./../access-denied/access-denied.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChangePasswordComponent } from "../users/change-password/change-password.component";
import { CreateOrderComponent } from "../dialogs/create-order/create-order.component";
import { AlertDialogComponent } from "../dialogs/alert-dialog/alert-dialog.component";

import { AccountsComponent } from "../accounts/accounts.component";
import { IgstComponent } from "../accounts/igst/igst.component";
import { PaymentsComponent } from "../accounts/payments/payments.component";
import { InvoicesComponent } from "../invoice-module/invoices/invoices.component";
import { CreditNoteComponent } from "../accounts/credit-note/credit-note.component";
import { DebitNoteComponent } from "../accounts/debit-note/debit-note.component";
import { IgstDetailComponent } from "../accounts/igst-detail/igst-detail.component";
import { AuthGuard } from "../auth.guard";
import { EnvConfigResolver } from "../env-config.resolver";

declare var App: any;

const routes: Routes = [
  {
    path: "clients",
    canActivate: [AuthGuard],
    component: OrganizationsComponent,
  },
  { path: "vendors", canActivate: [AuthGuard], component: VendorComponent },
  {
    path: "contactMainView",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../contact-module/contact.module").then((m) => m.ContactModule),
  },
  {
    path: "orders",
    // resolve: { config: EnvConfigResolver },

    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../orders-module/orders.module").then((m) => m.OrdersModule),
  },
  {
    path: "estimates",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../estimates-module/estimates.module").then(
        (m) => m.EstimateModule
      ),
  },
  {
    path: "overview",
    // resolve: { config: EnvConfigResolver },

    loadChildren: () =>
      import("../overview-module/overview.module").then(
        (m) => m.OverviewModule
      ),
  },
  {
    path: "inventory",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../inventory-module/inventory.module").then(
        (m) => m.InventoryModule
      ),
  },
  {
    path: "reports",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../general-module/general.module").then((m) => m.GeneralModule),
  },
  {
    path: "invoices",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../invoice-module/invoice.module").then((m) => m.InvoiceModule),
  },
  {
    path: "po",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../po-module/po.module").then((m) => m.POModule),
  },

  {
    path: "insurance",
    canActivate: [AuthGuard],

    loadChildren: () =>
      import("../insurance-module/insurance-module.module").then(
        (m) => m.InsuranceModule
      ),
  },

  // { path: 'accounts', component: AccountsComponent},
  {
    path: "accounts",
    component: AccountsComponent,
    // resolve: { config: EnvConfigResolver },
    canActivate: [AuthGuard],

    children: [
      {
        path: "",
        redirectTo: "igst",
        pathMatch: "full",
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
      {
        path: "igst",
        component: IgstComponent,
        // resolve: { config: EnvConfigResolver },
        canActivate: [AuthGuard],
      },
      {
        path: "igst/:id",
        component: IgstDetailComponent,
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
      {
        path: "invoices",
        component: InvoicesComponent,
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
      {
        path: "payments",
        component: PaymentsComponent,
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
      {
        path: "credit",
        component: CreditNoteComponent,
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
      {
        path: "debit",
        component: DebitNoteComponent,
        // resolve: { config: EnvConfigResolver },

        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: "leads",

    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../leads/leads.module").then((m) => m.LeadsModule),
  },
  {
    path: "admin",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../admin-module/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "",
    redirectTo: "overview",
    // resolve: { config: EnvConfigResolver },
    pathMatch: "full",
  },
  {
    path: "clients",
    component: OrganizationsComponent,
    canActivate: [AuthGuard],
  },
  { path: "vendors", component: VendorComponent, canActivate: [AuthGuard] },
  { path: "access-denied", component: AccessDeniedComponent },
  { path: "change-password", component: ChangePasswordComponent },
  {
    path: "payments",

    canActivate: [AuthGuard],
    loadChildren: () =>
      import("../payments/payments.module").then((m) => m.PaymentsModule),
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
