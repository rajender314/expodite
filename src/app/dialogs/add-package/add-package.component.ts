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
  AfterViewChecked,
  AfterViewInit,
  DoCheck,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
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
declare var App: any;
@Component({
  selector: "add-package",
  templateUrl: "./add-package.component.html",
  styleUrls: ["./add-package.component.scss"],
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
export class AddPackageComponent implements OnInit, DoCheck {
  @ViewChild("myInput", { static: false }) nameField: MatSelect;
  @Input() containers;
  @Input() productsCount;
  @Output() trigger = new EventEmitter<object>();
  // @Output() calTotalQuantity = new EventEmitter<object>();
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
  public selectedProduct;
  submmitButton: boolean = true;
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
  public items = new Map();
  public showSpinner = false;
  public disableSubmit: boolean = false;
  // public disableAddRows:boolean = true;
  public quantityErr: boolean = false;
  public addedWeight: number = 0;
  public remainingWeight: number = 0;
  public isQuantityValid: boolean = false;
  public palletType: boolean = true;
  productsDynamicForm: FormGroup;
  public productItem: FormArray;
  public productsData;
  public product_name;
  public productError: boolean = false;
  productDetailserror;
  public itemName;
  public newItemIcon: string =
    App.base_url + "dashboard/assets/images/new-plus.png";
  public clickedProduct;
  public editProducts;
  public disableAddbtn = true;
  firstTime = true;
  constructor(
    private fb: FormBuilder,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    public ordersService: OrdersService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngDoCheck(): void {
    this.validateSelectedProducts();

    if (this.selectedItems.size && this.firstTime) {
      this.selectedItems.forEach((item) => {
        if (this.items.has(item)) {
          this.items.delete(item);
        }
      });
      this.formValidation();
      this.firstTime = false;
      if (this.items.size == 1 && this.data.packing_id)
        this.excesedQty.set("addBtn", true);
    }
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }

  editProdutsDetails() {
    this.editProducts = new Map();
    this.productsData[0]?.products?.length &&
      this.productsData[0]?.products?.some((e) => {
        if (this.data.packing_id) this.editProducts.set(e.name, e.quantity);
        else this.editProducts.set(e.name, 0);
      });
  }

  formValidation(type?: string) {
    this.productItem?.value?.length &&
      this.productItem.value.some((item) => {
        if (item.id == "") {
          // this.excesedQty.set(item.id, false);
          this.excesedQty.set("addBtn", false);
          this.excesedQty.set("submit", false);
          return true;
        } else {
          // this.excesedQty.set(item.id, true);
          if (item.quantity == "" || isNaN(item.quantity)) {
            this.excesedQty.set("submit", false);
            this.excesedQty.set("addBtn", false);
            return true;
          } else {
            this.excesedQty.set("addBtn", true);
            this.excesedQty.set("submit", true);
          }
        }
        if (type != "delete" && this.items.size <= 1) {
          this.excesedQty.set("addBtn", false);
        }
      });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    // this.fetchingData = true;
    setTimeout(() => {
      // this.fetchingData = false;
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
          // this.fetchingData = false;
          this.selectedContainer = this.containers;
        }
      } else {
        this.enableInput = false;
        this.pointerEvent = false;
        this.noContainers = false;
        this.newContainer(true);
      }
  }
  public products;
  public disableAddproduct;
  public dialogueLoading: boolean = true;
  ngOnInit() {
    this.disableAddbtn = this.data.disableAddPackage;
    this.generateProductDynamicForm();
    // if(this.productItem.value.quantity=''){
    //     this.disableAddproduct=true
    // }
    this.productsDynamicForm = new FormGroup({
      productItem: new FormArray([]),
    });

    this.generateContainerDynamicForm();
    this.getProducts();
    this.getPackagingDetails();
    this.getContainers(this.param, "pagination");
    this.containerForm = new FormGroup({
      containerItem: new FormArray([]),
    });
    if (this.data.flag == "edit") {
      this.addContainers = "Edit Packaging";
    }
    this.containerForm.valueChanges.subscribe(() => {
      this.addedWeight = 0;
      this.containerItem.value.forEach((value) => {
        this.addedWeight += value.quantity_type * value.quantity;
      });
    });
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
      .catch((error) => console.log(error))
      .finally(() => {
        this.dialogueLoading = false;
      });
  }
  public dummyProducts;
  getProducts(): void {
    this.dialogueLoading = true;
    this.ordersService
      .getproductOrders({ orders_id: this.data.orders_id })
      .then((response) => {
        if (response.result.success) {
          this.products = response.result.data;
          response.result.data.some((item) => {
            this.items.set(item.id, item);
          });
        }
      })
      .catch((error) => console.log(error))
      .finally(() => {
        this.dialogueLoading = false;
      });
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
    // this.fetchingData = false;
    this.deleteHide = true;
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }
  cancel(form: any): void {
    this.submitContainers = false;
    form.markAsPristine();
  }
  validateErrors() {}
  createContainer(form) {
    this.submmitButton = true;
    let selectedProducts = [];
    this.productItem.value.map(function (value) {
      if (value.quantity) {
        selectedProducts.push({
          // description : value.description,
          net_weight: Number(value.net_weight),
          quantity: Number(value.quantity),
          id: value.id,
          unit_weight: Number(value.unit_weight),
          quantity_type: 0,
        });
      }
    });
    this.selectedProduct = selectedProducts;
    if (!this.productItem?.value.length) {
      this.productError = true;
    }
    if (this.productItem.value.length != selectedProducts.length) {
      this.productDetailserror = true;
    }
    if (
      form.valid &&
      !this.productDetailserror &&
      !this.excesedQty.get(this.itemName)
    ) {
      this.fetchingData = true;
      this.createbtnDisabled = true;
      this.submitContainers = true;
      this.showSpinner = true;
      let container = {};
      this.validateContainers();
      if (!this.isContainersValid()) return false;
      container["container"] = this.containerItem.value;

      let param = {
        orders_id: this.data.orders_id,
        ...this.containerItem.value[0],
        products: this.selectedProduct,
        packing_id: this.data.packing_id,
      };
      this.ordersService
        .addPackageApi(param)
        .then((response) => {
          this.showSpinner = false;
          let toast: object;
          if (response.result.success) {
            this.submmitButton = false;
            this.noContainers = false;
            this.submitContainers = false;
            this.fetchingData = false;
            this.getPackagingDetails();
            this.setFormValuesInLocalStorage(this.containerItem.value[0]);

            toast = { msg: response.result.message, status: "success" };
          } else {
            this.submmitButton = false;
            this.createbtnDisabled = false;
            toast = { msg: response.result.message, status: "error" };
            this.fetchingData = false;
          }
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close({ success: true, result: response });
        })
        .catch((error) => console.log(error));
    }
  }
  generateContainerDynamicForm(item?): FormGroup {
    const storedValues = localStorage.getItem(this.data.orders_id);
    const storedItem = storedValues ? JSON.parse(storedValues) : null;
    const formGroup = this.fb.group({
      name: [
        item?.name !== undefined
          ? item.name
          : storedItem?.name !== undefined
          ? storedItem.name
          : "",
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          CustomValidation.nameValidator,
        ],
      ],
      uom_id: [
        item?.uom_id !== undefined
          ? item.uom_id
          : storedItem?.uom_id !== undefined
          ? storedItem.uom_id
          : "",
        Validators.required,
      ],
      height: [
        item?.height !== undefined
          ? item.height
          : storedItem?.height !== undefined
          ? storedItem.height
          : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      weight: [
        item?.weight !== undefined
          ? item.weight
          : storedItem?.weight !== undefined
          ? storedItem.weight
          : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      dimensions: [
        item?.dimensions !== undefined
          ? item.dimensions
          : storedItem?.dimensions !== undefined
          ? storedItem.dimensions
          : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      tare_weight: [
        item?.tare_weight !== undefined
          ? item.tare_weight
          : storedItem?.tare_weight !== undefined
          ? storedItem.tare_weight
          : "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]{1,8}(\.[0-9]{1,4})?$/),
          Validators.min(0.01),
        ],
      ],
      inner_description:
        item?.inner_description !== undefined
          ? item.inner_description
          : storedItem?.inner_description !== undefined
          ? storedItem.inner_description
          : "",
      selectUnits:
        item?.selectUnits !== undefined
          ? item.selectUnits
          : storedItem?.selectUnits !== undefined
          ? storedItem.selectUnits
          : "",
      total_gross_weight: [
        item?.total_gross_weight !== undefined
          ? item.total_gross_weight
          : storedItem?.total_gross_weight !== undefined
          ? storedItem.total_gross_weight
          : "",
      ],
      palletType: [
        item?.palletType !== undefined
          ? item.palletType
          : storedItem?.palletType !== undefined
          ? storedItem.palletType
          : false,
        this.getRequiredValidator(item?.palletType),
      ],
    });

    // this.setFormValuesInLocalStorage(formGroup);

    return formGroup;
  }

  setFormValuesInLocalStorage(formGroup: FormGroup): void {
    localStorage.setItem(this.data.orders_id, JSON.stringify(formGroup));
  }

  getRequiredValidator(isPalletTypeTrue: boolean) {
    return isPalletTypeTrue ? [Validators.required] : [];
  }

  addContainerRows(item?) {
    this.containerItem = this.containerForm.get("containerItem") as FormArray;
    if (!this.containerItem) {
      this.containerForm
        .get("containerItem")
        .value.push(this.generateContainerDynamicForm(item));
    } else {
      this.validateContainers();
      this.containerItem.push(this.generateContainerDynamicForm(item));
    }
  }

  validateContainers() {
    let totalqty = 0;
    this.containerItem.value.forEach((value) => {
      totalqty = +value.quantity_type * value.quantity;
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

  isContainersValid(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index < this.containerForm.get("containerItem")["controls"].length;
      index++
    ) {
      if (!this.containerForm.get("containerItem")["controls"][index].valid) {
      }
    }
    return isvalid;
  }

  changePackageType(event, formIndex): void {
    this.palletType = event.checked;
    this.generateContainerDynamicForm();
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
      total_gross_weight: "",
    });
  }
  generateProductDynamicForm(item?): FormGroup {
    return this.fb.group({
      id: item?.id != undefined ? item.id : "",
      name: item?.name != undefined ? item.name : "",
      quantity: [
        item?.quantity != undefined ? item.quantity : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      unit_weight: [
        item?.unit_weight != undefined ? item.unit_weight : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      net_weight: item?.net_weight != undefined ? item.net_weight : "",
      remain_qty: item?.remain_qty != undefined ? item.remain_qty : "",
      description: item?.description != undefined ? item.description : "",
    });
  }
  addNewLine(value?) {
    this.productItem = this.productsDynamicForm.get("productItem") as FormArray;
    this.productItem.push(this.generateProductDynamicForm(value));
    // this.excesedQty=false;
    this.excesedQty.set(this.itemName, false);
    // this.selectedProduct=undefined

    this.formValidation();
  }

  private selectedItems = new Set();

  validateSelectedProducts() {
    this.selectedItems = new Set();
    this.productItem?.value?.some((item) => {
      this.selectedItems.add(item.id);
    });
  }

  changeProduct(product, formIndex) {
    let i = _.findIndex(<any>Array.from(this.items.values()), {
      id: product.id,
    });

    if (i > -1) {
      this.selectedProduct = Array.from(this.items.values())[i];
    }
    this.itemName = this.selectedProduct.name;
    if (this.selectedProduct.remain_qty === 0) {
      this.products.splice(i, 1);
    }
    this.productItem.at(formIndex).setValue({
      id: this.selectedProduct.id,
      name: product.name,
      net_weight: Number(product.net_weight),
      quantity: "",
      unit_weight: Number(product.unit_weight),
      remain_qty: Number(product.remain_qty),
      description: product.description,
    });

    if (i > -1) {
      this.selectedProduct = this.products[i];

      // if(this.productItem.value.filter((item)=>{

      // if(item.id===this.selectedProduct.id){
      //    this.products.push({
      //     id:2,
      //     name:"test",
      //     quantity:100
      //   })
      // }
      // }))
    }
    this.productDetailserror = false;
    // this.excesedQty=false;
    this.excesedQty.set(this.itemName, false);

    this.formValidation();

    this.validateSelectedProducts();
  }

  changeIndex(index) {
    this.clickedProduct = this.productItem.value[index].id;

    (this.data.package_id ? this.products : this.productItem.value).some(
      (item) => {
        if (item.id) {
          if (
            this.selectedItems.has(item.id) &&
            (item.id !== this.clickedProduct || !this.clickedProduct)
          ) {
            this.items.delete(item.id);
          } else {
            this.items.set(item.id, item);
          }
        }
      }
    );
    // this.items = new Map([[this.productItem.value[index].name,this.productItem.value[index]],...this.items])

    // if(this.items.has("")){
    //   this.items.delete("")
    // }
    // this.searchProducts(this.clickedProduct.name);
    this.searchProducts(this.productItem.value[index].name);
  }

  validateMessage(event, formIndex) {
    const item = this.productItem?.value?.at(formIndex);
    this.itemName = item.name;
    const productIndex = this.products.findIndex(
      (e) => e.name === this.itemName
    );

    if (productIndex < 0) {
      if (item.quantity > item.remain_qty) {
        this.excesedQty.set(item.id, true);
      } else this.excesedQty.set(item.id, false);
    } else if (
      item.quantity > item.remain_qty ||
      // (this.data?.productsCount?.has(this.itemName)
      //   ? this.editProducts.has(this.itemName)
      //     ? this.editProducts.get(this.itemName) +
      //       this.products[productIndex].product_quantity -
      //       this.data.productsCount.get(this.itemName)
      //     : this.products[productIndex].product_quantity -
      //       this.data.productsCount.get(this.itemName)
      //   : item.remain_qty)
      item.quantity === 0 ||
      isNaN(parseInt(item.quantity)) ||
      item.quantity == ""
    ) {
      this.excesedQty.set(item.id, true);
    } else {
      this.excesedQty.set(item.id, false);
    }
    this.formValidation();
  }

  public excesedQty = new Map();
  validation(event) {
    // this.productItem?.value.map((item, index) => {
    //   if (item.quantity > item.remain_qty) {
    //     this.excesedQty.set(index, true);
    //   } else {
    //     this.excesedQty.set(index, false);
    //   }
    // });
    // if (event.target.value <= item.remain_qty) {
    //   this.products = this.products.map(product => {
    //     if (product.id === item.id) {
    //       return {
    //         ...product,
    //         remain_qty: Number(product.remain_qty) - event.target.value
    //       };
    //     }
    //     return product;
    //   });
  }

  enterQty(event, formIndex) {
    const item = this.productItem?.value?.at(formIndex);
    this.itemName = item.name;
    // if( event.target.value > item.remain_qty){

    //   this.excesedQty.set(item.name , true)
    // }else{
    //   this.excesedQty.set(item.name , false)
    // }

    if (item.quantity <= item.remain_qty) {
      //   this.products = this.products.map(product => {
      //     if (product.id === item.id) {
      //       return {
      //         ...product,
      //         remain_qty: Number(product.remain_qty) - item.quantity
      //       };
      //     }
      //     return product;
      //   });
      //   this.products = this.products.filter(product => product.remain_qty > 0);
      // this.productDetailserror = false;
      //   this.products = this.products.map(product => {
      //     if (product.id === item.id) {
      //       return {
      //         ...product,
      //       };
      //     }
      //     return product;
      //   });
      //   this.products = this.products.filter(product => product.id !== item.id);
      //   // this.products=this.products.splice(product => product.remain_qty > 0)
      // this.productDetailserror = false;
    }

    this.productItem.at(formIndex).setValue({
      id: item.id,
      net_weight: Number((event.target.value * item.unit_weight).toFixed(2)),
      name: item.name,
      unit_weight: Number(item.unit_weight),
      quantity: event.target.value,
      description: item.description,
      remain_qty: Number(item.remain_qty),
    });
    this.formValidation();
  }

  deleteRow(index) {
    const dltdItem = this.productItem.value[index];
    this.productItem.removeAt(index);
    this.productDetailserror = false;
    dltdItem.id && this.items.set(dltdItem.id, dltdItem);
    this.disableAddbtn = true;
    this.validateSelectedProducts();
    this.formValidation("delete");
    if (this.productItem.value.length == 0) {
      this.addNewLine();
    }
    this.excesedQty.set("addBtn", true);
  }
  getPackagingDetails(): void {
    this.dialogueLoading = true;
    this.ordersService

      .getProductPackageApi({
        orders_id: this.data.orders_id,
        packing_id: this.data.packing_id,
      })
      .then((response) => {
        if (response.result.success) {
          this.productsData = response.result.data.packages;
          // this.containerForm.get('containerItem').value.push(response.result.data)
          if (this.data.packing_id && this.productsData.length) {
            this.data.packing_id &&
              response.result.data.packages[0].products.some((item) => {
                this.items.set(item.id, item);
              });
            this.productsData.forEach((element) => {
              element.name = element.container_name;
              element.quantity = element.container_quantity;
              element.uom_id = element.uom_id;
              element.tare_weight = element.tare_weight;
              element.selectUnits = element.uom_name;
            });
            this.containerForm
              .get("containerItem")
              .value.push(this.productsData);
            this.productsData.forEach((element) => {
              this.addContainerRows(element);
              if (element.products) {
                element.products.forEach((product) => {
                  this.product_name = element.name;
                  this.addNewLine(product);
                });
              }
            });
          } else {
            this.addContainerRows();
            this.addNewLine();
          }
        }
        this.editProdutsDetails();
      })
      .finally(() => (this.dialogueLoading = false));
  }
  clear() {}
  public filteredItems = [];
  searchProducts(event) {
    console.log(this.items);
    this.filteredItems = Array.from(this.items.values()).filter((item) =>
      item.name.toLowerCase().includes(event.toLowerCase())
    );
  }
}
