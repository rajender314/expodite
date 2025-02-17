import { OrdersComponent } from "./../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";

@Component({
  selector: "app-cancel-order",
  templateUrl: "./cancel-order.component.html",
  styleUrls: ["./cancel-order.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class CancelOrderComponent implements OnInit {
  result: true;
  success: boolean;
  public disabledSave = false;
  public showSpinner = false;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<CancelOrderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  deleteOrder(): void {
    this.disabledSave = true;
    this.showSpinner = true;
    this.OrdersService.updateEstimateApi({
      id: this.data.id,
      type: this.data.type,
    })
      // .acceptOrder({ id: this.data, orders_types_id: 5, typeCancel: 1 })
      .then((response) => {
        this.success = true;
        this.showSpinner = false;
        this.dialogRef.close({ success: true, ...response.result.data });
        let toast: object;
        toast = {
          msg: `${this.data.module} Cancelled Successfully.`,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      });
  }
}
