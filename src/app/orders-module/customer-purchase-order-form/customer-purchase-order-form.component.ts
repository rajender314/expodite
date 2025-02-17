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
import { UtilsService } from "../../services/utils.service";
import { AgProductEditComponent } from "../../shared/components/ag-product-edit/ag-product-edit.component";
import { OrderActivityLogComponent } from "../../orders-module/order-activity-log/order-activity-log.component";

@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-customer-purchase-order-form",
  templateUrl: "./customer-purchase-order-form.component.html",
  styleUrls: ["./customer-purchase-order-form.component.scss"],
})
export class CustomerPurchaseOrderFormComponent implements OnInit {
  @Input() order_Permissions: any;
  @Input() getInputValidationTypes;
  @Input() order: any;
  @Input() factoryPermission: boolean;
  @Input() is_automech: boolean;
  @Input() disableEdit;
  @Output() trigger = new EventEmitter<any>();
  @Output() orderPermissions = new EventEmitter<any>();
  @Output() setMinimizeAll = new EventEmitter<any>();
  @Output() setOrderReady = new EventEmitter<any>();
  @Output() moveToElement = new EventEmitter<any>();
  @Input() saveFreightFlag;
  @Input() dependentForm;
  @Input() viewActivityLogIcon;
  @Input() isEditPermission = true;
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
  public ordersId = "";
  uploads: any;
  public showSaveBtn = false;

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private service: LeadsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe((param) => (this.ordersId = param.id));
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
  formEmitEvent(obj: any) {
    if (obj.form.value.storeCustomAttributes[0].transport_id == "1") {
      this.showAddContainerBtn = false;
    } else {
      this.showAddContainerBtn = true;
    }
    this.moduleName = obj.module;
    this.estimate_form_id = obj.estimate_form_id;
    this.freightandlogistics = obj.form;
    this.editID = obj.editID;

    if(this.isEditPermission) {
      this.freightandlogistics.enable();
    } else if(!this.isEditPermission) {
      this.freightandlogistics.disable();
    }
  }

  emitUploadInfo(ev) {
    this.showSaveBtn = true;
    this.moduleName = ev.module;
    this.uploads = ev.uploadList;
    this.freightandlogistics = ev.form;
    if (this.uploads.length) {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue(this.uploads);
    } else {
      this.freightandlogistics.controls.storeCustomAttributes["controls"][0]
        .get(ev.uploadObject[0].form_control_name)
        ?.setValue([]);
    }
    this.freightandlogistics.markAsDirty();
  }

  togglefreightlogistics() {
    this.freightlgistics = !this.freightlgistics;
  }
  public undoOnCancel = false;

  skipForm() {
    this.freightlgistics = false;
    // this.freightandlogistics.reset()
    this.cancelFreight();
    this.setOrderReady.emit();
    this.setMinimizeAll.emit(true);
    setTimeout(() => {
      this.moveToElement.emit();
    }, 1000);
  }
  cancelFreight() {
    this.freightandlogistics.reset();

    this.freightandlogisticsState = false;
    this.editFreight = false;
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 2000);
    // this.freightandlogistics.markAsPristine();
  }

  public saveBtnClicked = false;
  submmitFreightcost(form): void {
    this.saveBtnClicked = true;

    this.saveStoreAttribute();
  }

  saveStoreAttribute() {
    const meta_data: Array<any> = [];

    this.saveStoreAttributeApi();
  }
  public uploadDocFlag = false;
  public moduleName = "";
  saveStoreAttributeApi() {
    let toast: object;

    let param = {
      form_data: this.freightandlogistics.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.ordersId,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.uploadDocFlag = true;
        this.freightandlogistics.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.orderPermissions.emit(true);
        this.setMinimizeAll.emit(true);
        this.saveBtnClicked = false;
        this.showSaveBtn = false;
        setTimeout(() => {
          this.moveToElement.emit();
        }, 1000);
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
        module: "customer_purchase_order",
        id: this.order.selectedOrder.id,
      },
    });
  }
  public newColumnAdded = false;
}
