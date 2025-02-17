import { Component, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-incoterms",
  templateUrl: "./incoterms.component.html",
  styleUrls: ["./incoterms.component.scss"],
})
export class IncotermsComponent implements OnInit {
  selectedShipment: object;
  updatedShipmentDetails: object;
  public images = Images;

  constructor(public adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
  }

  getSelectedShipment(data: any): void {
    if (data) this.selectedShipment = data;
    else this.selectedShipment = {};
  }

  updateDetails(result): void {
    this.updatedShipmentDetails = {
      id: result.flag,
      result: result.data,
    };
  }
}
