import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { OrdersService } from "../../services/orders.service";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { MatDialog } from "@angular/material/dialog";
declare var App: any;

@Component({
  selector: "app-vgm",
  templateUrl: "./vgm.component.html",
  styleUrls: ["./vgm.component.scss"],
})
export class VgmComponent implements OnInit {
  @Input() freightData: any;
  @Input() orderId: any;
  @Input() compnayDetails: any;
  public images = Images;
  @Input() invoiceDetails: any;
  @Input() container_nbr: any;
  @Input() type_size: any;
  @Input() max_permissble;
  @Input() packgeVerifiedgross;
  @Input() inlineVGMData;
  @Input() viewActivityLogIcon;
  @Input() changeShipperAdd;
  public currentDate;
  public showVGM: boolean = true;
  public editModeVgm;
  private initialInlineVGMData: any;
  public verified_gross_weight: any;
  vgmOtherizedData: any;
  public is_automech = App.env_configurations.is_automech;
  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.verified_gross_weight = this.inlineVGMData?.verified_gross_weight
      ? this.inlineVGMData?.verified_gross_weight
      : this.packgeVerifiedgross;
    setTimeout(() => {
      this.vgmOtherizedData = this.inlineVGMData?.vgm_authorized_shipper
        ? this.inlineVGMData.vgm_authorized_shipper
        : this.changeShipperAdd.ksm_phone;
    }, 100);
    // console.log(this.freightData);
    // console.log(this.orderId);
    // console.log(this.compnayDetails);
    // console.log(this.invoiceDetails);
    // console.log(this.packgeVerifiedgross, "verified");
  }
  toggleVGM() {
    this.showVGM = !this.showVGM;
    // this.printSco = !this.printSco;
  }
  editVGM() {
    if (!this.editModeVgm) {
      this.editModeVgm = true;
      this.initialInlineVGMData = { ...this.inlineVGMData };
    } else {
      this.editModeVgm = false;
      this.inlineVGMData = { ...this.initialInlineVGMData };
    }
  }
  async saveVGM(type) {
    if (type === "cancel") {
      this.editModeVgm = false;
      return;
    } else {
      let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
        orders_id: this.orderId,
        type: "VGM",
        context: {
          // self_seal_number: this.freightData.self_seal_number,
          container_nbr: this.inlineVGMData.container_nbr,
          type_size: this.inlineVGMData.type_size,
          max_permissble: this.inlineVGMData.max_permissble,
          vgm_designation: this.inlineVGMData.vgm_designation,
          vgm_authorized_shipper: this.vgmOtherizedData,
          vgm_weigh_bridge: this.inlineVGMData.vgm_weigh_bridge,
          vgm_date_time_weighing: this.inlineVGMData.vgm_date_time_weighing,
          vgm_weighing_slip_no: this.inlineVGMData.vgm_weighing_slip_no,
          vgm_Type_normal: this.inlineVGMData.vgm_Type_normal,
          vgm_hazardous_un: this.inlineVGMData.vgm_hazardous_un,
          verified_gross_weight: this.verified_gross_weight,
          // aaplbottleNumber: this.aaplbottleNumber,
          // shipperLinenumber: this.shipperLinenumber,
        },
      });
      if (response.result.success) {
        this.editModeVgm = false;
        this.inlineVGMData = response.result.data.context;

        let toast: object;
        toast = {
          msg: "VGM Updated Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      } else {
        this.editModeVgm = false;

        let toast: object;
        toast = {
          msg: "VGM Update Failed",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    }
  }

  openActivityModal(type): void {
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        type: type,
        orders_id: this.orderId,
      },
    });
  }
}
