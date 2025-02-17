
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { InsuranceComponent } from "./insurance/insurance.component";
import { InsuranceDetailsComponent } from "./insurance-details/insurance-details.component";

const routes: Routes = [
  {
    path: "",
    component: InsuranceComponent,
  },

  {path: ":id", component: InsuranceDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuranceRoutingModule {}
