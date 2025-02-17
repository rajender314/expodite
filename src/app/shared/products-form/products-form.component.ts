import {
  Component,
  EventEmitter,
  HostListener,
  Injectable,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Param } from "../../custom-format/param";
import { AddNewProductComponent } from "../../dialogs/add-product/add-product.component";
import { LeadsService } from "../../leads/leads.service";
import { OrganizationsService } from "../../services/organizations.service";
import { SnakbarService } from "../../services/snakbar.service";
import * as _ from "lodash";
import { CustomValidation } from "../../custom-format/custom-validation";
import { ProductsImportComponent } from "../../estimates-module/products-import/products-import.component";
import { language } from "../../language/language.module";

declare var App: any;
@Injectable({
  providedIn: "root",
})
@Component({
  selector: "app-products-form",
  templateUrl: "./products-form.component.html",
  styleUrls: ["./products-form.component.scss"],
})
export class ProductsFormComponent implements OnInit {
  @Input() selected_order_ids: [] = [];
  @Input() shipmetOrderProducts: any;
  @Input() type: string = "";
  @Input() clientSelectedId: any;
  @Input() related_to_id: any = "";
  @Input() importLineItems: boolean = true;
  @Input() selectClientRequired: boolean = false;
  @Input() selectedCurrency;
  @Input() module;
  @Output() trigger = new EventEmitter<any>();
  @Input() Contacts: any;
  @Input() selectedRowsGrid;
  @Input() isSubmitBtnClicked: any;
  @Input() editPo;

  public language = language;
  public fetchingData = true;
  public order = {
    products: [],
    currency: "",
  };
  public inClient: boolean = false;
  public newClientid: any;
  public newClientadded: boolean = false;
  public newClient: boolean = false;
  productsDynamicForm: FormGroup;
  // public productItem: any;
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
  submittedStoresAttributeForm: any = false;
  public importIcon: string =
    App.base_url + "signatures/assets/images/Import.svg";
  public is_automech = App.env_configurations.is_automech;

  constructor(
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private service: LeadsService
  ) {}
  public productAttributes = [];
  public selectedProductNames = [];
  async ngOnInit() {
    // this.productAttributes = this.formFields
    this.productsDynamicForm = this.formBuilder.group({
      productItem: this.formBuilder.array([]),
    });

    await this.getDropdownsList();
    await this.getOrgStoreAttribute();

    this.submittedStoresAttributeForm = true;

    this.productsDynamicForm.valueChanges.subscribe((val) => {
      const obj = {
        addProdustsForm: this.productsDynamicForm,
        productFormID: this.form_id,
        subTotalVal: this.totalVal,
      };
      this.trigger.emit(obj);
    });
    const obj = {
      addProdustsForm: this.productsDynamicForm,
      productFormID: this.form_id,
      subTotalVal: this.totalVal,
    };
    this.trigger.emit(obj);
  }
  public form_id = "";
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: this.module,
        // related_to_id: this.related_to_id,
      })
      .then(async (response) => {
        if (response.result.success) {
          this.productAttributes =
            response.result.data.attributes.base_attributes;
          this.form_id = response.result.data.attributes.form_id;

          this.createAttributeControls();
          this.isDisplayFields();
          if (this.Contacts && !this.selectedRowsGrid) {
            await this.getAttributesPrefillData();
          } else if (this.selectedRowsGrid) {
            let iDs = [];
            this.selectedRowsGrid.forEach((row) => {
              iDs.push(row.id);
            });
            this.getPFIPOprodList(iDs);
          }
          this.fetchingData = false;
        }
      })
      .catch((error) => console.log(error));
  }

  getPFIPOprodList(ids) {
    this.service
      .getPFIPOprodList({
        selected_product_ids: ids,
      })
      .then(async (response) => {
        if (response.result.success) {
          response.result.data.forEach((ele: any) => {
            this.productsdata.push(ele.meta_data);
          });
          this.populateForm(this.productsdata);
          const obj = {
            addProdustsForm: this.productsDynamicForm,
            productFormID: this.form_id,
            subTotalVal: this.totalVal,
          };
          this.trigger.emit(obj);
        }
      })
      .catch((error) => console.log(error));
  }
  public dropdOptions = {
    name: [],
  };
  async getDropdownsList() {
    let parms = {
      module: this.module,
      related_to_id: this.related_to_id,
      form_control_name: "",
      search: "",
      type: "",
      id: "",
    };
    await this.service.getDropdowns(parms).then(async (response) => {
      if (response.result.success) {
        this.dropdOptions = response.result.data;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isSubmitBtnClicked) {
      this.submittedStoresAttributeForm =
        changes.isSubmitBtnClicked.currentValue;
    }
    if (
      (changes.clientSelectedId && changes.clientSelectedId.currentValue) ||
      this.selectClientRequired
    ) {
      this.inClient = true;
      this.isAddProduct = false;
      // this.getProducts();
    }
    if (changes.selectedCurrency && changes.selectedCurrency.currentValue) {
      this.selectedCurrency = changes.selectedCurrency.currentValue.type;
    }

    if (this.selected_order_ids.length && this.clientSelectedId) {
      // this.productItem.clear()
      this.getAttributesPrefillData();
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
          this.productAttributes.map(async (obj: any) => {
            if (obj.dynamic_dropdown && obj.label_name == "Product Name") {
              obj.options = this.order.products;
            }
            return obj;
          });

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
      productFormID: this.form_id,
      subTotalVal: this.totalVal,
    };
    this.trigger.emit(obj);
  }

  addNewLine(value?) {
    this.productsDynamicForm.value.productItem.forEach((ele) => {
      this.selectedProductNames.push(ele.name);
    });
    // debugger;
    this.isDisplayFields();
    this.calculateOrder();
    let group2 = this.formBuilder.group({});
    if (this.inClient) {
      // this.productItem = this.productsDynamicForm.get(
      //   "productItem"
      // ) as FormArray;
      this.productAttributes.map((attr) => {
        let control;
        if (!attr.is_hide) {
          control = this.formBuilder.control("");
          group2.addControl(attr.form_control_name, control);
        }
      });
      group2.addControl("id", this.formBuilder.control(""));
      this.productItem.push(group2);
      this.productAttributes.map((attr) => {
        this.getValidation(attr);
      });
      // this.productItem.push(this.generateProductDynamicForm(value));
      this.productError = false;
    } else if (this.module == "add_product_in_shipment") {
      this.productAttributes.map((attr) => {
        let control;
        if (!attr.is_hide) {
          control = this.formBuilder.control("");
          group2.addControl(attr.form_control_name, control);
        }
      });
      group2.addControl("is_checked", this.formBuilder.control(false));
      group2.addControl("id", this.formBuilder.control(""));
      this.productItem.push(group2);
      this.productAttributes.map((attr) => {
        this.getValidation(attr);
      });
    } else {
      this.isAddProduct = true;
    }
  }
  generateProductDynamicForm(item?): FormGroup {
    let arr = Object.keys(item);
    let formControls = {};
    arr.forEach((controlName) => {
      if (controlName === "remaining_quantity") {
        let index = this.productAttributes.findIndex(
          (list) => list.form_control_name === "name"
        );
        if (index > -1) {
          this.productAttributes[index].options.forEach((option) => {
            if (option.id === item.name.id) {
              option[controlName] = item[controlName];
            }
          });
        }
      } else {
        if (
          (this.module === "add_product_in_shipment" ||
            this.module === "add_products_in_po") &&
          controlName === "quantity"
        )
          formControls[controlName] = [
            item?.[controlName] != undefined
              ? item?.remaining_quantity
                ? item.remaining_quantity
                : item.quantity
              : "",
          ];
        else if (
          (this.module === "add_product_in_shipment" ||
            this.module === "add_products_in_po") &&
          controlName === "amount"
        ) {
          formControls[controlName] = [
            item?.[controlName] != undefined
              ? item?.remaining_quantity
                ? item.remaining_quantity * parseFloat(item.price)
                : item.amount
              : "",
          ];
        } else
          formControls[controlName] = [
            item?.[controlName] != undefined ? item[controlName] : "",
          ];
      }
    });

    if (
      this.module === "add_product_in_shipment" ||
      this.module === "add_products_in_po"
    ) {
      formControls["is_checked"] = [false]; // default value false
    }
    return this.formBuilder.group(formControls);
    // return this.formBuilder.group({
    //   id: item?.id != undefined ? item.id : "",
    //   name: item?.name != undefined ? item.name : "",
    //   quantity: [
    //     item?.quantity != undefined ? item.quantity : "",
    //     Validators.pattern(/^[0-9.]+$/),
    //   ],
    //   price: [
    //     item?.price != undefined ? item.price : "",
    //     Validators.pattern(/^[0-9.]+$/),
    //   ],
    //   amount: item?.amount != undefined ? item.amount : "",
    //   description: item?.description != undefined ? item.description : "",
    // });
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
    if (this.discount) {
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
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: product.quantity,
      amount: Number(product.price),
    });
    this.productselecterror = false;
  }
  public totalVal = 0;

  enterQty(event, formIndex, obj) {
    if (this.productItem.value[formIndex].name) {
      if (obj.form_control_name == "quantity") {
        this.totalVal = 0;
        let item = this.productItem.value.at(formIndex);
        this.productItem.at(formIndex).setValue({
          ...this.productItem.at(formIndex).value,
          amount: Number((event.target.value * item.price).toFixed(3)),
          name: item.name,
          price: Number(item.price),
          quantity: event.target.value,
          description: item.description,
        });
        this.productError = false;
        this.productselecterror = false;
        this.calculateOrder();
        this.calculateDiscount();
        this.totalVal = 0;

        this.productsDynamicForm.value.productItem.forEach((obj: any) => {
          {
            if (
              this.module === "add_product_in_shipment" ||
              (this.module === "add_products_in_po" &&
                this.shipmetOrderProducts)
            ) {
              if (obj.is_checked) this.totalVal = this.totalVal + obj.amount;
            } else {
              this.totalVal = this.totalVal + obj.amount;
            }
          }
        });
        const obj = {
          addProdustsForm: this.productsDynamicForm,
          productFormID: this.form_id,
          subTotalVal: this.totalVal,
        };
        this.trigger.emit(obj);
      } else if (obj.form_control_name == "price") {
        this.totalVal = 0;
        let item = this.productItem.value.at(formIndex);
        this.productItem.at(formIndex).setValue({
          ...this.productItem.at(formIndex).value,
          amount: Number((event.target.value * item.quantity).toFixed(3)),
          name: item.name,
          price: event.target.value,
          quantity: Number(item.quantity),
          description: item.description,
        });
        this.productError = false;
        this.productselecterror = false;
        this.calculateOrder();
        this.calculateDiscount();
        this.totalVal = 0;
        this.productsDynamicForm.value.productItem.forEach((obj: any) => {
          if (
            this.module === "add_product_in_shipment" ||
            (this.module === "add_products_in_po" && this.shipmetOrderProducts)
          ) {
            if (obj.is_checked) this.totalVal = this.totalVal + obj.amount;
          } else {
            this.totalVal = this.totalVal + obj.amount;
          }
        });
        const obj = {
          addProdustsForm: this.productsDynamicForm,
          productFormID: this.form_id,
          subTotalVal: this.totalVal,
        };
        this.trigger.emit(obj);
      }
    }
  }

  checkBoxSelectionChange(event) {
    this.totalVal = 0;
    this.productsDynamicForm.value.productItem.forEach((obj: any) => {
      if (obj.is_checked) this.totalVal = this.totalVal + obj.amount;
    });
    const obj = {
      addProdustsForm: this.productsDynamicForm,
      productFormID: this.form_id,
      subTotalVal: this.totalVal,
    };
    this.trigger.emit(obj);
  }
  calculateOrder() {
    let amount: number = 0;
    this.productItem.value.map(function (item) {
      amount += item.amount;
    });
    this.subTotal = amount ? Number(amount.toFixed(3)) : 0;
    this.total = this.totalVal = Number(
      (this.subTotal - this.discount).toFixed(3)
    );
    if (this.productItem.value.length == 0) {
      this.discount = this.subTotal = 0;
    }
    const obj = {
      addProdustsForm: this.productsDynamicForm,
      productFormID: this.form_id,
      subTotalVal: this.total,
    };
    this.trigger.emit(obj);
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
    this.selectedOptions.splice(index, 1);
    this.selectedOptions = [...this.selectedOptions];
    this.productselecterror = false;
    this.calculateDiscount();
    this.calculateOrder();

    // this.productItem.removeAt(index);
    // this.productselecterror = false;
    // this.calculateDiscount();
    // this.calculateOrder();
  }
  clearPr(event) {
    if (event.target.value == "") {
      this.productselecterror = true;
    }
  }
  searchProducts(event) {
    this.productParam.search = event.target.value;
    this.getProducts("search");
  }
  public totalClients = [];
  autoSuggestselectionChange(obj, formdata, indx: any) {
    this.totalClients = formdata.options;
    let i = _.findIndex(<any>formdata.options, {
      label: obj.label,
      id: obj.id,
    });
    if (formdata.label_name === "Select Client") {
      let port_of_loading = "";
      let port_of_discharge = "";
      let final_destination = "";
      let currency_id = "";
      formdata.options.map(function (value) {
        if (value.id === obj.id) {
          port_of_loading = value.port_of_loading;
          port_of_discharge = value.port_of_discharge;
          currency_id = value.currency_id;
          final_destination = value.final_destination;
        }
      });

      this.productsDynamicForm.controls.productItem["controls"][0]
        .get("port_of_loading")
        .setValue(port_of_loading);
      this.productsDynamicForm.controls.productItem["controls"][0]
        .get("port_of_discharge")
        .setValue(port_of_discharge);
      this.productsDynamicForm.controls.productItem["controls"][0]
        .get("final_destination")
        .setValue(final_destination);
      if (
        this.productsDynamicForm.controls.productItem["controls"][0].get(
          "currency_id"
        )
      ) {
        this.productsDynamicForm.controls.productItem["controls"][0]
          .get("currency_id")
          .setValue(currency_id);
      }
    }
    if (i > -1) {
      formdata.newlabel = obj.name;
      this.getContacts(formdata.options[i].id);
      this.clientSelectedId = obj.id;
      // this.emitProducts.emit({ clientId: obj.id });
    }
    this.productAttributes[indx].newlabel = obj.name;
  }

  getContacts(clientId: string) {
    this.organizationsService
      .listContacts({
        org_id:
          App.user_details.log_type == "2" ? App.user_details.org_id : clientId,
        flag: 1,
      })
      .then((response) => {
        if (response.result.data.contactsData) {
          const list = response.result.data.contactsData;

          let contacts = [];
          list.map(function (value) {
            value.contact["id"] = value.contact.id;
            value.contact["name"] =
              value.contact.first_name + " " + value.contact.last_name;
            value.contact["email"] = value.contact.primary_email;
            value.contact["phone"] = value.contact.primary_phone;
          });
          this.productAttributes.map((obj: any, index) => {
            if (obj.label_name === "Attention") {
              obj.options = contacts;
              return obj;
            }
          });
        }
      })
      .catch((error) => console.log(error));
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
  public group = this.formBuilder.group({});

  createAttributeControls(val?: string) {
    this.productAttributes.map((attr) => {
      let control;
      if (!attr.is_hide) {
        control = this.formBuilder.control(val ? val : "");
        this.group.addControl(attr.form_control_name, control);
      }
    });
    this.group.addControl("id", this.formBuilder.control(""));
    this.productItem.push(this.group);
    this.productAttributes.map((attr) => {
      this.getValidation(attr);
    });
  }

  get productItem() {
    return this.productsDynamicForm.get("productItem") as FormArray;
  }

  getValidation(obj) {
    const len = this.productItem.value.length;
    for (let i = 0; i < len; i++) {
      if (
        this.productsDynamicForm.controls.productItem["controls"][i].get(
          obj.form_control_name
        )
      ) {
        this.productsDynamicForm.controls.productItem["controls"][i]
          .get(obj.form_control_name)
          .setValidators(this.bindValidation(obj));
      }
    }

    this.productsDynamicForm.updateValueAndValidity();
    return [];
  }

  bindValidation(ele) {
    let list = [];
    if (ele.required) {
      list.push(Validators.required);
      // list.push(Validators.required);
      // list.push(CustomValidation.noWhitespaceValidator);
    }
    if (
      ele.slug === "single_line_text" ||
      ele.slug === "paragraph_text" ||
      ele.slug === "number"
    ) {
      list.push(CustomValidation.noWhitespaceValidator);
      if (ele.regex) {
        list.push(Validators.pattern(ele.regex));
      }
      if (ele.max_length) {
        list.push(Validators.maxLength(ele.max_length));
      }
    }
    if (ele.slug === "single_line_text" || ele.slug === "paragraph_text") {
      if (ele.min_length) {
        list.push(Validators.maxLength(ele.min_length));
      }
    }
    // if (ele.validations && ele.validations.length) {
    //   if (ele.validations[0].hasOwnProperty("minLength")) {
    //     list.push(Validators.minLength(ele.validations[0].minLength));
    //   }
    //   if (ele.validations[0].hasOwnProperty("maxLength")) {
    //     list.push(Validators.maxLength(ele.validations[0].maxLength));
    //   }
    //   if (ele.validations[0].hasOwnProperty("pattern")) {
    //     list.push(Validators.pattern(ele.validations[0].pattern));
    //   }
    // }

    return list;
  }
  isDisplayFields() {
    // const jsonString = '{"result":{"success":true,"data":{"organization_id":[{"id":1,"label":"Test"},{"id":2,"label":"Test12"},{"id":3,"label":"Test22"},{"id":4,"label":"Test223"}],"currency_id":[{"id":1,"label":"INR"},{"id":2,"label":"USD"},{"id":3,"label":"EUR"}]},"message":"Other Order Details Retrieved Successfully","status_code":200}}';
    // const jsonObject = JSON.parse(jsonString);
    //   this.dropdOptions = jsonObject.result.data;
    let renderArry = [];
    const indx = _.findIndex(this.productAttributes, {
      slug: "custom_component",
    });
    if (indx > -1) {
      if (this.productAttributes[indx].form_control_name == "add_product") {
        renderArry =
          this.productAttributes[indx].innerAttributes.base_attributes;
      } else {
        renderArry = this.productAttributes;
      }
    } else {
      renderArry = this.productAttributes;
    }
    renderArry.map(async (obj: any, index: number) => {
      // obj.options = await this.getDynamicArray(index);
      obj.options = this.dropdOptions[obj.form_control_name] || [];

      if (obj.dependency && obj.dependency.dependent_field) {
        const indx = await _.findIndex(this.productAttributes, {
          form_control_name: obj.dependency.dependent_field,
        });
      }
      return obj;
    });
  }
  async getDynamicArray(index: number) {
    return await this.getDropdownlist(
      this.productAttributes[index]?.data_source,
      this.productAttributes[index]?.result_object
    );
  }
  assignCommonValues(json1, json2) {
    const keys1 = Object.keys(json1);
    const keys2 = Object.keys(json2);
    keys1.forEach((key) => {
      if (keys2.includes(key)) {
        json2[key] = json1[key];
      }
    });

    return json2;
  }
  async getDropdownlist(api: any, resultObj: any) {
    let list = [];
    await this.service
      .getFormDropdowns({
        api: api,
      })
      .then(async (response) => {
        if (response.result.success && response.result.data) {
          const mergedJson = this.assignCommonValues(
            JSON.parse(resultObj),
            response
          );
          const data = JSON.parse(resultObj).response.result.data;
          list = mergedJson.result.data[data.key];
          // if (api === "listOrganizations") {
          //   const indx = _.findIndex(list, {
          //     id: parseInt(
          //       this.productsDynamicForm.controls.productItem[
          //         "controls"
          //       ][0].get("organization_id")
          //     ),
          //   });
          //   if (indx > -1) {
          //     this.productAttributes[0].newlabel = list[indx].name;
          //   }
          // }
          return list;
        }
      })
      .catch((error) => console.log(error));
    return list;
  }
  async getDynamicOptionsFromApi(param, index) {
    let response = "";
    await this.service.getDependentDDS(param).then((res) => {
      const data = res.result.data;
      if (res.result.success) {
        let keys = [];
        keys = data.dependentDropdowns
          ? Object.keys(data.dependentDropdowns)
          : [];
        keys.length &&
          keys.map((ele: any) => {
            const indx = _.findIndex(this.productAttributes, {
              form_control_name: ele,
            });
            if (indx > -1) {
              this.productAttributes[indx].options =
                data.dependentDropdowns[ele] || [];
            }
          });

        let prefillValues = [];
        prefillValues = data.dependentValues
          ? Object.keys(data.dependentValues)
          : [];

        prefillValues.length &&
          prefillValues.map((ele: any) => {
            this.productsDynamicForm.controls.productItem["controls"][index]
              .get(ele)
              ?.setValue(data.dependentValues[ele] || "");
          });
      }
    });
    return response;
  }

  public selectedOptions = [];
  async dropDownSelectionChange(event, formdata, index, formArray) {
    const newValue = event.value;
    const previousValue = this.selectedOptions[index];
    console.log(newValue, previousValue);
    if (previousValue && previousValue.id !== newValue.id) {
      this.selectedOptions[index] = newValue;
    } else if (!previousValue) {
      this.selectedOptions[index] = newValue;
    }

    if (
      formdata.form_control_name === "name"
      // &&
      // formdata.form_name === "Add Product in Order"
    ) {
      const formArray = this.productsDynamicForm.get(
        "productItem"
      ) as FormArray;
      formArray.controls[index].get("quantity")?.setValue(null); // Reset the quantity field to null
      formArray.controls[index].get("amount")?.setValue(0); // Optionally reset the amount field to 0
    }
    // this.selectedOptions = this.selectedOptions.filter(
    //   (value, i) =>
    //     value !== null &&
    //     i === this.selectedOptions.findIndex((item) => item?.id === value?.id)
    // );

    // console.log(this.selectedOptions);
    if (formdata.form_control_name === "name") {
      const param = {
        id: event.value.id,
        form_control_name: formdata.form_control_name,
        module: this.module,
      };
      const response: any = await this.getDynamicOptionsFromApi(param, index);
      // if(response && response.dependentValues) {
      //   this.productsDynamicForm.controls.storeCustomAttributes["controls"][0]
      //   .get("primary_phone")
      //   .setValue(response.dependentValues.primary_phone);
      // this.productsDynamicForm.controls.storeCustomAttributes["controls"][0]
      //   .get("account_manager")
      //   .setValue(response.dependentValues.account_manager);
      // this.productsDynamicForm.controls.storeCustomAttributes["controls"][0]
      //   .get("primary_email")
      //   .setValue(response.dependentValues.primary_email);
      // }

      // let arr = Object.keys(response.dependentValues).length
      // for(let i = 0; i < arr; i++) {
      //   this.productsDynamicForm.controls.storeCustomAttributes["controls"][0]
      //   .get(arr[i])
      //   .setValue(response.dependentValues[arr[i]]);
      // }
    }
    let arr = [];
    arr = this.findObjectsWithKeyValue(
      "dependent_field",
      formdata.form_control_name
    );
    if (arr.length) {
      arr.map((obj: any) => {
        if (obj.dependency && obj.dependency.dependent_value == event.value) {
          obj.is_hide = false;
          const formArray = this.productsDynamicForm.get(
            "productItem"
          ) as FormArray;
          formArray.removeAt(0);
          this.createAttributeControls();
        } else {
          obj.is_hide = true;
          this.group.removeControl(obj.form_control_name);
        }
      });
    }
    if (formdata.form_control_name === "currency_id") {
      const indx = _.findIndex(formArray[index].options, {
        id: event.value,
      });
      this.selectedCurrency = formArray[index].options[indx];
    }

    if (formdata.form_control_name === "transport_id") {
      localStorage.setItem("mode_of_shipment", event.value);
    }

    const param = {
      id: event.value.id,
      form_control_name: formdata.form_control_name,
      module: this.module,
    };
    if (formdata.label_name === "Country") {
      this.getDynamicOptionsFromApi(param, 0);
    }
    this.hideCustomComponents(event.value, formdata);
  }

  findObjectsWithKeyValue(key, value) {
    const objects = [];
    this.productAttributes.forEach((element) => {
      if (element[key] === value) {
        objects.push(element);
      }
    });
    return objects;
  }
  hideCustomComponents(value: string, form) {
    this.productAttributes.map((obj: any) => {
      if (obj.slug === "custom_component") {
        if (obj.dependency && obj.dependency.dependent_value == value) {
          obj.is_hide = false;
        } else if (obj.dependency && obj.dependency.dependent_value != value) {
          obj.is_hide = true;
        }
        if (form.form_control_name === "transport_id") {
          if (value == "1" && obj.label_name == "Dynamic Row Fields") {
            obj.is_hide = true;
          } else {
            obj.is_hide = false;
          }
        }
      }
    });
  }

  uploadLineItemDoc() {
    this.productParam.search = "";
    if (this.inClient) {
      this.getProducts("search");
      this.isAddProduct = false;
      let dialogRef = this.dialog.open(ProductsImportComponent, {
        width: "550px",
        data: {
          type: "productsList",
          clickedFrom: "create_pfi",
        },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.data.error == false) {
          for (let i = 0; i < result.data.productsList.length; i++) {
            const indx = _.findIndex(this.order.products, {
              name: result.data.productsList[i].product_details,
            });
            // this.productItem = this.productsDynamicForm.get(
            //   "productItem"
            // ) as FormArray;
            this.productItem.push(
              this.generateProductDynamicForm({
                ...result.data.productsList[i],
                product_id: this.order.products[indx].id,
              })
            );
          }
          this.productItem.markAllAsTouched();
          this.calculateOrder();
          this.productError = false;
          this.productselecterror = false;
        }
      });
    } else {
      this.isAddProduct = true;
    }
  }
  public productsdata = [];
  async getAttributesPrefillData() {
    this.productsdata = [];
    let data;
    const handleResponse = (response: any) => {
      if (response.result.success && response.result.data) {
        // let arr: any = [];
        // arr = response.result.data
        // arr = arr.forEach((ele: any) => {
        // this.productsdata.push(ele.meta_data)

        // })
        // console.log(this.productsdata, arr)

        // data = response.result.data[0].meta_data;

        // setTimeout(() => {
        //   this.productsDynamicForm.patchValue({
        //     productItem: [...this.productsdata],
        //   });
        // }, 1500)
        if (response.result.data.length) {
          response.result.data.forEach((ele: any) => {
            this.productsdata.push(ele.meta_data);
          });

          this.productsdata.forEach((obj: any) => {
            this.selectedOptions.push(obj.name);
          });

          this.populateForm(this.productsdata);
          // this.productsDynamicForm.patchValue({
          //   productItem: this.productsdata,
          // });
          this.totalVal = 0;
          if (response.result.data.length) {
            response.result.data.some((item) => {
              this.totalVal = this.totalVal + item.meta_data.amount;
            });
          }

          this.productAttributes.map(async (obj: any, index: number) => {
            // obj.options = await this.getDynamicArray(index);
            if (!obj.dependent_on_field_id) {
              obj.options = this.dropdOptions?.[obj.form_control_name] || [];
            }
            if (obj.slug === "dropdown" || obj.slug === "auto_suggest") {
              const newObj =
                response.result.data[0].meta_data?.[obj.form_control_name];
              if (newObj) {
                const indx = _.findIndex(obj.options, { id: newObj.id });
                if (indx < 0) {
                  obj.options.push(newObj);
                }
              }
            }
          });

          if (
            this.module === "add_product_in_shipment" ||
            (this.module === "add_products_in_po" && this.shipmetOrderProducts)
          ) {
            this.totalVal = 0;
          }
          const obj = {
            addProdustsForm: this.productsDynamicForm,
            productFormID: this.form_id,
            subTotalVal: this.totalVal,
          };
          this.trigger.emit(obj);
        }
      }
      return data;
    };
    if (
      this.module === "add_product_in_shipment" ||
      (this.module === "add_products_in_po" && !this.editPo)
    ) {
      handleResponse(this.shipmetOrderProducts);
      // this.service
      //   .getOrderProducts({
      //     order_id: this.Contacts,
      //   })
      //   .then(handleResponse)
      //   .catch((error) => console.log(error));
    } else if (this.selected_order_ids && this.selected_order_ids.length) {
      this.service
        .getShipmentProductList({
          selected_order_ids: this.selected_order_ids,
          type: this.type,
        })
        .then(handleResponse)
        .catch((error) => console.log(error));
    } else {
      await this.service
        .getAttributes({
          module: this.form_id,
          id: this.Contacts?.id || this.Contacts,
        })
        .then(handleResponse)
        // .then((response) => {
        //   if (response.result.success && response.result.data) {
        //     // let arr: any = [];
        //     // arr = response.result.data
        //     // arr = arr.forEach((ele: any) => {
        //     // this.productsdata.push(ele.meta_data)

        //     // })
        //     // console.log(this.productsdata, arr)

        //     // data = response.result.data[0].meta_data;

        //     // setTimeout(() => {
        //     //   this.productsDynamicForm.patchValue({
        //     //     productItem: [...this.productsdata],
        //     //   });
        //     // }, 1500)
        //     if (response.result.data.length) {
        //       response.result.data.forEach((ele: any) => {
        //         this.productsdata.push(ele.meta_data);
        //       });
        //       this.populateForm(this.productsdata);
        //       this.totalVal = response.result.data.length
        //         ? response.result.data[0].meta_data.amount
        //         : 0;
        //       const obj = {
        //         addProdustsForm: this.productsDynamicForm,
        //         productFormID: this.form_id,
        //         subTotalVal: this.totalVal,
        //       };
        //       this.trigger.emit(obj);
        //     }
        //   }
        //   return data;
        // })
        .catch((error) => console.log(error));
    }
    return data;
  }

  populateForm(products: any[]): void {
    const productItemArray = this.productsDynamicForm.get(
      "productItem"
    ) as FormArray;
    const existingControlNames = Object.keys(
      productItemArray.at(0)?.value || {}
    );
    productItemArray.clear(); // Clear existing items

    products.forEach((product) => {
      const formGroup = this.generateProductDynamicForm(product);

      existingControlNames.forEach((controlName) => {
        if (!formGroup.contains(controlName)) {
          formGroup.addControl(controlName, this.formBuilder.control(null));
        }
      });
      productItemArray.push(formGroup);
    });
    this.productAttributes.map((attr) => {
      this.getValidation(attr);
    });
  }

  createProductFormGroup(product: any): FormGroup {
    return this.formBuilder.group({
      // Define your form controls based on product.meta_data
      name: [product.name],
      price: [product.price],
      // Add other controls as needed
    });
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
  getAvailableOptions(index: number) {
    const usedOptions = this.selectedOptions
      .filter((val, i) => i !== index && val !== null)
      .map((val) => val.id);

    // return this.dropdOptions["name"].filter(
    //   (option) => !usedOptions.includes(option.id)
    // );

    return this.dropdOptions["name"];
  }
}
