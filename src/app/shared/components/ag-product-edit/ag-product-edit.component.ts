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
  selector: "app-ag-product-edit",
  templateUrl: "./ag-product-edit.component.html",
  styleUrls: ["./ag-product-edit.component.scss"],
})
export class AgProductEditComponent implements OnInit {
  // public language = language;
  public productsForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AgProductEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {}
  public editID = "";
  public moduleName  ="";

  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.productsForm = ev.form;
    this.editID = ev.editID;
  }
  emitUploadInfo(ev) {}
  public disabledSave = false;
  editProducts() {
    if (this.data?.tableName == "assign_container") {
      return;
    }
    let param = {
      form_data: this.productsForm.value.storeCustomAttributes[0],
      id: this.editID,
      organization_id: this.data.related_to_id,
      related_to_id: this.data.related_to_id || "",
      module_id: this.data.module_id,
      moduleName: this.moduleName
    };
    let toast: object;
    this.disabledSave = true;

    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        if (this.data.type === "product") {
          toast = { msg: res.message, status: "success" };
        } else toast = { msg: res.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        // this.trigger.closed = true;
        this.dialogRef.close({ success: true });
      } else {
        this.disabledSave = false;
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
