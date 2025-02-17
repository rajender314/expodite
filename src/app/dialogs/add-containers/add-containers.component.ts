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
  Inject,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Observable } from "rxjs/Observable";
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

import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
  state,
} from "@angular/animations";
import { MatSelect } from "@angular/material/select";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import { Images } from "../../images/images.module";
import { language } from "../../language/language.module";
import { ContainerDeleteComponent } from "../container-delete/container-delete.component";
import { OrdersService } from "../../services/orders.service";
import { OrdersComponent } from "../../orders-module/orders/orders.component";
import { CustomValidation } from "../../custom-format/custom-validation";

@Component({
  selector: "app-add-containers",
  templateUrl: "./add-containers.component.html",
  styleUrls: ["./add-containers.component.scss"],
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
export class AddContainersComponent implements OnInit {
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
  public containerForm: FormGroup;
  public containerItem: FormArray;
  addContainers = "Add Packaging";
  public selectUnits = "";
  public createbtnDisabled: boolean = false;
  public language = language;
  public containersList = [];
  public containersData = [];
  status: Array<object> = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
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
  public showSpinner = false;
  public disableSubmit: boolean = false;
  // public disableAddRows:boolean = true;
  public quantityErr: boolean = false;
  public addedWeight: number = 0;
  public remainingWeight: number = 0;
  public isQuantityValid: boolean = false;
  public palletType: boolean = true;
  public batchesList = [];
  batchError: boolean = false;
  isLoading: boolean = true;
  public batch_Exp_status: boolean = false;
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    public ordersService: OrdersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.fetchingData = true;
    setTimeout(() => {
      this.fetchingData = false;
    }, 300);
    if (this.containers != undefined)
      if (!_.isEmpty(this.containers)) {
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
    console.log(this.data);
    this.createForm();
    if (this.data.containerId) {
      // this.setForm(this.data);
    }
    this.generateContainerDynamicForm();
    this.getContainers(this.param, "pagination");
    this.containerForm = new FormGroup({
      containerItem: new FormArray([]),
    });

    if (this.data.containers.length) {
      this.data.containers.forEach((element) => {
        element.name = element.container_name_new;
        element.quantity = element.container_quantity;
        element.uom_id = element.container_uom_id;
        element.tare_weight = element.tar_weight;
        element.selectUnits = element.container_uom_name;
        // element.net_weight = element.quantity*element.type_name*element.unit_weight;
        this.addedWeight += element.palletType
          ? element.primary_quantity * element.quantity_type * element.quantity
          : element.quantity_type * element.quantity;
      });
      this.containerForm.get("containerItem").value.push(this.data.containers);
      this.data.containers.forEach((element) => {
        this.addContainerRows(element);
      });
      this.remainingWeight =
        this.data.product.product_quantity - this.addedWeight;
    } else {
      this.addContainerRows();
    }
    if (this.data.flag == "edit") {
      this.addContainers = "Edit Packaging";
    }
    this.isQuantityValid =
      this.data.product.product_quantity == this.addedWeight;
    this.containerForm.valueChanges.subscribe(() => {
      this.addedWeight = 0;
      this.containerItem.value.forEach((value) => {
        this.addedWeight += value.palletType
          ? value.primary_quantity * value.quantity_type * value.quantity
          : value.quantity_type * value.quantity;
      });
      this.remainingWeight =
        this.data.product.product_quantity - this.addedWeight;
      this.isQuantityValid =
        this.data.product.product_quantity == this.addedWeight;
    });

    if (this.data.product.batch_exists) {
      this.getBatchData();
    }
  }
  validateDecimal(event) {
    var regex = new RegExp("^\\d{0,8}(\\.\\d{0,2})?$");
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.substring(
        0,
        event.target.value.length - 1
      );
    }
  }
  validatelegth(event) {
    let numberRegex = /[0-9]/g;

    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      var regex = new RegExp("^\\d{0,5}?$");
      if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.substring(
          0,
          event.target.value.length - 1
        );
      }
      // this.validatebatchQty();
      this.updateBatchQty();
    } else {
      return false;
    }
  }
  validateLength(event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
    } else {
      return false;
    }
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

  selectType(event, formIndex) {
    const index = _.findIndex(this.adminService.uomData, { id: event.value });
    this.selectUnits = this.adminService.uomData[index].name;
    const data = this.containerItem.value[formIndex];
    this.containerItem.at(formIndex).patchValue({
      selectUnits: data && this.selectUnits ? this.selectUnits : "",
    });
  }

  newContainer(flag: boolean): void {
    if (flag) this.detailsForm.reset();
    this.selectedContainer = {};
    this.addContainers = "Add Packaging";
    this.containers = {};
    this.fetchingData = false;
    this.deleteHide = true;
  }

  setDirty(): void {
    this.detailsForm.markAsDirty();
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  createForm(): void {
    this.detailsForm = this.fb.group({
      name: [null, [Validators.required]],
      quantity_type: ["", Validators.required],
      quantity: [null, Validators.required],
      uom_id: [null, Validators.required],
      height: ["", Validators.required],
      weight: ["", Validators.required],
      dimensions: ["", Validators.required],
      tare_weight: ["", Validators.required],
      net_weight: [null],
      // unit_weight: ["", Validators.required],
      inner_description: [null],
      batch_id: [
        "",
        this.data.product.batch_exists ? Validators.required : null,
      ],
    });
  }

  cancel(form: any): void {
    this.submitContainers = false;
    form.markAsPristine();
    this.setForm(this.selectedContainer);
    // this.detailsForm.reset();
  }

  createContainer(form) {
    if (form.valid) {
      this.fetchingData = true;
      this.createbtnDisabled = true;
      this.submitContainers = true;
      this.showSpinner = true;
      let container = {};
      this.validateContainers();
      if (!this.isContainersValid()) return false;
      // container["batch_id"] = this.containerItem.value[0].batch_id || 0;
      container["batch_id"] = 0;
      this.containerItem.value.forEach((value) => {
        value.container_types_id = 0;
      });
      container["container"] = this.containerItem.value;
      this.containersData.push(container);
      let param = {
        orders_products_id: this.data.product.order_product_id,
        packing_id: this.data.container,
        orders_id: this.data.selectedOrder.id,
        container: this.containersData,
        deleted_containers: this.deleted_container,
      };
      this.ordersService
        .saveBatchNumber(param)
        .then((response) => {
          this.showSpinner = false;
          let toast: object;
          if (response.result.success) {
            this.noContainers = false;
            this.submitContainers = false;
            this.fetchingData = false;
            toast = { msg: response.result.message, status: "success" };
          } else {
            toast = { msg: response.result.message, status: "error" };
            this.fetchingData = false;
            this.createbtnDisabled = false;
          }
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close({ success: true, result: response });
        })
        .catch((error) => console.log(error));
    }
  }

  setForm(data: any): void {
    this.detailsForm.setValue({
      name: data && data.name ? data.name : "",
      quantity_type: data && data.quantity_type ? data.quantity_type : "",
      quantity: data && data.quantity ? data.quantity : "",
      uom_id: data && data.uom_id ? data.uom_id : "",
      height: data && data.height ? data.height : "",
      weight: data && data.weight ? data.weight : "",
      dimensions: data && data.dimensions ? data.dimensions : "",
      tare_weight: data && data.tar_weight ? data.tar_weight : "",
      net_weight: data && data.net_weight ? data.net_weight : "",
      unit_weight: data && data.unit_weight ? data.unit_weight : "",
      inner_description:
        data && data.inner_description ? data.inner_description : "",
      batch_id: data && data.batch_id ? data.batch_id : "",
    });

    if (data.container_id == undefined) {
      this.addContainers = "Add Packaging";
      this.nameField?.focus();
    } else {
      this.addContainers = "Update Packaging";
    }

    this.selectUnits =
      data && data.uom_id && data.container_uom_name
        ? data.container_uom_name
        : "";
    const index = _.findIndex(this.adminService.uomData, { id: data.uom_id });
    if (index > -1) {
      this.selectUnits = this.adminService.uomData[index].name;
    }
  }
  maxValueValidator(maxValue: number) {
    return (control: FormControl) => {
      const value = control.value;
      if (value !== null && value > maxValue) {
        return {
          maxValue: true,
          message: `Maximum value allowed is ${maxValue}`,
        };
      }
      return null;
    };
  }

  generateContainerDynamicForm(item?): FormGroup {
    return this.fb.group({
      batch_id: [
        item?.batch_id != undefined
          ? item.batch_id
          : this.data.product.batch_exists
          ? null
          : 0,
        this.data.product.batch_exists ? Validators.required : null,
      ],
      quantity_type: [
        item?.quantity_type != undefined ? item.quantity_type : "",
        [
          Validators.required,
          // Validators.pattern(/^[0-9]+$/),
          Validators.pattern(/^[0-9]{1,10}(\.[0-9]{1,4})?$/),
          this.maxValueValidator(1000000),
          Validators.min(0.01),
        ],
      ],
      name: [
        item?.name != undefined ? item.name : "",
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          CustomValidation.nameValidator,
        ],
      ],
      quantity: [
        item?.quantity != undefined ? item.quantity : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.maxValueValidator(65000),
          Validators.min(0.01),
        ],
      ],
      uom_id: [
        item?.uom_id != undefined ? item.uom_id : "",
        Validators.required,
      ],
      height: [
        item?.height != undefined ? item.height : "",
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
        ],
      ],
      weight: [
        item?.weight != undefined ? item.weight : "",
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
        ],
      ],
      dimensions: [
        item?.dimensions != undefined ? item.dimensions : "",
        [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
        ],
      ],
      tare_weight: [
        item?.tare_weight != undefined ? item.tare_weight : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,8}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      // unit_weight: [item?.unit_weight != undefined ? item.unit_weight : '',Validators.required],
      net_weight: [
        item?.net_weight != undefined ? item.net_weight : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,8}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      inner_description:
        item?.inner_description != undefined ? item.inner_description : "",
      selectUnits: item?.selectUnits != undefined ? item.selectUnits : "",
      palletType: [
        item?.palletType !== undefined ? item.palletType : false,
        this.getRequiredValidator(item?.palletType),
      ],
      primary_quantity: [
        item?.primary_quantity != undefined ? item.primary_quantity : "",
        this.getRequiredValidatornumber(item?.primary_quantity),
      ],
      primary_tare_weight: [
        item?.primary_tare_weight != undefined ? item.primary_tare_weight : "",
        this.getRequiredValidatorprimaryTare(item?.primary_tare_weight),
      ],
      primary_net_weight: [
        item?.primary_net_weight != undefined ? item.primary_net_weight : "",
      ],
      total_net_weight: [
        item?.total_net_weight != undefined ? item.total_net_weight : "",
      ],
      total_gross_weight: [
        item?.total_gross_weight != undefined ? item.total_gross_weight : "",
      ],
      gross_weight: [item?.gross_weight != undefined ? item.gross_weight : ""],
      container_id: [item?.container_id != undefined ? item.container_id : 0],
    });
  }
  getRequiredValidator(isPalletTypeTrue: boolean) {
    return isPalletTypeTrue ? [Validators.required] : [];
  }
  getRequiredValidatornumber(isPalletTypeTrue: boolean) {
    return isPalletTypeTrue
      ? [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          this.maxValueValidator(65000),
          Validators.min(0.01),
        ]
      : [];
  }
  getRequiredValidatorprimaryTare(isPalletTypeTrue: boolean) {
    return isPalletTypeTrue
      ? [
          Validators.required,
          Validators.min(0.01),
          Validators.pattern(/^[0-9]{1,8}(\.[0-9]{1,4})?$/),
        ]
      : [];
  }

  addContainerRows(item?) {
    this.containerItem = this.containerForm.get("containerItem") as FormArray;
    if (!this.containerItem) {
      this.containerForm
        .get("containerItem")
        .value.push(this.generateContainerDynamicForm(item));
    } else {
      this.validateContainers();
      // if (!this.quantityErr) {
      this.containerItem.push(this.generateContainerDynamicForm(item));
      // }
    }
  }

  validateContainers() {
    let totalqty = 0;
    this.containerItem.value.forEach((value) => {
      totalqty += value.palletType
        ? value.primary_quantity * value.quantity_type * value.quantity
        : value.quantity_type * value.quantity;
      value.container_types_id = 0;
      value.primary_net_weight = value.quantity * value.net_weight;
      value.total_net_weight = value.palletType
        ? value.primary_quantity * (value.quantity * value.net_weight)
        : value.net_weight * value.quantity;
      value.total_gross_weight = value.palletType
        ? value.primary_quantity *
          (+(value.quantity * value.tare_weight) +
            +value.primary_tare_weight +
            +value.net_weight * value.quantity)
        : value.quantity * value.tare_weight +
          +value.net_weight * value.quantity;
      value.gross_weight = value.palletType
        ? value.quantity * value.tare_weight +
          +value.primary_tare_weight +
          +value.net_weight * value.quantity
        : +value.tare_weight + +value.net_weight;
    });
    this.quantityErr = false;
  }
  public deleted_container = [];

  deleteRow(index) {
    this.containerItem.removeAt(index);
    if (this.data.containers[index]) {
      this.deleted_container.push(this.data.containers[index].container_id);
    }
    this.updateBatchQty();
  }

  isContainersValid(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index < this.containerForm.get("containerItem")["controls"].length;
      index++
    ) {
      if (!this.containerForm.get("containerItem")["controls"][index].valid) {
        // isvalid = false;
      }
    }
    return isvalid;
  }

  changePackageType(event, formIndex): void {
    this.palletType = event.checked;
    this.generateContainerDynamicForm();
    // this.containerForm.reset();
    this.containerItem.at(formIndex).setValue({
      quantity_type: "",
      name: "",
      quantity: null,
      uom_id: null,
      height: null,
      weight: null,
      dimensions: null,
      tare_weight: null,
      net_weight: null,
      inner_description: null,
      selectUnits: "",
      palletType: event.checked,
      primary_quantity: null,
      primary_tare_weight: null,
      primary_net_weight: null,
      total_net_weight: null,
      total_gross_weight: null,
      gross_weight: null,
      batch_id: this.data.product.batch_exists ? null : 0,
    });

    let primaryQuntityControl = this.containerItem
      .at(formIndex)
      .get("primary_quantity");

    let primaryTareWeightControl = this.containerItem
      .at(formIndex)
      .get("primary_tare_weight");

    if (!event.checked) {
      primaryQuntityControl.clearValidators();

      primaryQuntityControl.updateValueAndValidity();

      primaryTareWeightControl.clearValidators();

      primaryTareWeightControl.updateValueAndValidity();
    } else {
      primaryQuntityControl.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]+$/),
        this.maxValueValidator(65000),
        Validators.min(0.01),
      ]);
      primaryQuntityControl.updateValueAndValidity();

      primaryTareWeightControl.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^[0-9]{1,8}(\.[0-9]{1,4})?$/),
      ]);
      primaryTareWeightControl.updateValueAndValidity();
    }

    this.updateBatchQty();
  }
  public batchQty = new Map();
  dupBatchQty = new Map();
  async getBatchData() {
    const response = await this.ordersService.getProcuctBatches(
      this.data.product.products_types_id
    );
    let dummySet = new Set();
    if (response.result.success && response.result.data.length) {
      if (this.data.flag === "edit") {
        response.result.data.forEach((item) => {
          this.data.containers.forEach((container) => {
            if (
              item.remain_quan > 0 &&
              !item.is_expired &&
              item.code === "active"
            ) {
              dummySet.add(item);
            } else {
              if (container.batch_id === item.id) {
                dummySet.add(item);
              }
            }
          });
        });
        this.batchesList = Array.from(dummySet);
      } else {
        response.result.data.forEach((item) => {
          if (
            item.remain_quan > 0 &&
            !item.is_expired &&
            item.code === "active"
          )
            this.batchesList.push(item);
        });
      }

      this.batchesList?.forEach((item) => {
        this.batchQty.set(item.id, parseFloat(item.remain_quan));
        this.dupBatchQty.set(item.id, parseFloat(item.remain_quan));
      });
    }

    if (this.containerItem.value.length) {
      this.containerItem.value.forEach((value) => {
        if (value.batch_id) {
          // this.batchQty.set(
          //   value.batch_id,
          //   this.batchQty.get(value.batch_id) +
          //     value.quantity * value.quantity_type
          // );
          this.dupBatchQty.set(
            value.batch_id,
            this.dupBatchQty.get(value.batch_id) +
              parseFloat(value.quantity) * parseFloat(value.quantity_type)
          );
        }
      });
      this.updateBatchQty();
    }
    this.isLoading = false;
  }
  showRemainQty = false;
  onBatchClick() {
    if (this.showRemainQty) {
      this.showRemainQty = false;
    } else this.showRemainQty = true;
  }

  // validatebatchQty() {
  //   // console.log(this.containerForm.get("containerItem")["controls"], 456);
  // }

  updateBatchQty(): void {
    if (this.batchQty.size && this.data.product.batch_exists) {
      this.batchQty = new Map(this.dupBatchQty);
      this.containerItem.value.forEach((value) => {
        let totalQty = parseFloat(this.batchQty.get(value.batch_id));
        let remainQty: number =
          totalQty -
          parseFloat(value.quantity || "0") *
            parseFloat(value.quantity_type || "0") *
            (value.palletType ? parseFloat(value.primary_quantity || 0) : 1);
        this.batchQty.set(value.batch_id, remainQty);
      });

      this.containerItem.value.some((value) => {
        if (value.batch_id) {
          let selectedBatch = this.batchesList.find(
            (batch) => batch.id === value.batch_id
          );

          if (selectedBatch.is_expired || selectedBatch.code === "inactive") {
            this.batch_Exp_status = true;
            return true;
          } else {
            this.batch_Exp_status = false;
            return false;
          }
        }
      });

      if (!this.batch_Exp_status) {
        [...this.batchQty.values()].some((value) => {
          if (value < 0) {
            this.batchError = true;
            return true;
          } else {
            this.batchError = false;
            return false;
          }
        });
      }
    }
  }

  batchQuantityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const batchId = control.value;
      if (this.batchQty.get(batchId) <= 0 && this.data.product.batch_exists) {
        return { batchQuantityExceeded: true };
      }
      return null;
    };
  }

  onBatchChange() {
    this.updateBatchQty();
    // this.onBatchClick();
  }

  onBatchExpired(batchId) {
    if (this.batchesList.length && batchId) {
      return this.batchesList.find((batch) => batch.id === batchId).is_expired;
    } else return false;
  }

  onBatchStatus(batchId) {
    if (this.batchesList.length && batchId) {
      return (
        this.batchesList.find((batch) => batch.id === batchId).code ===
        "inactive"
      );
    } else return false;
  }
}
