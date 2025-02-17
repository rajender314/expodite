import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { FormArray, FormGroup } from "@angular/forms";
declare var App: any;

@Component({
  selector: "app-add-payments",
  templateUrl: "./add-payments.component.html",
  styleUrls: ["./add-payments.component.scss"],
})
export class AddPaymentsComponent implements OnInit {
  public detailsForm: FormGroup;
  public disableBtn = false;
  public fetchingData = false;
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<AddPaymentsComponent>,
    private snackbar: SnakbarService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      const storeCustomAttributesArray = this.detailsForm.get(
        "storeCustomAttributes"
      ) as FormArray;

      if (storeCustomAttributesArray && storeCustomAttributesArray.at(0)) {
        const firstAttributeGroup = storeCustomAttributesArray.at(
          0
        ) as FormGroup;

        // Subscribe to valueChanges of the entire FormGroup at index 0
        firstAttributeGroup.valueChanges.subscribe((formValue) => {
          if (formValue.amount_received_inr && formValue.amount_received) {
            const conversionRate =
              parseFloat(formValue.amount_received_inr) /
              parseFloat(formValue.amount_received);

            // Update the 'conversion_rate_applied' control
            firstAttributeGroup.patchValue(
              { conversion_rate_applied: conversionRate.toFixed(2) }, // Round to 2 decimal places
              { emitEvent: false } // Prevent triggering `valueChanges` again
            );
          }
        });
      }
    }, 3000);
  }
  saveInsurance() {
    this.fetchingData = true;
    this.disableBtn = true;

    setTimeout(() => {
      let toast: object;
      let param: any = {
        form_data: this.detailsForm.value.storeCustomAttributes[0],
        moduleName: this.moduleName,
      };
      if (!this.detailsForm.valid) return;
      this.utilsService.saveStoreAttribute(param).then((res) => {
        this.disableBtn = false;
        if (res.success) {
          toast = { msg: "Payment Added Successfully.", status: "success" };
          setTimeout(() => {
            this.dialogRef.close({
              success: true,
              response: res.data.new_data,
            });
          }, 1000);
          this.snackbar.showSnackBar(toast);
        } else {
          toast = {
            msg: res.message ? res.message : "Unable to Add",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
          this.fetchingData = false;
        }
      });
    }, 500);
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
  }
}
