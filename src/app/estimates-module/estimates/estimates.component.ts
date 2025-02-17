import {
  Component,
  OnInit,
  ElementRef,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import { Images } from "../../images/images.module";
import { InventoryService } from "../../services/inventory.service";
import { OrdersService } from "../../services/orders.service";
import { OrganizationsService } from "../../services/organizations.service";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { FormBuilder } from "@angular/forms";
import { SnakbarService } from "../../services/snakbar.service";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { MatDatepicker } from "@angular/material/datepicker";
import { trigger, style, transition, animate } from "@angular/animations";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Lightbox } from "ngx-lightbox";
import * as $ from "jquery";
import { Router } from "@angular/router";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { CreatePfiComponent } from "../create-pfi/create-pfi.component";
import { LeadsService } from "../../leads/leads.service";
import { OrdersCreateComponent } from "../../orders-module/order-create/order-create.component";
import { EstimateFilterComponent } from "../estimate-filter/estimate-filter.component";
import { AdminService } from "../../services/admin.service";
declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-estimates",
  templateUrl: "./estimates.component.html",
  styleUrls: ["./estimates.component.scss"],
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
export class EstimatesComponent implements OnInit {
  @ViewChild("fruitInput") fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild("auto") matAutocomplete: MatAutocomplete;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  selectedClientsChipsId: string[] = [];
  private App = App;
  public userDetails: any;
  public clientPermission: any;
  public factoryPermission: boolean = true;
  totalCount: any;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  checked: boolean;
  totalSpinner: boolean;
  private timeout;
  public showFilter = false;
  public disableFilter = false;
  fetchingData = true;
  downloadStatus: boolean;
  filtersLoader = true;
  public icon: boolean = false;
  public show: boolean = true;
  invoiceGenerateLoader: boolean = false;
  activeState: boolean;
  shippingActiveState: boolean;
  searching: boolean;
  totalPages: number = 2500;
  ActivityLog: boolean;
  editShipping: boolean = true;
  disableCancel: boolean;
  ordersDownload: boolean;
  added: boolean;
  hideShipperAddress: boolean = false;
  public matSelectOpen = false;
  orderFormCompanyDetails: any;
  public hidePaidBtn: boolean = true;
  containerId: any;
  public imagUploadFlag: any;
  public getFileFlag: any;
  public estimateslanguage = estimate_name;
  params = {
    pageSize: 12,
    page: 1,
    search: "",
  };

  clickedGenerateInvoice: boolean = false;
  showDocuments = false;
  taxInvoiceDocument = true;
  public orders = {
    data: [],
    status: [],
    shippingAddress: [],
    productsList: [],
    organizations: [],
    shipping_data: [],
    countrysList: [],
    accountManagerList: [],
    expectedDeliveryDate: [
      {
        id: 1,
        name: "Expected Delivery Date",
        selected: false,
      },
    ],
    selectedClients: new FormControl([]),
    selectedProduct: new FormControl([]),
    selectedClient: new FormControl([]),
    selectedManager: new FormControl([]),
    selectedCountry: new FormControl([]),
    client_search: "",
    mfg_date: "",
    selectedOrder: {
      client_name: "",
      client_image: "",
      date_added: "",
      id: "",
      estimate_no: "",
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
    billingAddr: {
      bill_address1: "",
      bill_address2: "",
      bill_countrty: "",
      bill_postal_code: "",
      bill_state: "",
    },
    shippingAddr: {
      ship_address1: "",
      ship_address2: "",
      ship_countrty: "",
      ship_postal_code: "",
      ship_state: "",
    },
    notifyAddr: {},
    companyShpAddrDt: {
      ksm_address1: "",
      ksm_address2: "",
      ksm_city: "",
      ksm_state: "",
      ksm_countrty: "",
      ksm_postal_code: "",
      ksm_gstin_no: "",
    },
    productsData: new MatTableDataSource(),
    showDetailView: false,
    packageOrders: [],
    packing: [],
    sum: {},
    invoice: [],
    shipping_id: 0,
    mode_transport_ids: [],
    CoaDetails: [],

    activityDetails: [],
  };
  public transportModeList = [
    { id: 1, name: "Air" },
    { id: 2, name: "Sea" },
  ];
  public paymentStatus = false;
  data = {
    id: "",
    selectedStatus: [],
    selectedProducts: [],
    selectedClients: this.selectedClientsChipsId,
    client_search: this.orders.client_search,
    manifacture_date: this.orders.mfg_date,
    search: this.params.search,
    pageSize: this.params.pageSize,
    page: this.params.page,
  };
  public clientsFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public activeTab = "activity";
  reportsFooter: boolean;
  private activateScroll = true;
  public createOrderPermission = false;
  public otherDocs = [];
  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
    flag: "estimates",
  };
  @ViewChild("stepper") stepper: TemplateRef<any>;
  @ViewChild("scrollContainer") scrollContainer: TemplateRef<any>;
  @ViewChild("activity") activity: TemplateRef<any>;
  @ViewChild("details") details: TemplateRef<any>;
  @ViewChild("packaging") packaging: TemplateRef<any>;
  @ViewChild("invoice") invoice: TemplateRef<any>;
  @ViewChild("coa") coa: TemplateRef<any>;
  attachments = [];
  originFileAttachments = [];
  insuranceAttachments = [];
  airwayAttachments = [];
  shippingAttachments = [];
  pointerEvent: boolean;
  invalidText: boolean;
  uploadError: boolean;
  sizeError: boolean;
  public onLoadFiles = ["origin", "insurance", "shipping", "Bill"];
  public fileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/xlsx",
  ];
  public imageUploadUrl =
    App.base_url + "addOrderAtt?estimate_id=" + this.orders.selectedOrder.id;
  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  public containerName: any = [];
  public coaCompanyName: any;
  sendDocumentMails: boolean = false;
  adminUser: boolean;
  admin_access: boolean;
  coaLineItemEdit: boolean = false;
  poDate: boolean = true;
  coalineItem: any;
  shipperId: any;
  public po_date2 = new Date(
    this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ""
  );
  serchArray: any[];

  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}
  fileSelected(event): void {}

  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private cookie: CookieService,
    private _lightbox: Lightbox,
    private router: Router,
    private leadService: LeadsService,
    public adminService: AdminService
  ) {
    this.uploader.onBeforeUploadItem = (fileItem: any) => {};

    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      return { fileItem, progress };
    };

    this.uploader.onWhenAddingFileFailed = (
      item: any,
      filter: any,
      options: any
    ) => {
      let chunks = item.name.split(".");
      let extension = chunks[chunks.length - 1].toLowerCase();
      if (extension == "pdf") {
        item.type = "application/pdf";
      } else if (extension == "docx") {
        item.type =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (extension == "doc") {
        item.type = "application/msword";
      } else if (extension == "xlsx") {
        item.type = "application/xlsx";
      } else if (extension == "jpg") {
        item.type = "image/jpg";
      } else if (extension == "png") {
        item.type = "image/png";
      } else if (extension == "jpeg") {
        item.type = "image/jpeg";
      }

      let index = this.fileTypes.indexOf(item.type);
      if (
        item.size >= options.maxFileSize &&
        item.type == this.fileTypes[index]
      ) {
        this.sizeError = true;
        let toast: object;
        toast = { msg: "File size exceeds max limit(5 mb)", status: "error" };
        this.snackbar.showSnackBar(toast);
      } else {
        this.fileValidation(item, true);
      }
    };

    this.uploader.onAfterAddingFile = (item: any) => {
      this.pointerEvent = true;
      this.invalidText = false;
      let chunks = item.file.name.split(".");
      let extension = chunks[chunks.length - 1].toLowerCase();
      if (extension == "pdf") {
        item.file.type = "application/pdf";
      } else if (extension == "docx") {
        item.file.type =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (extension == "doc") {
        item.file.type = "application/msword";
      } else if (extension == "xlsx") {
        item.file.type = "application/xlsx";
      } else if (extension == "jpg") {
        item.file.type = "image/jpg";
      } else if (extension == "png") {
        item.file.type = "image/png";
      } else if (extension == "jpeg") {
        item.file.type = "image/jpeg";
      }
      this.fileValidation(item.file, true);
    };

    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      if (!this.fileValidation(item.file, false)) {
        this.uploadError = false;
        this.sizeError = false;
        this.searching = false;
        return;
      }
      let obj = JSON.parse(response);
      if (obj.result.success) {
        let toastMsg: object;
        toastMsg = { msg: "File uploaded successfully", status: "success" };
        this.snackbar.showSnackBar(toastMsg);
        if (!obj.result.data.error_format) {
          this.uploadError = false;
          this.sizeError = false;
          obj.result.data.OrdersAtt.forEach((element) => {
            element.src = "";
            if (element.link_url.lastIndexOf(".pdf") > -1) {
              element.src = this.images.pdf_download;
            } else if (
              element.link_url.lastIndexOf(".doc") > -1 ||
              element.link_url.lastIndexOf(".docx") > -1 ||
              element.link_url.lastIndexOf(".xlsx") > -1
            ) {
            } else {
              element.src = element.link_url;
            }
          });

          if (item.url.indexOf("country") > -1) {
            this.originFileAttachments = obj.result.data.OrdersAtt;
          } else if (item.url.indexOf("insurance") > -1) {
            this.insuranceAttachments = obj.result.data.OrdersAtt;
          } else if (item.url.indexOf("Bill") > -1) {
            this.airwayAttachments = obj.result.data.OrdersAtt;
          } else if (item.url.indexOf("shipping") > -1) {
            this.shippingAttachments = obj.result.data.OrdersAtt;
          } else {
            this.attachments = obj.result.data.OrdersAtt;
          }
        } else {
          this.invalidText = true;
        }
      } else {
        let toastMsg: object;
        toastMsg = { msg: "Error while uploading", status: "error" };
        this.snackbar.showSnackBar(toastMsg);
      }
    };

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.AllClientList.slice()
      )
    );
  }
  public AllClientList = [];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.AllClientList.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }

  fileValidation(item: any, showToast: any) {
    let index = this.fileTypes.indexOf(item.type);
    if (item.type != this.fileTypes[index]) {
      let toast: object;
      this.uploadError = true;
      toast = {
        msg: "Invalid file format.Supported file type(.jpg, .jpeg, .png, .pdf, .doc, .docx, .xlsx)",
        status: "error",
      };
      if (showToast) {
        this.snackbar.showSnackBar(toast);
      }
      this.uploader.cancelItem;
      return false;
    }
    return true;
  }
  public clientParam = {
    search: "",
  };
  searchClients(event?: any): void {
    this.clientParam.search = event.target.value;

    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {}, 1000);
  }
  public selectedClientsChips = [];
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedClientsChipsId.push(event.option.value);
    this.selectedClientsChips.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
    this.showFilter = true;
  }
  remove(fruit: string): void {
    // const index = this.selectedClientsChipsId.indexOf(fruit);
    const index = this.selectedClientsChips.indexOf(fruit);

    if (index >= 0) {
      this.selectedClientsChipsId.splice(index, 1);
      this.selectedClientsChips.splice(index, 1);
    }
  }

  ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.titleService.setTitle(App["company_data"].EstimateTitle);
    this.orderFormCompanyDetails = App["company_data"];
    this.orderFilterData();
    this.userDetails = App.user_details;
    let permission: boolean;
    let profile: boolean;
    let createOrder: boolean;
    let admin_profile: boolean;
    App.user_roles_permissions.map(function (value) {
      switch (value.code) {
        case "factory_user":
          if (value.selected) {
            permission = false;
          } else {
            permission = true;
          }
          break;
        case "client_interface":
          if (value.selected) {
            profile = true;
          } else {
            profile = false;
          }
          break;
        case "admin":
          if (value.selected) {
            admin_profile = true;
          } else {
            admin_profile = false;
          }
          break;
        case "create_order":
          if (value.selected === true) {
            createOrder = true;
          } else {
            createOrder = false;
          }
          break;
      }
    });
    this.createOrderPermission = createOrder;

    this.factoryPermission = true;
    this.clientPermission = profile;
    this.adminUser = admin_profile;

    this.downloadStatus = false;
    const storedData = localStorage.getItem("PFI-Filters");
    if (!storedData) {
      this.getEstimatesList(true);
    }
    this.userDetailsType();

    this.ActivityLog = false;
    this.editShipping = true;

    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.searchOrganizations();
      });
    this.po_date2 = new Date(
      this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ""
    );


 
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }
  public once = true;

  orderFilterData() {
    let param = {};
    this.OrdersService.getOrderFilterData(this.param).then((response) => {
      if (response.result.success) {
        this.orders.shippingAddress = response.result.data.companyShpAddrDt;
        this.orders.shippingAddress &&
          this.orders.shippingAddress.map(function (value) {
            value.selected = false;
          });
        this.orders.status = response.result.data.orderTypes;
        this.orders.status &&
          this.orders.status.map(function (value) {
            value.selected = false;
          });
        this.orders.productsList = response.result.data.products;
        this.orders.productsList &&
          this.orders.productsList.map(function (value) {
            value.selected = false;
          });
        this.orders.countrysList = response.result.data.countries;
        this.orders.countrysList &&
          this.orders.countrysList.map(function (value) {
            value.selected = false;
          });
        this.orders.organizations = response.result.data.organization;

        this.orders.organizations &&
          this.orders.organizations.map(function (value) {
            value.selected = false;
          });
        this.orders.accountManagerList = response.result.data.accountManager;

        this.orders.accountManagerList &&
          this.orders.accountManagerList.map(function (value) {
            value.selected = false;
          });
      }
      if (this.once) {
        this.preFillFiltersData();
        this.once = false;
      }
    });
  }

  preFillFiltersData(): void {
    const storedData = localStorage.getItem("PFI-Filters");
    if (!storedData) {
      return;
    }

    const parsedData = JSON.parse(storedData);
    console.log(parsedData, "fil");
    if (parsedData.selectedManager && parsedData.selectedManager.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedManager,
        this.orders.accountManagerList,
        this.orders.selectedManager,
        "account_manager"
      );
    }

    if (parsedData.selectedProducts && parsedData.selectedProducts.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedProducts,
        this.orders.productsList,
        this.orders.selectedProduct,
        "id"
      );
    }

    if (parsedData.selectedClients && parsedData.selectedClients.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedClients,
        this.orders.organizations,
        this.orders.selectedClients,
        "id"
      );
    }

    if (parsedData.selectedCountry && parsedData.selectedCountry.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedCountry,
        this.orders.countrysList,
        this.orders.selectedCountry,
        "id"
      );
    }

    if (parsedData.created_date && parsedData.created_date != "") {
      this.showFilter = true;
      this.orders.mfg_date = parsedData.created_date;
    }
    if (parsedData.client_search && parsedData.client_search != "") {
      this.params.search = parsedData.client_search;
    }
    this.filterApplied = true;
    this.getEstimatesList(true);
  }

  private setFilterValues(
    selectedIds: any[],
    itemList: any[],
    control: any,
    key: string
  ): void {
    console.log(itemList, "selected");
    const selectedValues = [];
    itemList.forEach((item) => {
      if (selectedIds.includes(item[key])) {
        selectedValues.push(item[key]);
        item.selected = true;
      }
    });
    control.setValue(selectedValues);
  }

  createEstimate() {
    let dialogRef = this.dialog.open(CreatePfiComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        flag: "Create Order",
        title: "Create",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        let toast: object;
        toast = {
          msg: this.estimateslanguage + " Created Successfully...",
          status: "success",
        };
        this.cookie.set("estimate_id", result.response);
        this.router.navigate(["/estimates", result.response]);

        this.snackbar.showSnackBar(toast);
      }
    });
  }
  moveToActivity() {
    this.activateScroll = false;
    this.activeTab = "activity";
    this.ActivityLog = true;
    this.activity["nativeElement"].show = true;
    if (this.activity && this.activity["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.activity["nativeElement"].offsetTop - 46;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToDetails() {
    this.activateScroll = false;
    this.activeTab = "details";
    if (this.details && this.details["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.details["nativeElement"].offsetTop - 46;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  setImageUrl() {
    this.imageUploadUrl =
      App.base_url + "addOrderAtt?orders_id=" + this.orders.selectedOrder.id;
    this.uploader.setOptions({ url: this.imageUploadUrl });
  }
  backToOrders(stepper: MatStepper) {
    this.otherDocs = [];
    this.activeTab = "activity";
    this.totalSpinner = true;
    stepper.previous();
    this.ActivityLog = false;
    this.params.page = 1;
    this.orders.packageOrders["invStatus"] = 1;
    this.activity["nativeElement"].show = false;
    this.totalSpinner = false;
    this.shippingActiveState = false;
  }
  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate([
      "/estimates",
      // 213
      data.id,
    ]);
    return;
  }
  filterchecboxes;
  checkboxChange(data: any): void {
    data.selected = !data.selected;
    this.updateShowFilter();
    this.updateFilter();
  }
  getParms() {
    let data: any = {
      selectedStatus: [],
      selectedProducts: [],
      selectedShippingAddress: [],
      selectedManager: [],
      selectedCountry: [],
      selectedVendors: [],
      selectedClients: this.selectedClientsChipsId,
      client_search: this.orders.client_search,
      manifacture_date: "",
      search: this.params.search,
      pageSize: this.params.pageSize,
      page: this.params.page,
      sortBy: "",
      flag: 1,
      isOrders: true,
      created_date: "",
    };

    if (this.filterApplied === true) {
      data = {
        selectedStatus: this.orders.status
          .filter((status) => status.selected)
          .map((status) => status.id),
        selectedProducts: this.orders.selectedProduct.value,
        selectedCountry: this.orders.selectedCountry.value,
        selectedManager: this.orders.selectedManager.value,
        selectedShippingAddress: this.orders.shippingAddress
          .filter((address) => address.selected)
          .map((address) => address.id),
        selectedClients: this.orders.selectedClients.value,
        client_search: this.orders.client_search,
        manifacture_date: this.orders.mfg_date
          ? this.orders.mfg_date
          : // ? moment(this.orders.mfg_date).format("YYYY-MM-DD")
            "",
        search: this.params.search,
        pageSize: this.params.pageSize,
        page: this.params.page,
        sortBy: this.orders.expectedDeliveryDate.some((date) => date.selected)
          ? "exp_delivery_date"
          : "",
        flag: 1,
        isOrders: false,
      };
      if (this.orders.mfg_date == "") {
        data.manifacture_date = "";
      } else {
        data.manifacture_date = this.orders.mfg_date;
        //  moment(this.orders.mfg_date).format( "YYYY-MM-DD");
      }
    }

    return data;
  }
  updateFilter(name?): void {
    const selectedClientsCount = this.orders.selectedClients.value.length;

    const selectedproductCount = this.orders.selectedProduct.value.length;
    const selectedManagerCount = this.orders.selectedManager.value.length;
    const selectedCountriesLength = this.orders.selectedCountry.value.length;

    this.filterchecboxes =
      selectedClientsCount +
      selectedManagerCount +
      selectedproductCount +
      selectedCountriesLength;
    if (this.filterchecboxes != 0 || this.orders.mfg_date) {
      this.showFilter = true;
      this.disableFilter = false;
    } else {
      this.disableFilter = true;
    }
  }

  clientChange() {
    this.showFilter = true;
  }
  public listCount = 0;
  public pageNumber = false;
  getEstimatesList(clearList?: any): void {
    if (clearList) {
      this.fetchingData = true;
    }
    const obj = this.getPagams();
    const params = {
      ...obj,
      name: "pfi",
      page: this.params.page,
      perPage: this.params.pageSize,
      search: this.params.search,
    };
    this.leadService.getGridList(params).then((response) => {
      this.fetchingData = false;
      this.filtersLoader = false;
      if (response.result.success) {
        if (clearList) {
          this.orders.data = [];
        }
        let data = response.result.data.total_data;
        this.totalCount =
          response.result.data.total || response.result.data.count;
        this.listCount = response.result.data
          ? response.result.data["per_page_total"]
          : 0;
        data.map((res) => {
          this.orders.data.push(res);
        });

        let res = [];
        this.orders.data.map(function (item) {
          var existItem = res.find((x) => x.date == item.date);
          if (existItem) {
            res.forEach((item2) => {
              if (item2.date == item.date) {
                item2.list = item2.list.concat(item.list);
              }
            });
          } else {
            res.push(item);
          }
        });
        this.orders.data = res;

        this.searching = false;
      }
    });
  }
  getProductTypesData(): void {
    this.organizationsService
      .getProductsList({ org_id: this.App.user_details.org_id, flag: 1 })
      .then((response) => {
        if (response.result.success) {
          this.orders.productsList = response.result.data.productTypesDt;
          this.orders.productsList.map(function (value) {
            value.selected = false;
          });
        }
      })

      .catch((error) => console.log(error));
  }
  searchProducts(search: string, event?: any, from?: any): void {
    this.param.search = search;
    this.param.page = 1;
    this.searching = true;
    this.orders.productsList.map(function (value) {
      value.selected = false;
    });
    this.serchArray = this.orders.productsList.filter((value) => {
      return value.name.toLocaleLowerCase().includes(search);
    });

    if (from === "close" || search === "") {
      this.serchArray;
      this.searching = false;
    } else {
      this.searching = false;
    }
  }

  getPagams() {
    let data = {
      selectedProducts: this.orders.selectedProduct.value,
      selectedCountry: this.orders.selectedCountry.value,
      selectedManager: this.orders.selectedManager.value,
      // selectedShippingAddress: this.orders.selectedCountry.value,
      selectedClients: this.orders.selectedClients.value,
      manifacture_date: this.orders.mfg_date,
    };

    if (this.orders.mfg_date == "") {
      data.manifacture_date = "";
    } else {
      data.manifacture_date = this.orders.mfg_date;
      // moment(this.orders.mfg_date).format("YYYY-MM-DD");
    }

    // if (this.filterApplied) {
    //   // this.orders.status?.map(function (value) {
    //   //   if (value.selected) {
    //   //     data.selectedStatus.push(value.id);
    //   //   }
    //   // });

    //   this.orders.shippingAddress?.map(function (value) {
    //     if (value.selected) {
    //       if (!data.selectedShippingAddress.includes(value.id)) {
    //       data.selectedShippingAddress.push(value.id);
    //       }
    //     }
    //   });
    //   this.orders.productsList?.map(function (value) {
    //     if (value.selected) {
    //       data.selectedProducts.push(value.id);
    //     }
    //   });
    //   this.orders.countrysList?.map(function (value) {
    //     if (value.selected) {
    //       data.selectedCountry.push(value.id);
    //     }
    //   });
    //   this.orders.accountManagerList?.map(function (value) {
    //     if (value.selected) {
    //       data.selectedManager.push(value.account_manager);
    //     }
    //   });
    //   this.orders.organizations?.map(function (value) {
    //     if (value.selected) {
    //       if (!data.selectedClients.includes(value.id)) {
    //       data.selectedClients.push(value.id);
    //       }
    //     }
    //   });
    // }

    return data;
  }
  clearFilterData() {
    this.showFilter = false;
    this.filterApplied = false;
    this.orders.status?.map(function (value) {
      value.selected = false;
    });
    this.orders.shippingAddress?.map(function (value) {
      value.selected = false;
    });
    this.orders.productsList?.map(function (value) {
      value.selected = false;
    });
    this.orders.expectedDeliveryDate?.map(function (value) {
      value.selected = false;
    });
    this.orders.organizations?.map(function (value) {
      value.selected = false;
    });
    this.orders.countrysList?.map(function (value) {
      value.selected = false;
    });
    this.orders.accountManagerList?.map(function (value) {
      value.selected = false;
    });
    this.activeState = false;
    this.orders.selectedProduct.setValue([]);
    this.orders.selectedManager.setValue([]);
    this.orders.selectedClients.setValue([]);
    this.orders.selectedCountry.setValue([]);

    this.selectedClientsChipsId = [];
    this.selectedClientsChips = [];
    this.orders.client_search = "";
    this.orders.mfg_date = "";
    this.orderFilterData();
    this.getEstimatesList(true);
    this.saveFiltersData();
    this.showFilter = false;
  }

  datePickerChange() {
    this.showFilter = true;
    this.updateFilter();
  }
  public filterApplied = false;
  applyFilterData() {
    this.filterApplied = true;
    this.params.page = 1;
    // this.searching = true;
    let toast: object;
    toast = { msg: " Filters Applied Successfully.", status: "success" };
    this.getEstimatesList(true);
    this.snackbar.showSnackBar(toast);
    this.saveFiltersData();
    this.updateShowFilter();
    this.pageNumber = !this.pageNumber;
  }

  saveFiltersData() {
    const data = {
      selectedProducts: this.orders.selectedProduct.value,
      selectedManager: this.orders.selectedManager.value,
      selectedClients: this.orders.selectedClients.value,
      selectedCountry: this.orders.selectedCountry.value,
      client_search: this.params.search,
      created_date: this.orders.mfg_date,
    };

    localStorage.setItem("PFI-Filters", JSON.stringify(data));
  }

  searchOrders(search: string, event?: any): void {
    this.params.search = search;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.getEstimatesList(true);
      const savedFilterData = JSON.parse(localStorage.getItem("PFI-Filters"));
      if (savedFilterData) {
        savedFilterData["client_search"] = this.params.search;
        localStorage.setItem("PFI-Filters", JSON.stringify(savedFilterData));
      } else {
        localStorage.setItem(
          "PFI-Filters",
          JSON.stringify({ client_search: this.params.search })
        );
      }
    }, 1000);
  }
  loadMore(event) {
    (this.params.pageSize = event.perPage),
      (this.params.page = event.page),
      this.getEstimatesList(true);
  }

  onScroll(): void {
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      this.params.page++;
      this.getEstimatesList();
    }
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  checkboxDisable(event) {
    event.preventDefault();
  }

  searchOrganizations() {
    if (this.matSelectOpen) {
      this.param.search = this.clientsFilterCtrl.value;
      this.orderFilterData();
    }
  }

  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }
  updateShowFilter() {
    const storedData = localStorage.getItem("PFI-Filters");
    if (storedData) {
      const savedFilterData = JSON.parse(localStorage.getItem("PFI-Filters"));

      const hasData = Object.values(savedFilterData).some(
        (value) => Array.isArray(value) && value.length > 0
      );

      this.showFilter = hasData ? true : this.orders.mfg_date ? true : false;
    } else {
      this.showFilter = false;
    }
  }
  public multiActOrdersId = [];
  public multiActions = false;
  public multiActOrders = [];

  selectQuotionForOrder(data) {
    if (data.selceted == true) {
      this.multiActOrdersId.push(data.id);
      this.multiActOrders.push(data);
    } else if (data.selceted === false) {
      let idIndex = this.multiActOrdersId.findIndex(
        (value) => value == data.id
      );
      this.multiActOrdersId.splice(idIndex, 1);
      this.multiActOrders.splice(idIndex, 1);
    }

    if (this.multiActOrdersId.length < 1) {
      this.multiActions = false;
    } else {
      this.multiActions = true;
    }
  }
  createOrderFromQuote() {
    let toast: object;
    let dialogRef = this.dialog.open(OrdersCreateComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        orders: this.multiActOrders,
        ordersId: this.multiActOrdersId,
        title: "Create",
        flag: "override",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        toast = {
          msg: "Order Created Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.router.navigate(["/orders", result.response]);
      } else if (result && !result.success) {
        toast = {
          msg: "Failed to Create Order ",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  openFilterModel() {
    let dialogRef = this.dialog.open(EstimateFilterComponent, {
      width: "30%",
      height: "100%",
      position: { right: "0" },
      data: {
        ordersData: this.orders,
        blockContent: this.blockContent,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  onToppingRemoved(ev) {}
  getClientName(clientId: string): string {
    const client = this.orders.organizations.find(
      (client) => client.id === clientId
    );
    return client ? client.name : "";
  }

  removeClient(clientId: string): void {
    const selectedClients = this.orders.selectedClients.value.filter(
      (id) => id !== clientId
    );
    this.orders.selectedClients.setValue(selectedClients);
  }
  getProductName(clientId: string): string {
    const client = this.orders.productsList.find(
      (client) => client.id === clientId
    );
    return client ? client.name : "";
  }

  removeProd(clientId: string): void {
    const selectedClients = this.orders.selectedProduct.value.filter(
      (id) => id !== clientId
    );
    this.orders.selectedProduct.setValue(selectedClients);
  }

  getManagerName(clientId: string): string {
    const client = this.orders.accountManagerList.find(
      (client) => client.account_manager === clientId
    );
    return client ? client.account_manager : "";
  }

  removeManager(clientId: string): void {
    const selectedClients = this.orders.selectedManager.value.filter(
      (id) => id !== clientId
    );
    this.orders.selectedManager.setValue(selectedClients);
  }
  getCountryName(clientId: string): string {
    const client = this.orders.countrysList.find(
      (client) => client.id === clientId
    );
    return client ? client.name : "";
  }

  removeCountry(clientId: string): void {
    const selectedClients = this.orders.selectedCountry.value.filter(
      (id) => id !== clientId
    );
    this.orders.selectedCountry.setValue(selectedClients);
  }
}
