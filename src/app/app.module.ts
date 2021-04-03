import { LightboxModule } from 'ngx-lightbox';


import { LogService } from './services/log.service';
import { Title } from "@angular/platform-browser";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { InputTrimModule } from "ng2-trim-directive";
import {
  BrowserAnimationsModule
  
} from "@angular/platform-browser/animations";
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


import { AgGridModule } from 'ag-grid-angular';
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey(
  'Enterpi_Software_Solutions_Private_Limited_MultiApp_1Devs21_August_2019__MTU2NjM0MjAwMDAwMA==f0a6adf3f22452a5a3102029b1a87a43'
);
import { ReportsService } from "./services/reports.service";

import { NgxMatSelectSearchModule } from "ngx-mat-select-search";


import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PdfPreviewComponent } from './dialogs/pdf-preview/pdf-preview.component';

import { TokenExpiredComponent } from './dialogs/token-expired/token-expired.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { SharedModule } from './shared/shared.module';





declare var App: any;
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true
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
  ],
  imports: [
    BrowserModule,
    InputTrimModule,
    InfiniteScrollModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    NgxMatSelectSearchModule,
    AgGridModule.withComponents([

    ]),
    PdfViewerModule,
    NgxDocViewerModule,
    PerfectScrollbarModule,
    LightboxModule,
    SharedModule,
    DashboardRoutingModule,

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
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
   
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents:[]

})
export class AppModule {
  private language = language;
  constructor(private titleService: Title) {
    this.titleService.setTitle(App["company_data"].mainTitle);
  }
}
