import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-lead-attributes",
  templateUrl: "./lead-attributes.component.html",
  styleUrls: ["./lead-attributes.component.scss"],
})
export class LeadAttributesComponent implements OnInit {
  selectedAttribute: object;
  updatedRoleDetails: object;
  updatedCategoryDetails: object;
  constructor() {}

  ngOnInit(): void {}
  getSelectedRole(data: any): void {
    if (data) this.selectedAttribute = data;
    else this.selectedAttribute = {};
    //console.log(this.selectedAttribute )
  }
  updateDetails(result): void {
    this.updatedRoleDetails = {
      id: result.flag,
      result: result.data,
    };
  }
}
