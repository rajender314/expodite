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
  selector: "app-shipping-bill-form",
  templateUrl: "./shipping-bill-form.component.html",
  styleUrls: ["./shipping-bill-form.component.scss"],
})
export class ShippingBillFormComponent implements OnInit {
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
  public moduleName = ""
  formEmitEvent(obj: any) {
    if (obj.form.value.storeCustomAttributes[0].transport_id == "1") {
      this.showAddContainerBtn = false;
    } else {
      this.showAddContainerBtn = true;
    }
    this.moduleName = obj.module
    this.estimate_form_id = obj.estimate_form_id;
    this.freightandlogistics = obj.form;
    if (obj.editID) this.editID = obj.editID;
    // this.existingAttributesData = obj.existingAttributesData;
    // obj.stuffing =
    //   obj.form.controls.storeCustomAttributes.value[0].location_stuffing;
    // if (this.dependentForm) {
    //   this.dependentForm.form.value.storeCustomAttributes[0].mode_transport_id =
    //     obj.form.value.storeCustomAttributes[0].mode_transport_id;
    //   this.dependentForm.form.value.storeCustomAttributes[0].freight_forwarder =
    //     obj.form.value.storeCustomAttributes[0].freight_forwarder;
    //   this.dependentForm.form.value.storeCustomAttributes[0].sailing_date =
    //     obj.form.value.storeCustomAttributes[0].sailing_date;
    //   this.dependentForm.form.value.storeCustomAttributes[0].total_freight_cost =
    //     obj.form.value.storeCustomAttributes[0].total_freight_cost;
    //   this.dependentForm = { ...this.dependentForm };
    // }
    // this.trigger.emit(obj);


    if(this.isEditPermission) {
      this.freightandlogistics.enable();
    } else if(!this.isEditPermission) {
      this.freightandlogistics.disable();
    }
  }

  emitUploadInfo(ev) {
    // this.uploads = ev.uploadList;
    // this.uploads[0].form_control_name = ev.uploadObject[0].form_control_name;
    this.moduleName = ev.module
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
    this.freightandlogistics.markAsPristine();
    this.freightandlogisticsState = false;
    this.editFreight = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
  }
  containerFormEmitEvent(ev) {
    console.log(ev);
    this.freightContainerForm = ev.form;
  }

  public saveBtnClicked = false;
  submmitFreightcost(form): void {
    this.saveBtnClicked = true;

    this.saveStoreAttribute();
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
    const meta_data: Array<any> = [];

    this.saveStoreAttributeApi();
  }

  saveStoreAttributeApi() {
    let toast: object;

    let param = {
      form_data: this.freightandlogistics.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.shipmentId,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        if (!this.editID) this.editID = res.data?.new_data?.id;
        this.freightandlogistics.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.orderPermissions.emit({ flag: true });
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
      console.log(result);
      if (result.success) {
        this.newColumnAdded = true;
      }
    });
  }
}
