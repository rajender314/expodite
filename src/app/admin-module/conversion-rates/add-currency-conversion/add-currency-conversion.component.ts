import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AdminService } from "../../../services/admin.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ConversionRatesComponent } from "../conversion-rates.component";

@Component({
  selector: "add-currency-conversion",
  templateUrl: "./add-currency-conversion.component.html",
  styleUrls: ["./add-currency-conversion.component.scss"],
})
export class AddCurrencyConversionComponent implements OnInit {
  currencyForm: FormGroup;
  exchRates: any;
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ConversionRatesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.editCurrencyData();
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  public noZeroValidator(control: FormControl) {
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  createForm() {
    this.currencyForm = this.fb.group({
      currency_name: [
        null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      currency_code: [
        null,
        [
          Validators.required,
          Validators.min(3),
          Validators.max(3),
          this.noWhitespaceValidator,
        ],
      ],
      exch_rate: [
        null,
        [
          Validators.min(0.000001),
          Validators.required,
          this.noWhitespaceValidator,
        ],
      ],
    });
  }

  setForm(data) {
    this.currencyForm.patchValue({
      currency_name: data.name,
      currency_code: data.code,
      exch_rate: data.final_export_rate,
    });
  }

  addCurrency(currencyForm) {
    console.log(this.currencyForm.value.currency_name, "curr");
    let param = {
      id: this.data.edit_id,
      name: this.currencyForm.value.currency_name,
      code: this.currencyForm.value.currency_code,
      final_export_rate: this.currencyForm.value.exch_rate,
    };
    this.adminService
      .addicegateExchRateApi(param)
      .then((response) => {
        if (response.result.success) {
          this.currencyForm.reset();
          this.dialogRef.close({ success: true, response: response });
        }
      })
      .catch((error) => console.log(error));
  }

  editCurrencyData() {
    let param = { selectedDate: "", id: this.data.edit_id };
    if (this.data.edit_id) {
      this.adminService
        .icegateExchRateApi(param)
        .then((response) => {
          if (response.result.success) {
            this.exchRates = response.result.data.exchDetails[0];
            this.setForm(this.exchRates);
          }
        })
        .catch((error) => console.log(error));
       
    }
  }
}
