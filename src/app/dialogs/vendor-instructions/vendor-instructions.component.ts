import { Component, OnInit, Inject,Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Param } from './../../custom-format/param';
import { OrganizationsService } from '../../services/organizations.service';
import { SnakbarService } from '../../services/snakbar.service';
@Component({
  selector: 'app-vendor-instructions',
  templateUrl: './vendor-instructions.component.html',
  styleUrls: ['./vendor-instructions.component.scss']
})

export class VendorInstructionsComponent implements OnInit {
	@Input() Contacts;
	constructor(private OrganizationsService: OrganizationsService,
		private snackbar: SnakbarService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }

	instructionForm: FormGroup;

	ngOnInit() {
		this.createForm();
		this.setForm();
	}

	createForm():void {
		this.instructionForm = this.fb.group({
			name: '',
		})
	}
	setForm() {
		this.instructionForm.patchValue({
			name: this.data.name,
		})
	}
	add(form:any) {
		let toast: object;
		let data = Object.assign({}, form.value);
		data.org_id = ((this.data && this.data.org_id)?this.data.org_id:0);
		data.id =  ((this.data && this.data.id)?this.data.id:0);
		// data.id = this.data.id;
		 console.log((this.data && this.data.id)?this.data.id:0)
		this.OrganizationsService
			.getaddOrgSpclIns(data)
			.then(response => {
				if (response.result.success) {
					this.Contacts = response.result.data;
					if (data.id) 
					toast = { msg: "Special Instructions updated successfully.", status: "success" };
					else toast = { msg: "Special Instructions saved successfully.", status: "success" };
          			this.dialogRef.close({success: true, response:response.result.data});
				} else {
					toast = { msg: response.result.message, status: "error" };
					this.dialogRef.close(); 
				}
				this.snackbar.showSnackBar(toast);
			})
			.catch(error => console.log(error))
	}
}
