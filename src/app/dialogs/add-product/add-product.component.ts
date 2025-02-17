import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { language } from "../../language/language.module";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomValidation } from "../../custom-format/custom-validation";
import { AdminService } from "../../services/admin.service";
import { SnakbarService } from "../../services/snakbar.service";
import * as _ from "lodash";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddNewProductComponent implements OnInit {
  @Input() categoryDt;
  @Input() productType;
  @Output() trigger = new EventEmitter<object>();
  public language = language;
  public disabledSave: boolean = false;
  public showSpinner: boolean = false;
  public submitProduct: boolean = false;
  public isEditMode: boolean = false;
  public showUnitWeight: boolean = false;
  public catName: string = "";
  public defaultPrice: string = "0.00";
  public selectUnits: string = "";
  public categoryData: Array<any> = [];
  public uomList: Array<any> = [];
  public selectedProducts: any;
  public productForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<AddNewProductComponent>
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getProducts();
    this.getUomData();
  }

  createForm(): void {
    this.productForm = this.fb.group({
      name: ["", [Validators.required, CustomValidation.noWhitespaceValidator]],
      description: "",
      price: [
        ,
        [
          // Validators.pattern("^[0-9.]*$"),
          Validators.pattern(/^[0-9]{1,4}(\.[0-9]{1,2})?$/),
          // Validators.min(0.0001)
        ],
      ],
      category_id: ["", Validators.required],
      unit_weight: [
        "",
        [Validators.pattern("^[0-9.]*$"), Validators.min(0.0001)],
      ],
      uom_id: ["", Validators.required],
      status: "",
      // tax: [, [Validators.required, Validators.min(0.0001)]],
      tax: [null, [Validators.pattern(/^[0-9]{1,2}(\.[0-9]{1,2})?$/)]],
      hs_code: ["", Validators.required],
    });
  }

  cancel(form: any): void {
    this.submitProduct = false;
    // this.selectedProducts = _.cloneDeep(this.productType);
    form.markAsPristine();
    // this.setForm(this.selectedProducts);
  }

  createProductType(form: any): void {
    console.log(this.productForm);
    this.showSpinner = true;
    if (form.value.price == "0") {
    }
    let toast: object;
    form.get("name").markAsTouched({ onlySelf: true });
    form.get("price").markAsTouched({ onlySelf: true });
    form.get("category_id").markAsTouched({ onlySelf: true });
    form.get("uom_id").markAsTouched({ onlySelf: true });
    form.get("status").markAsTouched({ onlySelf: true });
    form.get("unit_weight").markAsTouched({ onlySelf: true });
    form.get("tax").markAsTouched({ onlySelf: true });
    form.get("hs_code").markAsTouched({ onlySelf: true });
    this.submitProduct = true;
    if (!form.valid) {
      return;
    }
    let param = Object.assign({}, form.value);
    param.id = 0;
    form.markAsPristine();

    let priceRange = [];
    // Default product price for all the 5 range prices
    for (let index = 0; index < 5; index++) {
      priceRange[index] = {
        id: index + 1,
        price: form.get("price").value,
      };
    }
    param.priceRange = priceRange;
    this.adminService
      .addProductType(param)
      .then((response) => {
        if (response.result.success) {
          form.markAsPristine();
          this.submitProduct = false;
          this.selectedProducts = response.result.data.ProductRange[0];
          this.dialogRef.close({ success: true, response: response.result });
        } else {
          this.dialogRef.close({ success: false, response: response.result });
          toast = { msg: response.result.message, status: "error" };
        }
        this.showSpinner = false;
        // this.snackbar.showSnackBar(toast);
      })
      .catch((error) => console.log(error));
  }

  setForm(data: any): void {
    this.productForm.patchValue({
      name: data.name,
      description: data.description,
      price: data.price,
      category_id: data.category_id,
      status: data.status,
      unit_weight: data.unit_weight,
      uom_id: data.uom_id,
      tax: data.tax,
      hs_code: data?.hs_code,
    });
    this.catName = data.category_name;
    this.selectUnits = data.uom_name;

    if (data.id == "") {
      this.isEditMode = false;
      this.selectedProducts.priceRange.map((obj) => {
        obj.range_price = 0;
      });
      this.selectUnits = this.selectedProducts.priceRange[0].uom_name;
    } else {
      this.defaultPrice = data.price;
      this.isEditMode = true;

      const index = _.findIndex(this.categoryDt, { name: data.category_name });
    }

    this.showUnitWeight = data.uom_id == 5 || data.uom_id == 6 ? true : false;
  }

  getUomData() {
    let param = {
      module: "products",
    };
    this.adminService.getUomData(param).then((response) => {
      if (response.result.success) {
        this.uomList = response.result.data;
      }
    });
  }

  selectType(event) {
    console.log(event);
    if (event.value == 5 || event.value == 6) {
      this.showUnitWeight = true;
      this.productForm
        .get("unit_weight")
        .setValidators([
          Validators.required,
          Validators.pattern("^[0-9.]*$"),
          Validators.min(0.0001),
        ]);
      this.productForm.get("unit_weight").updateValueAndValidity();
    } else {
      this.showUnitWeight = false;
      this.productForm.get("unit_weight").clearValidators();
      this.productForm.get("unit_weight").updateValueAndValidity();
    }

    const index = _.findIndex(this.uomList, { id: event.value });
    this.selectUnits = this.uomList[index].name;
  }

  getProducts() {
    let param = {
      page: 1,
      perPage: 5,
      search: "",
      sort: "ASC",
    };
    this.adminService.getProductsList(param).then((response) => {
      if (response.result.success) {
        this.categoryDt = response.result.data.categoryDt;
        this.categoryDt = this.categoryDt.filter((obj) => {
          return obj.status;
        });
        if (this.productType != undefined) {
          const index = _.findIndex(this.categoryDt, {
            id: this.productType["category_id"],
          });
          if (index == -1 && this.productType.category_id != "") {
            this.categoryDt.push({
              id: this.productType.category_id,
              name: this.productType.category_name,
              status: "",
            });
          }
        }
      }
    });
  }
}
