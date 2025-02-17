import { OrdersComponent } from "./orders/orders.component";
import { OrderDetailsBackupComponent } from "./order-details-backup/order-details-backup.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShipmentDetailsComponent } from "./shipment-details/shipment-details.component";
import { OrderDetailsComponent } from "./order-details/order-details.component";
import { OrdersShipmentDetailsComponent } from "./orders-shipment-details/orders-shipment-details.component";

const routes: Routes = [
  {
    path: "",
    component: OrdersComponent,
  },
  // { path: ":id", component: OrderDetailsBackupComponent },
  // { path: ":id", component: ShipmentDetailsComponent },
  { path: ":id", component: OrderDetailsComponent },
  {
    path: ":id/shipments/:shipmentId",
    component: ShipmentDetailsComponent,
    //  OrdersShipmentDetailsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
