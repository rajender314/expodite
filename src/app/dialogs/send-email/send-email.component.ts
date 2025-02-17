import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { PoInvoiceComponent } from "../../po-module/po-invoice/po-invoice.component";
@Component({
  selector: "app-send-email",
  templateUrl: "./send-email.component.html",
  styleUrls: ["./send-email.component.scss"],
})
export class SendEmailComponent implements OnInit {
  public disabledSave = false;
  public showSpinner = false;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<PoInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data, "send email");
  }
  SendEmail() {
    this.disabledSave = true;
    this.showSpinner = true;
    this.OrdersService.sendEmailApi({
      po_id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        this.disabledSave = false;
        this.showSpinner = false;
        this.dialogRef.close({ success: true });
        let toast: object;
        toast = {
          msg: " Email successfully sent to recipient!...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      } else {
        this.disabledSave = false;
        this.showSpinner = false;
        let toast: object;
        toast = {
          msg: "  Failed to Sent To Email...",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.dialogRef.close({ success: false });
      }
    });
  }
}
