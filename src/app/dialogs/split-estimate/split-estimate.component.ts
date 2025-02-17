import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { EstimateDetailsComponent } from "../../estimates-module/estimates-details/estimate-details.component";
import { SnakbarService } from "../../services/snakbar.service";

@Component({
  selector: "app-spli-estimate",
  templateUrl: "./split-estimate.component.html",
  styleUrls: ["./split-estimate.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class SplitEstimateComponent implements OnInit {
  quantity: number;
  savebutton: boolean = true;
  addSplit: any[] = [""];
  disableaddsplit: boolean = true;
  totalQuantity: number;
  remaningCount: number;
  maxquanity: boolean;
  invalidnumber: boolean;
  success: boolean;
  estimateId: any;
  split_quantity: any;
  values;
  any;
  product_id;
  errorMessage: string;
  sameQuantity: boolean;
  saveSplit: boolean = false;
  quantityError;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<EstimateDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    const { quantity } = this.data;
    const { estimate_id } = this.data;
    this.totalQuantity = parseFloat(quantity?.replace(/,/g, ""));
    this.remaningCount = this.totalQuantity;
    this.estimateId = estimate_id;
    this.product_id = this.data.order_product_id;
  }
  changeQuantity(event) {
    this.errorMessage = "";
    this.savebutton = false;
    let value = event.target.value;
    console.log(typeof value, typeof this.totalQuantity, 45);
    this.values = parseFloat(value);
    this.split_quantity = value;
    this.disableaddsplit = false;
    // if (value.includes(".")) {
    //   this.quantityError = true;
    //   this.savebutton = true;
    // } else {
    //   this.quantityError = false;
    //   // Perform any other necessary logic here
    // }
    if (value == this.totalQuantity) {
      this.disableaddsplit = true;
      this.savebutton = true;
      // this.sameQuantity=true;
      this.errorMessage = "Same quantity cannot be split.";
    }
    if (value <= 0) {
      this.savebutton = true;
      // this.invalidnumber= true;
      this.errorMessage = "Pleasen Enter Valid input other than 0.";
    }

    if (value > this.totalQuantity) {
      // this.maxquanity = true;
      this.savebutton = true;
      this.errorMessage = "Value can not exceed total quantity.";
    }

    this.remaningCount = this.totalQuantity - value;
  }
  hideError() {
    this.maxquanity = false;
    this.invalidnumber = false;
    this.sameQuantity = false;
  }

  addSplitClicked() {
    this.addSplit.push("");
  }
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      // Check if the input becomes valid after removing a character
      const originalValue = this.quantity;
      this.quantity = parseFloat(event.target["value"]);
      if (this.values <= this.totalQuantity) {
        this.disableaddsplit = false;
      }
      this.quantity = originalValue; // Restore the original value
    }
  }

  splitQuantity() {
    this.saveSplit = true;
    this.OrdersService.splitEstimateQuantity({
      estimate_id: this.estimateId,
      order_product_id: this.product_id,
      split_quantity: this.split_quantity,
    }).then((response) => {
      if (response.result.success) {
        this.success = true;
        this.dialogRef.close({ success: true });
        let toast: object;
        toast = { msg: "Split Quantity Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
        // this.saveSplit = false;
      } else {
        this.dialogRef.close({ success: false });
        let toast: object;
        toast = { msg: response.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.saveSplit = false;
      }
    });
  }
}
