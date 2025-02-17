import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { EstimateDetailsComponent } from "../../estimates-module/estimates-details/estimate-details.component";
import { SnakbarService } from "../../services/snakbar.service";
import { OrderDetailsBackupComponent } from "../../orders-module/order-details-backup/order-details-backup.component";

@Component({
  selector: "app-spli-estimate",
  templateUrl: "./add-description.component.html",
  styleUrls: ["./add-description.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class DescriptionUpload implements OnInit {
  quantity: number;
  savebutton: boolean = true;
  addSplit: any[] = [""];
  disableaddsplit: boolean = true;
  attechement_id: number;
  remaningCount: number;
  maxquanity: boolean;
  invalidnumber: boolean;
  success: boolean;
  order_id: any;
  split_quantity: any;
  values;
  any;
  product_id;
  array = [];
  errorMessage: string;
  sameQuantity: boolean;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrderDetailsBackupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }
  idvalue: any;
  description: any;
  ordertype;
  type;
  ngOnInit() {
    this.array = this.data;
    this.attechement_id = this.data.attachments_id;
    this.idvalue = this.data.id;
    this.order_id = this.data.orders_id;
    this.description = this.data.discription;
    this.ordertype = this.data.order_type;
    this.type = this.data.type;
    console.log(this.data, 5747);
  }

  descriptionupdate;
  descriptionvalue(event) {
    console.log(event.target.value);
    this.descriptionupdate = event.target.value;
  }

  splitQuantity() {
    if (this.data.component == "po") {
      this.OrdersService.savePOAttachmentsApi({
        po_id: this.order_id,
        attachments_id: this.attechement_id,
        description: this.description,
        id: this.idvalue,
      }).then((response) => {
        this.success = false;
        this.dialogRef.close({ success: true });
        let toast: object;
        toast = { msg: "  File Uploaded Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      });
    } else {
      this.OrdersService.generateSavefiles(
        this.data.component == "pfi"
          ? {
              form_data_id: this.order_id,
              attachments_id: this.attechement_id,
              type: this.type,
              estimate_id: this.order_id,
              description: this.description,
              order_type: this.ordertype,
              id: this.idvalue,
            }
          : {
              orders_id: this.order_id,
              attachments_id: this.attechement_id,
              type: this.type,
              estimate_id: this.order_id,
              description: this.description,
              order_type: this.ordertype,
              id: this.idvalue,
            }
      ).then((response) => {
        if (response.result.success) {
          this.success = true;
          this.dialogRef.close({ success: true });
          let toast: object;
          toast = { msg: "Updated Successfully...", status: "success" };
          this.snackbar.showSnackBar(toast);
        } else {
          this.dialogRef.close({ success: false });
          let toast: object;
          toast = { msg: "  Failed to Update ", status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    }
  }
}
