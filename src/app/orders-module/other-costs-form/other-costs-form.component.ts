import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Images } from "../../images/images.module";
import { FormArray, FormGroup } from "@angular/forms";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-other-costs-form",
  templateUrl: "./other-costs-form.component.html",
  styleUrls: ["./other-costs-form.component.scss"],
})
export class OtherCostsFormComponent implements OnInit {
  @Input() order_Permissions: any;

  @Input() order: any;
  @Input() showotherCosts: boolean;
  public images = Images;
  public otherCosts: FormGroup;
  public othertransportForm;
  public otherCostsTransports = [];

  @Output() trigger = new EventEmitter<any>();
  @Output() updateStatus = new EventEmitter<any>();

  @Input() viewActivityLogIcon;
  public orderId = "";

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
  }

  ngOnInit(): void {}
  public editID = "";
  public moduleName = ""
  formEmitEvent(obj: any) {
    this.moduleName =  obj.module
    this.othertransportForm = obj.containerform;
    this.otherCosts = obj.form;
    this.editID = obj.editID;
    this.trigger.emit(obj);
  }

  submmitOtherForm(form, event) {
    let toast: object;
    // let params = form.value;
    // params.transport_charges = this.othertransportForm?.value.othercostArray;
    // event.target.disabled = true;
    // params.orders_id = this.order.selectedOrder.id;
    // let status = 6;
    // if (form.valid && this.otherContainerFormValid()) {
    //   this.OrdersService.saveOtherCosts(params).then((response) => {
    //     if (response.result.success) {
    //       if (this.order.selectedOrder.orders_types_id == "14") {
    //         this.OrdersService.acceptOrder({
    //           id: this.order.selectedOrder.id,
    //           orders_types_id: status,
    //           is_order_ready: true,
    //           confirm_sales: true,
    //         }).then((response) => {
    //           if (response.result.success) {
    //             // this.freightContainerForm.markAsPristine();
    //             this.order.selectedOrder.orders_types_id = "6";
    //             // this.freightStatus = false;
    //             this.trigger.emit({
    //               selectedOrderStatus: "Processed",
    //               orders_types_id: "6",
    //               status_color_code: "#008000",
    //             });
    //           }
    //         });
    //       }
    //       toast = { msg: response.result.message, status: "success" };
    //       this.snackbar.showSnackBar(toast);
    //       this.othertransportForm?.markAsPristine();
    //       this.otherCosts.markAsPristine();
    //     } else {
    //       toast = { msg: "Failed to Saved Successfully.", status: "error" };
    //       this.snackbar.showSnackBar(toast);
    //     }
    //   });
    let param = {
      form_data: this.otherCosts.value.storeCustomAttributes[0],
      organization_id: this.orderId,
      id: this.editID,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.otherCosts.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.updateStatus.emit("processed");
      } else {
        // this.disabledSave = false;
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };

        this.snackbar.showSnackBar(toast);
      }
    });
  }

  otherContainerFormValid(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index < this.othertransportForm?.get("othercostArray")["controls"].length;
      index++
    ) {
      if (
        !this.othertransportForm?.get("othercostArray")["controls"][index].valid
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }
  public undoOnCancel = false;
  cancelOthers() {
    this.otherCosts.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
    // this.othersCostState = false;
  }

  getOtherCosts() {
    this.OrdersService.getOtherCosts({
      orders_id: this.order.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.othertransportForm = response.result.data;
      }
    });
  }

  toggleotherCosts() {
    this.showotherCosts = !this.showotherCosts;
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
