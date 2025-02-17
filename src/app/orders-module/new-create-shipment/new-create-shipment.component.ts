import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
declare var App: any;
@Component({
  selector: "app-new-create-shipment",
  templateUrl: "./new-create-shipment.component.html",
  styleUrls: ["./new-create-shipment.component.scss"],
})
export class NewCreateShipmentComponent implements OnInit {
  // public language = language;
  public productsForm: FormGroup;
  public pfiSubTotalPayload: FormGroup;
  public submiteBtnClicked = false;
  public fetchingData = false;
  public shipmentsIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";

  public subTotalVal = 0;

  constructor(
    public dialogRef: MatDialogRef<NewCreateShipmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {}

  public formsError = false;
  public moduleName = "";
  ngOnInit(): void {}
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    // if (ev.module == "create_package") {
    //   // this.packageForm = ev.form;
    // } else {
    this.subTotalVal = ev.subTotalVal;

    this.productsForm = ev.addProdustsForm;

    // this.formsError = this.productsForm.value.productItem
    //   .filter((item) => item.is_checked)
    //   .some((item) => {
    //     console.log(item);
    //     return item.quantity == 0 || item.price == 0;
    //   });

    // }
  }

  getSelectedProdsLenght() {
    return (
      this.productsForm?.value?.productItem
        .filter((item) => item.is_checked)
        .map(({ is_checked, ...rest }) => rest).length || 0
    );
  }

  subTotalFormEvent(obj) {
    this.pfiSubTotalPayload = obj.form;
  }
  emitUploadInfo(ev) {}
  public disabledSave = false;
  editProducts() {
    if (!this.pfiSubTotalPayload.valid || !this.productsForm.valid) {
      this.pfiSubTotalPayload.markAllAsTouched();
      this.productsForm.markAllAsTouched();
      return;
    }
    this.submiteBtnClicked = true;
    this.fetchingData = true;
    this.productsForm.disable();
    this.pfiSubTotalPayload.disable();
    let param = {
      orders_id: this.data.orders[0].id ? this.data.orders[0].id : "",
      //   related_to_id: this.data.related_to_id || "",
      meta_data: {
        subtotal_form: this.pfiSubTotalPayload.value.fieldList[0],
        add_product_in_shipment: this.productsForm.value.productItem
          .filter((item) => item.is_checked)
          .map(({ is_checked, ...rest }) => rest),
      },
      moduleName: this.moduleName,
    };
    let toast: object;
    this.disabledSave = true;

    this.ordersService.createShipmentFromOrder(param).then((res) => {
      if (res.result.success) {
        // toast = { msg: res.result.message, status: "success" };
        // this.snackbar.showSnackBar(toast);
        this.fetchingData = false;
        // this.trigger.closed = true;
        this.dialogRef.close({
          success: true,
          response: res.result.data ? res.result.data.id : "",
        });
      } else {
        this.productsForm.enable();
        this.pfiSubTotalPayload.enable();
        this.submiteBtnClicked = false;
        this.disabledSave = false;
        this.fetchingData = false;
        toast = {
          msg: res.result.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
