import {
  Component,
  OnInit,
  Inject,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  HostListener,
  AfterViewInit,
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
import { OrganizationsService } from "../../services/organizations.service";
import { AdminService } from "../../services/admin.service";
import { OrdersService } from "../../services/orders.service";
import { language } from "../../language/language.module";
import { Param } from "./../../custom-format/param";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSelect } from "@angular/material/select";
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
import * as $ from "jquery";
import * as _ from "lodash";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import * as moment from "moment";
import { NewClientComponent } from "../new-client/new-client.component";
import { Console } from "console";
const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

declare var App: any;
@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [OrganizationsService, OrdersService, AdminService],
  animations: [
    trigger("stepTransition", [
      state("previous", style({ height: "100px", visibility: "hidden" })),
      state("next", style({ height: "100px", visibility: "hidden" })),
      state("current", style({ height: "*", visibility: "visible" })),
      transition(
        "* <=> current",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class CreateOrderComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  // @ViewChild("myFoucs" , {static: false}) inputElement: ElementRef;
  @ViewChild("productsForm") formEl: ElementRef;
  @ViewChild("stepper") stepper: MatStepper;

  public language = language;
  public newClientadded = false;
  public newClientid: any;
  public newClient = false;
  submitCountry = false;
  submitState = false;
  searchCtrl = new FormControl();
  productName = [];
  public open = false;
  public modelData: any = {};
  clientsForm: FormGroup;
  shippingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  billingAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  notifyAddressDetails = {
    address1: "",
    address2: "",
    state: "",
    country: "",
    postal_code: "",
  };
  public quantError: any;
  productsForm: FormGroup;
  addressForm: FormGroup;
  orderData = {
    poNumber: "",
    po_date: "",
    email: "",
    ext: "",
    phone: "",
    kindAttn: "",
    delivery_date: "",
    dispatch_date: "",
    productArr: [],
    special_instructions: "",
  };
  public sameChkShow: any;
  orderDispatchDate: any;
  createAddressForm: FormGroup;
  detailsForm: FormGroup;
  private phoneNumberPattern = /^[0-9]{10}$/;
  private websitePattern =
    /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  private emailPattern =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  public items = [
    { id: 1, name: "123", email: "1243@gmail.com", phone: "9999" },
    { id: 2, name: "234", email: "1243@gmail.com", phone: "9999" },
  ];
  public order = {
    clientSubmit: false,
    // productSubmit: false,
    addressSubmit: false,
    createAddSubmit: false,
    organizations: [],
    selectedOrg: "",
    products: {},
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
    po_no: "",
    countries: [],
    states: [],
    countriesStates: [],
    filename: "",
    original_name: "",
    src_name: "",
    address_types: [],
    addressType: "",
    currency: "",
    uploadError: false,
  };
  public inClient: any;
  sizeError: boolean;
  uploadImage = false;
  public contactsList = [];
  public App = App;
  selectedProduct: any;
  productSubmit: boolean;
  addressSubmit: boolean;
  uploads = [];
  totalPages: number = 0;
  totalCount: number = 0;
  pointerEvent: boolean;
  price: string;
  public errormessage: any = "";
  public now: Date = new Date();
  deliveryDate: any;
  dispatchDate: any;
  poDate: any;
  private imageUploadUrl = App.base_url + "uploadOrderPo";
  public flag: any = 1;
  public hasDropZoneOver: boolean = false;
  public createbtnDisabled: boolean = false;
  public selectAuto: boolean = false;
  public rateControl: any;
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
  public showError: boolean = false;
  private param: any = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
    flag: 1,
  };
  public disablad = false;
  confirOrderLoad: boolean = false;
  currencyX: any[];
  countries: any;
  states: any[];
  status = [
    { id: 1, value: "Active", param: true },
    { id: 0, value: "Inactive", param: false },
  ];
  public is_sso = App.env_configurations ? App.env_configurations.is_sso : true;
  searching: boolean;
  delivery_date: any;
  constructor(
    public dialogRef: MatDialogRef<CreateOrderComponent>,
    private organizationsService: OrganizationsService,
    private formBuilder: FormBuilder,
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(this.data,12456);
    dialogRef.disableClose = true;
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
      // this.uploadImage = true;
      if (item.size >= options.maxFileSize) {
        // console.log('largeFile')
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
      // console.log(obj)
      if (obj.result.success) {
        this.uploads.push(obj.result.data);
        this.order.uploadError = false;
        this.uploadImage = false;
        this.sizeError = false;
      }
    };
  }

  ngOnInit() {
    // console.log(this.data,124567);
    // console.log(this.data?.products,'cvb');

    // let esVal ={

    //   target:{
    //     value: this.data?.client,
    //     id:this.data?.id

    //   }
    // };
    let User = {
      target: {
        name: this.data?.attention,
        email: this.data?.email,
        phone: this.data?.phone,
      },
    };
    this.delivery_date = this.data?.expectedDate;

    console.log(this.data.selected);
    // esVal['target']['value'] =this.data?.client
    // this.selectedClients = this.data?.attention
    // value : this.data?.client
    // this.clientsForm.setValue( {client: this.data?.client});
    // console.log(this.data?.attention)
    this.generateClientsForm();
    // this.getOrganizations(this.param);
    this.getContacts();
    // this.changeUser(User)
    // this.changeCheckbox(this.data?.products)
    let newDate = new Date(this.data.expectedDate);
    // this.clientSelectedId(this.data?.client_id)
    this.getOrganizationDetails();
    // setTimeout(() => {
    // this.productsForm.patchValue( {kindAttn: this.data?.attention})
    // this.productsForm.patchValue({email:this.data?.email})
    // this.productsForm.patchValue({phone:this.data?.phone})

    // this.productsForm.patchValue({delivery_date:newDate})
    console.log(this.data?.expectedDate);
    // this.selectedClients(esVal);
    // this.changeUser(this.selectedClients)
    // this.modelData['name'] = this.data?.client
    // this.modelData['email']=this.data?.email

    // }, 3000);
    // setTimeout(() => {
    // this.goToProducts(this.stepper);

    // }, 3000);
    // console.log(this.data);
    // this.rateControl = new FormControl("", [Validators.max(10), Validators.min(0)])
  }

  deleteItem(index: number): void {
    this.pointerEvent = false;
    this.sizeError = false;
    this.uploads.splice(index, 1);
  }

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}

  fileSelected(event): void {}

  addNewUser(event) {
    // console.log(event)
  }
  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || "").trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { whitespace: true };
  }
  public noZeroValidator(control: FormControl) {
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }
  generateClientsForm(): void {
    this.clientsForm = this.formBuilder.group({
      client: [null, Validators.required],
      company_name: [
        null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      website: [null, [Validators.pattern(this.websitePattern)]],
      status: [null, Validators.required],
      currency_id: [null, Validators.required],
      country_id: [null, Validators.required],
      addCountry: "",
      is_sample_order: "",
    });
    this.productsForm = this.formBuilder.group({
      special_instructions: "",
      email: [
        this.data?.email,
        [Validators.required, Validators.pattern(EMAIL_REGEX)],
      ],
      phone: [
        this.data?.phone,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern("^[0-9]*$"),
        ],
      ],
      po_no: [null, [Validators.required, this.noWhitespaceValidator]],
      po_date: [null],
      ext: [null, [Validators.pattern("^[0-9]*$")]],
      kindAttn: [this.data?.attention, Validators.required],
      delivery_date: [this.data?.expectedDate, Validators.required],
      dispatch_date: [null],
    });
    if (!this.is_sso) {
      this.productsForm.controls["po_no"].clearValidators();
    }
    this.addressForm = this.formBuilder.group({
      client: [null, Validators.required],
    });
    this.createAddressForm = this.formBuilder.group({
      address1: [null, [Validators.required, this.noWhitespaceValidator]],
      address2: "",
      postal_code: [
        null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      city: [
        null,
        [Validators.required, this.noWhitespaceValidator, this.noZeroValidator],
      ],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      address_type_id: [null, [Validators.required]],
    });
    // this.detailsForm = this.formBuilder.group({
    //   address1: [null, [Validators.required, this.noWhitespaceValidator]],
    //   address2: "",
    //   postal_code: [null, [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
    //   city: [null, [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
    //   country: [null, [Validators.required]],
    //   state: [null, [Validators.required]],
    //   address_type_id: [null, [Validators.required]]
    // });
  }

  getOrganizations(param: object) {
    this.organizationsService.getOrganizationsList(param).then((response) => {
      if (response.result.success) {
        this.totalCount = response.result.data.total;
        this.totalPages = Math.ceil(
          Number(this.totalCount) / this.param.perPage
        );
        this.order.organizations = response.result.data.organization;
        if (!this.clientSelectedId) {
          this.clientSelectedId = response.result.data.organization[0]?.id;
        }
      }
    });
    if (App.user_details.log_type == "2") {
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
          console.log(contacts);
          this.contactsList = contacts;
        }
      })
      .catch((error) => console.log(error));
  }
  public showNoProdFound = false;
  public checkedArr = {};
  public ProductsArr = [];
  public check = [];
  public duplicateArr = [];
  checked = true;
  fetchingData: boolean;
  private params: any = {
    page: 1,
    perPage: 10,
    sort: "ASC",
    search: "",
  };
  public productValue = [];
  // getProducts() {
  //   //if(!this.order.products.length){
  //   this.organizationsService
  //     .getProductsList({ org_id: ((App.user_details.log_type == '2') ? App.user_details.org_id : ((!this.newClientadded)?this.clientSelectedId:this.newClientid)),
  //      flag: 1  , client_new:this.newClient?true:false,          is_sample_order:this.clientsForm.controls.is_sample_order.value, })
  //     .then(response => {
  //       if (response.result.success) {
  //         this.order.products = response.result.data.productTypesDt;

  //         let selectedIds=[]

  //      this.checkedArr = this.order.products.filter(obj => {

  //       return obj.checked_status

  //         })

  //         if(this.checkedArr.length) {
  //               this.showNoProdFound = false;
  //             } else {
  //               this.showNoProdFound = true;
  //             }

  //         // console.log(this.checkedArr)
  //         this.order.currency = response.result.data.currency;
  //         this.order.products.map(function (value) {
  //           value['selected'] = false;
  //           value['error'] = false;
  //           value['quantity'] = '';
  //         });
  //       }
  //     });
  // }
  onScrollDown() {
    // if (this.checkedArr.length !== 0 && this.checkedArr.length>1 ){
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      console.log(this.totalPages);
      this.params.page++;
      this.getProducts();
    }
  }
  getProducts(param?: any) {
    //if(!this.order.products.length){
    this.fetchingData = true;
    // this.searching = true;
    if (param === "search") {
      this.params.page = 1;
      this.order.products = {};
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
        is_sample_order: this.clientsForm.controls.is_sample_order.value,
        search_value: this.params.search,
        groupby_category: true,
        page: this.params.page,
        perPage: this.params.perPage,
      })
      .then((response) => {
        if (response.result.success) {
          // this.searching = false;
          // if(this.order.products.length === 0) {
          this.totalCount = response.result.data.count;
          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.params.perPage
          );
          // } else {
          if (Object.keys(this.order.products).length) {
            Object.keys(response.result.data.productTypesDt).map((key) => {
              this.order.products[key] = [
                ...this.order.products[key],
                ...response.result.data.productTypesDt[key],
              ];
              // let searchItems = response.result.data.productTypesDt;
              // this.order.products[key].filter((item) => {
              //   return searchItems[key].findIndex((searchItem) => {
              //     console.log(searchItem)
              //   })
              // })
            });
          } else {
            this.order.products = response.result.data.productTypesDt;
          }

          // }

          console.log(this.order.products, "products");
          this.ProductsArr = [];
          Object.keys(this.order.products).map((key) =>
            // value.push(this.order.products[key])
            this.order.products[key].map((value, index) => {
              const selectedItem = this.productValue.findIndex(
                (item) => item.id === value.id
              );
              this.order.products[key][index]["selected"] =
                selectedItem > -1 ? true : false;
              this.order.products[key][index]["quantity"] =
                selectedItem > -1
                  ? this.productValue[selectedItem]["quantity"]
                  : "";
              this.order.products[key][index]["price"] =
                selectedItem > -1
                  ? this.productValue[selectedItem]["price"]
                  : "";
              if (selectedItem > -1) {
              }
            })
          );
          console.log(this.productValue, "vv");

          this.checkedArr = this.order.products;

          // }, 1000);

          //  console.log(this.checkedArr,"vvvvv")
          //  .filter(obj => {
          //   console.log(obj,"checked")
          //       return obj.checked_status
          //     })
          // console.log(!this.order.products.length, "array")

          if (Object.keys(this.order.products).length === 0) {
            this.showNoProdFound = true;
            console.log(123);
          } else {
            this.showNoProdFound = false;
            console.log(111111);
          }

          // console.log(this.checkedArr)
          this.order.currency = response.result.data.currency;
          this.ProductsArr.map(function (value) {
            value["selected"] = false;
            value["error"] = false;
            value["quantity"] = "";
          });
        }
      });
  }
  // searchOrders(search: string, event?: any,from?:any): void {
  //   this.param.search = search;
  //   console.log(this.param.search);
  //   this.param.page = 1;
  //   this.searching = true;
  //   this.checkedArr = this.order.products.filter(obj => {
  //     return obj.name.toLocaleLowerCase().includes(search)
  //   })
  //   if(from === 'close' || search === ''){
  //     this.checkedArr;
  //     this.searching=false;

  //   }else{
  //     console.log();
  //     this.searching=false;
  //   }
  //   if(this.checkedArr.length) {
  //     this.showNoProdFound = false;
  //   } else {
  //     this.showNoProdFound = true;
  //   }
  //   // this.filtered = this.checkedArr.filter(
  //   //   (student) => {
  //   //     return student.name
  //   //   }
  //   // );

  // }
  private timeout;
  searchOrders(search: string, event?: any, from?: any): void {
    console.log(search.length > 3);
    // console.log(this.order.selectedProducts, 11111111)
    this.params.search = search;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    console.log(this.productValue);

    if (from === "close" || search === "") {
      this.params.page = 1;
    }
    this.timeout = setTimeout(() => {
      // if(search.length >3 ){
      this.param.page = 1;
      this.getProducts("search");
      this.searching = false;
    }, 1000);
  }
  selectedProductRange(product: any, event?: any): void {
    let quantity = product.quantity;
    let quantityPrice: any;
    // console.log(quantity)
    product.priceRange.map(function (value) {
      //console.log(value.end_qty)
      if (quantity >= value.start_qty && quantity <= value.end_qty) {
        quantityPrice = value.range_price;
      }
    });
    // console.log(quantityPrice)
    product.price = quantityPrice;
  }
  public emailLength = "";
  public showValidation = false;
  valueChanged(event) {
    // console.log(event)
    // this.showEmailValidation = false;
    this.emailLength = event.target.value;

    if (this.emailLength.length) {
      this.showValidation = false;
    } else {
      this.showValidation = true;
    }
  }
  public showBillingAddress = false;

  getAddress(loadAddress?: any) {
    //if((!this.order.clientAddress.length && !this.order.companyAddress.length) || loadAddress){
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
          addressDetails = response.result.data.address_organization;
          addressDetails.forEach((val) => {
            if (val.address_type_id == 4) {
              let address: any;
              address = Object.assign([], val);
              address = this.order.clientAddress.push(address);
              console.log(address, "adress");
            }
            if (val.address_type_id == 2) {
              let data: any;
              data = Object.assign([], val);
              data = this.order.companyAddress.push(data);
              this.showBillingAddress = true;
              // console.log(data)
            }
            if (val.address_type_id == 11) {
              let notifyData: any;
              notifyData = Object.assign([], val);
              notifyData = this.order.notifyAddress.push(notifyData);
              // console.log(data)
            }
          });
          // this.order.clientAddress = _.cloneDeep(response.result.data.address_organization);
          // this.order.companyAddress = _.cloneDeep(response.result.data.address_organization);
          //this.order.clientAddress = Object.assign([],response.result.data.address_organization);
          //this.order.companyAddress = Object.assign([],response.result.data.address_organization);
          console.log(loadAddress, "24567");
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
        }
      });

    //}
  }

  goToProducts(stepper: MatStepper) {
    console.log(this.clientsForm.controls.client.value, this.clientSelectedId);

    let i = _.findIndex(<any>this.order.organizations, {
      name: this.clientsForm.controls.client.value,
    });
    console.log(i);
    if (
      this.clientsForm.controls.client.value &&
      this.clientsForm.controls.client.value.length &&
      i == -1
    ) {
      this.showError = true;
      this.newClientadded = false;
      this.errormessage = "No Client Data Found";
      this.addNew = true;

      return;
    } else {
      this.showError = false;
      this.errormessage = "";
      this.addNew = false;
    }
    this.clientsForm.get("client").markAsTouched({ onlySelf: true });
    //  if ((!this.addNew && this.clientsForm.controls.client.value )|| (this.addNew &&  this.clientsForm.controls.company_name.value && this.clientsForm.controls.country_id.value &&this.clientsForm.controls.currency_id.value) && this.clientsForm.controls.status.value )  {
    if (
      (!this.showError || this.newClientadded) &&
      (this.clientsForm.controls.client.value || this.newClientadded)
    ) {
      console.log(this.clientsForm.controls.client.value, this.newClientadded);
      stepper.next();
      this.getProducts();
      this.getContacts();
      this.productSubmit = false;
      this.productsForm.patchValue({
        phone: "",
        email: "",
        kindAttn: "",
        delivery_date: "",
        dispatch_date: "",
      });
    }
  }

  backToAddress(stepper) {
    stepper.previous();
  }
  backToCreateOrder(stepper) {
    stepper.previous();
  }

  goToAddress(stepper: MatStepper) {
    this.productSubmit = true;
    if (this.emailLength.length > 0) {
      this.showValidation = false;
    } else {
      this.showValidation = true;
    }

    if (this.productsForm.invalid) {
      setTimeout(() => {
        let scrollTag = document.querySelector(".error-msg");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    this.addressSubmit = false;
    let productValue = [];
    this.productsForm.get("email").markAsTouched({ onlySelf: true });
    this.productsForm.get("phone").markAsTouched({ onlySelf: true });
    this.productsForm.get("po_no").markAsTouched({ onlySelf: true });
    this.productsForm.get("kindAttn").markAsTouched({ onlySelf: true });
    this.productsForm.get("delivery_date").markAsTouched({ onlySelf: true });
    this.productsForm.get("dispatch_date").markAsTouched({ onlySelf: true });

    this.order.selectedProducts = [];
    let selectedProductPrice = [];
    selectedProductPrice = this.productValue.filter(function (value) {
      if (
        value["selected"] &&
        (value["quantity"] == "" || value["quantity"] == null)
      ) {
        value["error"] = true;

        return true;
      }
      value["error"] = false;
      setTimeout(() => {
        let scrollTag = document.querySelector(".bdr-error");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
      return false;
    });
    // console.log(this.productsForm.value)
    this.order.selectedProducts = this.productValue.filter(function (value) {
      if (value["selected"]) {
        // console.log(value)
        productValue.push(value);
        return true;
      }
      return false;
    });
    this.selectedProduct = productValue;
    // console.log(this.selectedProduct)
    if (!this.order.selectedProducts.length) {
      this.order.selectedProductsError = true;
    } else {
      this.order.selectedProductsError = false;
    }
    if (this.uploads.length) {
      this.order.uploadError = false;
    } else {
      this.order.uploadError = true;
    }

    // console.log(this.productsForm)
    if (
      this.productsForm.valid &&
      this.order.selectedProducts.length &&
      !selectedProductPrice.length
    ) {
      stepper.next();
      this.getAddress();
    } else {
      // angular.element($document[0].querySelector('input.ng-invalid'))[0].focus();
      if (this.productsForm.controls.po_no.hasError) {
        this.inputEl.nativeElement.focus();
      }
    }
  }
  public uncheck: any;
  getAddressSame(event) {
    console.log(event);
    if (event.checked) {
      this.disablad = true;
      console.log(this.clientAddressSame);
      this.createAddressForm.patchValue({
        address1: this.clientAddressSame[0].address1,
        address2: this.clientAddressSame[0].address2,
        postal_code: this.clientAddressSame[0].postal_code,
        city: this.clientAddressSame[0].city,
        country: this.clientAddressSame[0].country_id,
        state: this.clientAddressSame[0].state_province_id,
      });
      //this.order.selectedBillingError = false;
      // console.log(this.clientAddressSame)
    } else {
      this.createAddressForm.patchValue({
        address1: "",
        address2: "",
        postal_code: "",
        city: "",
        country: "",
        state: "",
      });
      this.disablad = false;
    }

    // if(this.uncheck){
    //   this.order.selectedBillingError = false;
    // }

    // console.log(this.checkedArr)
  }
  clientAddressSame1: any;
  goToCreateAddress(stepper: MatStepper, type: any) {
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
    stepper.next();
    this.getGlobalDetails(this.order.addressType);
  }
  goToCreateClient() {
    console.log("crfeate order");
    this.newClient = true;
    // this.detailsForm.patchValue({
    //   company_name: "",
    //   website: "",
    //   status: "",
    //   currency_id: "",
    //   country_id: "",
    //   addCountry: "",
    //   address_type_id: ""
    // });
    //this.getGlobalDetails(this.order.addressType);
  }

  getGlobalDetails(type): void {
    this.organizationsService.getGlobalOrganizations().then((response) => {
      if (response.result.success) {
        this.order.address_types = response.result.data.address_types;
        this.order.countries = response.result.data.countries;
        this.order.countriesStates = response.result.data.countriesStates;
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
          // this.createAddressForm.patchValue({
          //     address_type_id: this.order.address_types[0].id
          // });
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

  onCountryChange(data?: any): void {
    this.order.states =
      this.order.countriesStates[this.createAddressForm.value.country];
    this.addressForm.patchValue({
      state: this.order.states[0].id,
    });
  }

  createAddress(form, stepper: MatStepper) {
    form.get("address1").markAsTouched({ onlySelf: true });
    form.get("postal_code").markAsTouched({ onlySelf: true });
    form.get("country").markAsTouched({ onlySelf: true });
    form.get("state").markAsTouched({ onlySelf: true });
    form.get("city").markAsTouched({ onlySelf: true });
    form.value["address_count"] = this.order.clientAddress.length + 1;
    // console.log(form.value['address_count'])
    if (form.valid) {
      this.organizationsService
        .OrganizationAddress({
          address1: form.value.address1,
          address2: form.value.address2,
          address_type_id: form.value.address_type_id,
          city: form.value.city,
          country_id: form.value.country,
          selected: true,
          id: 0,
          org_id:
            App.user_details.log_type == "2"
              ? App.user_details.org_id
              : !this.newClientadded
              ? this.clientSelectedId
              : this.newClientid,
          postal_code: form.value.postal_code,
          state_province_id: form.value.state,
          address_count: form.value.address_count,
          client_new: this.newClient ? true : false,
        })
        .then((response) => {
          if (response.result.success) {
            stepper.previous();
            //this.uncheck =false
            ////////////this.getAddressSame('')
            // this.getAddress(response.result.data.address_organization[0].id);
            response.result.data.address_organization[0]["selected"] = true;
            if (
              response.result.data.address_organization[0].address_type_id == 4
            ) {
              this.order.clientAddress.map(function (value) {
                value["selected"] = false;
              });
              this.order.clientAddress.push(
                response.result.data.address_organization[0]
              );
              this.order.selectedShippingError = false;
              console.log(this.order.clientAddress);
            }
            this.clientAddressSame = this.order.clientAddress.filter(function (
              value
            ) {
              if (value["selected"]) {
                return true;
              }
              return false;
            });
            console.log(this.clientAddressSame);

            if (
              response.result.data.address_organization[0].address_type_id == 2
            ) {
              this.order.companyAddress.map(function (value) {
                value["selected"] = false;
              });
              this.order.companyAddress.push(
                response.result.data.address_organization[0]
              );
              this.order.selectedBillingError = false;
              console.log(
                response.result.data.address_organization[0],
                "dddddddddddddd"
              );
            }

            if (
              response.result.data.address_organization[0].address_type_id == 11
            ) {
              this.order.notifyAddress.map(function (value) {
                value["selected"] = false;
              });
              this.order.notifyAddress.push(
                response.result.data.address_organization[0]
              );
              this.order.selectedNotifyError = false;
              console.log(this.order.notifyAddress);
            }
          }
        });
      /*if(this.order.addressType=='client'){
          this.organizationsService
          .OrganizationAddress({
              address1: form.value.address1,
              address2: form.value.address2,
              address_type_id: form.value.address_type_id,
              city: form.value.city,
              country_id: form.value.country,
              id: 0,
              org_id: this.clientsForm.controls.client.value,
              postal_code: form.value.postal_code,
              state_province_id: form.value.state,
          })
          .then(response => {
              if(response.result.success){
                stepper.previous();
                this.getAddress(true);
              }
          });
      }else{
        this.adminService
          .addContactAddress({
              address1: form.value.address1,
              address2: form.value.address2,
              address_type_id: form.value.address_type_id,
              city: form.value.city,
              country_id: form.value.country,
              id: 0,
              org_id: this.clientsForm.controls.client.value,
              postal_code: form.value.postal_code,
              state_province_id: form.value.state,
          })
          .then(response => {
            if(response.result.success){
              stepper.previous();
              this.getAddress(true);
            }
          });
      }*/
    }
  }

  createOrder(stepper: MatStepper) {
    // console.log(this.order.companyAddress)
    // console.log(this.order.clientAddress)
    // console.log(this.order.notifyAddress)
    this.addressSubmit = true;
    // console.log(this.deliveryDate)
    // if (this.productsForm.invalid) {
    if (this.createAddressForm.invalid) {
      setTimeout(() => {
        let scrollTag = document.querySelector(".address-error");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    // }
    let clientAddress = [];

    if (this.order.clientAddress.length) {
      clientAddress = this.order.clientAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
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
      return;
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
      return;
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

        // if (!notifyAddress.length) {
        //   this.order.selectedNotifyError = true;
        // } else {
        //   this.order.selectedNotifyError = false;
        // }
        // (this.order.notifyAddress.length ? notifyAddress.length : !notifyAddress.length)
      }
    }

    if (
      (this.order.clientAddress.length
        ? clientAddress.length
        : !clientAddress.length) &&
      (this.order.companyAddress.length
        ? companyAddress.length
        : !companyAddress.length)
    ) {
      let selectedProducts = [];
      if (this.uploads.length) {
        this.order.filename = this.uploads[0].filename;
        this.order.original_name = this.uploads[0].original_name;
        this.order.src_name = this.uploads[0].source_path;
      }
      this.order.selectedProducts.map(function (value) {
        //products_types_id,quantity,price
        selectedProducts.push({
          price: value.price,
          quantity: value.quantity,
          products_types_id: value.id,
          selected: value.selected,
        });
      });
      // console.log(stepper)
      if (this.App.user_details.log_type != "2") {
        stepper.selectedIndex = 4;
      } else {
        stepper.selectedIndex = 3;
      }

      this.orderData = {
        poNumber: this.productsForm.controls.po_no.value,
        po_date: this.productsForm.controls.po_date.value,
        email: this.productsForm.controls.email.value,
        phone: this.productsForm.controls.phone.value,
        ext: "",
        kindAttn: this.productsForm.controls.kindAttn.value,
        delivery_date: this.productsForm.controls.delivery_date.value,
        dispatch_date: this.productsForm.controls.dispatch_date.value,
        productArr: selectedProducts,
        special_instructions:
          this.productsForm.controls.special_instructions.value,
      };
      // console.log(this.orderData)
    }
  }

  changeUser(param: any) {
    //contactsList
    let clientPhone = "";
    let clientEmail = "";
    let clientExt = "";
    let attachment_id = this.productsForm.value.kindAttn;
    console.log(param, 1234223);

    this.contactsList.map(function (value) {
      console.log(value.name);
      // console.log(attachment_id)
      if (value.name == attachment_id) {
        // console.log(value.email)
        clientPhone = value.phone;
        clientExt = value.ext;
        clientEmail = value.email;
        // console.log(value)
      }
    });
    // console.log(this.contactsList)

    this.productsForm.patchValue({
      phone: clientPhone,
      ext: clientExt,
      email: clientEmail,
    });
    this.productsForm.get("email");
  }
  public slectStatus: boolean = false;
  changeCheckbox(data: any): void {
    if (!data.selected) {
      data["error"] = false;
      this.productValue.push(data);

      // console.log(this.productValue.splice(data,1))
      // this.productValue.splice(data.selceted,1)
    } else {
      let removeIndx = this.productValue.findIndex(
        (item: any) => item.id === data.id
      );
      this.productValue.splice(removeIndx, 1);
    }
    console.log(this.productValue);
    console.log(this.productValue);
    if (this.productValue.length > 1) {
      this.slectStatus = true;
    }

    this.order.selectedProductsError = false;
    data.selected = data.selected;
    // console.log(data.selected)
    if (!data.selected) {
      data["error"] = false;
    }
    this.order.selectedProductsError = false;
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
    console.log(picker);
  }
  openCalendar1(picker: MatDatepicker<Date>) {
    picker.open();
  }

  changeProductPrice(data: any, event: any): void {
    if (data.selected && data.quantity != "") {
      data["error"] = false;
    }
    let s = event.target.value;

    if (s == "") {
      this.quantError = true;
    } else {
      this.quantError = false;
    }

    console.log(data.quant_limit, event.target.value);
  }
  public orderFaildedMsg = "";
  clientAddress: any;
  createOrderConfirm(stepper: any) {
    this.confirOrderLoad = true;
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
    console.log(companyAddress);
    let notifyAddress = [];
    if (this.order.notifyAddress.length) {
      notifyAddress = this.order.notifyAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
    }
    let selectedProducts = [];
    if (this.uploads.length) {
      this.order.filename = this.uploads[0].filename;
      this.order.original_name = this.uploads[0].original_name;
      this.order.src_name = this.uploads[0].source_path;
    }
    this.order.selectedProducts.map(function (value) {
      //products_types_id,quantity,price
      selectedProducts.push({
        price: value.price,
        quantity: value.quantity,
        products_types_id: value.id,
      });
    });
    const orderDeliveryDate = moment(
      this.productsForm.controls.delivery_date.value
    ).toLocaleString();
    if (this.productsForm.controls.dispatch_date.value) {
      this.orderDispatchDate = moment(
        this.productsForm.controls.dispatch_date.value
      ).toLocaleString();
    } else {
      this.orderDispatchDate = "";
    }
    if (this.productsForm.controls.po_date.value) {
      this.poDate = moment(
        this.productsForm.controls.po_date.value
      ).toLocaleString();
    } else {
      this.poDate = "";
    }

    //console.log(this.proformaInvData[0].profInv.email,)
    this.OrdersService.createOrder({
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
      po_nbr: this.productsForm.controls.po_no.value,
      po_date: this.poDate,
      email: this.productsForm.controls.email.value,
      phone: this.productsForm.controls.phone.value,
      ext: this.productsForm.controls.ext.value,
      kindAttn: this.productsForm.controls.kindAttn.value,
      delivery_date: orderDeliveryDate,
      dispatch_date: this.orderDispatchDate,
      productArr: selectedProducts,
      filename: this.order.filename,
      original_name: this.order.original_name,
      src_name: this.order.src_name,
      client_new: this.newClient ? true : false,
      //currency_id: currency_id

      is_sample_order: this.clientsForm.controls.is_sample_order.value,
      is_order: true,
    }).then((response) => {
      // console.log(response,'tet')
      if (response.result.success) {
        this.orderFaildedMsg = "";
        this.confirOrderLoad = false;
        this.createbtnDisabled = false;
        this.dialogRef.close({
          success: true,
          response: response.result.data.id,
        });
        let toast;
        //  let data = response.result.data.totalordersDt;
        // let reloadPage = true;
        // this.router.events.subscribe(val => {
        //   if (val instanceof NavigationStart) {
        //     if (val['url'].match('orders')) {console.log('reload')
        //     console.log(val['url'])
        //       reloadPage = false;
        //       const config = this.router.config.map((route) => Object.assign({}, route));
        //       this.router.resetConfig(config);
        //       this.router.navigate([val['url']]);
        //     }
        //   }
        // });
        // if(reloadPage){console.log('navigate')
        //   this.router.navigate(['/orders']);
        // }
      } else {
        this.orderFaildedMsg = "Failed to create order";
      }
    });
  }
  selectCompanyAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.companyAddress.map(function (value) {
      if (data.id != value.id) {
        value["selected"] = true;
      }
      addressList.push(value);
    });
    this.order.companyAddress = addressList;
  }

  selectClientAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.clientAddress.map(function (value) {
      if (data.id != value.id) {
        value["selected"] = false;
      }
      addressList.push(value);
    });
    this.order.clientAddress = addressList;
  }

  selectNotifyAddress(data: any, list: any): void {
    data.selected = !data.selected;
    let addressList = [];
    this.order.notifyAddress.map(function (value) {
      if (data.id != value.id) {
        value["selected"] = false;
      }
      addressList.push(value);
    });
    this.order.notifyAddress = addressList;
  }
  clientAddressSame = [];
  selectAddress(data: any, list: any, type: any): void {
    // console.log(data)
    if (!data.selected) {
      if (type == 1) {
        // console.log('comingggggggg')
        (this.shippingAddressDetails.address1 = data.address1),
          (this.shippingAddressDetails.address2 = data.address2),
          (this.shippingAddressDetails.country = data.country),
          (this.shippingAddressDetails.state = data.state),
          (this.shippingAddressDetails.postal_code = data.postal_code);
        this.clientAddressSame = [];
      } else if (type == 2) {
        // console.log('comingggggggg')
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
      //this.uncheck = false
      this.order.selectedBillingError = false;
    } else {
      this.order.selectedNotifyError = false;
    }
  }

  goToNext(stepper: MatStepper) {
    stepper.next();
    if (stepper["_selectedIndex"] == 1) {
      this.getProducts();
      this.getContacts();
    } else if (stepper["_selectedIndex"] == 2) {
      this.getAddress();
    }
  }

  goToPrev(stepper: MatStepper) {
    if (stepper["_selectedIndex"] == 4) {
      this.stepper.selectedIndex = 2;
    } else if (
      stepper["_selectedIndex"] == 3 &&
      App.user_details.log_type == "2"
    ) {
      this.stepper.selectedIndex = 1;
    } else {
      stepper.previous();
    }

    this.order.clientAddress.map(function (value) {
      value["selected"] = false;
    });
    this.order.companyAddress.map(function (value) {
      value["selected"] = false;
    });
    this.order.notifyAddress.map((value, index) => {
      value["selected"] = false;
    });
  }

  phoneNumberValidation(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    event.preventDefault();
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onScroll(): void {
    if (this.param.page < this.totalPages && this.totalPages != 0) {
      this.param.page++;
      this.getOrganizations(this.param);
    }
  }

  public clear() {
    this.modelData.id = null;
    this.modelData.name = null;
    this.searchCtrl.setValue(null);
    this.param.search = "";
    this.getOrganizations(this.param);
  }
  public clientSelectedId;
  selectionChange(data) {
    // console.log(data)
    if (data) {
      this.inClient = true;
    } else {
      this.inClient = false;
    }

    let i = _.findIndex(<any>this.order.organizations, {
      name: data.name,
      id: data.id,
    });
    // console.log(data.id,23445);

    if (i > -1) {
      // console.log(this.order.organizations[i].id)
      this.clientSelectedId = this.order.organizations[i].id;
    }
    this.modelData.id = data.id;
    this.modelData.name = data.name;
    if (this.data["flag"] && this.data["flag"] == "Create Order") {
      this.param["status"] = 1;
    }
    if (this.data["flag"] && this.data["flag"] == "Create Order in Estimate") {
      this.param["status"] = 1;
    }
    this.getOrganizations(this.param);
    this.searchCtrl.setValue(data.name);

    this.errormessage = "";
  }
  getOrganizationDetails(): void {
    this.organizationsService
      .getGlobalOrganizations()
      .then((response) => {
        if (response.result.success) {
          this.countries = response.result.data.countries;
          this.countries.unshift({ id: "add_country", name: "Add Country" });
          this.currencyX = response.result.data.currency;
        }
      })
      .catch((error) => console.log(error));
  }

  addCountry(country: any) {
    if (country.value.addCountry) {
      this.adminService
        .addCountry({ name: country.value.addCountry })
        .then((response) => {
          if (response.result.success) {
            this.submitState = true;
            this.submitCountry = false;
            this.getOrganizationDetails();
            this.clientsForm.patchValue({
              country_id: response.result.data.id,
            });
          }
        });
    }
  }

  onCountryChange1(event): void {
    console.log(event);
    if (event.value == "add_country") {
      this.submitCountry = true;
    } else {
      this.submitCountry = false;
    }
  }
  public addNew = false;
  public selectedClients(event: any, param?: any) {
    console.log(event.target.value);
    this.showError = false;
    this.selectAuto = true;
    this.param.search = event.target.value;
    console.log(this.param);
    this.organizationsService
      .getOrganizationsList(this.param)
      .then((response) => {
        if (response.result.success) {
          this.totalCount = response.result.data.total;
          this.totalPages = Math.ceil(
            Number(this.totalCount) / this.param.perPage
          );
          this.order.organizations = response.result.data.organization;
          this.addNew = false;
        }
        if (!response.result.data.organization?.length) {
          this.addNew = true;
          this.showError = true;
          this.errormessage = "No Client Data Found";
        }
      });
  }

  public newClientName: any;
  createClient() {
    let toast: object;
    let dialogRef = this.dialog.open(NewClientComponent, {
      panelClass: "alert-dialog",
      width: "600px",
      disableClose: true,
      data: this.param.search,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result)
      if (result.success) {
        this.newClientadded = true;
        this.newClient = true;
        this.newClientid = result.response.id;
        console.log(result.response);
        this.newClientName = result.response.name;
        this.clientsForm.patchValue({
          client: result.response.name,
        });
        toast = { msg: "Order Created Successfully...", status: "success" };
        //this.snackbar.showSnackBar(toast);
      }
    });
  }
}
