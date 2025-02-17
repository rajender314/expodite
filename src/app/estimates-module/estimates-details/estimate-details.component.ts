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
import { OrdersService } from "../../services/orders.service";
import { OrganizationsService } from "../../services/organizations.service";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { FormGroup, FormArray } from "@angular/forms";
import { SnakbarService } from "../../services/snakbar.service";
import { FileUploader } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { MatDatepicker } from "@angular/material/datepicker";
import { trigger, style, transition, animate } from "@angular/animations";
import { AddLineItemComponent } from "../../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../dialogs/delete-line-item/delete-line-item.component";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { CookieService } from "ngx-cookie-service";
import { DeliverOrderComponent } from "../../dialogs/deliver-order/deliver-order.component";
import { EmailDocumentsComponent } from "../../dialogs/email-documents/email-documents.component";
import { Subject } from "rxjs";
import { Lightbox } from "ngx-lightbox";
import { Router, ActivatedRoute } from "@angular/router";
import { CancelEstimateComponent } from "../../dialogs/cancel-estimate/cancel-estimate.component";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { SplitEstimateComponent } from "../../dialogs/split-estimate/split-estimate.component";
import { DescriptionUpload } from "../../dialogs/description/add-description.component";
import { POCreateComponent } from "../../po-module/po-create/po-create.component";
import { OrderActivityLogComponent } from "../../orders-module/order-activity-log/order-activity-log.component";
import { CreatePfiComponent } from "../create-pfi/create-pfi.component";
import { LeadsService } from "../../leads/leads.service";
import { UtilsService } from "../../services/utils.service";
import { OrdersCreateComponent } from "../../orders-module/order-create/order-create.component";
import { AdminService } from "../../services/admin.service";

declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;

@Component({
  selector: "app-estimate-details",
  templateUrl: "./estimate-details.component.html",
  styleUrls: ["./estimate-details.component.scss"],
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
export class EstimateDetailsComponent implements OnInit {
  public disableeditAll = false;
  public newClientadded = false;
  public userDetails: any;
  public orderButton: any;
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean;
  containsMilk: boolean;
  totalCount: any;
  public submitShippingForm: boolean = false;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  isSampleDocs: boolean = false;
  batchNum: string;
  batchNumArray: Array<any>;
  getSdfData: any;
  checked: boolean;
  totalSpinner: boolean;
  private timeout;
  packagePrint: boolean;
  buttonName: boolean;
  packageCompleted: boolean;
  disablePayment = true;
  fetchingData = true;
  fetchOrder: boolean;
  downloadStatus: boolean;
  showDrumsList = false;
  filtersLoader = true;
  public icon: boolean = false;
  public postIcon: boolean = false;
  public show: boolean = true;
  public activePayment = false;
  public showPackage: boolean = true;
  public showShipping: boolean = true;
  public showUom: boolean = true;
  public showMsds: boolean = true;
  public showNonhazardous: boolean = true;
  public showIctt: boolean = true;
  public showSdf: boolean = true;
  public showExportvalue: boolean = true;
  public showDeclaration: boolean = true;
  public showShippers: boolean = true;
  public showAdcsheet: boolean = true;
  public showDeclarationIncentive: boolean = true;
  public showScomatDeclaration: boolean = true;
  public showNoDatFound = false;
  public concern: boolean = true;
  invoiceGenerateLoader: boolean = false;
  noShippingBill = false;
  noShippingExportBill = false;
  noShippingExportDate = false;
  noShippingDate = false;
  activeState: boolean;
  editable: boolean;
  editExport: boolean;
  coaShow: any;
  editCoa: boolean;
  concernEditable: boolean;
  shippingActiveState: boolean;
  public modPoNum: any;
  public showInvoice = true;
  public showTaxInvoice = true;
  public showIgstInvoice = true;
  public showCoa: boolean = true;
  public showOrigin: boolean = true;
  public showinsurance: boolean = true;
  public showAirway: boolean = true;
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
  // priceQuantityDisable: boolean = false;
  containerId: any;
  public showDotTax = false;
  public imagUploadFlag: any;
  public getFileFlag: any;
  public refreshShow = true;
  public enableTaxInvoice: boolean = true;
  public enableIgstInvoice = true;
  public taxInvoiceShow = true;
  public igstInvoiceShow = true;
  confirOrderLoad: boolean = false;
  public incoTermsList = [];
  public icttRows = [];
  public showcreateorder = false;
  public acceptbuttonPfi: boolean;
  public openUploadFile: boolean = false;
  public disableAccept: boolean = false;
  public selectOrder: boolean = false;
  public selectPO: boolean = false;
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
  public icttData = {
    quantity: "",
    net_weight: "",
    gross_weight: "",
    cm: "",
    destination: "",
    country: "",
    vessel_name: "",
    export_address1: "",
    export_address2: "",
    export_country: "",
    export_state: "",
    export_city: "",
    export_postal: "",
    shipping_no: "",
    date_added: "",
    product_name: "",
    items: [],
  };
  public orders = {
    po_no: "",
    selectedProducts: [],
    packageStatus: "",
    data: [],
    status: [],
    shippingAddress: [],
    productsList: [],
    organizations: [],
    shipping_data: [],
    expectedDeliveryDate: [
      {
        id: 1,
        name: "Expected Delivery Date",
        selected: false,
      },
    ],
    selectedClients: new FormControl([]),
    client_search: "",
    mfg_date: "",
    filename: "",
    original_name: "",
    src_name: "",
    selectedOrder: {
      po_suffix: "",
      status_id: "",
      status_color_code: "",
      currency_id: "",
      client_id: "",
      organization_id: "",
      dispatch_date: "",
      po_date: "",
      client_name: "",
      client_image: "",
      date_added: "",
      id: "",
      is_sample_estimate: "",
      estimate_no: "",
      transport: "",
      port_of_loading: "",
      port_of_discharge: "",
      account_manager: "",
      final_destination: "",
      est_alpha_suffix: "",
      image: "",
      po_nbr: "",
      extra_col: [],
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
      delivery_date: "",
      line_item: "",
      discount: 0,
      payment_terms: "",
      other_delivery_terms: "",
    },
    billingAddr: {
      bill_id: "",
      bill_address1: "",
      bill_address2: "",
      bill_countrty: "",
      bill_postal_code: "",
      bill_state: "",
    },
    shippingAddr: {
      ship_id: "",
      ship_address1: "",
      ship_address2: "",
      ship_countrty: "",
      ship_postal_code: "",
      ship_state: "",
    },
    notifyAddr: {
      notify_id: "",
    },
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
    selected: false,
    packageOrders: [],
    packing: [],
    sum: {},
    invoice: [],
    shipping_id: 0,
    mode_transport_ids: [],
    mode_of_transport: [],
    CoaDetails: [],

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
  public sdfFormDates: FormGroup;
  public exportValue = {
    e_shipping_bill_no: "",
    orders_id: this.orders.selectedOrder.id || 0,
    e_entry_date: "",
  };
  public packageDescription;
  data = {
    estimate_id: "",
    selectedStatus: [],
    selectedProducts: [],
    selectedClients: this.orders.selectedClients.value,
    client_search: this.orders.client_search,
    manifacture_date: this.orders.mfg_date,
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
  @ViewChild("stepper") stepper: ElementRef<any>;
  @ViewChild("scrollContainer") scrollContainer: ElementRef<any>;
  @ViewChild("activity") activity: ElementRef<any>;
  @ViewChild("details") details: ElementRef<any>;
  @ViewChild("pfiinvoice") pfiinvoice: ElementRef<any>;
  @ViewChild("createpo") createpo: ElementRef<any>;
  @ViewChild("taxinvoicetab") taxinvoicetab: ElementRef<any>;
  @ViewChild("proinvoicetab") proinvoicetab: ElementRef<any>;
  @ViewChild("Otherdocs") Otherdocs: ElementRef<any>;
  @ViewChild("origin") origin: ElementRef<any>;
  @ViewChild("insurance") insurance: ElementRef<any>;
  @ViewChild("airway") airway: ElementRef<any>;
  @ViewChild("inlineEditInput") inlineEditInput: ElementRef;
  @ViewChild("inlineEditInsurance") inlineEditInsurance: ElementRef;
  @ViewChild("inlineEditFright") inlineEditFright: ElementRef;
  @ViewChild("inlineEditDiscount") inlineEditDiscount: ElementRef;
  @ViewChild("inlineEditLineItem") inlineEditLineItem: ElementRef;
  @ViewChild("quoteDetails") quoteDetails: ElementRef<any>;
  @ViewChild("uploadSalesContract") uploadSalesContract: ElementRef<any>;
  @ViewChild("payments") payments: ElementRef<any>;
  @ViewChild("specification") specification: ElementRef<any>;
  @ViewChild("order") order: ElementRef<any>;
  @ViewChild("acceptQuotation") acceptQuotation: ElementRef<any>;

  @ViewChild("prod_items") prod_items: ElementRef<any>;

  attachments = [];
  originFileAttachments = [];
  insuranceAttachments = [];
  airwayAttachments = [];
  shippingAttachments = [];
  estimatesAttachementas = [];
  pointerEvent: boolean;
  invalidText: boolean;
  uploadError: boolean;
  sizeError: boolean;
  public onLoadFiles = [
    "origin",
    "insuranceFlag",
    "shipping",
    "Bill",
    "landing",
  ];
  public estimateslanguage = estimate_name;

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
  public is_ictt = App.env_configurations
    ? App.env_configurations.is_ictt
    : true;
  public is_pvm_commercial = App.env_configurations
    ? App.env_configurations.is_pvm_commercial
    : true;
  public is_pvm_proforma = App.env_configurations
    ? App.env_configurations.is_pvm_proforma
    : true;
  public is_sealed_report = App.env_configurations
    ? App.env_configurations.is_sealed_report
    : true;
  public is_draft_bl = App.env_configurations
    ? App.env_configurations.is_draft_bl
    : true;
  public is_sso = App.env_configurations ? App.env_configurations.is_sso : true;
  public is_aapl = App.env_configurations
    ? App.env_configurations.is_aapl
    : true;
  // public screenOrientation: any;
  private hasDropZoneOver: boolean = false;
  private uploader: FileUploader = new FileUploader({
    url: this.imageUploadUrl,
    // allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  public newClient = false;
  public containerName: any = [];
  public coaCompanyName: any;
  sendDocumentMails: boolean = false;
  adminUser: boolean;
  public viewActivityLogIcon: boolean = false;
  public viewCreateOrderButton: boolean = false;
  public viewCreatePoButton: boolean = false;
  admin_access: boolean;
  poDate: any;
  coalineItem: any;
  shipperId: any;
  public po_date2 = this.orders.selectedOrder.po_date
    ? this.orders.selectedOrder.po_date
    : "";
  clientsForm: any;
  productsForm: any;
  orderDispatchDate: any;
  conformorderButton: boolean = false;
  removeCancel: any = true;
  editEstimateData: any;
  disableEditEstimate: boolean;
  editEstimateBtn: boolean = false;
  selectAllInProgress: boolean = false;
  removeAdd: any;
  editQty: boolean;
  editPrice: boolean;
  editingProductId: null;
  editingProductIdQ: null;
  updatedValue: any;
  editdescr: any;
  editingDesId: any;
  editfreight: boolean;
  freightvalue: any;
  editinsurancevalue: boolean;
  updatedFreight;
  updatedValueinsurance: any;
  editdescountValue: any;
  editDescountstate: boolean;
  originalPFIInvoiceData: any;
  editaddlineItem: any;
  public getInputValidationTypes = [];
  fileOverBase(event): void {
    this.hasDropZoneOver = event;
  }

  fileDrop(event): void {}
  fileSelected(event): void {}
  setImageUrl() {
    this.imageUploadUrl =
      App.base_url + "addOrderAtt?orders_id=" + this.orders.selectedOrder.id;
    this.uploader.setOptions({ url: this.imageUploadUrl });
  }

  addLineItem(): void {
    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        invoice: this.proformaInvData[0].profInv,
        pannel: "sales-contract",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.orders.invoice = result.response.result.data.Invioce;
      }
    });
  }

  deleteAttachment(index: number, file: any): void {
    this.OrdersService.deleteAttachment({
      id: file.id,
      att_id: file.att_id,
    }).then((response) => {
      if (response.result.success) {
        this.pointerEvent = false;
        this.attachments.splice(index, 1);
      }
    });
  }

  public zeroErrorQty: boolean;
  getFormattedValue(updatedValue, selectedOrderValue) {
    if (typeof updatedValue === "string" && updatedValue.trim() !== "") {
      return updatedValue.replace(/,/g, "");
    }
    if (
      typeof selectedOrderValue === "string" &&
      selectedOrderValue.trim() !== ""
    ) {
      return selectedOrderValue.replace(/,/g, "");
    }
    return updatedValue != null ? updatedValue : selectedOrderValue;
  }
  editFreight(index, event, value) {
    let freightCharges;
    let numberRegex = /[0-9.]/g;
    this.clickedIconId = "freight";
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (value == 0) {
        freightCharges = this.getFormattedValue(
          this.updatedFreight,
          this.proformaInvData[0].subtotal_form[0].totals?.freight.value
        );
        let param = {
          form_data: { ...this.prefillObject, freight: freightCharges },
          organization_id: this.data.estimate_id,

          id: this.proformaInvData[0].subtotal_form[0].id,
          module_id: this.data.estimate_id,
          moduleName: this.moduleName,
        };
        let toast: object;
        this.utilsService.saveStoreAttribute(param).then((res) => {
          if (res.success) {
            this.editfreight = false;
            this.getViewDetails(this.data.estimate_id, "pfi_details");
            toast = {
              msg: "Freight Charges Updated Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          } else {
            this.editfreight = false;
            toast = {
              msg: res.message,
              status: "error",
            };
            this.getViewDetails(this.data.estimate_id, "pfi_details");
            this.snackbar.showSnackBar(toast);
          }
        });
      }
      // }
      // }
    });
    // } else {
    //   return false;
    // }
  }
  canEditFreight(): boolean {
    // Add your condition logic here
    return !(this.selectedOrderStatus === "Cancelled");
  }
  editInsurance(index, event, value) {
    let insurance;
    let va;
    let numberRegex = /[0-9.]/g;
    this.clickedIconId = "insurance";
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (value == 1) {
        insurance = this.getFormattedValue(
          this.updatedValueinsurance,
          this.proformaInvData[0].subtotal_form[0].totals?.insurance.value
        );

        let param = {
          form_data: { ...this.prefillObject, insurance: insurance },
          id: this.proformaInvData[0].subtotal_form[0].id,
          organization_id: this.data.estimate_id,
          module_id: this.data.estimate_id,
          moduleName: this.moduleName,
        };
        let toast: object;
        this.utilsService.saveStoreAttribute(param).then((res) => {
          if (res.success) {
            this.editinsurancevalue = false;
            this.getViewDetails(this.data.estimate_id, "pfi_details");
            toast = {
              msg: " Insurance Updated Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          } else {
            this.editinsurancevalue = false;
            toast = {
              msg: res.message,
              status: "error",
            };
            this.getViewDetails(this.data.estimate_id, "pfi_details");
            this.snackbar.showSnackBar(toast);
          }
        });
      }

      // }
    });
    // } else {
    //   return false;
    // }
  }

  public compnayDetails: any;
  getComapnyDetails() {
    this.organizationsService.getCompanyDetails().then((response) => {
      if (response.result.success) {
        this.compnayDetails = response.result.data;
      }
    });
  }

  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private _lightbox: Lightbox,
    private router: Router,
    private service: LeadsService,
    private utilsService: UtilsService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
    this.getValidationTypes();
    this.icttForm = new FormGroup({
      icttItem: new FormArray([]),
    });
    this.activatedRoute.params.subscribe(
      (param) => (this.data.estimate_id = param.id)
    );
    this.titleService.setTitle(App["company_data"].EstimateTitle);
    this.orderFormCompanyDetails = App["company_data"];
    this.getViewDetails(this.data.estimate_id, "pfi_details");
    // this.getViewDetails(this.data.estimate_id, "pfi_product_details");
    // this.getComapnyDetails();
    this.userDetails = App.user_details;
    let permission: boolean;
    let profile: boolean;
    let admin_profile: boolean;
    let viewActivityLog: boolean;
    let viewCreateOrder: boolean;
    let viewCreatePo: boolean;

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
        case "create_order":
          if (value.selected === true) {
            viewCreateOrder = true;
          } else {
            viewCreateOrder = false;
          }
          break;
        case "create_po":
          if (value.selected === true) {
            viewCreatePo = true;
          } else {
            viewCreatePo = false;
          }
          break;
      }
    });

    this.factoryPermission = true;
    this.clientPermission = profile;
    this.adminUser = admin_profile;
    this.viewActivityLogIcon = viewActivityLog;
    this.viewCreateOrderButton = viewCreateOrder;
    this.viewCreatePoButton = viewCreatePo;

    this.downloadStatus = false;

    this.userDetailsType();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      this.getAddedFiles(this.shipmentType);
      // this.getAttachmentsList();
    };
    this.quotationOrders();
    this.orderPermissions(false);
  }

  public order_Permissions: any = {};

  orderPermissions(notOnInit?: boolean) {
    this.OrdersService.getOrderPermissions({
      id: this.data.estimate_id,
      type: "estimate",
    })
      .then((response) => {
        if (response.result.success) {
          this.order_Permissions = response.result.data;
          // if (notOnInit) this.updatedGetViewDetails("esti", true);
          this.getOrdersActivityDetails();
        }
      })
      .catch((error) => console.log(error));
  }
  updatedGetViewDetails(arg0: string, arg1: boolean) {
    throw new Error("Method not implemented.");
  }

  async getValidationTypes() {
    await this.service.getValidationTypes().then((res) => {
      if (res.result && res.result.success) {
        this.getInputValidationTypes = res.result.data;
      }
    });
  }

  /** PVM feature Inco Terms */

  public selectedUom;
  editformSdf() {
    if (!this.editable) {
      this.editable = true;
    } else {
      this.editable = false;
    }
  }
  public primaryPackageData = [];
  public disabledSave = false;

  deliverOrder(): void {
    //   console.log(1)
    let dialogRef = this.dialog.open(DeliverOrderComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      height: "300px",
      data: {
        id: this.orders.selectedOrder.id,
        flag: this.selectedOrderStatus,
        disableClose: true,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.selectedOrderStatus = "Delivered";
        // this.getOrdersActivityDetails();
        this.disablePayment = true;
        this.orders.selectedOrder.orders_types_id = "4";
      }
    });
  }
  sendMails(data?: any): void {
    let dialogRef = this.dialog.open(EmailDocumentsComponent, {
      panelClass: "alert-dialog",
      width: "640px",
      data: {
        order_id: this.orders.selectedOrder.id,
        invoice_id: this.orders.invoice.length
          ? this.orders.invoice[0].Inovice.id
          : "",
        other_docs: this.attachments,
        uom_id: this.selectedUom,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
      }
    });
  }

  orderDownload() {
    let toast: object;
    toast = {
      msg: "The documents are being processed, Download will begin shortly...",
      status: "success",
    };
    this.snackbar.showSnackBar(toast);
    let params = {
      id: this.orders.selectedOrder.id,
      invoice_id: this.orders.invoice[0].Inovice.id,
      uom_id: this.selectedUom,
    };
    this.OrdersService.exportOrdersPdf(params).then((response) => {
      if (response.result.success) {
        if (response.result.data) {
          let downloadPath = response.result.data;
          window.open(downloadPath, "_blank");
        }
      } else {
        toast = { msg: "Error in Downloading documents.", status: "error" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  public packageData = [];
  public transportMode;
  selectShipping() {
    this.shippingActiveState = true;
  }
  selectShippingMode(transportName) {
    this.transportMode = transportName.name;
    this.shippingActiveState = true;
  }

  public shipmentType;
  setAddedFilesUrl(flag) {
    if (flag == "sales") {
      this.imagUploadFlag = "sales";
      this.shipmentType = flag;
    }
    this.uploader.setOptions({
      url:
        App.base_url +
        "addFiles?orders_id=" +
        this.orders.selectedOrder.id +
        "&type=" +
        this.imagUploadFlag,
    });
  }

  fileUpload() {}
  public showEditIcon = true;
  public disableFreecharge = true;
  generateInvoice(name: any) {
    this.invoiceGenerateLoader = true;
    this.clickedGenerateInvoice = true;
    this.totalSpinner = true;
    this.OrdersService.generateInvoice({
      estimate_id: this.orders.selectedOrder.id,
      is_proforma_inv: name,
    }).then((response) => {
      this.hideShipperAddress = true;
      this.totalSpinner = false;
      this.orders.selectedOrder.orders_types_id = "6";
      this.clickedGenerateInvoice = false;
      this.selectedOrderStatus = "Processing";

      if (this.packageData.length) {
        // this.addAllPackage();
      }
    });
  }

  public clickedProformaInvoice = false;
  generateProformaInvoice(name: any) {
    this.invoiceGenerateLoader = true;
    this.clickedProformaInvoice = true;
    this.totalSpinner = true;
    let params = {
      estimate_id: this.orders.selectedOrder.id,
    };
    if (this.enableInvoice) {
      params["placement"] = 2;
    } else {
      params["placement"] = 1;
    }
    this.OrdersService.generateProfInv(params).then((response) => {
      this.hideShipperAddress = true;
      this.totalSpinner = false;
      this.orders.selectedOrder.orders_types_id = "6";
      this.getProformaInvoiceData();

      this.clickedProformaInvoice = false;
      this.selectedOrderStatus = "Processing";
    });
  }
  public proformaInvData = [];
  public enableProforma = false;
  public inv_placement;
  public invoiceproducts = [];
  public disablecreateorder: boolean = false;
  getProformaInvoiceData(editEstimate?: boolean) {
    // this.enableProforma = true;
    // this.getOrdersActivityDetails();
    // this.selectedOrderStatus = 'Processing';

    this.OrdersService.getProfInv({
      estimate_id: this.orders.selectedOrder.id,
    }).then((response) => {
      // console.log();

      if (response.result.data.length) {
        this.invoiceGenerateLoader = false;
        this.hideShipperAddress = true;
        this.enableProforma = true;
        // response.result.data[0].productsData.forEach((product) => {
        //   product.seleted = false;
        // });
        this.proformaInvData = response.result.data;

        this.editEstimateData = response.result.data[0];
        if (editEstimate) {
          this.openEditEstimateDialog("Edit");
        }
        this.proformaInvData[0].productsData.forEach((element) => {
          element.seleted = false;
        });
        this.originalPFIInvoiceData = JSON.parse(
          JSON.stringify(this.proformaInvData)
        );
        this.removeCancel = this.proformaInvData[0].productsData.some(
          (prodt) => {
            if (prodt.is_order_created) {
              return true;
            } else {
              return false;
            }
          }
        );
        this.removeAdd = this.proformaInvData[0].productsData.some((prodt) => {
          if (!prodt.is_order_created) {
            return true;
          } else {
            return false;
          }
        });

        // this.proformaInvData[0].profInv.discount_value = Math.round((this.proformaInvData[0].profInv.discount_value + Number.EPSILON) * 100) / 100
        let invoiceTotal = [];
        this.invoiceProducts = this.proformaInvData[0].productsData.filter(
          function (val: any) {
            if (val["seleted"]) {
              invoiceTotal.push(val);
              return true;
            } else {
              return false;
            }
          }
        );

        this.invoiceproducts = invoiceTotal;
        if (this.invoiceproducts.length == 0) {
          this.disablecreateorder = true;
        }
        this.inv_placement = this.proformaInvData[0].profInv.placement;
      } else {
        this.editEstimateBtn = false;
      }
    });
  }

  paidInvoice() {
    let dialogRef = this.dialog.open(MarkAsPaidComponent, {
      width: "550px",
      data: "",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.OrdersService.invoiceStatus({
          id: this.orders.invoice[0].Inovice.id,
        }).then((response) => {
          if (response.result.success) {
            this.paymentStatus = true;
            this.orders.invoice[0].Inovice.status = "Paid";
            this.added = true;
            this.disablePayment = true;
            this.getProformaInvoiceData();
            this.getTaxInv();
            let toast: object;
            toast = { msg: "Paid Successfully...", status: "success" };
            this.snackbar.showSnackBar(toast);
          }
        });
      }
    });
  }

  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }
  public productDetails = "";
  public acceptbutton: boolean;
  public po_nbr;

  setPvmForm(orderDetails: any) {
    this.pvmForm.patchValue({
      pre_carriage_by: "",
      mark_nos: "",
      container_no: "",
      scheme: "",
    });
  }

  getAttachmentsList() {
    //   console.log(256556)
    this.OrdersService.getAttachmentsList({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.attachments = response.result.data.OrdersAtt;
        this.downloadStatus = response.result.data.dwmStatus;
      } else {
        this.attachments = [];
      }
    });
  }
  getAddedFiles(flag) {
    if (flag == "sales") {
      this.getFileFlag = "sales";
    }

    this.OrdersService.getoriginFileAttachments({
      id: this.orders.selectedOrder.id,
      type: this.getFileFlag,
      order_type: false,
    }).then((response) => {
      if (response.result.success) {
        response.result.data.OrdersAtt.forEach((element) => {
          element.src = "";

          if (element.link_url.lastIndexOf(".pdf") > -1) {
            element.src = this.images.pdf_download;
          } else if (
            element.link_url.lastIndexOf(".doc") > -1 ||
            element.link_url.lastIndexOf(".docx") > -1 ||
            element.link_url.lastIndexOf(".xlsx") > -1
          ) {
            // element.link_url = 'https://expodite.enterpi.com/storage/app/public/uploads/AddedFiles/1603190571.xlsx';
            // element.src = 'http://docs.google.com/gview?url='+ element.link_url +'&embedded=true';
          } else {
            element.src = element.link_url;
          }
        });
        if (flag == "origin") {
          this.originFileAttachments = response.result.data.OrdersAtt;
        }
        if (flag == "insuranceFlag") {
          this.insuranceAttachments = response.result.data.OrdersAtt;
        }
        if (flag == "shipping") {
          this.shippingAttachments = response.result.data.OrdersAtt;
        } else if (flag == "landing") {
          this.airwayAttachments = response.result.data.OrdersAtt;
        } else if (flag == "estimates") {
          this.estimatesAttachementas = response.result.data.OrdersAtt;
        } else if (flag == "sales") {
          this.salesDocuments = response.result.data.OrdersAtt;
          this.salesDocuments.map((x) => {});
        }
      } else {
        this.originFileAttachments = [];
      }
    });
  }
  getOrdersActivityDetails(): void {
    this.OrdersService.getEstimateActivtyDetails({
      id: this.data.estimate_id,
    }).then((response) => {
      if (response.result.success) {
        this.orders.activityDetails = response.result.data;
      } else {
        this.orders.activityDetails = [];
      }
    });
  }

  public allowProductEditing = true;

  getIcttData(): void {
    this.OrdersService.getIcttData({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        var data = response.result.data;
        this.icttData = {
          quantity: data.quantity,
          net_weight: data.net_weight,
          gross_weight: data.gross_weight,
          cm: data.cm,
          destination: data.destination,
          country: data.country,
          vessel_name: data.vessel_name,
          export_address1: data.export_address1,
          export_address2: data.export_address2,
          export_country: data.export_country,
          export_state: data.export_state,
          export_city: data.export_city,
          export_postal: data.export_postal,
          shipping_no: data.shipping_no,
          date_added: data.date_added,
          product_name: data.product_name,
          items: data.items,
        };
        this.setIcttForm(data.items);
      }
    });
  }
  deleteLineItemAccess(index: any) {
    this.orders.invoice[0].Inovice.extra_col.splice(index, 1);
    let param = Object.assign({}, this.orders.invoice[0].Inovice);
    this.OrdersService.generateInvoice(param).then((response) => {
      this.orders.invoice = response.result.data.Invioce;
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
  public showProfInvoice = true;
  public printProfInvoice = true;
  toggleProformaInvoice() {
    this.showProfInvoice = !this.showProfInvoice;
    this.printProfInvoice = !this.printProfInvoice;
  }
  public showProducts = true;
  toggleProdItems() {
    this.showProducts = !this.showProducts;
  }
  deleteLineItem(index: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.deleteLineItemAccess(index);
      }
    });
  }
  checkboxDisable(event) {
    event.preventDefault();
  }
  cancelAllOrder(): void {
    let dialogRef = this.dialog.open(CancelEstimateComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: this.orders.selectedOrder.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.orders.selectedOrder.orders_types_id = "4";
        this.selectedOrderStatus = "Cancelled";
        this.orders.selectedOrder.status == "Cancelled";
        let toast: object;
        toast = {
          msg: this.estimateslanguage + " Cancelled Successfully.",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        // this.getOrdersActivityDetails();
        this.orderPermissions(false);
        this.getViewDetails(this.data.estimate_id, "pfi_details");
      }
    });
    // this.closeConverionRate();
  }
  public batchshow = false;

  public taxInvoiceData: any;
  getTaxInv() {
    this.OrdersService.getTaxInv({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.taxInvoiceData = response.result.data;
      }
    });
  }
  igstInvoiceData: any;
  getIgstInv() {
    this.OrdersService.getIgstInv({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.igstInvoiceData = response.result.data;
      }
    });
  }
  getShippingAddressDetails(): void {
    this.OrdersService.getShippingDetails({
      invoice_id: this.orders.invoice.length
        ? this.orders.invoice[0].Inovice.id
        : "",
    }).then((response) => {
      if (response.result.success) {
        if (response.result.data.shipDt && response.result.data.shipDt.id) {
          this.orders.shipping_id = response.result.data.shipDt.id;
          this.orders.shipping_data = response.result.data.shipDt;
          this.setShippingAddressForm(response.result.data.shipDt);
          this.disableCancel = true;
          this.editShipping = true;
          this.selectedOrderStatus = "In-transit";
          this.downloadStatus = true;
          this.disablePayment = true;
          if (this.orders.selectedOrder.orders_types_id == "4") {
            this.selectedOrderStatus = "Delivered";
          }
        } else {
          this.editShipping = true;
          this.disableCancel = false;
        }
        this.orders.mode_transport_ids = response.result.data.modeTransportDt;
        this.orders.mode_of_transport = response.result.data.transportType;
      }
      // this.disableCancel = true;
    });
  }
  setShippingAddressForm(data: any): void {
    this.shippingForm.patchValue({
      aws_number: data.shipping_id,
    });
    this.shippingForm.patchValue({
      terms: data.terms,
    });
    this.shippingForm.patchValue({
      mode_transport_id: data.mode_transport_id,
    });
    this.shippingForm.patchValue({
      transport_mode: data.transport_mode,
    });
    this.shippingForm.patchValue({
      bol_number: data.bol_id,
    });
    this.shippingForm.patchValue({
      road_number: data.bol_id,
    });
    this.shippingForm.patchValue({
      pre_carrier_place: data.pre_carrier_place,
    });
    this.shippingForm.patchValue({
      loading_port: data.loading_port,
    });
    this.shippingForm.patchValue({
      discharge_port: data.discharge_port,
    });
    this.shippingForm.patchValue({
      transport_vehicle_no: data.transport_vehicle_no,
    });
    this.shippingForm.patchValue({
      frieght_type: data.frieght_type,
    });
  }
  // scrollOrdersContainer(event: Event) {
  //   if (!this.activateScroll) return;

  //   // Get current scroll position
  //   const scrollTop = this.scrollContainer?.nativeElement?.scrollTop || 0;

  //   // Get offsets for each section
  //   const activityTop = this.activity?.nativeElement?.offsetTop || 0;
  //   const quoteDetailTop = this.quoteDetails?.nativeElement?.offsetTop || 0;
  //   const itemsTop = this.prod_items?.nativeElement?.offsetTop || 0;
  //   const paymentTop = this.payments?.nativeElement?.offsetTop || 0;
  //   const specificationTop = this.specification?.nativeElement?.offsetTop || 0;
  //   const acceptQuotationTop =
  //     this.acceptQuotation?.nativeElement?.offsetTop || 0;
  //   const orderTop = this.order?.nativeElement?.offsetTop || 0;
  //   const uploadSalesContractTop =
  //     this.uploadSalesContract?.nativeElement?.offsetTop || 0;

  //   // Determine the active tab based on scroll position
  //   if (scrollTop <= activityTop) {
  //     this.activeTab = "activity";
  //   } else if (scrollTop > activityTop && scrollTop < quoteDetailTop) {
  //     this.activeTab = "quoteDetails";
  //   } else if (scrollTop >= quoteDetailTop && scrollTop < itemsTop) {
  //     this.activeTab = "prod_items";
  //   } else if (scrollTop >= itemsTop && scrollTop < paymentTop) {
  //     this.activeTab = "payments";
  //   } else if (scrollTop >= paymentTop && scrollTop < specificationTop) {
  //     this.activeTab = "specification";
  //   } else if (
  //     scrollTop >= specificationTop &&
  //     scrollTop < acceptQuotationTop
  //   ) {
  //     this.activeTab = "acceptQuotation";
  //   } else if (scrollTop >= acceptQuotationTop && scrollTop < orderTop) {
  //     this.activeTab = "order";
  //   } else if (scrollTop >= orderTop) {
  //     this.activeTab = "uploadSalesContract";
  //   }
  // }
  scrollOrdersContainer(event: Event) {
    if (!this.activateScroll) return;

    // Get current scroll position
    const scrollTop = this.scrollContainer?.nativeElement?.scrollTop + 74 || 0;

    // Get offsets for each section
    const activityTop = this.activity?.nativeElement?.offsetTop || 0;
    const quoteDetailTop = this.quoteDetails?.nativeElement?.offsetTop || 0;
    const itemsTop = this.prod_items?.nativeElement?.offsetTop || 0;
    const paymentTop = this.payments?.nativeElement?.offsetTop || 0;
    const specificationTop = this.specification?.nativeElement?.offsetTop || 0;
    const acceptQuotationTop =
      this.acceptQuotation?.nativeElement?.offsetTop || 0;
    const orderTop = this.order?.nativeElement?.offsetTop || 0;
    const uploadSalesContractTop =
      this.uploadSalesContract?.nativeElement?.offsetTop || 0;

    // Determine the active tab based on scroll position
    if (scrollTop <= activityTop) {
      this.activeTab = "activity";
    } else if (scrollTop < quoteDetailTop) {
      this.activeTab = "quoteDetails";
    } else if (scrollTop < itemsTop) {
      this.activeTab = "prod_items";
    } else if (scrollTop < paymentTop) {
      this.activeTab = "payments";
    } else if (scrollTop < specificationTop) {
      this.activeTab = "specification";
    } else if (scrollTop < acceptQuotationTop) {
      this.activeTab = "acceptQuotation";
    } else if (scrollTop < orderTop) {
      this.activeTab = "order";
    } else if (scrollTop < uploadSalesContractTop) {
      this.activeTab = "uploadSalesContract";
    } else {
      this.dymanicdocumentdata.forEach((item, index) => {
        const element = document.getElementById("invoice-" + item.id);
        const prvElement =
          index > 0
            ? document.getElementById(
                "invoice-" + this.dymanicdocumentdata[index - 1]?.id
              )
            : null;

        if (!element) return;

        const elementTop = element.offsetTop || 0;
        const prvElementTop = prvElement?.offsetTop || 0;

        if (index === 0 && scrollTop < elementTop) {
          this.activeTab = item.type;
        } else if (prvElementTop < scrollTop && scrollTop < elementTop) {
          this.activeTab = item.type;
        }
      });
    }
  }

  enableSave(event: any): void {
    this.activePayment = true;
  }
  moveToActivity() {
    this.activateScroll = false;
    this.removeDocHighlight = true;
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
  moveToQuotationDetails(inputName) {
    this.removeDocHighlight = true;
    const inputElement = this[inputName as keyof this] as any;
    this.activateScroll = false;
    this.activeTab = inputName;
    if (inputElement && inputElement.nativeElement.offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        inputElement.nativeElement.offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToPayments() {
    this.activateScroll = false;
    this.removeDocHighlight = true;
    this.activeTab = "payments";
    if (this.payments && this.payments["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.payments["nativeElement"].offsetTop - 74;
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
    id = this.orders.selectedOrder.id;
    this.OrdersService.getclientDocPermissions({
      estimate_id: this.data.estimate_id,
    }).then((response) => {
      if (response.result.success) {
        this.isSampleDocs = response.result.data.is_sample_order;
      } else {
      }
    });
  }
  backToOrders(stepper: MatStepper) {
    this.router.navigate(["/estimates"]);
  }
  bigImg(x) {
    x.style.color = "red";
  }

  acceptOrder(event: any): void {
    event.target.disabled = true;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: 2,
    }).then((response) => {
      this.orders.selectedOrder.orders_types_id = "2";
      this.selectedOrderStatus = "Accepted";
      if (this.isSampleDocs) {
        // this.disableFreecharge = false;
        // this.generateInvoice('true')
      }
      // this.getOrdersActivityDetails();
    });
  }

  deleteUploads(file, i, flag) {
    this.OrdersService.deleteFileAttachments({
      id: file.id,
      att_id: file.att_id,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: "File deleted successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
        if (flag == "origin") {
          this.originFileAttachments.splice(i, 1);
        } else if (flag == "insurance") {
          this.insuranceAttachments.splice(i, 1);
        } else if (flag == "shipping") {
          this.shippingAttachments.splice(i, 1);
        } else if (flag == "sales") {
          this.salesDocuments.splice(i, 1);
        } else {
          this.airwayAttachments.splice(i, 1);
        }
      }
    });
  }
  public editDescription = false;
  public showPackageSavePanel = false;
  valChanged(event) {
    this.showPackageSavePanel = true;
    this.packageDescription = event.target.value;
  }
  descriptionEdit() {
    this.editDescription = true;
  }
  editPackageDescription() {
    let param = {
      id: this.data.estimate_id,
      description: this.packageDescription,
    };
    this.OrdersService.updateOrdersPackage(param).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = {
          msg: "Package details updated successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.showPackageSavePanel = false;
        this.editDescription = false;
      } else {
        let toast: object;
        toast = { msg: "Failed To Update", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  openPreview(file, i: number, flag): void {
    // this.closeConverionRate();
    if (flag === "product_image") {
      let imgObj = {
        src: file,
        thumb: "name",
      };
      this._lightbox.open([{ ...imgObj }], 0);
    } else if (
      file.link_url.lastIndexOf(".pdf") == -1 &&
      file.link_url.lastIndexOf(".doc") == -1 &&
      file.link_url.lastIndexOf(".docx") == -1 &&
      file.link_url.lastIndexOf(".xlsx") == -1
    ) {
      if (flag == "origin") {
        this._lightbox.open(this.originFileAttachments, i);
      } else if (flag == "insurance") {
        this._lightbox.open(this.insuranceAttachments, i);
      } else if (flag == "shipping") {
        this._lightbox.open(this.shippingAttachments, i);
      } else if (flag == "estimates") {
        this._lightbox.open(this.estimatesAttachementas, i);
      } else if (flag == "sales") {
        this._lightbox.open(this.salesDocuments, i);
      } else {
        this._lightbox.open(this.airwayAttachments, i);
      }
    } else {
      let dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: "850px",
        data: file,
      });
    }
  }
  downloadFile(file, i, flag) {
    var downloadUrl =
      App.base_url +
      "downloadFile?link_url=" +
      file.link_url +
      "&original_name=" +
      file.original_name;
    window.open(downloadUrl, "_blank");
  }

  addRows(value?) {
    this.icttItem = this.icttForm.get("icttItem") as FormArray;
    this.enableIcttSave = true;
  }

  cancelIctt() {
    this.enableIcttSave = false;
  }
  updateTotalAmount() {
    this.orders.productsData.data.reduce((total, item) => {
      if (item["seleted"] === true) {
        return total + item["price"];
      }
      return total;
    }, 0);
  }

  public checkedArr = [];
  public Totall;
  checkBoxProduct(data: any): void {
    this.orders.selectedProducts = [];
    let productValue = [];
    let reduceValue;
    let amount: any;
    // data.seleted=!data.seleted

    this.checkedArr = this.orders.productsData.data.filter(function (val: any) {
      if (val["seleted"]) {
        productValue.push(val);
        return true;
      } else {
        return false;
      }
    });
    let value = this.orders.selectedOrder["total_amount"];
    let reduceAmount;
    // let Totall
    if (!data.seleted) {
      reduceAmount = Number(value) - data["product_price_total"];
      this.Totall = Number(reduceAmount);
      let strin1 = reduceAmount.toString();
      // console.log(strin1)
      this.orders.selectedOrder["total_amount"] = strin1;
    }

    if (data.seleted) {
      // reduceAmount= Number(value)-data['product_price_total']
      let Add = this.Totall + Number(data["product_price_total"]);
      let strin1 = Add.toString();
      this.orders.selectedOrder["total_amount"] = strin1;
    }

    this.checkedArr = productValue;
  }
  public invoiceProducts: any = [];
  //aapl inovice to create order
  public rowIds = [];
  checkBoxProductInvoice(data: any): void {
    this.rowIds = data;
    // if (!this.selectAllInProgress) {
    this.orders.selectedProducts = [];
    // this.closeConverionRate();
    const { invoice } = this.orders;
    const { sub_total: invoice_total } =
      this.proformaInvData[0].create_estimate;

    this.invoiceProducts = data;

    this.disablecreateorder = this.invoiceProducts.length === 0;

    this.selectAllChecked = !this.productsRowData
      .filter((item) =>
        this.selectPO
          ? !item.is_order_created && !item.is_po_created
          : !item.is_order_created
      )
      .some((item) => {
        if (!item.seleted) {
          return true;
        }
        return false;
      });
  }

  selectAllChecked: boolean = false;
  selectAllProducts(): void {
    this.selectAllInProgress = true;
    let productValue: any[] = [];
    if (this.selectPO) {
      this.invoiceProducts = this.productsRowData.forEach((product) => {
        if (!product.is_po_created && !product.is_order_created) {
          product.seleted = this.selectAllChecked;
        }
      });
    } else {
      this.invoiceProducts = this.productsRowData.forEach((product) => {
        if (!product.is_order_created) {
          product.seleted = this.selectAllChecked;
        }
      });
    }
    // this.invoiceProducts = this.proformaInvData[0].productsData.filter(
    //   (product) => {
    //     return !product.is_order_created && !product.is_po_created;
    //   }
    // );

    this.invoiceProducts = this.productsRowData.filter((val: any) => {
      if (!val.seleted) {
        productValue.push(val);
        return false;
      } else {
        return true;
      }
    });
    this.selectAllInProgress = false;
    this.disablecreateorder = this.invoiceProducts.length === 0;
  }

  public orderFaildedMsg = "";
  createOrderApi() {
    this.confirOrderLoad = true;
    this.OrdersService.createOrder({
      estimate_id: this.orders.selectedOrder.id,
      client: this.orders.selectedOrder.client_name,
      company_shipping_id: this.orders.shippingAddr.ship_id,
      org_address_bill_id: this.orders.billingAddr.bill_id,
      org_notify_addr_id: this.orders.notifyAddr.notify_id,
      clien_id: this.orders.selectedOrder.client_id,
      special_instructions: this.orders.selectedOrder.special_instructions,
      organization_id: this.orders.selectedOrder.organization_id,
      po_nbr: this.orders.po_no,
      po_date: this.poDate,
      email: this.proformaInvData[0].profInv.email,
      phone: this.proformaInvData[0].profInv.phone,
      ext: this.proformaInvData[0].profInv.ext,
      kindAttn: this.proformaInvData[0].profInv.kindName,
      delivery_date: this.orders.selectedOrder.delivery_date,
      dispatch_date: this.orders.selectedOrder.dispatch_date,
      productArr:
        this.checkedArr.length !== 0
          ? this.checkedArr
          : this.orders.productsData.data,
      filename: this.orders.filename,
      original_name: this.orders.original_name,
      src_name: this.orders.src_name,
      client_new: this.newClient ? true : false,
      is_sample_estimate: this.orders.selectedOrder.is_sample_estimate,
      discount: this.orders.selectedOrder.discount,
    }).then((response) => {
      if (response.result.success) {
        this.confirOrderLoad = false;
        this.orderFaildedMsg = "";
        this.router.navigate(["/orders", response.result.data.id]);
        let toast: object;
        toast = { msg: "order Created Successfully...", status: "success" };
        //   let reloadPage = true;
        //   if(reloadPage){

        //   }
      } else {
        this.orderFaildedMsg = "Failed to create order";
      }
    });
  }

  saveIcttData() {
    let itemsArr = this.icttItem.value.length ? this.icttItem.value : [];
    let param = {
      orders_id: this.orders.selectedOrder.id,
      items: itemsArr,
    };

    this.OrdersService.saveIcttData(param).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: "ICTT Items updated successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
        let toast: object;
        toast = { msg: "Failed To Update", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  deleteRow(index) {
    this.icttItem.removeAt(index);
    // if(this.icttItem.length ==1) {
    //   // this.toastr.error("Can't delete the row when there is only one row", 'Warning');
    //   let toast: object;
    //   toast = { msg: "Can't delete the row when there is only one row", status: 'error' };
    //   this.snackbar.showSnackBar(toast);
    //   return false;
    // } else {
    //     this.icttItem.removeAt(index);
    //     // this.toastr.warning('Row deleted successfully', 'Delete row');
    //     return true;
    // }
  }

  removeCommasFromArray(data, keysToRemoveCommas) {
    data.forEach((obj) => {
      keysToRemoveCommas.forEach((key) => {
        if (
          obj.hasOwnProperty(key) &&
          typeof obj[key] === "string" &&
          obj[key].includes(",")
        ) {
          obj[key] = obj[key].replace(/,/g, "");
        }
      });
    });
    return data;
  }
  createOrderInovice() {
    if(this.order_Permissions.show_numbering_error) {
      return ;
    }
    let prodIds = [];
    let arr = [];
    arr.push({ id: this.orders.selectedOrder.id });
    let toast: object;
    let dialogRef = this.dialog.open(OrdersCreateComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        orders: arr,
        ordersId: [this.data.estimate_id],
        title: "Create",
        flag: "override",
        getInputValidationTypes: this.getInputValidationTypes,
        type: "edit",
        estimate_id: this.data.estimate_id,
        add_line_items: this.proformaInvData[0]?.add_line_items || "",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result);
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

  setIcttForm(data) {
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addRows(value);
      });
    }
  }
  ChangeInvoiceiInsurance() {}
  splitProducts;
  splitEstimate(data: any) {
    this.closeConverionRate();
    this.disableeditAll = false;
    const {
      selectedOrder: { total_quantity },
    } = this.orders;
    const selctedItem = this.originalPFIInvoiceData[0].productsData.filter(
      (p) => p.order_product_id === data.order_product_id
    );
    const { estimateid } = data.estimate_id;
    const { product_quantity } = data.product_quantity;
    const { order_product_id } = data.order_product_id;
    let toast: object;
    let dialogRef = this.dialog.open(SplitEstimateComponent, {
      panelClass: "alert-dialog",
      width: "300px",
      data: {
        quantity:
          // this.editingProductIdQ
          data.quantity,
        // : data.product_quantity,
        estimate_id: data.estimate_id,
        order_product_id: data.order_product_id,
      },
      // data: newObject,

      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.selectPO = false;
        this.getProformaInvoiceData();
        this.router.resetConfig(config);
        this.cookie.set("estimate_id", result.response);
        // this.router.navigate(["/estimates", result.response]);
        let toast: object;
        // toast = { msg: "Successfully...", status: "success" };
        // this.snackbar.showSnackBar(toast);
      }
    });
  }
  generateInvoiceApi() {
    this.OrdersService.generateInvoice({
      orders_id: 0,
      is_proforma_inv: false,
      estimate_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = {
          msg: this.estimateslanguage + " Accepted Successfully...",
          status: "success",
        };
      } else {
        let toast: object;
        toast = {
          msg: this.estimateslanguage + " Updated  failed...",
          status: "error",
        };
      }
    });
  }
  public enableUpload = false;
  updateEstimateSatus() {
    this.closeConverionRate();
    this.disableAccept = true;
    this.totalSpinner = true;
    this.OrdersService.updateEstimateApi({
      // estimate_id: this.orders.selectedOrder.id,
      // status_id: 2,
      id: this.orders.selectedOrder.id,
      type: "pfi_accepted",
    }).then((response) => {
      if (response.result.success) {
        this.totalSpinner = false;
        // this.generateInvoiceApi();
        this.setMinimizeAll();
        this.orderPermissions(false);
        this.getViewDetails(this.data.estimate_id, "pfi_details");
        // this.getOrdersActivityDetails();
        let toast: object;
        this.selectedOrderStatus = response.result.data.name;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orders.selectedOrder.status = response.result.data.name;
        this.disableAccept = false;
        toast = {
          msg: this.estimateslanguage + " Accepted Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.enableUpload = true;
      } else {
        this.disableAccept = false;
      }
    });
  }
  acceptPfi() {
    this.openUploadFile = true;
    this.closeConverionRate();
    this.disableAccept = true;
    this.totalSpinner = true;
    this.OrdersService.acceptQuotation({
      id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.getViewDetails(this.data.estimate_id, "pfi_details");
        // this.getOrdersActivityDetails();
        let toast: object;
        this.selectedOrderStatus = response.result.data?.name;
        this.orders.selectedOrder.status_id = response.result.data?.id;
        this.orders.selectedOrder.status_color_code =
          response.result.data?.color_code;
        this.orders.selectedOrder.status = response.result.data?.name;
        this.disableAccept = false;
        toast = {
          msg: this.estimateslanguage + " Accepted Successfully...",
          status: "success",
        };
        this.totalSpinner = false;
        this.snackbar.showSnackBar(toast);
        this.enableUpload = true;
      } else {
        this.disableAccept = false;
        this.totalSpinner = false;
      }
    });
  }
  public conformSales = false;
  uploadSupplier(flag?: any) {
    // this.closeConverionRate();
    if (flag == "country") {
      this.getFileFlag = "country";
    }
    this.setAddedFilesUrl(flag);
    this.uploader.setOptions({
      url:
        App.base_url +
        "addFiles?orders_id=" +
        this.orders.selectedOrder.id +
        "&type=" +
        this.imagUploadFlag,
    });

    let toast: object;
    let dialogRef = this.dialog.open(ImportDocumentComponent, {
      width: "550px",
      data: {
        id: this.orders.selectedOrder.id,
        flage: flag,
        order_type: false,
        disableClose: true,
        component: "pfi",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.getAddedFiles(flag);
        //  this.getOrganizationsList(this.param);
      }
    });
  }
  public enableSplit = false;

  confirmSales(event: any): void {
    this.conformorderButton = true;
    // event.target.disabled = true;
    this.closeConverionRate();
    this.OrdersService.updateEstimateApi({
      // estimate_id: this.orders.selectedOrder.id,
      // status_id: 3,
      id: this.orders.selectedOrder.id,
      type: "pfi_confirmed",
    }).then((response) => {
      if (response.result.success) {
        // this.orders.selectedOrder.confirm_sales = true;
        this.moveToPFI();
        this.selectedOrderStatus = response.result.data.name;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orders.selectedOrder.status = response.result.data.name;
        // this.getOrdersActivityDetails();
        this.getViewDetails(this.data.estimate_id, "pfi_details");

        let toast: object;
        toast = {
          msg: "Sales " + this.estimateslanguage + " Confirmed Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.conformorderButton = false;
        this.enableSplit = true;
      }
      this.conformorderButton = false;
    });
  }
  saveupload(product: any, any, value: any) {
    this.OrdersService.generateSavefiles({
      estimate_id: this.orders.selectedOrder.id,
      attachments_id: product.att_id,
      type: "sales",
      order_type: true,
      id: product.id,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: " updated successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
        this.getAddedFiles("sales");
        // this.suppllierDocuments=
      }
    });
  }
  SaveDescription(data: any) {
    let toast: object;
    let dialogRef = this.dialog.open(DescriptionUpload, {
      panelClass: "alert-dialog",
      width: "300px",
      data: {
        orders_id: this.orders.selectedOrder.id,
        estimate_id: this.orders.selectedOrder.id,
        attachments_id: data.att_id,
        type: "sales",
        order_type: false,
        id: data.id,
        discription: data.description,
        component: "pfi",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.getAddedFiles("sales");
        this.router.resetConfig(config);
      }
    });
  }
  CancelEstimate() {
    // this.closeConverionRate();
    this.OrdersService.updateEstimateApi({
      // estimate_id: this.orders.selectedOrder.id,
      // status_id: 4,
      id: this.orders.selectedOrder.id,
      type: "cancelled",
    }).then((response) => {
      if (response.result.success) {
        this.selectedOrderStatus = response.result.data.name;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orders.selectedOrder.status = response.result.data.name;
        let toast: object;
        toast = { msg: " Cancelled Successfully", status: "success" };
        // this.getOrdersActivityDetails();
      }
    });
  }
  downloadDocuments() {
    window.location.href =
      "downloadQuotationDocuments?id=" +
      this.orders.selectedOrder.id +
      "&is_printable=0";
    window.open(
      "downloadQuotationDocuments?id=" +
        this.orders.selectedOrder.id +
        "&is_printable=0",
      "_blank"
    );
  }
  moveToPFI() {
    this.activateScroll = false;
    this.activeTab = "pfiinvoice";
    if (this.pfiinvoice && this.pfiinvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.pfiinvoice["nativeElement"].offsetTop - 80;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveTocreatePo() {
    this.activateScroll = false;
    this.activeTab = "createpo";
    if (this.createpo && this.createpo["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.createpo["nativeElement"].offsetTop - 80;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  addlineitemspfi(event) {
    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      disableClose: true,
      data: {
        id: this.data.estimate_id,
        module_id: this.data.estimate_id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.generateSubTotals("add_product_in_create", this.data.estimate_id);
        this.getViewDetails(this.data.estimate_id, "pfi_details");
        let toast: object;
        toast = { msg: "Line Item Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
      }
    });
  }
  deleteLineItemAccessOrders(index: any) {
    this.proformaInvData[0].profInv.extra_col.splice(index, 1);
    let param = Object.assign({
      extra_col: this.proformaInvData[0].profInv.extra_col,
      estimate_id: this.orders.selectedOrder.id,
      po_nbr: this.proformaInvData[0].profInv.po_nbr,
      po_date: this.orders.selectedOrder.po_date,
    });
    this.OrdersService.updatelineitempopfi(param).then((response) => {
      this.proformaInvData[0].profInv.total = response.result.data.total_amount;
    });
  }
  deleteLineItemorderDetails(lineItem: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        lineItem,
        type: "add_product_in_create",
        module_id: this.data.estimate_id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.getViewDetails(this.data.estimate_id, "pfi_details");

        // this.deleteLineItemAccessOrders(index);
        let toast: object;
        toast = { msg: "Line Item Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  editInLineitems(value: any, key: string, id: number, message: string) {
    if (this.orders.selectedOrder.status_id == "4") {
      return;
    }
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (value != "") {
        if (value != "") {
          let params = {
            id: id,
            key: key,
            value: key == "po_date" ? this.po_date2 : this.po_nbr,
          };
          this.OrdersService.editInLine(params)
            .then((res: any) => {
              if (res.result.success) {
                let toast: object;
                toast = {
                  msg: ` ${message} Updated Successfully`,
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.getViewDetails(this.data.estimate_id, "pfi_details", true);
              }
            })
            .catch((error) => console.log(error));
        }
      }
    }, 1500);
  }
  editDiscount(event) {
    let discount;
    this.clickedIconId = "discount";
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (this.editdescountValue != "") {
        let a = parseFloat(
          this.proformaInvData[0].subtotal_form[0].subtotal.replace(/,/g, "")
        );

        discount = this.getFormattedValue(
          this.editdescountValue,
          this.proformaInvData[0].subtotal_form[0].totals?.discount.value
        );
        let param = {
          form_data: { ...this.prefillObject, discount: discount },
          discount: discount,
          id: this.proformaInvData[0].subtotal_form[0].id,
          organization_id: this.data.estimate_id,
          module_id: this.data.estimate_id,
          moduleName: this.moduleName,
        };
        let toast: object;
        this.utilsService.saveStoreAttribute(param).then((res) => {
          if (res.success) {
            this.getViewDetails(this.data.estimate_id, "pfi_details");

            this.editDescountstate = false;
            toast = {
              msg: "Discount Updated Successfully",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
          } else {
            this.editDescountstate = false;
            toast = {
              msg: res.message,
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
            this.getViewDetails(this.data.estimate_id, "pfi_details");
          }
        });
      }
    });
  }
  CreatePO() {
    let toast: object;
    let dialogRef = this.dialog.open(POCreateComponent, {
      panelClass: "alert-dialog",
      width: "800px",
      data: {
        flag: "Create PO",
        productArr:
          this.invoiceProducts.length !== 0 ? this.invoiceProducts : null,
        estimate_id: this.orders.selectedOrder.id,
        po_suffix: this.orders.selectedOrder.po_suffix,
        rowIds: this.rowIds,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        // this.cookie.set("estimate_id", result.response);
        this.router.navigate(["/po", result.response]);
        let toast: object;
        toast = {
          msg: " PO Created Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  createorderButton() {
    // this.closeConverionRate();
    if (
      this.editingProductId ||
      this.editingProductIdQ ||
      this.editingDesId ||
      this.editfreight ||
      this.editinsurancevalue ||
      this.editDescountstate
    ) {
      this.closeConverionRate();
    }
    this.productsRowData.forEach((prodt) => {
      if (!prodt.is_order_created || !prodt.seleted) {
        prodt.seleted = false;
      } else {
        prodt.seleted = true;
      }
    });
    this.invoiceProducts = this.productsRowData.filter((val: any) => {
      if (val["seleted"]) {
        // productValue.push(val);

        return true;
      } else {
        return false;
      }
    });
    this.selectOrder = true;
    this.selectPO = false;
    if (this.gridRowSelected) {
      this.selectdRows = !this.selectdRows;
    }
    this.moveTocreatePo();
    this.disablecreateorder = this.invoiceProducts.length === 0;
  }
  cancelOrderPo() {
    this.selectPO = false;
    this.selectOrder = false;
  }
  public createpoClick;
  public selectdRows = false;

  createPOButton() {
    // this.closeConverionRate();
    if (
      this.editingProductId ||
      this.editingProductIdQ ||
      this.editingDesId ||
      this.editfreight ||
      this.editinsurancevalue ||
      this.editDescountstate
    ) {
      this.closeConverionRate();
    }
    // this.closeConverionRate();
    if (!this.removePo) {
      return;
    }
    this.productsRowData.forEach((prodt) => {
      if (!prodt.is_order_created || prodt.is_po_created || !prodt.seleted) {
        prodt.seleted = false;
      } else {
        prodt.seleted = true;
      }
    });

    this.invoiceProducts = this.productsRowData.filter((val: any) => {
      if (val["seleted"]) {
        // productValue.push(val);

        return true;
      } else {
        return false;
      }
    });
    this.selectPO = true;
    this.selectOrder = false;
    if (this.gridRowSelected) {
      this.selectdRows = !this.selectdRows;
    }
    this.moveTocreatePo();
    this.disablecreateorder = this.invoiceProducts.length === 0;
  }
  handleCheckboxChange(product: any) {
    // Check if is_po_create is false
    if (!product.is_po_create) {
      // Enable the checkbox
      product.seleted = !product.seleted; // Optionally, you can toggle the checkbox here
    } else {
      // Optionally, you can handle the case where is_po_create is true
    }
  }

  isCheckboxDisabled(product: any): boolean {
    // Return true if the checkbox should be disabled
    return product.is_order_created || product.is_po_create;
  }

  editEstimate() {
    this.openEditEstimateDialog("Edit");
  }
  public newColumnAdded = false;
  public editDone = true;
  public refreshGrid = false;
  openEditEstimateDialog(title) {
    let toast: object;
    let dialogRef = this.dialog.open(CreatePfiComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        estimate_id: this.data.estimate_id,
        title: title,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.editEstimateBtn = false;
      if (result && result.success) {
        toast = {
          msg:
            title == "Edit"
              ? "Quotation Updated Successfully"
              : "Quotation Duplicated Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        if (title == "Edit") {
          this.getViewDetails(this.data.estimate_id, "pfi_details");
          this.newColumnAdded = true;
          setTimeout(() => {
            this.newColumnAdded = false;
          }, 100);

          this.editDone = false;
          setTimeout(() => {
            this.editDone = true;
          }, 50);
        } else if (title == "Duplicate") {
          this.router.navigate(["/estimates", result.response]);
          this.dymanicdocumentdata = [];
          this.minimizeAll = false;
          this.showProducts = true;
          this.showProfInvoice = true;
          this.data.estimate_id = result.response;
          this.quotationOrders();

          this.getViewDetails(this.data.estimate_id, "pfi_details");
          setTimeout(() => {
            this.refreshGrid = true;
            setTimeout(() => {
              this.refreshGrid = false;
            }, 100);
          }, 500);
          this.orderPermissions();
        }
      } else if (result && !result.success) {
        toast = {
          msg:
            title == "Edit"
              ? "Failed to Update Quotation "
              : "Failed to Duplicate Quotation",
          status: "error",
        };

        this.snackbar.showSnackBar(toast);
      }
    });
  }
  public removePo;
  public removeCreateOrder;
  openCreatMenu() {
    this.removePo = this.productsRowData.some((prodt) => {
      if (!prodt.is_po_created) {
        return true;
      } else {
        return false;
      }
    });

    this.removeCreateOrder = this.productsRowData.some((prodt) => {
      if (!prodt.is_order_created) {
        return true;
      } else {
        return false;
      }
    });
    this.selectAllChecked = false;
    // this.edit_qty("", "");
    // this.editInsurancefre("");
  }

  openActivityModal(type): void {
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        module: type,
        id: this.data.estimate_id,
      },
    });
  }
  closeConverionRate() {
    setTimeout(() => {
      // this.proformaInvData[0].productsData = JSON.parse(
      //   JSON.stringify(this.originalPFIInvoiceData[0].productsData)
      // );
      this.proformaInvData[0].subtotal_form[0].totals.freight.value =
        this.originalPFIInvoiceData[0].subtotal_form[0].totals?.freight.value;
      this.proformaInvData[0].subtotal_form[0].totals.insurance.value =
        this.originalPFIInvoiceData[0].subtotal_form[0].totals?.insurance.value;
      this.proformaInvData[0].subtotal_form[0].totals.discount.value =
        this.originalPFIInvoiceData[0].subtotal_form[0].totals?.discount.value;
      if (this.proformaInvData[0].add_line_items?.length)
        this.proformaInvData[0].add_line_items = JSON.parse(
          JSON.stringify(this.originalPFIInvoiceData[0].add_line_items)
        );
    }, 100);
    this.editingProductId = null;
    this.editingProductIdQ = null;
    this.editingDesId = null;
    this.editfreight = false;
    this.editinsurancevalue = false;
    this.editDescountstate = false;
    this.updatedFreight = null;
    this.updatedValueinsurance = null;
    this.editdescountValue = null;
    this.editaddlineItem = null;
  }
  changeqty(event: any) {
    this.editQty = true;
  }
  edit_qty(key, productId) {
    this.proformaInvData = JSON.parse(
      JSON.stringify(this.originalPFIInvoiceData)
    );
    this.editDescountstate = false;
    this.editfreight = false;
    this.editinsurancevalue = false;
    if (key === "price") {
      this.editingProductId = productId;
      this.editingProductIdQ = null;
      this.editingDesId = null;
      setTimeout(() => {
        this.inlineEditInput.nativeElement.focus();
      }, 100);
    } else if (key === "description") {
      this.editingDesId = productId;
      this.editingProductId = null;
      this.editingProductIdQ = null;
    } else if (key === "quantity") {
      this.editingProductIdQ = productId;
      this.editingProductId = null;
      this.editingDesId = null;
      setTimeout(() => {
        this.inlineEditInput.nativeElement.focus();
      }, 100);
    }

    // this.getProformaInvoiceData();
  }

  savechanges(event, key, index?: any) {
    if (key === "quantity") {
      this.updatedValue = event.target.value;
    } else if (key === "price") {
      this.updatedValue = event.target.value;
    } else if (key === "description") {
      // this.editdescr = event.target.innerText;
      this.proformaInvData[0].productsData[index].p_description =
        event.target.innerText;
    } else if (key === "freight") {
      this.freightvalue = event.target.value;
    }
    // this.changePrice();
  }
  public existingAttributesData = [];
  public form_id = "";
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: "subtotal_form",
      })
      .then(async (response) => {
        if (response.result.success) {
          this.existingAttributesData =
            response.result.data.attributes.base_attributes;

          this.form_id = response.result.data.attributes.form_id;
          this.getAttributesPrefillData();
        }
      })
      .catch((error) => console.log(error));
  }
  public prefillObject: any;
  async getAttributesPrefillData() {
    let data;
    let isSaveFreight: string;
    await this.service
      .getAttributes({
        module: this.form_id,
        id: this.data.estimate_id,
      })
      .then(async (response) => {
        if (response.result.success && response.result.data) {
          data = response.result.data[0].meta_data;
          this.prefillObject = data;
        }
      });
  }
  public moduleName = "";

  editInsurancefre(key, index?: any) {
    // localStorage.setItem("moduleName", "subtotal_form");
    this.moduleName = "subtotal_form";

    this.getOrgStoreAttribute();
    // this.proformaInvData = JSON.parse(
    //   JSON.stringify(this.originalPFIInvoiceData)
    // );
    this.editingProductIdQ = null;
    this.editingProductId = null;
    this.editingDesId = null;

    if (key == "freight") {
      this.editfreight = true;
      this.editinsurancevalue = false;
      this.editDescountstate = false;
      this.editaddlineItem = null;
      setTimeout(() => {
        this.inlineEditFright.nativeElement.focus();
      }, 100);
    } else if (key == "insurance") {
      this.editinsurancevalue = true;
      this.editfreight = false;
      this.editDescountstate = false;
      this.editaddlineItem = null;
      setTimeout(() => {
        this.inlineEditInsurance.nativeElement.focus();
      }, 100);
    } else if (key == "discount") {
      this.editDescountstate = true;
      this.editfreight = false;
      this.editinsurancevalue = false;
      this.editaddlineItem = null;
      setTimeout(() => {
        this.inlineEditDiscount.nativeElement.focus();
      }, 100);
    } else if (key == "add_line") {
      this.editDescountstate = false;
      this.editfreight = false;
      this.editinsurancevalue = false;
      this.editaddlineItem = index;
      setTimeout(() => {
        this.inlineEditLineItem.nativeElement.focus();
      }, 100);
    }

    // this.getProformaInvoiceData();
  }
  savefreighdescount(event, key) {
    // localStorage.setItem("moduleName", "subtotal_form");
    this.moduleName = "subtotal_form";

    if (key === "freight") {
      this.updatedFreight = event.target.value;
    } else if (key === "insurance") {
      this.updatedValueinsurance = event.target.value;
    } else if (key === "discount") {
      this.editdescountValue = event.target.value;
    }
  }
  removeCommas(event) {
    event.target.value = event.target.value.replace(/,/g, "");
  }

  public clickedIconId = null;

  onBlur(event: FocusEvent, productId: number): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (this.clickedIconId === productId) {
      this.clickedIconId = null; // Reset the flag
      return;
    }

    this.closeConverionRate();
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

  public orderDocuments = new Map();
  public orderDocumentsArr: any = [];
  public dynamicDocLoader = false;
  dymanicdocumentdata: any = [];

  getDynamicDocuments(): void {
    this.orderDocuments = new Map();
    this.OrdersService.getQuotationDocuments({
      id: this.data.estimate_id,
      type: "quotation",
    })
      .then((response) => {
        let data = response.result?.data;
        data?.some((item) => {
          if (this.orderDocuments.has(item.document_template_types_id)) {
            let itemsArr = this.orderDocuments.get(
              item.document_template_types_id
            );
            this.orderDocuments.set(item.document_template_types_id, [
              ...itemsArr,
              item,
            ]);
          } else {
            this.orderDocuments.set(item.document_template_types_id, [item]);
          }
        });
        this.orderDocumentsArr = Array.from(this.orderDocuments.keys());
        let concatedArray = [];
        this.orderDocuments.forEach((items, key) => {
          concatedArray = concatedArray.concat(items);
          items.forEach((obj) => {
              obj.is_display = true;
          });
          // this.dymanicdocumentdata = this.dymanicdocumentdata.concat(items);
        });
        this.dymanicdocumentdata = [...concatedArray];
        this.dynamicDocLoader = true;
      })
      .catch((error) => console.log(error));
  }
  getViewDetails(id, type: string, update?: boolean) {
    if (!update) {
      this.fetchingData = true;
      this.selectedOrderStatus = "";
    }
    this.OrdersService.getViewDetails({ id, type }).then((response) => {
      if (response.result.data && response.result.success) {
        this.invoiceGenerateLoader = false;
        this.inv_placement = 1; //remove it after
        this.hideShipperAddress = true;
        this.enableProforma = true;
        // response.result.data[0].productsData.forEach((product) => {
        //   product.seleted = false;
        // });
        if (type === "pfi_details") {
          if (update) this.proformaInvData[0] = response.result.data;

          if (!update) {
            this.proformaInvData = [response.result.data];
            this.originalPFIInvoiceData = JSON.parse(
              JSON.stringify({ ...this.proformaInvData })
            );
            this.editEstimateData = response.result.data;
            this.po_nbr = this.proformaInvData[0].create_estimate[0].po_nbr;
            let po_date = this.proformaInvData[0].create_estimate[0].po_date;
            this.po_date2 = po_date ? po_date : "";
            if (
              this.proformaInvData[0]?.add_notify_address &&
              this.proformaInvData[0].add_notify_address.length
            ) {
              this.showNotifyAddress = true;
              this.orders.notifyAddr = Object.assign(
                this.proformaInvData[0].add_notify_address
              );
              // console.log(this.orders.notifyAddr)
            } else {
              this.showNotifyAddress = false;
              this.orders.notifyAddr = { notify_id: "" };
            }
            this.orders.selectedOrder =
              this.proformaInvData[0].create_estimate[0];

            if (
              this.factoryPermission &&
              !this.clientPermission &&
              !this.isSampleDocs &&
              this.orders.selectedOrder.status_id >= "2" &&
              this.orders.selectedOrder.status_id != "4"
            ) {
              this.enableUpload = true;
            } else {
              this.enableUpload = false;
            }

            this.selectedOrderStatus = this.orders.selectedOrder.status;

            // this.getOrdersActivityDetails();
            this.getAddedFiles("sales");
            this.getDynamicDocuments();
          }
        } else {
          this.editEstimateBtn = false;
        }
      }
    });
    this.fetchingData = false;
  }
  public gridRowSelected;
  public productsRowData = [];
  triggerRowDataEvent(ev) {
    this.productsRowData = ev.row_data;
  }

  triggerGridEvent(ev) {
    let arr = [];
    // this.generateSubTotals("add_product_in_create", this.data.estimate_id);
    this.getViewDetails(this.data.estimate_id, "pfi_details");

    // console.log(ev);
    if (ev.eventName == "split") {
      const config = this.router.config.map((route) =>
        Object.assign({}, route)
      );
      this.selectPO = false;
      this.getProformaInvoiceData();
      this.router.resetConfig(config);
    }
    if (ev.eventName == "select-rows") {
      this.gridRowSelected = ev.selectedRows;
      arr = ev.selectedRows.map((obj) => {
        obj.selected = true;
        return obj;
      });

      arr = arr.filter((obj: any) => {
        return (
          !obj.is_order_created || (!obj.is_order_created && !obj.is_po_created)
        );
      });
      this.checkBoxProductInvoice(arr);
      if (ev.totalSelectd) {
        this.disablecreateorder = false;
      } else {
        this.disablecreateorder = true;
      }
    }

    if (ev.editdone) {
      // this.getProformaInvoiceData();
    }
  }

  generateSubTotals(type: string, id) {
    this.OrdersService.generateSubTotals({
      type: type,
      id: id,
    }).then((response) => {
      this.getViewDetails(this.data.estimate_id, "pfi_details");
    });
  }
  public ordersList = [];
  public fetchingOrders = false;
  quotationOrders() {
    this.fetchingOrders = true;
    this.OrdersService.quotationOrders({ id: this.data.estimate_id }).then(
      (res) => {
        if (res.result.success) {
          this.ordersList = res.result.data;
          this.fetchingOrders = false;
        } else {
          this.fetchOrder = false;
        }
      }
    );
  }

  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate([
      "/orders",
      // 213
      data.id,
    ]);
    return;
  }
  duplicateQuotation() {
    this.openEditEstimateDialog("Duplicate");
  }

  minimizeAll = false;
  setMinimizeAll() {
    this.minimizeAll = true;
    this.showProducts = false;
    this.showProfInvoice = false;
  }
  // saveAddline() {
  //   let a = [];
  //   let lineItem = {
  //     // key: this.lineItemForm.value.lineItem,
  //     // value: this.lineItemForm.value.lineItemValue,
  //   };
  //   let param = Object.assign(this.data);

  //   // if (this.data.extra_col) {
  //   //   param.extra_col.push(lineItem);
  //   // } else {
  //   //   a.push(lineItem);
  //   //   param.extra_col = a;
  //   // }
  //   // this.OrdersService.updatelineitempopfi(param).then((response) => {
  //   //   if (response.result.success) {
  //   //     let toast: object;

  //   //     this.dialogRef.close({ success: true, response: response });
  //   //     toast = { msg: response.result.message, status: "success" };
  //   //     // this.snackbar.showSnackBar(toast);
  //   //   } else {
  //   //   }
  //   // });
  // }
  saveAddline(column: any, colIndex: number) {
    let param = {
      line_item: column.line_item,
      value: column.value,
    };
    this.timestamp = setTimeout(() => {
      let params = {
        form_data: {
          ...param,
        },
        organization_id: this.data.estimate_id,
        id: column.id,
        form_id: "43",
        module_id: this.data.estimate_id,
        moduleName: this.moduleName,
      };
      this.utilsService.saveStoreAttribute(params).then((res) => {
        if (res.success) {
          this.getViewDetails(this.data.estimate_id, "pfi_details");
          this.editaddlineItem = null;
          this.snackbar.showSnackBar({
            msg: "Add Line Item Update Successfully",
            status: "success",
          });
        } else {
          this.editaddlineItem = null;
          this.snackbar.showSnackBar({
            msg: res.message,
            status: "error",
          });
        }
      });
    });
  }
  editAddline(event, columnType: string, colIndex: number) {
    // Get the current value of the input field
    const inputValue = (event.target as HTMLInputElement).value;
    // Logic to update the value in your data structure
    this.proformaInvData[0].add_line_items[colIndex].value = inputValue;

    // Optionally, you can trigger further actions, like API calls
  }
  public editQuoteNoState = false;
  editQuoteNo(ev) {
    let toast: object;
    this.editQuoteNoState = false;
    this.OrdersService.editNumberingSeries({
      id: this.orders.selectedOrder.id,
      number_series: this.updatedPoNo,
    }).then(async (response) => {
      if (response.result.success) {
        toast = {
          msg: response.result.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.getViewDetails2(this.data.estimate_id, "pfi_details");
        this.orderPermissions(false);
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
    this.editQuoteNoState = false;
  }
  public updatedPoNo = "";
  savechangesPO(ev) {
    this.updatedPoNo = ev.target.value;
  }
  editpoQPD() {
    this.editQuoteNoState = true;
  }
  getViewDetails2(id, type: string, update?: boolean) {
    this.OrdersService.getViewDetails({ id, type }).then((response) => {
      if (response.result.data && response.result.success) {
        const data = response.result.data;
        this.orders.selectedOrder = data.create_estimate[0];
      }
    });
    this.fetchingData = false;
  }
}
