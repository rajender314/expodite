import {
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrganizationsService } from "../../services/organizations.service";
import { Param } from "../../custom-format/param";
import * as _ from "lodash";
import { MatDialog } from "@angular/material/dialog";
import { AddNewProductComponent } from "../../dialogs/add-product/add-product.component";
import { SnakbarService } from "../../services/snakbar.service";
import { LeadsService } from "../../leads/leads.service";

declare var App: any;
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-add-products",
  templateUrl: "./add-products.component.html",
  styleUrls: ["./add-products.component.scss"],
})
export class AddProductsComponent implements OnInit {
  @Input() clientSelectedId: any;
  @Input() selectedCurrency
  @Output() trigger = new EventEmitter<any>();
  public order = {
    products: [],
    currency: "",
  };
  public inClient: any;
  public newClientid: any;
  public newClientadded: boolean = false;
  public newClient: boolean = false;
  productsDynamicForm: FormGroup;
  public productItem: any;
  productsForm: any;
  public isAddProduct: boolean = false;
  public discountError: boolean;
  public discount: number = 0;
  public total: number = 0;
  public subTotal: number = 0;
  public discountPercent: number = 0;
  public freightamt: number = 0;
  public insuranceValue: number = 0;
  private productParam: Param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
  };
  public selectedProduct: any = {
    id: 0,
    name: "",
    price: "",
    quantity: "",
    amount: 0,
  };
  public checkedArr: any = {};
  public showNoProdFound: boolean = false;
  public productError: boolean = false;
  public productselecterror = false;
  public newItemIcon: string =
    App.base_url + "dashboard/assets/images/new-plus.png";
  constructor(
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private service: LeadsService,

  ) {
    this.service.formValidationErrors.subscribe((val: any) => {
      console.log(val)
      this.productError = val.productError
      this.discountError = val.discountError
      this.productselecterror = val.productselecterror
      if (this.productError) {
        setTimeout(() => {
          let scrollTag = document.querySelector(".error-msg");
          if (scrollTag) {
            scrollTag.scrollIntoView({behavior: 'smooth'});
          }
        }, 1000);
      }
    })
  }

  ngOnInit(): void {
    this.productsDynamicForm = new FormGroup({
      productItem: new FormArray([]),
    });
    this.generateProductDynamicForm();
    this.productsForm = this.formBuilder.group({
      freight: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
      insurance: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
      discount: [null, [Validators.pattern(/^-?[0-9]{1,7}(\.[0-9]{1,3})?$/)]],
    });

    this.productsDynamicForm.valueChanges.subscribe((val) => {
      const obj = {
        addProdustsForm: this.productsDynamicForm,
        subTotalForm: this.productsForm,
      };
      this.trigger.emit(obj);
    });
    this.productsForm.valueChanges.subscribe((val) => {
      const obj = {
        addProdustsForm: this.productsDynamicForm,
        subTotalForm: this.productsForm,
      };
      this.trigger.emit(obj);
    });
    // this.getProducts()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.clientSelectedId && changes.clientSelectedId.currentValue) {
      this.inClient = true;
      this.isAddProduct = false;
      this.getProducts();
    } else {
      this.inClient = false;
    }

    if (changes.selectedCurrency && changes.selectedCurrency.currentValue) {
      this.selectedCurrency = changes.selectedCurrency.currentValue.type
    }
  }

  getProducts(param?: any) {
    if (param === "search") {
      this.productParam.page = 1;
      this.order.products = [];
    }
    this.organizationsService
      .getProductsList({
        org_id:
          App.user_details.log_type == "2"
            ? App.user_details.org_id
            : !this.newClientadded
            ? this.clientSelectedId
            : this.newClientid,
        flag: 1,
        client_new: this.newClient ? true : false,
        search_value: this.productParam.search,
        groupby_category: false,
        page: this.productParam.page,
        perPage: this.productParam.perPage,
      })
      .then((response) => {
        if (response.result.success) {
          this.order.products = response.result.data.productTypesDt;
          // .filter(
          //   (obj) => {
          //     return obj.checked_status === true;
          //   }
          // );

          this.checkedArr = this.order.products.filter((obj) => {
            return obj.checked_status === true;
          });

          if (this.checkedArr.length) {
            this.showNoProdFound = false;
          } else {
            this.showNoProdFound = true;
          }

          this.order.currency = response.result.data.currency;
          this.order.products.map(function (value) {
            value["selected"] = false;
            value["error"] = false;
            value["quantity"] = "";
          });
        }
      });
      const obj = {
        addProdustsForm: this.productsDynamicForm,
        subTotalForm: this.productsForm,
      };
      this.trigger.emit(obj);
  }

  addNewLine(value?) {
    console.log(this.inClient);
    if (this.inClient) {
      this.productItem = this.productsDynamicForm.get(
        "productItem"
      ) as FormArray;
      this.productItem.push(this.generateProductDynamicForm(value));
      this.productError = false;
    } else {
      this.isAddProduct = true;
    }
  }
  generateProductDynamicForm(item?): FormGroup {
    return this.formBuilder.group({
      id: item?.id != undefined ? item.id : "",
      name: item?.name != undefined ? item.name : "",
      quantity: [
        item?.quantity != undefined ? item.quantity : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      price: [
        item?.price != undefined ? item.price : "",
        Validators.pattern(/^[0-9.]+$/),
      ],
      amount: item?.amount != undefined ? item.amount : "",
    });
  }
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      const originalValue = this.discount;
      this.discount = parseFloat(event.target["value"]);
      // if (this.discount <= this.subTotal) {
      //   this.discountError = false;
      // }
      this.discount = originalValue; // Restore the original value
    }
  }
  enterDiscount(event): void {
    // this.validateDecimal(event)
    this.discount = Number(event.target.value);
    this.discountPercent = Number(event.target.value);
    this.discountError = false;
    if (this.discount >= this.subTotal) {
      this.discountError = true;
    }
    this.calculateDiscount();
  }

  calculateDiscount() {
    this.total = Number(this.subTotal.toFixed(3));
    // this.discount = Number((this.subTotal * this.discountPercent / 100).toFixed(3));
    this.total = Number(
      (
        this.total +
        this.freightamt +
        this.insuranceValue -
        this.discount
      ).toFixed(3)
    );
    if(this.discount) {
      if (this.discount >= this.subTotal) {
        this.discountError = true;
      } else {
        this.discountError = false;
      }
    }

  }
  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }
  preventInputE(event: KeyboardEvent) {
    if (event.key === "e" || event.key === "E") {
      event.preventDefault();
    }
  }

  enterFreight(event): void {
    // this.validateDecimal(event)
    this.freightamt = Number(event.target.value);
    // this.total = Number((this.subTotal + this.freightamt).toFixed(3));

    this.calculateFreight();
  }
  calculateFreight() {
    // this.total = Number(this.subTotal.toFixed(3));
    this.total = Number(
      (this.subTotal + this.freightamt + this.insuranceValue).toFixed(3)
    );
  }
  enterInsurance(event): void {
    // this.validateDecimal(event)
    this.insuranceValue = Number(event.target.value);
    this.total = Number(
      (this.subTotal + this.insuranceValue + this.freightamt).toFixed(3)
    );
  }
  changeProduct(product, formIndex) {
    let i = _.findIndex(<any>this.order.products, {
      name: product.name,
    });
    if (i > -1) {
      this.selectedProduct = this.order.products[i];
    }
    this.productItem.at(formIndex).setValue({
      id: this.selectedProduct.id,
      name: product.name,
      price: Number(product.price),
      quantity: product.quantity,
      amount: Number(product.price),
    });
    this.productselecterror = false;
  }

  enterQty(event, formIndex) {
    let item = this.productItem.value.at(formIndex);
    this.productItem.at(formIndex).setValue({
      id: item.id,
      amount: Number((event.target.value * item.price).toFixed(3)),
      name: item.name,
      price: Number(item.price),
      quantity: event.target.value,
    });
    this.productError = false;
    this.productselecterror = false;
    this.calculateOrder();
    this.calculateDiscount();

  }
  calculateOrder() {
    let amount: number = 0;
    this.productItem.value.map(function (item) {
      amount += item.amount;
    });
    this.subTotal = Number(amount.toFixed(3));
    this.total = Number((this.subTotal - this.discount).toFixed(3));
    if (this.productItem.value.length == 0) {
      this.discount = this.subTotal = 0;
    }
  }
  enterProd(event, formIndex) {
    const item = this.productItem.value.at(formIndex);
    this.productItem.at(formIndex).setValue({
      id: item.id,
      amount: Number((event.target.value * item.quantity).toFixed(3)),
      name: item.name,
      price: event.target.value,
      quantity: Number(item.quantity),
    });
    this.productError = false;
    this.productselecterror = false;
    this.calculateDiscount();
    this.calculateOrder();
  }
  deleteRow(index) {
    this.productItem.removeAt(index);
    this.productselecterror = false;
    this.calculateDiscount();
    this.calculateOrder();
  }
  clearPr(event) {
    if (event.target.value == "") {
      this.productselecterror = true;
    }
  }
  searchProducts(event) {
    this.productParam.search = event.target.value;
    // const obj = {
    //   addProdustsForm: this.productsDynamicForm,
    //   subTotalForm: this.productsForm,
    //   searchVal: event.target.value
    // }
    // this.trigger.emit(obj)

    this.getProducts("search");
  }

  addNewProduct(): void {
    let toast: object;
    let dialogRef = this.dialog.open(AddNewProductComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        toast = { msg: result.response.message, status: "success" };
        this.getProducts();
      } else {
        toast = { msg: result.response.message, status: "error" };
      }
      this.snackbar.showSnackBar(toast);
    });
  }
}
