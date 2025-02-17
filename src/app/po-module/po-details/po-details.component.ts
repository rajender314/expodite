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
import { ViewEncapsulation } from "@angular/core";
import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { OrganizationsService } from "../../services/organizations.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { SnakbarService } from "../../services/snakbar.service";
import { language } from "../../language/language.module";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { ReplaySubject, Subject } from "rxjs";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { log } from "console";
import { CancelPoComponent } from "../../dialogs/cancel-po/cancel-po.component";
import { UtilsService } from "../../services/utils.service";
import { AdminService } from "../../services/admin.service";
declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;

@Component({
  selector: "app-po-details",
  templateUrl: "./po-details.component.html",
  styleUrls: ["./po-details.component.scss"],
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
export class PODetailsComponent implements OnInit {
  public newClientadded = false;
  private App = App;
  public userDetails: any;
  public orderButton: any;
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  isSampleDocs: boolean = false;
  checked: boolean;
  totalSpinner: boolean;
  fetchingData = true;
  downloadStatus: boolean;
  showDrumsList = false;
  filtersLoader = true;
  public icon: boolean = false;
  public postIcon: boolean = false;
  public show: boolean = true;
  public activePayment = false;
  public showNoDatFound = false;
  public concern: boolean = true;
  activeState: boolean;
  editable: boolean;
  editExport: boolean;
  coaShow: any;
  editCoa: boolean;
  concernEditable: boolean;
  shippingActiveState: boolean;
  public selectedOrderStatus: any;
  searching: boolean;
  shippingForm: FormGroup;
  pvmForm: FormGroup;
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
  public acceptbutton: boolean = true;
  displayedColumns = [
    "order_product_id",
    "product_name",
    "p_description",
    "product_quantity",
    "product_uom",
    "product_price",
    "product_price_total",
  ];
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  public enableIcttSave: boolean = false;
  public icttForm: FormGroup;
  public icttItem: FormArray;
  salesDocuments = [];
  toppings = new FormControl();
  paymentType = [];
  public docsList = {
    standardLinks: [
      {
        id: 0,
        name: "Activity",
        selected: true,
        class: "activity",
        function: "moveToActivity",
        imgSrc: this.images.activity_small,
      },
      {
        id: 1,
        name: "Order Details",
        selected: true,
        class: "details",
        function: "moveToDetails",
        imgSrc: this.images.orders_small,
      },
      {
        id: 2,
        name: "Invoice",
        selected: true,
        class: "invoice",
        function: "moveToInvoice",
        imgSrc: this.images.invoice_small,
      },
    ],
  };
  private timestamp: any;
  enableInvoice: boolean = false;
  clickedGenerateInvoice: boolean = false;
  clickedGenerateTaxInvoice: boolean = false;
  clickedGenerateIGSTInvoice: boolean = false;

  showDocuments = false;
  taxInvoiceDocument = true;
  pvm_mark_nos: string = "";
  pvm_pre_carriage_by: string = "";
  pvm_container_no: string = "";
  pvm_lut_arn: string = "";
  pvm_lut_date: string = "";

  public po: any = {
    po_nbr: "",
    po_date: "",
    selectedProducts: [],
    selectedPo: {
      status_id: "",
      po_no: "",
      date_added: "",
      products: [],
      status: "",
      status_color_code: "",
      code: "",
      sub_total: "",
      status_slug: "",
    },
    activityDetails: [],
  };
  public transportModeList = [
    { id: 1, name: "Air" },
    { id: 2, name: "Sea" },
  ];
  public paymentStatus = false;
  public showNotifyAddress = false;
  public CoaDetails = [];
  public reports = {
    batchReportDt: {},
    batchesCoaDt: [],
    batch_id: "",
  };
  private checkOrdersPdf = {
    checkOrders: [],
    checkOrdersId: "",
  };

  public packageDescription;
  data = {
    id: "",
    selectedStatus: [],
    selectedProducts: [],
    search: this.params.search,
    pageSize: this.params.pageSize,
    page: this.params.page,
  };
  private concernData = {
    price: "",
    year1: "",
    year2: "",
    export1: "",
    export2: "",
    domestic1: "",
    domestic2: "",
  };

  public clientsFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public activeTab = "activity";
  reportsFooter: boolean;
  private activateScroll = true;
  public otherDocs = [];
  private param: any = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: "",
  };
  @ViewChild("stepper") stepper: TemplateRef<any>;
  @ViewChild("scrollContainer") scrollContainer: TemplateRef<any>;
  @ViewChild("activity") activity: TemplateRef<any>;
  @ViewChild("details") details: TemplateRef<any>;
  @ViewChild("invoice") invoice: TemplateRef<any>;
  @ViewChild("pfiinvoice") pfiinvoice: TemplateRef<any>;
  @ViewChild("poInvEditInput") poInvEditInput: ElementRef;

  attachments = [];
  pointerEvent: boolean;
  public estimateslanguage = estimate_name;
  public is_ictt = App.env_configurations
    ? App.env_configurations.is_ictt
    : true;
  public is_draft_bl = App.env_configurations
    ? App.env_configurations.is_draft_bl
    : true;
  public is_sso = App.env_configurations ? App.env_configurations.is_sso : true;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  public newClient = false;
  public containerName: any = [];
  public coaCompanyName: any;
  sendDocumentMails: boolean = false;
  adminUser: boolean;
  public zeroErrorQty: boolean;

  editClosed: boolean = false;
  public viewActivityLogIcon: boolean = false;
  editPODescountstate: boolean;


  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.icttForm = new FormGroup({
      icttItem: new FormArray([]),
    });
    this.activatedRoute.params.subscribe((param) => (this.data.id = param.id));
    this.titleService.setTitle(App["company_data"].POTitle);
    this.orderFormCompanyDetails = App["company_data"];
    // this.getViewDetails();
    this.getViewDetails();

    this.userDetails = App.user_details;
    let permission: boolean;
    let profile: boolean;
    let admin_profile: boolean;
    let viewActivityLog: boolean;
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
        case "activity_log":
          if (value.selected === true) {
            viewActivityLog = true;
          } else {
            viewActivityLog = false;
          }
          break;
      }
    });

    this.factoryPermission = true;
    this.clientPermission = profile;
    this.adminUser = admin_profile;
    this.viewActivityLogIcon = viewActivityLog;

    this.downloadStatus = false;
    this.userDetailsType();
    // this.getOrganizations();
    // this.getProductTypesData();
    setTimeout(() => {
      this.getUomData();
    }, 1000);
    this.getPoDocuments();
  }

  public poDocuments = new Map();
  public poDocumentsArr: any = [];
  public dynamicDocLoader = false;
  public docSpinner = false;
  dymanicdocumentdata: any = [];

  getPoDocuments(): void {
    // this.dymanicdocumentdata = [];
    this.docSpinner = true;
    this.poDocuments = new Map();
    this.OrdersService.getPoDocuments({
      id: this.data.id,
      type: "po",
    })
      .then((response) => {
        let data = response.result.data;
        data?.some((item) => {
          if (this.poDocuments.has(item.document_template_types_id)) {
            let itemsArr = this.poDocuments.get(
              item.document_template_types_id
            );
            this.poDocuments.set(item.document_template_types_id, [
              ...itemsArr,
              item,
            ]);
          } else {
            this.poDocuments.set(item.document_template_types_id, [item]);
          }
        });
        this.poDocumentsArr = Array.from(this.poDocuments.keys());
        let concatedArray = [];
        this.poDocuments.forEach((items, key) => {
          concatedArray = concatedArray.concat(items);

          // this.dymanicdocumentdata = this.dymanicdocumentdata.concat(items);
        });
        this.dymanicdocumentdata = [...concatedArray];
        this.dynamicDocLoader = true;
        setTimeout(() => {
          this.docSpinner = false;
        }, 300);
      })
      .catch((error) => console.log(error));
  }
  public removeDocHighlight = false;

  handleDocumentEventId(data) {
    this.activeTab = "";
    this.removeDocHighlight = false;
    if (data) {
      this.moveTotax(data);
    }
  }
  moveTotax(id: number) {
    this.activateScroll = false;

    const element = document.getElementById("invoice-" + id);
    if (
      element &&
      this.scrollContainer &&
      this.scrollContainer["nativeElement"]
    ) {
      this.scrollContainer["nativeElement"].scrollTop = element.offsetTop - 74;
    }

    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  public UomData = [];
  getUomData() {
    this.OrdersService.getUomData({}).then((response) => {
      if (response.result.success) {
        this.UomData = response.result.data;
        this.selectedUom = this.UomData[2].id;
        // this.getPrimaryPackageData();
      }
    });
  }
  public selectedUom;
  public packageData = [];
  public transportMode;
  // getProductTypesData(): void {
  //   this.organizationsService
  //     .getProductsList({ org_id: this.App.user_details.org_id })
  //     .then((response) => {
  //       if (response.result.success) {
  //         this.orders.productsList = response.result.data.productTypesDt;
  //         this.orders.productsList.map(function (value) {
  //           value.selected = false;
  //         });
  //       }
  //     })

  //     .catch((error) => console.log(error));
  //   // console.log(this.orders.productsList);
  // }
  public shipmentType;
  fileUpload() {}
  public showEditIcon = true;
  public disableFreecharge = true;
  public proformaInvData = [];
  public enableProforma = false;
  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }
  getViewDetails(id?: any, type?: any) {
    // this.fetchingData = true;

    this.OrdersService.getViewDetails({
      id: this.data.id,
      type: "po_details",
    }).then(async (response) => {
      if (response.result) {
        if (response.result.data) {
          this.showNoDatFound = false;
          this.fetchingData = false;
          this.proformaInvData = response.result.data;
          this.enableProforma = true;
          this.po.selectedPo = response.result.data;
          this.updatedPoNo = this.po.selectedPo.add_po[0].po_no;
          this.getOrdersActivityDetails();
        } else {
          this.showNoDatFound = true;
        }
      }
    });
  }
  getOrdersActivityDetails(): void {
    this.OrdersService.getEstimateActivtyDetails({
      id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        this.po.activityDetails = response.result.data;
      } else {
        this.po.activityDetails = [];
      }
    });
  }
  cancelAllPO(): void {
    this.editClosed = true;
    let dialogRef = this.dialog.open(CancelPoComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: this.data.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.po.selectedPo.status = "Cancelled";
        this.acceptbutton = false;
        // this.orders.selectedOrder.status == "Cancelled";
        let toast: object;
        toast = {
          msg: " PO Cancelled Successfully.",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.getOrdersActivityDetails();
        this.getViewDetails();
        this.editClosed = false;
      } else {
        let toast: object;
        this.editClosed = false;
        // toast = {
        //   msg: " PO Failed to Cancelled...",
        //   status: "error",
        // };
        // this.snackbar.showSnackBar(toast);
      }
    });
  }

  scrollOrdersContainer(event) {
    if (this.activateScroll) {
      let scrollTop =
        this.scrollContainer &&
        this.scrollContainer["nativeElement"] &&
        this.scrollContainer["nativeElement"].scrollTop
          ? this.scrollContainer["nativeElement"].scrollTop
          : 0;
      let activityTop =
        this.activity &&
        this.activity["nativeElement"] &&
        this.activity["nativeElement"].offsetTop
          ? this.activity["nativeElement"].offsetTop
          : 0;
      let detailsTop =
        this.details &&
        this.details["nativeElement"] &&
        this.details["nativeElement"].offsetTop
          ? this.details["nativeElement"].offsetTop
          : 0;
      let invoiceTop =
        this.invoice &&
        this.invoice["nativeElement"] &&
        this.invoice["nativeElement"].offsetTop
          ? this.invoice["nativeElement"].offsetTop
          : 0;

      let pfiinvoiceTop =
        this.pfiinvoice &&
        this.pfiinvoice["nativeElement"] &&
        this.pfiinvoice["nativeElement"].offsetTop
          ? this.pfiinvoice["nativeElement"].offsetTop
          : 0;
      if (scrollTop <= activityTop) {
        this.activeTab = "activity";
      } else if (
        activityTop < scrollTop &&
        (scrollTop < pfiinvoiceTop || pfiinvoiceTop == 0)
      ) {
        this.activeTab = "pfiinvoice";
      } else if (
        activityTop < scrollTop &&
        (scrollTop < detailsTop || detailsTop == 0)
      ) {
        this.activeTab = "details";
      } else if (
        detailsTop < scrollTop &&
        (scrollTop < invoiceTop || invoiceTop == 0)
      ) {
        this.activeTab = "invoice";
      }
    }
  }
  public paymentSelected;
  moveToActivity() {
    this.activateScroll = false;
    this.activeTab = "activity";
    this.ActivityLog = true;
    this.activity["nativeElement"].show = true;
    if (this.activity && this.activity["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.activity["nativeElement"].offsetTop - 96;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToProfomaInvoice() {
    this.activateScroll = false;
    this.activeTab = "pfiinvoice";
    if (this.pfiinvoice && this.pfiinvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.pfiinvoice["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  public errormes;
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  getclientDocPermissions(): void {
    let id: any;
    id = this.data.id;
    this.OrdersService.getclientDocPermissions({
      estimate_id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        this.isSampleDocs = response.result.data.is_sample_order;
      } else {
      }
    });
  }
  public saveAddLineItem = false;
  backToOrders(stepper: MatStepper) {
    this.router.navigate(["/po"]);
  }

  moveToPFI() {
    this.activateScroll = false;
    this.activeTab = "pfiinvoice";
    if (this.pfiinvoice && this.pfiinvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.pfiinvoice["nativeElement"].offsetTop - 100;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  onUpdateParentData(data?: any) {
    // Update the parent data here
    this.getViewDetails();
    if (this.po.selectedPo?.code === "po_approved") {
      this.moveToPFI();
    }
    // this.getOrdersActivityDetails();
    // You can also perform any other necessary actions based on the updated data
  }
  generatePo(id?: any, type?: any) {
    this.getViewDetails(id, "po_details");
  }
  editDiscount(ev) {
    let toast: object;
    this.editPODescountstate = false;
    this.OrdersService.editNumberingSeries({
      id: this.data.id,
      number_series: this.updatedPoNo,
    }).then(async (response) => {
      if (response.result.success) {
        toast = {
          msg: response.result.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.getViewDetails();
      } else {
        toast = {
          msg: response.result.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  closeEdit() {
    this.editPODescountstate = false;

  }
  public updatedPoNo = ""
  savechangesPO(ev) {
    this.updatedPoNo = ev.target.value;
  }
  editpoQPD() {
    this.editPODescountstate = true;
    setTimeout(() => {
      this.poInvEditInput.nativeElement.focus();
    }, 100);
  }
  getViewDetails2(id?: any, type?: any) {
    // this.fetchingData = true;

    this.OrdersService.getViewDetails({
      id: this.data.id,
      type: "po_details",
    }).then(async (response) => {
      if (response.result) {
        if (response.result.data) {
          this.po.selectedPo = response.result.data;
        } else {
          this.showNoDatFound = true;
        }
      }
    });
  }
}
