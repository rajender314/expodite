
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PaymentDetailsComponent } from "./payment-details/payment-details.component";
import { PaymentListComponent } from "./payment-list/payment-list.component";


const routes: Routes = [
  {
    path: "",
    component: PaymentListComponent,
  },

  {path: ":id", component: PaymentDetailsComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
