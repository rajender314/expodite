import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, NgForm } from '@angular/forms';
import { language } from '../../../language/language.module';
import { VERSION } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Observable } from 'rxjs/Observable';


import { AddressDeleteComponent } from '../../../dialogs/address-delete/address-delete.component';
import { Images } from '../../../images/images.module';
import { OrganizationsService } from '../../../services/organizations.service';

import * as _ from 'lodash';

import { AdminService } from '../../../services/admin.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { PermissionsService } from '../../../services/permissions.service';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  styleUrls: ['./contact-address-details.component.scss'],
  providers: [AdminService, SnakbarService, PermissionsService],
  animations: [
    trigger('AdminDetailsAnimate', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
      ])
    ])
  ]
})
export class ContactAddressDetailsComponent implements OnInit, OnChanges {
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
  addContacts = "Add Contact"
  states: any[];
  countriesStates: any;
  status: Array<object> = [
    { id: 1, value: 'Active', param: true },
    { id: 0, value: 'Inactive', param: false }
  ];
  selectedContacts: any;
  private language = language;
  public images = Images;
  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private organizationsService: OrganizationsService,
    private adminService: AdminService) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.noContacts = false;
    this.fetchingData = true;

    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.contacts != undefined)
      if (!_.isEmpty(this.contacts)) {
        this.addContacts = "Update Contact";
        this.detailsForm.reset();
        if (this.contacts.hasOwnProperty('flag')) {
          this.noContacts = true;
          this.deleteHide = true;
          this.selectedContacts = {};
        }
        else {
          this.deleteHide = false;
          this.selectedContacts = this.contacts;
          this.setForm(this.contacts);

        }

      }
      else {
        this.pointerEvent = false;

        this.newContact(true);
      }
    /*if (this.contacts) {
      this.selectedContacts = this.contacts;
      this.setForm(this.selectedContacts);
    }*/
  }

  ngOnInit() {
    this.createForm();
  }

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
      panelClass: 'alert-dialog',
      width: '500px',
      // height: '240px',
      data: this.detailsForm.value
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.adminService
          .deleteContactAddress({ id: this.selectedContacts.id })
          .then(response => {
            if (response.result.success) {
              form.markAsPristine();
              if (this.selectedContacts.id) toast = { msg: response.result.message, status: "success" };
              this.trigger.emit({ flag: this.selectedContacts.id, delete: true, data: this.selectedContacts });
            }
            else {
              toast = { msg: response.result.message, status: "error" };
            }
            this.snackbar.showSnackBar(toast);
          })
          .catch(error => console.log(error))
      }
    });
  }


  onCountryChange(data?: any, stateId?): void {
    // console.log(this.detailsForm.value)
    if (this.detailsForm.value.country_id) {
      this.states = this.globalData ? this.globalData.countriesStates[this.detailsForm.value.country_id] : [];
      this.submitCountry = false;
      this.detailsForm.patchValue({
        state_province_id: stateId ? stateId : this.states ? this.states[0].id : ''
      });
    } else {
      this.submitCountry = true;
    }
  }

  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  createForm(): void {
    this.detailsForm = this.fb.group({
      address1: ["", [Validators.required, this.noWhitespaceValidator]],
      address2: ["", [Validators.required, this.noWhitespaceValidator]],
      city: ["", [Validators.required, this.noWhitespaceValidator]],
      status: [true, Validators.required],
      country_name: [""],
      postal_code: ["", [Validators.required, this.noWhitespaceValidator]],
      state: "",
      addCountry: "",
      addState: "",
      state_province_id: ["", Validators.required],
      country_id: ["", Validators.required],
      bank_details: "",
      phone: ["", Validators.required],
      drug_license_no: [""],
      fda_registration_no: [""],
      gstin_no: [""],      
    });
  }

  cancel(form: any): void {
    this.contactSubmit = false;
    form.markAsPristine();

    this.setForm(this.selectedContacts);

  }

  createContactAddress(form: any): void {
    // console.log(form)
    let toast: object;
    this.contactSubmit = true;
    if (!form.valid) return;
    let param = Object.assign({}, form.value);
    param.id = this.selectedContacts.id || 0;

    this.adminService
      .addContactAddress(param)
      .then(response => {
        if (response.result.success) {
          form.markAsPristine();
          this.contactSubmit = false;
          if (param.id) toast = { msg: response.result.message, status: "success" };
          else toast = { msg: response.result.message, status: "success" };
          this.selectedContacts = response.result.data.companyShpAddrDt[0];
          this.trigger.emit({ flag: param.id, data: this.selectedContacts });
        }
        else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch(error => console.log(error))
  }

  onStatusChange(event) {
    // console.log(event)
  }

  addCountry(country: any) {
    //  console.log(country)
    if (country.value.addCountry) {
      this.adminService
        .addCountry({ name: country.value.addCountry })
        .then(response => {
          if (response.result.success) {

            this.submitCountry = false;
            this.getOrganizationDetails();
            this.detailsForm.patchValue({
              country_id: response.result.data.id,
              state_province_id: '',
            });
          }

        });
    }
  }

  addState(form: any) {
    // console.log(country)
    if (form.value.addState) {
      this.adminService
        .addState({ name: form.value.addState, country_id: form.value.country_id })
        .then(response => {
          if (response.result.success) {
            this.submitState = false;
            this.getOrganizationDetails();
            this.detailsForm.patchValue({
              state_province_id: response.result.data.id,
            });
          }

        });
    }

  }

  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then(response => {
        if (response.result.success) {
          this.globalData = {
            address_type: response.result.data.address_types,
            countries: response.result.data.countries,
            countriesStates: response.result.data.countriesStates,
            states: response.result.data.states
          };

          this.states = this.globalData.states;
          //  this.onCountryChange();
        }
      })
      .catch(error => console.log(error))
  }

  setForm(data: any): void {
    // console.log(data)
    this.detailsForm.patchValue({
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
      bank_details: data.bank_details,
      phone: data.phone,
      drug_license_no: data.drug_license_no,
      fda_registration_no: data.fda_registration_no,
      gstin_no: data.gstin_no

    });

    if(data.id == undefined) {
      this.addContacts = "Add Contact"
      //console.log(this.inputEl)
      //this.inputEl.nativeElement.focus()
    } else {
      this.addContacts = "Update Contact"
    }
    if (data)
      this.onCountryChange({}, data.state_province_id);
  }

}
