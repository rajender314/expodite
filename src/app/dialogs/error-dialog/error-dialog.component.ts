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
  selector: "app-error-dialog",
  templateUrl: "./error-dialog.component.html",
  styleUrls: ["./error-dialog.component.css"],
})
export class ErrorDialogComponent implements OnInit {
  result: true;
  success: boolean;
  public disabledSave = false;
  public showSpinner = false;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  onButtonClick(): void {
    if (this.data.is_delete_id) {
      this.OrdersService.deleteFromData({
        id: this.data.is_delete_id,
        type: this.data.type
      }).then((res) => {
        if (res.result.success) {
          this.dialogRef.close({ success: true });
        }
      }); // Call the parent function
    }
  }
  // deleteOrder(): void {
  //   this.disabledSave = true;
  //   this.showSpinner = true;
  //   this.OrdersService.acceptOrder({
  //     id: this.data,
  //     orders_types_id: 5,
  //     typeCancel: 1,
  //   }).then((response) => {
  //     this.success = true;
  //     this.showSpinner = false;
  //     this.dialogRef.close({ success: true });
  //     let toast: object;
  //     toast = { msg: "Order cancelled successfully.", status: "success" };
  //     this.snackbar.showSnackBar(toast);
  //   });
  // }
}
