import { Component, OnInit ,Inject} from '@angular/core';
import { OrganizationsContactsComponent } from './../../admin-module/organizations/organizations-contacts/organizations-contacts.component';

// import { OrganizationsContactsComponent } from './../../client-module/organizations/organizations-contacts/organizations-contacts.component';
import { OrganizationsService } from '../../services/organizations.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
@Component({
  selector: 'app-contact-delete-alert',
  templateUrl: './contact-delete-alert.component.html',
  styleUrls: ['./contact-delete-alert.component.scss'],
  providers: [OrganizationsService]
})
export class ContactDeleteAlertComponent implements OnInit {
  success: boolean;
  public language = language;
  constructor(
    private organizationServie: OrganizationsService,
    public dialogRef: MatDialogRef<OrganizationsContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
   }

  ngOnInit() {
    
  }

  // onClick(id): void {
   
  //     this.dialogRef.close({success: true});
       
  // }

  onClick(id): void {
    this.organizationServie
    .OrganizationContactsDelete({id: id})
    .then(response => {
      if (response.result.success){
        setTimeout(() => {
          this.dialogRef.close({success: true,result:response.result});
        }, 1000);
      }
     
    })
  }
}
