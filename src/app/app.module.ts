import { LightboxModule } from "ngx-lightbox";

import { LogService } from "./services/log.service";
import { Title } from "@angular/platform-browser";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { InputTrimModule } from "ng2-trim-directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CustomMaterialModule } from "./custom-material/custom-material.module";

import { UsersService } from "./services/users.service";
import { CampaignService } from "./services/campaign.service";
import { AdminService } from "./services/admin.service";
import { SnakbarService } from "./services/snakbar.service";
import { OrganizationsService } from "./services/organizations.service";
import { InvoicesService } from "./services/invoices.service";

import { HttpInterceptorService } from "./services/http-interceptor.service";

import { AppComponent } from "./app.component";

import { ChangePasswordComponent } from "./users/change-password/change-password.component";

import { SnakbarComponent } from "./custom-material/snakbar/snakbar.component";

import { DashboardRoutingModule } from "./dashboard-routing/dashboard-routing.module";

import { language } from "./language/language.module";
import { NumberInputDirective } from "./directives/number-input.directive";
import { InputNumberDirective } from "./directives/input-number.directive";
import { InputDatepickerDirective } from "./directives/input-datepicker.directive";

import { MyDirectiveDirective } from "./directives/my-directive.directive";

import { OrdersService } from "./services/orders.service";
import { InventoryService } from "./services/inventory.service";
import { PowerConversionDirective } from "./directives/power-conversion.directive";

import { AgGridModule } from "ag-grid-angular";
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey(
  "Enterpi_Software_Solutions_Private_Limited_MultiApp_1Devs21_August_2019__MTU2NjM0MjAwMDAwMA==f0a6adf3f22452a5a3102029b1a87a43"
);
import { ReportsService } from "./services/reports.service";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";

import { PdfViewerModule } from "ng2-pdf-viewer";
import { NgxDocViewerModule } from "ngx-doc-viewer";
import { PdfPreviewComponent } from "./dialogs/pdf-preview/pdf-preview.component";

import { TokenExpiredComponent } from "./dialogs/token-expired/token-expired.component";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

import { SharedModule } from "./shared/shared.module";
import { AccountsComponent } from "./accounts/accounts.component";
import { IgstComponent } from "./accounts/igst/igst.component";
import { PaymentsComponent } from "./accounts/payments/payments.component";
import { NewClientComponent } from "./dialogs/new-client/new-client.component";
import { ReceiveAmountComponent } from "./dialogs/receive-amount/receive-amount.component";
import { TotalAmountComponent } from "./dialogs/total-amount/total-amount.component";
import { CreditNoteComponent } from "./accounts/credit-note/credit-note.component";
import { AmountHistoryComponent } from "./dialogs/amount-history/amount-history.component";
import { HistoryEditComponent } from "./dialogs/history-edit/history-edit.component";
import { AddCreditComponent } from "./dialogs/add-credit/add-credit.component";
import { DebitNoteComponent } from "./accounts/debit-note/debit-note.component";
import { AddDebitComponent } from "./dialogs/add-debit/add-debit.component";
import { IgstDetailComponent } from "./accounts/igst-detail/igst-detail.component";
import { OrdersCreateComponent } from "./orders-module/order-create/order-create.component";
import { EstimateCreateComponent } from "./estimates-module/estimate-create/estimate-create.component";
import { AddNewProductComponent } from "./dialogs/add-product/add-product.component";
import { ImportDocumentComponent } from "./dialogs/import-document/import.component";
import { AddContainersComponent } from "./dialogs/add-containers/add-containers.component";
import { AddPackageComponent } from "./dialogs/add-package/add-package.component";
import { FormsModule } from "@angular/forms";
import { SendEmailComponent } from "./dialogs/send-email/send-email.component";
import { ErrorDialogComponent } from "./dialogs/error-dialog/error-dialog.component";
import { EnvConfigResolver } from "./env-config.resolver";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { DialogComponent } from "./dialog/dialog.component";
import { AddressComponent } from "./dialogs/address/address.component";
import { CreatePfiComponent } from "./estimates-module/create-pfi/create-pfi.component";
import { CustomLoadingCellRenderer } from "./shared/ag-grid-view/custom-ag-loader";
import { POCreateComponent } from "./po-module/po-create/po-create.component";
import { MarkAsPaidComponent } from "./dialogs/mark-as-paid/mark-as-paid.component";
import { CommonModule } from "@angular/common";
import { AddProductsComponent } from "./shared/add-products/add-products.component";
import { AgGridViewComponent } from "./shared/ag-grid-view/ag-grid-view.component";
import { AgProductEditComponent } from "./shared/components/ag-product-edit/ag-product-edit.component";
import { FormBuilderComponent } from "./shared/form-builder/form-builder.component";
import { FreightDynamicFormComponent } from "./shared/freight-dynamic-form/freight-dynamic-form.component";
import { ProductsFormComponent } from "./shared/products-form/products-form.component";
import { SelectAddressComponent } from "./shared/select-address/select-address.component";
import { SubTotalFormComponent } from "./shared/sub-total-form/sub-total-form.component";
import { UploadLogoComponent } from "./shared/upload-logo/upload-logo.component";
import { OrderDocumentsComponent } from "./orders-module/order-documents/order-documents.component";
import { PackageProductsFormComponent } from "./shared/package-products-form/package-products-form.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { CreateEinvoiceComponent } from "./dialogs/create-einvoice/create-einvoice.component";
import { CancelEinvoiceComponent } from "./dialogs/cancel-einvoice/cancel-einvoice.component";
import { ViewDetailsComponent } from "./shared/form-builder-list-view/view-details/view-details.component";
import { ViewListComponent } from "./shared/form-builder-list-view/view-list/view-list.component";
import { FormBuilderListViewComponent } from "./shared/form-builder-list-view/form-builder-list-view.component";
import { AddCountryStateComponent } from "./dialogs/add-country-state/add-country-state.component";
import { PaymentDetailsDialog } from "./dialogs/payment-details/payment-details.component";

declare var App: any;
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
@NgModule({
  declarations: [
    AppComponent,
    ChangePasswordComponent,
    SnakbarComponent,
    NumberInputDirective,
    InputNumberDirective,
    InputDatepickerDirective,
    MyDirectiveDirective,
    PowerConversionDirective,
    PdfPreviewComponent,
    TokenExpiredComponent,
    AccountsComponent,
    IgstComponent,
    PaymentsComponent,
    NewClientComponent,
    ReceiveAmountComponent,
    TotalAmountComponent,
    CreditNoteComponent,
    AmountHistoryComponent,
    HistoryEditComponent,
    AddCreditComponent,
    DebitNoteComponent,
    AddDebitComponent,
    IgstDetailComponent,
    OrdersCreateComponent,
    EstimateCreateComponent,
    AddNewProductComponent,
    ImportDocumentComponent,
    AddContainersComponent,
    AddPackageComponent,
    SendEmailComponent,
    ErrorDialogComponent,
    DialogComponent,
    AddressComponent,
    CreatePfiComponent,
    CustomLoadingCellRenderer,
    POCreateComponent,
    MarkAsPaidComponent,
    CreateEinvoiceComponent,
    CancelEinvoiceComponent,
    AddCountryStateComponent,
    PaymentDetailsDialog,
  ],
  imports: [
    BrowserModule,
    InputTrimModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    NgxMatSelectSearchModule,
    AgGridModule.withComponents([]),
    PdfViewerModule,
    NgxDocViewerModule,
    PerfectScrollbarModule,
    LightboxModule,
    SharedModule,
    CommonModule,
    DashboardRoutingModule, // Required for *ngIf
    MatProgressSpinnerModule,
  ],
  providers: [
    Title,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    EnvConfigResolver,
    AuthService,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    FormBuilderComponent,
    FormBuilderListViewComponent,
    ViewListComponent,
    ViewDetailsComponent,
    AddProductsComponent,
    SelectAddressComponent,
    UploadLogoComponent,
    SubTotalFormComponent,
    ProductsFormComponent,
    PackageProductsFormComponent,
    AgGridViewComponent,
    AgProductEditComponent,
    FreightDynamicFormComponent,
  ],
})
export class AppModule {
  private language = language;
  constructor(private titleService: Title) {
    this.titleService.setTitle(App["company_data"].mainTitle);
  }
}
