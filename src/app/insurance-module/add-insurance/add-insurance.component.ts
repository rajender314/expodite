import {
  Component,
  EventEmitter,
  HostListener,
  Inject,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import * as _ from "lodash";
import { language } from "../../language/language.module";
import { UtilsService } from "../../services/utils.service";
import { SnakbarService } from "../../services/snakbar.service";
declare var App: any;

@Component({
  selector: "app-add-insurance",
  templateUrl: "./add-insurance.component.html",
  styleUrls: ["./add-insurance.component.scss"],
})
export class AddInsuranceComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  @HostListener("window:scroll", ["$event"])
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  public insurancePayload: any;
  public isDisableBtn = true;
  public isDiableItems = true;
  private language = language;
  public disableBtn = false;
  fetchingData = false;
  detailsForm: FormGroup;
  formData: FormGroup;
  activestate: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<AddInsuranceComponent>,
    private snackbar: SnakbarService
  ) {}

  ngOnInit(): void {}

  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }

  getSelectedAddress(obj: any) {
    this.insurancePayload = {
      ...obj,
    };
    this.isDisableBtn = false;
    if (this.formData) {
      if (this.formData.valid) {
        this.isDiableItems = false;
      } else {
        this.isDiableItems = true;
      }
    }
  }

  updateInsurance(form?: any): void {}

  public insurance_form_id = "";
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
    this.activestate = true;
  }

  public undoOnCancel = false;
  cancel(form: any): void {
    form.markAsPristine();
    // this.setForm(this.Contacts);
    this.activestate = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }
  saveInsurance(form: any): void {
    this.fetchingData = true;
    this.disableBtn = true;

    setTimeout(() => {
      let toast: object;
      let param: any = {
        form_data: this.detailsForm.value.storeCustomAttributes[0],
        moduleName: this.moduleName
      };
      if (!form.valid) return;
      this.utilsService.saveStoreAttribute(param).then((res) => {
        this.disableBtn = false;
        if (res.success) {
          toast = { msg: "Insurance Added Successfully.", status: "success" };
          setTimeout(() => {
            this.trigger.closed = true;
            this.dialogRef.close({ success: true, response: res.data.new_data });
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
}
