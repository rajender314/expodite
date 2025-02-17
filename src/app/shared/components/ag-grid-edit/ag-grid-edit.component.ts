import { Component, Inject, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrdersService } from "../../../services/orders.service";
import { SnakbarService } from "../../../services/snakbar.service";

@Component({
  selector: "app-ag-grid-edit",
  templateUrl: "./ag-grid-edit.component.html",
  styleUrls: ["./ag-grid-edit.component.scss"],
})
export class AgGridEditComponent implements OnInit {
  public disableSave = true;
  public gridForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AgGridEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService
  ) {}
  ngOnInit(): void {
    this.generateFrom();
    this.gridForm.valueChanges.subscribe((val) => {
      // console.log(val,this.gridForm)
      if (this.gridForm && this.gridForm.dirty) {
        this.disableSave = false;
      }
    });
  }
  removeCommas(value: string): number {
    return parseFloat(value.replace(/,/g, ""));
  }
  generateFrom() {
    if (
      this.data.title == "Edit Proforma Invoice" ||
      this.data.title == "Edit Order Details" ||
      this.data.title == "Edit PO Invoice"
    ) {
      this.gridForm = this.formBuilder.group({
        product_quantity: [
          this.removeCommas(
            this.data.rowData.product_quantity || this.data.rowData.quantity
          ),
          [Validators.required, this.amountGreaterThanZeroValidator],
        ],
        product_description: [
          this.data.rowData.product_description ||
            this.data.rowData.description,
        ],
        product_price: [
          this.removeCommas(
            this.data.rowData.product_price || this.data.rowData.rate_per_uom
          ),
          [Validators.required, this.amountGreaterThanZeroValidator],
        ],
      });
    } else {
      this.gridForm = this.formBuilder.group({
        product_price: [
          this.removeCommas(this.data.rowData.product_price),
          [Validators.required, this.amountGreaterThanZeroValidator],
        ],
      });
    }
  }

  amountGreaterThanZeroValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const amount = control.value;
    if (
      amount === null ||
      amount === undefined ||
      isNaN(amount) ||
      amount <= 0
    ) {
      return { amountInvalid: true };
    }
    return null;
  }
  saveGridData() {
    this.disableSave = true;
    // console.log(this.gridForm)
    if (!this.gridForm.valid) {
      return;
    }
    const params = {
      // product_quantity:  this.gridForm.value.product_quantity.toString(),
      // product_description: this.gridForm.value.product_description,
      // product_price: this.gridForm.value.product_price.toString(),
      ...this.gridForm.value,
      id: this.data.rowData.id || this.data.rowData.estimate_product_id || "",
      single_piece: this.data.rowData.single_piece,
    };
    setTimeout(() => {
      this.ordersService
        .updateProduct({ ...params }, this.data.saveApi)
        .then((response) => {
          this.disableSave = false;
          if (response && response.result.success) {
            let toast: object;
            toast = {
              msg: "Updated Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
            const res = {
              ...response.result.data,
              amount: response.result.data.amount || response.result.data.total,
            };
            this.dialogRef.close({ success: true, response: res });
          } else {
            let toast: object;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        });
    }, 500);
  }

  restrictInput(event: KeyboardEvent): void {
    if (event.key == "e") {
      event.preventDefault();
    }
  }
  restrictPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData("text");
    if (!pastedText.match(/^\d+(\.\d{1,3})?$/)) {
      event.preventDefault();
    }
  }
}
