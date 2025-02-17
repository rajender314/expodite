import { Component, Injectable, Input, OnInit } from "@angular/core";
import { OrganizationsService } from "../../services/organizations.service";
import { AdminService } from "../../services/admin.service";
import { take } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-form-builder-list-view",
  templateUrl: "./form-builder-list-view.component.html",
  styleUrls: ["./form-builder-list-view.component.scss"],
})
export class FormBuilderListViewComponent implements OnInit {
  @Input() form_module_name;
  @Input() noDataImage;
  @Input() namingConvention;
  selectedContact: object;
  updatedContactDetails: object;
  globalData: {};

  constructor(
    private organizationsService: OrganizationsService,
    public adminService: AdminService
  ) {}

  ngOnInit() {
    this.adminService
      .getPermissions()
      .pipe(take(1))
      .subscribe((res) => {
        this.adminService.rolePermissions = res.role_details.roles_permissions;
      });
  }

  getAddPermission() {
    switch (this.form_module_name) {
      case "contact_addresses":
        if (
          this.adminService.rolePermissions.add_admin_contact_addresses == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.add_admin_contact_addresses == 2
        ) {
          return false;
        }
        break;
      case "customs_addresses":
        if (this.adminService.rolePermissions.add_admin_custom_addresses == 1) {
          return true;
        } else if (
          this.adminService.rolePermissions.add_admin_custom_addresses == 2
        ) {
          return false;
        }
        break;
      case "add_categories":
        if (this.adminService.rolePermissions.add_category == 1) {
          return true;
        } else if (this.adminService.rolePermissions.add_category == 2) {
          return false;
        }
        break;
      case "insurance_percentage":
        if (
          this.adminService.rolePermissions.add_admin_insurance_percentage == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.add_admin_insurance_percentage == 2
        ) {
          return false;
        }
        break;
      case "add_incoterms":
        if (this.adminService.rolePermissions.add_inco_terms == 1) {
          return true;
        } else if (this.adminService.rolePermissions.add_inco_terms == 2) {
          return false;
        }
        break;
      case "add_products":
        if (this.adminService.rolePermissions.add_product == 1) {
          return true;
        } else if (this.adminService.rolePermissions.add_product == 2) {
          return false;
        }
      case "add_carriers":
        if (this.adminService.rolePermissions.add_carrier == 1) {
          return true;
        } else if (this.adminService.rolePermissions.add_carrier == 2) {
          return false;
        }
        break;
    }
  }

  getEditPermission() {
    switch (this.form_module_name) {
      case "contact_addresses":
        if (
          this.adminService.rolePermissions.edit_admin_contact_addresses == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.edit_admin_contact_addresses == 2
        ) {
          return false;
        }
        break;
      case "customs_addresses":
        if (
          this.adminService.rolePermissions.edit_admin_custom_addresses == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.edit_admin_custom_addresses == 2
        ) {
          return false;
        }
        break;
      case "add_categories":
        if (this.adminService.rolePermissions.edit_category == 1) {
          return true;
        } else if (this.adminService.rolePermissions.edit_category == 2) {
          return false;
        }
        break;
      case "insurance_percentage":
        if (
          this.adminService.rolePermissions.edit_admin_insurance_percentage == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.edit_admin_insurance_percentage == 2
        ) {
          return false;
        }
        break;
      case "add_incoterms":
        if (this.adminService.rolePermissions.edit_inco_terms == 1) {
          return true;
        } else if (this.adminService.rolePermissions.edit_inco_terms == 2) {
          return false;
        }
        break;
      case "add_products":
        if (this.adminService.rolePermissions.edit_product == 1) {
          return true;
        } else if (this.adminService.rolePermissions.edit_product == 2) {
          return false;
        }
        case "add_carriers":
          if (this.adminService.rolePermissions.edit_carrier == 1) {
            return true;
          } else if (this.adminService.rolePermissions.edit_carrier == 2) {
            return false;
          }
        break;
    }
  }

  getImportPermission() {
    switch (this.form_module_name) {
      case "add_products":
        if (
          this.adminService.rolePermissions.import_product == 1
        ) {
          return true;
        } else if (
          this.adminService.rolePermissions.import_product == 2
        ) {
          return false;
        }
        break;
      }
  }
  getSelectedContactAddress(data: any): void {
    // if (data.status == undefined) {
    //   data.status = true;
    // }
    if (data) this.selectedContact = data;
    else {
      this.selectedContact = {};
    }
  }

  updateContactDetails(result): void {
    this.updatedContactDetails = {
      id: result.flag,
      delete: result.delete ? result.delete : false,
      result: result.data,
    };
  }
  public form_name;
  getFormName(formData) {
    this.form_name = formData.name;
  }
}
