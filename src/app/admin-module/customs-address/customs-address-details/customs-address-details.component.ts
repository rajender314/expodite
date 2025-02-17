import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  NgForm,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { VERSION } from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";
import { Observable } from "rxjs/Observable";

import { AddressDeleteComponent } from "../../../dialogs/address-delete/address-delete.component";
import { Images } from "../../../images/images.module";
import { OrganizationsService } from "../../../services/organizations.service";

import * as _ from "lodash";

import { AdminService } from "../../../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { PermissionsService } from "../../../services/permissions.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { UtilsService } from "../../../services/utils.service";

@Component({
  selector: "customs-address-details",
  templateUrl: "./customs-address-details.component.html",
  styleUrls: ["./customs-address-details.component.scss"],
})
export class CustomsAddressDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() contacts;
  @Input() globalData;
  @Output() trigger = new EventEmitter<object>();
  detailsForm: FormGroup;
  fetchingData: boolean;
  contactSubmit: boolean;
  noContacts: boolean;
  deleteHide: boolean;
  newCountry: any;
  pointerEvent: boolean;
  address_type: any[];
  submitCountry = false;
  submitState = false;
  countries: any[];
  addContacts = "Add Address";
  states: any[];
  countriesStates: any;
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  selectedContacts: any;
  private language = language;
  public images = Images;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private organizationsService: OrganizationsService,
    private adminService: AdminService,
    private utilsService: UtilsService
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noContacts = false;
    this.fetchingData = true;

    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.contacts != undefined)
      if (!_.isEmpty(this.contacts)) {
        this.addContacts = "Update Address";
        this.detailsForm.reset();
        if (this.contacts.hasOwnProperty("flag")) {
          this.noContacts = true;
          this.deleteHide = true;
          this.selectedContacts = {};
        } else {
          this.deleteHide = false;
          this.selectedContacts = this.contacts;
          this.setForm(this.contacts);
        }
      } else {
        this.pointerEvent = false;

        this.newContact(true);
      }
    /*if (this.contacts) {
      this.selectedContacts = this.contacts;
      this.setForm(this.selectedContacts);
    }*/
  }

  ngOnInit() {}

  newContact(flag: boolean): void {
    this.addContacts = "Add Contact";

    if (flag) this.detailsForm.reset();
    this.selectedContacts = {};
    this.states = [];
    this.contacts = {};
    this.deleteHide = true;
    this.fetchingData = false;

    //this.setForm({});
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }

  deleteItem(form: any): void {
    let toast: object;
    let dialogRef = this.dialog.open(AddressDeleteComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
      // height: '240px',
      data: this.detailsForm.value,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.adminService
          .deleteCustomsAddr({ id: this.selectedContacts.id })
          .then((response) => {
            if (response.result.success) {
              form.markAsPristine();
              if (this.selectedContacts.id)
                toast = { msg: response.result.message, status: "success" };
              this.trigger.emit({
                flag: this.selectedContacts.id,
                delete: true,
                data: this.selectedContacts,
              });
            } else {
              toast = { msg: response.result.message, status: "error" };
            }
            this.snackbar.showSnackBar(toast);
          })
          .catch((error) => console.log(error));
      }
    });
  }

  onCountryChange(data?: any, stateId?): void {
    // console.log(this.detailsForm.value)
    if (this.detailsForm.value.country_id) {
      this.states = this.globalData
        ? this.globalData.countriesStates[this.detailsForm.value.country_id]
        : [];
      this.submitCountry = false;
      this.detailsForm.patchValue({
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

  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  createForm(ev): void {
    this.detailsForm = ev.form;
    // this.fb.group({
    //   customs_office_name: [
    //     "",
    //     [Validators.required, this.noWhitespaceValidator],
    //   ],
    //   customs_office_code: [""],
    //   contact_person_name: [""],
    //   contact_person_phone: [
    //     "",
    //     [Validators.pattern("^\\+?[0-9\\-\\s]+$"), Validators.minLength(6)],
    //   ],
    //   port_entry: [""],
    //   address1: ["", [this.noWhitespaceValidator]],
    //   address2: ["", [this.noWhitespaceValidator]],
    //   city: ["", [this.noWhitespaceValidator]],
    //   status: [true],
    //   country_name: [""],
    //   postal_code: ["", [this.noWhitespaceValidator]],
    //   state: "",
    //   state_province_id: [""],
    //   country_id: [""],
    //   // phone: [
    //   //   "",
    //   //   [Validators.required, Validators.pattern("^\\+?[0-9\\-\\s]+$")],
    //   // ],
    //   email: [
    //     null,
    //     [
    //       Validators.pattern(
    //         /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    //       ),
    //       this.noWhitespaceValidator,
    //     ],
    //   ],
    // });
  }

  cancel(form: any): void {
    this.contactSubmit = false;
    form.markAsPristine();

    this.setForm(this.selectedContacts);
  }

  createCustomsAddress(form: any): void {
    // console.log(form)
    // let toast: object;

    if (!form.valid) return;
    // let param = Object.assign({}, form.value);
    // param.id = this.selectedContacts.id || 0;
    this.contactSubmit = true;
    //  this.conformsubmit = true;
    //  this.totalSpinner = false;
    //  if (form.value.price == "0") {
    //  }
    let toast: object;
    //  this.submitProduct = true;
    let param: any = {
      form_data: form.value.storeCustomAttributes[0],
      moduleName: "customs_addresses",
    };
    // id: this.selectedContacts.id || "",
    // moduleName: this.moduleName,
    let productIds = [];
    param.priceRange = [];
    this.utilsService.saveStoreAttribute(param).then((res) => {
      //  this.conformsubmit = false;
      //  this.totalSpinner = false;
      if (res.success) {
        toast = {
          msg: res.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.trigger.emit({
          flag: param.id,
          data: param.id ? this.selectedContacts : res.data.new_data,
        });
      } else {
        toast = {
          msg: res.message ? res.message : "Failed to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });

    // // console.log(form)
    // let toast: object;
    // this.contactSubmit = true;
    // if (!form.valid) return;
    // let param = Object.assign({}, form.value);
    // param.id = this.selectedContacts.id || 0;

    // this.adminService
    //   .addCustomsAddr(param)
    //   .then((response) => {
    //     if (response.result.success) {
    //       form.markAsPristine();
    //       this.contactSubmit = false;
    //       if (param.id)
    //         toast = {
    //           msg: "Customs Address Updated Successfully.",
    //           status: "success",
    //         };
    //       else
    //         toast = {
    //           msg: "Customs Address Added Successfully.",
    //           status: "success",
    //         };
    //       this.selectedContacts = response.result.data.customsAddrDt[0];
    //       this.trigger.emit({ flag: param.id, data: this.selectedContacts });
    //     } else {
    //       toast = { msg: response.result.message, status: "error" };
    //     }
    //     this.snackbar.showSnackBar(toast);
    //   })
    //   .catch((error) => console.log(error));
  }

  onStatusChange(event) {
    // console.log(event)
  }

  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then((response) => {
        if (response.result.success) {
          this.globalData = {
            address_type: response.result.data.address_types,
            countries: response.result.data.countries,
            countriesStates: response.result.data.countriesStates,
            states: response.result.data.states,
          };

          this.states = this.globalData.states;
          //  this.onCountryChange();
        }
      })
      .catch((error) => console.log(error));
  }

  setForm(data: any): void {
    // console.log(data)
    this.detailsForm.patchValue({
      customs_office_name: data.customs_office_name,
      customs_office_code: data.customs_office_code,
      port_entry: data.port_entry,
      port_exit: data.port_exit,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      status: data.status,
      country_id: data.country_id,
      country_name: data.country_name,
      id: data.id,
      postal_code: data.postal_code,
      state: data.state,
      state_province_id: data.state_province_id,
      phone: data.phone,
      email: data.email,
      contact_person_name: data.contact_person_name,
      contact_person_phone: data.contact_person_phone,
    });

    if (data.id == undefined) {
      this.addContacts = "Add Address";
      //console.log(this.inputEl)
      //this.inputEl.nativeElement.focus()
    } else {
      this.addContacts = "Update Address";
    }
    if (data) this.onCountryChange({}, data.state_province_id);
  }
}
