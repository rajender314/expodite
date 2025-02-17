import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { FormGroup, FormArray } from "@angular/forms";
import { Images } from "../../images/images.module";
import { UtilsService } from "../../services/utils.service";
import { SnakbarService } from "../../services/snakbar.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../../orders-module/order-activity-log/order-activity-log.component";
import { language } from "../../language/language.module";
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-estimate-payments",
  templateUrl: "./estimate-payments.component.html",
  styleUrls: ["./estimate-payments.component.scss"],
})
export class EstimatePaymentsComponent implements OnInit {
  @Input() factoryPermission: boolean;
  @Output() trigger = new EventEmitter<any>();
  @Input() viewActivityLogIcon;
  @Input() module;
  @Input() title;
  @Input() getInputValidationTypes;
  @Input() minimizeAll;
  @Input() id;
  @Input() order_Permissions: any;
  @Input() disableEdit;
  @Output() updatedGetViewDetails = new EventEmitter();
  @Input() isEditPermission;
  public language = language;
  public paymentsForm: FormGroup;
  public showPayments: boolean = true;
  public images = Images;
  public undoOnCancel = false;
  public routeId: string = "";
  public headerIcon = ""
  constructor(
    private utilsService: UtilsService,
    private snackbar: SnakbarService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.activatedRoute.params.subscribe((param) => {
      if (param.shipmentId) {
        this.routeId = param.shipmentId;
      } else this.routeId = param.id;
    });
  }
  ngOnChanges(changes) {
    if (changes.minimizeAll) {
      this.showPayments = !this.minimizeAll;
    }
  }
  ngOnInit(): void {
    if(this.title == "Duty Drawback" || this.title == "RoDTEP") {
      this.headerIcon = this.images.duty_drawback
    } else {
      this.headerIcon = this.images.newPaymentIcon
    }
  }
  public editID = "";
  public moduleName = "";
  formEmitEvent(obj: any) {
    this.moduleName = obj.module;
    this.paymentsForm = obj.form;
    this.editID = obj.editID;

    if(!this.isEditPermission) {
      this.paymentsForm.disable();
    } else  if(!this.isEditPermission) {
      this.paymentsForm.enable();
    }
  }
  togglePayments() {
    this.showPayments = !this.showPayments;
  }
  onSubmit = false;
  submmitPayment() {
    this.onSubmit = true;
    let toast: object;
    let param = {
      form_data: this.paymentsForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.routeId,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        if (!this.editID) this.editID = res.data?.new_data?.id;
        this.paymentsForm.markAsPristine();
        toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        this.onSubmit = false;
        if (this.updatedGetViewDetails) this.updatedGetViewDetails.emit();
      } else {
        // this.disabledSave = false;
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.onSubmit = false;
      }
    });
  }
  cancelPayment() {
    this.paymentsForm.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 1000);
  }
  openActivityModal(module): void {
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        module: module,
        id: this.id,
      },
    });
  }
}
