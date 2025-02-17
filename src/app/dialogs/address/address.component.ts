import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  Injectable,
} from "@angular/core";
import { MatInputModule } from "@angular/material/input";
import * as _ from "lodash";
import { OrganizationsService } from "../../services/organizations.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { language } from "../../language/language.module";
import { SnakbarService } from "../../services/snakbar.service";
import { AdminService } from "../../services/admin.service";
import { ViewEncapsulation } from "@angular/core";
import { LeadsService } from "../../leads/leads.service";
import { UtilsService } from "../../services/utils.service";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-address",
  templateUrl: "./address.component.html",
  styleUrls: ["./address.component.scss"],
  providers: [OrganizationsService, AdminService],
  // encapsulation: ViewEncapsulation.None,
})
export class AddressComponent implements OnInit {
  @Input() Organization;
  @Output() trigger = new EventEmitter<object>();
  public language = language;
  addressForm: FormGroup;
  createAddressForm: FormGroup;
  address_type: any[];
  countries: any[];
  newAddress = "Add Address";
  states: any[];
  submitCountry = false;
  submitState = false;
  countriesStates: any;
  clientAddress: Array<any>;
  public clientAddressSame: any = [];
  public sameChkShow: boolean = false;
  addressChecked: boolean;
  selected = -1;
  public disabledSave = false;
  public showSpinner = false;
  public disablad: boolean = false;
  private specialCharacter = /^[a-zA-Z0-9]+$/;
  // public sameAsShipping = false;
  // public sameAsBilling = false;
  public selectedAddress = "";

  constructor(
    private organizationsService: OrganizationsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<AddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadService: LeadsService,
    private utilsService: UtilsService
  ) {
    dialogRef.disableClose = true;
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
    // let isWhitespace = (control.value || "").trim().length === 0;
    // let isValid = !isWhitespace;
    // return isValid ? null : { whitespace: true };
  }
  public noZeroValidator(control: FormControl) {
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }
  generateAddressForm(): void {
    this.addressForm = this.fb.group({
      address_count: "",
      address_type_id: [
        this.data?.addressTypeId || "",
        this.data.org_type === "vendor" ? Validators.required : null,
      ],
      company_name: [null, this.noWhitespaceValidator],
      address1: [
        "",
        this.data.org_type === "vendor"
          ? [Validators.required, this.noWhitespaceValidator]
          : [
              Validators.required,
              this.noWhitespaceValidator,
              // Validators.pattern(/^[a-zA-Z0-9\s]+$/),
            ],
      ],
      address2: [
        null,
        this.noWhitespaceValidator,
        // Validators.pattern(/^[a-zA-Z0-9\s]+$/),
      ],
      address3: [
        null,
        this.noWhitespaceValidator,
        // Validators.pattern(/^[a-zA-Z0-9\s]+$/),
      ],
      address4: [
        null,
        this.noWhitespaceValidator,
        // Validators.pattern(/^[a-zA-Z0-9\s]+$/),
      ],
      city: ["", [Validators.required, this.noWhitespaceValidator]],
      postal_code: [
        "",
        [
          Validators.required,
          this.noWhitespaceValidator,
          //  Validators.pattern(/^[a-zA-Z0-9\s]+$/)
        ],
      ],
      state_province_id: ["", Validators.required],
      country_id: ["", Validators.required],
      org_id: "",
      id: "",
      org_address_bill_id: "",
      organization_id: "",
      state: "",
      address_id: "",
      address_type: "",
      country_name: "",
      addCountry: [null],
      addState: [null],
    });
    this.addressForm.patchValue({
      org_id: this.data.address.org_id,
    });
  }
  setform() {
    if (this.data.address.id) {
      this.newAddress = "Update Address";
      this.addressForm.patchValue({
        address_count: this.data.address.address_count,
        company_name: this.data.address.company_name,
        address1: this.data.address.address1,
        address2: this.data.address.address2,
        address3: this.data.address.address3,
        address4: this.data.address.address4,
        address_id: this.data.address.address_id,
        address_type: this.data.address.address_type,
        address_type_id: this.data.address.address_type_id,
        city: this.data.address.city,
        country_id: this.data.address.country_id,
        country_name: this.data.address.country_name,
        id: this.data.address.address_id,
        org_address_bill_id: this.data.address.org_address_bill_id,
        org_id: this.data.address.org_id,
        organization_id: this.data.address.organization_id,
        postal_code: this.data.address.postal_code,
        state: this.data.address.state,
        state_province_id: this.data.address.state_province_id,
      });
    }
  }
  ngOnInit() {
    this.clientAddress = this.data.address.addressClientData;
    this.clientAddressSame = this.data.clientAddressSame;
    this.sameChkShow = this.data.sameChkShow;
    this.createAddressForm = this.data.createAddressForm;
    if (this.data.address.id) {
      this.newAddress = "Update Address";
    }
    // this.getOrganizationDetails();
    // this.generateAddressForm();
    // this.setform();

    // this.leadService.apiResponse$.subscribe(async (response: any) => {
    //   if (response) {
    //     console.log(response)
    //     this.disabledSave = false;
    //     this.showSpinner = false;
    //     // console.log(form.valid)
    //     this.dialogRef.close({
    //       success: true,
    //       response: response.new_data
    //     });
    //     this.leadService.clearApiResponse();
    //   }
    // });
  }
  getOrganizationDetails(): void {
    this.organizationsService.getGlobalOrganizations().then((response) => {
      if (response.result.success) {
        this.address_type = response.result.data.address_types;
        this.countries = response.result.data.countries;
        this.countriesStates = response.result.data.countriesStates;
        this.states = response.result.data.states;
      }
    });
  }
  onCountryChange(data?: any, stateId?: any): void {
    this.addressForm.get("addCountry").clearValidators();

    if (this.submitCountry) {
      this.addressForm
        .get("addCountry")
        .setValidators([
          Validators.required,
          this.noWhitespaceValidator,
          Validators.pattern(this.specialCharacter),
          this.noZeroValidator,
        ]);
    }

    // Update validators
    this.addressForm.get("addCountry").clearValidators();

    if (this.addressForm.value.country_id) {
      this.submitCountry = false;
      this.states = this.countriesStates
        ? this.countriesStates[this.addressForm.value.country_id]
        : [];
      this.addressForm.patchValue({
        state_province_id: stateId
          ? stateId
          : this.states
          ? this.states[0].id
          : "",
      });
    } else {
      this.submitCountry = true;
    }
  }
  onStateChange() {
    if (this.submitState) {
      this.addressForm
        .get("addState")
        .setValidators([
          Validators.required,
          Validators.pattern(this.specialCharacter),
          this.noWhitespaceValidator,
          this.noZeroValidator,
        ]);
    }
    this.addressForm.get("addState").clearValidators();

    if (this.addressForm.value.state_province_id) {
      this.submitState = false;
    } else {
      this.submitState = true;
    }
  }
  addAddress(form?: FormGroup, data?: any): void {
    this.disabledSave = true;
    setTimeout(() => {
      let toast: object;
      // this.addressForm.get("address_type_id").markAsTouched({ onlySelf: true });
      // this.addressForm.get("address1").markAsTouched({ onlySelf: true });
      // this.addressForm.get("country_id").markAsTouched({ onlySelf: true });
      // this.addressForm.get("city").markAsTouched({ onlySelf: true });
      // this.addressForm.get("postal_code").markAsTouched({ onlySelf: true });
      // this.addressForm
      //   .get("state_province_id")
      //   .markAsTouched({ onlySelf: true });

      // if (this.data.type != "edit") {
      //   form.value["address_count"] =
      //     this.data.address.addressClientData.length + 1;
      // }
      // if (this.addressForm.value.address_type_id == 4) {
      //   this.addressForm.value.address_type = "Shipping Address";
      // }
      // if (this.addressForm.value.address_type_id == 2) {
      //   this.addressForm.value.address_type = "Office/Billing Address";
      // }
      // if (this.addressForm.value.address_type_id == 11) {
      //   this.addressForm.value.address_type = "Notifying Address";
      // }
      // return
      // this.addressForm.value.id = this.addressForm.value.address_id;
      // console.log(this.addressForm.value)
      // console.log(this.Organization, this.data.org_id)
      // let param = Object.assign(
      //   {
      //     org_type: this.data.org_type == "vendor" ? 3 : 2,
      //   },
      //   this.addressForm.value.storeCustomAttributes[0]
      // );
      let param = {
        form_data: this.addressForm.value.storeCustomAttributes[0],
        organization_id: this.data.org_id,
        id: this.data.address.id,
        moduleName: this.moduleName,
      };
      if (this.data.prefill_id) param["form_id"] = this.data.prefill_id;
      this.utilsService.saveStoreAttribute(param).then((res) => {
        if (res.success) {
          toast = {
            msg: res.data.new_data
              ? "Address Added Successfully"
              : "Address Updated Successfully",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.trigger.closed = true;
          this.dialogRef.close({
            success: true,
            response: res.data.new_data,
          });
        } else {
          this.disabledSave = false;
          toast = {
            msg: res.message ? res.message : "Unable to Update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      });
      // if (form.valid) {
      //   this.disabledSave = true;
      //   this.showSpinner = true;
      //   this.organizationsService
      //     .OrganizationAddress(param)
      //     .then((response) => {
      //       if (response.result.success) {
      //         this.disabledSave = false;
      //         this.showSpinner = false;
      //         // console.log(form.valid)
      //         this.dialogRef.close({
      //           success: true,
      //           response: response.result.data.address_organization[0],
      //         });
      //       } else {
      //         this.disabledSave = false;
      //         this.showSpinner = false;
      //         toast = { msg: response.result.message, status: "error" };
      //       }
      //       // this.snackbar.showSnackBar(toast);
      //     })
      //     .catch((error) => console.log(error));
      // } else {
      //   this.disabledSave = false;
      // }
    }, 500);
  }
  addCountry(country: any) {
    if (country.value.addCountry) {
      this.adminService
        .addCountry({ name: country.value.addCountry })
        .then((response) => {
          if (response.result.success) {
            this.submitState = true;
            this.submitCountry = false;
            this.getOrganizationDetails();
            this.addressForm.patchValue({
              country_id: response.result.data.id,
              state_province_id: "",
            });
            // this.addressForm.get("addCountry")?.reset();
          } else {
            let toast: object;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        });
    }
  }

  addState(form: any) {
    if (form.value.addState) {
      this.adminService
        .addState({
          name: form.value.addState,
          country_id: form.value.country_id,
        })
        .then((response) => {
          if (response.result.success) {
            this.submitState = false;
            this.getOrganizationDetails();
            this.addressForm.patchValue({
              state_province_id: response.result.data.id,
            });
            // this.addressForm.get("addState")?.reset();
          } else {
            let toast: object;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        });
    }
  }

  // checkboxValue: boolean;
  getAddress(data: any, list: any, type: any): void {
    // console.log(data)
    if (!data.selected) {
      this.setAddressForm(data);
    } else {
      this.addressForm.reset();
    }
    // address.id == data.address.id
    data.selected = !data.selected;
    list.map(function (value) {
      if (data.id != value.id) {
        // console.log(value)
        value["selected"] = false;
      }
    });
  }

  setAddressForm(address) {
    // console.log(address)
    if (address.address_type_id) {
      this.addressForm.patchValue({
        address_count: this.data.address.address_count,
        company_name: address.company_name,
        address1: address.address1,
        address2: address.address2,
        address4: address.address4,
        address5: address.address5,
        address_id: address.address_id,
        address_type: address.address_type,
        address_type_id: address.address_type_id,
        city: address.city,
        country_id: address.country_id,
        country_name: address.country_name,
        id: address.id || "",
        org_address_bill_id: address.org_address_bill_id || "",
        org_id: this.data.address.org_id,
        organization_id: address.organization_id,
        postal_code: address.postal_code,
        state: address.state,
        state_province_id: address.state_province_id,
      });
    }
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.addressForm = ev.form;
  }
  emitUploadInfo(ev) {}
  getAddressSame(event) {
    if (event.checked) {
      this.disablad = true;
      this.addressForm.patchValue({
        address_type_id: this.createAddressForm?.value?.address_type_id,
        address1: this.clientAddressSame?.[0]?.address1,
        address2: this.clientAddressSame?.[0].address2,
        address3: this.clientAddressSame?.[0].address3,
        address4: this.clientAddressSame?.[0].address4,
        postal_code: this.clientAddressSame?.[0].postal_code,
        city: this.clientAddressSame?.[0].city,
        country_id: this.clientAddressSame?.[0].country_id,
        state_province_id: this.clientAddressSame?.[0].state_province_id,
      });
      //this.order.selectedBillingError = false;
    } else {
      this.addressForm.patchValue({
        address1: "",
        address2: "",
        postal_code: "",
        city: "",
        country_id: "",
        state_province_id: "",
      });
      this.disablad = false;
    }

    // if(this.uncheck){
    //   this.order.selectedBillingError = false;
    // }

    // console.log(this.checkedArr)
  }
}

// WEBPACK FOOTER //
// ./src/app/dialogs/address/address.component.ts
