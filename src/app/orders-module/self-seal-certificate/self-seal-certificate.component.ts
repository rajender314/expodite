import { Component, Input, OnInit } from "@angular/core";
import { SnakbarService } from "../../services/snakbar.service";
import { OrdersService } from "../../services/orders.service";
import { Images } from "../../images/images.module";

@Component({
  selector: "app-self-seal-certificate",
  templateUrl: "./self-seal-certificate.component.html",
  styleUrls: ["./self-seal-certificate.component.scss"],
})
export class SelfSealCertificateComponent implements OnInit {
  @Input() freightData: any;
  @Input() orderId: any;
  @Input() compnayDetails: any;
  public images = Images;
  @Input() invoiceDetails: any;
  @Input() container_nbr: any;
  @Input() type_size: any;
  @Input() inlineSelfSealData;
  public showSelfSealCertificate: boolean = true;
  public editModeSelfCertificate = false;
  public aaplbottleNumber;
  public shipperLinenumber;
  public intialinlIneSelfSealData;
  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService
  ) {}

  ngOnInit(): void {
    // console.log(this.freightData);
    // console.log(this.orderId);
    // console.log(this.compnayDetails);
    // console.log(this.invoiceDetails);
  }
  toggleSelfSeal() {
    this.showSelfSealCertificate = !this.showSelfSealCertificate;
    // this.printselfSeal = !this.printselfSeal;
  }
  editSelfSealCertificate() {
    if (!this.editModeSelfCertificate) {
      this.editModeSelfCertificate = true;
      this.intialinlIneSelfSealData = { ...this.inlineSelfSealData };
    } else {
      this.editModeSelfCertificate = false;
      this.inlineSelfSealData = { ...this.intialinlIneSelfSealData };
    }
  }
  async saveSealCertificate(type) {
    if (type === "cancel") {
      this.editModeSelfCertificate = false;
      return;
    } else {
      let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
        orders_id: this.orderId,
        type: "SELF_SEAL_CERTIFICATE",
        context: {
          self_seal_number: this.inlineSelfSealData.self_seal_number,
          container_nbr: this.inlineSelfSealData.container_nbr,
          // aaplbottleNumber: this.inlineSelfSealData.aaplbottleNumber,
          // shipperLinenumber: this.inlineSelfSealData.shipperLinenumber,
          customs_seal_number: this.inlineSelfSealData.customs_seal_number,
          sealing_permission_no: this.inlineSelfSealData.sealing_permission_no,
        },
      });
      if (response.result.success) {
        this.editModeSelfCertificate = false;
        this.inlineSelfSealData = response.result.data.context;

        let toast: object;
        toast = {
          msg: "Self Seal Certificate Updated Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      } else {
        this.editModeSelfCertificate = false;

        let toast: object;
        toast = {
          msg: "Self Seal Certificate Update Failed",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    }
  }
}
