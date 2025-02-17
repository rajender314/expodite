import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsuranceComponent } from './insurance/insurance.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
} from "ngx-perfect-scrollbar";
import { InsuranceRoutingModule } from './insurance-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from '../services/http-interceptor.service';
import { AddInsuranceComponent } from './add-insurance/add-insurance.component';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};

@NgModule({
  declarations: [InsuranceComponent, InsuranceDetailsComponent, AddInsuranceComponent],
  imports: [InsuranceRoutingModule, CommonModule, SharedModule],
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
export class InsuranceModule { }
