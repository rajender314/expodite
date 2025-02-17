import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { ContainerDeleteComponent } from "../../../dialogs/container-delete/container-delete.component";
import { Images } from "../../../images/images.module";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import * as _ from "lodash";
import { AdminService } from "../../../services/admin.service";
import { SnakbarService } from "../../../services/snakbar.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { UtilsService } from "../../../services/utils.service";
import { OrderActivityLogComponent } from "../../../orders-module/order-activity-log/order-activity-log.component";
declare var App: any;
@Component({
  selector: "app-category-details",
  templateUrl: "./category-details.component.html",
  styleUrls: ["./category-details.component.scss"],
  providers: [AdminService, SnakbarService],
  animations: [
    trigger("AdminDetailsAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.8)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class CategoryDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() category;
  @Output() trigger = new EventEmitter<object>();
  @Input() isEditPerm;

  detailsForm: FormGroup;
  fetchingData: boolean;
  deleteHide: boolean;
  submitcategory: boolean;
  noCategory = true;
  pointerEvent: boolean;
  selectedCategory: any;
  private language = language;
  addCategory = "Add Category";
  private images = Images;
  status = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  public selectedtype;
  undoOnCancel: boolean;
  public viewActivityLogIcon: boolean = false;
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    let viewActivityLog: boolean;
    console.log(changes);
    this.noCategory = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.category != undefined)
      if (!_.isEmpty(this.category)) {
        this.addCategory = "Update Category";
        this.detailsForm.reset();
        if (this.category.hasOwnProperty("flag")) {
          this.noCategory = true;
          this.deleteHide = true;
          this.selectedCategory = {};
        } else {
          this.deleteHide = false;
          this.noCategory = false;
          this.fetchingData = false;
          this.selectedCategory = this.category;
        }
      } else {
        this.pointerEvent = false;

        this.noCategory = false;
        this.newContainer(true);
      }
    setTimeout(() => {
      let admin_profile: boolean;
      App.user_roles_permissions.map(function (val) {
        if (val.code == "activity_log") {
          if (val.selected) {
            viewActivityLog = true;
          } else {
            viewActivityLog = false;
          }
        }
      });
      this.viewActivityLogIcon = viewActivityLog;
    });
  }

  ngOnInit() {
    this.createForm();
  }

  newContainer(flag: boolean): void {
    this.submitcategory = false;
    this.addCategory = "Add Category";
    this.inputEl?.nativeElement.focus();
    if (flag) this.selectedCategory = {};
    this.category = {};
    this.fetchingData = false;
    this.deleteHide = true;
    //
    this.detailsForm.patchValue({
      name: "",
      status: true,
      description: "",
    });
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  public noWhitespaceValidator(control: FormControl) {
    //console.log('fergrege');
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  createForm(): void {
    this.detailsForm = this.fb.group({
      name: [null, [Validators.required, this.noWhitespaceValidator]],
      status: [null, Validators.required],
      description: [null],
      id: "",
    });
  }

  cancel(form: any): void {
    this.submitcategory = false;
    this.detailsForm.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 1000);
  }
  public isUpdating = false;
  createCategory(form: any): void {
    let toast: object;
    if (!form.valid) return;
    this.isUpdating = true;
    setTimeout(() => {
      let param = {
        form_data: form.value.storeCustomAttributes[0],
        id: this.selectedCategory.id || "",
        moduleName: this.moduleName
      };
      this.utilsService.saveStoreAttribute(param).then((res) => {
        this.isUpdating = false;
        if (res.success) {
          toast = {
            msg: res.message,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.trigger.emit({ flag: param.id, data: param.id ? this.selectedCategory :res.data.new_data});
          this.detailsForm.markAsPristine();
        } else {
          toast = {
            msg: res.message ? res.message : "Failed to Update",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      });
    }, 500);
  }
  public moduleName = "";
  formEmitEvent(ev) {
    this.moduleName = ev.module;
    this.detailsForm = ev.form;
    if(this.isEditPerm) {
      this.detailsForm.enable();
      } else {
        this.detailsForm.disable();
      }
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
        id: this.selectedCategory.id,
      },
    });
  }
}
