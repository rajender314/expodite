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
  selector: "app-package-products-form",
  templateUrl: "./package-products-form.component.html",
  styleUrls: ["./package-products-form.component.scss"],
})
export class PackageProductsFormComponent implements OnInit {
  @Input() productRemainQty;
  @Input() selected_order_ids: [] = [];
  @Input() packageQuantity;
  @Input() type: string = "";
  @Input() clientSelectedId: any;
  @Input() related_to_id: any = "";
  @Input() importLineItems: boolean = true;
  @Input() selectClientRequired: boolean = false;
  @Input() selectedCurrency;
  @Input() module;
  @Output() trigger = new EventEmitter<any>();
  @Output() getProductsData = new EventEmitter<any>();

  @Input() Contacts: any;
  @Input() selectedRowsGrid;
  @Input() isSubmitBtnClicked: any;
  @Input() is_pallet;
  @Input() customPackingLabel;
  @Input() resetProductsForm;
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
  async ngOnInit() {
    // this.productAttributes = this.formFields
    this.productsDynamicForm = this.formBuilder.group({
      productItem: this.formBuilder.array([]),
    });
    // await this.getShipmentProducts();
    await this.getDropdownsList();
    await this.getOrgStoreAttribute();

    // if (this.is_pallet) {
    //   console.log(changes, 74);
    let arr = [];
    // setTimeout(() => {
    arr = this.findObjectsWithKeyValue("dependent_field", "is_pallet");
    if (arr.length) {
      arr.forEach((obj: any) => {
        if (
          obj.dependency &&
          obj.dependency.dependent_value ==
            (this.is_pallet != null ? this.is_pallet : false)
        ) {
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
    // }, 500);
    // }

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
  isRemainingQuantityError = false;
  checkRemainingQuantityError(
    productAttributes: any,
    item: any,
    productsDynamicForm: any,
    i: number,
    j: number
  ) {
    this.isRemainingQuantityError =
      productAttributes[j]?.form_control_name === "quantity" &&
      productsDynamicForm.controls.productItem.controls[i].controls[
        productAttributes[j].form_control_name
      ].value *
        this.packageQuantity >
        this.productRemainQty[item.value.name].remaining_quantity;
    // Emit the error state to the parent
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
          if (this.Contacts && !this.selectedRowsGrid) {
            await this.getAttributesPrefillData();
          } else if (this.selectedRowsGrid) {
            let iDs = [];
            this.selectedRowsGrid.forEach((row) => {
              iDs.push(row.id);
            });
            this.getPFIPOprodList(iDs);
          }
          this.isDisplayFields();
          setTimeout(() => {
            this.fetchingData = false;
          }, 500);
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

  // async getShipmentProducts() {
  // await this.service
  //   .getShipmentProducts({ shipment_id: this.related_to_id })
  //   .then((res) => {
  //     this.productRemainQty = res.result.data;
  //   });
  // }

  public dropdOptions = {};
  public orginalDropdOptions: any = {};
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
        this.orginalDropdOptions = { ...response.result.data };

        const filterDropdownOptions = (options) => {
          if (options?.name?.length) {
            options.name = options.name.filter((item) =>
              this.productRemainQty[item.id]
                ? this.productRemainQty[item.id].remaining_quantity > 0
                : item
            );
          }
        };

        filterDropdownOptions(this.dropdOptions);
        filterDropdownOptions(this.orginalDropdOptions);

        this.getProductsData.emit({ products: response.result.data });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.is_pallet) {
      let arr = [];
      // setTimeout(() => {
      arr = this.findObjectsWithKeyValue("dependent_field", "is_pallet");
      if (arr.length) {
        arr.forEach((obj: any) => {
          if (
            obj.dependency &&
            obj.dependency.dependent_value == changes.is_pallet.currentValue
          ) {
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
      // }, 500);
      if (this.resetProductsForm === true) {
        this.productsDynamicForm.reset();
        while (this.productItem.length !== 0) {
          this.productItem.removeAt(0);
        }
        this.dropdOptions = { ...this.orginalDropdOptions };
        this.dropDownlistarray = {};
      }
    }
    if (
      changes.customPackingLabel ||
      changes.is_pallet
      //  is_pallet
      // !this.is_pallet &&
      // this.customPackingLabel
    ) {
      this.handleLabelDependent();
    }
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
    if (changes.productRemainQty && this.productRemainQty) {
      const filterDropdownOptions = (options) => {
        if (options?.name?.length) {
          options.name = options.name.filter((item) =>
            this.productRemainQty[item.id]
              ? this.productRemainQty[item.id].remaining_quantity > 0
              : item
          );
        }
      };

      filterDropdownOptions(this.dropdOptions);
      filterDropdownOptions(this.orginalDropdOptions);
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
      // this.productsDynamicForm.get("productItem")["controls"].map((obj) => {
      for (let key in group2.controls) {
        if (this.dropdOptions[key])
          if (this.dropDownlistarray[key])
            this.dropDownlistarray[key].push(this.dropdOptions[key]);
          else this.dropDownlistarray[key] = [this.dropdOptions[key]];
      }

      // });
      this.productError = false;
    } else {
      this.isAddProduct = true;
    }
    if (!this.is_pallet) {
      this.handleLabelDependent();
    }
  }
  generateProductDynamicForm(item?): FormGroup {
    let arr = Object.keys(item);
    let formControls = {};
    arr.forEach((controlName) => {
      formControls[controlName] = [
        item?.[controlName] != undefined ? item[controlName] : "",
      ];
    });

    if (this.module === "add_product_in_shipment") {
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
    this.totalVal = 0;
    if (obj.form_control_name == "quantity") {
      let item = this.productItem.value.at(formIndex);
      this.productItem.at(formIndex).setValue({
        ...this.productItem.at(formIndex).value,
        id: item.id,
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
      this.productsDynamicForm.value.productItem.forEach((obj: any) => {
        {
          if (obj.is_checked) this.totalVal = this.totalVal + obj.amount;
        }
      });
      const obj = {
        addProdustsForm: this.productsDynamicForm,
        productFormID: this.form_id,
        subTotalVal: this.totalVal,
      };
      this.trigger.emit(obj);
    } else if (obj.form_control_name == "price") {
      let item = this.productItem.value.at(formIndex);
      this.productItem.at(formIndex).setValue({
        ...this.productItem.at(formIndex).value,
        id: item.id,
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
    let deletedProduct = this.orginalDropdOptions["name"].find(
      (item) => item.id === this.productItem.value[index].name.id
    );

    this.productAttributes.map((obj: any) => {
      if (obj.custom_label) {
        obj.custom_label.delete(index);
      }
      return obj;
    });

    if (deletedProduct) {
      this.dropdOptions["name"].push(deletedProduct);
      this.dropDownlistarray["name"].splice(index, 1);
      this.dropDownlistarray["name"].forEach((obj) => obj.push(deletedProduct));
    }
    // this.productsDynamicForm.get("productItem")["controls"].map((obj) => {
    //   for (let key in obj.value) {
    //     if (this.dropdOptions[key])
    //       if (this.dropDownlistarray[key])
    //         this.dropDownlistarray[key].push(this.dropdOptions[key]);
    //       else this.dropDownlistarray[key] = [this.dropdOptions[key]];
    //   }

    // });

    this.productItem.removeAt(index);
    this.productselecterror = false;
    this.calculateDiscount();
    this.calculateOrder();
    this.productsDynamicForm.markAsDirty();
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
    if (this.Contacts) {
      this.populateForm(this.productsdata);
    }
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
    if (ele.slug === "single_line_text") {
      if (ele.regex) {
        list.push(Validators.pattern(ele.regex));
      }
      if (ele.max_length) {
        list.push(Validators.maxLength(ele.max_length));
      }
    }
    // if (ele.slug === "single_line_text" || ele.slug === "paragraph_text") {
    if (ele.min_length) {
      list.push(Validators.minLength(ele.min_length));
      // }

      list.push(CustomValidation.noWhitespaceValidator);
    }
    if (ele.validations && ele.validations.length) {
      if (ele.validations[0].hasOwnProperty("minLength")) {
        list.push(Validators.minLength(ele.validations[0].minLength));
      }
      if (ele.validations[0].hasOwnProperty("maxLength")) {
        list.push(Validators.maxLength(ele.validations[0].maxLength));
      }
      if (ele.validations[0].hasOwnProperty("pattern")) {
        list.push(Validators.pattern(ele.validations[0].pattern));
      }
    }

    return list;
  }

  dropDownlistarray: any = {};
  isDisplayFields() {
    this.dropDownlistarray = {};

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
    if (!this.Contacts) {
      this.productsDynamicForm.get("productItem")["controls"].map((obj) => {
        for (let key in obj.value) {
          if (this.dropdOptions[key])
            if (this.dropDownlistarray[key])
              this.dropDownlistarray[key].push(this.dropdOptions[key]);
            else this.dropDownlistarray[key] = [this.dropdOptions[key]];
        }
      });
    } else {
      this.dropDownlistarray.name = this.productItem.value.map((list, i) => {
        let options = [...this.orginalDropdOptions["name"]];
        this.productItem.value.forEach((item, j) => {
          if (i !== j) {
            options = options.filter((opt) => opt.id !== item.name.id);
          }
          this.dropdOptions["name"] = this.dropdOptions["name"].filter(
            (opt) => opt.id !== item.name.id
          );

          // this.orginalDropdOptions['name'].map(obj=>{

          // })
          // if (i === j) {
          //   // Keep the array as it is if it's at the specified index
          //   return subArray;
          // } else {
          //   // Filter out objects with the specified id in all other arrays
          //   return subArray.filter((obj) => obj.id !== event.value);
          // }
        });

        return options;
      });
    }
    this.handleLabelDependent();
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

  async handleLabelDependent() {
    this.productAttributes.map((obj: any) => {
      let indx = 0;
      if (obj.label_dependent_field_id) {
        let dependentFormControl = this.productAttributes.find(
          (item) => item.id === obj.label_dependent_field_id[0]
        ).form_control_name;
        obj.custom_label = new Map();

        this.productsDynamicForm.value.productItem.some(
          (itemValues, formIndex) => {
            let value = this.is_pallet
              ? itemValues[dependentFormControl]
              : this.customPackingLabel;
            obj.custom_label.set(formIndex, value ? "(" + value + ")" : "");
          }
        );
      }
      // if (!this.is_pallet) {
      //   obj.custom_label = new Map();

      //   this.productsDynamicForm.value.productItem.some(
      //     (itemValues, formIndex) => {
      //       let value = this.customPackingLabel;
      //       obj.custom_label.set(formIndex, value ? "(" + value + ")" : "");
      //     }
      //   );
      // }
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
  async dropDownSelectionChange(event, formdata, index, formArray) {
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

      this.dropDownlistarray.name = this.dropDownlistarray["name"].map(
        (list, i) => {
          let options = [...this.orginalDropdOptions["name"]];
          this.productItem.value.forEach((item, j) => {
            if (i !== j) {
              options = options.filter((opt) => opt.id !== item.name.id);
            }

            // this.orginalDropdOptions['name'].map(obj=>{

            // })
            // if (i === j) {
            //   // Keep the array as it is if it's at the specified index
            //   return subArray;
            // } else {
            //   // Filter out objects with the specified id in all other arrays
            //   return subArray.filter((obj) => obj.id !== event.value);
            // }
          });

          return options;
        }
      );
      const selectedProd = this.dropDownlistarray["name"][index].find(
        (obj) => obj.id === event.value.id
      );
      if (selectedProd && selectedProd.description) {
        this.productsDynamicForm.controls.productItem["controls"][index]
          .get("description")
          ?.setValue(selectedProd.description || "");
      }
      this.dropdOptions["name"] = this.dropDownlistarray["name"][index].filter(
        (obj) => obj.id !== event.value.id
      );

      // console.log(
      //   this.dropDownlistarray.name["name"][index].map(
      //     (obj) => obj.id !== event.value
      //   )
      // );
    }
    let arr = [];
    arr = this.findObjectsWithKeyValue(
      "dependent_field",
      formdata.form_control_name
    );
    if (arr.length) {
      arr.map((obj: any) => {
        if (
          obj.dependency &&
          obj.dependency.dependent_value == event.value.id
        ) {
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
        id: event.value.id,
      });
      this.selectedCurrency = formArray[index].options[indx];
    }

    if (formdata.form_control_name === "transport_id") {
      localStorage.setItem("mode_of_shipment", event.value.id);
    }

    const param = {
      id: event.value.id,
      form_control_name: formdata.form_control_name,
      module: this.module,
    };
    if (formdata.label_name === "Country") {
      this.getDynamicOptionsFromApi(param, 0);
    }
    this.hideCustomComponents(event.value.id, formdata);
  }

  findObjectsWithKeyValue(key, value) {
    const objects = [];
    this.productAttributes.forEach((element) => {
      if (element.dependency && element.dependency[key] === value) {
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
          this.populateForm(this.productsdata);
          this.totalVal = 0;
          if (response.result.data.length) {
            response.result.data.some((item) => {
              this.totalVal = this.totalVal + item.meta_data.amount;
            });
          }

          if (this.module === "add_product_in_shipment") {
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
    if (this.module === "add_product_in_shipment") {
      this.service
        .getOrderProducts({
          order_id: this.Contacts,
        })
        .then(handleResponse)
        .catch((error) => console.log(error));
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
    productItemArray.clear(); // Clear existing items

    products.forEach(async (product, index) => {
      productItemArray.push(this.generateProductDynamicForm(product));
      if (product.name) {
        const param = {
          id: product.name,
          form_control_name: "name",
          module: this.module,
        };
        const response: any = await this.getDynamicOptionsFromApi(param, index);
      }
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

  // getFormControlValue(formIndex: number, form_control_name: string) {
  //   return this.productItem.at(formIndex).get(form_control_name).value
  //     ? this.productItem.at(formIndex).get(form_control_name).value
  //     : "0";
  // }

  getFormControlValue(formIndex: number, form_control_name: string): string {
    const formGroup = this.productItem.at(formIndex);
    if (formGroup && formGroup.get(form_control_name)) {
      return formGroup.get(form_control_name).value
        ? formGroup.get(form_control_name).value
        : "0";
    } else {
      console.warn(
        `Form control not found: Index - ${formIndex}, Control - ${form_control_name}`
      );
      return "0";
    }
  }
  setFormControlValue(formIndex: number, form_control_name: string, value) {
    this.productItem.at(formIndex).get(form_control_name).setValue(value);
  }

  // public subPackingLabelMap = new Map<number, string>();
  onInputChange(e: any, obj: any, name: string, formIndex, fieldId) {
    if (obj.form_control_name == "packing_type") {
      this.productAttributes.forEach((obj: any) => {
        let indx = 0;
        if (obj.label_dependent_field_id) {
          indx = obj.label_dependent_field_id.indexOf(fieldId);
          if (!obj.custom_label) {
            obj.custom_label = new Map();
          }
          if (indx > -1 && obj.label_dependent_field_id[indx] == fieldId) {
            obj.custom_label.set(
              formIndex,
              e.target.value ? "(" + e.target.value + ")" : ""
            );
          }
        }
        return obj;
      });
    }

    if (
      this.is_pallet &&
      (obj.form_control_name == "quantity" ||
        obj.form_control_name == "unit_weight" ||
        obj.form_control_name == "tare_weight" ||
        obj.form_control_name == "net_weight" ||
        obj.form_control_name == "number_of_sub_packages")
    ) {
      const quantity = this.getFormControlValue(formIndex, "quantity") || "0";
      const unit_weight =
        this.getFormControlValue(formIndex, "unit_weight") || "0";
      const tare_weight =
        this.getFormControlValue(formIndex, "tare_weight") || "0";
      if (
        !this.productAttributes.some(
          (obj) => obj.form_control_name === "total_net_weight"
        )
      ) {
        const net_weight =
          (obj.is_editable && obj.form_control_name == "total_net_weight") ||
          obj.form_control_name == "tare_weight"
            ? this.getFormControlValue(formIndex, "net_weight")
            : (parseFloat(unit_weight) * parseFloat(quantity)).toFixed(3);

        const gross_weight = (
          parseFloat(net_weight) + parseFloat(tare_weight)
        ).toFixed(3);

        this.setFormControlValue(formIndex, "gross_weight", gross_weight);

        this.setFormControlValue(formIndex, "net_weight", net_weight);
      } else {
        const number_of_sub_packages = this.getFormControlValue(
          formIndex,
          "number_of_sub_packages"
        );

        const total_net_weight = isNaN(
          parseFloat(number_of_sub_packages) *
            parseFloat(quantity) *
            parseFloat(unit_weight)
        )
          ? 0
          : (
              parseFloat(number_of_sub_packages) *
              parseFloat(quantity) *
              parseFloat(unit_weight)
            )?.toFixed(3);

        this.setFormControlValue(
          formIndex,
          "total_net_weight",
          total_net_weight
        );
      }

      //   console.log(this.productsDynamicForm.value.productItem)
      //   let netWtSubPackage = 0;
      //   let grossWtSubPackage = 0;
      // this.productsDynamicForm.value.productItem.forEach((obj: any) => {
      //   console.log(obj);
      //   netWtSubPackage += Number(obj.net_weight) * Number(obj.number_of_sub_packages || 0)
      // });

      // console.log(netWtSubPackage)
    }
    //   if (
    //     obj.form_control_name == "net_weight_per_package" ||
    //     obj.form_control_name == "tare_weight" ||
    //     obj.form_control_name == "quantity" ||
    //     obj.form_control_name == "primary_quantity" ||
    //     obj.form_control_name == "primary_tare_weight"
    //   ) {
    //     const is_pallet =
    //       this.getFormControlValue(formIndex, "is_pallet") == "0"
    //         ? false
    //         : true;
    //     let primary_quantity = is_pallet
    //       ? this.getFormControlValue(formIndex, "primary_quantity")
    //       : 1;
    //     const net_weight = this.getFormControlValue(
    //       formIndex,
    //       "net_weight_per_package"
    //     );
    //     const tare_weight = this.getFormControlValue(formIndex, "tare_weight");
    //     const quantity = this.getFormControlValue(formIndex, "quantity");

    //     const gross_weight = (
    //       parseFloat(net_weight) + parseFloat(tare_weight)
    //     ).toFixed(3);

    //     const total_net_weight = (
    //       (is_pallet ? parseFloat(primary_quantity) : 1) *
    //       parseFloat(net_weight) *
    //       parseFloat(quantity)
    //     ).toFixed(3);

    //     let total_gross_weight;

    //     this.setFormControlValue(
    //       formIndex,
    //       "total_net_weight",
    //       total_net_weight
    //     );
    //     this.setFormControlValue(
    //       formIndex,
    //       "gross_weight_per_package",
    //       gross_weight
    //     );

    //     if (is_pallet) {
    //       const primary_tare_weight = this.getFormControlValue(
    //         formIndex,
    //         "primary_tare_weight"
    //       );

    //       const net_weight_per_pallet = (
    //         parseFloat(net_weight) * parseFloat(quantity)
    //       ).toFixed(3);

    //       const gross_weight_per_pallet = (
    //         parseFloat(primary_quantity) * parseFloat(gross_weight)
    //       ).toFixed(3);

    //       total_gross_weight = (
    //         parseFloat(primary_quantity) *
    //         (parseFloat(quantity) * parseFloat(tare_weight) +
    //           parseFloat(primary_tare_weight) +
    //           parseFloat(net_weight_per_pallet))
    //       ).toFixed(3);

    //       this.setFormControlValue(
    //         formIndex,
    //         "net_weight_per_pallet",
    //         net_weight_per_pallet
    //       );

    //       this.setFormControlValue(
    //         formIndex,
    //         "gross_weight_per_pallet",
    //         gross_weight_per_pallet
    //       );
    //     } else {
    //       total_gross_weight = (
    //         parseFloat(total_net_weight) +
    //         parseFloat(quantity) * parseFloat(tare_weight)
    //       ).toFixed(3);
    //     }
    //     this.setFormControlValue(
    //       formIndex,
    //       "total_gross_weight",
    //       total_gross_weight
    //     );
    //   }
    // }
    const emitObj = {
      addProdustsForm: this.productsDynamicForm,
      productFormID: this.form_id,
      subTotalVal: this.totalVal,
      onInputChange: true,
    };
    this.trigger.emit(emitObj);
  }
  isConditionMet(
    productAttributes: any[],
    j: number,
    productsDynamicForm: any,
    i: number,
    packageQuantity: number,
    isPallet: number,
    productRemainQty: any,
    item: any
  ): boolean {
    const formControlName = productAttributes[j]?.form_control_name;
    if (formControlName !== "quantity") {
      return false;
    }
    const controlValue =
      productsDynamicForm.controls.productItem.controls[i].controls[
        formControlName
      ]?.value || 0;

    const numberOfSubPackages =
      controlValue *
      packageQuantity *
      (isPallet
        ? productsDynamicForm.controls.productItem.controls[i].controls
            .number_of_sub_packages.value
        : 1);

    return (
      numberOfSubPackages >
      productRemainQty[item.value.name.id]?.remaining_quantity
    );
  }
  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }
}
