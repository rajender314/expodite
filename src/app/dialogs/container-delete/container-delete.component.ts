import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { OrganizationsContactsComponent } from './../../client-module/organizations/organizations-contacts/organizations-contacts.component';
import { language } from '../../language/language.module';
import { OrganizationsContactsComponent } from './../../admin-module/organizations/organizations-contacts/organizations-contacts.component';

@Component({
  selector: 'app-container-delete',
  templateUrl: './container-delete.component.html',
  styleUrls: ['./container-delete.component.scss']
})
export class ContainerDeleteComponent implements OnInit {
  public language = language;
  constructor(
    public dialogRef: MatDialogRef<OrganizationsContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {dialogRef.disableClose = true; }

  ngOnInit() {
  }
  deleteContainer(): void {
    this.dialogRef.close({success: true});
  }

}