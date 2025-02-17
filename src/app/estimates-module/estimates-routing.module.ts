import { EstimatesComponent } from "./estimates/estimates.component";
// import { OrderDetailsBackupComponent } from './order-details/estimates-details.component';
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EstimateDetailsComponent } from "./estimates-details/estimate-details.component";

const routes: Routes = [
  {
    path: "",
    component: EstimatesComponent,
  },
  //   {
  //     path: 'estimates', component: EstimatesComponent
  // },
  { path: ":id", component: EstimateDetailsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstimateRoutingModule {}
