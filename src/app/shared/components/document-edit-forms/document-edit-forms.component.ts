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
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-document-edit-forms",
  templateUrl: "./document-edit-forms.component.html",
  styleUrls: ["./document-edit-forms.component.scss"],
})
export class DocumentEditFormsComponent implements OnInit {
  public id;
  // public language = language;
  public productsForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DocumentEditFormsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private ordersService: OrdersService,
    private activatedRoute: ActivatedRoute,
    private snackbar: SnakbarService,
    private utilsService: UtilsService
  ) {
    this.activatedRoute.params.subscribe((param) => {
      if (param.shipmentId) {
        this.id = param.shipmentId;
      } else this.id = param.id;
    });
  }

  ngOnInit(): void {}

  public editID;
  public moduleName = ""
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.productsForm = ev.form;
    if (ev.editID) this.editID = ev.editID;
  }
  emitUploadInfo(ev) {}
  public disabledSave = false;
  editDocument() {
    let param = {
      form_data: this.productsForm.value.storeCustomAttributes[0],
      id: this.editID ? this.editID : "",
      organization_id: this.data.related_to_id,
      related_to_id: this.data.related_to_id || "",
      moduleName: this.moduleName
    };
    let toast: object;
    this.disabledSave = true;

    this.utilsService.saveStoreAttribute(param).then((res) => {
      if (res.success) {
        toast = { msg: res.message, status: "success" };
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
