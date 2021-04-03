import { PipesModule } from './../pipes-module/pipes.module';
import { ContactImageNamePipe } from './../custom-pipes/contact-image-name.pipe';
import { LetterPipe } from './../custom-pipes/letter.pipe';
import { MyFilterPipe } from './../general-module/reports/reports-dashboard/reports-dashboard.component';
import { DeleteLineItemComponent } from './../dialogs/delete-line-item/delete-line-item.component';
import { AddLineItemComponent } from './../dialogs/add-line-item/add-line-item.component';
import { SharedModule } from './../shared/shared.module';
import { InvoicesComponent } from './invoices/invoices.component';
import { EpiCurrencyPipe, InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { HttpInterceptorService } from './../services/http-interceptor.service';
import { InvoiceRoutingModule } from './invoice-routing.module';
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
import { PowerConversionPipe } from '../pipes/power-conversion.pipe';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     

@NgModule({
  declarations: [
    
    // AddLineItemComponent,
    // DeleteLineItemComponent,
    InvoicesComponent,
    InvoiceDetailsComponent,
    // AddLineItemComponent,
    // DeleteLineItemComponent,

   ],
  imports: [
  
    InvoiceRoutingModule,
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
export class InvoiceModule { }
