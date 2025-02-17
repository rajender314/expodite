import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
  Injectable,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { OrdersService } from "../../../services/orders.service";
import { SnakbarService } from "../../../services/snakbar.service";
import { UtilsService } from "../../../services/utils.service";

@Component({
  selector: "app-create-container",
  templateUrl: "./create-container.component.html",
  styleUrls: ["./create-container.component.scss"],
})
export class CreateContainerComponent implements OnInit {
  // public language = language;
  public productsForm: FormGroup;
  public showCheckBox = false;

  constructor(
    public dialogRef: MatDialogRef<CreateContainerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showCheckBox = true;
    }, 1000);
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.productsForm = ev.form;
  }

  selectedPackages = [];

  triggerGridEvent(ev) {
    console.log(ev);
    if (ev.eventName == "select-rows") {
      this.selectedPackages = ev.selectedRows.map((row) => row.package_id);
    }
  }

  emitUploadInfo(ev) {}
  public disabledSave = true;
  editProducts() {
    let param: any = {
      meta_data: this.productsForm.value.storeCustomAttributes[0],
      // id: this.data.rowData ? this.data.rowData.id : "",
      // organization_id: this.data.related_to_id,
      related_to_id: this.data.related_to_id || "",
      package_ids: this.selectedPackages,
      moduleName: this.moduleName,
    };
    if (this.data?.rowData?.container_id) {
      param.id = this.data.rowData.container_id;
    }
    let toast: object;
    console.log(param);

    this.disabledSave = true;

    this.ordersService.createContainer(param).then((res) => {
      if (res.result.success) {
        toast = { msg: res.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        // this.trigger.closed = true;
        this.dialogRef.close({ success: true });
      } else {
        this.disabledSave = false;
        toast = {
          msg: res.result.message ? res.result.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
