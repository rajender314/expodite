import { AdminService } from "./../../services/admin.service";
import { Param } from "./../../custom-format/param";
import { Component, OnInit, Output, EventEmitter, Inject } from "@angular/core";
import { MatDatepicker } from "@angular/material/datepicker";
import * as _ from "lodash";
import { InventoryService } from "../../services/inventory.service";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { UtilsService } from "../../services/utils.service";
import { SnakbarService } from "../../services/snakbar.service";

@Component({
  selector: "app-add-inventory",
  templateUrl: "./add-inventory.component.html",
  styleUrls: ["./add-inventory.component.scss"],
  providers: [InventoryService],
})
export class AddInventoryComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  public submitForm: boolean = false;
  public InventoryForm: FormGroup;
  maxDate = new FormControl(new Date());
  minDate = new Date();
  public batchServerError: string = "";
  private param: Param = {
    page: 0,
    perPage: 25,
    sort: "ASC",
    search: "",
  };

  public maxDate1 = {
    expiry_date: "",
  };
  public selectedtype;
  public minDate1 = {
    start_date: new Date(),
    expiry_date: new Date(),
  };

  public prefillExpData;
  public disableBtn = false;

  constructor(
    private formBuilder: FormBuilder,
    private InventoryService: InventoryService,
    public dialog: MatDialog,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<AddInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {}
  clearServerError(): void {
    // console.log(123)
    this.batchServerError = "";
  }
  public showProdError = false;
  public showSpinner = false;
  public disabledSave = false;
  addInventory(form: any): void {
    let toast: object;
    this.submitForm = true;
    this.disableBtn = true;
    if (!form.valid) return;
    this.showSpinner = true;
    this.disabledSave = true;
    this.InventoryForm.disable();
    let param: any = {
      form_data: this.InventoryForm.value.storeCustomAttributes[0],
      organization_id:
        this.InventoryForm.value.storeCustomAttributes[0].products_id.id,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(param).then((res) => {
      this.disableBtn = false;
      if (res.success) {
        setTimeout(() => {
          this.trigger.closed = true;
          this.dialogRef.close({ success: true, response: res.data.new_data });
          this.showSpinner = false;
          this.disabledSave = false;
        }, 1000);
      } else {
        this.InventoryForm.enable();
        toast = {
          msg: res.message ? res.message : "Unable to Update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.showSpinner = false;
        this.disabledSave = false;
      }
    });
  }

  openCalendar(picker: MatDatepicker<Date>) {
    // console.log(picker)
    picker.open();
  }

  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.InventoryForm = ev.form;
  }
}
