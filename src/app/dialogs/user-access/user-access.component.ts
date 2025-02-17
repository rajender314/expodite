import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import * as _ from 'lodash';
import { OrganizationsService } from '../../services/organizations.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SnakbarService } from './../../services/snakbar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
@Component({
	selector: 'app-user-access',
	templateUrl: './user-access.component.html',
	styleUrls: ['./user-access.component.scss'],
	providers: [OrganizationsService]
})
export class UserAccessComponent implements OnInit {
  	@Input() Contacts ;
  	@Output() trigger = new EventEmitter<object>();
	public language = language;
	userForm: FormGroup;
	
	
	constructor(
    	private organizationsService: OrganizationsService,
		public dialog: MatDialog,
		private fb: FormBuilder, 
		private snackbar: SnakbarService,
		public dialogRef: MatDialogRef<UserAccessComponent>,
    	@Inject(MAT_DIALOG_DATA) public data: any
  		) {dialogRef.disableClose = true; }
	  


  ngOnInit() {
    this.generateAddressForm();
  }
  public noWhitespaceValidator(control: FormControl) {
 
	let isWhitespace = (control.value || '').trim().length === 0;
	let isValid = !isWhitespace;
	// [Validators.required , this.noWhitespaceValidator]]
	return isValid ? null : { 'whitespace': true };
}
public noZeroValidator(control: FormControl) {
	//console.log(control.value)
	if(control.value == 0 ){
	  let isWhitespace = true;
	  let isValid = !isWhitespace;
	  return isValid ? null : { 'whitespace': true };
	}
  }
  generateAddressForm(): void {
	if(this.data && this.data.length){
		this.userForm = this.fb.group(this.data);
		}else{
			this.userForm = this.fb.group(this.data);
		}
	   this.userForm = this.fb.group({
		firstname: [this.data.firstname, [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
		email: [this.data.email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
		});
	
  }
  
  addUser(form?:any): void{
	let toast: object;
	this.userForm.get('firstname').markAsTouched({onlySelf : true});
	this.userForm.get('email').markAsTouched({ onlySelf: true});
		if (!form.valid) return;
		let data = Object.assign({}, form.value);
		//data.log_type = 2;
		if(this.data.vendor){
			data.log_type = 3;
			data['type'] = 'vendor';
			data.organization_id = ((this.data && this.data.org_id )?this.data.org_id:0);
			data.org_id = ((this.data && this.data.org_id )?this.data.org_id:0);
		}else{
			data.log_type = 2;
			data['type'] = 'client';
			data.organization_id = ((this.data && this.data.org_id )?this.data.org_id:0);
			data.org_id = ((this.data && this.data.org_id )?this.data.org_id:0);
		}
    	data.status = true;
		
		
    	data.id =  ((this.data && this.data.id)?this.data.id:0);
		this.organizationsService.addSettings(data)
			.then(response => {
				if (response.result.success) {
					this.Contacts = response.result.data;
					form.markAsPristine();
					if (data.id) 
					toast = { msg: "User updated successfully.", status: "success" };
					else toast = { msg: "User saved successfully.", status: "success" };
          			this.dialogRef.close({success: true, response:response.result.data});
				}
				else {
					toast = { msg: response.result.message, status: "error" };
					this.dialogRef.close(); 
					}
					this.snackbar.showSnackBar(toast);
			})
			.catch(error => console.log(error));
  }

}