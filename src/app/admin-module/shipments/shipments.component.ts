import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Images } from '../../images/images.module';

@Component({
  selector: "app-shipments",
  templateUrl: "./shipments.component.html",
  styleUrls: ["./shipments.component.scss"],
})
export class ShipmentsComponent implements OnInit {
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
