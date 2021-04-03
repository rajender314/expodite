import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { language } from '../../language/language.module';
import { SnakbarService } from '../../services/snakbar.service';
import { LeadsService } from '../leads.service';
import * as moment from 'moment';
import { MyErrorStateMatcher } from '../lead.interface';
import { Router } from '@angular/router';
import { OrganizationsService } from '../../services/organizations.service';
import { Subject } from 'rxjs';
declare var App: any;

@Component({
  selector: 'app-add-lead-dialog',
  templateUrl: './add-lead-dialog.component.html',
  styleUrls: ['./add-lead-dialog.component.scss']
})
export class AddLeadDialogComponent implements OnInit {
  matcher = new MyErrorStateMatcher();
  public language = language;
  currencyX: any[];
  public fixedValue: any[];
  countries: any;
  states: any[];
  statesBill: any[];
  shipData:any;
  pointerEvent: boolean;
  sizeError: boolean;
  submitCountry = false;
  submitState = false;
  countriesStates: any;
  storesAttributesData = [];
  storesCustomAttributesData = [];
  dateFields = [];
  storesAttributeForm: FormGroup;
  fetchingData:any = false
  submittedStoresAttributeForm = false;
  btnDisable = false;
  serverError;
  contactList = new Subject<any>();
  contactListRef = [];
  contactSearchSpinner = false;
 public formValid = false;
 public bill_ship =false
  timeOutRef:any;
  constructor(
    private service: LeadsService,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<AddLeadDialogComponent>,
    private router: Router,
    private organizationsService: OrganizationsService,

  ) {

  }
  ngOnInit() {
    this.storesAttributeForm = this.fb.group({
      storesAttributes: this.fb.array([]),
      storeCustomAttributes: this.fb.array([]),
      contacts: this.fb.array([]),
      shipAddress:this.fb.array([]),
      billAddress:this.fb.array([]),
      
     
    });
    
    this.getOrgStoreAttribute();
    this.addContact();
    this.getContactList();
    this.getOrganizationDetails();
   
  }
  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then(response => {
        if (response.result.success) {
        //  this.address_type = response.result.data.address_types;
          this.countries = response.result.data.countries;
          this.countriesStates = response.result.data.countriesStates;
          this.states = response.result.data.states;
          this.statesBill = response.result.data.states;
          
          
        }
      })
  }
  onCountryChange(data?: any, stateId?: any): void {
   // console.log(this.storesAttributeForm.value.shipAddress[0].country_id,stateId,this.storesAttributeForm.value.shipAddress)
    if (this.storesAttributeForm.value.shipAddress[0].country_id) {
      this.submitCountry = false;
      this.states = this.countriesStates ? this.countriesStates[this.storesAttributeForm.value.shipAddress[0].country_id] : [];
      this.shipAddress.controls[0].patchValue({
        state_province_id: stateId ? stateId : this.states ? this.states[0].id : ''
      });
      //console.log(this.states)
     
    } else {
      this.submitCountry = true;
    }
  }
  onCountryChangeBill(data?: any, stateId?: any): void {
    console.log(this.storesAttributeForm.value.billAddress[0].country_id,stateId,this.storesAttributeForm.value.billAddress)
    if (this.storesAttributeForm.value.billAddress[0].country_id) {
      this.submitCountry = false;
      this.statesBill = this.countriesStates ? this.countriesStates[this.storesAttributeForm.value.billAddress[0].country_id] : [];
      this.billAddress.controls[0].patchValue({
        state_province_id: stateId ? stateId : this.statesBill ? this.statesBill[0].id : ''
      });
      console.log(this.statesBill,stateId)
     
    } else {
      this.submitCountry = true;
    }
  }
  get storesAttributes() {
    return this.storesAttributeForm.get('storesAttributes') as FormArray;
  }

  get storesCustomAttributes() {
    return this.storesAttributeForm.get('storeCustomAttributes') as FormArray;
  }

  get contactsForm() {
    return this.storesAttributeForm.get('contacts') as FormArray;
  }
  get shipAddress() {
    return this.storesAttributeForm.get('shipAddress') as FormArray;
  }
  get billAddress() {
    return this.storesAttributeForm.get('billAddress') as FormArray;
  }
  addContact() {
    this.contactsForm.push(this.fb.group({
      contact_name: [null, [ Validators.required]],
      contact_details: [null, [ Validators.required]],
      contact_id:0,
      email: [null, [ Validators.required,Validators.pattern(
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      )]]
    }));
  }

  deleteContact(i) {
    this.contactsForm.removeAt(i);
  }
  getOrgStoreAttribute(): void {
    this.service
      .getOrgStoreAttributeList({ id: '' })
      .then(response => {
        if (response.result.success) {
        this.fetchingData = true
          this.storesAttributesData = response.result.data.attributes.base_attributes;
          this.storesCustomAttributesData = response.result.data.attributes.custom_attributes;
          this.createAttributeControls();
          this.createShipControls();
          this.createBillControls();
          // this.setForm(this.storesAttributesData, [], this.storesCustomAttributesData);

        }
      })
      .catch(error => console.log(error))
  }

  createAttributeControls() {
    this.storesAttributesData.map(attr => {
      this.storesAttributes.push(this.createAttributeGroup(attr));
    });
    this.storesCustomAttributesData.map(attr => {
      this.storesCustomAttributes.push(this.createAttributeGroup(attr));
    });
  }
  createShipControls(){
    this.shipAddress.push(this.fb.group({
      address_1: [null],
      address_2: [null],
      city: [null],
      country_id: [null],
      state_province_id: [null],
      postal_code:[null]
    }));
  }
  createBillControls(){
    this.billAddress.push(this.fb.group({
      address_1: [null, [ Validators.required,this.noWhitespaceValidator]],
      address_2: [null],
      city: [null, [ Validators.required]],
      country_id: [null, [ Validators.required]],
      state_province_id: [null, [ Validators.required]],
      postal_code:[null, [ Validators.required]]
    }));
  }


  createAttributeGroup(data) {
    if (data.key === 'single_line_text' || data.key === 'paragraph_text') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            data.predefined_value,
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100),
              this.noWhitespaceValidator
            ]
          ]
          : [data.predefined_value]
      });
    } else if (data.key === 'auto_suggest') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            data.predefined_value,
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100)
            ]
          ]
          : [data.predefined_value]
      });
    } else if (data.key === 'number') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            data.predefined_value,
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100),
              this.noWhitespaceValidator
            ]
          ]
          : [data.predefined_value]
      });
    } else if (data.key === 'date_field') {
      this.dateFields.push(data.store_unique_label_key);
      return this.fb.group({
       // [data.store_unique_label_key]: data.required ? ['1222', [Validators.required]] : ''
         [data.store_unique_label_key]: data.required ? [new Date(), [Validators.required]] : new Date()
        // moment(this.modelData.end_date).format("MMM Do, YYYY")
      });
    } else {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [data.predefined_value, Validators.required]
          : [data.predefined_value]
      });
    }
  }
  saveAttributes(form): void {
    console.log(form.value,form.valid)
    this.storesAttributeForm.markAsPristine();
    this.storesAttributeForm.markAsTouched();
    this.storesAttributeForm.get('billAddress').markAsTouched()
    //this.storesAttributeForm.get('billAddress').markAsPristine();

    //this.storesAttributeForm.get('billAddress').markAsTouched();

    this.btnDisable = true;
    let toast: object;
    this.submittedStoresAttributeForm = true;
    this.formValid = true
    if (form.valid) {
      
      form.value.storesAttributes.map(data => {
        const objectKey = Object.keys(data)[0];
        const objectValue = Object.values(data)[0];
        const tempIndex = this.dateFields.indexOf(objectKey);
        if (tempIndex > -1 && objectValue) {
          data[objectKey] = moment(data[objectKey]).format('YYYY-MM-DD');
          return data;
        } else {
          return data;
        }
      });
      form.value.storeCustomAttributes.map(data => {
        const objectKey = Object.keys(data)[0];
        const objectValue = Object.values(data)[0];
        const tempIndex = this.dateFields.indexOf(objectKey);
        if (tempIndex > -1 && objectValue) {
          data[objectKey] = moment(data[objectKey]).format('YYYY-MM-DD');
          return data;
        } else {
          return data;
        }
      });
      const params = {
        store_data: form.value.storesAttributes,
        contacts: form.value.contacts,
        shipAddress:form.value.shipAddress,
        billAddress:form.value.billAddress,
        id: 0,
        bill_ship:this.bill_ship
      };
      form.value.storeCustomAttributes.map(val => {
        params.store_data.push(val);
      });
      this.service.saveOrgStore(params).then(res => {
        if (res.result.success) {
          if (res.result.data.status === false) {
            this.btnDisable = false;
            this.submittedStoresAttributeForm = true;
            this.serverError = res.result.data.message ? res.result.data.message : 'Something went wrong';
            toast = { msg: this.serverError, status: 'error' };
            this.snackbar.showSnackBar(toast);
            this.dialogRef.close();
          } else {
            this.serverError = '';
            this.submittedStoresAttributeForm = false;
            toast = { msg: 'Lead Added Successfully.', status: 'success' };
            this.snackbar.showSnackBar(toast);
            this.dialogRef.close();
            this.router.navigate(['/leads/details/'+ res.result.data.id])
          }
        } else {
          this.btnDisable = false;
          this.submittedStoresAttributeForm = true;
          this.serverError = res.result.data ? res.result.data : 'Something went wrong';
          toast = { msg: this.serverError, status: 'error' };
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close();
        }
      });
    } else {
    }
  }

  getContactList(e?,i?:any) {
    clearTimeout(this.timeOutRef);
    this.contactSearchSpinner = true;
    this.timeOutRef = setTimeout(() => { console.log(e)
      // if(!e?.target?.value){
      //   console.log(i)
      //   this.contactsForm.controls[i].patchValue({
      //     contact_details: "",
      //     contact_name:"",
      //     email: "",
      //     contact_id: ""
      //    })
      // }
      let body = {search : e? e.target.value : ''};
      this.service.getLeadContacts(body).then(response => {
        if (response.result.success) {
          this.contactList.next(response.result.data);
        } else {
          this.contactList.next([])
        }
        this.contactSearchSpinner = false;
      });
    }, 1000);
  }

  contactSelected(e,i){
    this.contactsForm.controls[i].patchValue({
     contact_details: e.option.value.primary_phone,
     contact_name: e.option.value.name,
     email: e.option.value.email,
     contact_id: e.option.value.id
    })
   
  }
  updateCheckedShip(event,billData) {
    console.log(event,billData.value)
    this.shipData =billData.value[0]
    console.log(this.shipData.address_1)
    if(event.checked){
      this.bill_ship =true
      this.shipAddress.controls[0].patchValue({
        address_1: this.shipData?.address_1,
        address_2: this.shipData?.address_2,
        city: this.shipData?.city,
        country_id: this.shipData?.country_id,
        state_province_id:this.shipData?.state_province_id,
        postal_code:this.shipData?.postal_code
      });
    }else{
      this.bill_ship =false
      this.shipAddress.controls[0].patchValue({
        address_1: '',
        address_2: '',
        city: '',
        country_id: '',
        state_province_id: '',
        postal_code:''
      });
    }
  }
  cancel() {
    this.dialogRef.close();
  }

  filterOpts(options, control, i) {
    if (control) {
      const search_text = control.value;
      const res = options.filter(opt => {
        return !search_text || opt.label.toLowerCase().startsWith(search_text);
      });
      return res;
    }
  }

  displayView(labelValue?: any): string | undefined {
    return labelValue ? labelValue.label : undefined;
  }

  allowOnlyNum(evt, i, value): boolean {
    const charCode = (evt.which) ? evt.which : evt.keyCode;
    //allowing backspace
    if (charCode == 8) {
      return true;
    }

    if (this.storesCustomAttributesData[i].selected_value && this.storesCustomAttributesData[i].selected_value.length > 0) {
      let l = parseInt(this.storesCustomAttributesData[i].selected_value);
      if (evt.srcElement.value && evt.srcElement.value.split(".")[1] && evt.srcElement.value.split(".")[1].length > l - 1) {
        return false;
      }
    }
    //allowing dot(.)
    if (charCode == 110 || charCode == 190) {
      if (this.storesAttributeForm.controls.storeCustomAttributes['controls'][i].value[value].indexOf('.') === -1) {
        return true;
      } else {
        return false;
      }
    }
    if (charCode >= 96 && charCode < 107) {
      return true;
    } else if (charCode > 96 && charCode < 107) {
      return true;
    }
    else if (evt.shiftKey || (charCode > 31 && (charCode < 48 || charCode > 57))) {
      return false;
    }
    return true;
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true }
  }
 
}
