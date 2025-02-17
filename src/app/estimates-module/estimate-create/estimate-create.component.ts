import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewInit,
  Output,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Router, NavigationStart } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Param } from "../../custom-format/param";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { SelectModule } from "ng2-select";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  trigger,
  style,
  state,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import * as _ from "lodash";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import * as moment from "moment";
import { CustomValidation } from "../../custom-format/custom-validation";
import { OrganizationsService } from "../../services/organizations.service";
import { language } from "../../language/language.module";
import { OrdersService } from "../../services/orders.service";
import { DialogComponent } from "../../dialog/dialog.component";
import { SnakbarService } from "../../services/snakbar.service";
import { AddressComponent } from "../../dialogs/address/address.component";
import { AdminService } from "../../services/admin.service";
import { AddProductComponent } from "../../leads/add-product/add-product.component";
import { AddNewProductComponent } from "../../dialogs/add-product/add-product.component";
import { ImportComponent } from "../../dialogs/import/import.component";
import { ProductsImportComponent } from "../products-import/products-import.component";
declare var App: any;

const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-estimate-create",
  templateUrl: "./estimate-create.component.html",
  styleUrls: ["./estimate-create.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("ordersAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class EstimateCreateComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  clintName: string;
  clientsForm: FormGroup;
  productsForm: FormGroup;
  addressForm: FormGroup;
  createAddressForm: FormGroup;
  productsDynamicForm: FormGroup;
  public productItem: FormArray;
  searchCtrl = new FormControl();
  public language = language;
  public estimateslanguage = estimate_name;
  public orderDeliveryDate: any;
  public is_sso: boolean = App.env_configurations
    ? App.env_configurations.is_sso
    : true;
  public showError: boolean = false;
  public newClientadded: boolean = false;
  public newClient: boolean = false;
  public searching: boolean = false;
  public selectAuto: boolean = false;
  public addNew: boolean = false;
  public inClient: boolean = false;
  public pfiNbrSeriesLimit: boolean = false;
  public showNoProdFound: boolean = false;
  public productSubmit: boolean = false;
  public uploadImage: boolean = false;
  public showValidation: boolean = false;
  public sizeError: boolean = false;
  public hasDropZoneOver: boolean = false;
  public open: boolean = false;
  public slectStatus: boolean = false;
  public uncheck: boolean = true;
  public sameChkShow: boolean = false;
  public showBillingAddress: boolean = false;
  public confirOrderLoad: boolean = false;
  public createbtnDisabled: boolean = false;
  public fetchingData: boolean = false;
  public productError: boolean = false;
  public isAddProduct: boolean = false;
  public noOrganizations: boolean = false;
  public invoiceGenerateLoader: boolean = false;
  public clickedProformaInvoice: boolean = false;
  public totalSpinner: boolean = false;
  public pointerEvent: boolean = false;
  public enableInvoice: boolean = false;
  public hideShipperAddress: boolean = false;
  public enableProforma: boolean = false;
  public totalCount: number = 0;
  public totalPages: number = 0;
  public formIndex: number = 0;
  public subTotal: number =
    this.data?.editEstimateData?.profInv?.sub_total || 0;
  public total: number = 0;
  public discount: number =
    parseFloat(
      this.data?.editEstimateData?.profInv?.discount_value?.replace(/,/g, "")
    ) || 0;
  public discountPercent: number =
    parseFloat(this.data?.editEstimateData?.profInv?.discount_percentage) || 0;
  public errormessage: string = "";
  public emailLength: string = "";
  public orderFaildedMsg: string = "";
  public clientCurrency: string = "";
  public transport_id: number =
    this.data?.editEstimateData?.profInv?.transport_mode_id || 0;
  private imageUploadUrl: string = App.base_url + "uploadOrderPo";
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  public newItemIcon: string =
    App.base_url + "dashboard/assets/images/new-plus.png";
  public uploadIcon: string =
    App.base_url + "dashboard/assets/images/upload-icon.png";
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  public importIcon: string =
    App.base_url + "signatures/assets/images/Import.svg";
  public totalClients = [];
  public portofloading = [];
  public clientsStatus;
  public freightamt: number =
    parseFloat(
      this.data?.editEstimateData?.profInv?.freight?.replace(/,/g, "")
    ) || 0;
  public insuranceValue: number =
    parseFloat(
      this.data?.editEstimateData?.profInv?.insurance?.replace(/,/g, "")
    ) || 0;

  public productselecterror: boolean = false;
  public discountError: boolean;
  public poDate: any = this.data?.editEstimateData?.profInv?.po_date
    ? new Date(this.data?.editEstimateData?.profInv?.po_date)
    : null;
  textareaContent: string = "";
  wordCount: number = 0;
  unsetCheckbox;
  currencyX: any[];
  private param: Param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
  };
  private productParam: Param = {
    // page: 1,
    // perPage: 50,
    sort: "ASC",
    search: "",
  };

  public order = {
    clientSubmit: false,
    addressSubmit: false,
    createAddSubmit: false,
    organizations: [],
    selectedOrg: "",
    products: [],
    selectedProducts: [],
    selectedProductsError: false,
    selectedBillingError: false,
    selectedShippingError: false,
    selectedNotifyError: false,
    clientAddress: [],
    companyAddress: [],
    notifyAddress: [],
    clientContacts: [],
    po: "",
    special_instructions: "Special Instructions",
    email: "abc@gmail.com",
    phone: "9999999999",
    countries: [],
    po_no: "",
    states: [],
    countriesStates: [],
    filename: "",
    original_name: "",
    src_name: "",
    address_types: [],
    addressType: "",
    currency: "",
    uploadError: false,
    inco_terms_id: 0,
    mode_of_transport: [],
    selectedOrder: {
      client_name: "",
      client_image: "",
      date_added: "",
      id: "",
      order_no: "",
      image: "",
      po_nbr: "",
      po_url: "",
      product_name: "",
      status: "",
      total_amount: "",
      total_quantity: "",
      orders_types_id: "",
      tareWeight: 0,
      netWeight: 0,
      grossWeight: 0,
      special_instructions: "",
      po_date: "",
      line_item: "",
    },
  };
  public shippingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public billingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public notifyAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    allowedMimeType: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
      "application/doc",
      "application/docx",
    ],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  public selectedProduct: any = {
    id: 0,
    name: "",
    price: "",
    quantity: "",
    amount: 0,
  };

  public modelData: any = {};
  public checkedArr: any = {};
  public selectedOrganizations: object;

  public ProductsArr: any = [];
  public productValue: any = [];
  public contactsList: any = [];
  public uploads: any = [];
  public clientAddressSame: any = [];
  public organizationsList: Array<any> = [];
  public organizationDetails: Array<any> = [];
  public proformaInvData: Array<any> = [];
  public incoTermsList: any = [];
  public incotermsStaList: any = [];
  public now: Date = new Date();

  private timeout: any;
  public newClientid: any;
  public deliveryDate: any = this.data?.editEstimateData?.profInv
    ?.expected_delivery_date
    ? new Date(this.data?.editEstimateData?.profInv?.expected_delivery_date)
    : null;
  public clientSelectedId;
  public firstName = "";
  public lastName = "";

  constructor(
    private formBuilder: FormBuilder,
    private organizationsService: OrganizationsService,
    private OrdersService: OrdersService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<EstimateCreateComponent>,
    private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.uploader.onBeforeUploadItem = (fileItem: any) => {
      fileItem.formData.push({ 123: 234 });
    };
    this.uploader.onAfterAddingFile = (item: any) => {
      this.pointerEvent = true;
    };
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      if (item.size >= options.maxFileSize) {
        this.sizeError = true;
        this.uploadImage = false;
      } else {
        this.uploadImage = true;
        this.sizeError = false;
      }
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      let obj = JSON.parse(response);
      if (obj.result.success) {
        this.uploads.push(obj.result.data);
        this.order.uploadError = false;
        this.uploadImage = false;
        this.sizeError = false;
      }
    };
  }
  ngOnInit(): void {
    this.generateProductDynamicForm();
    this.productsDynamicForm = new FormGroup({
      productItem: new FormArray([]),
    });
    this.getShippingAddressDetails();
    this.getShipments();
    this.getGlobalDetails();
    if (this.data && this.data.flag === "Edit Order") {
      this.generateClientsForm(this.data.editEstimateData);
      // this.selectedClients();
      // this.getClients();
      this.clintName = this.data?.editEstimateData.profInv?.client_name;
      this.generateDynamicClintForm({
        id: this.data?.editEstimateData.profInv?.client_id,
        name: this.data?.editEstimateData.profInv?.client_name,
      });
      this.setProductsDynamicForm(this.data.editEstimateData.productsData);
      this.calculateOrder();
      this.changeIncoTerms(this.data?.editEstimateData.profInv?.inco_terms_id);
      this.textareaContent =
        this.data?.editEstimateData?.profInv?.terms_cond_des?.replace(
          /<br>/gi,
          "\n"
        );
      this.order.currency = this.data?.editEstimateData?.profInv?.currency;
    } else {
      this.generateClientsForm();
      if (App.user_details) {
        this.firstName = App.user_details.firstname;
        this.lastName = App.user_details.lastname;
      }
      this.productsForm.patchValue({
        account_manager: this.firstName + " " + this.lastName,
      });
    }
  }
  public alphanumericRegex = /^[a-zA-Z0-9]*$/;
  public nameValidator(control: FormControl) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { specialcharacters: true };
    }
  }
  generateDynamicClintForm(data) {
    this.clientSelectedId = data.id;
    this.modelData.id = data.id;
    this.modelData.name = data.name;
    this.searchCtrl.setValue(data.name);
    this.getProducts("search");
    this.getContacts();
    this.getAddress();
    this.inClient = true;
  }
  onPrfillAddress() {
    if (this.data.flag === "Edit Order") {
      let address = this.data.editEstimateData;

      this.order.clientAddress.forEach((val) => {
        if (val.address_id === address.shippingAddr.shipping_address_id) {
          val.selected = true;
        }
      });

      this.order.companyAddress.forEach((val) => {
        if (val.address_id === address.billingAddr.billing_address_id) {
          val.selected = true;
        }
      });

      this.order.notifyAddress.forEach((val) => {
        if (val.address_id === address.notifyingAddr.notify_address_id) {
          val.selected = true;
        }
      });
    }
  }

  generateClientsForm(data?: any): void {
    this.clientsForm = this.formBuilder.group({
      client: [data?.profInv?.client_name || null, Validators.required],
      company_name: [
        null,
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      website: [null, [Validators.pattern(CustomValidation.websitePattern)]],
      status: [null, Validators.required],
      currency_id: [null, Validators.required],
      country_id: [null, Validators.required],
      addCountry: "",
    });
    this.productsForm = this.formBuilder.group({
      special_instructions: data?.profInv?.special_instructions || "",
      email: [
        data?.profInv?.email || null,
        [Validators.required, Validators.pattern(CustomValidation.EMAIL_REGEX)],
      ],
      phone: [
        data?.profInv?.phone || null,
        [
          Validators.required,
          // Validators.minLength(6),
          // Validators.pattern(CustomValidation.phonePattern),
        ],
      ],
      po_no: [
        data?.profInv?.po_nbr || null,
        // [Validators.pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/)],
      ],
      po_date: [
        data?.profInv?.po_date && data?.profInv?.po_date != ""
          ? data?.profInv?.po_date
          : null,
      ],
      ext: [data?.profInv?.ext || null, [Validators.pattern(/^[0-9+]+$/)]],
      kindAttn: [data?.profInv?.kindName || null, Validators.required],
      delivery_date: [null],
      quantity: [null],
      amount: [null],
      transport_mode: [
        data?.profInv?.transport_mode_id || null,
        Validators.required,
      ],
      customer_notes: "",
      terms_conditions:
        data?.profInv?.terms_cond_des.replace(/<br>/gi, "\n") || "",
      discount: [
        data?.profInv?.discount_value?.replace(/,/g, "") || null,
        [Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,3})?$/)],
      ],
      port_of_loading: [
        data?.profInv?.port_of_loading || null,
        [
          Validators.required,
          // this.nameValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      port_of_discharge: [
        data?.profInv?.port_of_discharge || null,
        [
          Validators.required,
          // this.nameValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      final_destination: [
        data?.profInv?.final_destination || null,
        [
          Validators.required,
          // this.nameValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      account_manager: [
        data?.profInv?.account_manager || null,
        [
          Validators.required,
          CustomValidation.noZeroValidator,
          CustomValidation.nameValidator,
        ],
      ],
      payment_terms: [
        data?.profInv?.payment_terms || null,
        [
          Validators.required,
          CustomValidation.noZeroValidator,
          Validators.maxLength(255),
        ],
      ],
      currency_id: [data?.profInv?.currency_id || null],
      inco_terms: [data?.profInv?.inco_terms_id || null, [Validators.required]],
      shipping: [null],
      other_delivery_terms: [
        data?.profInv?.other_delivery_terms || null,
        [Validators.maxLength(600)],
      ],
      freight: [
        data?.profInv?.freight?.replace(/,/g, "") || null,
        [Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,3})?$/)],
      ],
      insurance: [
        data?.profInv?.insurance?.replace(/,/g, "") || null,
        [Validators.pattern(/^[0-9]{1,7}(\.[0-9]{1,3})?$/)],
      ],
    });
    this.addressForm = this.formBuilder.group({
      client: [null, Validators.required],
    });
    this.createAddressForm = this.formBuilder.group({
      address1: [
        null,
        [Validators.required, CustomValidation.noWhitespaceValidator],
      ],
      address2: "",
      postal_code: [
        null,
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      city: [
        null,
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          CustomValidation.noZeroValidator,
        ],
      ],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      address_type_id: [null, [Validators.required]],
    });
  }

  public clear() {
    this.modelData.id = null;
    this.modelData.name = null;
    this.searchCtrl.setValue(null);
    this.param.search = "";
    this.getOrganizations(this.param);
    this.getProducts();
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "visible";
    }
  }
  getClients() {
    if (this.data.flag == "Edit Order") {
      return;
    }
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "visible";
    }
    this.getOrganizations(this.param);
    this.getProducts();
  }

  getOrganizations(param: object) {
    this.organizationsService.getOrganizationsList(param).then((response) => {
      if (response.result.success) {
        this.totalCount = response.result.data.total;
        this.totalClients = response.result.data.organization;
        this.clientsStatus = this.totalClients.filter((x) => {
          return x.status;
        });
        this.totalPages = Math.ceil(
          Number(this.totalCount) / this.param.perPage
        );
        this.order.organizations = this.clientsStatus;
        if (!this.clientSelectedId) {
          this.clientSelectedId = response.result.data.organization[0]?.id;
        }
      }
    });
    if (App.user_details.log_type == "2") {
      this.getProducts();
    }
  }

  public selectedClients(event?: any, param?: any) {
    this.showError = false;
    this.selectAuto = true;
    this.param.search = event?.target?.value;
    if (this.data.flag == "Edit Order") return;
    this.organizationsService
      .getOrganizationsList(this.param)
      .then((response) => {
        if (response.result.success) {
          this.totalClients = response.result.data.organization;
          this.clientsStatus = this.totalClients.filter((x) => {
            return x.status;
          });
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.param.perPage
          );
          this.order.organizations = this.clientsStatus;
          this.addNew = false;
          this.getContacts();
        }
        if (
          !response.result.data.organization?.length ||
          !this.clientsStatus?.length
        ) {
          this.addNew = true;
          this.showError = true;
          this.errormessage = "No Client Data Found";
        }
      });
  }
  setForm(data?: any) {
    this.productsForm.patchValue({
      port_of_loading: data.port_of_loading,
      port_of_discharge: data.port_of_discharge,
      final_destination: data.final_destination,
      currency_id: data.currency_id,
    });
  }
  selectionChange(data) {
    // this.productsForm.reset();
    this.unsetCheckbox = false;
    this.productsDynamicForm.reset();
    this.productsForm.patchValue({
      email: "",
      phone: "",
      ext: "",
      kindAttn: "",
      po_no: "",
      po_date: "",
      delivery_date: "",
      transport_mode: "",
      payment_terms: "",
      inco_terms: "",
      special_instructions: "",
      other_delivery_terms: "",
    });

    if (data) {
      this.inClient = true;
      this.isAddProduct = false;

      if (
        parseFloat(data.pfi_number_series) + parseFloat(data.sequence_number) >
        parseFloat(data.pfi_end_series)
      ) {
        this.organizationsService
          .getCancelledPFICount({ org_id: data.id })
          .then((response) => {
            if (response.result.success && response.result.data > 0) {
              console.log(response, 123);
              if (
                parseInt(data.pfi_number_series) +
                  parseInt(data.sequence_number) -
                  parseInt(response.result.data) >
                parseInt(data.pfi_end_series)
              ) {
                console.log(response, 123);

                this.pfiNbrSeriesLimit = true;
                return;
              }
            } else {
              this.pfiNbrSeriesLimit = true;
            }
          });
      } else this.pfiNbrSeriesLimit = false;
    } else {
      this.inClient = false;
    }

    let i = _.findIndex(<any>this.order.organizations, {
      name: data.name,
      id: data.id,
    });

    if (i > -1) {
      this.clientSelectedId = this.order.organizations[i].id;
      this.clientCurrency = this.order.organizations[i].currency_code;
      this.setForm(this.order.organizations[i]);
      this.order.currency = this.clientCurrency;
    }
    this.modelData.id = data.id;
    this.modelData.name = data.name;
    this.getOrganizations(this.param);
    this.searchCtrl.setValue(data.name);
    this.getProducts();
    this.getContacts();
    this.getAddress();
    this.errormessage = "";
  }

  searchOrders(search: string, event?: any, from?: any): void {
    this.productParam.search = search;
    this.productParam.page = 1;
    this.searching = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    if (from === "close" || search === "") {
      this.productParam.page = 1;
    }
    this.timeout = setTimeout(() => {
      this.param.page = 1;
      this.getProducts("search");
      this.searching = false;
    }, 1000);
  }

  getProducts(param?: any) {
    if (param === "search") {
      this.productParam.page = 1;
      // this.order.products = [];
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
        // page: this.productParam.page,
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

          // this.order.currency =
          //   this.data.flag === "Edit Order"
          //     ? this.data?.editEstimateData?.profInv?.currency
          //     : response.result.data.currency;
          this.order.products.map(function (value) {
            value["selected"] = false;
            value["error"] = false;
            value["quantity"] = "";
          });
        }
      });
  }
  onSelectionChanges(data: any) {
    this.order.currency = data.type;
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  openCalendar1(picker: MatDatepicker<Date>) {
    picker.open();
  }
  public clearData: boolean = false;
  changeUser(param: any) {
    let clientPhone = "";
    let clientEmail = "";
    let clientExt = "";
    let attachment_id = this.productsForm.value.kindAttn;
    this.contactsList.map(function (value) {
      if (value.name == attachment_id) {
        clientPhone = value.phone;
        clientExt = value.ext;
        clientEmail = value.email;
      }
    });

    this.productsForm.patchValue({
      phone: clientPhone,
      ext: clientExt,
      email: clientEmail,
    });
    this.productsForm.get("email");
  }

  valueChanged(event) {
    this.emailLength = event.target.value;

    if (this.emailLength.length) {
      this.showValidation = false;
    } else {
      this.showValidation = true;
    }
  }

  onScrollDown() {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.productParam.page++;
      this.getProducts();
    }
  }

  getContacts() {
    this.organizationsService
      .listContacts({
        org_id:
          App.user_details.log_type == "2"
            ? App.user_details.org_id
            : this.clientSelectedId,
        flag: 1,
      })
      .then((response) => {
        if (response.result.data.contactsData) {
          this.order.clientContacts = response.result.data.contactsData;
          let contacts = [];
          this.order.clientContacts.map(function (value) {
            value.contact["id"] = value.contact.id;
            value.contact["name"] =
              value.contact.first_name + " " + value.contact.last_name;
            value.contact["email"] = value.contact.primary_email;
            value.contact["phone"] = value.contact.primary_phone;
            contacts.push(value.contact);
          });
          if (!this.clientSelectedId) {
            this.clientSelectedId = response.result.data.organization[0]?.id;
          }
          this.contactsList = contacts;
        }
      })
      .catch((error) => console.log(error));
  }

  searchProducts(event) {
    this.productParam.search = event.target.value;
    this.getProducts("search");
  }

  changeProduct(product, formIndex) {
    let i = _.findIndex(<any>this.order.products, {
      name: product.name,
    });
    if (i > -1) {
      this.selectedProduct = this.order.products[i];
    }
    this.productselecterror = false;
    if (this.productItem.value.at(formIndex).order_product_id !== undefined) {
      this.productItem.at(formIndex).setValue({
        id: this.selectedProduct.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        amount:
          product.single_piece == false
            ? Number(product.price) / 1000
            : Number(product.price),
        single_piece: product.single_piece,
        order_product_id: null,
        p_description: null,
      });
    } else {
      this.productItem.at(formIndex).setValue({
        id: this.selectedProduct.id,
        name: product.name,
        price: Number(product.price),
        quantity: product.quantity,
        amount:
          product.single_piece == false
            ? Number(product.price) / 1000
            : Number(product.price),
        single_piece: product.single_piece,
      });
    }
  }

  enterQty(event, formIndex) {
    const item = this.productItem.value.at(formIndex);
    if (item.order_product_id !== undefined) {
      this.productItem.at(formIndex).setValue({
        id: item.id,
        amount:
          item.single_piece == false
            ? ((event.target.value * item.price) / 1000).toFixed(3)
            : (event.target.value * item.price).toFixed(3),
        name: item.name,
        price: Number(item.price),
        quantity: event.target.value,
        single_piece: item.single_piece,
        order_product_id: item.order_product_id,
        p_description: item.p_description,
      });
    } else {
      this.productItem.at(formIndex).setValue({
        id: item.id,
        amount:
          item.single_piece == false
            ? ((event.target.value * item.price) / 1000).toFixed(3)
            : (event.target.value * item.price).toFixed(3),
        name: item.name,
        price: Number(item.price),
        quantity: event.target.value,
        single_piece: item.single_piece,
      });
    }
    this.productError = false;
    this.productselecterror = false;
    this.calculateOrder();
    this.calculateFreight();
    this.calculateDiscount();
  }
  enterProd(event, formIndex) {
    const item = this.productItem.value.at(formIndex);
    if (item.order_product_id !== undefined) {
      this.productItem.at(formIndex).setValue({
        id: item.id,
        amount:
          item.single_piece == false
            ? ((event.target.value * item.quantity) / 1000).toFixed(3)
            : (event.target.value * item.quantity).toFixed(3),
        name: item.name,
        price: event.target.value,
        quantity: Number(item.quantity),
        single_piece: item.single_piece,
        order_product_id: item.order_product_id,
        p_description: item.p_description,
      });
    } else {
      this.productItem.at(formIndex).setValue({
        id: item.id,
        amount:
          item.single_piece == false
            ? ((event.target.value * item.quantity) / 1000).toFixed(3)
            : (event.target.value * item.quantity).toFixed(3),
        name: item.name,
        price: event.target.value,
        quantity: Number(item.quantity),
        single_piece: item.single_piece,
      });
    }
    this.productError = false;
    this.productselecterror = false;
    this.calculateOrder();
    this.calculateFreight();
    this.calculateDiscount();
  }

  addNewLine(value?) {
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
    const formGroup = this.formBuilder.group({
      id: item?.product_id != undefined ? item.product_id : "",
      name:
        item?.product_name != undefined
          ? item.product_name
          : item?.product_details
          ? item.product_details
          : "",
      quantity: [
        item?.quantity != undefined
          ? item.quantity.includes(",")
            ? item.quantity.replace(/,/g, "")
            : item.quantity
          : "",
        [Validators.pattern(/^\d+(\.\d{1,3})?$/), Validators.min(0.001)],
      ],
      price: [
        item?.price != undefined ? item.price : "",
        [Validators.pattern(/^\d+(\.\d{1,3})?$/), Validators.min(0.001)],
      ],
      amount:
        item?.quantity != undefined && item?.price != undefined
          ? item.single_piece == false
            ? (
                (parseFloat(
                  item.quantity.includes(",")
                    ? item.quantity.replace(/,/g, "")
                    : item.quantity
                ) *
                  item.price) /
                1000
              ).toFixed(3)
            : (
                parseFloat(
                  item.quantity.includes(",")
                    ? item.quantity.replace(/,/g, "")
                    : item.quantity
                ) * item.price
              ).toFixed(3)
          : "",
      single_piece: item?.single_piece != undefined ? item.single_piece : "",
    });

    if (item?.order_product_id !== undefined) {
      formGroup.addControl(
        "order_product_id",
        this.formBuilder.control(item.order_product_id)
      );
      formGroup.addControl(
        "p_description",
        this.formBuilder.control(item.p_description)
      );
    }
    return formGroup;
  }

  setProductsDynamicForm(data) {
    if (data.length > 0) {
      data.forEach((value) => {
        this.addNewLine(value);
      });
    }
  }

  deleteRow(index) {
    this.productItem.removeAt(index);
    this.productselecterror = false;
    this.calculateDiscount();
    this.calculateOrder();
    this.calculateFreight();
    this.productParam.search = "";
    this.getProducts("search"); // rajedhra changes
  }

  fileSelected(event) {}

  fileDrop(event): void {}

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.sizeError = false;
    this.uploads.splice(index, 1);
  }
  validateDecimal(event) {
    var regex = new RegExp("^\\d{0,5}(\\.\\d{0,2})?$");
    if (!regex.test(event.target.value)) {
      event.target.value = event.target.value.substring(
        0,
        event.target.value.length - 1
      );
    }
  }
  enterDiscount(event): void {
    // var regex = new RegExp("^\\d{0,5}(\\.\\d{0,2})?$");
    // if (!regex.test(event.target.value)) {
    //   event.target.value = event.target.value.substring(0, event.target.value.length - 1);
    // }
    this.discountPercent = Number(event.target.value);
    this.discount = Number(event.target.value);
    this.discountError = false;
    if (this.discount >= this.subTotal) {
      this.discountError = true;
    }
    this.calculateDiscount();
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Backspace") {
      const originalValue = this.discount;
      this.discount = parseFloat(event.target["value"]);
      if (this.discount <= this.subTotal) {
        this.discountError = false;
      }
      this.discount = originalValue; // Restore the original value
    }
  }
  enterFreight(event): void {
    // this.validateDecimal(event);
    this.freightamt = Number(event.target.value);
    this.calculateFreight();
  }
  enterInsurance(event): void {
    // this.validateDecimal(event);
    this.insuranceValue = Number(event.target.value);
    this.total = Number(
      (this.subTotal + this.insuranceValue + this.freightamt).toFixed(3)
    );
    this.calculateDiscount();
  }
  calculateFreight() {
    this.total = Number(
      (this.subTotal + this.freightamt + this.insuranceValue).toFixed(3)
    );
    this.calculateDiscount();
  }
  onWheel(event: WheelEvent): void {
    event.preventDefault();
  }
  calculateDiscount() {
    this.total = Number(this.subTotal.toFixed(3));
    //comenting for aapl changes in discount
    // this.discount = Number((this.subTotal * this.discountPercent / 100).toFixed(2));
    // this.total = Number((this.total+this.freightamt+this.insuranceValue - this.discount).toFixed(2));
    this.total = Number(
      (
        this.total +
        this.freightamt +
        this.insuranceValue -
        this.discountPercent
      ).toFixed(3)
    );
    if (this.discount >= this.subTotal) {
      this.discountError = true;
    } else {
      this.discountError = false;
    }
  }
  formattedSubTotal;
  calculateOrder() {
    let amount: number = 0;
    this.productItem.value.map(function (item) {
      amount += parseFloat(item.amount);
    });
    this.subTotal = Number(amount?.toFixed(3));
    this.total = Number(
      (
        this.subTotal +
        this.freightamt +
        this.insuranceValue -
        this.discount
      ).toFixed(3)
    );
    if (this.productItem.value.length == 0) {
      this.discount = this.subTotal = this.insuranceValue = this.freightamt = 0;
    }
  }

  // Currency formatting function
  currencyFormatter(number, currency) {
    const locales = this.getLocalesForCurrency(currency);

    if (locales.length > 0) {
      const locale = locales[0]; // Use the first matching locale
      const formatter = new Intl.NumberFormat(locale, {
        // style: "currency",
        // currency: currency, // uncomment for currency symbol at price
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });

      return formatter.format(number);
      // .replace(/[^0-9.,]/g, ""); // Remove currency symbol
    }

    return number.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Get locales for the currency
  getLocalesForCurrency(currency) {
    const currencyLocales = {
      USD: ["en-US"],
      INR: ["en-IN"],
      // EUR: ["de-DE", "fr-FR", "es-ES", "it-IT"],
      // GBP: ["en-GB"],
      // JPY: ["ja-JP"],
      // CAD: ["en-CA", "fr-CA"],
      // AUD: ["en-AU"],
      // CNY: ["zh-CN"],
      // CHF: ["de-CH", "fr-CH", "it-CH"],
      // SEK: ["sv-SE"],
      // NZD: ["en-NZ"],
      // MXN: ["es-MX"],
      // SGD: ["en-SG", "zh-SG"],
      // HKD: ["en-HK", "zh-HK"],
      // NOK: ["nb-NO", "nn-NO"],
      // KRW: ["ko-KR"],
      // TRY: ["tr-TR"],
      // RUB: ["ru-RU"],
      // BRL: ["pt-BR"],
      // ZAR: ["en-ZA"],
      // AED: ["ar-AE"],
      // SAR: ["ar-SA"],
      // MYR: ["ms-MY"],
      // IDR: ["id-ID"],
      // THB: ["th-TH"],
      // Add more currencies and their locales as needed
    };

    return currencyLocales[currency] || [];
  }

  goToCreateAddress(type: any) {
    this.uncheck = false;

    this.createAddressForm.patchValue({
      address1: "",
      address2: "",
      postal_code: "",
      city: "",
      country: "",
      state: "",
      address_type_id: "",
    });

    this.order.addressType = type;
    this.updateAddress();
    this.getGlobalDetails(this.order.addressType);
  }

  getGlobalDetails(type?): void {
    this.organizationsService.getGlobalOrganizations().then((response) => {
      if (response.result.success) {
        this.order.address_types = response.result.data.address_types;
        this.order.countries = response.result.data.countries;
        this.order.countriesStates = response.result.data.countriesStates;
        this.currencyX = response.result.data.currency;
        if (this.data.flag !== "Edit Order") {
          this.productsForm.patchValue({
            terms_conditions:
              response.result.data.company_details.terms_cond_des != null
                ? response.result.data.company_details.terms_cond_des.replace(
                    /<br>/gi,
                    "\n"
                  )
                : "",
          });
        }
        this.updateWordCount();

        if (this.order.address_types.length) {
          if (this.order.addressType == "client") {
            this.sameChkShow = false;
            this.createAddressForm.patchValue({
              address_type_id: this.order.address_types[2].id,
            });
          } else if (this.order.addressType == "company") {
            this.sameChkShow = true;
            this.createAddressForm.patchValue({
              address_type_id: this.order.address_types[1].id,
            });
          } else if (this.order.addressType == "notify") {
            this.sameChkShow = true;
            this.createAddressForm.patchValue({
              address_type_id: this.order.address_types[0].id,
            });
          }
        }
        if (this.order.countries.length) {
          this.createAddressForm.patchValue({
            country: this.order.countries[0].id,
          });
        }
        this.order.states =
          this.order.countriesStates[this.createAddressForm.value.country];
        if (this.order.countriesStates.length) {
          this.createAddressForm.patchValue({
            state: this.order.states[0].id,
          });
        }
      }
    });
  }

  getAddress(loadAddress?: any) {
    this.organizationsService
      .ListAddress({
        org_id:
          App.user_details.log_type == "2"
            ? App.user_details.org_id
            : !this.newClientadded
            ? this.clientSelectedId
            : this.newClientid,
        orders: true,
        client_new: this.newClient ? true : false,
      })
      .then((response) => {
        if (response.result.success) {
          let addressDetails = [];
          this.order.clientAddress = [];
          this.order.companyAddress = [];
          this.order.notifyAddress = [];
          this.organizationDetails = addressDetails =
            response.result.data.address_organization;

          addressDetails.forEach((val) => {
            if (val.address_type_id == 4) {
              let address: any;
              address = Object.assign([], val);
              address = this.order.clientAddress.push(address);
            }

            if (val.address_type_id == 2) {
              let data: any;
              data = Object.assign([], val);
              data = this.order.companyAddress.push(data);

              this.showBillingAddress = true;
            }
            if (val.address_type_id == 11) {
              let notifyData: any;
              notifyData = Object.assign([], val);
              notifyData = this.order.notifyAddress.push(notifyData);
            }
          });

          this.order.clientAddress.map(function (value) {
            value["selected"] = false;
            if (loadAddress == value.id) {
              value["selected"] = true;
            }
          });

          this.order.companyAddress.map(function (value) {
            value["selected"] = false;
            if (loadAddress == value.id) {
              value["selected"] = true;
            }
          });
          this.order.notifyAddress.map((value, index) => {
            value["selected"] = false;
            if (loadAddress == value.id) {
              value["selected"] = true;
            }
          });
          this.clientAddressSame = this.order.clientAddress;
        }
        this.onPrfillAddress();
      });
  }

  selectAddress(data: any, list: any, type: any): void {
    if (!data.selected) {
      if (type == 1) {
        (this.shippingAddressDetails.address1 = data.address1),
          (this.shippingAddressDetails.address2 = data.address2),
          (this.shippingAddressDetails.country = data.country),
          (this.shippingAddressDetails.state = data.state),
          (this.shippingAddressDetails.postal_code = data.postal_code);
        this.clientAddressSame = [];
      } else if (type == 2) {
        (this.billingAddressDetails.address1 = data.address1),
          (this.billingAddressDetails.address2 = data.address2),
          (this.billingAddressDetails.country = data.country),
          (this.billingAddressDetails.state = data.state),
          (this.billingAddressDetails.postal_code = data.postal_code);
      } else {
        (this.notifyAddressDetails.address1 = data.address1),
          (this.notifyAddressDetails.address2 = data.address2),
          (this.notifyAddressDetails.country = data.country),
          (this.notifyAddressDetails.state = data.state),
          (this.notifyAddressDetails.postal_code = data.postal_code);
      }
    }
    data.selected = !data.selected;
    list.map(function (value) {
      if (data.id != value.id) {
        value["selected"] = false;
      }
    });
    if (type == "1") {
      this.clientAddressSame = this.order.clientAddress.filter(function (
        value
      ) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      this.order.selectedShippingError = false;
    } else if (type == "2") {
      this.order.selectedBillingError = false;
    } else {
      this.order.selectedNotifyError = false;
    }
  }
  // scrollToError() {
  //   const errorMessageElement = this.el.nativeElement.querySelector('#errorMessage');

  //   if (errorMessageElement) {
  //     errorMessageElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  //   }
  // }

  createOrderConfirm() {
    if (this.validateAddress()) {
      this.confirOrderLoad = true;
      this.fetchingData = true;
      this.createbtnDisabled = true;
      let clientAddress = this.order.clientAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      let companyAddress = this.order.companyAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      let notifyAddress = [];
      if (this.order.notifyAddress.length) {
        notifyAddress = this.order.notifyAddress.filter(function (value) {
          if (value["selected"]) {
            return true;
          }
          return false;
        });
      }
      const currentValue = this.productsForm.get("terms_conditions").value;
      const updatedValue = currentValue.replace(/\n/g, "<br>");
      this.productsForm.get("terms_conditions").setValue(updatedValue);
      if (this.uploads.length) {
        this.order.filename = this.uploads[0].filename;
        this.order.original_name = this.uploads[0].original_name;
        this.order.src_name = this.uploads[0].source_path;
      }
      // const orderDeliveryDate = moment(this.productsForm.controls.delivery_date.value).toLocaleString();
      if (this.productsForm.controls.delivery_date.value) {
        // this.orderDeliveryDate = moment(this.orderDeliveryDate).format(
        //   "YYYY-MM-DD"
        // );
        this.orderDeliveryDate = this.deliveryDate
          ? moment(this.deliveryDate).format("YYYY-MM-DD")
          : null;
      } else {
        this.orderDeliveryDate = "";
      }
      if (this.productsForm.controls.po_date.value) {
        // this.poDate = moment(
        //   this.productsForm.controls.po_date.value
        // ).toLocaleString();
        this.poDate = moment(this.productsForm.controls.po_date.value).format(
          "YYYY-MM-DD"
        );
      } else {
        this.poDate = "";
      }
      this.OrdersService.createEstimate({
        estimate_id:
          this.data.flag === "Edit Order" ? this.data.estimate_id : 0,
        organization_id:
          App.user_details.log_type == "2"
            ? App.user_details.org_id
            : !this.newClientadded
            ? this.clientSelectedId
            : this.newClientid,
        org_address_bill_id: companyAddress.length
          ? companyAddress[0].org_address_bill_id
          : "",
        company_shipping_id: clientAddress.length
          ? clientAddress[0].org_address_bill_id
          : "",
        org_notify_addr_id: notifyAddress.length
          ? notifyAddress[0].org_address_bill_id
          : null,
        special_instructions:
          this.productsForm.controls.special_instructions.value,
        email: this.productsForm.controls.email.value,
        phone: this.productsForm.controls.phone.value,
        po_nbr: this.productsForm.controls.po_no.value,
        po_date: this.poDate,
        // this.productsForm.controls.po_date.value,
        ext: this.productsForm.controls.ext.value,
        kindAttn: this.productsForm.controls.kindAttn.value,
        delivery_date: this.orderDeliveryDate,
        productArr: this.order.selectedProducts,
        filename: this.order.filename,
        original_name: this.order.original_name,
        src_name: this.order.src_name,
        client_new: this.newClient ? true : false,
        is_order: false,
        transport_id: this.transport_id,
        inco_terms_id: this.order.inco_terms_id,
        customer_notes: this.productsForm.controls.customer_notes.value,
        terms_cond_des: this.productsForm.controls.terms_conditions.value,
        port_of_loading: this.productsForm.controls.port_of_loading.value,
        port_of_discharge: this.productsForm.controls.port_of_discharge.value,
        final_destination: this.productsForm.controls.final_destination.value,
        account_manager: this.productsForm.controls.account_manager.value,
        payment_terms: this.productsForm.controls.payment_terms.value,
        currency_id: this.productsForm.controls.currency_id.value,
        discount: this.discountPercent,
        other_delivery_terms:
          this.productsForm.controls.other_delivery_terms.value,
        freight: this.freightamt,
        insurance: this.insuranceValue,
        //currency_id: currency_id
      }).then((response) => {
        if (response.result.success) {
          this.orderFaildedMsg = "";
          this.confirOrderLoad = false;
          this.order.selectedOrder.id = response.result.data.id;
          this.dialogRef.close({
            success: true,
            response: response.result.data.id,
          });
          this.fetchingData = false;
          this.generateProformaInvoice(response.result.data.id);
          let toast;
          //  let data = response.result.data.totalordersDt;
          // let reloadPage = true;
          // this.router.events.subscribe(val => {
          //   if (val instanceof NavigationStart) {
          //     if (val['url'].match('orders'))
          //       reloadPage = false;
          //       const config = this.router.config.map((route) => Object.assign({}, route));
          //       this.router.resetConfig(config);
          //       this.router.navigate([val['url']]);
          //     }
          //   }
          // });
          // if(reloadPage)
          //   this.router.navigate(['/orders']);
          // }
        } else {
          this.createbtnDisabled = false;
          let toast: object;
          this.dialogRef.close({ success: false });
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      return;
    }
  }

  getShippingAddressDetails(): void {
    this.OrdersService.getShippingDetails({}).then((response) => {
      if (response.result.success) {
        this.order.mode_of_transport = response.result.data.transportType;
      }
    });
  }

  selectShippingMode(transportName) {
    this.transport_id = transportName.id;
  }

  validateAddress() {
    let clientAddress = [];
    if (!this.productItem?.value.length) {
      this.productError = true;

      setTimeout(() => {
        let scrollTag = document.querySelector(".error-msg");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    if (this.createAddressForm.invalid) {
      setTimeout(() => {
        let scrollTag = document.querySelector(".address-error");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    if (this.order.clientAddress.length) {
      clientAddress = this.order.clientAddress.filter(function (value) {
        if (value["selected"]) {
          return value["selected"];
        }
        return false;
      });
      if (!clientAddress.length) {
        this.order.selectedShippingError = true;
      } else {
        this.order.selectedShippingError = false;
      }
    } else if (!this.order.clientAddress.length) {
      this.order.selectedShippingError = true;
    }
    let companyAddress = [];
    if (this.order.companyAddress.length) {
      companyAddress = this.order.companyAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      if (!companyAddress.length) {
        this.order.selectedBillingError = true;
      } else {
        this.order.selectedBillingError = false;
      }
    } else if (!this.order.companyAddress.length) {
      this.order.selectedBillingError = true;
    }
    let notifyAddress = [];
    if (this.order.notifyAddress.length) {
      if (this.order.notifyAddress.length) {
        notifyAddress = this.order.notifyAddress.filter(function (value) {
          if (value["selected"]) {
            return true;
          }
          return false;
        });
      }
    }
    let selectedProducts = [];
    this.productItem?.value.map(function (value) {
      if (value.price && value.quantity && value.id) {
        const selectedProduct = {
          price: Number(value.price),
          quantity: Number(value.quantity),
          products_types_id: value.id,
          single_piece: value.single_piece,
        };
        // Only include order_product_id if it's defined
        if (value.order_product_id !== undefined) {
          selectedProduct["order_product_id"] = value.order_product_id;
          selectedProduct["p_description"] = value.p_description;
        }
        selectedProducts.push(selectedProduct);
      }
    });
    this.order.selectedProducts = selectedProducts;
    if (this.productItem.value.length != selectedProducts.length) {
      this.productselecterror = true;
      setTimeout(() => {
        let scrollTag = document.querySelector(".error-msg");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }

    if (this.discountError) {
      setTimeout(() => {
        let scrollTag = document.querySelector(".scroll-error");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    return !(
      this.order.selectedBillingError ||
      this.order.selectedShippingError ||
      this.productError ||
      !selectedProducts.length ||
      this.productItem.value.length != selectedProducts.length ||
      this.discountError ||
      !this.productsDynamicForm.valid ||
      !this.productsForm.valid
    ); // NOR operator
  }

  addOrganization(): void {
    let toast: object;
    let dialogRef = this.dialog.open(DialogComponent, {
      panelClass: "alert-dialog",
      width: "590px",
      autoFocus: false,
      disableClose: true,
      data: {
        type: "estimate",
        company_name: this.clintName,
      },
      // height: '565px'
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.success) {
        toast = { msg: "Organization saved successfully.", status: "success" };
        this.organizationsList.unshift(result.response);
        this.totalCount = this.totalCount + 1;
        await this.getOrganization(result.response);
        this.clintName = result.response.name;
        this.clientSelectedId = result.response.id;
        this.clientCurrency = result.response.currency_code;
        this.setForm(result.response);
        this.order.currency = this.clientCurrency;
        this.modelData.id = result.response.id;
        this.modelData.name = result.response.name;
        await this.getOrganizations(this.param);
        this.searchCtrl.setValue(result.response.name);
        this.getProducts();
        this.getContacts();
        this.getAddress();
        this.inClient = true;
        this.isAddProduct = false;
        this.errormessage = "";
        this.showError = false;
        // this.selectionChange(result.response);
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  getOrganization(data?: any): void {
    this.noOrganizations = false;
    this.selectedOrganizations = data || {};
    this.trigger.emit(this.selectedOrganizations);
  }

  updateAddress(data?: any): void {
    let addressTypeId = "";
    let type: any;
    let address = {
      address1: "",
      address2: "",
      address_type_id: "",
      city: "",
      country_id: "",
      id: "",
      organization_id: "",
      org_id: this.clientSelectedId,
      addressClientData: this.organizationDetails,
    };
    if (data) {
      Object.assign(address, data);
      type = "edit";
    } else {
      type = "add";
      if (this.order.address_types.length) {
        if (this.order.addressType == "client") {
          addressTypeId = this.order.address_types[2].id;
        } else if (this.order.addressType == "company") {
          addressTypeId = this.order.address_types[1].id;
        } else if (this.order.addressType == "notify") {
          addressTypeId = this.order.address_types[0].id;
        }
      }
    }

    let toast: object;
    let dialogRef = this.dialog.open(AddressComponent, {
      panelClass: "alert-dialog",
      width: "600px",
      data: {
        address: address,
        type: type,
        sameChkShow: this.sameChkShow,
        clientAddressSame: this.clientAddressSame,
        uncheck: this.uncheck,
        createAddressForm: this.createAddressForm,
        addressTypeId: addressTypeId,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result?.success) {
        if (address.id) {
          toast = { msg: "Address updated successfully.", status: "success" };
          let organizationsList = [];
          this.order.companyAddress.push(result.response);
          this.organizationDetails.map(function (value) {
            if (value.id == result.response.id) {
              organizationsList.push(result.response);
            } else {
              organizationsList.push(value);
            }
          });

          this.organizationDetails = organizationsList;
          this.snackbar.showSnackBar(toast);
        } else {
          toast = { msg: "Address added successfully.", status: "success" };
          this.addAddress(result.response);
          this.snackbar.showSnackBar(toast);
        }
      }
    });
  }
  options: string[] = ["One", "Two", "Three"];
  generateProformaInvoice(estimate_id: any) {
    this.invoiceGenerateLoader = true;
    this.clickedProformaInvoice = true;
    this.totalSpinner = true;
    let params = {
      estimate_id: estimate_id,
      type: "estimate",
      freight: this.freightamt,
      insurance: this.insuranceValue,
    };

    if (this.enableInvoice) {
      params["placement"] = 2;
    } else {
      params["placement"] = 1;
    }

    this.OrdersService.generateProfInv(params).then((response) => {
      if (response.result.success) {
        this.hideShipperAddress = true;
        this.totalSpinner = false;
        // this.orders.selectedOrder.orders_types_id = '6';

        this.getProformaInvoiceData();

        this.clickedProformaInvoice = false;
        // this.selectedOrderStatus = 'Processing';
      }
    });
  }

  getProformaInvoiceData() {
    // this.enableProforma = true;
    // this.getOrdersActivityDetails();
    // this.selectedOrderStatus = 'Processing';

    this.OrdersService.getProfInv({
      estimate_id: this.order.selectedOrder.id,
    }).then((response) => {
      if (response.result.data.length) {
        this.invoiceGenerateLoader = false;
        this.hideShipperAddress = true;
        this.enableProforma = true;
        this.proformaInvData = response.result.data;
        // this.inv_placement = this.proformaInvData[0].profInv.placement;
      }
    });
  }
  changeIncoTerms(inco_id: number, inco?: any): void {
    this.order.inco_terms_id = inco_id;
  }
  public inctStatlist;
  getShipments(): void {
    let param = {
      page: 1,
      perPage: 25,
      search: "",
      sort: "ASC",
    };
    this.adminService
      .getIncoTermList(param)
      .then((response) => {
        if (response.result.success) {
          this.incotermsStaList = response.result.data.termsDt;

          if (this.data && this.data.flag === "Edit Order") {
            this.inctStatlist = this.incotermsStaList.filter((x) => {
              if (
                x.status ||
                x.id == this.data?.editEstimateData?.profInv?.inco_terms_id
              ) {
                return x;
              }
            });
          } else {
            this.inctStatlist = this.incotermsStaList.filter((x) => {
              return x.status;
            });
          }
          this.incoTermsList = this.inctStatlist;
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
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.success) {
        toast = { msg: result.response.message, status: "success" };
        this.getProducts();
        this.snackbar.showSnackBar(toast);
      } else {
        // toast = { msg: result.response.message, status: "error" };
      }
    });
  }

  addAddress(address) {
    address["selected"] = true;
    if (address.address_type_id == 4) {
      this.order.clientAddress.map(function (value) {
        value["selected"] = false;
      });
      this.order.clientAddress.push(address);
      this.order.selectedShippingError = false;
    }
    this.clientAddressSame = this.order.clientAddress.filter(function (value) {
      if (value["selected"]) {
        return true;
      }
      return false;
    });

    if (address.address_type_id == 2) {
      this.order.companyAddress.map(function (value) {
        value["selected"] = false;
      });
      this.order.companyAddress.push(address);
      this.order.selectedBillingError = false;
    }

    if (address.address_type_id == 11) {
      this.order.notifyAddress.map(function (value) {
        value["selected"] = false;
      });
      this.order.notifyAddress.push(address);
      this.order.selectedNotifyError = false;
    }
  }
  clearPr(event) {
    if (event.target.value == "") {
      this.productselecterror = true;
    }
  }
  updateWordCount(): void {
    this.wordCount = this.textareaContent.length;
  }
  preventInputE(event: KeyboardEvent) {
    if (event.key === "e" || event.key === "E") {
      event.preventDefault();
    }
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
        console.log(result);
        if (result && result.data.error == false) {
          for (let i = 0; i < result.data.productsList.length; i++) {
            const indx = _.findIndex(this.order.products, {
              name: result.data.productsList[i].product_details,
            });
            this.productItem = this.productsDynamicForm.get(
              "productItem"
            ) as FormArray;
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
          console.log(this.productItem);
        }
      });
    } else {
      this.isAddProduct = true;
    }
  }
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(ev: any) {
    if (document.getElementsByClassName("mat-autocomplete-panel")[0]) {
      document.getElementsByClassName("mat-autocomplete-panel")[0][
        "style"
      ].visibility = "hidden";
    }
  }
  onBlur(event) {
    if (this.clientSelectedId) {
      this.organizationsService
        .getOrganizationsList(this.param)
        .then((response) => {
          if (response.result.success) {
            this.totalClients = response.result.data.organization;
            this.clientsStatus = this.totalClients.filter((x) => {
              return x.status;
            });
            if (
              this.clientsStatus.find(
                (client) => client.id === this.clientSelectedId
              )?.name
            ) {
              console.log(this.clientSelectedId);
              this.clintName = this.clientsStatus.find(
                (client) => client.id === this.clientSelectedId
              ).name;
            }
          }
        });
    }
  }
}
