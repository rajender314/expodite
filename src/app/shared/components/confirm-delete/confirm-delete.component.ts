import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrdersService } from "../../../services/orders.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { UtilsService } from "../../../services/utils.service";

@Component({
  selector: "app-confirm-delete",
  templateUrl: "./confirm-delete.component.html",
  styleUrls: ["./confirm-delete.component.scss"],
})
export class ConfirmDeleteComponent implements OnInit {
  public statusChangemsg: boolean = false;
  statusmsg: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.tableName == "payments") {
      this.statusChanges();
      this.statusChangemsg = true;
    }
  }
  statusChanges() {
    this.ordersService
      .getInvStatusUpdate({
        id: this.data.rowData.id,
      })
      .then((res) => {
        if (res.result.success) {
          console.log(res.result);
          this.statusmsg = res.result.data.msg;
        }
      });
  }
  deleteContainer() {
    let toast;
    if (this.data.tableName == "payments") {
      this.ordersService
        .deleteFromData({
          id: this.data.rowData.id,
          type: "commercial_invoice_add_payment",
        })
        .then((res) => {
          if (res.result.success) {
            this.dialogRef.close({ success: true });
            toast = { msg: "Payment Deleted Successfully", status: "success" };
            this.snackbar.showSnackBar(toast);
          }
        });
    } else if (this.data.tableName == "open_package") {
      this.ordersService
        .deleteOpenFormatPackage({ shipment_id: this.data.shipmentId })
        .then((response: any) => {
          if (response.result.success) {
            this.dialogRef.close({ success: true });
            toast = { msg: "File Deleted Successfully", status: "success" };
            this.snackbar.showSnackBar(toast);
          }
        });
    } else {
      this.ordersService
        .deleteContainer({ id: this.data.rowData.id })
        .then((res) => {
          if (res.result.success) {
            this.dialogRef.close({ success: true });
            toast = {
              msg: "Container Deleted Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          }
        });
    }
  }
}
