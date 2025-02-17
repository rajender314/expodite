import { OrdersComponent } from "./../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-add-line-item",
  templateUrl: "./add-line-item.component.html",
  styleUrls: ["./add-line-item.component.scss"],
  providers: [OrdersService],
})
export class AddLineItemComponent implements OnInit {
  lineItemForm: FormGroup;
  public disabledSave = false;

  constructor(
    private fb: FormBuilder,
    private OrdersService: OrdersService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    private snackbar: SnakbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    // this.generateLineItemForm();
    console.log(this.data, 9999);
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { whitespace: true };
  }
  generateLineItemForm(): void {
    this.lineItemForm = this.fb.group({
      lineItem: [null, [Validators.required, this.noWhitespaceValidator]],
      lineItemValue: [null, Validators.required],
    });
  }

  addLineItem(form: any) {
    this.disabledSave = true;
    let toast: object;
    console.log(this.data);
    let param = {
      form_data: this.lineItemForm.value.storeCustomAttributes[0],
      organization_id: this.data.id,
      module_id: this.data?.module_id ? this.data.module_id : "",
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.dialogRef.close({ success: true, response: res.data.new_data });
      } else {
        this.disabledSave = false;
        toast = {
          msg: res.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  generateInvoice() {
    let config = {
      orders_id: 0,
    };
    let param = Object.assign(config, this.data.invoice);
    let lineItem = {
      key: this.lineItemForm.value.lineItem,
      value: this.lineItemForm.value.lineItemValue,
    };
    param.extra_col.push(lineItem);
    this.OrdersService.generateInvoice(param).then((response) => {
      this.dialogRef.close({ success: true, response: response });
    });
  }
  //order details add line item
  generateAddline() {
    let config = {
      orders_id: 0,
    };
    let a = [];
    let lineItem = {
      key: this.lineItemForm.value.lineItem,
      value: this.lineItemForm.value.lineItemValue,
    };
    let param = Object.assign(this.data);
    if (this.data.extra_col) {
      param.extra_col.push(lineItem);
    } else {
      a.push(lineItem);
      param.extra_col = a;
    }

    this.OrdersService.changePoNumbr(param).then((response) => {
      if (response.result.success) {
        let toast: object;
        this.dialogRef.close({ success: true, response: response });
        toast = {
          msg: "Order Details Updated Successfully",
          status: "success",
        };
        // this.snackbar.showSnackBar(toast);
      }
    });
  }
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.lineItemForm = ev.form;
  }
  greneratepfi() {
    let a = [];
    let lineItem = {
      key: this.lineItemForm.value.lineItem,
      value: this.lineItemForm.value.lineItemValue,
    };
    let param = Object.assign(this.data);

    if (this.data.extra_col) {
      param.extra_col.push(lineItem);
    } else {
      a.push(lineItem);
      param.extra_col = a;
    }
    this.OrdersService.updatelineitempopfi(param).then((response) => {
      if (response.result.success) {
        let toast: object;

        this.dialogRef.close({ success: true, response: response });
        toast = { msg: response.result.message, status: "success" };
        // this.snackbar.showSnackBar(toast);
      } else {
      }
    });
  }
}
