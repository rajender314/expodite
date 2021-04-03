import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LeadsService } from '../leads.service';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { SnakbarService } from '../../services/snakbar.service';
import * as moment from 'moment';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Images } from '../../images/images.module';
import { MyErrorStateMatcher } from '../lead.interface';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { OrganizationsService } from '../../services/organizations.service';
declare var App: any;
@Component({
  selector: 'app-lead-overview',
  templateUrl: './lead-overview.component.html',
  styleUrls: ['./lead-overview.component.scss']
})
export class LeadOverviewComponent implements OnInit {
  @Input() name: string;
//  @Output() messageEvent = new EventEmitter<boolean>();
   
 @Output() public messageEvent =  
 new EventEmitter<{name:boolean, age:boolean}>(); 


 mes:string = 'mySecond'
  matcher = new MyErrorStateMatcher();
  public images = Images;
  storesAttributesData = [];
  storesCustomAttributesData = [];
  overViewData: any;
  overViewDataShip:any; 
  QuotesData:any;
  dateFields = [];
  showQuote =false;
  storesAttributeForm: FormGroup;
  submittedStoresAttributeForm = false;
  btnDisable = false;
  serverError;
  isEdit = false;
  public rowData = [];
  columnDefs = [];
  gridApi: any;
  contactList = new Subject<any>();
  contactListRef = [];
  contactSearchSpinner = false;
  timeOutRef:any;
  submitCountry = false;
  submitState = false;
  countriesStates: any;
  countries: any;
  states: any[];
  statesBill: any[];
  overViewDataBill:any
  deleteEnable =false
  constructor(private service: LeadsService, private fb: FormBuilder,
    private snackbar: SnakbarService,
    private dialog: MatDialog,private route: Router ,private organizationsService: OrganizationsService) {
    ;
    let isFirstTime = true
    this.service.getDetailsData().subscribe(res => {
      if (res) {
        if (res['reloadAppointment']) {
          this.getAppointmentList();
        } else {
          this.overViewData = res;
          if (isFirstTime) {
            this.getOrgStoreAttribute();
            isFirstTime = false;
          }
          this.getAppointmentList();
          this.getQuotesList();
         
          if (this.overViewData && this.overViewData.contacts) {
            this.contactsForm.setValue([]);
            this.overViewData.contacts.map(each => {
              
              this.contactsForm.push(this.fb.group({
                ...each
                
              }))
            });
           
          }
         
        }
      }
    })
  }
  urApi = App.api_url
  public ur =this.urApi
  ngOnInit(): void {
    this.storesAttributeForm = this.fb.group({
      storesAttributes: this.fb.array([]),
      storeCustomAttributes: this.fb.array([]),
      contacts: this.fb.array([]),
      shipAddress:this.fb.array([]),
      billAddress:this.fb.array([]),
    });
    this.columnDefs = this.getColumns();
    this.getContactList();
    this.getOrganizationDetails();
   // console.log(this.messageEvent)
   

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
           this.createShipControls();
           this.createBillControls();
          
        }
      })
  }
  onCountryChange(data?: any, stateId?: any): void {
    console.log(this.storesAttributeForm.value.shipAddress[0].country_id,stateId,this.storesAttributeForm.value.shipAddress)
    if (this.storesAttributeForm.value.shipAddress[0].country_id) {
      this.submitCountry = false;
      this.states = this.countriesStates ? this.countriesStates[this.storesAttributeForm.value.shipAddress[0].country_id] : [];
      this.shipAddress.controls[0].patchValue({
        state_province_id: stateId ? stateId : this.states ? this.states[0].id : ''
      });
      console.log(this.states)
     
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
  getOrgStoreAttribute(cb?): void {
    this.service
      .getOrgStoreAttributeList({ id: this.overViewData['id'] })
      .then(response => {
        if (response.result.success) {
          this.storesAttributesData = response.result.data.attributes.base_attributes;
          this.storesCustomAttributesData = response.result.data.attributes.custom_attributes;
          if (cb) {
             this.setForm(this.storesAttributesData, this.storesCustomAttributesData);
             
          } else {
            this.createAttributeControls();
            
          }

        }
      })
      .catch(error => console.log(error))
  }

  get storesAttributes() {
    return this.storesAttributeForm.get('storesAttributes') as FormArray;
  }

  get storesCustomAttributes() {
    return this.storesAttributeForm.get('storeCustomAttributes') as FormArray;
  }

  get contactsForm() {
    console.log( this.storesAttributeForm.get('contacts'))
    
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
      email: [null, [ Validators.required, Validators.pattern(
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      )]]
    }))
  }

  deleteContact(data, i) { console.log(data,i)
     if(data && data['id']) {
       this.deleteEnable =true
      const params = {
        entity_id: this.overViewData.id,
        id: data.id
      };
      this.service.deleteContact(params).then(res => {
        if (res.result.success) {
          const toast = { msg: res.result.data.message ? res.result.data.message : 'Contact Deleted Successfully', status: 'success' };
          this.snackbar.showSnackBar(toast);
          this.contactsForm.removeAt(i);
        } else {
          const toast = { msg: res.result.data.message ? res.result.data.message : 'Something went wrong', status: 'error' };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
     this.contactsForm.removeAt(i);
    }
  }
  createAttributeControls() {
    this.storesAttributesData.map(attr => {
      this.storesAttributes.push(this.createAttributeGroup(attr));
    });
    this.storesCustomAttributesData.map(attr => {
      this.storesCustomAttributes.push(this.createAttributeGroup(attr));
    });
  }
  

  createAttributeGroup(data) {
    if (data.key === 'single_line_text' || data.key === 'paragraph_text') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            '',
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100),
              this.noWhitespaceValidator
            ]
          ]
          : ''
      });
    } else if (data.key === 'auto_suggest') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            '',
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100)
            ]
          ]
          : ''
      });
    } else if (data.key === 'number') {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? [
            '' ,
            [
              Validators.required,
              Validators.maxLength(data.label_element_data_length ? data.label_element_data_length : 100),
              this.noWhitespaceValidator
            ]
          ]
          : ''
      });
    } else if (data.key === 'date_field') {
      this.dateFields.push(data.store_unique_label_key);
      return this.fb.group({
        [data.store_unique_label_key]: data.required ? [ '', [Validators.required]] : ''
        // [data.store_unique_label_key]: data.required ? [moment(), [Validators.required]] : ''
        // moment(this.modelData.end_date).format("MMM Do, YYYY")
      });
    } else {
      return this.fb.group({
        [data.store_unique_label_key]: data.required
          ? ['' , Validators.required]
          : ''
      });
    }
  }
  createBillControls(){
    this.overViewDataBill =this.overViewData?.billAddress[0]
    console.log(this.overViewDataBill,this.overViewData)
    this.billAddress.push(this.fb.group({
      address_1: [ this.overViewDataBill?.address_1, [ Validators.required]],
      address_2: [this.overViewDataBill?.address_2],
      city: [this.overViewDataBill?.city, [ Validators.required]],
      country_id: [this.overViewDataBill?.country_id, [ Validators.required]],
      state_province_id: [this.overViewDataBill?.state_province_id, [ Validators.required]],
      postal_code:[this.overViewDataBill?.postal_code, [ Validators.required]],
      id:this.overViewDataBill?.id
    }));
  }
  createShipControls(){
  
    this.overViewDataShip =this.overViewData?.shipAddress[0]
    console.log(this.overViewDataShip,this.overViewData)
    this.shipAddress.push(this.fb.group({
      address_1: [this.overViewDataShip?.address_1],
      address_2: [this.overViewDataShip?.address_2],
      city: [this.overViewDataShip?.city],
      country_id: [this.overViewDataShip?.country_id],
      state_province_id: [this.overViewDataShip?.state_province_id],
      postal_code:[this.overViewDataShip?.postal_code],
      id:this.overViewDataShip?.id
    }));
  }
  saveAttributes(form): void {
    console.log(form.valid)
    this.storesAttributeForm.markAsPristine();
    this.btnDisable = true;
    let toast: object;
    this.messageEvent.emit({name:false,age:false})

    this.submittedStoresAttributeForm = true;
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
    if (form.valid) {
      const params = {
        store_data: form.value.storesAttributes,
        id: this.overViewData['id'],
        contacts: form.value.contacts,
        billAddress:form.value.billAddress,
        shipAddress:form.value.shipAddress,

      };
      form.value.storeCustomAttributes.map(val => {
        params.store_data.push(val);
      });
      //console.log(params);
      this.service.saveOrgStore(params).then(res => {
        if (res.result.success) {
          if (res.result.data.status === false) {
            this.btnDisable = false;
            this.submittedStoresAttributeForm = true;
            this.serverError = res.result.data.message ? res.result.data.message : 'Something went wrong';
            toast = { msg: this.serverError, status: 'error' };
            this.snackbar.showSnackBar(toast);
          } else {
            this.serverError = '';
            this.submittedStoresAttributeForm = false;
            toast = { msg: 'Lead Updated Successfully.', status: 'success' };
            this.snackbar.showSnackBar(toast);
            this.getDetailView(this.overViewData['id']);
            this.getOrgStoreAttribute(true);
            this.isEdit = false;
          }
        } else {
          this.btnDisable = false;
          this.submittedStoresAttributeForm = true;
          this.serverError = res.result.data.message ? res.result.data.message : 'Something went wrong';
          toast = { msg: this.serverError, status: 'error' };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
    }
  }

  getDetailView(param): void {
    this.service
      .getDetailView(param)
      .then(response => {
        if (response.result.success) {
          this.overViewData = response.result.data.data[0];
          this.service.postDetailsData(this.overViewData);
          
        }
        else;
      })
      .catch(error => console.log(error))
  }
  
  
  cancel() {
    this.isEdit = false;
    this.messageEvent.emit({name:false,age:false})
    
      

  }
  sendMessage(){
    //console.log(1)
    
  }
  onEdit() {
    this.isEdit = true;
    this.setForm(this.storesAttributesData, this.storesCustomAttributesData);
    this.storesAttributeForm.markAsPristine();
  // this.createBillControls();
   // this.createShipControls();
   // console.log(this.storesAttributeForm)
    this.messageEvent.emit({name:this.isEdit,age:false})
  }

  viewDateFormat(val){
    if(val['attr_value']){
    let v = val['attr_value'].split('/');
    let value = new Date(v);
    //console.log(value,v,v[2],v[1]- 1, v[0])
    return moment(value).format('MMM Do,YYYY')
    }
    return '--';
  }
  setForm(attributes: any, customAttributes?: any): void {
    const tempArray = attributes;
    
    const levels = [];
    const customLevels = [];
    const tempCustomAttrArray = customAttributes;
    tempArray.map(val => {
      if (val.key === 'date_field') { 
        let value = null;
        if(val['attr_value']){
          let v = val['attr_value'].split('/');
         // value = new Date(v[2],v[1]- 1, v[0]);
         value = new Date(v);
        }
        levels.push({
          [val.store_unique_label_key]: value
        });
      } else {
        levels.push({ [val.store_unique_label_key]: val['attr_value'] });
      }
    });
    tempCustomAttrArray.map(val => {
      if (val.key === 'date_field') {
      let value = null;
        if(val['attr_value']){
          let v = val['attr_value'].split('/');
         // value = new Date(v[2],v[1]- 1, v[0]);
         value = new Date(v);
        }
        customLevels.push({
          [val.store_unique_label_key]: value
        });
      } else if (val.key === 'auto_suggest') {
        customLevels.push({ [val.store_unique_label_key]: val['attr_value'] });
      } else {
        customLevels.push({ [val.store_unique_label_key]: val['attr_value'] });
      }
    });

    this.storesAttributeForm.patchValue({
      storesAttributes: levels,
      storeCustomAttributes: customLevels
    });
    
    console.log(this.storesAttributeForm)
  }

  onGridReady(e) {
    this.gridApi = e.api;
    this.gridApi.sizeColumnsToFit();
  }

  onRowClicked(p) {
    if (p.data) {
      // this.route.navigate(['leads/details/' + p.data.id]);
    }
  }

  getAppointmentList() {
    this.service.getAppointmentList(this.overViewData.id).then(res => {
      if (res.result.success) {
        this.rowData = res.result.data;
      }
    })
  }
  getQuotesList() {
    this.service.getQuotesList(this.overViewData.id).then(res => {
      if (res.result.success) {
        this.QuotesData = res.result.data;
        console.log(this.QuotesData)
      }
    })
  }


  openAppointment(data = {}) {
    console.log(data)
    let dialogRef = this.dialog.open(AppointmentDialogComponent, {
      panelClass: 'alert-dialog',
      width: '500px',
      data: {
        leadId: this.overViewData.id,
        ...data
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getAppointmentList();
      }
    });
  }

  getColumns() {
    return [
      {
        headerName: 'Time', field: 'time',maxWidth:390,tooltipField: 'time',
        // cellRenderer: (p) => {
        //   if(p && p.value) {
        //     let list = p.value.split(' ');
        //     console.log(list);
        //     return `
        //         <p style="margin:0">${list[3]} ${list[4]} </p>
        //         <p style="margin:0">${list[0]} ${list[1]} ${list[2]}</p>
        //         `
        //   }else{
        //     return '';
        //   }

        // },
      },
      { headerName: 'Title', field: 'title',maxWidth:390,tooltipField: 'title', },
      { headerName: 'Details', field: 'details',maxWidth:390,tooltipField: 'details' },
      { headerName: 'Assignee', field: 'assignee_name',maxWidth:400, tooltipField: 'assignee_name'},
      {
        headerName: '', field: 'action', maxWidth: 50,
        cellRenderer: () => `<span class="material-icons"  title="Edit" style="color: #075DA8;">
        edit
        </span>`,
        onCellClicked: (p) => this.openAppointment(p.data)
      },
    ]
  }

  filterOpts(options, control, i) {
    // console.log(control.value);
    if (control) {
      const search_text = control.value;
      // console.log(search_text);
      const res = options.filter(opt => {
        return !search_text || opt.label.toLowerCase().startsWith(search_text);
      });
      return res;
    }
  }

  getDisplayName(data){
    let value = '';
    if(data && data.options){
      const obj = _.find(data.options,['value',data['attr_value']]);
      value = obj ? obj.label : ''
    }
    return value;
  }
  getDisplayName1(data){
   // console.log(data)
    let value1 :any;
    if(data && data.options){
      let array1 =  data.options.filter(x => data['attr_value'].includes(x.value));
      const obj = _.find(array1,['value',data['attr_value']]);
      //console.log(data['attr_value'],data.options,array1,obj)
      let data1 =[]
      array1.forEach((res:any,index)=>{
        data1.push(res.label)
      })
      //console.log(data1)
      value1 = array1 ? data1 : ''
    }
    return value1

  }
  displayView(labelValue?: any): string | undefined {
    return labelValue ? labelValue.label : undefined;
  }

  
  getContactList(e?) {
    clearTimeout(this.timeOutRef);
    this.contactSearchSpinner = true;
    this.timeOutRef = setTimeout(() => { console.log(e)
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
  createQuote(){
    this.showQuote =true
    this.messageEvent.emit({name:false,age:true})

    // (this.overViewData.id) {
//this.route.navigate(['leads/details/' + this.overViewData.id]);
    }
   // this.route.navigate(['/messages']);
  //}
}
