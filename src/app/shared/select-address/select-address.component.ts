import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  Injectable,
} from "@angular/core";
import { AddressComponent } from "../../dialogs/address/address.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { LeadsService } from "../../leads/leads.service";
import { OrdersCreateComponent } from "../../orders-module/order-create/order-create.component";
import * as _ from "lodash";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-select-address",
  templateUrl: "./select-address.component.html",
  styleUrls: ["./select-address.component.scss"],
})
export class SelectAddressComponent implements OnInit {
  @Input() clientSelectedId: any;
  @Input() formFields;
  @Input() totalFormFields;
  @Output() trigger = new EventEmitter<any>();
  @Input() module: any;
  @Input() Contacts: any;
  @Input() related_to_id: any;

  constructor(
    public dialog: MatDialog,
    private service: LeadsService,
    public dialogRef: MatDialogRef<OrdersCreateComponent>
  ) {}
  public addressList = [];
  async ngOnInit() {}

  async ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    await this.getOrgStoreAttribute();
    // this.getAddress();

    // this.displayAddress();

    //
    if (changes.Contacts && changes.Contacts.previousValue) {
      // this.Contacts = changes.Contacts.currentValue
      setTimeout(() => {
        const data2 = this.getAttributesPrefillData();
      }, 1000);
    } else {
      // this.displayAddress();
    }
    // if (changes.clientSelectedId && changes.clientSelectedId.currentValue) {
    //   const param = {
    //     id: this.clientSelectedId,
    //     form_control_name: "organization_id",
    //     module: "create_estimate",
    //   };
    //     this.getDynamicOptionsFromApi(param);
    // }
  }

  displayAddress() {
    //   this.totalFormFields  = this.totalFormFields.filter((obj: any) => {
    //   return obj.slug == "addresses_checkbox"
    // })
    let keys = [];
    keys =
      this.totalFormFields && this.totalFormFields.dependentDropdowns
        ? Object.keys(this.totalFormFields.dependentDropdowns)
        : [];
    keys.length &&
      keys.map((ele: any) => {
        const indx = _.findIndex(this.addressList, { form_control_name: ele });
        if (indx > -1) {
          this.addressList[indx].options =
            this.totalFormFields.dependentDropdowns[ele] || [];
        }
      });
    if (!this.Contacts) {
      this.addressList.map(function (value) {
        if (value.required) value.validationError = true;
        value.options.map((obj: any) => {
          obj["selected"] = false;
        });
        // if (loadAddress == value.id) {
        //   value["selected"] = true;
        // }
      });
    }
  }

  async goToCreateAddress(type: any, ele) {
    this.updateAddress(type, ele);
  }

  public form_id = "";
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: this.module,
        // related_to_id: this.related_to_id,
      })
      .then(async (response) => {
        if (response.result.success) {
          this.addressList = response.result.data.attributes.base_attributes;
          this.displayAddress();

          this.form_id = response.result.data.attributes.form_id;
          if (this.Contacts) {
            const data2 = await this.getAttributesPrefillData();
            this.addressList.map((obj: any) => {
              if (obj.form_control_name == "billing_address_id") {
                // obj.options = [...obj.options, data2.billing_address_id.meta_data]
                obj.options.map((ele: any) => {
                  if (ele.id == data2.billing_address_id.meta_data.id) {
                    ele.selected = true;
                  }
                  return ele;
                });
                this.addreesId.billing_address_id =
                  data2.billing_address_id.meta_data;
              }
              if (obj.form_control_name == "shipping_address_id") {
                // obj.options = [...obj.options, data2.billing_address_id.meta_data]
                obj.options.map((ele: any) => {
                  if (ele.id == data2.shipping_address_id.meta_data.id) {
                    ele.selected = true;
                  }
                  return ele;
                });
                this.addreesId.shipping_address_id =
                  data2.shipping_address_id.meta_data;
              }
              if (obj.form_control_name == "notify_address_id") {
                // obj.options = [...obj.options, data2.billing_address_id.meta_data]
                obj.options.map((ele: any) => {
                  if (ele.id == data2.notify_address_id.meta_data.id) {
                    ele.selected = true;
                  }
                  return ele;
                });
                this.addreesId.notify_address_id =
                  data2.notify_address_id.meta_data;
              }

              return obj;
            });

            const obj = {
              ...this.addreesId,
            };
            this.trigger.emit(obj);
          }
        }
      })
      .catch((error) => console.log(error));
  }

  async getAttributesPrefillData() {
    // console.log(this.Contacts);
    let data;
    await this.service
      .getAttributes({
        related_to_id: this.related_to_id || "",
        module: this.form_id,
        id: this.Contacts?.id || this.Contacts,
      })
      .then((response) => {
        if (response.result.success && response.result.data) {
          data = response.result.data;

          // this.addressList = this.addressList.map((obj: any) => {
          //   if (obj.form_control_name === "billing_address_id") {
          //     console.log(ele)

          //     // Return a new object with updated options
          //     return {
          //       ...obj,
          //       options: obj.options.map((ele: any) => {
          //         // If the condition is met, return the updated object
          //         console.log(ele)
          //         if (ele.id === data.id) {
          //           return data;
          //         }
          //         // Otherwise, return the original object
          //         return ele;
          //       })
          //     };
          //   }
          //   // If the form_control_name does not match, return the original object
          //   return obj;
          // });
        }
        return data;
      })
      .catch((error) => console.log(error));
    return data;
  }

  public returnedDynmicDropdowns: any = [];
  async getDynamicOptionsFromApi(param) {
    let response = "";
    await this.service.getDependentDDS(param).then((res) => {
      const data = res.result.data;
      response = data;
      if (res.result.success) {
        let keys = [];
        keys = data.dependentDropdowns
          ? Object.keys(data.dependentDropdowns)
          : [];
        keys.length &&
          keys.map((ele: any) => {
            const indx = _.findIndex(this.addressList, {
              form_control_name: ele,
            });
            if (indx > -1) {
              this.addressList[indx].options =
                data.dependentDropdowns[ele] || [];
            }
          });
      }
    });
    return response;
  }
  updateAddress(obj?: any, ele?: any): void {
    let addressTypeId = "";

    let type: any;
    let address = {
      address1: "",
      address2: "",
      address_type_id: "",
      city: "",
      country_id: "",
      id: "",
      organization_id: "",
      org_id: this.clientSelectedId,
    };

    if (obj) {
      // Object.assign(address, obj);
      type = "edit";
    } else {
      type = "add";
    }
    let sameAsShipping = { ...this.addreesId.shipping_address_id };
    let sameAsBilling = { ...this.addreesId.billing_address_id };
    if (Object.keys(sameAsShipping).length > 0)
      delete sameAsShipping.address_type_id;
    if (Object.keys(sameAsBilling).length > 0)
      delete sameAsBilling.address_type_id;
    let dialogRef = this.dialog.open(AddressComponent, {
      panelClass: "alert-dialog",
      width: "600px",
      autoFocus: false,
      data: {
        address: address,
        type: "edit",
        addressTypeId: addressTypeId,
        org_id: this.clientSelectedId,
        label: ele.label_name,
        control_name: "address_type_id",
        module:
          obj == "shipping_address_id"
            ? "add_address"
            : obj == "billing_address_id"
            ? "add_billing_address"
            : obj == "notify_address_id"
            ? "add_notify_address"
            : "add_address",
        sameAsShipping:
          Object.keys(sameAsShipping).length > 0 ? sameAsShipping : "",
        sameAsBilling:
          Object.keys(sameAsBilling).length > 0 ? sameAsBilling : "",
      },
    });
    dialogRef.afterClosed().subscribe((response) => {
      // console.log(response);
      if (response && response.success) {
        // if (address.id) {
        const newAddress = response.response;
        const indx = _.findIndex(this.addressList, {
          form_control_name: obj,
        });
        if (indx > -1) {
          this.addressList[indx].options.push(newAddress);
        }
        this.selectAddress(
          newAddress,
          this.addressList[indx].options,
          this.addressList[indx].form_control_name
        );
        // let organizationsList = [];
        // this.organizationDetails.map(function (value) {
        //   if (value.id == result.response.id) {
        //     organizationsList.push(result.response);
        //   } else {
        //     organizationsList.push(value);
        //   }
        // });

        // this.organizationDetails = organizationsList;
        // console.log(this.addressList);
        // } else {
        //   toast = { msg: "Address added successfully.", status: "success" };
        //   this.addAddress(result.response);
        //   this.snackbar.showSnackBar(toast);
        // }
      }
    });
  }
  public addreesId: any = {
    shipping_address_id: {},
    billing_address_id: {},
    notify_address_id: {},
  };

  public shippingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public billingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public notifyAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };

  selectAddress(data: any, list: any, type: any): void {
    this.addressList.map(function (value) {
      if (type == value.form_control_name && value.required) {
        value.validationError = false;
      }
    });
    if (!data.selected) {
      if (type == "shipping_address_id") {
        this.addreesId.shipping_address_id = data;
      } else if (type == "billing_address_id") {
        this.addreesId.billing_address_id = data;
      } else if (type == "notify_address_id") {
        this.addreesId.notify_address_id = data;
      }
    } else {
      if (type == "shipping_address_id") {
        this.addreesId.shipping_address_id = {};
      } else if (type == "billing_address_id") {
        this.addreesId.billing_address_id = {};
      } else if (type == "notify_address_id") {
        this.addreesId.notify_address_id = {};
      }
    }

    data.selected = !data.selected;
    list.map(function (value) {
      if (data.id != value.id) {
        value["selected"] = false;
      }
    });

    const obj = {
      ...this.addreesId,
    };
    this.trigger.emit(obj);
  }
}
