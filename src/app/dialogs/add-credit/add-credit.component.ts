import { Component, OnInit, Inject } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {AccountsService}from '../../services/accounts.service'; 
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnakbarService } from '../../services/snakbar.service';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrls: ['./add-credit.component.scss']
})
export class AddCreditComponent implements OnInit {
  public clientList = []
  public showError =false;
  public errormessage  :any
  public showErrorinv = false;
  public errormessageinv :any
  public showErrorref = false;
  public errormessageref :any;
  public disabledSave = false;
  minDate = new Date();
  public invoiceList =[]
  public modelData: any = {};
  public modelData1: any = {};
  public modelData2: any = {};
  public isEditScreen = false;
  detailsForm: FormGroup;
  searchCtrl = new FormControl();
  clientRead =false
  public Types = [{id: 1, name: 'Admin'},{id: 2, name: 'Client'},  {id: 4, name: 'Lead'}, {id: 3, name: 'Vendor'}];
  private param: any = {
    page: 1,
    perPage: 25,
    sort: 'ASC',
    clientSearch: '',
    flag: 1
  }
  constructor( private AccountsService:AccountsService,private formBuilder: FormBuilder, private dialogRef: MatDialogRef<AddCreditComponent>,@Inject(MAT_DIALOG_DATA) private data: any,
  private snackbar: SnakbarService) { }

  ngOnInit(): void {
    this.generateDetailsForm();
    
    
    console.log( this.data) 
    if(this.data.type ==1){
      this.setForm(this.data)
      this.isEditScreen = true;
      this.clientRead =true
     // this.detailsForm.patchValue(this.data)
     this.param.clientSearch =this.data['client']
     this.param.invSearch =''
    
    }
//
    
    this.getOrganizations(this.param)
  }

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  generateDetailsForm(): void {
		this.detailsForm = this.formBuilder.group({
credit_note_date: [null, [Validators.required, ]],
			organization_id: [null, [Validators.required, ]],
			amount: [null, [Validators.required, ]],
      currency:[null],
			orig_inv_id:[null],
      ref_inv_id:[null],
			narration :[null]
		});
    // this.detailsForm  = new FormBuilder().group({
    //   credit_note_date: new FormControl(null, [Validators.required,]),
    //   organization_id: new FormControl(null, [Validators.required,]),
    //   amount: new FormControl(null, [Validators.required]),
    //   orig_inv_id: [null],
    //   narration: [null],
    //   entity_ide: this.data.leadId
    // });
	}
  displayFn(user: any): string {
    return user && user.inv_nbr ? user.inv_nbr : "";
  }

  onKeyDown(event) {
    if ([69, 187, 188, 189, 190].includes(event.keyCode)) {
      event.preventDefault();
    }
  }
  setForm(data:any): void {
    console.log(data)
    let dateVal = moment(data['credit_note_date']).format('YYYY-MM-DD');
		this.detailsForm.patchValue({
      credit_note_date: dateVal,
      organization_id:data['client'],
			amount: data['amount'],
      orig_inv_id: data['orig_inv'],
      ref_inv_id:data['ref_inv'],
       narration:data['narration'],
       currency:data['currency_name'],
		})
	}
  getOrganizations(param: object) {
    this.AccountsService
      .NotesDrpDwn(param)
      .then(res => {
        if (res.result.success) {
          this.clientList = res.result.data.clients;
          this.invoiceList = res.result.data.invoices[this.data['organization_id']];
        }
      });
    
  }
  
  selectedClients(event:any) {
    console.log(event)
    this.param.clientSearch = event.target.value;
    this.AccountsService.NotesDrpDwn(this.param).then(res => {
      if (res.result.success) {
        this.clientList = res.result.data.clients;
        this.showError = false;

        this.detailsForm.patchValue({
          currency: ''
       })
        
      }
      if(!res.result.data.clients?.length) {
          
          this.showError = true;
         // this.showErrorinv =true
          //this.showErrorref = true;
          this.errormessage = 'No Client Data Found';
        }
    });
  }
  public invlist:any
  public curName:any;
  public clientSelectedId;
  selectionChange(data) {
    console.log(data)

    let i = _.findIndex(<any>this.clientList, {
      client_name: data.client_name
    });

    if(i > -1) {
      // console.log(this.order.organizations[i].id)
      this.clientSelectedId = this.clientList[i].client_id;
    }
  
   this.modelData.id = data.client_id;
   this.modelData.name = data.client_name;
   this.param.clientSearch = data.client_name
   this.param.org_id = this.clientSelectedId;
  this.AccountsService.NotesDrpDwn(this.param).then(res => {
    if (res.result.success) {
      this.clientList = res.result.data.clients;
     this.invoiceList = res.result.data.invoices?res.result.data.invoices[this.modelData.id]:[];
     console.log(this.invoiceList)
     this.showErrorinv =false
      this.showErrorref = false;
      this.curName =  this.clientList[0].currency
    	this.detailsForm.patchValue({
         currency:this.clientList[0].currency
      })
     if(!this.invoiceList?.length){
      this.showErrorinv =true
      this.showErrorref = true;
     }
    }
  });
   this.searchCtrl.setValue(data.client_name);

   
 }
  
  selectedInvoices(event:any){
    console.log(this.data['organization_id'])
    if(this.isEditScreen){
      this.param.clientSearch =this.detailsForm.controls.organization_id.value
      this.modelData.id = this.data?this.data['organization_id']:this.modelData.id

    }
    this.param.invSearch = event.target.value;
    this.AccountsService.NotesDrpDwn(this.param).then(res => {
      if (res.result.success) {
        this.invoiceList = res.result.data.invoices?res.result.data.invoices[this.modelData.id]:[]
        this.showErrorinv = false;
        if(!this.invoiceList?.length) {
        console.log(this.invoiceList,"iam invoice")
          
          this.showErrorinv = true;
          this.errormessageinv =  'No invoice Data Found';
        }
      }
     
    });
  }
  public orig_invoiceId;
  selectionChange1(data) {
    console.log(data)

    let i = _.findIndex(<any>this.invoiceList, {
      inv_nbr: data.inv_nbr
    });

    if(i > -1) {
      // console.log(this.order.organizations[i].id)
      this.orig_invoiceId = this.invoiceList[i].invoice_id;
    }
    console.log(this.orig_invoiceId)

   this.modelData1.id = data.invoice_id;
   this.modelData1.name = data.inv_nbr;
   this.param.invSearch  = ''
  this.AccountsService.NotesDrpDwn(this.param).then(res => {
    if (res.result.success) {
      this.invoiceList = res.result.data.invoices?res.result.data.invoices[this.modelData.id]:[]
      console.log(this.invoiceList)
    }
  });
   this.searchCtrl.setValue(data.inv_nbr);

}
selectedRef(event:any){
  console.log(this.data['organization_id'])
  if(this.isEditScreen){
    this.param.clientSearch =this.detailsForm.controls.organization_id.value
    this.modelData.id = this.data?this.data['organization_id']:this.modelData.id

  }
  this.param.invSearch = event.target.value;
  this.AccountsService.NotesDrpDwn(this.param).then(res => {
    if (res.result.success) {
      this.invoiceList = res.result.data.invoices?res.result.data.invoices[this.modelData.id]:[]
      this.showErrorref  = false
      if(!this.invoiceList?.length) {
        console.log(this.invoiceList,"iam invoice  Ref")
        this.showErrorref = true;
        this.errormessageref  =  'No invoice Data Found';
      }
    }
   
  });
}
public ref_invoiceId;
selectionChange2(data) {
  console.log(data)


  let i = _.findIndex(<any>this.invoiceList, {
    inv_nbr: data.inv_nbr
  });

  if(i > -1) {
    // console.log(this.order.organizations[i].id)
    this.ref_invoiceId = this.invoiceList[i].invoice_id;
  }
  console.log(this.ref_invoiceId)

 this.modelData2.id = data.invoice_id;
 this.modelData2.name = data.inv_nbr;
 this.param.invSearch  = data.inv_nbr
this.AccountsService.NotesDrpDwn(this.param).then(res => {
  if (res.result.success) {
    this.invoiceList = res.result.data.invoices?res.result.data.invoices[this.modelData.id]:[]
    console.log(this.invoiceList)
  }
});
 this.searchCtrl.setValue(data.inv_nbr);

}


onKeyUp(event) {
  // console.log(event)
  var inputKeyCode = event.keyCode ? event.keyCode : event.which;

      if (inputKeyCode != null) {
          if (inputKeyCode == 45 || inputKeyCode == 43 ) event.preventDefault();
      }

      if(!event.target.value.length && inputKeyCode == 32) {
        event.preventDefault();
      }
      
    }
    saveCredit(form:any){
      form.get('credit_note_date').markAsTouched({ onlySelf: true });
    form.get('organization_id').markAsTouched({ onlySelf: true });
    form.get('amount').markAsTouched({ onlySelf: true });
    form.get('currency').markAsTouched({ onlySelf: true });
    let dateVal = moment(form.value. credit_note_date).format('YYYY-MM-DD');
    console.log(form.value.organization_id)
    const formdata = _.cloneDeep(form.value);
    const body = {
      id: this.data['id'] ? this.data['id'] : '',
      ...formdata 
    } 
    // console.log(body)
    // return
    body.orig_inv_id = this.orig_invoiceId;
    body.ref_inv_id = this.ref_invoiceId;
    body.credit_note_date = dateVal;
    // console.log(this.clientSelectedId)
    body.organization_id = this.clientSelectedId;

    let i = _.findIndex(<any>this.clientList, {
      client_name: form.value.organization_id
    });
    console.log(i)
    if(form.value.organization_id.length && i ==-1) {
      this.showError = true;
      this.errormessage = 'No Client Data Found';


      return;
    } else {
      this.showError = false;
      this.errormessage = '';


    }

    if(!form.valid || !this.clientSelectedId){
      return false
    }
    if(this.isEditScreen){
      body.organization_id =this.data['organization_id']
      body.orig_inv_id =this.modelData1.id?this.modelData1.id:this.data['orig_inv_id']
      body.ref_inv_id =this.modelData2.id?this.modelData2.id:this.data['ref_inv_id']
    }
    
    console.log(body)
    this.disabledSave = true;

    this.AccountsService.saveCreditNote(body).then(res => {
      if (res.result.success) {
        let message = body.id == 0 ? 'Credit  Note Added Successfully.' : 'Credit  Note updated successfully.';
        this.snackbar.showSnackBar({ msg: message, status: 'success' });
        this.dialogRef.close({response:res.result.data});
      } else {
        let serverError = res.result.data.message ? res.result.data.message : 'Something went wrong';
        this.snackbar.showSnackBar({ msg: serverError, status: 'success' });
      }
    });
      console.log(form.value)

    }
}
