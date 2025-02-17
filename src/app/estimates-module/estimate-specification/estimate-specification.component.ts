import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { UtilsService } from "../../services/utils.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../../orders-module/order-activity-log/order-activity-log.component";

@Component({
  selector: "app-estimate-specification",
  templateUrl: "./estimate-specification.component.html",
  styleUrls: ["./estimate-specification.component.scss"],
})
export class EstimateSpecificationComponent implements OnInit {
  @Input() factoryPermission: boolean;
  @Output() trigger = new EventEmitter<any>();
  @Input() viewActivityLogIcon;
  @Input() module;
  @Input() getInputValidationTypes;
  @Input() minimizeAll = false;
  @Input() id;
  @Input() order_Permissions: any;
  @Input() disableEdit;
  @Output() getOrderDocuments: any = new EventEmitter();
  @Input() isEditPermission;
  public paymentsForm: FormGroup;
  public showPayments: boolean = true;
  public images = Images;
  public undoOnCancel = false;
  public routeId: string = "";
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

  ngOnInit(): void {}
  public editID = "";
  public moduleName = ""
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
      organization_id: this.routeId,
      id: this.editID || "",
      moduleName: this.moduleName
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        this.paymentsForm.markAsPristine();
        toast = {
          msg: res.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.onSubmit = false;
        if (this.getOrderDocuments) {
          this.getOrderDocuments.emit();
        }
      } else {
        // this.disabledSave = false;
        toast = {
          msg: res.message,
          status: "error",
        };
        this.undoOnCancel = true;
        setTimeout(() => {
          this.undoOnCancel = false;
        }, 1000);
        this.paymentsForm.markAsPristine();

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
