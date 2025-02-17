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
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-add-country-state",
  templateUrl: "./add-country-state.component.html",
  styleUrls: ["./add-country-state.component.css"],
  providers: [OrdersService],
})
export class AddCountryStateComponent implements OnInit {
  // lineItemForm: FormGroup;
  public disabledSave = false;
  public countryStateName = "";

  constructor(
    public dialogRef: MatDialogRef<OrdersComponent>,
    private snackbar: SnakbarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService,
    private adminService: AdminService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  add() {
    if (this.data.type === "add_country") this.addCountry();
    else this.addSatate();
  }
  addCountry() {
    let toast: object;
    // this.dialogRef.close({
    //   success: true,
    //   response: { id: 2119, label: "Test Country" },
    // });
    if (this.countryStateName) {
      this.disabledSave = true;
      this.adminService
        .addCountry({ name: this.countryStateName })
        .then((res) => {
          if (res.result.success) {
            this.dialogRef.close({ success: true, response: res.result.data });
          } else {
            this.disabledSave = false;
            toast = {
              msg: res.result.message,
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
          }
        });
    } else {
      toast = {
        msg: "Country is Required",
        status: "error",
      };
    }
  }
  addSatate() {
    let toast: object;
    // console.log(this.countryStateName);
    // this.dialogRef.close({
    //   success: true,
    //   response: { id: 2119, label: "Test Country" },
    // });
    if (this.countryStateName) {
      this.disabledSave = true;
      this.adminService
        .addState({
          name: this.countryStateName,
          country_id: this.data.country_id,
        })
        .then((res) => {
          if (res.result.success) {
            this.dialogRef.close({ success: true, response: res.result.data });
          } else {
            this.disabledSave = false;
            toast = {
              msg: res.result.message,
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
          }
        });
    } else {
      toast = {
        msg: "State is Required",
        status: "error",
      };
    }
  }
  //order details add line item

  public moduleName = "";
  // formEmitEvent(ev) {
  //   this.moduleName = ev.module;
  //   this.lineItemForm = ev.form;
  // }
}
