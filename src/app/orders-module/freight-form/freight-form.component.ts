import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  Injectable,
} from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import moment = require("moment");
import { SnakbarService } from "../../services/snakbar.service";
import { ActivatedRoute } from "@angular/router";
import { LeadsService } from "../../leads/leads.service";
import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { UtilsService } from "../../services/utils.service";
import { AgProductEditComponent } from "../../shared/components/ag-product-edit/ag-product-edit.component";

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-freight-form",
  templateUrl: "./freight-form.component.html",
  styleUrls: ["./freight-form.component.scss"],
})
export class FreightFormComponent implements OnInit {
  @Input() order_Permissions: any;
  @Input() getInputValidationTypes;
  @Input() order: any;
  @Input() factoryPermission: boolean;
  @Input() is_automech: boolean;
  @Output() trigger = new EventEmitter<any>();
  @Output() orderPermissions = new EventEmitter<any>();

  @Input() saveFreightFlag;
  @Input() dependentForm;
  @Input() viewActivityLogIcon;
  @Input() isEditPermission;
  public freightandlogistics: FormGroup;
  public freighContainerAtrray: FormArray;
  public shippingContainerArray: FormArray;
  public freightlgistics: boolean = true;
  public editFreight: boolean = true;
  public saveFreight: boolean = false;
  freightandlogisticsState: boolean = false;
  public freightData = [];
  public addContainer = [];
  public freightDataPack;
  public saveSubmmitFreight;
  public submitFreightForm: boolean = false;
  public images = Images;
  public sailingDate;
  public containerError;
  public freightContainerForm;
  public shipmentId = "";
  uploads: any;

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private service: LeadsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe(
      (param) => (this.shipmentId = param.shipmentId)
    );
  }

  ngOnInit(): void {}
  public existingAttributesData;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.saveFreightFlag && changes.saveFreightFlag.currentValue) {
      this.saveFreightFlag = changes.saveFreightFlag.currentValue;
    }
  }
  public editID = "";
  public estimate_form_id = "";
  public showAddContainerBtn = false;
  public moduleName = "";
  formEmitEvent(obj: any) {
    if (obj.form.value.storeCustomAttributes[0].transport_id == "1") {
      this.showAddContainerBtn = false;
    } else {
      this.showAddContainerBtn = true;
    }
    this.moduleName = obj.module;
    this.estimate_form_id = obj.estimate_form_id;
    this.freightandlogistics = obj.form;
    this.existingAttributesData = obj.existingAttributesData;

    if(this.isEditPermission) {
      this.freightandlogistics.enable();
    } else  if(!this.isEditPermission) {
      this.freightandlogistics.disable();
    }


    if (obj.editID) this.editID = obj.editID;
    obj.stuffing =
      obj.form.controls.storeCustomAttributes.value[0].location_stuffing;
    if (this.dependentForm) {
      this.dependentForm.form.value.storeCustomAttributes[0].mode_transport_id =
        obj.form.value.storeCustomAttributes[0].mode_transport_id;
      this.dependentForm.form.value.storeCustomAttributes[0].freight_forwarder =
        obj.form.value.storeCustomAttributes[0].freight_forwarder;
      this.dependentForm.form.value.storeCustomAttributes[0].sailing_date =
        obj.form.value.storeCustomAttributes[0].sailing_date;
      this.dependentForm.form.value.storeCustomAttributes[0].total_freight_cost =
        obj.form.value.storeCustomAttributes[0].total_freight_cost;
      this.dependentForm = { ...this.dependentForm };
    }
    this.trigger.emit(obj);
  }

  emitUploadInfo(ev) {
    // this.uploads = ev.uploadList;
    // this.uploads[0].form_control_name = ev.uploadObject[0].form_control_name;
    this.moduleName = ev.module;
    this.uploads = ev.uploadList;
    this.freightandlogistics = ev.form;
    if (this.uploads.length) {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue({
          id: this.uploads[0].attachments_id,
          url: this.uploads[0].filepath,
        });
    } else {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue("");
    }
  }

  togglefreightlogistics() {
    this.freightlgistics = !this.freightlgistics;
  }
  public undoOnCancel = false;
  cancelFreight() {
    this.freightandlogistics.reset();
    this.freightandlogisticsState = false;
    this.editFreight = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }
  containerFormEmitEvent(ev) {
    this.freightContainerForm = ev.form;
  }

  public saveBtnClicked = false;
  submmitFreightcost(form): void {
    this.saveBtnClicked = true;

    // if (this.dependentForm) {
    this.saveStoreAttribute();
    // }

    // if (
    //   this.freightContainerForm &&
    //   !this.freightContainerForm.value.freighContainerAtrray.length
    // ) {
    //   return;
    // }
    // this.areAllControlsValid();
    // let toast: object;
    // this.submitFreightForm = true;
    // if (
    //   this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //     .transport_id != "1" &&
    //   !this.freightContainerForm
    // ) {
    //   this.containerError = true;
    // } else {
    //   this.containerError = false;
    // }

    // // this.sailingDate =moment(this.freightandlogistics.value.sailing_date).format('YYYY-MM-DD');

    // const rawBillDate =
    //   this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //     .sailing_date;
    // const isValidDate = moment(rawBillDate, "YYYY-MM-DD", true).isValid();
    // if (isValidDate) {
    //   this.sailingDate = moment(rawBillDate).format("YYYY-MM-DD");
    // } else {
    // }
    // if (form.valid && !this.containerError && this.areAllControlsValid()) {
    //   // this.totalSpinner = true;
    //   this.saveSubmmitFreight = true;
    //   if (this.freightContainerForm) {
    //     this.addContainer = this.freightContainerForm.get(
    //       "freighContainerAtrray"
    //     ).value;
    //   }

    //   this.OrdersService.generateSavefreight({
    //     transport_mode:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transport_id,
    //     orders_id: this.order.selectedOrder.id,
    //     carrier:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .carrier,
    //     location_stuffing:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .location_stuffing,
    //     carrier_booking_rfno:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .carrier_booking_rfno,
    //     port_of_loading:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .port_of_loading,
    //     port_of_discharge:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .port_of_discharge,
    //     total_freight_cost:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .total_freight_cost,
    //     transport_vehicle_number:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transport_vehicle_number,
    //     final_destination:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .final_destination,
    //     precarriage_by:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .precarriage_by,
    //     compensation_cess_amt:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .compensation_cess_amt,
    //     epcg_lic:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .epcg_lic,
    //     drawback_no:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .drawback_no,
    //     place_of_reciept_pre_carrier:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .place_of_reciept_pre_carrier,
    //     sailing_date: this.sailingDate,
    //     // freight_cost_container:this.freightandlogistics.value.freight_cost_container ,
    //     freight_cost_currency:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .freight_cost_currency,
    //     transport_cost_per_truck:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transport_cost_per_truck,
    //     transporter_name:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transporter_name,
    //     number_of_trucks:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .number_of_trucks,
    //     freight_forwarder:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .freight_forwarder,
    //     number_of_containers:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transport_id == "1"
    //         ? ""
    //         : this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //             .number_of_containers,
    //     tax_other_information:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .tax_other_information,
    //     self_seal_number:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .self_seal_number,
    //     containers:
    //       this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //         .transport_id == "1"
    //         ? ""
    //         : this.addContainer,
    //   }).then((response) => {
    //     if (response.result.success) {
    //       if (this.dependentForm) {
    //         this.saveStoreAttribute();
    //       }
    //       toast = {
    //         msg: "Freight Details Updated Successfully.",
    //         status: "success",
    //       };
    //       this.snackbar.showSnackBar(toast);
    //       this.freightandlogisticsState = false;
    //       // this.freightandlogisticsState=false;
    //       this.emitFormsInfo.emit({
    //         saveFreight: true,
    //         module: "freightandlogistics",
    //         carrier_booking_rfno:
    //           this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //             .carrier_booking_rfno,
    //         stuffing:
    //           this.freightandlogistics.controls.storeCustomAttributes.value[0]
    //             .location_stuffing,
    //       });

    //       if (this.order.selectedOrder.orders_types_id == "11") {
    //       }
    //       this.freightContainerForm?.markAsPristine();
    //       this.freightandlogistics.markAsPristine();
    //       while (this.shippingContainerArray?.length > 0) {
    //         this.shippingContainerArray.removeAt(0);
    //       }
    //       while (this.freighContainerAtrray?.length > 0) {
    //         this.freighContainerAtrray.removeAt(0);
    //       }
    //       // this.getShippingAddressDetails();
    //       this.saveSubmmitFreight = false;
    //     } else {
    //       toast = { msg: "Failed To Save Freight Details.", status: "error" };
    //       this.snackbar.showSnackBar(toast);
    //       this.saveSubmmitFreight = false;
    //     }
    //   });
    // }
  }

  areAllControlsValid(): boolean {
    let isvalid = true;
    if (this.freightContainerForm) {
      for (
        let index = 0;
        index <
        this.freightContainerForm.get("freighContainerAtrray")["controls"]
          .length;
        index++
      ) {
        if (
          !this.freightContainerForm.get("freighContainerAtrray")["controls"][
            index
          ].valid
        ) {
          isvalid = false;
        }
      }
      return isvalid;
    } else {
      return true;
    }
  }

  saveStoreAttribute() {
    // if(!this.freightContainerForm || !this.freightContainerForm.value.freighContainerAtrray.length) {
    //   return;
    // }
    const meta_data: Array<any> = [];
    // for (var prop in this.dependentForm.form.value.storeCustomAttributes[0]) {
    //   let i = _.findIndex(<any>this.existingAttributesData, {
    //     form_control_name: prop,
    //   });
    //   meta_data.push({
    //     key: prop,
    //     value: this.dependentForm.form.value.storeCustomAttributes[0][prop],
    //     label: i > -1 ? this.existingAttributesData[i].label_name : "",
    //     base_field: i > -1 ? this.existingAttributesData[i].base_field : "",
    //     flag: i > -1 ? this.existingAttributesData[i].key : "",
    //   });
    // }
    // for (let i = 0; i < meta_data.length; i++) {
    //   if (meta_data[i].flag === "custom_component") {
    //     meta_data.splice(i, 1);
    //   }
    // }
    // if (meta_data.length) {
    //   this.saveStoreAttributeApi(meta_data);
    // }

    this.saveStoreAttributeApi();
  }

  saveStoreAttributeApi() {
    // const obj = {
    //   related_to_id: this.shipmentId ? this.shipmentId : "",
    //   system_key: "addInvoiceShipping",
    // };
    // this.service
    //   .saveAttributes({
    //     ...obj,
    //     form_id: parseInt(localStorage.getItem("shipping_details_id")),
    //     meta_data: data,
    //   })
    //   .then((response) => {
    //     if (response.result.success) {
    //       // localStorage.clear();
    //       setTimeout(() => {
    //         this.saveFreight = !this.saveFreight;
    //       }, 2000);

    //       localStorage.removeItem("customFields");
    //       localStorage.removeItem("moduleName");
    //     }
    //   })
    //   .catch((error) => console.log(error));
    let toast: object;
    // let form_data = {
    //   frieght_form: this.freightandlogistics.value.storeCustomAttributes[0],
    //   add_container: this.freightContainerForm.value.freighContainerAtrray,

    // };
    // const params = {
    //   related_to_id: "604",
    //   form_id: this.estimate_form_id,
    //   meta_data: {
    //     // add_product: this.pfiProductsPayload.value.productItem,
    //     ...form_data,
    //   },
    //   id: this.editID
    // };
    // this.service.saveAttributes(params).then((response) => {
    //   if (response.result.success) {
    //     // localStorage.clear();
    //     localStorage.removeItem("customFields");
    //     localStorage.removeItem("moduleName");
    //     toast = {
    //       msg: response.result.message,
    //       status: "success",
    //     };
    //     this.snackbar.showSnackBar(toast);

    //   } else {
    //     toast = {
    //       msg: response.result.message
    //         ? response.result.message
    //         : "Unable to Update",
    //       status: "error",
    //     };
    //     this.snackbar.showSnackBar(toast);
    //   }
    // });
    let param = {
      form_data: this.freightandlogistics.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.shipmentId,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        if (!this.editID) this.editID = res.data?.new_data?.id;
        this.freightandlogistics.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.orderPermissions.emit();
        this.saveBtnClicked = false;
      } else {
        // this.disabledSave = false;
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.saveBtnClicked = false;
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
        module: type,
        id: this.shipmentId,
      },
    });
  }
  public newColumnAdded = false;
  addNewLine() {
    let dialogRef = this.dialog.open(AgProductEditComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        title: "Add Container",
        saveApi: "",
        tableName: "add_container",
        related_to_id: this.shipmentId,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.newColumnAdded = true;
      }
    });
  }
}
