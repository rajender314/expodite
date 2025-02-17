import { Component, OnInit ,Inject } from '@angular/core';
import {AccountsService}from '../../services/accounts.service'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-receive-amount',
  templateUrl: './receive-amount.component.html',
  styleUrls: ['./receive-amount.component.scss']
})
export class ReceiveAmountComponent implements OnInit {

  constructor(private AccountsService:AccountsService,public dialogRef: MatDialogRef<ReceiveAmountComponent>, private fb: FormBuilder,private snackbar: SnakbarService,
    @Inject(MAT_DIALOG_DATA) public data:MatDialog) { }
    instructionForm: FormGroup;
    public showTotal=false;
    public showReceived=false
    public  prevTotal:any
    public  editNmae:any
    public prevRecive:any
    showerror =false
    showerror1 =false
    public invNum : any 
  ngOnInit(): void {
    this.disabledSave = false;
    this.createForm();
		this.setForm();
    this.invNum = this.data['inv_nbr']  
    this.prevTotal = this.data['remaining_amount'] 
    this.prevRecive = this.data['received_amount'] 
    this.instructionForm.patchValue({
			recieved_amount: '',
      toal_amount:this.data['total_receivable_amount'] 
		})
    console.log(this.prevRecive)
    if(this.data['type'] == 1){
      this.showTotal =true
      this.editNmae= "Edit Total Receivable Amount"
    }else if(this.data['type'] == 2){
      this.showReceived =true
      this.editNmae= " Add Received Amount"
    }
  }
  quantError = false;
  changeProductPrice(data: any,event:any): void {
    
    let s =event.target.value;
    // console.log(this.prevTotal)

    if(this.prevTotal && s >  this.prevTotal){
      this.quantError =true;
      this.showerror1 = false;
      
    }else{
      this.quantError =false;
    }
    

    if(s == '') {
      this.showerror1 = true;

    } else {
      this.showerror1 = false;

    }

    
    // console.log(data.quant_limit,event.target.value)
  }

  changeTotAmount(e) {
    console.log(e)
        
    if(e.target.value != '') {
      this.showerror = false;  
    } else {
      this.showerror = true;
    }
  }

  onKeyUp(event) {
    // console.log(event)
    var inputKeyCode = event.keyCode ? event.keyCode : event.which;

        if (inputKeyCode != null) {
            if (inputKeyCode == 45 || inputKeyCode == 43 || inputKeyCode == 46) event.preventDefault();
        }

        
        
      }

      onKeyDown(event) {
        if ([69, 187, 188, 189, 190].includes(event.keyCode)) {
          event.preventDefault();
        }
      }
  createForm():void {
		this.instructionForm = this.fb.group({
			recieved_amount:[null, [Validators.required, ]],
      toal_amount:[null, [Validators.required, ]],
		})
	}
	setForm() {
		
  }
  public disabledSave = false;
  updateAmounts(form:any):void{
		let toast: object;
var ids =this.data
let paramdata:any
// if(form.valid){
  paramdata = Object.assign({},{});
	
  paramdata.id =  this.data['id']
  if(this.showTotal){
 paramdata.total_receivable_amount =form.controls.toal_amount.value?form.controls.toal_amount.value:''
  }else  if(this.showReceived){
   paramdata.received_amount =form.controls.recieved_amount.value?form.controls.recieved_amount.value:''
 
  }
  if((!paramdata.total_receivable_amount) ){
    this.showerror =true
  }else{
    this.showerror =false
  }
  if((!paramdata.received_amount) ){
    this.showerror1=true
  }else{
    this.showerror1 =false
  }
  console.log(this.showerror1, this.quantError)
  if(this.quantError) {
    return;
  }
  this.disabledSave = true;
  if( paramdata.total_receivable_amount||paramdata.received_amount ){
    console.log(this.data)
     this.AccountsService
     .updateAmounts(paramdata)
         .then(response => {
           if (response.result.success) {
            
             
             toast = { msg: "Amount  updated successfully.", status: "success" };
             this.dialogRef.close({success: true, response:response.result.data});
              this.snackbar.showSnackBar(toast);
              this.quantError = false;
              this.showerror1 = false;
         }
         
          
       
         
      })

 }}
    }
