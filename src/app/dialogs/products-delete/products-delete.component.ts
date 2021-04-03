// import { OrganizationsContactsComponent } from './../../client-module/organizations/organizations-contacts/organizations-contacts.component';
import { Component, OnInit, Inject } from '@angular/core';
import { OrganizationsContactsComponent } from './../../admin-module/organizations/organizations-contacts/organizations-contacts.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
@Component({
  selector: 'app-products-delete',
  templateUrl: './products-delete.component.html',
  styleUrls: ['./products-delete.component.scss']
})
export class ProductsDeleteComponent implements OnInit {

  public language = language;
  constructor(
    public dialogRef: MatDialogRef<OrganizationsContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {dialogRef.disableClose = true; }

  ngOnInit() {
  }
  deleteProducts(): void {
    this.dialogRef.close({success: true});
  }

}