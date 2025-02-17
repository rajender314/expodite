import { EstimatesComponent } from "./estimates/estimates.component";
import { HttpInterceptorService } from "../services/http-interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EstimateRoutingModule } from "./estimates-routing.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxMatDateFormats } from "@angular-material-components/datetime-picker";
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
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import { SharedModule } from "../shared/shared.module";
import { CreateEstimateComponent } from "../dialogs/create-estimate/create-estimate.component";
import { EstimateDetailsComponent } from "./estimates-details/estimate-details.component";
import { ProductsImportComponent } from "./products-import/products-import.component";
import { EstimateFilterComponent } from './estimate-filter/estimate-filter.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
};
@NgModule({
  declarations: [
    EstimatesComponent,
    EstimateDetailsComponent,
    CreateEstimateComponent,
    ProductsImportComponent,
    EstimateFilterComponent,
  ],
  imports: [EstimateRoutingModule, SharedModule, CommonModule],
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
  ],
})
export class EstimateModule {}
