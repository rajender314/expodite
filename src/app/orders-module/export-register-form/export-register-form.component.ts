import { Component, Input, OnInit } from "@angular/core";
import { Images } from "../../images/images.module";
import { FormGroup } from "@angular/forms";
import { OrdersService } from "../../services/orders.service";
import { SnakbarComponent } from "../../custom-material/snakbar/snakbar.component";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { ActivatedRoute } from "@angular/router";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-export-register-form",
  templateUrl: "./export-register-form.component.html",
  styleUrls: ["./export-register-form.component.scss"],
})
export class ExportRegisterFormComponent implements OnInit {
  @Input() order_Permissions: any;

  @Input() showexportRegister;
  @Input() order;
  public exportRegisterForm: FormGroup;
  public images = Images;
  @Input() viewActivityLogIcon;
  public orderId = "";

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.orderId = param.id));
  }

  ngOnInit(): void {}

  toggleExportRegister() {
    this.showexportRegister = !this.showexportRegister;
  }
  public undoOnCancel = false;
  cancelExportRegister() {
    this.exportRegisterForm.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }
  public editID = ""; 
  public moduleName = "";
  formEmitEvent(obj: any) {
    this.moduleName = obj.module;
    this.exportRegisterForm = obj.form;
    this.editID = obj.editID;
    console.log(obj.form);
  }

  submmitExportRegister(form) {
    let toast: object;
    // let params = form.value;
    // params.orders_id = this.order.id;
    // console.log(form.valid);
    // console.log(form);
    // if (form.valid) {
    //   this.OrdersService.saveExportRegister(params).then((response) => {
    //     if (response.result.success) {
    //       this.exportRegisterForm.markAsPristine();
    //       toast = { msg: response.result.message, status: "success" };
    //       this.snackbar.showSnackBar(toast);
    //     }
    //   });
    // }

    let param = {
      form_data: this.exportRegisterForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.orderId,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.exportRegisterForm.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
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
