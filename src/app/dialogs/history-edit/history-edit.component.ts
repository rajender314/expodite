import { Component, OnInit ,Inject } from '@angular/core';
import {AccountsService}from '../../services/accounts.service'; 
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { SnakbarService } from '../../services/snakbar.service';
@Component({
  selector: 'app-history-edit',
  templateUrl: './history-edit.component.html',
  styleUrls: ['./history-edit.component.css']
})

export class HistoryEditComponent implements OnInit {

  constructor(private AccountsService:AccountsService,public dialogRef: MatDialogRef<HistoryEditComponent>, private fb: FormBuilder,private snackbar: SnakbarService,
    @Inject(MAT_DIALOG_DATA) public data:MatDialog) { }
    instructionForm: FormGroup;
    public showTotal=false;
    public showReceived=false
    public  prevTotal:any
    public  editNmae:any
    public ReciveLimit:any
  ngOnInit(): void {
   
    console.log(this.data['received_amount'])
    this.createForm();
		this.setForm();
    this.ReciveLimit = this.data['receiving_limit'] 
    
    console.log(this.ReciveLimit)
    
    if(this.data['type'] == 1){
      this.showTotal =true
      this.editNmae= "Edit Total Receivable Amount"
    }else if(this.data['type'] == 2){
      this.showReceived =true
      this.editNmae= " Add Received Amount"
    }
  }
  quantError = false;
  public receivedVal;
  changeProductPrice(event) {
    console.log(this.ReciveLimit)

    let s =event.target.value;
    this.receivedVal = event.target.value;
    console.log(s)

    // if(s ==''){
    //   this.quantError =true
    // }else{
    //   this.quantError =false

    // }

    if(s > this.ReciveLimit) {
      this.quantError =true;

    } else {
      this.quantError =false;

    }
    console.log(this.quantError)

    
  }

  onKeyDown(event) {
    console.log(this.ReciveLimit)
    let s =event.target.value;
    this.receivedVal = event.target.value;
    console.log(s)


    if ([69, 187, 188, 189, 190].includes(event.keyCode)) {
      event.preventDefault();
    }
    if(s > this.ReciveLimit) {
      this.quantError =true;

    } else {
      this.quantError =false;

    } 
  }
  createForm():void {
		this.instructionForm = this.fb.group({
			recieved_amount:[null, [Validators.required, Validators.min(1) ]],
      
		})
	}
	setForm() {
    this.instructionForm.patchValue({
			recieved_amount:this.data['received_amount'] ,
      
		})
	}
  updateAmounts(form:any):void{
		let toast: object;
var ids =this.data
let paramdata:any
 paramdata = Object.assign({},{});
	
 paramdata.id =  this.data['id']

  paramdata.received_amount =form.controls.recieved_amount.value?form.controls.recieved_amount.value:this.data['received_amount']
    if(this.receivedVal > this.ReciveLimit) {
      this.quantError = true;
    } else {
      this.quantError = false;
    }
 
  if(!form.valid || this.quantError){
    return
  }
    this.AccountsService
    .updateHistAmount(paramdata)
        .then(response => {
          if (response.result.success) {
           
            
            toast = { msg: "Amount updated successfully.", status: "success" };
            this.dialogRef.close({success: true, response:response.result.data});
             this.snackbar.showSnackBar(toast);
        }
        
         
      
        
	   })}
    }
