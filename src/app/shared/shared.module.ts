import { PipesModule } from './../pipes-module/pipes.module';
import { ContactImageNamePipe } from './../custom-pipes/contact-image-name.pipe';
import { LetterPipe } from './../custom-pipes/letter.pipe';
import { MyFilterPipe } from './../general-module/reports/reports-dashboard/reports-dashboard.component';
import { EpiCurrencyPipe } from './../invoice-module/invoice-details/invoice-details.component';
import { AddLineItemComponent } from './../dialogs/add-line-item/add-line-item.component';
import { DeleteLineItemComponent } from './../dialogs/delete-line-item/delete-line-item.component';
import { CustomMaterialModule } from './../custom-material/custom-material.module';
import { MoreEmailsComponent } from './../dialogs/more-emails/more-emails.component';
import { FileUploadModule } from 'ng2-file-upload';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
// import { EpiCurrencyPipe } from './../pipes/epi-currency.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerConversionPipe } from '../pipes/power-conversion.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';



@NgModule({
  declarations: [
    AddLineItemComponent,
    DeleteLineItemComponent,
    PaginationComponent,
    EpiCurrencyPipe,
    MyFilterPipe,
    LetterPipe,
    PowerConversionPipe, LetterPipe, ContactImageNamePipe,
    
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, AngularEditorModule,
  
    CustomMaterialModule,
   
    FlexLayoutModule,
    
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    FileUploadModule,
    NgSelectModule,

    // ExportDialogComponent,
    // MoreEmailsComponent
  ],
  providers: [
    AddLineItemComponent,
    DeleteLineItemComponent,
    // EpiCurrencyPipe,
    // MyFilterPipe,
    // LetterPipe,
    // DatePipe,
    // PowerConversionPipe, LetterPipe, ContactImageNamePipe,
  ],
  exports: [
    AddLineItemComponent,
    DeleteLineItemComponent,
    PaginationComponent,
    EpiCurrencyPipe,
    MyFilterPipe,
    LetterPipe,
    PowerConversionPipe, LetterPipe, ContactImageNamePipe,

    CommonModule,
    ScrollingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, AngularEditorModule,
    CustomMaterialModule,
    FlexLayoutModule,   
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    InfiniteScrollModule,
    PerfectScrollbarModule,
    FileUploadModule,
    NgSelectModule,
  ],
  entryComponents: [
    // ExportDialogComponent,
    // MoreEmailsComponent
   
  ]
})
export class SharedModule { }
