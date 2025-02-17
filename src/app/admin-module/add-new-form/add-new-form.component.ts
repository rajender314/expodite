import { Component, Inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from "@angular/material/dialog";
import { AdminService } from "../../services/admin.service";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";

@Component({
  selector: "app-add-new-form",
  templateUrl: "./add-new-form.component.html",
  styleUrls: ["./add-new-form.component.scss"],
})
export class AddNewFormComponent implements OnInit {
  public images = Images;
  private disableField: boolean = false;
  public submitForm: boolean = false;
  formFields: any;
  public attributeForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private adminService: AdminService,
    public dialogRef: MatDialogRef<AddNewFormComponent>,
    private snackbar: SnakbarService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.getAllFormFieldTypes();
    this.attributeForm = this.formBuilder.group({
      form_name: ["", Validators.required],
      attributes: this.formBuilder.array([this.createItem()]),
    });

    this.attributeForm.valueChanges.subscribe((val) => {
      // console.log(val)
    });
  }
  getAllFormFieldTypes() {
    let param = [];
    this.adminService.allforrmFields(param).then((res) => {
      this.formFields = res.result.data.items;
    });
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { whitespace: true };
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      label_name: ["", Validators.required],
      form_element_id: ["", Validators.required],
    });
  }
  get attributes() {
    return this.attributeForm.get("attributes") as FormArray;
  }
  addForm(form: any) {
    let toast = {};
    this.adminService
      .createNewForm(form.value)
      .then((res) => {
        console.log(res);
        if (res.result.success) {
          console.log(res);
          this.dialogRef.close({ success: true });
          toast = { msg: "Form Added Successfully...", status: "success" };
          this.snackbar.showSnackBar(toast);
        } else {
          toast = { msg: res.result.success, status: "error" };
          this.snackbar.showSnackBar(toast);
          console.error(res.result.success);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(form.value, 456);
  }
  addRow(index) {
    if (index !== undefined && index >= 0 && index <= this.attributes.length) {
      this.attributes.insert(index + 1, this.createItem());
    } else {
      this.attributes.push(this.createItem());
    }
  }
  removeRow(index) {
    this.attributes.removeAt(index);
  }
}
