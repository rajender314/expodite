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
  FormControl,
  FormArray,
} from "@angular/forms";
import { language } from "../../../language/language.module";
import { ContainerDeleteComponent } from "../../../dialogs/container-delete/container-delete.component";
import { Observable } from "rxjs/Observable";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";

import * as _ from "lodash";

import { Images } from "../../../images/images.module";
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
  selector: "app-incoterm-details",
  templateUrl: "./incoterm-details.component.html",
  styleUrls: ["./incoterm-details.component.scss"],
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
export class IncotermDetailsComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  @Input() shipments;
  @Output() trigger = new EventEmitter<object>();
  @Input() isEditPerm;
  activestate: boolean;
  detailsForm: FormGroup;
  fetchingData: boolean;
  deleteHide: boolean;
  submitShipment: boolean;
  noShipments = true;
  pointerEvent: boolean;
  selectedShipment: any;
  private language = language;
  shipmentData = [];
  newShipAdd = "Add IncoTerm";
  public images = Images;
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  private websitePattern =
    /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  undoOnCancel: boolean;
  viewActivityLogIcon: boolean = false;
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    private adminService: AdminService,
    public dialog: MatDialog,
    private utilsService: UtilsService
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // if(!this.shipmentData){
    //   this.shipmentData = this.shipments;
    // }
    this.noShipments = false;
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.shipments != undefined)
      if (!_.isEmpty(this.shipments)) {
        this.newShipAdd = "Update IncoTerm";
        if (this.shipments.hasOwnProperty("flag")) {
          this.noShipments = true;
          this.deleteHide = true;
          this.selectedShipment = {};
        } else {
          this.deleteHide = false;
          this.noShipments = false;
          this.selectedShipment = this.shipments;
        }
      } else {
        this.pointerEvent = false;

        this.noShipments = false;
        this.newContainer(true);
      }
  }

  ngOnInit() {
    // this.shipmentData = this.shipments;
    let viewActivityLog: boolean;
    this.createForm();
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

  newContainer(flag: boolean): void {
    this.newShipAdd = "Add IncoTerm";
    this.submitShipment = false;
    this.detailsForm.markAsUntouched();
    // console.log(this.detailsForm);
    if (flag) this.detailsForm.reset();
    this.selectedShipment = {};
    this.shipments = {};
    this.fetchingData = false;
    this.deleteHide = true;
    // this.inputEl.nativeElement.focus();
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
      name: [null, [Validators.required, this.noWhitespaceValidator]],
      status: [null, Validators.required],
      id: "",
    });
  }

  cancel(form: any): void {
    this.submitShipment = false;
    this.detailsForm.markAsPristine();
    this.undoOnCancel = true;
    setTimeout(() => {
      this.undoOnCancel = false;
    }, 1000);
  }
  public isUpdating = false;
  createIncoterm(form: any): void {
    this.submitShipment = true;
    let toast: object;
    if (!form.valid) return;
    this.isUpdating = true;
    let param = {
      form_data: form.value.storeCustomAttributes[0],
      id: this.selectedShipment.id || "",
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
        this.trigger.emit({ flag: param.id, data: param.id ? this.selectedShipment :res.data.new_data});
        this.detailsForm.markAsPristine();
      } else {
        toast = {
          msg: res.message ? res.message : "Failed to update",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  selectDetail() {
    this.activestate = true;
  }
  public moduleName = ""
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
        id: this.selectedShipment.id,
      },
    });
  }
}
