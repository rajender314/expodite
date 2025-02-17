import { OrdersComponent } from "./../../orders-module/orders/orders.component";
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { OrdersService } from "../../services/orders.service";
import { Param } from "./../../custom-format/param";
import { AdminService } from "./../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { LeadsService } from "../../leads/leads.service";
import * as _ from "lodash";

@Component({
  selector: "app-change-shipper-address",
  templateUrl: "./change-shipper-address.component.html",
  styleUrls: ["./change-shipper-address.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class ChangeShipperAddressComponent implements OnInit {
  contactAddressList: Array<any> = [];
  shippingId: any;
  success: boolean;
  public disabledSave = true;
  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    public utilsService: UtilsService,
    public leadService: LeadsService,
    public adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }
  private param: any = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
    flag: true,
  };
  public modulesList;
  ngOnInit() {
    // this.utilsService.getModuleList().then((response) => {
    //   this.modulesList = response.result.data.modulesDt;
    //   const indx = _.findIndex(this.modulesList, {
    //     slug: "contact_addresses",
    //   });
    //   console.log(indx);
    //   if (indx > -1) {
    //     this.param.form_id = this.modulesList[indx].id;
    //     this.getContacts(this.param);
    //   }
    // });
    this.getContacts(this.param);
  }
  getContacts(param: object): void {
    console.log("here");
    this.adminService
      .getContactsList(param)
      .then((response) => {
        if (response.result.success) {
          let data = response.result.data.companyShpAddrDt;
          data.map((res) => {
            res["selected"] = false;
            this.contactAddressList.push(res);
            // console.log( this.contactAddressList)
          });
        }
      })
      .catch((error) => console.log(error));

    // this.leadService
    //   .getModuleSavedList(param)
    //   .then((response) => {
    //     if (response.result.success) {
    //       let data = response.result.data.list;
    //       data.map((res) => {
    //         res["selected"] = false;
    //         this.contactAddressList.push(res);
    //         // console.log( this.contactAddressList)
    //       });
    //     }
    //   })
    //   .catch((error) => console.log(error));
  }
     public selectedCategory = {};
  // selectAddress(id: any, list): void {
  //   this.shippingId = id;
  //   this.selectedCategory = list;
  //   console.log('yes');
  //   this.contactAddressList.map(function (value) {
  //     console.log('yes', value);
  //     if (value.id == id) {
  //       value["selected"] = true;
  //     } else {
  //       value["selected"] = false;
  //     }
  //   });
  //   this.disabledSave = false;

  //   // console.log(this.contactAddressList)
  //   //  console.log(this.shippingId)
  // }



    selectAddress(event: any): void {

    this.shippingId = event.value;
    this.contactAddressList.map(function (value) {
      if (value.id == event.value) {
        value["selected"] = true;
      } else {
        value["selected"] = false;
      }
    });
    this.disabledSave = false;

  }
  
  
  changeShipperAdd(): void {
    this.dialogRef.close({ success: true, data: this.contactAddressList });
    this.OrdersService.updateShipperAddress({
      module_id: this.data.module_id,
      shipper_id: this.shippingId,
      type: this.data.type,
    }).then((response) => {
      this.success = true;
      this.dialogRef.close({
        success: true,
        data: this.contactAddressList,
      });
      let toast: object;
      toast = {
        msg: "Shipper Address Updated Successfully.",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    });
  }
}
