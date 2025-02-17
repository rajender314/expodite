import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { OrganizationsService } from "../../services/organizations.service";
import { language } from "../../language/language.module";
import { from } from "rxjs";

@Component({
  selector: "bank-details",
  templateUrl: "./bank-details.component.html",
  styleUrls: ["./bank-details.component.scss"],
  providers: [OrganizationsService],
})
export class BankdetailsComponent implements OnInit {
  @Input() Contacts;
  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();

  detailsForm: FormGroup;
  public language = language;
  public newBank = "Add Bank Details";
  public disabledSave = false;
  public moduleName: string;
  public showSpinner = false;

  constructor(
    public dialogRef: MatDialogRef<BankdetailsComponent>,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    private utilsService: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.organizationsService.clientCurrency.subscribe((message) => {
      // Handle client currency if needed
    });
  }

  generateDetailsForm(ev): void {
    this.detailsForm = ev.form;
    this.moduleName = ev.module;
  }

  addBankform(form: FormGroup): void {
    if (form.valid) {
      this.disabledSave = true;
      this.showSpinner = true;
      const param = {
        form_data: form.value.storeCustomAttributes[0],
        moduleName: this.moduleName,
        id: this.data?.prefill_id ? this.data?.prefill_id : "",
      };

      this.utilsService
        .saveStoreAttribute(param)
        .then((res) => {
          let toast = {
            msg: res.data.new_data
              ? "Bank Details Added Successfully"
              : "Bank Details Updated Successfully",
            status: res.success ? "success" : "error",
          };
          if (res.success) {
            this.snackbar.showSnackBar(toast);
            this.dialogRef.close({
              success: true,
              response: res.data.new_data,
            });
            this.showSpinner = false;
          } else {
            toast = {
              msg: res.message ? res.message : "Unable to Add/Update",
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
            this.disabledSave = false;
            this.showSpinner = false;
          }
        })
        .catch((err) => {
          this.showSpinner = false;
          console.error(err);
        });
    } else this.detailsForm.markAsTouched();
  }
}
