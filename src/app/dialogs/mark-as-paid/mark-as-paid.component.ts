import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
// import { OrdersService } from '../../services/orders.service';
import { SnakbarService } from "../../services/snakbar.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { CustomValidation } from "../../custom-format/custom-validation";
import { OrdersService } from "../../services/orders.service";
import moment = require("moment");
import { MatDatepicker } from "@angular/material/datepicker";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-mark-as-paid",
  templateUrl: "./mark-as-paid.component.html",
  styleUrls: ["./mark-as-paid.component.scss"],
})
export class MarkAsPaidComponent implements OnInit {
  paymentForm: FormGroup;

  displayedColumns;
  payment_list = [];
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<any>,
    private formBuilder: FormBuilder,
    private orderService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService
  ) {
    dialogRef.disableClose = true;
  }

  maxDate: Date;
  column_data: any = [];

  row_data: any = [];

  ngOnInit() {
    this.maxDate = new Date();

    // this.generatePaymentForm();
    // this.getViewDetails(this.data.invoice_id, "commercial_invoice_payments");
  }
  markAsPaid() {
    this.dialogRef.close({ success: true });
  }

  // generatePaymentForm(): void {
  //   this.paymentForm = this.formBuilder.group({
  //     amount_received: [
  //       "",
  //       [Validators.required, this.amountGreaterThanZeroValidator],
  //     ],
  //     date_of_payment: [null, [Validators.required]],
  //   });
  // }

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
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

  public payment_date;

  public button_disabled = false;
  addPayment(form) {
    let toast: object;
    if (form.valid) {
      this.button_disabled = true;

      let param = {
        id: this.editID,
        form_data: form.value.storeCustomAttributes[0],
        organization_id: this.data.invoice_id,
        moduleName: this.moduleName,
      };
      this.utilsService.saveStoreAttribute(param).then((res) => {
        if (res.success) {
          this.dialogRef.close({ success: true });

          toast = { msg: res.message ? res.message : "", status: "success" };
          this.snackbar.showSnackBar(toast);
          // this.getViewDetails(
          //   this.data.invoiceData.id,
          //   "commercial_invoice_payments"
          // );
          //   this.freightandlogistics.markAsPristine();
          //   toast = { msg: res.message, status: "success" };
          //   this.snackbar.showSnackBar(toast);
          //   this.orderPermissions.emit();
          // } else {
          //   // this.disabledSave = false;
          //   toast = {
          //     msg: res.message ? res.message : "Unable to Update",
          //     status: "error",
          //   };
          //   this.snackbar.showSnackBar(toast);
        } else {
          this.button_disabled = false;
          toast = { msg: res.message ? res.message : "", status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });

      // this.button_disabled = true;
      // let params = form.value;
      // const payment_date = params.date_of_payment;
      // const isValidDate = moment(payment_date, "YYYY-MM-DD", true).isValid();
      // if (isValidDate) {
      //   this.payment_date = moment(payment_date).format("YYYY-MM-DD");
      // } else {
      // }
      // params.payment_date = this.payment_date;
      // params.commercial_invoice_id = this.commercial_invoice_id;
      // this.orderService.addPaymentsApi(params).then((response) => {
      //   if (response.result.success) {
      //     this.dialogRef.close({ success: true });
      //   }
      // });
    }
  }

  public balance_amount;
  public balance_amount_formatted;
  public currency;
  public commercial_invoice_id;
  public is_totally_paid = false;
  getViewDetails(id, type: string) {
    this.OrdersService.getViewDetails({ id, type }).then(async (response) => {
      if (response.result.success && response.result.data) {
        this.row_data = response.result.data.row_data || [];
        this.column_data = response.result.data.column_data || [];
        this.displayedColumns = response.result.data.column_data.map(
          (col) => col.field
        );
      }
    });
  }
  public editID = "";

  public moduleName = "";
  public initialFieldsCount = 0;
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.paymentForm = ev.form;
    this.editID = ev.editID;
    const obj =
      this.paymentForm.controls.storeCustomAttributes["controls"][0].controls;
    const names = Object.keys(obj);
    this.initialFieldsCount = names.length;
  }
  triggerGridEvent(event) {
    console.log(event);
  }
  public isViewMore = false;

  viewMore() {
    let scrollTag;
    this.isViewMore = !this.isViewMore;

    //   setTimeout(() => {
    //     if (this.paymentForm.controls.storeCustomAttributes) {
    //       console.log(this.initialFieldsCount)
    //       console.log(`.payment-error .fields-list .custom-class-${this.initialFieldsCount}`, `.payment-error .fields-list .custom-class-9`)
    //         scrollTag = document.querySelector(
    //           `.payment-error .fields-list .custom-class-${this.initialFieldsCount}`
    //         );
    //         console.log(scrollTag)
    //         if (scrollTag) {
    //           scrollTag.scrollIntoView({ behavior: "smooth" });
    //         }
    //         return;
    // }
    //   }, 1500);
  }
}
