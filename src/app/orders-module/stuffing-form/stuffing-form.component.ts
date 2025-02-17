import {
  Component,
  OnInit,
  Injectable,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { Images } from "../../images/images.module";
import { LeadsService } from "../../leads/leads.service";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { AgProductEditComponent } from "../../shared/components/ag-product-edit/ag-product-edit.component";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { OrdersService } from "../../services/orders.service";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-stuffing-form",
  templateUrl: "./stuffing-form.component.html",
  styleUrls: ["./stuffing-form.component.scss"],
})
export class StuffingFormComponent implements OnInit {
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
  public stuffingForm: FormGroup;
  public freighContainerAtrray: FormArray;
  public shippingContainerArray: FormArray;
  public showStuffing: boolean = true;
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
    console.log(obj);
    if (obj.form.value.storeCustomAttributes[0].transport_id == "1") {
      this.showAddContainerBtn = false;
    } else {
      this.showAddContainerBtn = true;
    }
    this.moduleName = obj.module
    this.estimate_form_id = obj.estimate_form_id;
    this.stuffingForm = obj.form;
    this.existingAttributesData = obj.existingAttributesData;
    this.editID = obj.editID;
    this.trigger.emit(obj);
  }

  togglefreightlogistics() {
    this.showStuffing = !this.showStuffing;
  }
  public undoOnCancel = false;
  cancelFreight() {
    this.stuffingForm.markAsPristine();
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
    this.saveStoreAttributeApi();
  }

  saveStoreAttributeApi() {
    let toast: object;

    let param = {
      form_data: this.stuffingForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.shipmentId,
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.stuffingForm.markAsPristine();
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
        orders_id: this.shipmentId,
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
