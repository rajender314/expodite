import { Component, OnInit,Input,Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Param } from './../../custom-format/param';
import { OrganizationsService } from '../../services/organizations.service';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-view-instruction',
  templateUrl: './view-instruction.component.html',
  styleUrls: ['./view-instruction.component.scss'],
  providers: [OrganizationsService]
})
export class ViewInstructionComponent implements OnInit {
  @Input() Contacts;
	constructor(private OrganizationsService: OrganizationsService,
		private snackbar: SnakbarService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<any>,
		@Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }
  
instruction:any;
  ngOnInit() {
    this.instruction = this.data;
  }

}
