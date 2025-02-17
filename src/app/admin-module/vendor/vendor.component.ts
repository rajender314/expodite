import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
declare var App: any;
@Component({
  selector: "app-vendor",
  templateUrl: "./vendor.component.html",
  styleUrls: ["./vendor.component.scss"],
})
export class VendorComponent implements OnInit {
  selectedOrganization: object;
  updatedDetails: object;

  constructor(private titleService: Title) {}

  ngOnInit() {
    this.titleService.setTitle(App["company_data"].VendorTitle);
  }

  getSelectedOrganization(data: any): void {
    if (data) {
      this.selectedOrganization = data;
    } else {
      this.selectedOrganization = {};
    }
  }

  updateDetails(result): void {
    this.updatedDetails = {
      id: result.flag,
      result: result.data,
    };
  }
}
