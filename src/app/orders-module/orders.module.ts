import { PipesModule } from "./../pipes-module/pipes.module";
import { MyFilterPipe } from "./../general-module/reports/reports-dashboard/reports-dashboard.component";
import { PowerConversionPipe } from "./../pipes/power-conversion.pipe";
import { LetterPipe } from "./../custom-pipes/letter.pipe";
import { ContactImageNamePipe } from "./../custom-pipes/contact-image-name.pipe";
import { EpiCurrencyPipe } from "./../pipes/epi-currency.pipe";
import { MarkAsPaidComponent } from "./../dialogs/mark-as-paid/mark-as-paid.component";
import { DeleteLineItemComponent } from "./../dialogs/delete-line-item/delete-line-item.component";
import { AddLineItemComponent } from "./../dialogs/add-line-item/add-line-item.component";
import { AddBatchNumberComponent } from "./../dialogs/add-batch-number/add-batch-number.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { EmailDocumentsComponent } from "./../dialogs/email-documents/email-documents.component";
import { AddDrumsComponent } from "./../dialogs/add-drums/add-drums.component";
import { ChangeShipperAddressComponent } from "./../dialogs/change-shipper-address/change-shipper-address.component";
import { DeliverOrderComponent } from "./../dialogs/deliver-order/deliver-order.component";
import { CancelOrderComponent } from "./../dialogs/cancel-order/cancel-order.component";
import { OrderDownloadComponent } from "./../dialogs/order-download/order-download.component";
import { CreateOrderComponent } from "./../dialogs/create-order/create-order.component";
import { FileUploadModule } from "ng2-file-upload";
import { OrdersComponent } from "./orders/orders.component";
import { HttpInterceptorService } from "./../services/http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { OrderDetailsBackupComponent } from "./order-details-backup/order-details-backup.component";
import { EpiCurrencyDirective } from "./../directives/epi-currency.directive";
import { OrderRoutingModule } from "./order-routing.module";
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";

//import { AgeditComponent } from '../admin/agedit/agedit.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatDateFormats,
  NGX_MAT_DATE_FORMATS,
  NgxMatNativeDateModule,
  NgxMatDateAdapter,
} from "@angular-material-components/datetime-picker";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { InputNumberDirective } from "../directives/input-number.directive";
import { HttpClientModule } from "@angular/common/http";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { ScrollingModule } from "@angular/cdk/scrolling";
const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: "l, LTS",
  },
  display: {
    dateInput: "MMM Do YYYY, h:mm a",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
// ;import { OrdersComponent } from './orders.component';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from "ngx-perfect-scrollbar";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SharedModule } from "../shared/shared.module";
import { CancelEstimateComponent } from "../dialogs/cancel-estimate/cancel-estimate.component";
import { MergeOrderComponent } from "../dialogs/Merge-Order/merge-orders.component";
import { SplitEstimateComponent } from "../dialogs/split-estimate/split-estimate.component";
import { PackageComponent } from "./package-view/package.component";
import { PackageListDoc } from "./post-package-list-docs/package-list-pre";
import { PostInvoice } from "./post-invoice/postInvoice.component";
import { SiDraftComponent } from "./si-draft/si-draft.component";
import { SelfSealCertificateComponent } from "./self-seal-certificate/self-seal-certificate.component";
import { VgmComponent } from "./vgm/vgm.component";
import { CHALetterComponent } from "./cha-letter/cha-letter.component";
import { ScomatDeclarationComponent } from "./scomat-declaration/scomat-declaration.component";
import { NonScomatDeclarationComponent } from "./non-scomat-declaration/non-scomat-declaration.component";
import { QuillModule } from "ngx-quill";
import "quill-mention";
import "quill-emoji";
import { OrderActivityLogComponent } from "./order-activity-log/order-activity-log.component";
import { SelfSealContainerComponent } from "./self-seal-container/self-seal-container.component";
import { NdpsDeclarationComponent } from "./ndps-declaration/ndps-declaration.component";
import { AdcDeclarationComponent } from "./adc-declaration/adc-declaration.component";
import { ExportRegisterFormComponent } from "./export-register-form/export-register-form.component";
import { OtherCostsFormComponent } from "./other-costs-form/other-costs-form.component";
import { OtherOrderDetailsComponent } from "./other-order-details/other-order-details.component";
import { FreightFormComponent } from "./freight-form/freight-form.component";
import { OrderShippingDetailsComponent } from "./order-shipping-details/order-shipping-details.component";
import { NewOrderCreateComponent } from "./new-order-create/new-order-create.component";
import { ShipmentDetailsComponent } from "./shipment-details/shipment-details.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { CreateShipmentComponent } from "./create-shipment/create-shipment.component";
import { OrdersShipmentDetailsComponent } from "./orders-shipment-details/orders-shipment-details.component";
import { ShipmentPackingDetailsComponent } from "./shipment-packing-details/shipment-packing-details.component";
import { PackingDetailsTableComponent } from "./packing-details-table/packing-details-table.component";
import { SampleAgGridComponent } from "./shipment-packing-details/sample-ag-grid/sample-ag-grid.component";
import { AgGridModule } from "ag-grid-angular";
import { CreateContainerComponent } from "./shipment-container-details/create-container/create-container.component";
import { StuffingFormComponent } from "./stuffing-form/stuffing-form.component";
import { ShipmentContainerDetailsComponent } from "./shipment-container-details/shipment-container-details.component";
import { NewCreateShipmentComponent } from "./new-create-shipment/new-create-shipment.component";
import { PaymentsDetailsComponent } from "./payments-details/payments-details.component";
import { ShippingBillFormComponent } from "./shipping-bill-form/shipping-bill-form.component";
import { CustomerPurchaseOrderFormComponent } from "./customer-purchase-order-form/customer-purchase-order-form.component";
import { CustomsPricingComponent } from "./customs-pricing/customs-pricing.component";
import { OpenPackageGridComponent } from "./open-package-grid/open-package-grid.component";
import { NonPalletTableComponent } from "./packing-details-table/non-pallet-table/non-pallet-table.component";
import { PalletTableComponent } from "./packing-details-table/pallet-table/pallet-table.component";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsBackupComponent,
    CreateOrderComponent,
    OrderDownloadComponent,
    CancelOrderComponent,
    DeliverOrderComponent,
    ChangeShipperAddressComponent,
    MergeOrderComponent,
    AddDrumsComponent,
    EmailDocumentsComponent,
    AddBatchNumberComponent,
    CancelEstimateComponent,
    // AddLineItemComponent,
    // DeleteLineItemComponent,
    // MarkAsPaidComponent,
    SplitEstimateComponent,
    PackageComponent,
    PackageListDoc,
    PostInvoice,
    SiDraftComponent,
    SelfSealCertificateComponent,
    VgmComponent,
    CHALetterComponent,
    ScomatDeclarationComponent,
    NonScomatDeclarationComponent,
    OrderActivityLogComponent,
    SelfSealContainerComponent,
    NdpsDeclarationComponent,
    AdcDeclarationComponent,
    ExportRegisterFormComponent,
    OtherCostsFormComponent,
    OtherOrderDetailsComponent,
    FreightFormComponent,
    OrderShippingDetailsComponent,
    NewOrderCreateComponent,
    ShipmentDetailsComponent,
    OrderDetailsComponent,
    CreateShipmentComponent,
    OrdersShipmentDetailsComponent,
    ShipmentPackingDetailsComponent,
    PackingDetailsTableComponent,
    SampleAgGridComponent,
    CreateContainerComponent,
    StuffingFormComponent,
    ShipmentContainerDetailsComponent,
    NewCreateShipmentComponent,
    PaymentsDetailsComponent,
    ShippingBillFormComponent,
    CustomerPurchaseOrderFormComponent,
    CustomsPricingComponent,
    OpenPackageGridComponent,
    NonPalletTableComponent,
    PalletTableComponent,
  ],
  imports: [
    OrderRoutingModule,
    CommonModule,
    SharedModule,
    AgGridModule.withComponents([]),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
    // EpiCurrencyPipe
    // PipesModule
  ],
})
export class OrdersModule {}
