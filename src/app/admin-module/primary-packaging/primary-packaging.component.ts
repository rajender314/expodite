import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-primary-packaging',
  templateUrl: './primary-packaging.component.html',
  styleUrls: ['./primary-packaging.component.css']
})
export class PrimaryPackagingComponent implements OnInit {
  selectedContainer: object;
  updatedContainersDetails: object;

  constructor(public adminService: AdminService) { }

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
  }
  getSelectedContainer(data: any): void {
    if(data.status == undefined) {
      data.status = true;
    }
    if (data) 
    this.selectedContainer = data;
    else 
    this.selectedContainer = {};
  }

  updateDetails(result): void {
    this.updatedContainersDetails = {
      id: result.flag,
      delete: result.delete?result.delete:false,
      result: result.data
    }
  }
}
