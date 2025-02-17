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
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { ContainerDeleteComponent } from "../../../dialogs/container-delete/container-delete.component";
import { Observable } from "rxjs/Observable";
import { Images } from "../../../images/images.module";
import { VERSION } from "@angular/material/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  MatSlideToggleModule,
  MatSlideToggleChange,
} from "@angular/material/slide-toggle";

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
import { MatSelect } from "@angular/material/select";

@Component({
  selector: "app-containers-details",
  templateUrl: "./containers-details.component.html",
  styleUrls: ["./containers-details.component.scss"],
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
export class ContainersDetailsComponent implements OnInit {
  //@ViewChild("myInput") inputEl: ElementRef;
  @ViewChild("myInput", { static: false }) nameField: MatSelect;
  @Input() containers;
  @Output() trigger = new EventEmitter<object>();
  public images = Images;
  detailsForm: FormGroup;
  fetchingData: boolean;
  submitContainers: boolean;
  deleteHide: boolean;
  noContainers = true;
  pointerEvent: boolean;
  selectedContainer: any;
  enableInput: boolean;
  addContainers = "Add Package";
  public selectUnits = "";
  private language = language;
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  // UOM_list: Array<object> = [
  //   { id: 'mm', value: 'mm', param: true },
  //   { id: 'cm', value: 'cm', param: false },
  //   { id: 'feet', value: 'feet', param: false }
  // ];
  Crate;
  Carton;
  Drum;
  Container;
  private param = {
    page: 1,
    perPage: 5,
    sort: "ASC",
    search: "",
  };
  public packageDrpdown = [];
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // this.noContainers = false;
    this.fetchingData = true;
    //  console.log(this.containers)
    //  console.log("vgsdg")
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.containers != undefined)
      if (!_.isEmpty(this.containers)) {
        // this.addContainers = "Update Package"
        this.detailsForm.reset();
        if (this.containers.hasOwnProperty("flag")) {
          this.noContainers = true;
          this.deleteHide = true;
          this.selectedContainer = {};
        } else {
          this.enableInput = true;
          this.deleteHide = false;
          this.noContainers = false;
          this.fetchingData = false;
          this.selectedContainer = this.containers;
          // console.log(this.containers)
          this.setForm(this.containers);
        }
      } else {
        this.enableInput = false;
        this.pointerEvent = false;

        this.noContainers = false;
        this.newContainer(true);
      }
  }

  ngOnInit() {
    // console.log(this.adminService)
    this.createForm();
    this.getContainers(this.param, "pagination");
  }

  getContainers(param: object, flag?: string, cb?): void {
    this.adminService
      .getContainersList(param)
      .then((response) => {
        if (response.result.success) {
          this.adminService.uomData = response.result.data.uom_dt;
          this.packageDrpdown = response.result.data.package_dt;
        }
      })
      .catch((error) => console.log(error));
  }

  selectType(event) {
    // console.log(event)

    const index = _.findIndex(this.adminService.uomData, { id: event.value });
    // console.log(index)
    this.selectUnits = this.adminService.uomData[index].name;
  }

  newContainer(flag: boolean): void {
    console.log(25);
    if (flag) this.detailsForm.reset();
    this.selectedContainer = {};
    this.addContainers = "Add Package";
    this.containers = {};
    this.fetchingData = false;
    this.deleteHide = true;
    //this.inputEl.nativeElement.focus()
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  public noWhitespaceValidator(control: FormControl) {
    // console.log('fergrege');
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      container_id: [null, [Validators.required]],
      type_name: ["", Validators.required],
      height: ["", Validators.required],
      weight: ["", Validators.required],
      dimensions: ["", Validators.required],
      status: [null, Validators.required],
      uom_id: [null, Validators.required],
      description: "",
      inner_description: [null],
      tare_weight: ["", Validators.required],
    });
  }

  cancel(form: any): void {
    this.submitContainers = false;
    form.markAsPristine();
    this.setForm(this.selectedContainer);
    // this.detailsForm.reset();
  }

  createContainer(form: any): void {
    //  console.log(form)
    let toast: object;
    this.submitContainers = true;
    if (!form.valid) return;
    let param = Object.assign({}, form.value);
    param.id = this.selectedContainer ? this.selectedContainer.id : 0;
    this.adminService
      .addContainer(param)
      .then((response) => {
        if (response.result.success) {
          this.noContainers = false;
          this.submitContainers = false;
          form.markAsPristine();
          if (param.id)
            toast = {
              msg: "Package Type Updated Successfully.",
              status: "success",
            };
          else
            toast = {
              msg: "Package Type Added Successfully.",
              status: "success",
            };
          this.selectedContainer = response.result.data.ContainersDt[0];

          this.trigger.emit({ flag: param.id, data: this.selectedContainer });
        } else {
          toast = { msg: response.result.message, status: "error" };
        }
        this.snackbar.showSnackBar(toast);
      })
      .catch((error) => console.log(error));
  }

  deleteContainer(form: any): void {
    let toast: object;
    let dialogRef = this.dialog.open(ContainerDeleteComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      disableClose: true,
      // height: '240px',
      data: this.detailsForm.value,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.adminService
          .deleteContainer({ id: this.selectedContainer.id })
          .then((response) => {
            if (response.result.success) {
              form.markAsPristine();
              if (this.selectedContainer.id)
                toast = { msg: response.result.message, status: "success" };
              else toast = { msg: response.result.message, status: "success" };
              this.trigger.emit({
                flag: this.selectedContainer.id,
                delete: true,
                data: this.selectedContainer,
              });
            } else {
              toast = { msg: response.result.message, status: "error" };
            }
            this.snackbar.showSnackBar(toast);
          })
          .catch((error) => console.log(error));
      }
    });
  }

  setForm(data: any): void {
    //  console.log(data)
    this.detailsForm.setValue({
      container_id: data && data.container_id ? data.container_id : "",
      status: data.status,
      type_name: data && data.type_name ? data.type_name : "",
      height: data && data.height ? data.height : "",
      weight: data && data.weight ? data.weight : "",
      dimensions: data && data.dimensions ? data.dimensions : "",
      description: data && data.description ? data.description : "",
      inner_description:
        data && data.inner_description ? data.inner_description : "",
      tare_weight: data && data.tare_weight ? data.tare_weight : "",
      uom_id: data && data.uom_id ? data.uom_id : "",
    });

    if (data.container_id == undefined) {
      this.addContainers = "Add Package";
      console.log(this.nameField);
      this.nameField?.focus();
    } else {
      this.addContainers = "Update Package";
    }

    this.selectUnits = data && data.uom_id ? data.uom_name : "";
    const index = _.findIndex(this.adminService.uomData, { id: data.uom_id });

    if (index > -1) {
      this.selectUnits = this.adminService.uomData[index].name;
    }

    // console.log(this.selectUnits)
  }
}
