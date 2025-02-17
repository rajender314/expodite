import { Component, OnInit } from "@angular/core";
import { OrganizationsService } from "../../services/organizations.service";
import { Images } from "../../images/images.module";

@Component({
  selector: "customs-address",
  templateUrl: "./customs-address.component.html",
  styleUrls: ["./customs-address.component.scss"],
  providers: [OrganizationsService],
})
export class CustomsAddressComponent implements OnInit {
  selectedContact: object;
  updatedContactDetails: object;
  globalData: {};
  public images = Images;

  constructor(private organizationsService: OrganizationsService) {}

  ngOnInit() {
    this.getOrganizationDetails();
  }
  getSelectedContactAddress(data: any): void {
    if (data.status == undefined) {
      data.status = true;
    }
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

  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then((response) => {
        if (response.result.success) {
          this.globalData = {
            address_type: response.result.data.address_types,
            countries: response.result.data.countries,
            countriesStates: response.result.data.countriesStates,
            states: response.result.data.states,
          };
          // this.onCountryChange();
        }
      })
      .catch((error) => console.log(error));
  }
}
