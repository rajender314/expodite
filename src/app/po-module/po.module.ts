import { PipesModule } from "../pipes-module/pipes.module";
import { MyFilterPipe } from "../general-module/reports/reports-dashboard/reports-dashboard.component";
import { PowerConversionPipe } from "../pipes/power-conversion.pipe";
import { LetterPipe } from "../custom-pipes/letter.pipe";
import { ContactImageNamePipe } from "../custom-pipes/contact-image-name.pipe";
import { EpiCurrencyPipe } from "../pipes/epi-currency.pipe";
import { MarkAsPaidComponent } from "../dialogs/mark-as-paid/mark-as-paid.component";
import { DeleteLineItemComponent } from "../dialogs/delete-line-item/delete-line-item.component";
import { AddLineItemComponent } from "../dialogs/add-line-item/add-line-item.component";
import { AddBatchNumberComponent } from "../dialogs/add-batch-number/add-batch-number.component";
import { NgSelectModule } from "@ng-select/ng-select";
import { EmailDocumentsComponent } from "../dialogs/email-documents/email-documents.component";
import { AddDrumsComponent } from "../dialogs/add-drums/add-drums.component";
import { ChangeShipperAddressComponent } from "../dialogs/change-shipper-address/change-shipper-address.component";
import { DeliverOrderComponent } from "../dialogs/deliver-order/deliver-order.component";
import { CancelOrderComponent } from "../dialogs/cancel-order/cancel-order.component";
import { OrderDownloadComponent } from "../dialogs/order-download/order-download.component";
import { CreateOrderComponent } from "../dialogs/create-order/create-order.component";
import { FileUploadModule } from "ng2-file-upload";
import { HttpInterceptorService } from "../services/http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
// import { OrderDetailsBackupComponent } from './order-details/estimates-details.component';
import { EpiCurrencyDirective } from "../directives/epi-currency.directive";
// import { EstimateRoutingModule } from "./estimates-routing.module";
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
import { CreateEstimateComponent } from "../dialogs/create-estimate/create-estimate.component";
import { PODetailsComponent } from "./po-details/po-details.component";
import { POComponent } from "./po/po-list.component";
import { PORoutingModule } from "./po-routing.module";
import { POCreateComponent } from "./po-create/po-create.component";
import { CancelPoComponent } from "../dialogs/cancel-po/cancel-po.component";
import { PoInvoiceComponent } from "./po-invoice/po-invoice.component";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
@NgModule({
  declarations: [
    POComponent,
    PODetailsComponent,
    // POCreateComponent,
    CancelPoComponent,
    PoInvoiceComponent,
    // OrderDownloadComponent,
    // CancelOrderComponent,
    // DeliverOrderComponent,
    // ChangeShipperAddressComponent,
    // AddDrumsComponent,
    // EmailDocumentsComponent,
    // AddBatchNumberComponent,
    // AddLineItemComponent,
    // DeleteLineItemComponent,
    // MarkAsPaidComponent,
  ],
  imports: [PORoutingModule, SharedModule],
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
export class POModule {}
