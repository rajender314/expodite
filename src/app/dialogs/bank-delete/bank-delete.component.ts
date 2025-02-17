import { OrganizationsContactsComponent } from '../../admin-module/organizations/organizations-contacts/organizations-contacts.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
import { CompanyComponent } from '../../admin-module/company/company.component';
@Component({
  selector: 'app-bank-delete',
  templateUrl: './bank-delete.component.html',
  styleUrls: ['./bank-delete.component.scss']
})
export class BankDeleteComponent implements OnInit {
  public language = language;
  constructor(
    public dialogRef: MatDialogRef<CompanyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { dialogRef.disableClose = true;}

  ngOnInit() {
    console.log(this.data,999)
  }
  deleteAddress(): void {
    this.dialogRef.close({success: true});
  }

}
