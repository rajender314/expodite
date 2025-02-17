import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ContactsComponent } from "../../../dialogs/contacts/contacts.component";
import { MatDialog } from "@angular/material/dialog";
import { AdminService } from "../../../services/admin.service";

@Component({
  selector: "app-account-manager",
  templateUrl: "./account-manager.component.html",
  styleUrls: ["./account-manager.component.css"],
})
export class AccountManagerComponent implements OnInit {
  @Input() Contacts;
  @Input() Organization;
  @Input() contactsList;
  @Output() getOrgStoreAttribute = new EventEmitter<any>();
  @Output() deleteManager = new EventEmitter<any>();
  constructor(public dialog: MatDialog,
    public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
  }

  updateOrganizationContacts(data?: any): void {
    let contacts = {
      id: "",
      contact: {
        organization_id: this.Contacts.id,
      },
    };
    if (data) Object.assign(contacts, data);

    let toast: object;
    console.log({
      contactdata: contacts,
      org_id: this.Contacts.id,
      form_module_name: "add_contact",
      editTypeForRestrict: data ? true : false,
    });
    let dialogRef = this.dialog.open(ContactsComponent, {
      panelClass: "alert-dialog",
      width: "540px",
      data: {
        contactdata: contacts,
        org_id: this.Contacts.id,
        form_module_name: "account_manager",
        editTypeForRestrict: data ? true : false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result && result.success) {
        this.getOrgStoreAttribute.emit("account_manager");
      }
    });
  }
  handelDeleteManager(data?: any, module?: any, type?: any) {
    this.deleteManager.emit({ data, module, type });
  }
}
