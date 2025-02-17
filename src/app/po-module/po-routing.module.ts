import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { POComponent } from "./po/po-list.component";
import { PODetailsComponent } from "./po-details/po-details.component";

const routes: Routes = [
  {
    path: "",
    component: POComponent,
  },
  { path: ":id", component: PODetailsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PORoutingModule {}
