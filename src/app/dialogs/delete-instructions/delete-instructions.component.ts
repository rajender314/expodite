import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as _ from 'lodash';
import { OrganizationsService } from '../../services/organizations.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SnakbarService } from './../../services/snakbar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
// import { OrganizationsContactsComponent } from './../../client-module/organizations/organizations-contacts/organizations-contacts.component';
import { OrganizationsContactsComponent } from './../../admin-module/organizations/organizations-contacts/organizations-contacts.component';

@Component({
  selector: 'app-delete-instructions',
  templateUrl: './delete-instructions.component.html',
  styleUrls: ['./delete-instructions.component.scss']
})
export class DeleteInstructionsComponent implements OnInit {

  constructor(
    private organizationsService: OrganizationsService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrganizationsContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }

  ngOnInit() {
  }
  deleteInstruction(): void {
    this.dialogRef.close({ success: true });
  }

}
