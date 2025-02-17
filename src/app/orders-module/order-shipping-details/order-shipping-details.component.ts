import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import moment = require("moment");
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { OrdersService } from "../../services/orders.service";
declare var App: any;
import * as _ from "lodash";
import { LeadsService } from "../../leads/leads.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { UtilsService } from "../../services/utils.service";

@Component({
  selector: "app-order-shipping-details",
  templateUrl: "./order-shipping-details.component.html",
  styleUrls: ["./order-shipping-details.component.scss"],
})
export class OrderShippingDetailsComponent implements OnInit {
  @Input() order_Permissions: any;
  @Output() orderPermissions = new EventEmitter<any>();

  @Input() order: any;
  @Input() factoryPermission: boolean;
  @Input() is_automech: boolean;
  @Input() isSampleDocs;
  @Input() customDocs: boolean = false;
  @Output() trigger = new EventEmitter<any>();
  @Input() saveFreightFlag;
  @Input() selectedOrderStatus;
  @Input() dependentForm;
  @Input() viewActivityLogIcon;
  @Input() isEditPermission = true;
  public shippingForm: FormGroup;
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

  public showShipping: boolean = true;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  public preShipDocs: boolean = false;
  shippingActiveState: boolean;
  invoiceGenerateLoader: boolean = false;
  public orderId = "";
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
      (param) => (this.orderId = param.shipmentId ? param.shipmentId : param.id)
    );
  }
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.saveFreightFlag && changes.saveFreightFlag.currentValue) {
      this.saveFreightFlag = changes.saveFreightFlag.currentValue;
    }
  }
  public existingAttributesData;
  public estimate_form_id = "";
  public editID = "";
  public moduleName = ""

  formEmitEvent(obj: any) {
    this.moduleName =  obj.module
    this.shippingForm = obj.form;
    this.estimate_form_id = obj.estimate_form_id;
    if (obj.editID) this.editID = obj.editID;
    this.existingAttributesData = obj.existingAttributesData;
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


    if(this.isEditPermission) {
      this.shippingForm.enable();
    } else if(!this.isEditPermission) {
      this.shippingForm.disable();
    }
  }

  emitUploadInfo(ev) {
    // this.uploads = ev.uploadList;
    // this.uploads[0].form_control_name = ev.uploadObject[0].form_control_name;
    this.moduleName =  ev.module
    this.uploads = ev.uploadList;
    this.shippingForm = ev.form;
    if (this.uploads.length) {
      this.shippingForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue({
          id: this.uploads[0].attachments_id,
          url: this.uploads[0].filepath,
        });
    } else {
      this.shippingForm.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue("");
    }
    this.shippingForm.markAsDirty();
  }
  containerFormEmitEvent(ev) {
    console.log(ev);
    this.shippingContainer = ev.form;
  }

  toggleShipping() {
    this.showShipping = !this.showShipping;
  }
  public undoOnCancel = false;
  cancelShip() {
    this.shippingForm.markAsPristine();
    this.freightandlogisticsState = false;
    this.editFreight = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }

  public showEditIcon = true;
  public shipContainer;
  public shippingContainer;

  shippingcontainervalidator(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index <
      this.shippingContainer?.get("shippingContainerArray")["controls"].length;
      index++
    ) {
      if (
        !this.shippingContainer.get("shippingContainerArray")["controls"][index]
          .valid
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }

  public shipingDate;
  public disableSaveShipping;
  public submitShippingForm: boolean = false;
  public estimatedDate;
  public shippingOnBoard;
  public billLading;
  public Airwaybill;
  public saveBtnClicked = false;
  public shipping_id;

  saveShippingAddress(form): void {
    this.saveBtnClicked = true;
    // if (this.dependentForm) {
    this.saveStoreAttribute();
    // }
    // this.disableSaveShipping = true;
    this.submitShippingForm = true;
  }

  saveStoreAttribute() {
    const meta_data: Array<any> = [];

    this.saveStoreAttributeApi(meta_data);
  }

  saveStoreAttributeApi(data) {
    let toast: object;
    let param = {
      form_data: this.shippingForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.orderId,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        if (!this.editID) this.editID = res.data?.new_data?.id;
        this.shippingForm.markAsPristine();
        this.orderPermissions.emit({
          flag: true,
        });

        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
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
        id: this.orderId,
      },
    });
  }
}
