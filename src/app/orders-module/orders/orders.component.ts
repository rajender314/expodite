import {
  Component,
  OnInit,
  ElementRef,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { OrganizationsService } from "../../services/organizations.service";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { SnakbarService } from "../../services/snakbar.service";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { MatDatepicker } from "@angular/material/datepicker";
import { trigger, style, transition, animate } from "@angular/animations";
import { CookieService } from "ngx-cookie-service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from "@angular/material/autocomplete";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MergeOrderComponent } from "../../dialogs/Merge-Order/merge-orders.component";
import { OrdersCreateComponent } from "../order-create/order-create.component";
import { ErrorDialogComponent } from "../../dialogs/error-dialog/error-dialog.component";
import { LeadsService } from "../../leads/leads.service";
import { CreateShipmentComponent } from "../create-shipment/create-shipment.component";
import { AdminService } from "../../services/admin.service";

declare var App: any;

@Component({
  selector: "app-orders",
  templateUrl: "./orders.component.html",
  styleUrls: ["./orders.component.scss"],
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
export class OrdersComponent implements OnInit {
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
  public orderButton: any;
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean = true;
  containsMilk: boolean;
  totalCount: any;
  public submitShippingForm: boolean = false;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  batchNum: string;
  batchNumArray: Array<any>;
  getSdfData: any;
  getConcernData: any;
  checked: boolean;
  totalSpinner: boolean;
  private timeout;
  packagePrint: boolean;
  buttonName: boolean;
  packageCompleted: boolean;
  disablePayment = true;
  public showFilter = false;
  public disableFilter = false;
  public showMergebutton = false;
  fetchingData = true;
  fetchOrder: boolean;
  downloadStatus: boolean;
  showDrumsList = false;
  filtersLoader = true;
  public icon: boolean = false;
  public postIcon: boolean = false;
  public show: boolean = true;
  invoiceGenerateLoader: boolean = false;
  activeState: boolean;
  public selectedValue = false;
  public selectedOrderStatus: any;
  searching: boolean;
  totalPages: number = 2500;
  ActivityLog: boolean;
  disableCancel: boolean;
  ordersDownload: boolean;
  added: boolean;
  hideShipperAddress: boolean = false;
  hideCheckbox: boolean = false;
  public matSelectOpen = false;
  orderFormCompanyDetails: any;
  public hidePaidBtn: boolean = true;
  // priceQuantityDisable: boolean = false;
  containerId: any;
  public imagUploadFlag: any;
  public getFileFlag: any;
  isFormValid: boolean;
  checkboxChecked: boolean;

  params = {
    pageSize: 12,
    page: 1,
    search: "",
  };

  toppings = new FormControl();
  private timestamp: any;
  enableInvoice: boolean = false;
  clickedGenerateInvoice: boolean = false;
  showDocuments = false;
  taxInvoiceDocument = true;
  public orders = {
    packageStatus: "",
    data: [],
    status: [],
    shippingAddress: [],
    productsList: [],
    organizations: [],
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
    slectedStatus: new FormControl([]),
    slectedshipAdd: new FormControl([]),
    selectExpectdate: new FormControl([]),
    selected: true,
    client_search: "",
    mfg_date: "",
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
    mode_transport_ids: [],
    CoaDetails: [],

    activityDetails: [],
  };
  public showNotifyAddress = false;

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

  public is_merge = App.env_configurations
    ? App.env_configurations.is_merge
    : true;
  public is_automech = App.env_configurations.is_automech;

  public is_aapl = App.env_configurations.is_aapl;

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
    flag: "orders",
  };
  @ViewChild("stepper") stepper: TemplateRef<any>;
  @ViewChild("scrollContainer") scrollContainer: TemplateRef<any>;
  attachments = [];
  pointerEvent: boolean;
  invalidText: boolean;
  uploadError: boolean;
  sizeError: boolean;
  public onLoadFiles = ["origin", "insurance", "shipping", "Bill"];

  // public imageUploadUrl = "";
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
    App.base_url + "addOrderAtt?orders_id=" + this.orders.selectedOrder.id;
  // public screenOrientation: any;
  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    // allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  public containerName: any = [];
  public coaCompanyName: any;
  sendDocumentMails: boolean = false;
  adminUser: boolean;
  admin_access: boolean;
  poDate: boolean = true;
  coalineItem: any;
  shipperId: any;
  public po_date2 = new Date(
    this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ""
  );

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
    public dialog: MatDialog,
    private cookie: CookieService,
    private router: Router,
    private leadService: LeadsService,
    public adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {
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
  public clientParam = {
    search: "",
  };
  public selectedClientsChips = [];
  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedClientsChipsId.push(event.option.value);
    this.selectedClientsChips.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = "";
    this.fruitCtrl.setValue(null);
    this.showMergebutton = true;
    this.showFilter = true;
  }
  remove(fruit: string): void {
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
    this.titleService.setTitle(App["company_data"].ordersTitle);
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

    const storedData = localStorage.getItem("Order-Filters");
    if (!storedData) {
      this.getOrdersList(true);
    }
    this.userDetailsType();
    this.showFilter = false;
    this.showMergebutton = false;
    this.ActivityLog = false;
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
        this.orders.shippingAddress.map(function (value) {
          value.selected = false;
        });
        this.orders.status = response.result.data.orderTypes;
        this.orders.status.map(function (value) {
          value.selected = false;
        });
        this.orders.productsList = response.result.data.products;
        this.orders.productsList.map(function (value) {
          value.selected = false;
        });

        this.orders.organizations = response.result.data.organization;
        // this.orders.selectedClients = response.result.data.organization;
        this.orders.organizations.map(function (value) {
          value.selected = false;
        });
        this.orders.accountManagerList = response.result.data.accountManager;

        this.orders.accountManagerList.map(function (value) {
          value.selected = false;
        });
        if (this.once) {
          this.preFillFiltersData();
          this.once = false;
        }
      }
    });
  }

  preFillFiltersData(): void {
    const storedData = localStorage.getItem("Order-Filters");
    if (!storedData) {
      return;
    }

    const parsedData = JSON.parse(storedData);
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
    //      selectedStatus: this.orders.slectedStatus.value,
    //   sortBy: this.orders.selectExpectdate.value,

    if (parsedData.selectedStatus && parsedData.selectedStatus.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedStatus,
        this.orders.status,
        this.orders.slectedStatus,
        "id"
      );
    }
    if (parsedData.sortBy && parsedData.sortBy.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.sortBy,
        this.orders.expectedDeliveryDate,
        this.orders.selectExpectdate,
        "name"
      );
    }
    if (
      parsedData.selectedShippingAddress &&
      parsedData.selectedShippingAddress.length > 0
    ) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedShippingAddress,
        this.orders.shippingAddress,
        this.orders.slectedshipAdd,
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

    if (parsedData.created_date && parsedData.created_date != "") {
      this.showFilter = true;
      this.orders.mfg_date = parsedData.created_date;
    }
    if (parsedData.client_search && parsedData.client_search != "") {
      this.params.search = parsedData.client_search;
    }
    this.filterApplied = true;
    this.getOrdersList(true);
  }

  private setFilterValues(
    selectedIds: any[],
    itemList: any[],
    control: any,
    key: string
  ): void {
    const selectedValues = [];
    itemList.forEach((item) => {
      if (selectedIds.includes(item[key])) {
        selectedValues.push(item[key]);
        item.selected = true;
      }
    });
    control.setValue(selectedValues);
  }

  createOrder() {
    // this.router.navigate(['/createOrders']);
    let toast: object;
    let dialogRef = this.dialog.open(OrdersCreateComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        flag: "Create Order",
        showQuotationDropdown: true,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("order_id", result.response);
        this.router.navigate(["/orders", result.response]);
        let toast: object;
        toast = { msg: "Order Created Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  toggle() {
    this.show = !this.show;
    if (this.show) {
      this.orderButton = "Hide";
    } else {
      this.orderButton = "Show";
    }
    this.collapseOut = !this.collapseOut;
  }

  backToOrders(stepper: MatStepper) {
    this.otherDocs = [];
    this.activeTab = "activity";
    this.totalSpinner = true;
    stepper.previous();
    this.ActivityLog = false;
    this.params.page = 1;
    this.getOrdersList(true);
    this.orders.packageOrders["invStatus"] = 1;
    this.totalSpinner = false;
  }
  selectState() {
    this.activeState = true;
    this.updateShowFilter();
  }

  orderDetails(stepper: MatStepper, data: any) {
    // this.router.navigate(["/orders", data.orders.id]);
    this.router.navigate(["/orders", data.id]);

    return;
  }

  filterchecboxes;
  checkboxChange(data?: any, value?: any): void {
    this.updateShowFilter();
    this.updateFilter();

    data.selected = !data.selected;
    // const selectedCountriesLength = this.orders.selectedCountry.value.length;
  }
  updateFilter() {
    const selectedClientsCount = this.orders.selectedClients.value.length;
    const selectedManagerCount = this.orders.selectedManager.value.length;
    const selectedproductCount = this.orders.selectedProduct.value.length;
    const selectedStatuscount = this.orders.slectedStatus.value.length;
    const selectedshipAdcount = this.orders.slectedshipAdd.value.length;
    const selectedExpctcount = this.orders.selectExpectdate.value.length;
    this.filterchecboxes =
      selectedClientsCount +
      selectedManagerCount +
      selectedproductCount +
      selectedStatuscount +
      selectedshipAdcount +
      selectedExpctcount;
    if (this.filterchecboxes != 0 || this.orders.mfg_date) {
      this.showFilter = true;
      this.disableFilter = false;
    } else {
      this.disableFilter = true;
    }
  }

  clientChange() {
    this.showFilter = true;
    // this.showMergebutton=true
  }

  public listCount = 0;
  public pageNumber = false;
  getOrdersList(clearList?: any): void {
    if (clearList) {
      this.fetchingData = true;
    }
    const obj = this.getPagams();
    const params = {
      ...obj,
      name: "orders",
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
        // let data = response.result.data.totalordersDt;
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

        this.orders.data.forEach((item) => {
          item.list.forEach((item2) => {
            if (this.multiActOrdersId.includes(item2.id)) {
              item2.selceted = true;
            }
          });
        });

        this.searching = false;
      }
    });
  }

  public ClientSelection = [];

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
        selectedStatus: this.orders.slectedStatus.value,
        selectedProducts: this.orders.selectedProduct.value,
        selectedManager: this.orders.selectedManager.value,
        selectedShippingAddress: this.orders.slectedshipAdd.value,
        selectedClients: this.orders.selectedClients.value,
        client_search: this.orders.client_search,
        manifacture_date: this.orders.mfg_date ? this.orders.mfg_date : "",
        search: this.params.search,
        pageSize: this.params.pageSize,
        page: this.params.page,
        sortBy: this.orders.selectExpectdate.value,
        flag: 1,
        isOrders: false,
      };
      if (this.orders.mfg_date == "") {
        data.manifacture_date = "";
      } else {
        data.manifacture_date = this.orders.mfg_date;
      }
    }

    return data;
  }

  getPagams() {
    let data = {
      selectedStatus: this.orders.slectedStatus.value,
      selectedProducts: this.orders.selectedProduct.value,
      selectedShippingAddress: this.orders.slectedshipAdd.value,
      selectedManager: this.orders.selectedManager.value,
      selectedClients: this.orders.selectedClients.value,
      client_search: this.orders.client_search,
      manifacture_date: this.orders.mfg_date,
      search: this.params.search,
      pageSize: this.params.pageSize,
      page: this.params.page,
      sortBy: "",
    };

    if (this.orders.mfg_date == "") {
      data.manifacture_date = "";
    } else {
      data.manifacture_date = this.orders.mfg_date;
    }

    if (this.filterApplied) {
      // this.orders.status.map(function (value) {
      //   if (value.selected) {
      //     data.selectedStatus.push(value.id);
      //   }
      // });

      // this.orders.shippingAddress.map(function (value) {
      //   if (value.selected) {
      //     data.selectedShippingAddress.push(value.id);
      //   }
      // });
      // this.orders.productsList.map(function (value) {
      //   if (value.selected) {
      //     data.selectedProducts.push(value.id);
      //   }
      // });
      // this.orders.accountManagerList.map(function (value) {
      //   if (value.selected) {
      //     data.selectedManager.push(value.account_manager);
      //   }
      // });
      // this.orders.organizations.map(function (value) {
      //   if (value.selected) {
      //     data.selectedClients.push(value.id);
      //   }
      // });
      this.orders.expectedDeliveryDate.map(function (value) {
        if (value.selected) {
          data.sortBy = "exp_delivery_date";
        }
      });
    }

    return data;
  }

  clearFilterData() {
    this.showFilter = false;
    this.filterApplied = false;
    this.orders.status.map(function (value) {
      value.selected = false;
    });
    this.orders.shippingAddress.map(function (value) {
      value.selected = false;
    });
    this.orders.productsList.map(function (value) {
      value.selected = false;
    });
    this.orders.expectedDeliveryDate.map(function (value) {
      value.selected = false;
    });
    this.orders.accountManagerList.map(function (value) {
      value.selected = false;
    });
    this.orders.organizations.map(function (value) {
      value.selected = false;
    });
    this.activeState = false;

    this.orders.selectedProduct.setValue([]);
    this.orders.selectedManager.setValue([]);
    this.orders.selectedClients.setValue([]);
    this.orders.slectedshipAdd.setValue([]);
    this.orders.slectedStatus.setValue([]);
    this.orders.selectExpectdate.setValue([]);
    this.params.page = 1;

    // this.orders.selectedClients = new FormControl([]);
    this.orderFilterData();
    this.selectedClientsChipsId = [];
    this.selectedClientsChips = [];
    this.orders.client_search = "";
    this.orders.mfg_date = "";
    this.getOrdersList(true);
    this.saveFiltersData();
    this.showFilter = false;

    // this.getOrganizations();
  }

  datePickerChange() {
    this.showFilter = true;
    this.disableFilter = true;
    this.updateFilter();
  }
  public filterApplied = false;
  applyFilterData() {
    this.filterApplied = true;
    this.params.page = 1;
    // this.searching = true;
    let toast: object;
    toast = { msg: "Filters Applied successfully.", status: "success" };
    this.getOrdersList(true);
    this.snackbar.showSnackBar(toast);
    this.checkboxes.length = 0;
    this.showMergebutton = false;
    this.mergeOrder = [];
    this.saveFiltersData();
    this.updateShowFilter();
    this.pageNumber = !this.pageNumber;
  }

  saveFiltersData() {
    const data = {
      selectedProducts: this.orders.selectedProduct.value,
      selectedManager: this.orders.selectedManager.value,
      selectedClients: this.orders.selectedClients.value,
      created_date: this.orders.mfg_date,
      selectedShippingAddress: this.orders.slectedshipAdd.value,
      selectedStatus: this.orders.slectedStatus.value,
      sortBy: this.orders.selectExpectdate.value,
      client_search: this.params.search,
    };

    localStorage.setItem("Order-Filters", JSON.stringify(data));
  }

  searchOrders(search: string, event?: any): void {
    this.params.search = search;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.getOrdersList(true);
      const savedFilterData = JSON.parse(localStorage.getItem("Order-Filters"));
      if (savedFilterData) {
        savedFilterData["client_search"] = this.params.search;
        localStorage.setItem("Order-Filters", JSON.stringify(savedFilterData));
      } else {
        localStorage.setItem(
          "Order-Filters",
          JSON.stringify({ client_search: this.params.search })
        );
      }
    }, 1000);
  }
  loadMore(event) {
    (this.params.pageSize = event.perPage),
      (this.params.page = event.page),
      this.getOrdersList(true);
  }

  onScroll(): void {
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      this.params.page++;
      this.getOrdersList();
    }
  }
  getclientDocPermissions(): void {
    this.OrdersService.getclientDocPermissions({
      id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
      } else {
      }
    });
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  getOrdersActivityDetails(): void {
    this.OrdersService.getActivtyDetails({
      id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.orders.activityDetails = response.result.data;
      } else {
        this.orders.activityDetails = [];
      }
    });
  }

  generateInvoice() {
    this.invoiceGenerateLoader = true;
    this.clickedGenerateInvoice = true;
    this.OrdersService.generateInvoice({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      this.hideShipperAddress = true;
      this.orders.selectedOrder.orders_types_id = "6";
      this.getInvoiceData();

      this.clickedGenerateInvoice = false;
      this.selectedOrderStatus = "Processing";
    });
  }
  getInvoiceData() {
    this.enableInvoice = true;
    this.getOrdersActivityDetails();
    // this.selectedOrderStatus = 'Processing';

    this.OrdersService.getInvoiceData({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.invoiceGenerateLoader = false;
        this.hideShipperAddress = true;
        this.orders.invoice = response.result.data.Invioce;
        if (response.result.data.Invioce.length) {
          this.batchNum =
            response.result.data.Invioce[0].productsData[0].batch_nbr;
        }
        if (this.batchNum != null) {
          this.batchNumArray = this.batchNum.split(",");
          this.batchNumArray =
            this.batchNumArray && this.batchNumArray.length
              ? this.batchNumArray
              : [];
        }
        this.orders.packageStatus = response.result.data.packageStatus;
        if (
          this.orders.invoice.length &&
          this.orders.invoice[0].Inovice.status == "Paid"
        ) {
          this.disablePayment = true;
        }
        if (this.orders.packageStatus == "2") {
          this.downloadStatus = true;
        } else {
          this.downloadStatus = false;
        }
      }
    });
  }
  checkboxDisable(event) {
    event.preventDefault();
  }

  public checkboxes = [];
  public mergeOrder = [];
  public Chcek;
  public multiActions = false;
  public multiActOrders = [];
  public multiActOrdersId = [];

  MergeOrderCheckbox(data) {
    this.Chcek = data.selceted;

    // this.mergeOrder=data.orders
    if (data.selceted == true) {
      // this.checkboxes.push(data.selceted);
      // this.mergeOrder.push(data.orders);
      // this.showMergebutton = true;
      this.multiActOrdersId.push(data.id);
      this.multiActOrders.push(data);
    } else if (data.selceted === false) {
      // this.checkboxes.splice(data.selceted, 1);
      // this.mergeOrder.splice(data.orders, 1);
      let idIndex = this.multiActOrdersId.findIndex(
        (value) => value == data.id
      );
      this.multiActOrdersId.splice(idIndex, 1);
      this.multiActOrders.splice(idIndex, 1);

      // this.showMergebutton = true;
      // this.multiActions = this.is_aapl;
    }
    // if (this.checkboxes.length > 2 || this.checkboxes.length == 0) {
    //   this.showMergebutton = false;
    // }

    if (this.multiActOrdersId.length < 1) {
      this.multiActions = false;
    } else {
      this.multiActions = true;
    }

    this.isFormValid = this.orders.selectedClients && this.orders.selected;
  }
  ErrorDiaologe(headers?: string, message?: string, button: string = "Close") {
    let dialogRef = this.dialog.open(ErrorDialogComponent, {
      panelClass: "alert-dialog",
      width: "400px",
      data: {
        heading: headers,
        message: message,
        button: button,
        icon: "error",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.onCancleRecordActions();
    });
  }
  conformshipment() {
    this.leadService
      .verifyShipment({
        selected_order_ids: this.multiActOrdersId,
      })
      .then((response) => {
        if (response.result.success) {
          this.createShipment();
        } else {
          this.ErrorDiaologe(
            "Error in Creating Shipment",
            response.result.message
          );
        }
      });
  }
  createShipment() {
    let dialogRef = this.dialog.open(CreateShipmentComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        flag: "Create Shipment",
        orders: this.multiActOrders,
        ordersId: this.multiActOrdersId,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("shipments_id", result.response);
        this.router.navigate([
          `/orders/${this.multiActOrders[0].id}/shipments`,
          result.response,
        ]);
        let toast: object;
        toast = { msg: "Shipment Created Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  Merge() {
    let ClientSlectionId;
    let MergeData = {
      slectedClientsId: [],
      MergeSelectOrders: this.mergeOrder,
    };
    this.orders.organizations.filter((Value) => {
      if (Value.selected) {
        MergeData.slectedClientsId.push(Value);
        ClientSlectionId = Value["selected"];
      }
    });
    if (
      this.showMergebutton &&
      this.Chcek === true &&
      this.checkboxes.length == 2 &&
      ClientSlectionId == true &&
      this.mergeOrder.length == 2
    ) {
      let toast: object;
      let dialogRef = this.dialog.open(MergeOrderComponent, {
        width: "550px",
        data: MergeData,
      });
      this.showMergebutton = true;
      dialogRef.afterClosed().subscribe((result) => {
        if (result.success == true) {
          const config = this.router.config.map((route) =>
            Object.assign({}, route)
          );
          this.router.resetConfig(config);
          this.cookie.set("order_id", result.response);
          // this.router.navigate(['/orders', result.data.id]);
          this.router.navigate(["/orders", result.response || result.data]);

          let toast: object;
          toast = { msg: "Order Created Successfully...", status: "success" };
          this.snackbar.showSnackBar(toast);

          this.orders.organizations.map(function (value) {
            value.selected = false;
          });
        } else if (this.checkboxes.length > 2) {
          this.showMergebutton = false;
          let toast: object;
          // toast = { msg: "zdfsgfg", status: "success" };
          this.snackbar.showSnackBar(toast);
        } else {
          this.showMergebutton = false;
          this.checkboxes.length = 0;
          this.getOrdersList(true);
          this.clearFilterData();
          // this.orders.selectedClient
        }
      });
      // this.mergeOrder.push(MergeData.MergeSelectOrders)
    }
  }
  searchOrganizations() {
    if (this.matSelectOpen) {
      this.param.search = this.clientsFilterCtrl.value;
      this.orderFilterData();
    }
  }
  ProductChange() {
    this.showFilter = true;
  }
  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }

  updateShowFilter() {
    const storedData = localStorage.getItem("Order-Filters");
    if (storedData) {
      const savedFilterData = JSON.parse(localStorage.getItem("Order-Filters"));

      const hasData = Object.values(savedFilterData).some(
        (value) => Array.isArray(value) && value.length > 0
      );

      this.showFilter = hasData ? true : this.orders.mfg_date ? true : false;
    } else {
      this.showFilter = false;
    }
  }
  multiRecordList = [{ name: "Create Joint Invoice", id: 1 }];
  showCompositeComfirmation = false;
  onMulltiRecoredChnage(event: any) {
    let id = event.value;
    if (id == 1) {
      let compositeError = false;
      const firstClientId = this.multiActOrders[0].client_id;

      for (let i = 1; i < this.multiActOrders.length; i++) {
        if (this.multiActOrders[i].client_id !== firstClientId) {
          compositeError = true;
        }
      }
      if (compositeError) {
        let dialogRef = this.dialog.open(ErrorDialogComponent, {
          panelClass: "alert-dialog",
          width: "400px",
          data: {
            heading: "Error in Creating Joint Invoice",
            message: "Please select orders of same Client",
            button: "Close",
            icon: "error",
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.onCancleRecordActions();
        });
      } else {
        this.showCompositeComfirmation = true;
      }
    }
  }
  onCancleRecordActions() {
    this.showCompositeComfirmation = false;
    this.multiActions = false;
    this.multiActOrders = [];
    this.multiActOrdersId = [];

    this.getOrdersList(true);
  }
  creatingComposite: boolean = false;
  onCreateCompositeInvoice() {
    this.creatingComposite = true;
    this.OrdersService.getAddCompositeInvoice({
      order_ids: this.multiActOrdersId,
    }).then((response) => {
      if (response.result.success) {
        this.router.navigate(["/invoices", response.result.data.id]);
        return;
      } else {
        this.creatingComposite = false;

        let dialogRef = this.dialog.open(ErrorDialogComponent, {
          panelClass: "alert-dialog",
          width: "400px",
          data: {
            heading: "Error in Creating Joint Invoice",
            message: response.result.message,
            button: "Close",
            icon: "error",
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.onCancleRecordActions();
        });
      }
    });
  }
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.name : "";
  }
  getShipperAddressName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.address1 : "";
  }
  removeClient(clientId: string, selectedList): void {
    const selectedClients = selectedList.value.filter((id) => id !== clientId);
    selectedList.setValue(selectedClients);
  }

  getManagerName(clientId: string, options): string {
    const client = options.find(
      (client) => client.account_manager === clientId
    );
    return client ? client.account_manager : "";
  }
}
