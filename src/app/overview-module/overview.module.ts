import { PipesModule } from './../pipes-module/pipes.module';
import { ContactImageNamePipe } from './../custom-pipes/contact-image-name.pipe';
import { PowerConversionPipe } from './../pipes/power-conversion.pipe';
import { LetterPipe } from './../custom-pipes/letter.pipe';
import { MyFilterPipe } from './../general-module/reports/reports-dashboard/reports-dashboard.component';
import { EpiCurrencyPipe } from './../pipes/epi-currency.pipe';
import { MonthPickerComponent } from './../month-picker/month-picker.component';
import { CreatePurchaseOrderComponent } from './../dialogs/create-purchase-order/create-purchase-order.component';
import { AddCampaignComponent } from './../projects/add-campaign/add-campaign.component';
import { AddObjectiveComponent } from './../projects/add-objective/add-objective.component';
import { ObjectiveDetailComponent } from './../projects/objective-detail/objective-detail.component';
import { ObjectivesComponent } from './../projects/objectives/objectives.component';
import { ProjectsComponent } from './../projects/projects/projects.component';
import { DashboardStatsComponent } from './../dashboard/dashboard-stats/dashboard-stats.component';

import { FileUploadModule } from 'ng2-file-upload';


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
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { TwitterStatsComponent } from '../dashboard/twitter-stats/twitter-stats.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
      suppressScrollX: true
    };
     



@NgModule({
  declarations: [
    OverviewComponent,
    DashboardComponent,
    DashboardStatsComponent,
    ProjectsComponent,
    ObjectivesComponent,
    TwitterStatsComponent,
    ObjectiveDetailComponent,
    AddObjectiveComponent,
    AddCampaignComponent,
    CreatePurchaseOrderComponent,
    MonthPickerComponent,

  ],
  imports: [
  
    OverviewRoutingModule,
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
    }
   
  ],
})
export class OverviewModule { }
