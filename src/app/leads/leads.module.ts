import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsListComponent } from './leads-list/leads-list.component';
import { LeadDetailsComponent } from './lead-details/lead-details.component';
import { LeadOverviewComponent } from './lead-overview/lead-overview.component';
import { AddLeadDialogComponent } from './add-lead-dialog/add-lead-dialog.component';
import { LeadsService } from './leads.service';
import { AgGridModule } from 'ag-grid-angular';
//import { AgeditComponent } from '../admin/agedit/agedit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CustomMaterialModule } from '../custom-material/custom-material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MessagesComponent } from './messages/messages.component';
import { AppointmentDialogComponent } from './appointment-dialog/appointment-dialog.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatDateFormats, NGX_MAT_DATE_FORMATS, NgxMatNativeDateModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { InputNumberDirective } from '../directives/input-number.directive';
import { CreateQuoteComponent } from './create-quote/create-quote.component';
import { AddProductComponent } from './add-product/add-product.component';
import { QuotePreviewComponent } from './quote-preview/quote-preview.component';
import { QuoteEmailComponent } from './quote-email/quote-email.component';
import { HttpClientModule} from '@angular/common/http';
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
@NgModule({
  declarations: [LeadsListComponent, LeadDetailsComponent, LeadOverviewComponent, AddLeadDialogComponent, MessagesComponent, AppointmentDialogComponent, CreateQuoteComponent, AddProductComponent, QuotePreviewComponent, QuoteEmailComponent],
  imports: [
    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, AngularEditorModule,
    AgGridModule.withComponents([
     // AgeditComponent
    ]),
    CustomMaterialModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FlexLayoutModule,
    LeadsRoutingModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule
  ],
  providers: [
    LeadsService,
    { provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class LeadsModule { }
