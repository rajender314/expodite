import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-roles",
  templateUrl: "./roles.component.html",
  styleUrls: ["./roles.component.scss"],
})
export class RolesComponent implements OnInit {
  selectedRole: object;
  updatedRoleDetails: object;
  constructor(public adminService: AdminService) {}
  ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.getPermissionDependencies();
  }
  getSelectedRole(data: any): void {
    if (data.status == undefined) {
      data.status = true;
    }
    if (data) this.selectedRole = data;
    else this.selectedRole = {};
  }
  updateDetails(result): void {
    this.updatedRoleDetails = {
      id: result.flag,
      result: result.data,
    };
  }
  public permissionDeps;
  getPermissionDependencies() {
    this.adminService
      .getPermissionDependencies()
      .then((response) => {
        if (response.result.success) {
          const data = response.result.data;
          this.adminService.permissionDeps = data;
        }
      })
      .catch((error) => console.log(error));
  }
}
