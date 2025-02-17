import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-other-order-details",
  templateUrl: "./other-order-details.component.html",
  styleUrls: ["./other-order-details.component.scss"],
})
export class OtherOrderDetailsComponent implements OnInit {
  @Input() order_Permissions: any;
  @Output() orderPermissions = new EventEmitter<any>();

  @Input() order: any;
  @Input() factoryPermission: boolean;
  @Input() is_automech: boolean;
  @Input() showDrumsList;
  @Input() isSampleDocs;
  @Output() trigger = new EventEmitter<object>();
  @Input() viewActivityLogIcon;
  public saveFreight: boolean = false;
  public showOtherOrderDetails: boolean = true;
  public otherOrderDetailsState: boolean = false;
  public otherOrderDetailsForm: FormGroup;
  public images = Images;
  public showLUT: boolean = false;
  public showHAZ: boolean = false;
  public undoOnCancel = false;
  public orderOtherDetails;
  public displayScomet: boolean = false;
  public enableCustomDocs: boolean = false;

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

  ngOnInit(): void {
    if (
      (this.saveFreight && this.order.selectedOrder.orders_types_id >= "11") ||
      this.order.selectedOrder.orders_types_id == "6" ||
      this.order.selectedOrder.orders_types_id == "4"
    ) {
      this.saveFreight = true;
    }

    this.getOtherOrderDetails();
  }

  getOtherOrderDetails() {
    this.OrdersService.getOtherOrderDetails({
      orders_id: this.order.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.orderOtherDetails = response.result.data;
        if (
          !this.is_automech
            ? this.order.selectedOrder.orders_types_id == "11" &&
              response.result.data?.is_save_other_details
            : this.order.selectedOrder.orders_types_id == "12" &&
              response.result.data?.is_save_other_details
        ) {
          this.enableCustomDocs = true;
        }
        this.emitDependentFlags();
      }
    });
  }
  public editID = "";
  public moduleName = ""
  formEmitEvent(obj: any) {
    this.moduleName =  obj.module
    this.otherOrderDetailsForm = obj.form;
    this.editID = obj.editID;
  }
  toggleOtherOrderDetails() {
    this.showOtherOrderDetails = !this.showOtherOrderDetails;
  }

  submitOtherOrderDetails(form) {
    // let toast: object;
    // if (!this.showLUT) {
    //   this.otherOrderDetailsForm.get("supplier_name")?.reset();
    //   this.otherOrderDetailsForm.get("supplier_invoice_no")?.reset();
    //   this.otherOrderDetailsForm.get("aapl_po_no")?.reset();
    // }
    // if (!this.showHAZ) {
    //   this.otherOrderDetailsForm.get("is_haz")?.reset();
    // }
    // let params = form.value.storeCustomAttributes[0];
    // params.orders_id = this.order.selectedOrder.id;
    // params.id = this.orderOtherDetails?.id;
    // params.is_save_other_details = true;
    // if (form.valid) {
    //   this.OrdersService.saveOtherOrderDetails(params).then((response) => {
    //     if (response.result.success) {
    //       this.orderOtherDetails = response.result.data;
    //       this.emitFormsInfo.emit({
    //         saveFreight: true,
    //         module: "other_order_details",
    //       });
    //       if (
    //         !this.is_automech &&
    //         this.order.selectedOrder.orders_types_id == "11"
    //       ) {
    //         this.enableCustomDocs = true;
    //       }
    //       if (this.is_automech) {
    //         this.displayScomet = true;
    //         if (this.order.selectedOrder.orders_types_id == "11") {
    //           let status = 12;
    //           this.OrdersService.acceptOrder({
    //             id: this.order.selectedOrder.id,
    //             orders_types_id: status,
    //             is_order_ready: true,
    //             confirm_sales: true,
    //           }).then((response) => {
    //             if (response.result.success) {
    //               this.trigger.emit({
    //                 orders_types_id: "12",
    //                 selectedOrderStatus: "Customs Clearance",
    //                 status_color_code: "#fa6",
    //               });
    //             }
    //             this.enableCustomDocs = true;
    //             this.emitDependentFlags();
    //           });
    //         }
    //       } else {
    //         this.enableCustomDocs = true;
    //         this.emitDependentFlags();
    //       }
    //       this.otherOrderDetailsForm.markAsPristine();
    //       this.otherOrderDetailsState = false;
    //       toast = { msg: response.result.message, status: "success" };
    //       this.snackbar.showSnackBar(toast);
    //     }
    //   });
    // }

    let toast: object;
    let param = {
      form_data: this.otherOrderDetailsForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.orderId,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.otherOrderDetailsForm.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.orderPermissions.emit();
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
  cancelOtherDetails() {
    this.otherOrderDetailsForm.markAsPristine();
    this.otherOrderDetailsState = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }

  emitDependentFlags() {
    let displayAdc: boolean = false;
    let displayNonScomet: boolean = false;
    let displayAdcHaz: boolean = false;
    let displayAdcNonHaz: boolean = false;

    if (this.orderOtherDetails?.is_pharma) {
      displayAdc = true;
    } else {
      displayAdc = false;
    }

    if (this.orderOtherDetails?.is_under_scomet) {
      this.displayScomet = true;
      displayNonScomet = false;
    } else {
      this.displayScomet = false;
      displayNonScomet = true;
    }

    if (this.orderOtherDetails?.is_haz === "1") {
      displayAdcHaz = true;
      displayAdcNonHaz = false;
    } else if (this.orderOtherDetails?.is_haz === "2") {
      displayAdcNonHaz = true;
      displayAdcHaz = false;
    } else {
      displayAdcNonHaz = displayAdcHaz = false;
    }

    this.trigger.emit({
      displayScomet: this.displayScomet,
      displayNonScomet: displayNonScomet,
      displayAdcHaz: displayAdcHaz,
      displayAdcNonHaz: displayAdcNonHaz,
      enableCustomDocs: this.enableCustomDocs,
      displayAdc: displayAdc,
    });
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
