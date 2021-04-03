import { AgGridModule } from 'ag-grid-angular';
import { PipesModule } from './../pipes-module/pipes.module';
import { PowerConversionPipe } from './../pipes/power-conversion.pipe';
import { LetterPipe } from './../custom-pipes/letter.pipe';
import { ContactImageNamePipe } from './../custom-pipes/contact-image-name.pipe';
import { EpiCurrencyPipe } from './../pipes/epi-currency.pipe';
import { DeleteViewComponent } from './../dialogs/delete-view/delete-view.component';
import { SaveViewComponent } from './../dialogs/save-view/save-view.component';
import { FileUploadModule } from 'ng2-file-upload';
import { AccessDeniedComponent } from './../access-denied/access-denied.component';
import { ContainerDeleteComponent } from './../dialogs/container-delete/container-delete.component';
import { AddAutoAttibuteComponent } from './../admin-module/lead-attributes/add-auto-attibute/add-auto-attibute.component';
import { AddAttributeComponent } from './../admin-module/lead-attributes/add-attribute/add-attribute.component';
import { LeadAtrbtDetailComponent } from './../admin-module/lead-attributes/lead-atrbt-detail/lead-atrbt-detail.component';
import { LeadAtrbtListComponent } from './../admin-module/lead-attributes/lead-atrbt-list/lead-atrbt-list.component';
import { UserDetailsComponent } from './../users/user-details/user-details.component';
import { PaginationComponent } from './../pagination/pagination.component';
import { ReportsComponent } from './reports/reports-list/reports.component';
import { ReportsDashboardComponent, MyFilterPipe } from './reports/reports-dashboard/reports-dashboard.component';
import { ShipmentsReportComponent } from './reports/shipments-report/shipments-report.component';
import { PaymentDueComponent } from './reports/payment-due/payment-due.component';
import { OrdersDuebyClientsComponent } from './reports/orders-dueby-clients/orders-dueby-clients.component';
import { OrdersbyStatusComponent } from './reports/ordersby-status/ordersby-status.component';
import { SalesMtdComponent } from './reports/sales-mtd/sales-mtd.component';
import { SalesYtdComponent } from './reports/sales-ytd/sales-ytd.component';
import { AuthorizeMailComponent } from './../admin-module/authorize-mail/authorize-mail.component';
import { GeneralRoutingModule } from './general-routing.module';
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
import { InvetoryReportsComponent } from './reports/invetory-reports/invetory-reports.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     



@NgModule({
  declarations: [
    ReportsComponent,
    SalesYtdComponent,
    SalesMtdComponent,
    OrdersbyStatusComponent,
    OrdersDuebyClientsComponent,
    PaymentDueComponent,
    ShipmentsReportComponent,  
    ReportsDashboardComponent,
    InvetoryReportsComponent,
    
    AccessDeniedComponent,
    SaveViewComponent,
    DeleteViewComponent,
    
  ],
  imports: [
    AgGridModule.withComponents([

    ]),
    GeneralRoutingModule,
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
    ReportsComponent
    // PipesModule
   
   
  ],
})
export class GeneralModule { }
