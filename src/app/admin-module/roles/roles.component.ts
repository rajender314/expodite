import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
	selectedRole: object;
  	updatedRoleDetails: object;
  	constructor() { }
  	ngOnInit() {
  	}
	getSelectedRole(data: any): void {
		if(data.status == undefined) {
			data.status = true;
		  }
		if (data) this.selectedRole = data;
		else this.selectedRole = {};
	}
 	updateDetails(result): void {
		this.updatedRoleDetails = {
			id: result.flag,
			result: result.data
		}
  	}
}
