import { OrdersComponent } from "../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";

import { MatToolbarModule } from "@angular/material/toolbar";
declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-cancel-order",
  templateUrl: "./cancel-estimate.component.html",
  styleUrls: ["./cancel-estimate.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class CancelEstimateComponent implements OnInit {
  public estimateslanguage = estimate_name;
  result: true;
  success: boolean;
  public disabledSave = false;
  public showSpinner = false;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  deleteOrder(): void {
    this.disabledSave = true;
    this.showSpinner = true;
    this.OrdersService.updateEstimateApi({
      id: this.data,
      type: "cancelled",
      // estimate_id: this.data, status_id: 4,
    }).then((response) => {
      this.success = true;
      this.showSpinner = false;
      this.dialogRef.close({ success: true });
      // let toast: object;
      // toast = { msg: "Estimate cancelled successfully.", status: "success" };
      // this.snackbar.showSnackBar(toast);
    });
  }
}
