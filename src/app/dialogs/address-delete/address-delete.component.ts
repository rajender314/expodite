import { OrganizationsContactsComponent } from './../../admin-module/organizations/organizations-contacts/organizations-contacts.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
@Component({
  selector: 'app-address-delete',
  templateUrl: './address-delete.component.html',
  styleUrls: ['./address-delete.component.scss']
})
export class AddressDeleteComponent implements OnInit {
  public language = language;
  constructor(
    public dialogRef: MatDialogRef<OrganizationsContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { dialogRef.disableClose = true;}

  ngOnInit() {
  }
  deleteAddress(): void {
    this.dialogRef.close({success: true});
  }

}
