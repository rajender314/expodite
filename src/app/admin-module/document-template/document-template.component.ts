import { Component, OnInit } from "@angular/core";
import { AdminService } from "../../services/admin.service";

@Component({
  selector: "app-document-template",
  templateUrl: "./document-template.component.html",
  styleUrls: ["./document-template.component.scss"],
})
export class DocumentTemplateComponent implements OnInit {
  selectedDocument: object;
  updatedDocumentDetails: object;
  typeOfDocument: any;
  constructor(public adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
  }
  getSelectedDocument(data: any): void {
    if (data) {
      this.selectedDocument = data;
    } else {
      this.selectedDocument = {};
    }
  }

  updateDocumentDetails(result): void {
    this.updatedDocumentDetails = {
      id: result.flag,
      // id: result.data.id,
      result: result.data,
    };
  }
  getDocumentTemplateTypes(types) {
    this.typeOfDocument = types;
  }
}
