import {
  Component,
  OnInit,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output,
} from "@angular/core";
// import "quill-mention";
// import "quill-emoji";
import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { Title } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import { Images } from "../../images/images.module";
import { InventoryService } from "../../services/inventory.service";
import { OrdersService } from "../../services/orders.service";
import { OrganizationsService } from "../../services/organizations.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { AddInventoryComponent } from "../../dialogs/add-inventory/add-inventory.component";
import { SnakbarService } from "../../services/snakbar.service";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { language } from "../../language/language.module";
import { MatDatepicker } from "@angular/material/datepicker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { AddBatchNumberComponent } from "../../dialogs/add-batch-number/add-batch-number.component";
import { AddLineItemComponent } from "../../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../dialogs/delete-line-item/delete-line-item.component";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { OrderDownloadComponent } from "../../dialogs/order-download/order-download.component";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { CookieService } from "ngx-cookie-service";
import { MatExpansionModule } from "@angular/material/expansion";
import { CancelOrderComponent } from "../../dialogs/cancel-order/cancel-order.component";
import { DeliverOrderComponent } from "../../dialogs/deliver-order/deliver-order.component";
import { ChangeShipperAddressComponent } from "../../dialogs/change-shipper-address/change-shipper-address.component";
import { AddDrumsComponent } from "../../dialogs/add-drums/add-drums.component";
import { EmailDocumentsComponent } from "../../dialogs/email-documents/email-documents.component";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { validateBasis, CLASS_NAME } from "@angular/flex-layout";
import { Lightbox } from "ngx-lightbox";
import * as $ from "jquery";
import { CreateOrderComponent } from "../../dialogs/create-order/create-order.component";
import { Router, ActivatedRoute } from "@angular/router";
import { AdminService } from "../../services/admin.service";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { DescriptionUpload } from "../../dialogs/description/add-description.component";
import { CustomValidation } from "../../custom-format/custom-validation";
import { AddContainersComponent } from "../../dialogs/add-containers/add-containers.component";
import { AddPackageComponent } from "../../dialogs/add-package/add-package.component";
import { PackageComponent } from "../package-view/package.component";
import { E } from "@angular/cdk/keycodes";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { EditDesciptionModelComponent } from "../../shared/edit-desciption-model/edit-desciption-model.component";

declare var App: any;

const {
  language: {
    orders: { value: commercial_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-order-details-backup",
  templateUrl: "./order-details-backup.component.html",
  styleUrls: ["./order-details-backup.component.scss"],
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
export class OrderDetailsBackupComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  public commercialName = commercial_name;
  @Input() roles;
  private css = "@page { size: landscape; }";
  private head = document.head || document.getElementsByClassName("adc-sheet");
  private style = document.createElement("style");
  private App = App;
  public userDetails: any;
  public orderButton: any;
  // pub asd:PackageComponent
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean;
  containsMilk: boolean;
  public containerError;
  getExportData: any;
  // getAdcshetValue = new Map();
  getSidraft: any;
  totalCount: any;
  public submitShippingForm: boolean = false;
  public submitFreightForm: boolean = false;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  isSampleDocs: boolean = false;
  private productList: Array<any> = [];
  batchNum: string;
  batchNumArray: Array<any>;
  // getSdfData: any;
  getConcernData: any;
  checked: boolean;
  totalSpinner: boolean;
  private timeout;
  public sailing_date;
  public carrier_data;
  packagePrint: boolean;
  buttonName: boolean;
  packageCompleted: boolean;
  disablePayment = true;
  private showFilter = false;
  fetchingData = true;
  fetchOrder: boolean;
  downloadStatus: boolean;
  showDrumsList = false;
  filtersLoader = true;
  public sailingDate;
  public estimatedDate;
  public shippingOnBoard;
  public icon: boolean = false;
  public postIcon: boolean = false;
  public show: boolean = true;
  public activePayment = false;
  public showPackage: boolean = true;
  public showShipping: boolean = true;
  public freightlgistics: boolean = true;
  public showotherCosts: boolean = true;
  public showexportRegister: boolean = true;
  public showOtherOrderDetails: boolean = true;
  public showUom: boolean = true;
  public showMsds: boolean = true;
  public showNonhazardous: boolean = true;
  public showNondgr: boolean = true;
  public showIctt: boolean = true;
  public showSdf: boolean = true;
  public showExportvalue: boolean = true;
  public showDeclaration: boolean = true;
  public showShippers: boolean = true;
  public showAdcsheet: boolean = true;
  public showAdcsheetaapl: boolean = true;
  public showDeclarationIncentive: boolean = true;
  public showScomatDeclaration: boolean = true;
  public showNoDatFound = false;
  public concern: boolean = true;
  public freightStatus: boolean = true;
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
  freightandlogisticsState: boolean = false;
  othersCostState: boolean;
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
  shippingForm2: FormGroup;
  freightandlogistics: FormGroup;
  otherCosts: FormGroup;
  exportRegisterForm: FormGroup;
  suppllierDocumentss: FormGroup;
  otherOrderDetailsForm: FormGroup;
  pvmForm: FormGroup;
  totalPages: number = 2500;
  ActivityLog: boolean;
  editShipping: boolean = true;
  disableCancel: boolean = undefined;
  ordersDownload: boolean;
  added: boolean;
  hideShipperAddress: boolean = false;
  public matSelectOpen = false;
  orderFormCompanyDetails: any;
  public hidePaidBtn: boolean = true;
  public packageDisable: boolean = true;
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
  public incoTermsList = [];
  public icttRows = [];
  public freightData = [];
  public enableCustomDocs = false;
  public saveFreight: boolean = false;
  public orderStatuses: Array<any> = [];
  public editFreight: boolean = true;
  public salesContractdisable: boolean = true;
  public customSidePannel: boolean = true;
  public shownonscomat: boolean = true;
  public shownadcdecl: boolean = true;
  public showNdpsDecl: boolean = true;
  public showDgrDecl: boolean = true;
  public mode_shippiment;
  public showFemaDeclration: boolean = true;
  public showSealedContainer: boolean = true;
  public showChaLetter: boolean = true;
  public showRodTep: boolean = true;
  public showVGM: boolean = true;
  public showSIDraft: boolean = true;
  public port_of_loadinginpdf;
  public port_of_dischargepdf;
  public showSelfSealCertificate: boolean = true;
  public shippingnoSdf: boolean;
  textareaContent: string = "";
  textareaContents: string = "";
  textCount: string = "";
  wordCount: number = 0;
  wordCountotherinfo: number = 0;
  wordCountStand1: number = 0;
  public currentDate;
  public saveconverisonEnable: boolean = true;
  public is_automech = App.env_configurations.is_automech;
  public billLading;
  public Airwaybill;
  public editMode: boolean = false;
  public editModeAdc: boolean = false;
  public editModeSIDraft: boolean = false;
  public packageEdit;
  public PostpackageData;
  public freightDataPack;
  public inlineVGMData;
  public inlineSelfSealData;
  public commercialInvoiceData: any;
  // exportValueDecl: any = {
  //   nature_of_traction: [], // Ensure nature_of_traction is an array
  // };

  public typeStuffing = [
    { name: "Dock Stuffing", id: "1" },
    { name: "Factory Stuffing", id: "2" },
    { name: "On-wheel Stuffing", id: "3" },
  ];
  public typeOfContainer = [
    { name: "Dock LCL", id: "1" },
    { name: "20’STD", id: "2" },
    { name: "20’RFR", id: "3" },
    { name: "40’HC", id: "4" },
    { name: "40’STD", id: "5" },
    { name: "40’RFR", id: "6" },
  ];
  public freightCostCurrency = [
    { name: "INR", id: "1" },
    { name: "USD", id: "2" },
    { name: "EURO", id: "3" },
  ];
  public precarriage = [
    { name: "Road", id: "Road" },
    { name: "Rail", id: "Rail" },
  ];
  public receiptCarrier = [
    { name: "Pune ", id: "Pune" },
    { name: "Pithampur", id: "Pithampur" },
  ];

  public taxType;
  // = [
  // 	{name: 'Supply Meant for Export on Payment of IGST ', id: "Supply Meant for Export on Payment of IGST"},
  // 	{name: 'Supply Meant for Export Under LUT', id: "Supply Meant for Export Under LUT"},
  // 	{name: 'none', id: "none"},
  // ]

  displayedColumns = [
    "order_product_id",
    "product_name",
    "product_description",
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
  maxCharLimit = 10;
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
      {
        id: 2,
        name: "Invoice LUT",
        selected: true,
        class: "invoiceLUT",
        function: "moveToInvoiceLut",
        imgSrc: this.images.invoice_small,
      },
      {
        id: 3,
        name: "Packing Details",
        selected: true,
        class: "packaging",
        function: "moveToPackaging",
        imgSrc: this.images.pkgDetails_small,
      },
      {
        id: 5,
        name: "UOM",
        selected: true,
        class: "uom",
        function: "moveToUom",
        imgSrc: this.images.pkgDetails_small,
      },
      {
        id: 5,
        name: "moveToPackaging",
        selected: true,
        class: "moveToPackaging",
        function: "moveToPackaging",
        imgSrc: this.images.pkgDetails_small,
      },

      {
        id: 4,
        name: "COA",
        selected: true,
        class: "coa",
        function: "moveToCoa",
        imgSrc: this.images.coa_small,
      },
      {
        id: 99,
        name: "Shipping Details",
        selected: true,
        class: "shipping",
        function: "moveToShipping",
        imgSrc: this.images.shippingDetails_small,
      },
    ],
    preShip: [
      {
        id: 5,
        name: "MSDSss Form",
        selected: true,
        class: "msdsForm",
        function: "moveToMsdsForm",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 6,
        name: "ICTT - DECLARATION",
        selected: true,
        class: "ictt",
        function: "moveToIcttForm",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 7,
        name: "Non Hazardous Certificate",
        selected: true,
        class: "nonHazardous",
        function: "moveToNonHazardous",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 8,
        name: "Form SDF",
        selected: true,
        class: "Formsdf",
        function: "moveToFormSdf",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 9,
        name: "Export Value Declaration",
        selected: false,
        class: "Exportvalue",
        function: "moveToExportValue",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 10,
        name: "Declaration",
        selected: false,
        class: "Declaration",
        function: "moveToDeclaration",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 11,
        name: "Shipper's Letter",
        selected: false,
        class: "Shipperletter",
        function: "moveToShipperLetter",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 12,
        name: "ADC Sheet",
        selected: false,
        class: "Adcsheet",
        function: "moveToAdcSheet",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 13,
        name: "Declaration For Incentive",
        selected: false,
        class: "Incentivedeclaration",
        function: "moveToIncentive",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 14,
        name: "Scomat Declaration",
        selected: false,
        class: "Scomatdeclaration",
        function: "moveToScomat",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 15,
        name: "Turn Over Declaration",
        selected: false,
        class: "Concern",
        function: "moveToConcern",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 16,
        name: "Ad Code",
        selected: false,
        class: "Adcode",
        function: "moveToAdcode",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 17,
        name: "SSI",
        selected: false,
        class: "Ssi",
        function: "moveToSsi",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 18,
        name: "Check List",
        selected: false,
        class: "Unit",
        function: "moveToUnit",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 19,
        name: "Self Sealed Report",
        selected: false,
        class: "SealedReport",
        function: "moveToSealed",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 20,
        name: "DRAFT BL",
        selected: false,
        class: "DraftBl",
        function: "moveToDraftBl",
        imgSrc: this.images.pdf_download,
      },
    ],
    postShip: [
      {
        id: 15,
        name: "Country Of Origin",
        selected: true,
        class: "Origin",
        function: "moveToOrigin",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 16,
        name: "Insurance",
        selected: true,
        class: "insurance",
        function: "moveToInsurance",
        imgSrc: this.images.pdf_download,
      },
      {
        id: 17,
        name: "Shipping Bill",
        selected: true,
        class: "airway",
        function: "moveToAirway",
        imgSrc: this.images.pdf_download,
      },
    ],
  };
  private timestamp: any;
  enableInvoice: boolean = false;
  clickedGenerateInvoice: boolean = false;
  clickedGenerateTaxInvoice: boolean = false;
  clickedGenerateIGSTInvoice: boolean = false;
  clickedPackageDetails: boolean = false;
  isPackageAdded = false;
  invoiceGenerated = false;

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
    packageStatus: 0,
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
      is_order_ready: false,
      confirm_sales: false,
      status_color_code: "",
      extra_col: [],
      freight: "",
      insurance: "",
      discount: "",
      sub_total: "",
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
    packageOrdersloop: [],
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
  private checkOrdersPdf = {
    checkOrders: [],
    checkOrdersId: "",
  };
  private sdfData = {
    shipping_bill_no: "",
    orders_id: this.orders.selectedOrder.id || 0,
    entry_date: "",
    check_date: "",
    id: "",
  };
  public sdfFormDates: FormGroup;
  public adcForm: FormGroup;
  public exportValue = {
    e_shipping_bill_no: "",
    orders_id: this.orders.selectedOrder.id || 0,
    e_entry_date: "",
    e2_entry_date: "",
  };
  public adcSheet = {
    batch_no: "",
    manufacture_date: "",
    expiry_date: "",
  };
  public siDraft = {
    vessel_no: "",
    marks_and_nos: "",
    no_of_packages: "",
    decription_of_goods: "",
    gross_weight: "",
  };
  public getSdfData = {
    shipping_bill_no: "",
    entry_date: "",
    check_date: "",
  };
  public packageDescription;
  public pkgDeclaration;

  public taxBilltoParty;
  public taxShiptoparty;
  data = {
    id: "",
    selectedStatus: [],
    selectedProducts: [],
    selectedClients: this.orders.selectedClients.value,
    client_search: this.orders.client_search,
    manifacture_date: this.orders.mfg_date,
    search: this.params.search,
    pageSize: 0,
    page: 0,
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
  @ViewChild("packaging") packaging: TemplateRef<any>;
  @ViewChild("uom") uom: TemplateRef<any>;
  @ViewChild("primaryPackaging") primaryPackaging: TemplateRef<any>;
  @ViewChild("invoice") invoice: TemplateRef<any>;
  @ViewChild("coa") coa: TemplateRef<any>;
  @ViewChild("shipping") shipping: TemplateRef<any>;
  @ViewChild("msdsForm") msdsForm: TemplateRef<any>;
  @ViewChild("nonHazardous") nonHazardous: TemplateRef<any>;
  @ViewChild("nondgr") nondgr: TemplateRef<any>;
  @ViewChild("ictt") ictt: TemplateRef<any>;
  @ViewChild("Formsdf") Formsdf: TemplateRef<any>;
  @ViewChild("Exportvalue") Exportvalue: TemplateRef<any>;
  @ViewChild("Declaration") Declaration: TemplateRef<any>;
  @ViewChild("Shippersletter") Shippersletter: TemplateRef<any>;
  @ViewChild("Adcsheet") Adcsheet: TemplateRef<any>;
  @ViewChild("AdcsheetAdcDocs") AdcsheetAdcDocs: TemplateRef<any>;
  @ViewChild("Incentivedeclaration") Incentivedeclaration: TemplateRef<any>;
  @ViewChild("Scomatdeclaration") Scomatdeclaration: TemplateRef<any>;
  @ViewChild("Concern") Concern: TemplateRef<any>;
  @ViewChild("Adcode") Adcode: TemplateRef<any>;
  @ViewChild("Lut") Lut: TemplateRef<any>;
  @ViewChild("Iec") Iec: TemplateRef<any>;
  @ViewChild("Ssi") Ssi: TemplateRef<any>;
  @ViewChild("Unit") Unit: TemplateRef<any>;
  @ViewChild("DraftBl") DraftBl: TemplateRef<any>;
  @ViewChild("SezUnit") SezUnit: TemplateRef<any>;

  @ViewChild("taxinvoicetab") taxinvoicetab: TemplateRef<any>;
  @ViewChild("igstinvoicetab") igstinvoicetab: TemplateRef<any>;
  @ViewChild("exportinvoice") exportinvoice: TemplateRef<any>;
  @ViewChild("proinvoicetab") proinvoicetab: TemplateRef<any>;

  @ViewChild("Otherdocs") Otherdocs: TemplateRef<any>;

  @ViewChild("origin") origin: TemplateRef<any>;
  @ViewChild("insurance") insurance: TemplateRef<any>;
  @ViewChild("airway") airway: TemplateRef<any>;
  @ViewChild("freight") freight: TemplateRef<any>;
  @ViewChild("otherOrder") otherOrder: TemplateRef<any>;
  @ViewChild("othercosts") othercosts: TemplateRef<any>;
  @ViewChild("exportregister") exportregister: TemplateRef<any>;
  @ViewChild("Nonscometdecl") Nonscometdecl: TemplateRef<any>;
  @ViewChild("AdcDecl") AdcDecl: TemplateRef<any>;
  @ViewChild("NdpsDeclration") NdpsDeclration: TemplateRef<any>;
  @ViewChild("adcdocuments") adcdocuments: TemplateRef<any>;
  @ViewChild("Dgrdecl") Dgrdecl: TemplateRef<any>;
  @ViewChild("FEMADeclration") FEMADeclration: TemplateRef<any>;
  @ViewChild("SealedContainer") SealedContainer: TemplateRef<any>;
  @ViewChild("ChaLetter") ChaLetter: TemplateRef<any>;
  @ViewChild("RodTep") RodTep: TemplateRef<any>;
  @ViewChild("VGM") VGM: TemplateRef<any>;
  @ViewChild("SIDraft") SIDraft: TemplateRef<any>;
  @ViewChild("selfsealcr") selfsealcr: TemplateRef<any>;
  @ViewChild("PostPackage") PostPackage: TemplateRef<any>;
  @ViewChild("postCommercialInvoice") postCommercialInvoice: TemplateRef<any>;
  @ViewChild("orderDetailEditInput") orderDetailEditInput: ElementRef;
  @ViewChild("orderDetailEditInsurance") orderDetailEditInsurance: ElementRef;
  @ViewChild("orderDetailEditFright") orderDetailEditFright: ElementRef;
  @ViewChild("orderDetailEditDiscount") orderDetailEditDiscount: ElementRef;
  @ViewChild("taxInvEditInput") taxInvEditInput: ElementRef;
  @ViewChild("notifyTextarea1") notifyTextarea1: ElementRef;
  @ViewChild("buyerTextarea1") buyerTextarea1: ElementRef;
  @ViewChild("shipperTextarea1") shipperTextarea1: ElementRef;
  @ViewChild("notifyTextarea2") notifyTextarea2: ElementRef;
  attachments = [];
  originFileAttachments = [];
  insuranceAttachments = [];
  airwayAttachments = [];
  suppllierDocuments = [];
  salesDocuments = [];
  shippingAttachments = [];
  otherOrderAttachments = [];
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
    "supplier",
    "sales",
    "otherOrderSupplier",
  ];

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
  public isMerchantExporter: boolean = true;
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
  coaLineItemEdit: boolean = false;
  poDate: boolean = true;
  coalineItem: any;
  shipperId: any;
  public preShipDocs: boolean = false;
  public postShipDocs: boolean = false;
  public customDocs: boolean = false;

  public po_date2 = new Date(
    this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ""
  );
  public selectedOrderData;
  orderId: any;
  order_no_po: any;
  scomatData: any;
  chaLetter: any;
  adcdeclaration: any;
  nonScomatData: any;
  othrOrdrDtlsSave: boolean;
  estimated_date: Date;
  adcbillno: any;
  adcshipDate: any;
  editcusTermsCndt: boolean = false;
  customTerms;
  orginalCustomerTerms;
  selfSelaContainer;
  exportValueDecl: any;
  selectedOptions: any;
  selectedOptionsBuyer: any;
  ndpsData: any;
  adcDeclarationData: any;
  scomataeditData: any;
  editOrdersQty: null;
  editUpdatedQtyValue: any;
  editUpdatedPriceValue: any;
  editOrderPriceState: any;
  editOrderDescription: any;
  editUpdatedDescriptionValue: any;
  updatedFreight: any;
  updatedValueinsurance: any;
  editdescountValue: any;
  editfreightState: boolean;
  editinsurancevalueState: boolean;
  editDescountstateState: boolean;
  editTaxfreightState: boolean;
  editTaxInsurancevalueState: boolean;
  editTaxPrice: null;
  updatedTaxFreight: any;
  updatedTaxValueinsurance: any;
  UpdateTaxPriceValue: any;
  saveKey: any;
  originalOrdersData: any;
  originalOrdersProductData: any;
  originalTaxInvData: any;
  editClosePOPup: boolean = false;
  editOrdersPONo: any;
  editUpdatedPonoValue: any;
  initialValues: any;
  disablegenrateCommercial: boolean;
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
        invoice: this.orders.invoice[0].Inovice,
        pannel: "sales-contract",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.orders.invoice = result.response.result.data.Invioce;
        let toast: object;
        toast = { msg: "Item Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
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
  moveToOtherdocs(file: any) {
    this.otherDocs.push(file);
    this.activateScroll = false;
    this.activeTab = "Otherdocs";
    if (this.Otherdocs && this.Otherdocs["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Otherdocs["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  changePrice(product: any, event: any, value: any) {
    let numberRegex = /[0-9.]/g;
    let price: any;
    let productId: any;
    let quantity: any;
    let amount: any;
    let single_piece;
    this.clickedIconId = product.order_product_id;
    // if (
    //   numberRegex.test(event.key) ||
    //   event.key == "Backspace" ||
    //   event.key == "Delete"
    // ) {
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (value == 0) {
        if (
          this.editUpdatedPriceValue != "" ||
          this.editUpdatedPriceValue != ""
        ) {
          price = product.product_price_number;
          if (price == 0) {
            let toast: object;
            toast = {
              msg: "Price should be greater than Zero",
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
            this.editOrderPriceState = null;
            this.closeEdit();
            this.productPriceChange();
            // this.getInvoiceData();
            return;
          }
          productId = product.order_product_id;
          this.OrdersService.changePrice({
            // price: price,
            price:
              product.product_price_number?.replace(/,/g, "") ||
              product.product_price_number,
            order_product_id: productId,
            quantity:
              product.product_quantity?.replace(/,/g, "") ||
              product.product_quantity,
            single_piece: product.single_piece,
          }).then((response) => {
            if (response.result.success) {
              this.productPriceChange(response.result.data);
              this.getInvoiceData();
              let toast: object;
              toast = {
                msg: "Order Details Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.editOrderPriceState = null;
            } else {
              let toast: object;
              toast = { msg: "Failed to Update", status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editOrderPriceState = null;
              this.productPriceChange(response.result.data);
              // this.getInvoiceData();
            }
          });
        }
      } else if (value == 1) {
        // quantity = this.editUpdatedQtyValue;
        if (this.editUpdatedQtyValue != "") {
          quantity =
            product.product_quantity?.replace(/,/g, "") ||
            product.product_quantity;
          productId = product.order_product_id;
          this.OrdersService.changePrice({
            quantity: quantity,
            order_product_id: productId,
            price:
              product.product_price_number?.replace(/,/g, "") ||
              product.product_price_number,
            single_piece: product.single_piece,
          }).then((response) => {
            if (response.result.success) {
              this.productPriceChange(response.result.data);
              this.getInvoiceData();
              let toast: object;
              toast = {
                msg: "Order Details Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.editOrdersQty = null;
            } else {
              let toast: object;
              toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editOrdersQty = null;
              this.closeEdit();
              this.productPriceChange();
              // this.getInvoiceData();
            }
          });
        }
      }
    });
    // } else {
    //   return false;
    // }
  }
  changeInvoicePackCharge(index, event) {
    let numberRegex = /[0-9.]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.orders.invoice[0].Inovice.pack_charge = event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }

  productPriceChange(data?: any) {
    this.data.id = this.orders.selectedOrder.id;
    this.OrdersService.getOrdersList(this.data).then((response) => {
      let selectedOrderDetails = response.result.data.totalordersDt[0].list[0];
      this.orders.selectedOrder = selectedOrderDetails.orders;
      this.orders.productsData.data = selectedOrderDetails.productsData;
      this.originalOrdersProductData = selectedOrderDetails.productsData.map(
        (data: any) => ({ ...data })
      );
      this.originalOrdersData = { ...selectedOrderDetails.orders };
    });
  }
  public compnayDetails: any;
  public standard_declaration: string = "";
  getComapnyDetails() {
    this.organizationsService.getCompanyDetails().then((response) => {
      if (response.result.success) {
        this.compnayDetails = response.result.data;
      }
    });
  }
  cancelsdf() {
    this.editable = false;
    // this.noShippingBill = false;
    // this.noShippingDate = false;
  }
  cancelShip() {
    this.shippingActiveState = false;
    this.shippingForm.markAsPristine();
    this.shippingContainer.markAsPristine();
    while (this.shippingContainerArray.length !== 0) {
      this.shippingContainerArray.removeAt(0);
    }
    this.getShippingAddressDetails();
    this.editShipping = true;
  }
  setcontainerFormOther(data) {
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addRowsotherCost(value);
      });
    }
  }
  cancelFreight() {
    this.freightContainerForm.markAsPristine();
    this.freightandlogistics.markAsPristine();
    if (this.freighContainerAtrray) {
      while (this.freighContainerAtrray?.length !== 0) {
        this.freighContainerAtrray.removeAt(0);
      }
    }
    this.freightandlogisticsState = false;
    this.editFreight = false;
    this.getFreightForm();
  }
  cancelOthers() {
    this.othertransportForm.markAsPristine();
    this.otherCosts.markAsPristine();
    if (this.othercostArray) {
      while (this.othercostArray.length !== 0) {
        this.othercostArray?.removeAt(0);
      }
    }
    this.othersCostState = false;
    setTimeout(() => {
      this.getOtherCosts();
    }, 100);
  }
  cancelExportRegister() {
    this.exportRegisterForm.markAsPristine();
    this.getExportregister();
  }
  cancelOtherDetails() {
    this.otherOrderDetailsForm.markAsPristine();
    this.getOtherOrderDetails();
  }
  cancelConcern() {
    this.concernEditable = false;
  }
  cancelExport() {
    this.getSiDraft();

    this.editExport = false;
    this.noShippingExportBill = false;
    this.noShippingExportDate = false;
  }
  changeCoaData(coaIndex: any) {
    this.editCoa = false;
    this.coaShow = "Show";
    this.OrdersService.changePoNumbr({
      order_product_id: this.productId,
      id: this.orders.selectedOrder.id,
      flag: coaIndex,
      po_nbr: this.orders.selectedOrder.po_nbr
        ? this.orders.selectedOrder.po_nbr
        : "",
      line_item: this.orders.selectedOrder.line_item
        ? this.orders.selectedOrder.line_item
        : "",
      po_date: this.orders.selectedOrder.po_date
        ? this.orders.selectedOrder.po_date
        : "",
      insurance: this.orders.selectedOrder.insurance
        ? this.orders.selectedOrder.insurance.replace(/,/g, "")
        : "",
      freight: this.orders.selectedOrder.freight
        ? this.orders.selectedOrder.freight.replace(/,/g, "")
        : "",
      discount: this.orders.selectedOrder.discount
        ? this.orders.selectedOrder.discount.replace(/,/g, "")
        : "",
    }).then((response) => {
      this.getReportsData();
    });
  }
  changeAddress(): void {
    this.closeEdit();
    let dialogRef = this.dialog.open(ChangeShipperAddressComponent, {
      width: "550px",
      data: this.orders.selectedOrder.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        let shippingAddress = {
          address1: "",
          address2: "",
          city: "",
          state: "",
          country_name: "",
          postal_code: "",
          gstin_no: "",
        };

        result.data.map(function (value) {
          if (value.selected) {
            shippingAddress = value;
          }
        });
        this.orders.companyShpAddrDt.ksm_address1 = shippingAddress.address1;
        this.orders.companyShpAddrDt.ksm_address2 = shippingAddress.address2;
        this.orders.companyShpAddrDt.ksm_city = shippingAddress.city;
        this.orders.companyShpAddrDt.ksm_state = shippingAddress.state;
        this.orders.companyShpAddrDt.ksm_countrty =
          shippingAddress.country_name;
        this.orders.companyShpAddrDt.ksm_postal_code =
          shippingAddress.postal_code;
        this.orders.companyShpAddrDt.ksm_gstin_no = shippingAddress.gstin_no;
      }
      let showTax = this.orders.companyShpAddrDt.ksm_postal_code;
      if (showTax == "500001") {
        this.taxInvoiceDocument = true;
      } else {
        this.taxInvoiceDocument = false;
      }
    });
  }

  updateKeyValue(pvmForm: any = null) {
    let toast: object;
    let param = Object.assign({}, this.orders.invoice[0].Inovice);
    param.pack_charge = param.pack_charge.toString().split(",").join("");
    param.tax_csgt = param.tax_csgt.toString().split(",").join("");
    param.tax_gst = param.tax_gst.toString().split(",").join("");
    param.tax_igst = param.tax_igst.toString().split(",").join("");
    // param.tax_others = param.tax_others.toString().split(',').join('');
    if (!this.is_sso) {
      param.pre_carriage_by =
        pvmForm && pvmForm.value.pre_carriage_by
          ? pvmForm.value.pre_carriage_by
          : param.pre_carriage_by.toString().split(",").join("");
      param.mark_nos =
        pvmForm && pvmForm.value.mark_nos
          ? pvmForm.value.mark_nos
          : param.mark_nos.toString().split(",").join("");
      param.container_no =
        pvmForm && pvmForm.value.container_no
          ? pvmForm.value.container_no
          : param.container_no.toString().split(",").join("");
      param.lut_arn =
        pvmForm && pvmForm.value.lut_arn
          ? pvmForm.value.lut_arn
          : param.lut_arn.toString().split(",").join("");
      param.lut_arn =
        pvmForm && pvmForm.value.lut_arn
          ? pvmForm.value.lut_arn
          : param.lut_arn.toString().split(",").join("");
      param.lut_date =
        pvmForm && pvmForm.value.lut_date
          ? pvmForm.value.lut_date
          : param.lut_date.toString().split(",").join("");
    }

    this.OrdersService.generateInvoice(param).then((response) => {
      this.orders.invoice = response.result.data.Invioce;
      toast = { msg: "Updated successfully.", status: "success" };
      this.snackbar.showSnackBar(toast);
    });
    if (param.payment_type == "Advance") {
      this.hidePaidBtn = false;
    } else {
      this.hidePaidBtn = true;
    }
  }

  public now: Date = new Date();
  public threeMonthsAgo: Date = new Date(this.now);

  public transistTime;

  constructor(
    private titleService: Title,
    private InventoryService: InventoryService,
    private OrdersService: OrdersService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
    private _lightbox: Lightbox,
    private router: Router,
    private adminService: AdminService
  ) {
    this.now.setDate(this.now.getDate() + 1);
    this.now.setHours(0, 0, 0, 0);
  }
  public acceptOrderbutton: boolean = false;
  public generatesalesContract: boolean = false;
  public purchaseOrder: boolean = false;
  public setReadybutton: boolean = false;
  public freightContainerForm;
  public freighContainerAtrray: FormArray;
  public shippingContainer;
  public shippingContainerArray: FormArray;
  public othertransportForm;
  public othercostArray: FormArray;
  public packagingDataAutomech;
  public viewActivityLogIcon: boolean = false;
  public viewExcelIcon: boolean = false;

  async ngOnInit() {
    this.threeMonthsAgo.setMonth(this.now.getMonth() - 3);

    this.icttForm = new FormGroup({
      icttItem: new FormArray([]),
    });
    this.freightContainerForm = new FormGroup({
      freighContainerAtrray: new FormArray([]),
    });
    this.shippingContainer = new FormGroup({
      shippingContainerArray: new FormArray([]),
    });
    this.othertransportForm = new FormGroup({
      othercostArray: new FormArray([]),
    });
    this.currentDate = new Date();
    if (this.is_automech) {
      this.displayedColumns.splice(1, 0, "po_nbr");
      this.displayedColumns.splice(3, 0, "hs_code");

      // this.displayedColumns.push('po_nbr','hs_code')
    }
    this.activatedRoute.params.subscribe((param) => (this.data.id = param.id));
    this.receiveDataFromChild();
    this.titleService.setTitle(App["company_data"].ordersTitle);
    this.orderFormCompanyDetails = App["company_data"];
    this.orderDetails();
    this.generatePvmForm();
    this.getComapnyDetails();
    this.getPaymentTypes();
    this.getFreightForm();
    this.userDetails = App.user_details;
    let aaceptpermission: boolean;
    let generatesales: boolean;
    let profile: boolean;
    let admin_profile: boolean;
    let purchaseorder: boolean;
    let viewActivityLog: boolean;
    let viewExcelDownload: boolean;
    let setReady: boolean;
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
        case "generate_sales_contract":
          if (value.selected === true) {
            generatesales = true;
          } else {
            generatesales = false;
          }
          break;
        case "accept_orders":
          if (value.selected === true) {
            aaceptpermission = true;
          } else {
            aaceptpermission = false;
          }
          break;
        case "purchase_order":
          if (value.selected === true) {
            purchaseorder = true;
          } else {
            purchaseorder = false;
          }
          break;
        case "set_order_ready":
          if (value.selected === true) {
            setReady = true;
          } else {
            setReady = false;
          }
          break;
        case "activity_log":
          if (value.selected === true) {
            viewActivityLog = true;
          } else {
            viewActivityLog = false;
          }
          break;
        case "excel_download":
          if (value.selected === true) {
            viewExcelDownload = true;
          } else {
            viewExcelDownload = false;
          }
          break;
      }
    });
    this.acceptOrderbutton = aaceptpermission;
    this.generatesalesContract = generatesales;
    this.factoryPermission = true;
    this.clientPermission = profile;
    this.adminUser = admin_profile;
    this.purchaseOrder = purchaseorder;
    this.downloadStatus = false;
    this.setReadybutton = setReady;

    this.viewActivityLogIcon = viewActivityLog;
    this.viewExcelIcon = viewExcelDownload;
    // if (this.cookie.check('order_id')) {
    // 	let order_id = this.cookie.get('order_id');
    // 	this.assignDetailView(order_id);
    // 	setTimeout(() => {

    // 		this.stepper['selectedIndex'] = 1;
    // 	}, 500);
    // 	this.cookie.delete('order_id');
    // 	this.searching = false;
    // } else {
    // 	this.getOrdersList(true);

    // }

    this.generateShippingAddressForm();
    this.generateFrieghtandlogistics();
    this.generateOthercost();
    this.generateExportregister();
    this.generateOtherOrderDetails();
    this.generateSupplierDescription();
    this.setUserCategoryValidators();
    this.userDetailsType();
    this.getOrganizations();
    this.getProductTypesData();
    this.getShipments();
    this.getTaxType();

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      let toast: object;
      let result = JSON.parse(response);
      if (result.result.data.error) {
        toast = { msg: result.result.data.error, status: "error" };
        this.snackbar.showSnackBar(toast);
        return;
      }
      this.getAddedFiles(this.shipmentType);
      this.getAttachmentsList();
    };

    setTimeout(() => {
      this.getUomData();
      this.getExportregister();
      if (
        this.orders.selectedOrder.orders_types_id == "14" ||
        this.orders.selectedOrder.orders_types_id == "4" ||
        this.orders.selectedOrder.orders_types_id == "3" ||
        this.orders.selectedOrder.orders_types_id == "6"
      ) {
        this.getOtherCosts();
      }
    }, 1000);
    let permission: boolean;
    App.user_roles_permissions.map(function (val) {
      if (val.code == "inventory") {
        permission = val.selected;
      }
    });
    this.isMerchantExporter = App.isMerchantExporter;
    // !permission;
  }
  receivedData: string;
  getTaxType(): void {
    let param = {
      type: 1,
    };
    this.OrdersService.getTaxTypesApi(param)
      .then((response) => {
        if (response.result.success) {
          this.taxType = response.result.data;
        }
      })
      .catch((error) => console.log(error));
  }

  receiveDataFromChild(data?) {
    if (data && data.flag === false) {
      this.selectedOrderStatus = data.status;
      this.orders.selectedOrder.orders_types_id = data.orders_types_id;
      this.orders.selectedOrder.status_color_code = data.status_color_code;
      this.showDrumsList = data.durm;
    }
    this.receivedData = data;

    if (data && data.flag === true) {
      this.container_strg = data.packages
        .map((value) => {
          return value.container_name;
        })
        .join(",");
      this.packagingDataAutomech =
        Number(data?.summary?.total_gross_weight) +
        Number(data?.summary?.total_tare_weight);

      this.packageDescription = data.summary?.description;
      this.pkgDeclaration = data.summary?.declaration;

      this.sum_ofGross = data.summary?.total_gross_weight;
      this.siDraft.gross_weight = data.summary?.total_gross_weight;
      this.siDraft.marks_and_nos = data.summary?.description;
      this.siDraft.no_of_packages = this.container_strg;
    }
  }

  /**freight adding containers */
  generateFreightDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      carrier_seal_number: [
        item?.carrier_seal_number != undefined ? item.carrier_seal_number : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      customs_seal_number: [
        item?.customs_seal_number != undefined ? item.customs_seal_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      rfid_number: [
        item?.rfid_number != undefined ? item.rfid_number : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      container_number: [
        item?.container_number != undefined ? item.container_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      type_of_container: [
        item?.type_of_container != undefined ? item.type_of_container : "",
      ],
      freight_cost_container: [
        item?.freight_cost_container != undefined
          ? item.freight_cost_container
          : "",
        Validators.pattern(/^[0-9.]*$/),
      ],
      transport_vehicle_number: [
        item?.transport_vehicle_number != undefined
          ? item.transport_vehicle_number
          : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      transport_cost_per_truck: [
        item?.transport_cost_per_truck != undefined
          ? item.transport_cost_per_truck
          : "",
        this.is_aapl ? [Validators.pattern(/^[0-9.]+$/)] : null,
      ],
      max_permissible_weight: [
        item?.max_permissible_weight != undefined
          ? item.max_permissible_weight
          : "",
        this.is_automech
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
    });
  }
  generateshippingDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      carrier_seal_number: [
        item?.carrier_seal_number != undefined ? item.carrier_seal_number : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      customs_seal_number: [
        item?.customs_seal_number != undefined ? item.customs_seal_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      rfid_number: [
        item?.rfid_number != undefined ? item.rfid_number : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      container_number: [
        item?.container_number != undefined ? item.container_number : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      type_of_container: [
        item?.type_of_container != undefined ? item.type_of_container : "",
      ],
      freight_cost_container: [
        item?.freight_cost_container != undefined
          ? item.freight_cost_container
          : "",
        Validators.pattern(/^[0-9.]*$/),
      ],
      transport_vehicle_number: [
        item?.transport_vehicle_number != undefined
          ? item.transport_vehicle_number
          : "",
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      transport_cost_per_truck: [
        item?.transport_cost_per_truck != undefined
          ? item.transport_cost_per_truck
          : "",
        this.is_aapl ? [Validators.pattern(/^[0-9.]+$/)] : null,
      ],
      max_permissible_weight: [
        item?.max_permissible_weight != undefined
          ? item.max_permissible_weight
          : "",
        this.is_automech
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
    });
  }
  addShippingContainer(value?) {
    this.shippingContainerArray = this.shippingContainer.get(
      "shippingContainerArray"
    ) as FormArray;
    this.shippingContainerArray.push(this.generateshippingDynamicForm(value));
  }
  addRowsFreightCost(value?) {
    this.freighContainerAtrray = this.freightContainerForm.get(
      "freighContainerAtrray"
    ) as FormArray;
    this.freighContainerAtrray.push(this.generateFreightDynamicForm(value));
    this.containerError = false;
    this.freightandlogisticsState = true;
  }
  deleteRowFreight(index) {
    this.freighContainerAtrray.removeAt(index);
    this.freightandlogisticsState = true;
    this.freightContainerForm.markAsDirty();
    this.freightandlogistics.markAsDirty();
  }
  /** PVM feature Inco Terms */
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
          this.incoTermsList = response.result.data.termsDt;
        }
      })
      .catch((error) => console.log(error));
  }

  public UomData = [];
  getUomData() {
    this.OrdersService.getUomData({}).then((response) => {
      if (response.result.success) {
        this.UomData = response.result.data;
        this.selectedUom = this.UomData[2].id;
        this.getPrimaryPackageData();
      }
    });
  }
  public selectedUom;
  public showUOMSavePanel = false;
  changeUomType(uom) {
    this.selectedUom = uom.id;
    this.showUOMSavePanel = true;
  }
  editformSdf() {
    if (!this.editable) {
      this.editable = true;
    } else {
      this.editable = false;
    }
  }
  saveUomData() {
    this.getPrimaryPackageData();
    this.showUOMSavePanel = false;
  }
  cancelUomChange() {
    this.selectedUom = this.UomData[2].id;
    this.showUOMSavePanel = false;
  }
  public primaryPackageData = [];
  getPrimaryPackageData() {
    let param = {
      uom_id: this.selectedUom,
      orders_id: this.orders.selectedOrder.id,
    };
    this.OrdersService.getPrimaryPackageData(param).then((response) => {
      if (response.result.success) {
        this.primaryPackageData = response.result.data;
      }
    });
  }
  public disabledSave = false;
  cancelPackages(): void {
    this.disabledSave = true;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: 5,
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.orders_types_id = "5";
        this.selectedOrderStatus = "Cancelled";
      } else {
        this.disabledSave = false;
      }
    });
  }
  editExportValue() {
    if (!this.editExport) {
      this.editExport = true;
    } else {
      this.editExport = false;
    }
  }
  deliverOrder(): void {
    this.editClosePOPup = true;
    // this.closeEditTax();
    // this.closeEdit();
    let dialogRef = this.dialog.open(DeliverOrderComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      height: "300px",
      data: {
        id: this.orders.selectedOrder.id,
        flag: this.selectedOrderStatus,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.selectedOrderStatus = "Delivered";
        this.orders.selectedOrder.status_color_code = "#9d573b";
        this.getOrdersActivityDetails();
        this.disablePayment = true;
        this.orders.selectedOrder.orders_types_id = "4";
      }
      this.editClosePOPup = false;
    });
  }
  sendMails(data?: any): void {
    this.editClosePOPup = true;
    // this.closeEditTax();
    // this.closeEdit();
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
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // let toast: object;
        // toast = { msg: 'The documents are being processed, we will notify you once the email has been sent.', status: 'success' };
        // this.snackbar.showSnackBar(toast);
        // this.OrdersService
        // 	.sendDocumentsMail({ orders_id: this.orders.selectedOrder.id, invoice_id: this.orders.invoice[0].Inovice.id })
        // 	.then(response => {
        // 		if (response.result.success) {
        // 			toast = { msg: 'Email has been sent successfully.', status: 'success' };
        // 			this.snackbar.showSnackBar(toast);
        // 		} else {
        // 			toast = { msg: 'Error Sending Email.', status: "error" };
        // 			this.snackbar.showSnackBar(toast);
        // 		}
        // 	});
        this.editClosePOPup = false;
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

    // this.checkOrders();
    // // let modelData = this.checkOrdersPdf;
    // let modelData = this.orders.selectedOrder.id;
    // let invoice_id =  this.orders.invoice[0].Inovice.id;
    // let dialogRef = this.dialog.open(OrderDownloadComponent, {
    // 	width: '550px',
    // 	data: { modelData, invoice_id}
    // });
    // dialogRef.afterClosed().subscribe(result => {
    // 	setTimeout(() => {
    // 		this.ordersDownload = false;

    // 	}, 3000);
    // });
  }
  public packageData = [];
  public containers = [];
  public defaultContainer = [];
  public defaultPackage = [];
  addBatchNumber(product: any, flag?): void {
    this.orders.packing.forEach((n) => {
      let batchData = n.batchesData;
      let defaultPacking;
      if (n.default_package && this.is_automech) {
        batchData.map((i) => {
          i.contains.forEach((val, index) => {
            if (index == 0) {
              defaultPacking = {
                tar_weight: val.tar_weight,
                container_uom_id: val.container_uom_id,
                dimensions: val.dimensions,
                height: val.height,
                weight: val.weight,
                container_uom_name: val.container_uom_name,
              };
            }
          });
        });
        if (defaultPacking) this.containers.push(defaultPacking);
      }
      if (product.id == n.productPackage.id && batchData.length) {
        batchData.map((i) => {
          this.containers = i.contains;
        });
      }
      batchData.map((i) => {
        let container_name = i.contains;
        container_name.map((v) => {
          if (v.packing_id == product.packing_id)
            this.containerId = v.packing_id;
        });
      });
    });

    // For Edit Packing
    if (flag == "edit") {
      let packing_id = 0;
      this.orders.invoice[0].productsData.map(function (value) {
        if (value.order_product_id == product.id) {
          packing_id = value.packing_id;
        }
      });
      product.packing_id = packing_id;
      this.containerId = packing_id;
    }
    product.product_quantity =
      product.productQty != undefined
        ? product.productQty
        : product.product_quantity;
    product.order_product_id =
      product.id != undefined ? product.id : product.order_product_id;
    let dialogRef;

    dialogRef = this.dialog.open(AddContainersComponent, {
      panelClass: "alert-dialog",
      width: "720px",
      data: {
        product: product,
        selectedOrder: this.orders.selectedOrder,
        container: this.containerId,
        flag: flag,
        containers: this.containers,
        isMerchantExporter: this.isMerchantExporter,
      },
      disableClose: true,
    });

    // if (!this.isMerchantExporter) {
    //   dialogRef = this.dialog.open(AddBatchNumberComponent, {
    //     panelClass: "alert-dialog",
    //     width: "550px",
    //     data: {
    //       product: product,
    //       selectedOrder: this.orders.selectedOrder,
    //       container: this.containerId,
    //       flag: flag,
    //       containers: this.containers,
    //       isMerchantExporter: this.isMerchantExporter,
    //     },
    //   });
    // } else {
    //   dialogRef = this.dialog.open(AddContainersComponent, {
    //     panelClass: "alert-dialog",
    //     width: "720px",
    //     data: {
    //       product: product,
    //       selectedOrder: this.orders.selectedOrder,
    //       container: this.containerId,
    //       flag: flag,
    //       containers: this.containers,
    //       isMerchantExporter: this.isMerchantExporter,
    //     },
    //   });
    // }
    // this.totalSpinner = true;
    dialogRef.afterClosed().subscribe((result) => {
      if (
        result?.["result"] &&
        result?.["result"]["result"].data.packageStatus == "2"
      ) {
        this.packageData = result.result.result.data.packageData;
        this.generateInvoice(false);
        this.orderDetails();
      } else if (result && result.success) {
        this.showDrumsList = true;
        this.getPackagingDetails();
        this.getPrimaryPackageData();
        this.downloadStatus = true;
        this.orderDetails();
        this.orderApiSuccess = true;
      }
      this.containers = [];
      // this.totalSpinner = false;
    });
  }
  public transportMode;
  selectShipping() {
    this.shippingActiveState = true;
  }
  selectFreight(data?: any) {
    this.freightandlogisticsState = true;
  }
  selectOthers() {
    this.othersCostState = true;
  }
  selectModeofshippingfreight(transportName) {
    if (transportName.id !== 1) {
      // this.showLUT = true;
      !this.is_automech &&
        this.freightandlogistics
          .get("number_of_containers")
          .setValidators([
            Validators.required,
            CustomValidation.noWhitespaceValidator,
          ]);
    } else {
      this.freightandlogistics.get("number_of_containers").clearValidators();
      this.freightandlogistics
        .get("number_of_containers")
        .updateValueAndValidity();
    }
    this.transportMode = transportName.name;
    this.freightandlogisticsState = true;
  }
  public otherOrderDetailsState: boolean = false;
  public showLUT: boolean = false;
  public showHAZ: boolean = false;

  public scometDD = [
    { name: "Yes", id: "yes" },
    { name: "No", id: "no" },
  ];

  public haz = [
    { name: "HAZ", id: "1" },
    { name: "NON-HAZ", id: "2" },
  ];

  selectTaxType(e) {
    if (this.is_aapl) {
      if (e.value === "Supply Meant for Export Under LUT") {
        this.showLUT = true;
        this.otherOrderDetailsForm
          .get("supplier_name")
          .setValidators([
            Validators.required,
            CustomValidation.noWhitespaceValidator,
          ]);
        this.otherOrderDetailsForm
          .get("supplier_name")
          .updateValueAndValidity();
        this.otherOrderDetailsForm
          .get("supplier_invoice_no")
          .setValidators([
            Validators.required,
            CustomValidation.noWhitespaceValidator,
          ]);
        this.otherOrderDetailsForm
          .get("supplier_invoice_no")
          .updateValueAndValidity();
        this.otherOrderDetailsForm
          .get("aapl_po_no")
          .setValidators([
            Validators.required,
            CustomValidation.noWhitespaceValidator,
          ]);
        this.otherOrderDetailsForm.get("aapl_po_no").updateValueAndValidity();
      } else {
        this.showLUT = false;
        this.otherOrderDetailsForm.get("supplier_name").clearValidators();
        this.otherOrderDetailsForm
          .get("supplier_name")
          .updateValueAndValidity();
        this.otherOrderDetailsForm.get("supplier_invoice_no").clearValidators();
        this.otherOrderDetailsForm
          .get("supplier_invoice_no")
          .updateValueAndValidity();
        this.otherOrderDetailsForm.get("aapl_po_no").clearValidators();
        this.otherOrderDetailsForm.get("aapl_po_no").updateValueAndValidity();
        this.otherOrderDetailsForm.get("is_haz").clearValidators();
        this.otherOrderDetailsForm.get("is_haz").updateValueAndValidity();
      }
    } else {
      this.otherOrderDetailsForm.get("supplier_name").clearValidators();
      this.otherOrderDetailsForm.get("supplier_name").updateValueAndValidity();
      this.otherOrderDetailsForm.get("supplier_invoice_no").clearValidators();
      this.otherOrderDetailsForm
        .get("supplier_invoice_no")
        .updateValueAndValidity();
      this.otherOrderDetailsForm.get("aapl_po_no").clearValidators();
      this.otherOrderDetailsForm.get("aapl_po_no").updateValueAndValidity();
      this.otherOrderDetailsForm.get("is_haz").clearValidators();
      this.otherOrderDetailsForm.get("is_haz").updateValueAndValidity();
      this.otherOrderDetailsForm.get("is_pharma").clearValidators();
      this.otherOrderDetailsForm.get("is_pharma").updateValueAndValidity();
      this.otherOrderDetailsForm.get("is_under_scomet").clearValidators();
      this.otherOrderDetailsForm
        .get("is_under_scomet")
        .updateValueAndValidity();
    }

    this.otherOrderDetailsState = true;
  }

  selectHAZType(e) {
    if (e.value === "yes") {
      this.showHAZ = true;
      this.otherOrderDetailsForm
        .get("is_haz")
        .setValidators([Validators.required]);
      this.otherOrderDetailsForm.get("is_haz").updateValueAndValidity();
    } else {
      this.showHAZ = false;
      this.otherOrderDetailsForm.get("is_haz").clearValidators();
      this.otherOrderDetailsForm.get("is_haz").updateValueAndValidity();
    }
  }
  selectShippingMode(transportName) {
    this.transportMode = transportName.name;
    this.shippingActiveState = true;
  }
  submmitExportRegister(form, event) {
    let toast: object;
    let params = form.value;
    if (params.leo_date)
      params.leo_date = moment(params?.leo_date).format("YYYY-MM-DD");
    params.orders_id = this.orders.selectedOrder.id;
    if (form.valid) {
      this.OrdersService.saveExportRegister(params).then((response) => {
        if (response.result.success) {
          this.exportRegisterForm.markAsPristine();
          toast = { msg: response.result.message, status: "success" };
          this.snackbar.showSnackBar(toast);
          this.getExportregister();
        }
      });
    }
  }
  getExportregister() {
    this.OrdersService.getexportRegister({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.exportRegisterForm.markAsPristine();
        this.setExportRegisterForm(response.result.data);
      }
    });
  }
  setExportRegisterForm(data) {
    this.exportRegisterForm.patchValue({
      draw_back_amount: data?.draw_back_amount,
      epcg_authorization_nbr: data?.epcg_authorization_nbr,
      exchange_rate_shippingbill: data?.exchange_rate_shippingbill,
      fob_fcc: data?.fob_fcc,
      fob_inr: data?.fob_inr,
      plant: data?.plant,
      port_code: data?.port_code,
      rodtep_amount_sanctioned: data?.rodtep_amount_sanctioned,
      leo_date:
        data?.leo_date != undefined
          ? moment(data?.leo_date).format("YYYY-MM-DD")
          : "",
    });
  }
  otherContainerFormValid(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index < this.othertransportForm.get("othercostArray")["controls"].length;
      index++
    ) {
      if (
        !this.othertransportForm.get("othercostArray")["controls"][index].valid
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }

  submmitOtherForm(form, event) {
    let toast: object;
    let params = form.value;
    params.transport_charges =
      this.othertransportForm.get("othercostArray").value;
    // event.target.disabled = true;
    params.orders_id = this.orders.selectedOrder.id;
    let status = 6;
    if (form.valid && this.otherContainerFormValid()) {
      this.OrdersService.saveOtherCosts(params).then((response) => {
        if (response.result.success) {
          if (this.orders.selectedOrder.orders_types_id == "14") {
            this.OrdersService.acceptOrder({
              id: this.orders.selectedOrder.id,
              orders_types_id: status,
              is_order_ready: true,
              confirm_sales: true,
            }).then((response) => {
              if (response.result.success) {
                this.freightContainerForm.markAsPristine();
                this.orders.selectedOrder.orders_types_id = "6";
                this.selectedOrderStatus = "Processed";
                this.orders.selectedOrder.status_color_code = "#008000";
                this.freightStatus = false;
              }
            });
          }
          toast = { msg: response.result.message, status: "success" };
          this.snackbar.showSnackBar(toast);
          this.othertransportForm.markAsPristine();
          this.otherCosts.markAsPristine();
          // this.getOtherCosts();
        } else {
          toast = { msg: "Failed to Saved Successfully.", status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    }
  }

  generatePvmForm(): void {
    this.pvmForm = this.formBuilder.group({
      mark_nos: [null],
      pre_carriage_by: [null],
      container_no: [null],
      lut_arn: [null],
      lut_date: [null],
      scheme: [null],
    });
  }

  generateIcttDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      // container_no:  '',
      // custom_seal:  '',
      // steamer_steal: '',
      // net_wt:  '',
      // gross_wt: '',
      // pkgs_count: '',
      container_no: item?.container_no != undefined ? item.container_no : "",
      custom_seal: item?.custom_seal != undefined ? item.custom_seal : "",
      steamer_steal: item?.steamer_steal != undefined ? item.steamer_steal : "",
      net_wt: item?.net_wt != undefined ? item.net_wt : "",
      gross_wt: item?.gross_wt != undefined ? item.gross_wt : "",
      pkgs_count: item?.pkgs_count != undefined ? item.pkgs_count : "",
    });
  }
  generateotherDynamicForm(item): FormGroup {
    return this.formBuilder.group({
      transport_charge: [
        item?.transport_charge != undefined ? item.transport_charge : "",
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      transport_refrence: [
        item?.transport_refrence != undefined ? item.transport_refrence : "",
        Validators.pattern(/^[0-9]+$/),
      ],
    });
  }

  generateSupplierDescription() {
    this.suppllierDocumentss = this.formBuilder.group({
      description: [null],
    });
  }
  generateShippingAddressForm(): void {
    this.shippingForm = this.formBuilder.group({
      aws_number: [null],
      bol_number: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
      road_number: [null],
      terms: [],
      mode_transport_id: [null, Validators.required],
      // transport_mode: [null],
      pre_carrier_place: [null],
      loading_port: [null],
      discharge_port: [null],
      transport_vehicle_no: [null],
      frieght_type: [null],
      stuffing_location: [null],
      final_destination: [null],
      transit_time: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\s'-]*$/),
          CustomValidation.noZeroValidator,
        ],
      ],
      freight_forwarder: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[A-Za-z0-9\s'-]*$/),
          CustomValidation.noZeroValidator,
        ],
      ],
      estimated_time: ["", [Validators.required]],
      total_freight_cost: [
        "",
        [
          Validators.required,
          CustomValidation.noWhitespaceValidator,
          Validators.pattern(/^[0-9.]+$/),
        ],
      ],
      // carrier_seal_nbr:[null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // customs_seal_nbr:[null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // rfid_number:[null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // container_nbr:[null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      sailing_date: ["", Validators.required],
      bl_date: [null],
      bl_type: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
          CustomValidation.noZeroValidator,
        ],
      ],
      air_date: [null],
      air_type: [
        null,
        [
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          CustomValidation.noZeroValidator,
        ],
      ],
      road_date: [null],
      road_type: [""],
      bill_no: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
      bill_date: [null],
      vessel_no: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
    });
    this.shippingForm2 = this.formBuilder.group({});
  }
  public nameValidators(control: FormControl) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { specialcharacters: true };
    }
  }
  generateFrieghtandlogistics(): void {
    this.freightandlogistics = this.formBuilder.group({
      transport_mode: [null, Validators.required],
      carrier: [null],
      location_stuffing: [null, Validators.required],
      precarriage_by: [null, this.is_automech ? [Validators.required] : null],
      place_of_reciept_pre_carrier: [
        null,
        this.is_automech ? [Validators.required] : null,
      ],
      epcg_lic: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      drawback_no: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      // compensation_cess_amt:[null, this.is_automech?[Validators.required,Validators.pattern(/^[A-Za-z0-9\s'-]*$/)]:null,],
      carrier_booking_rfno: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
      port_of_loading: [
        null,
        [Validators.required, CustomValidation.noZeroValidator],
      ],
      port_of_discharge: [
        null,
        [Validators.required, CustomValidation.noZeroValidator],
      ],
      // customs_seal_nbr: [null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // carrier_seal_nbr: [null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // rfid_number: [null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // container_nbr: [null,[Validators.required,CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      total_freight_cost: [null, [Validators.pattern(/^[0-9.]+$/)]],
      transport_vehicle_number: [
        null,
        this.is_automech
          ? [
              Validators.required,
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      final_destination: [
        null,
        [Validators.required, CustomValidation.noZeroValidator],
      ],
      sailing_date: [null],
      // freight_cost_container: [null,[Validators.required,CustomValidation.alphaValidator]],
      freight_cost_currency: [null],
      // transport_cost_per_truck: [null,[Validators.required,Validators.pattern(/^[0-9.]+$/),Validators.min(0)]],
      transporter_name: [
        null,

        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      number_of_trucks: [
        null,
        !this.is_automech ? [Validators.pattern(/^[0-9]+$/)] : null,
      ],
      freight_forwarder: [
        null,
        this.is_aapl
          ? [
              Validators.pattern(
                /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
              ),
            ]
          : null,
      ],
      number_of_containers: [null, [CustomValidation.notZeroValidator]],
      tax_other_information: [null],
      self_seal_number: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
    });
  }
  generateOthercost(): void {
    this.otherCosts = this.formBuilder.group({
      carrier_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
      cha_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
      cfs_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
      insurance_cost: [null, [CustomValidation.numericAndSpecialCharValidator]],
      coo_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
      coo_refrence: [null],
      palletization_cost: [
        null,
        [CustomValidation.numericAndSpecialCharValidator],
      ],
      palletization_refrence: [null],
      vochar_cost: [null, [CustomValidation.numericAndSpecialCharValidator]],
      vochar_refrence: [null],
      carrier_refrence: [null],
      cha_refrence: [null],
      cfs_refrence: [null],
      insurance_refrence: [null],
      // option_charge:[null,[CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
      // option_refrence:[null,[CustomValidation.noZeroValidator,CustomValidation.nameValidator]],
    });
  }

  generateExportregister(): void {
    this.exportRegisterForm = this.formBuilder.group({
      leo_date: [null],
      fob_inr: [null, [CustomValidation.numericAndSpecialCharValidator]],
      fob_fcc: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
      exchange_rate_shippingbill: [
        null,
        [CustomValidation.numericAndSpecialCharValidator],
      ],
      epcg_authorization_nbr: [
        null,
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      port_code: [
        null,
        Validators.pattern(
          /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
        ),
      ],
      draw_back_amount: [
        null,
        [CustomValidation.numericAndSpecialCharValidator],
      ],
      rodtep_amount_sanctioned: [
        null,
        [CustomValidation.numericAndSpecialCharValidator],
      ],
      plant: [
        null,
        [
          Validators.pattern(
            /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
          ),
        ],
      ],
    });
  }

  generateOtherOrderDetails(): void {
    this.otherOrderDetailsForm = this.formBuilder.group({
      standard_declaration: [null],
      standard_declaration_tax: [null],

      tax_type: [null, [Validators.required]],
      is_under_scomet: [null, this.is_aapl ? Validators.required : null],
      is_pharma: [null, this.is_aapl ? Validators.required : null],
      is_haz: [null],
      supplier_name: [null],
      supplier_invoice_no: [null],
      aapl_po_no: [null],
    });
  }

  addRowsotherCost(value?) {
    this.othercostArray = this.othertransportForm.get(
      "othercostArray"
    ) as FormArray;
    this.othercostArray.push(this.generateotherDynamicForm(value));
  }
  deleteRowOther(index) {
    this.othercostArray.removeAt(index);
    this.otherCosts.markAsDirty();
    this.othertransportForm.markAsDirty();
  }
  getProductTypesData(): void {
    this.organizationsService
      .getProductsList({ org_id: this.App.user_details.org_id })
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

  moveToSsi() {
    this.activateScroll = false;
    this.activeTab = "Ssi";
    if (this.Ssi && this.Ssi["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Ssi["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToUnit() {
    this.activateScroll = false;
    this.activeTab = "Unit";
    if (this.Unit && this.Unit["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Unit["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToSealed() {
    this.activateScroll = false;
    this.activeTab = "SealedReport";
    if (this.Unit && this.Unit["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Unit["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToDraftBl() {
    this.activateScroll = false;
    this.activeTab = "DraftBl";
    if (this.Unit && this.Unit["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Unit["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToShipperLetter() {
    this.activateScroll = false;
    this.activeTab = "Shippersletter";
    if (this.Shippersletter && this.Shippersletter["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Shippersletter["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToAdcSheet() {
    this.activateScroll = false;
    this.activeTab = "Adcsheet";
    if (this.Adcsheet && this.Adcsheet["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Adcsheet["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToIncentive() {
    this.activateScroll = false;
    this.activeTab = "Incentivedeclaration";
    if (
      this.Incentivedeclaration &&
      this.Incentivedeclaration["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Incentivedeclaration["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToScomat() {
    this.activateScroll = false;
    this.activeTab = "Scomatdeclaration";
    if (
      this.Scomatdeclaration &&
      this.Scomatdeclaration["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Scomatdeclaration["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToConcern() {
    this.activateScroll = false;
    this.activeTab = "Concern";
    if (this.Concern && this.Concern["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Concern["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToAdcode() {
    this.activateScroll = false;
    this.activeTab = "Adcode";
    if (this.Adcode && this.Adcode["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Adcode["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveTonoScometdecl() {
    this.activateScroll = false;
    this.activeTab = "Nonscometdecl";
    if (this.Nonscometdecl && this.Nonscometdecl["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Nonscometdecl["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveTonoadcdecl() {
    this.activateScroll = false;
    this.activeTab = "AdcDecl";
    if (this.AdcDecl && this.AdcDecl["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.AdcDecl["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToNdpsdecl() {
    this.activateScroll = false;
    this.activeTab = "NdpsDeclration";
    if (this.NdpsDeclration && this.NdpsDeclration["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.NdpsDeclration["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToDGR() {
    this.activateScroll = false;
    this.activeTab = "Dgrdecl";
    if (this.Dgrdecl && this.Dgrdecl["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Dgrdecl["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToAdcSheetAdcDocs() {
    this.activateScroll = false;
    this.activeTab = "AdcsheetAdcDocs";
    if (
      this.AdcsheetAdcDocs &&
      this.AdcsheetAdcDocs["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.AdcsheetAdcDocs["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  public shipmentType;
  setAddedFilesUrl(flag) {
    if (flag == "origin") {
      this.imagUploadFlag = "country";
    } else if (flag == "insuranceFlag") {
      this.imagUploadFlag = "insurance";
    } else if (flag == "shipping") {
      this.imagUploadFlag = "shipping";
    } else if (flag == "landing") {
      this.imagUploadFlag = "landing";
    } else if (flag == "supplier") {
      this.imagUploadFlag = "supplier";
    } else if (flag == "sales") {
      this.imagUploadFlag = "sales";
    } else if (flag == "otherOrder") {
      this.imagUploadFlag = "otherOrder";
    } else {
      this.imagUploadFlag = "Bill";
    }
    this.shipmentType = flag;
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
  public addContainer = [];
  public payload;
  public vessel_no;
  public final_destination;
  setFreightForm(data) {
    this.port_of_loadinginpdf = data?.port_of_loading;
    this.port_of_dischargepdf = data?.port_of_discharge;
    this.final_destination = data?.final_destination;
    this.freightandlogistics.patchValue({
      transport_cost_per_truck: data?.transport_cost_per_truck,
      location_stuffing: data?.location_stuffing,
      carrier_booking_rfno: data?.carrier_booking_rfno,
      // freight_cost_container:data?.freight_cost_container,
      number_of_containers: data?.number_of_containers,
      transport_vehicle_number: data?.transport_vehicle_number,
      freight_cost_currency: data?.freight_cost_currency,
      total_freight_cost: data?.total_freight_cost,
      transporter_name: data?.transporter_name,
      port_of_discharge: data?.port_of_discharge,
      final_destination: data?.final_destination,
      precarriage_by: data?.precarriage_by,
      compensation_cess_amt: data?.compensation_cess_amt,
      epcg_lic: data?.epcg_lic,
      drawback_no: data?.drawback_no,
      place_of_reciept_pre_carrier: data?.place_of_reciept_pre_carrier,
      port_of_loading: data?.port_of_loading,
      transport_mode: data?.mode_of_shipment,
      carrier: data?.carrier,
      number_of_trucks: data?.number_of_trucks,
      // sailing_date:data.sailing_date != undefined ? new Date(data?.sailing_date) :'',
      sailing_date: data?.sailing_date,
      // sailing_date: data.sailing_date != null ? new Date(data?.sailing_date) :'',
      freight_forwarder: data?.freight_forwarder,
      tax_other_information: data?.tax_other_information,
      self_seal_number: data?.self_seal_number,
    });
    if (data?.mode_of_shipment == 1) {
      this.freightandlogistics.get("number_of_containers").clearValidators();
      this.freightandlogistics
        .get("number_of_containers")
        .updateValueAndValidity();
    }
  }
  setcontainerForm(data) {
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addRowsFreightCost(value);
      });
    }
  }
  setShippingContainer(data) {
    while (this.shippingContainerArray?.length > 0) {
      this.shippingContainerArray.removeAt(0);
    }
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addShippingContainer(value);
      });
    }
  }
  areAllControlsValid(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index <
      this.freightContainerForm.get("freighContainerAtrray")["controls"].length;
      index++
    ) {
      if (
        !this.freightContainerForm.get("freighContainerAtrray")["controls"][
          index
        ].valid
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }
  public saveSubmmitFreight;
  submmitFreightcost(form): void {
    // this.areAllControlsValid()
    let toast: object;
    this.submitFreightForm = true;
    if (
      !this.freighContainerAtrray?.value.length &&
      this.mode_shippiment !== 1
    ) {
      this.containerError = true;
    }
    // this.sailingDate =moment(this.freightandlogistics.value.sailing_date).format('YYYY-MM-DD');

    const rawBillDate = this.freightandlogistics.get("sailing_date").value;
    const isValidDate = moment(rawBillDate, "YYYY-MM-DD", true).isValid();
    if (isValidDate) {
      this.sailingDate = moment(rawBillDate).format("YYYY-MM-DD");
    } else {
    }
    if (form.valid && !this.containerError && this.areAllControlsValid()) {
      // this.totalSpinner = true;
      this.saveSubmmitFreight = true;

      this.addContainer = this.freightContainerForm.get(
        "freighContainerAtrray"
      ).value;
      this.OrdersService.generateSavefreight({
        transport_mode: this.freightandlogistics.value.transport_mode,
        orders_id: this.orders.selectedOrder.id,
        carrier: this.freightandlogistics.value.carrier,
        location_stuffing: this.freightandlogistics.value.location_stuffing,
        carrier_booking_rfno:
          this.freightandlogistics.value.carrier_booking_rfno,
        port_of_loading: this.freightandlogistics.value.port_of_loading,
        port_of_discharge: this.freightandlogistics.value.port_of_discharge,
        total_freight_cost: this.freightandlogistics.value.total_freight_cost,
        transport_vehicle_number:
          this.freightandlogistics.value.transport_vehicle_number,
        final_destination: this.freightandlogistics.value.final_destination,
        precarriage_by: this.freightandlogistics.value.precarriage_by,
        compensation_cess_amt:
          this.freightandlogistics.value.compensation_cess_amt,
        epcg_lic: this.freightandlogistics.value.epcg_lic,
        drawback_no: this.freightandlogistics.value.drawback_no,
        place_of_reciept_pre_carrier:
          this.freightandlogistics.value.place_of_reciept_pre_carrier,
        sailing_date: this.sailingDate,
        // freight_cost_container:this.freightandlogistics.value.freight_cost_container ,
        freight_cost_currency:
          this.freightandlogistics.value.freight_cost_currency,
        transport_cost_per_truck:
          this.freightandlogistics.value.transport_cost_per_truck,
        transporter_name: this.freightandlogistics.value.transporter_name,
        number_of_trucks: this.freightandlogistics.value.number_of_trucks,
        freight_forwarder: this.freightandlogistics.value.freight_forwarder,
        number_of_containers:
          this.freightandlogistics.value.number_of_containers,
        tax_other_information:
          this.freightandlogistics.value.tax_other_information,
        self_seal_number: this.freightandlogistics.value.self_seal_number,
        containers: this.addContainer,
      }).then((response) => {
        if (response.result.success) {
          toast = {
            msg: "Freight Details Updated Successfully.",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.freightandlogisticsState = false;
          // this.freightandlogisticsState=false;
          if (this.orders.selectedOrder.orders_types_id == "11") {
            this.saveFreight = true;
            console.log(this.saveFreight);
          }
          this.freightContainerForm.markAsPristine();
          this.freightandlogistics.markAsPristine();
          while (this.shippingContainerArray?.length > 0) {
            this.shippingContainerArray.removeAt(0);
          }
          while (this.freighContainerAtrray?.length > 0) {
            this.freighContainerAtrray.removeAt(0);
          }
          this.getFreightForm();
          this.getShippingAddressDetails();
          this.saveSubmmitFreight = false;
        } else {
          toast = { msg: "Failed To Save Freight Details.", status: "error" };
          this.snackbar.showSnackBar(toast);
          this.saveSubmmitFreight = false;
        }
      });
    }
  }

  public shipcontainers;
  public dgrDocumnetshipment;
  public contaierNumber;
  public container_nbr;
  public custom_seal_nbr;
  public carrier_seal_nbr;
  public max_permissble;
  public showMSDS = true;
  public showICTT = true;
  public showNonHaz = true;
  public showSDF = true;
  public showEVD = true;
  public showDec = true;
  public showSSC = true;
  public showSSL = true;
  public showADC = true;
  public showDFI = true;
  public showSD = true;
  public showTOD = true;
  public showADCode = true;
  public showSSI = true;
  public showCHK = true;
  public showSSR = true;
  public showDBL = true;
  public showRODTEP = true;
  public showVGMD = true;
  public showCHA = true;
  public showSSCON = true;
  public showSID = true;
  public showFEMA = true;
  type_size;
  getFreightForm() {
    this.OrdersService.getfreight({ orders_id: this.data.id }).then(
      (response) => {
        if (response.result.success) {
          this.freightData = response.result.data.freightDt;
          this.freightDataPack = response.result.data.freightDt;
          setTimeout(() => {
            if (
              response.result.data.freightDt.id &&
              (this.orders.selectedOrder.orders_types_id >= "11" ||
                this.orders.selectedOrder.orders_types_id == "6" ||
                this.orders.selectedOrder.orders_types_id == "4")
            ) {
              this.saveFreight = true;
              console.log(this.saveFreight);
            }
          }, 1000);
          this.orders.mode_of_transport.forEach((e) => {
            if (e.id === response.result.data.freightDt.mode_of_shipment) {
              this.dgrDocumnetshipment = e.name;
            }
          });
          this.setFreightForm(response.result.data.freightDt);
          // this.sailing_date=new Date(response.result.data.freightDt?.sailing_date)
          this.setcontainerForm(response.result.data.freightDt?.containers);
          const containers = response.result.data.freightDt?.containers;
          const stuff_type = response.result.data.freightDt?.type;
          if (containers) {
            if (containers.length > 1) {
              this.container_nbr = containers
                .map((item) => item.container_number)
                .join(", ");
              this.max_permissble = containers
                .map((item) => item.max_permissible_weight)
                .join(", ");
              this.type_size = containers
                .map((item) => item.type_of_container)
                .join(", ");
              this.custom_seal_nbr = containers
                .map((item) => item.customs_seal_number)
                .join(", ");
              this.carrier_seal_nbr = containers
                .map((item) => item.carrier_seal_number)
                .join(", ");
              // Remove trailing commas for non-empty strings
              this.container_nbr = this.container_nbr.replace(/, $/, "");
              this.custom_seal_nbr = this.custom_seal_nbr.replace(/, $/, "");
              this.carrier_seal_nbr = this.carrier_seal_nbr.replace(/, $/, "");
              this.max_permissble = this.max_permissble.replace(/, $/, "");
              this.type_size = this.type_size.replace(/, $/, "");
            } else if (containers.length === 1) {
              const singleContainer = containers[0];
              this.container_nbr = singleContainer.container_number;
              this.max_permissble = singleContainer.max_permissible_weight;
              this.type_size = singleContainer.type_of_container;
              this.custom_seal_nbr = singleContainer.customs_seal_number;
              this.carrier_seal_nbr = singleContainer.carrier_seal_number;
            } else {
              this.container_nbr = "";
              this.max_permissble = "";
              this.type_size = "";
              this.custom_seal_nbr = "";
              this.carrier_seal_nbr = "";
            }
          } else {
            this.container_nbr = "";
            this.max_permissble = "";
            this.type_size = "";
            this.custom_seal_nbr = "";
            this.carrier_seal_nbr = "";
          }
          if (this.is_aapl) {
            this.showEVD =
              this.showSD =
              this.showRODTEP =
              this.showCHA =
              this.showSID =
                true;
            // Set multiple variables to false

            this.showMSDS =
              this.showICTT =
              this.showNonHaz =
              this.showSDF =
              this.showDec =
              this.showSSC =
              this.showSSL =
              this.showADC =
              this.showDFI =
              this.showTOD =
              this.showADCode =
              this.showSSI =
              this.showCHK =
              this.showSSR =
              this.showVGMD =
              this.showDBL =
              this.showSSCON =
              this.showFEMA =
                false;
            if (stuff_type === "factory_stuffing") {
              this.showVGMD = this.showSSCON = true;
            }
          }
        }
      }
    );
  }
  getContainerTypes(containers: any[]): string {
    // Use optional chaining (?) to handle potential null or undefined values
    return containers
      ?.map((container) => container?.container_number)
      .join(", ");
  }
  public showEditIcon = true;
  public shipContainer;
  shippingcontainervalidator(): boolean {
    let isvalid = true;
    for (
      let index = 0;
      index <
      this.shippingContainer.get("shippingContainerArray")["controls"].length;
      index++
    ) {
      if (
        !this.shippingContainer.get("shippingContainerArray")["controls"][index]
          .valid
      ) {
        isvalid = false;
      }
    }
    return isvalid;
  }
  public shipingDate;
  public disableSaveShipping;
  saveShippingAddress(form): void {
    // this.disableSaveShipping = true;
    this.setUserCategoryValidators();
    this.submitShippingForm = true;
    // this.shippingForm.get('transport_mode').markAsTouched({ onlySelf: true });
    this.shippingForm
      .get("mode_transport_id")
      .markAsTouched({ onlySelf: true });
    this.shippingForm.get("aws_number").markAsTouched({ onlySelf: true });
    // this.shippingForm.get('bol_number').markAsTouched({ onlySelf: true });
    this.shippingForm.get("road_number").markAsTouched({ onlySelf: true });
    this.shippingForm
      .get("pre_carrier_place")
      .markAsTouched({ onlySelf: true });
    this.estimatedDate = moment(this.shippingForm.value.estimated_time).format(
      "YYYY-MM-DD"
    );
    this.shippingOnBoard = moment(this.shippingForm.value.sailing_date).format(
      "YYYY-MM-DD"
    );
    // this.shipingDate =moment(this.shippingForm.value.bill_date).format('YYYY-MM-DD');
    const rawBillDate = this.shippingForm.get("bill_date").value;
    const validBillLading = this.shippingForm.get("bl_date").value;
    const validAirWay = this.shippingForm.get("air_date").value;
    const isValidDate = moment(rawBillDate, "YYYY-MM-DD", true).isValid();
    const isValidDateBillLading = moment(
      validBillLading,
      "YYYY-MM-DD",
      true
    ).isValid();
    const isValidDateAirbill = moment(
      validAirWay,
      "YYYY-MM-DD",
      true
    ).isValid();
    if (isValidDateBillLading) {
      this.billLading = moment(validBillLading).format("YYYY-MM-DD");
    } else {
    }
    if (isValidDateAirbill) {
      this.Airwaybill = moment(validAirWay).format("YYYY-MM-DD");
    } else {
    }
    if (isValidDate) {
      this.shipingDate = moment(rawBillDate).format("YYYY-MM-DD");
    } else {
    }
    let toast: object;
    if (form.valid && this.shippingcontainervalidator()) {
      this.totalSpinner = true;
      this.shippingActiveState = false;
      this.disableSaveShipping = true;
      this.invoiceGenerateLoader = true;
      this.shipContainer = this.shippingContainer.get(
        "shippingContainerArray"
      ).value;
      this.OrdersService.addInvoiceShipping({
        id: this.orders.shipping_id,
        invoice_id: this.orders.invoice[0].Inovice.id,
        // terms: this.shippingForm.value.terms,
        // transport_mode: this.shippingForm.value.transport_mode,
        // mode_transport_id: this.shippingForm.value.mode_transport_id,
        // shipping_id: this.shippingForm.value.aws_number,
        // bol_id: this.transportMode == 'Sea' ? this.shippingForm.value.bol_number : this.shippingForm.value.road_number,
        // pre_carrier_place: form.value?.pre_carrier_place,
        // loading_port: form.value?.loading_port,
        // final_destination:form.value ?.final_destination,
        // discharge_port: form.value?.discharge_port,
        // transport_vehicle_no: form.value?.transport_vehicle_no,
        // frieght_type: form.value?.frieght_type,
        // stuffing_location: form.value?.stuffing_location,
        estimated_time: this.estimatedDate,
        total_freight_cost: form.value?.total_freight_cost,
        transit_time: form.value?.transit_time,
        mode_transport_id: form.value?.mode_transport_id,
        sailing_date: this.shippingOnBoard,
        bl_date: this.billLading,
        bl_type: form.value?.bl_type,
        air_date: this.Airwaybill,
        air_type: form.value?.air_type,
        road_date: form.value?.road_date,
        road_type: form.value?.road_type,
        container: this.shipContainer,
        shipping_id: form.value?.aws_number,
        bol_id: form.value?.bol_number,
        road_number: form.value?.road_number,
        freight_forwarder: form.value?.freight_forwarder,
        bill_no: form.value?.bill_no,
        bill_date: this.shipingDate,
        vessel_no: form.value?.vessel_no,
      }).then((response) => {
        if (response.result.success) {
          this.invoiceGenerateLoader = false;

          this.submitShippingForm = false;
          // this.totalSpinner = false;
          if (response.result.success) {
            this.totalSpinner = false;
            this.sendDocumentMails = true;
            this.orders.shipping_id = response.result.data.shipDt.id;
            toast = {
              msg: "Shipping Details Saved Successfully.",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
            this.selectedOrderStatus = response.result.data.shipDt.status;
            this.orders.selectedOrder.orders_types_id =
              response.result.data.shipDt.orders_types_id;
            // this.editShipping = false;
            // this.enableCustomDocs=true;
            this.shippingForm.markAsPristine();
            this.shippingContainer.markAsPristine();
            while (this.freighContainerAtrray?.length > 0) {
              this.freighContainerAtrray.removeAt(0);
            }
            this.getFreightForm();
            if (this.shippingContainerArray?.length > 0) {
              while (this.shippingContainerArray?.length > 0) {
                this.shippingContainerArray.removeAt(0);
              }
            }
            this.getShippingAddressDetails();
            // this.orders.selectedOrder.status = 'In-transit';
            this.showEditIcon = false;
            this.disableSaveShipping = false;
          }
        } else {
          this.totalSpinner = false;
          this.sendDocumentMails = true;
          this.showEditIcon = true;
          this.editShipping = false;
          toast = { msg: "Failed to Save Shipping Details.", status: "error" };
          this.snackbar.showSnackBar(toast);
          while (this.shippingContainerArray.length > 0) {
            this.shippingContainerArray.removeAt(0);
          }
          this.getShippingAddressDetails();
          this.disableSaveShipping = false;
        }
      });
    }
  }
  public disableFreecharge = true;
  generateInvoice(name: any) {
    this.invoiceGenerateLoader = true;
    this.clickedGenerateInvoice = true;
    this.totalSpinner = true;
    this.OrdersService.generateInvoice({
      orders_id: this.orders.selectedOrder.id,
      is_proforma_inv: name,
    }).then((response) => {
      this.hideShipperAddress = true;
      this.totalSpinner = false;
      this.is_automech
        ? (this.orders.selectedOrder.orders_types_id = "2")
        : (this.orders.selectedOrder.orders_types_id = "8");
      this.getInvoiceData();

      this.clickedGenerateInvoice = false;
      this.is_automech
        ? (this.selectedOrderStatus = "Accepted")
        : (this.selectedOrderStatus = "Confirmation-Pending");
      this.is_automech
        ? (this.orders.selectedOrder.status_color_code = "#0000FF")
        : (this.orders.selectedOrder.status_color_code = "#ffe600");
      this.salesContractdisable = false;
      if (this.packageData.length) {
        this.addAllPackage();
      }
      // calling only automech
      if (this.is_automech) {
        // 	this.selectedOrderStatus = 'Order Ready';
        // this.orders.selectedOrder.status_color_code = '#ce1c44';
        // this.orders.selectedOrder.orders_types_id = '10';
        this.setOrderReady(name);
      }
    });
  }

  addAllPackage() {
    let params = {
      packageData: this.packageData,
      orders_id: this.orders.selectedOrder.id,
    };
    this.OrdersService.addOrdAllPackages(params).then((response) => {
      this.getPackagingDetails();
    });
  }
  public clickedProformaInvoice = false;
  generateProformaInvoice(name: any) {
    this.invoiceGenerateLoader = true;
    this.clickedProformaInvoice = true;
    this.totalSpinner = true;
    let params = {
      orders_id: this.orders.selectedOrder.id,
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
      this.selectedOrderStatus = "Processed";
    });
  }
  public proformaInvData = [];
  public enableProforma = false;
  public inv_placement;
  getProformaInvoiceData() {
    // this.enableProforma = true;
    // this.getOrdersActivityDetails();
    // this.selectedOrderStatus = 'Processing';

    this.OrdersService.getProfInv({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.data.length) {
        this.invoiceGenerateLoader = false;
        this.hideShipperAddress = true;
        this.enableProforma = true;
        this.proformaInvData = response.result.data;
        this.inv_placement = this.proformaInvData[0].profInv.placement;
      }
    });
  }
  gentaxInvoice() {
    this.invoiceGenerateLoader = true;
    this.clickedGenerateTaxInvoice = true;
    this.totalSpinner = true;
    this.OrdersService.generateTaxInvoice({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        setTimeout(() => {
          this.showDotTax = true;
        }, 100);
        this.showDotTax = false;
        this.hideShipperAddress = true;
        this.totalSpinner = false;
        // this.orders.selectedOrder.orders_types_id = '6';
        this.getTaxInv();
        this.taxInvoiceShow = false;
        this.clickedGenerateTaxInvoice = false;
        // this.selectedOrderStatus = 'Processing';
        if (this.productTax !== 0.1) {
          this.genIgstInvoice();
        }
      }
    });
  }
  public bankDetails;
  getbankDetails() {
    this.OrdersService.generateBank({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      this.bankDetails = response.result.data;
    });
  }
  genIgstInvoice() {
    this.invoiceGenerateLoader = true;
    this.clickedGenerateIGSTInvoice = true;
    this.totalSpinner = true;
    this.OrdersService.generateIgstInvoice({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        setTimeout(() => {
          this.showDotTax = true;
        }, 100);
        this.showDotTax = false;
        this.hideShipperAddress = true;
        this.totalSpinner = false;
        // this.orders.selectedOrder.orders_types_id = '6';
        this.getIgstInv();
        this.igstInvoiceShow = false;
        this.clickedGenerateIGSTInvoice = false;
        // this.selectedOrderStatus = 'Processing';
      }
    });
  }
  paidInvoice() {
    let dialogRef = this.dialog.open(MarkAsPaidComponent, {
      width: "700px",
      data: "",
      disableClose: true,
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
  getOrganizations() {
    this.param.search = "";
    this.organizationsService
      .getOrganizationsList(this.param)
      .then((response) => {
        if (response.result.success) {
          this.orders.organizations = response.result.data.organization;
        }
      });
  }

  setUserCategoryValidators() {
    const AWSCtrl = this.shippingForm.get("aws_number");
    const BOLCtrl = this.shippingForm.get("bol_number");
    const ROADCtrl = this.shippingForm.get("road_number");

    // this.shippingForm.get('transport_mode').valueChanges
    // 	.subscribe(userCategory => {
    // 		if (userCategory == 1) {
    // 			BOLCtrl.setValidators(null);
    // 			AWSCtrl.setValidators([Validators.required]);
    // 			ROADCtrl.setValidators(null);
    // 		} else if (userCategory == 15 || userCategory == 16) {
    // 			BOLCtrl.setValidators(null);
    // 			AWSCtrl.setValidators(null);
    // 			ROADCtrl.setValidators([Validators.required]);
    // 		} else {
    // 			AWSCtrl.setValidators(null);
    // 			BOLCtrl.setValidators([Validators.required]);
    // 			ROADCtrl.setValidators(null);
    // 		}

    // 		AWSCtrl.updateValueAndValidity();
    // 		BOLCtrl.updateValueAndValidity();
    // 	})
  }
  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }
  public productDetails = "";
  public productId;
  public totalorderdetails;
  public orderApiSuccess: boolean = false;
  public package: boolean = true;
  public orderDatapassing;
  orderDetails() {
    // // stepper.next();
    // this.totalSpinner = true;
    // let showDocs;
    // let tax;
    // this.data.id = this.data.id;
    // this.fetchingData = true;
    // this.selectedOrderStatus = "";
    // this.orders.notifyAddr = {};
    // // this.enableInvoice = false;
    // // this.priceQuantityDisable = false;
    // this.OrdersService.getOrdersList(this.data).then(async (response) => {
    //   this.totalSpinner = false;
    //   if (response.result.data.totalordersDt.length) {
    //     this.showNoDatFound = false;
    //   } else {
    //     this.showNoDatFound = true;
    //   }
    //   let selectedOrderDetails =
    //     response.result.data?.totalordersDt[0]?.list[0];
    //   this.order_no_po = selectedOrderDetails.orders;
    //   this.orderId = selectedOrderDetails.orders.id;
    //   this.totalorderdetails =
    //     response.result.data.totalordersDt[0].list[0].orders;
    //   this.mode_shippiment =
    //     response.result.data.totalordersDt[0].list[0].orders.mode_transport_id;
    //   if (this.mode_shippiment != 1) {
    //     !this.is_automech &&
    //       this.freightandlogistics
    //         .get("number_of_containers")
    //         .setValidators([
    //           Validators.required,
    //           CustomValidation.noWhitespaceValidator,
    //         ]);
    //   }
    //   this.orderStatuses = response.result.data.ordersTypesDt;
    //   if (this.orderApiSuccess) {
    //     setTimeout(() => {
    //       this.moveToPackaging();
    //     }, 200);
    //     this.orderApiSuccess = false;
    //   }
    //   this.productDetails = selectedOrderDetails
    //     ? selectedOrderDetails.productsDetails
    //     : "";
    //   if (selectedOrderDetails.orders.line_item) {
    //     this.saveAddLineItem = true;
    //   } else {
    //     this.saveAddLineItem = false;
    //   }
    //   this.orderDatapassing = { ...selectedOrderDetails.orders };
    //   // this.package=!this.package
    //   let showTax =
    //     response.result.data.totalordersDt[0].list[0].ksmAddr.ksm_postal_code;
    //   this.orders.selectedOrder = selectedOrderDetails.orders;
    //   this.originalOrdersData = { ...this.orders.selectedOrder };
    //   this.po_date2 = new Date(
    //     this.orders.selectedOrder.po_date
    //       ? this.orders.selectedOrder.po_date
    //       : ""
    //   );
    //   this.timeout = setTimeout(() => {
    //     this.selectedOrderStatus = this.orders.selectedOrder.status;
    //   }, 100);
    //   this.orders.billingAddr = selectedOrderDetails.billingAddr;
    //   this.orders.shippingAddr = selectedOrderDetails.shippingAddr;
    //   if (selectedOrderDetails.notifyingAddr) {
    //     this.showNotifyAddress = true;
    //     this.orders.notifyAddr = Object.assign(
    //       selectedOrderDetails.notifyingAddr
    //     );
    //   } else {
    //     this.showNotifyAddress = false;
    //     this.orders.notifyAddr = {};
    //   }
    //   this.originalOrdersProductData = selectedOrderDetails.productsData.map(
    //     (data: any) => ({ ...data })
    //   );
    //   this.orders.productsData.data = selectedOrderDetails.productsData;
    //   this.orders.productsData.data.map((x: any, i: any) => {
    //     this.productDescription = x.p_description;
    //     this.productId = x.product_id;
    //     // this.freightStatus=false;
    //   });
    //   if (this.orders.selectedOrder.orders_types_id >= "2") {
    //     this.salesContractdisable = false;
    //   }
    //   if (
    //     this.orders.selectedOrder.orders_types_id >= "11" &&
    //     this.orders.selectedOrder.orders_types_id != "4" &&
    //     this.orders.selectedOrder.orders_types_id != "6"
    //   ) {
    //     this.freightStatus = false;
    //   }
    //   if (
    //     this.orders.selectedOrder.orders_types_id < "11" &&
    //     this.orders.selectedOrder.orders_types_id != "4" &&
    //     this.orders.selectedOrder.orders_types_id != "6"
    //   ) {
    //     this.customSidePannel = false;
    //   }
    //   this.setPvmForm(selectedOrderDetails);
    //   selectedOrderDetails.productsData.map(function (value) {
    //     if (
    //       value.category_name.includes("Vegan") ||
    //       value.category_name.includes(
    //         "Organic KSM-66 Ashwagandha Extract - 80 Mesh" ||
    //           value.category_name.includes(
    //             "Organic KSM-66 Ashwagandha Extract -300 Mesh"
    //           )
    //       )
    //     ) {
    //       showDocs = true;
    //     }
    //     if (value.category_name.includes("spectrum")) {
    //       // this.containsMilk = true;
    //     }
    //   });
    //   if (showDocs == true) {
    //     this.showDocuments = showDocs;
    //   }
    //   if (showTax == 500001) {
    //     this.taxInvoiceDocument = true;
    //   } else {
    //     this.taxInvoiceDocument = false;
    //   }
    //   this.orders.companyShpAddrDt = selectedOrderDetails.ksmAddr;
    //   this.getOtherOrderDetails();
    //   this.getAttachmentsList();
    //   this.onLoadFiles.forEach((element) => {
    //     this.getAddedFiles(element);
    //   });
    //   this.getReportsData();
    //   this.getOrdersActivityDetails();
    //   this.getOrdersSdf();
    //   this.getOrdersExport();
    //   this.getOrdersConcern();
    //   this.getbankDetails();
    //   // this.getAdcSheetinfo();
    //   // this.getSiDraft();
    //   this.sdfFormData();
    //   if (this.orders.selectedOrder.orders_types_id != "1") {
    //     await this.getPackagingDetails();
    //     if (this.is_ictt) this.getIcttData();
    //   }
    //   if (
    //     this.orders.selectedOrder.orders_types_id > "2" &&
    //     this.orders.selectedOrder.orders_types_id != "5"
    //   ) {
    //     await this.getInvoiceData();
    //     await this.getSiDraft();
    //   }
    //   this.getProformaInvoiceData();
    //   this.fetchingData = false;
    //   if (
    //     this.selectedOrderStatus != "In-transit" &&
    //     this.selectedOrderStatus != "cancel" &&
    //     this.selectedOrderStatus != "Delivered"
    //   ) {
    //     this.disablePayment = false;
    //   } else {
    //     this.disablePayment = true;
    //   }
    //   if (
    //     this.orders.selectedOrder.orders_types_id == "1" ||
    //     this.orders.selectedOrder.orders_types_id == "2" ||
    //     this.orders.selectedOrder.orders_types_id == "6" ||
    //     this.orders.selectedOrder.orders_types_id == "8"
    //   ) {
    //     this.sendDocumentMails = false;
    //   } else {
    //     this.sendDocumentMails = true;
    //   }
    //   if (
    //     this.orders.selectedOrder.orders_types_id >= "12" &&
    //     !this.is_automech &&
    //     !this.isSampleDocs &&
    //     this.factoryPermission &&
    //     !this.clientPermission
    //   ) {
    //     this.preShipDocs = true;
    //   }
    //   if (
    //     (this.orders.selectedOrder.orders_types_id == "14" ||
    //       this.orders.selectedOrder.orders_types_id == "6" ||
    //       this.orders.selectedOrder.orders_types_id == "4") &&
    //     !this.isSampleDocs &&
    //     this.factoryPermission &&
    //     !this.clientPermission
    //   ) {
    //     this.preShipDocs = true;
    //     this.postShipDocs = true;
    //   }
    //   if (this.is_automech && this.preShipDocs) {
    //     this.customDocs = true;
    //   }
    //   if (
    //     this.is_aapl &&
    //     (this.orders.selectedOrder.orders_types_id >= "12" ||
    //       this.orders.selectedOrder.orders_types_id == "6" ||
    //       this.orders.selectedOrder.orders_types_id == "4")
    //   ) {
    //     this.customDocs = true;
    //   }
    // });
  }

  setPvmForm(orderDetails: any) {
    this.pvmForm.patchValue({
      pre_carriage_by: "",
      mark_nos: "",
      container_no: "",
      scheme: "",
    });
  }

  getAttachmentsList() {
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
  public supplierDescr;
  getAddedFiles(flag) {
    if (flag == "origin") {
      this.getFileFlag = "country";
    } else if (flag == "insuranceFlag") {
      this.getFileFlag = "insurance";
    } else if (flag == "shipping") {
      this.getFileFlag = "shipping";
    } else if (flag == "landing") {
      this.getFileFlag = "landing";
    } else if (flag == "supplier") {
      this.getFileFlag = "supplier";
    } else if (flag == "sales") {
      this.getFileFlag = "sales";
    } else if (flag == "otherOrderSupplier") {
      this.getFileFlag = "otherOrderSupplier";
    } else {
      this.getFileFlag = "Bill";
    }

    this.OrdersService.getoriginFileAttachments({
      id: this.orders.selectedOrder.id,
      type: this.getFileFlag,
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
        } else if (flag == "supplier") {
          this.suppllierDocuments = response.result.data.OrdersAtt;
          this.suppllierDocuments.map((x) => {
            this.supplierDescr = x;
            this.setSupplierForm(x);
          });
        } else if (flag == "sales") {
          this.salesDocuments = response.result.data.OrdersAtt;
          this.salesDocuments.map((x) => {
            this.supplierDescr = x;
            this.setSupplierForm(x);
          });
        } else if (flag == "otherOrderSupplier") {
          this.otherOrderAttachments = response.result.data.OrdersAtt;
        }
      } else {
        this.originFileAttachments = [];
      }
    });
  }

  getReportsData(data?: any): void {
    let hideHplc: boolean;
    this.OrdersService.OrderCoaData({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.CoaDetails = response.result.data.coa;
        // this.coaCompanyName = response.result.data.company_name  ;
        // this.coaCompanyName = response.result.data.coa.length ? response.result.data.coa[0].batchDt.product_name : '';
        this.coaCompanyName = response.result.data.coa.length
          ? response.result.data.coa[0].batchDt.client_name
          : "";

        this.CoaDetails.map(function (value) {
          value.batchCoaDt.map(function (coapermission) {
            if (coapermission.id == 34) {
            }
          });
        });
        // this.CoaDetails.map(function (value) {
        // 	value.batchDt.map(function () {

        // 	})
        // });
      }
    });
  }

  moveToPostCommercialInvoice() {
    this.activateScroll = false;
    this.activeTab = "postCommercialInvoice";
    if (
      this.postCommercialInvoice &&
      this.postCommercialInvoice["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.postCommercialInvoice["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToOrigin() {
    this.activateScroll = false;
    this.activeTab = "origin";
    if (this.origin && this.origin["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.origin["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToPackage() {
    this.activateScroll = false;
    this.activeTab = "PostPackage";
    if (this.PostPackage && this.PostPackage["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.PostPackage["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToAirway() {
    this.activateScroll = false;
    this.activeTab = "airway";
    if (this.airway && this.airway["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.airway["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToInsurance() {
    this.activateScroll = false;
    this.activeTab = "insurance";
    if (this.insurance && this.insurance["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.insurance["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
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
  getOrdersSdf(): void {
    this.OrdersService.getOrdersSdf({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        // if (response.result.data.length > 0) {
        this.editable = false;
        this.getSdfData = response.result.data;
        // this.sdfFormDates.patchValue({
        //   entry_date: new Date(this.getSdfData.entry_date),
        //   check_date: new Date(this.getSdfData.check_date),
        //   shipping_bill_no: this.getSdfData.shipping_bill_no,
        // });
        if (response.result.data.length > 0) {
          this.sdfData.entry_date = moment(
            response.result.data.entry_date.value
          ).format('"YYYY-MM-DD');
          this.sdfData.check_date = moment(
            response.result.data.check_date.value
          ).format('"YYYY-MM-DD');
          this.sdfData.shipping_bill_no =
            response.result.data.shipping_bill_no.value;
        }
        // } else {
        // 	this.getSdfData = ''

        // }
      }
    });
  }

  sdfFormData() {
    this.sdfFormDates = this.formBuilder.group({
      entry_date: null,
      check_date: null,
      shipping_bill_no: null,
    });
  }
  // addSdfData(): void {

  //   // this.noShippingBill = true;
  //   // this.noShippingDate = true;
  //   this.shippingnoSdf = true;
  //   this.sdfData.check_date = this.sdfFormDates.controls.check_date
  //     ? this.sdfFormDates.controls.check_date.value
  //     : "";
  //   this.sdfData.entry_date = this.sdfFormDates.controls.entry_date
  //     ? this.sdfFormDates.controls.entry_date.value
  //     : "";
  //   this.sdfData.shipping_bill_no =
  //     this.sdfFormDates.controls.shipping_bill_no.value;
  //   this.sdfData.orders_id = this.orders.selectedOrder.id;
  //   this.OrdersService.addOrdersSdf({
  //     orders_id: this.sdfData.orders_id,
  //     shipping_bill_no: this.sdfData.shipping_bill_no,
  //     check_date: this.sdfData.check_date,
  //     entry_date: this.sdfData.entry_date,
  //     id: this.getSdfData.id || 0,
  //   }).then((response) => {
  //     if (response.result.success) {
  //       this.editable = false;
  //       this.getSdfData = response.result.data;
  //     }
  //   });
  // }
  addSdfData(): void {
    // this.noShippingBill = true;
    // this.noShippingDate = true;
    this.shippingnoSdf = true;
    // this.sdfData.check_date = this.sdfFormDates.controls.check_date
    //   ? this.sdfFormDates.controls.check_date.value
    //   : "";
    // this.sdfData.entry_date = this.sdfFormDates.controls.entry_date
    //   ? this.sdfFormDates.controls.entry_date.value
    //   : "";
    if (this.sdfFormDates.controls.entry_date.value) {
      this.sdfData.entry_date = moment(
        this.sdfFormDates.controls.entry_date.value
      ).format("YYYY-MM-DD");
    }
    if (this.sdfFormDates.controls.check_date.value) {
      this.sdfData.check_date = moment(
        this.sdfFormDates.controls.check_date.value
      ).format("YYYY-MM-DD");
    }
    this.sdfData.shipping_bill_no =
      this.sdfFormDates.controls.shipping_bill_no.value;
    this.sdfData.orders_id = this.orders.selectedOrder.id;
    this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "FORM_SDF",
      context: {
        shipping_bill_no: this.sdfData.shipping_bill_no,
        check_date: this.sdfData.check_date,
        entry_date: this.sdfData.entry_date,
        // id: this.getSdfData.id || 0,
      },
      // orders_id: this.sdfData.orders_id,
    }).then((response) => {
      if (response.result.success) {
        this.editable = false;
        this.getSdfData = response.result.data?.context;
        let toast: object;
        toast = { msg: "SDF Details Updated Successfully ", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  getOrdersExport(): void {
    this.OrdersService.getOrdersExport({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        if (response.result.data != null) {
          this.editExport = false;
          this.getExportData = response.result.data;
          this.exportValue.e_shipping_bill_no =
            response.result.data?.e_shipping_bill_no;
          this.exportValue.e_entry_date = response.result.data?.e_entry_date;
        } else {
          this.getExportData = "";
        }
      }
    });
  }

  getOrdersConcern(): void {
    this.OrdersService.getOrdersConcern({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        if (response.result.data.concern_data) {
          this.concernEditable = false;
          this.getConcernData = response.result.data;
        } else {
          this.getConcernData = {
            concern_data: {
              price: "",
              year1: "",
              year2: "",
              export1: "",
              export2: "",
              domestic1: "",
              domestic2: "",
            },
          };
        }
      }
    });
  }
  public allowProductEditing = true;
  public volWeight = false;
  public batchesdataArray = [];
  public productArray = [];
  public container_strg;
  public sum_ofGross;
  public PackageVerifiedGross;
  getPackagingDetails(): void {
    this.containerName = [];
    this.OrdersService.getPackagingOrderDetails({
      id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.orders.packageOrders = response.result.data;
        this.packageDescription = response.result.data.description.replace(
          /\n/g,
          "<br>"
        );
        this.pkgDeclaration = response.result.data.declaration?.replace(
          /\n/g,
          "<br>"
        );
        this.orders.packing = response.result.data.packing;
        this.container_strg = response.result.data.container_string;
        this.siDraft.no_of_packages = response.result.data.container_string;
        this.PackageVerifiedGross = response.result.data.container_string;
        this.siDraft.marks_and_nos = response.result.data.description;
        this.sum_ofGross = response.result.data?.sum?.gross_wt;
        this.PostpackageData = response.result.data;
        this.siDraft.gross_weight = response.result.data?.sum?.gross_wt;
        // this.orders.packing[0]['first_package']=true;
        this.orders.packing.forEach((n) => {
          let batchData = n.batchesData;
          this.orders.packageOrdersloop = batchData;
          this.batchesdataArray.push(batchData);
          // batchData.map((i) => {

          // })
        });

        // 	)
        this.getProformaInvoiceData();

        if (response.result.data.packing.length) {
          // commenting the quntity edit is frezzing after edit and reload should editable
          // this.allowProductEditing = false;
        } else {
          // this.allowProductEditing = true;
        }

        this.orders.packing.forEach((n) => {
          let batchData = n.batchesData;
          batchData.map((i) => {
            let container_name = i.contains;
            container_name.map((v) => {
              if (v.cal_label) {
                this.volWeight = true;
              }
              if (v.cal_val) {
                this.volWeight = true;
              }
              this.containerName.push(v);
              this.containerName.map((child, i) => {
                if (child.packing_id == v.packing_id) {
                  v.itemCount = i + 1;
                }
              });
            });
          });
        });

        if (response.result.data.packing.length) {
          this.showDrumsList = false;
        } else {
          this.showDrumsList = true;
        }
        if (response.result.data.invStatus == "2") {
          // this.getInvoiceData();
          this.getOrdersActivityDetails();
          this.packageCompleted = true;
        } else {
          this.orders.packageOrders["invStatus"] =
            response.result.data.invStatus;
        }
        if (response.result.data.invStatus == "1") {
          this.packageCompleted = true;
          // this.selectedOrderStatus = 'Processing';
          this.getOrdersActivityDetails();
        }
      } else {
        this.orders.packageOrders = [];
        this.orders.sum = {};
        this.orders.packing = [];
      }
      this.scrollOrdersContainer();
    });
  }

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
  printCertificate: boolean;
  printInvoice: boolean;
  printTaxInvoice: boolean;
  printPackage: boolean;
  printMsdsForm: boolean;
  printhazardous: boolean;
  printIctt: boolean;
  printFormSdf: boolean;
  printExport: boolean;
  printDecl: boolean;
  printShipper: boolean;
  printAdc: boolean;
  printInc: boolean;
  printSco: boolean;
  printCon: boolean;
  printOrigin: boolean;
  printInsurance: boolean;
  printAirway: boolean;
  printnonscomet: boolean;
  printadcdecl: boolean;
  printndpsdecl: boolean;
  public printPrimaryPackage: boolean;
  public showPrimaryPackage: boolean = true;
  public showProfInvoice = true;
  public printProfInvoice = true;
  public printDGR = true;
  printAdcaapl: boolean;
  printnondgr: boolean;
  printselfSeal: boolean;
  toggleCoa() {
    this.showCoa = !this.showCoa;
    this.printCertificate = !this.printCertificate;
  }
  toggleInvoice() {
    this.showInvoice = !this.showInvoice;
    this.printInvoice = !this.printInvoice;
  }
  toggleTaxInvoice() {
    this.showTaxInvoice = !this.showTaxInvoice;
    this.printTaxInvoice = !this.printTaxInvoice;
  }

  toggleIgstInvoice() {
    this.showIgstInvoice = !this.showIgstInvoice;
    this.printTaxInvoice = !this.printTaxInvoice;
  }
  toggleProformaInvoice() {
    this.showProfInvoice = !this.showProfInvoice;
    this.printProfInvoice = !this.printProfInvoice;
  }
  togglePackage() {
    this.showPackage = !this.showPackage;
    this.printPackage = !this.printPackage;
  }
  togglePrimaryPackage() {
    this.showPrimaryPackage = !this.showPrimaryPackage;
    this.printPrimaryPackage = !this.printPrimaryPackage;
  }
  toggleUom() {
    this.showUom = !this.showUom;
  }
  toggleShipping() {
    this.showShipping = !this.showShipping;
  }
  togglefreightlogistics() {
    this.freightlgistics = !this.freightlgistics;
  }
  toggleotherCosts() {
    this.showotherCosts = !this.showotherCosts;
  }
  toggleExportRegister() {
    this.showexportRegister = !this.showexportRegister;
  }
  toggleOtherOrderDetails() {
    this.showOtherOrderDetails = !this.showOtherOrderDetails;
  }
  toggleMsds() {
    this.showMsds = !this.showMsds;
    this.printMsdsForm = !this.printMsdsForm;
  }

  toggleIctt() {
    this.showIctt = !this.showIctt;
    this.printIctt = !this.printIctt;
  }

  toggleNonHazardus() {
    this.showNonhazardous = !this.showNonhazardous;
    this.printhazardous = !this.printhazardous;
  }
  toggleNonDgr() {
    this.showNondgr = !this.showNondgr;
    this.printnondgr = !this.printnondgr;
  }
  toggleSdf() {
    this.showSdf = !this.showSdf;
    this.printFormSdf = !this.printFormSdf;
  }
  toggleExportValue() {
    this.showExportvalue = !this.showExportvalue;
    this.printExport = !this.printExport;
  }
  toggleDeclaration() {
    this.showDeclaration = !this.showDeclaration;
    this.printDecl = !this.printDecl;
  }
  toggleSelfSeal() {
    this.showSelfSealCertificate = !this.showSelfSealCertificate;
    this.printselfSeal = !this.printselfSeal;
  }
  toggleShippers() {
    this.showShippers = !this.showShippers;
    this.printShipper = !this.printShipper;
  }
  toggleAdcsheet() {
    this.showAdcsheet = !this.showAdcsheet;
    this.printAdc = !this.printAdc;
  }
  toggleAdcsheetAapl() {
    this.showAdcsheetaapl = !this.showAdcsheetaapl;
    this.printAdcaapl = !this.printAdcaapl;
  }
  toggleDeclarationIncentive() {
    this.showDeclarationIncentive = !this.showDeclarationIncentive;
    this.printInc = !this.printInc;
  }
  toggleScomatDeclaration() {
    this.showScomatDeclaration = !this.showScomatDeclaration;
    this.printSco = !this.printSco;
  }
  toggleConcern() {
    this.concern = !this.concern;
    this.printCon = !this.printCon;
  }
  toggleOrigin() {
    this.showOrigin = !this.showOrigin;
    this.printOrigin = !this.printOrigin;
  }
  toggleInsurance() {
    this.showinsurance = !this.showinsurance;
    this.printInsurance = !this.printInsurance;
  }
  toggleAirway() {
    this.showAirway = !this.showAirway;
    this.printAirway = !this.printAirway;
  }
  togglenonscometdecl() {
    this.shownonscomat = !this.shownonscomat;
    this.printnonscomet = !this.printnonscomet;
  }
  // toggleAdcdecl() {
  //   this.shownadcdecl = !this.shownadcdecl;
  //   this.printadcdecl = !this.printadcdecl;
  // }
  // toggleNDPSDecl() {
  //   this.showNdpsDecl = !this.showNdpsDecl;
  //   this.printndpsdecl = !this.printndpsdecl;
  // }
  toggleDGR() {
    this.showDgrDecl = !this.showDgrDecl;
    this.printDGR = !this.printDGR;
  }
  toggleFemaDeclration() {
    this.showFemaDeclration = !this.showFemaDeclration;
    this.printSco = !this.printSco;
  }
  toggleSealedContainer() {
    this.showSealedContainer = !this.showSealedContainer;
    this.printSco = !this.printSco;
  }
  toggleChaLetter() {
    this.showChaLetter = !this.showChaLetter;
    this.printSco = !this.printSco;
  }
  toggleRodTep() {
    this.showRodTep = !this.showRodTep;
    this.printSco = !this.printSco;
  }
  toggleVGM() {
    this.showVGM = !this.showVGM;
    this.printSco = !this.printSco;
  }
  toggleSIDraft() {
    this.showSIDraft = !this.showSIDraft;
    this.printSco = !this.printSco;
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
        let toast: object;
        toast = { msg: " Item Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  isChecked: false;
  checkboxDisable(event, value?) {
    if (value && event.checked == true) {
      // this.exportValueDecl.nature_of_traction = value;
    }
    // event.preventDefault();
  }
  editConcern() {
    if (!this.concernEditable) {
      this.concernEditable = true;
    } else {
      this.concernEditable = false;
    }
  }
  getPaymentTypes() {
    this.OrdersService.getPaymentTypes().then((response) => {
      if (response.result.success) {
        this.paymentType = response.result.data;
      }
    });
  }
  addExportValueData(): void {
    const formatDate = (date) =>
      moment(date, "YYYY-MM-DD", true).isValid()
        ? moment(date).format("YYYY-MM-DD")
        : null;
    this.exportValue.orders_id = this.orders.selectedOrder.id;
    this.OrdersService.addOrdersExp({
      orders_id: this.exportValue.orders_id,
      e_entry_date: formatDate(this.exportValue.e_entry_date),
      e_shipping_bill_no: this.exportValue.e_shipping_bill_no || 0,
    }).then((response) => {
      if (response.result.success) {
        this.editExport = false;
        this.getExportData = response.result.data;
      }
    });
  }
  cancelAllOrder(): void {
    this.editClosePOPup = true;
    // this.closeEditTax();
    // this.closeEdit();
    let dialogRef = this.dialog.open(CancelOrderComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: this.orders.selectedOrder.id,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.orders.selectedOrder.orders_types_id = "5";
        this.selectedOrderStatus = "Cancelled";
        this.orders.selectedOrder.status == "Cancelled";
        this.getOrdersActivityDetails();
        this.orderDetails();
      }
      this.editClosePOPup = false;
    });
  }
  public batchshow = false;
  public displayAdc;
  public displayAdcHaz;
  public displayAdcNonHaz;
  public displayScomet;
  public displayNonScomet;
  public productDescription;
  public productHazardArr = [];
  public filteredProducts = [];
  public productTax;
  public Prcurrency;
  public showtaxinvoiceinaapl: boolean = true;
  public extraColumninvoice;
  public ordersInvoiceData;
  getInvoiceData() {
    // this.getOrdersActivityDetails();
    // this.selectedOrderStatus = 'Processing';

    this.OrdersService.getInvoiceData({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.invoiceGenerateLoader = false;
        this.hideShipperAddress = true;
        this.orders.invoice = response.result.data.Invioce;
        this.ordersInvoiceData = response.result?.data?.Invioce;
        this.filteredProducts = this.orders.invoice[0]?.productsData.filter(
          (product) => {
            this.productTax = product.tax;
            if (product.tax == 0.1) {
              this.showtaxinvoiceinaapl = false;
            }
          }
        );
        this.displayAdc = response.result.data?.Invioce[0]?.displayADCDoc; //adc document display key
        if (response.result.data.Invioce[0]?.displayAdcHaz === "1") {
          this.displayAdcHaz = true;
        }

        if (response.result.data.Invioce[0]?.displayAdcHaz === "2") {
          this.displayAdcNonHaz = true;
        }

        //for Scomet
        if (this.is_aapl) {
          if (response.result.data.Invioce[0]?.displayScomet) {
            this.displayScomet = true;
            this.displayNonScomet = false;
          } else {
            this.displayScomet = false;
            this.displayNonScomet = true;
          }
        } else {
          this.displayScomet = true;
          this.displayNonScomet = false;
        }
        this.getShippingAddressDetails();
        if (response.result.data.Invioce.length) {
          this.enableInvoice = true;
          this.batchNum =
            response.result.data.Invioce[0].productsData[0].batch_nbr;

          this.batchshow =
            response.result.data.Invioce[0].Inovice.is_proforma_inv;

          this.pvm_pre_carriage_by =
            response.result.data.Invioce[0].Inovice?.pre_carriage_by;
          this.pvm_mark_nos = response.result.data.Invioce[0].Inovice?.mark_nos;
          this.pvm_container_no =
            response.result.data.Invioce[0].Inovice?.container_no;
          this.pvm_lut_arn = response.result.data.Invioce[0].Inovice?.lut_arn;
          this.pvm_lut_date = response.result.data.Invioce[0].Inovice?.lut_date;
        }
        if (response.result.data.generateTaxInv) {
          this.taxInvoiceShow = true;
          this.invoiceGenerated = true;
        } else {
          this.taxInvoiceShow = false;
          this.getTaxInv();
        }
        if (
          this.productTax &&
          response.result.data.Invioce[0].Inovice.is_igst
        ) {
          this.igstInvoiceShow = false;
          this.getIgstInv();
        } else {
          this.igstInvoiceShow = true;
        }

        if (response.result.data?.packageStatus == 2) {
          this.enableTaxInvoice = false;
          this.enableIgstInvoice = false;
        } else if (this.is_automech) {
          this.enableTaxInvoice = false;
          this.enableIgstInvoice = false;
        } else {
          this.enableTaxInvoice = true;
          this.enableIgstInvoice = true;
          //.enableTaxInvoice()
        }
        if (
          response.result.data?.packageStatus == 2 ||
          response.result.data?.generateTaxInv
        ) {
          this.getTaxInv();
        }
        if (
          response.result.data.packageStatus == 2 ||
          !response.result?.data?.Invioce[0]?.Inovice.is_igst
        ) {
          this.getIgstInv();
        }
        if (this.batchNum != null) {
          this.batchNumArray = this.batchNum.split(",");
          this.batchNumArray =
            this.batchNumArray && this.batchNumArray.length
              ? this.batchNumArray
              : [];
        }

        // if(this.orders.invoice[0].productsData[0].batch_nbr == null) {
        // 	this.priceQuantityDisable = true;
        // } else {
        // 	this.priceQuantityDisable = false;
        // }

        // this.batchNum=this.batchNum.split(',').join('\n');
        this.orders.packageStatus = response.result.data.packageStatus;
        if (
          this.orders.packageStatus == 1 &&
          this.orders.productsData.data.length != this.orders.packing.length
        ) {
          let productPackingArr = this.orders.packing;
          this.orders.invoice?.[0].productsData.forEach(function (value) {
            if (value.packing_id == null) {
              let obj = {
                productPackage: {
                  id: value.order_product_id,
                  product_name: value.product_name,
                  productQty: value.product_quantity,
                  product_desc: value.p_description,
                  uom_name: value.uom_name,
                  uom_label: value.uom_label,
                  products_types_id: value.products_types_id,
                  batch_exists: value.batch_exists,
                },
                batchesData: [],
              };
              productPackingArr.push(obj);
            }
          }, productPackingArr);
          this.orders.packing = productPackingArr;
        }
        let pData = this.productHazardArr;
        //   this.orders.invoice[0].productsData.forEach(function (value) {
        // 	this.productHazardArr[value.packing_id].product_name = value.product_name;
        //   },pData)
        if (
          this.orders.invoice.length &&
          this.orders.invoice[0].Inovice.status == "Paid"
        ) {
          this.disablePayment = true;
        }
        if (this.orders.packageStatus == 2) {
          this.downloadStatus = true;
        } else {
          this.downloadStatus = false;
        }
        this.getReportsData();
      }
    });
  }
  public taxInvoiceData: any;
  public shipperAdress: any;
  public billAddress: any;
  jsonDataString: string;
  valuesArray;
  shipArray;
  concatenatedString: string;
  concateShip: string;
  consignee_address;
  public shipAdd;
  public buyerAdd;
  public freightCostvalue;
  public InsuranceValue;
  public productArra = [];
  public igstBuyer;
  public igstShipper;
  public customs_notify_address1;
  public customs_notify_address2;
  public taxcustoms_notify_address1;
  public taxcustoms_notify_address2;
  public Packagetax;
  getTaxInv() {
    this.OrdersService.getTaxInv({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.taxInvoiceData = response.result.data;

        this.originalTaxInvData = JSON.parse(
          JSON.stringify(this.taxInvoiceData)
        );

        this.customTerms = response.result.data[0]?.taxInvoice.terms_cond_des;
        this.orginalCustomerTerms =
          response.result.data[0]?.taxInvoice.terms_cond_des;
        this.productArra = this.taxInvoiceData[0]?.productsData;
        this.selectedOrderData = this.taxInvoiceData[0];
        this.buyerAdd = response.result.data[0]?.taxInvoice?.buyers_address;
        this.shipAdd = response.result.data[0]?.taxInvoice?.consignee_address;
        this.freightCostvalue = response.result.data[0]?.taxInvoice.freight;
        this.Packagetax = response.result.data[0]?.taxInvoice;
        this.InsuranceValue = response.result.data[0]?.taxInvoice.insurance;
        this.customs_notify_address1 =
          response.result.data[0]?.taxInvoice.customs_notify_address1;
        this.customs_notify_address2 =
          response.result.data[0]?.taxInvoice.customs_notify_address2;
        this.taxInvoiceData.map((x: any, value: any) => {
          this.billAddress = x.billingAddr;
        });
        this.taxInvoiceData.map((x: any) => {
          this.shipperAdress = x.shippingAddr;
        });
        // this.valuesArray = Object.values(this.billAddress);
        // this.concatenatedString = this.valuesArray.join('\n');
        // this.shipArray = Object.values(this.shipperAdress);
      }
    });
  }

  savetaxInvoiceEdit(product: any, event: any, value: any) {
    let numberRegex = /[0-9.]/g;
    let price: any;
    let productId: any;
    productId = product.order_product_id;
    let quantity: any;
    let amount: any;
    this.clickedIconId = productId;
    // if (
    //   numberRegex.test(event.key) ||
    //   event.key == "Backspace" ||
    //   event.key == "Delete"
    // ) {
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (this.UpdateTaxPriceValue != "" || this.UpdateTaxPriceValue != "") {
        if (value == 1) {
          if (product.product_price == 0) {
            console.log(product.product_price);
            let toast: object;

            toast = {
              msg: "Price should be greater than Zero",
              status: "error",
            };
            this.getTaxInv();
            this.getIgstInv();
            this.editTaxPrice = null;
            this.snackbar.showSnackBar(toast);
            return;
          }

          price =
            product.product_price.replace(/,/g, "") || product.product_price;
          product.product_price = price;
          product.quantity =
            product.quantity.replace(/,/g, "") || product.quantity;
          this.OrdersService.saveTaxInvoice({
            orders_id: this.orders.selectedOrder.id,
            product: product,
            terms_cond_des: this.customTerms,
            consignee_address: this.shipAdd,
            buyers_address: this.buyerAdd,
            freight: this.freightCostvalue.replace(/,/g, ""),
            insurance: this.InsuranceValue.replace(/,/g, ""),
            customs_notify_address1: this.customs_notify_address1,
            customs_notify_address2: this.customs_notify_address2,
          }).then((response) => {
            if (response.result.success) {
              let toast: object;
              toast = { msg: response.result.message, status: "success" };
              this.snackbar.showSnackBar(toast);
              // this.getInvoiceData()
              this.getTaxInv();
              this.getIgstInv();
              this.editTaxPrice = null;
            } else {
              let toast: object;
              toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.getTaxInv();
              this.getIgstInv();
              this.editTaxPrice = null;
            }
          });
        }
      }
    });
    // } else {
    //   return false;
    // }
  }
  igstInvoiceData: any;
  conversionValue: any;
  getIgstInv() {
    if (this.productTax !== 0.1) {
      this.OrdersService.getIgstInv({
        orders_id: this.orders.selectedOrder.id,
      }).then((response) => {
        if (response.result.success) {
          this.igstInvoiceData = response.result.data;
          this.igstBuyer = response.result.data[0]?.taxInvoice?.buyers_address;
          this.igstShipper =
            response.result.data[0]?.taxInvoice.consignee_address;
          this.taxcustoms_notify_address1 =
            response.result.data[0]?.taxInvoice.customs_notify_address1;
          this.taxcustoms_notify_address2 =
            response.result.data[0]?.taxInvoice.customs_notify_address2;
          this.currency_conversion =
            response.result.data[0]?.taxInvoice.conversion_value;
        }
      });
    }
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
          // this.setShippingFreightData(response.result.data.shipContainers)
          // this.setShippingContainer(response.result.data.shipContainers?.containers)
          this.disableCancel = true;
          this.editShipping = true;
          // this.selectedOrderStatus = 'In-transit';
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
        this.orders.shipping_data = response.result.data.shipDt;
        this.setShippingAddressForm(response.result.data.shipDt);
        this.setShippingFreightData(response.result.data?.shipContainers);
        this.setShippingContainer(
          response.result.data.shipContainers?.containers
        );
        // this.shipping_bill_no =response.result.data.shipDt.bill_no.value;
        this.sdfFormDates.patchValue({
          shipping_bill_no: response.result.data.shipDt.bill_no,
          entry_date: response.result.data.shipDt.bill_date,
        });
        this.getSiDraft();
      }
      // this.disableCancel = true;
    });
  }
  setSupplierForm(data) {
    this.suppllierDocumentss.patchValue({
      description: data?.description,
    });
  }
  setShippingFreightData(data: any): void {
    this.shippingForm.patchValue({
      mode_transport_id: Number(data?.carrier) === 0 ? null : data?.carrier,
      total_freight_cost: data?.total_freight_cost,
      freight_forwarder: data?.freight_forwarder,
      sailing_date: data?.sailing_date,
    });
  }
  public vessel;
  public bill_of;
  public voyageno;
  public bl_date;
  public shipping_bill_no;
  public shipping_bill_date;
  public transport_name;
  setShippingAddressForm(data: any): void {
    this.vessel = data?.mode_name;
    this.shipping_bill_no = data?.bill_no;
    this.shipping_bill_date = data?.bill_date;
    this.bl_date = data?.bl_date;
    this.vessel_no = data?.vessel_no;
    this.siDraft.vessel_no = data?.vessel_no;
    this.estimated_date = data?.estimated_time;
    this.transport_name = data?.transport_name;
    if (this.mode_shippiment == 1) {
      this.voyageno = data?.aws_number;
    }
    if (
      this.mode_shippiment == 2 ||
      this.mode_shippiment == 15 ||
      this.mode_shippiment == 16
    ) {
      this.voyageno = data?.bol_number;
    }
    this.bill_of = data?.bol_id;
    this.shippingForm.patchValue({
      aws_number: data.shipping_id,
    });
    this.shippingForm.patchValue({
      terms: data.terms,
    });
    // this.shippingForm.patchValue({
    // 	mode_transport_id: data.mode_transport_id
    // });
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
    this.shippingForm.patchValue({
      final_destination: data.final_destination,
    });
    this.shippingForm.patchValue({
      stuffing_location: data.stuffing_location,
      transit_time: data.transit_time,
      bl_date: data.bl_date,
      bl_type: data.bl_type,
      air_date: data.air_date,
      air_type: data.air_type,
      road_date: data.road_date,
      road_type: data.road_type,
      estimated_time: data?.estimated_time,
      bill_no: data?.bill_no,
      bill_date: data?.bill_date,
      vessel_no: data?.vessel_no,
    });
  }

  scrollOrdersContainer(event?: any) {
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
      let packagingTop =
        this.packaging &&
        this.packaging["nativeElement"] &&
        this.packaging["nativeElement"].offsetTop
          ? this.packaging["nativeElement"].offsetTop
          : 0;
      let invoiceTop =
        this.invoice &&
        this.invoice["nativeElement"] &&
        this.invoice["nativeElement"].offsetTop
          ? this.invoice["nativeElement"].offsetTop
          : 0;
      let coaTop =
        this.coa &&
        this.coa["nativeElement"] &&
        this.coa["nativeElement"].offsetTop
          ? this.coa["nativeElement"].offsetTop
          : 0;
      let shippingTop =
        this.shipping &&
        this.shipping["nativeElement"] &&
        this.shipping["nativeElement"].offsetTop
          ? this.shipping["nativeElement"].offsetTop
          : 0;
      let msdsFormTop =
        this.msdsForm &&
        this.msdsForm["nativeElement"] &&
        this.msdsForm["nativeElement"].offsetTop
          ? this.msdsForm["nativeElement"].offsetTop
          : 0;
      let nonHazardousTop =
        this.nonHazardous &&
        this.nonHazardous["nativeElement"] &&
        this.nonHazardous["nativeElement"].offsetTop
          ? this.nonHazardous["nativeElement"].offsetTop
          : 0;
      let icttTop =
        this.ictt &&
        this.ictt["nativeElement"] &&
        this.ictt["nativeElement"].offsetTop
          ? this.ictt["nativeElement"].offsetTop
          : 0;
      let FormsdfTop =
        this.Formsdf &&
        this.Formsdf["nativeElement"] &&
        this.Formsdf["nativeElement"].offsetTop
          ? this.Formsdf["nativeElement"].offsetTop
          : 0;
      let ExportvalueTop =
        this.Exportvalue &&
        this.Exportvalue["nativeElement"] &&
        this.Exportvalue["nativeElement"].offsetTop
          ? this.Exportvalue["nativeElement"].offsetTop
          : 0;
      let DeclarationTop =
        this.Declaration &&
        this.Declaration["nativeElement"] &&
        this.Declaration["nativeElement"].offsetTop
          ? this.Declaration["nativeElement"].offsetTop
          : 0;
      let ShippersletterTop =
        this.Shippersletter &&
        this.Shippersletter["nativeElement"] &&
        this.Shippersletter["nativeElement"].offsetTop
          ? this.Shippersletter["nativeElement"].offsetTop
          : 0;
      let AdcsheetTop =
        this.Adcsheet &&
        this.Adcsheet["nativeElement"] &&
        this.Adcsheet["nativeElement"].offsetTop
          ? this.Adcsheet["nativeElement"].offsetTop
          : 0;
      let IncentivedeclarationTop =
        this.Incentivedeclaration &&
        this.Incentivedeclaration["nativeElement"] &&
        this.Incentivedeclaration["nativeElement"].offsetTop
          ? this.Incentivedeclaration["nativeElement"].offsetTop
          : 0;
      let ScomatdeclarationTop =
        this.Scomatdeclaration &&
        this.Scomatdeclaration["nativeElement"] &&
        this.Scomatdeclaration["nativeElement"].offsetTop
          ? this.Scomatdeclaration["nativeElement"].offsetTop
          : 0;
      let ConcernTop =
        this.Concern &&
        this.Concern["nativeElement"] &&
        this.Concern["nativeElement"].offsetTop
          ? this.Concern["nativeElement"].offsetTop
          : 0;
      let FreightTop =
        this.freight &&
        this.freight["nativeElement"] &&
        this.freight["nativeElement"].offsetTop
          ? this.freight["nativeElement"].offsetTop
          : 0;
      let othercostsTop =
        this.othercosts &&
        this.othercosts["nativeElement"] &&
        this.othercosts["nativeElement"].offsetTop
          ? this.othercosts["nativeElement"].offsetTop
          : 0;
      let exportregisterTop =
        this.exportregister &&
        this.exportregister["nativeElement"] &&
        this.exportregister["nativeElement"].offsetTop
          ? this.exportregister["nativeElement"].offsetTop
          : 0;
      let NonscometDecltop =
        this.Nonscometdecl &&
        this.Nonscometdecl["nativeElement"] &&
        this.Nonscometdecl["nativeElement"].offsetTop
          ? this.Nonscometdecl["nativeElement"].offsetTop
          : 0;
      let adcdecltop =
        this.AdcDecl &&
        this.AdcDecl["nativeElement"] &&
        this.AdcDecl["nativeElement"].offsetTop
          ? this.AdcDecl["nativeElement"].offsetTop
          : 0;
      let NdpsDeclratiotop =
        this.NdpsDeclration &&
        this.NdpsDeclration["nativeElement"] &&
        this.NdpsDeclration["nativeElement"].offsetTop
          ? this.NdpsDeclration["nativeElement"].offsetTop
          : 0;
      let dgrTop =
        this.Dgrdecl &&
        this.Dgrdecl["nativeElement"] &&
        this.Dgrdecl["nativeElement"].offsetTop
          ? this.Dgrdecl["nativeElement"].offsetTop
          : 0;
      let AdcsheetAdcDocsTop =
        this.AdcsheetAdcDocs &&
        this.AdcsheetAdcDocs["nativeElement"] &&
        this.AdcsheetAdcDocs["nativeElement"].offsetTop
          ? this.AdcsheetAdcDocs["nativeElement"].offsetTop
          : 0;
      let nonDgrTop =
        this.nondgr &&
        this.nondgr["nativeElement"] &&
        this.nondgr["nativeElement"].offsetTop
          ? this.nondgr["nativeElement"].offsetTop
          : 0;
      let FEMADeclrationTop =
        this.FEMADeclration &&
        this.FEMADeclration["nativeElement"] &&
        this.FEMADeclration["nativeElement"].offsetTop
          ? this.FEMADeclration["nativeElement"].offsetTop
          : 0;
      let VGMTop =
        this.VGM &&
        this.VGM["nativeElement"] &&
        this.VGM["nativeElement"].offsetTop
          ? this.VGM["nativeElement"].offsetTop
          : 0;
      let SIDraftTop =
        this.SIDraft &&
        this.SIDraft["nativeElement"] &&
        this.SIDraft["nativeElement"].offsetTop
          ? this.SIDraft["nativeElement"].offsetTop
          : 0;
      let OtherOrderTop =
        this.otherOrder &&
        this.otherOrder["nativeElement"] &&
        this.otherOrder["nativeElement"].offsetTop
          ? this.otherOrder["nativeElement"].offsetTop
          : 0;
      let DetailedSealedContainerTop =
        this.SealedContainer &&
        this.SealedContainer["nativeElement"] &&
        this.SealedContainer["nativeElement"].offsetTop
          ? this.SealedContainer["nativeElement"].offsetTop
          : 0;
      if (scrollTop <= activityTop) {
        this.activeTab = "activity";
      } else if (
        activityTop < scrollTop &&
        (scrollTop < detailsTop || detailsTop == 0)
      ) {
        this.activeTab = "details";
      } else if (detailsTop + 1000 < scrollTop && scrollTop < packagingTop) {
        this.activeTab = "packaging";
      } else if (coaTop < scrollTop && scrollTop < packagingTop) {
        this.activeTab = "coa";
      } else if (packagingTop < scrollTop && scrollTop < FreightTop) {
        this.activeTab = "freight";
      } else if (FreightTop + 50 < scrollTop && scrollTop < OtherOrderTop) {
        this.activeTab = "otherOrder";
      } else if (OtherOrderTop < scrollTop && scrollTop < shippingTop) {
        this.activeTab = "shipping";
      } else if (shippingTop < scrollTop && scrollTop < othercostsTop) {
        this.activeTab = "othercosts";
      } else if (othercostsTop < scrollTop && scrollTop < exportregisterTop) {
        this.activeTab = "exportregister";
      } else if (
        exportregisterTop < scrollTop &&
        (scrollTop < invoiceTop || invoiceTop == 0)
      ) {
        this.activeTab = "invoice";
      } else if (shippingTop < scrollTop && scrollTop < adcdecltop) {
        this.activeTab = "AdcsheetAdcDocs";
      } else if (shippingTop < scrollTop && scrollTop < NonscometDecltop) {
        this.activeTab = "AdcDecl";
      } else if (shippingTop < scrollTop && scrollTop < NdpsDeclratiotop) {
        this.activeTab = "Nonscometdecl";
      } else if (shippingTop < scrollTop && scrollTop < nonDgrTop) {
        this.activeTab = "NdpsDeclration";
      } else if (shippingTop + 1000 < scrollTop && scrollTop < dgrTop) {
        this.activeTab = "nondgr";
      } else if (shippingTop < scrollTop && scrollTop < msdsFormTop) {
        this.activeTab = "Dgrdecl";
      } else if (shippingTop < scrollTop && scrollTop < icttTop) {
        this.activeTab = "msdsForm";
      } else if (msdsFormTop < scrollTop && scrollTop < nonHazardousTop) {
        this.activeTab = "icttTop";
      } else if (shippingTop + 1000 < scrollTop && scrollTop < FormsdfTop) {
        this.activeTab = "nonHazardous";
      } else if (shippingTop < scrollTop && scrollTop < ExportvalueTop) {
        this.activeTab = "Formsdf";
      } else if (shippingTop < scrollTop && scrollTop < DeclarationTop) {
        this.activeTab = "Exportvalue";
      } else if (shippingTop < scrollTop && scrollTop < ShippersletterTop) {
        this.activeTab = "Declaration";
      } else if (shippingTop < scrollTop && scrollTop < AdcsheetTop) {
        this.activeTab = "Shippersletter";
      } else if (
        shippingTop < scrollTop &&
        scrollTop < IncentivedeclarationTop
      ) {
        this.activeTab = "Adcsheet";
      } else if (shippingTop < scrollTop && scrollTop < ScomatdeclarationTop) {
        this.activeTab = "Incentivedeclaration";
      } else if (shippingTop < scrollTop && scrollTop < FEMADeclrationTop) {
        this.activeTab = "Scomatdeclaration";
      } else if (shippingTop < scrollTop && scrollTop < VGMTop) {
        this.activeTab = "FEMADeclration";
      } else if (shippingTop < scrollTop && scrollTop < SIDraftTop) {
        this.activeTab = "VGM";
      } else if (shippingTop < scrollTop && scrollTop < ConcernTop) {
        this.activeTab = "SIDraft";
      }
      // else if (shippingTop < scrollTop && scrollTop < ConcernTop) {
      // 	this.activeTab = 'Scomatdeclaration';
      // }
      else if (ConcernTop < scrollTop) {
        this.activeTab = "Concern";
      }
      // else if (detailsTop < scrollTop && (scrollTop < invoiceTop || invoiceTop == 0)) {
      // 	this.activeTab = 'invoice';
      // } else if (detailsTop < scrollTop && (scrollTop < invoiceTop || invoiceTop == 0)) {
      // 	this.activeTab = 'salescontract';
      // }
      // else if (detailsTop < scrollTop && (scrollTop < invoiceTop || invoiceTop == 0)) {
      // 	this.activeTab = 'commercialinvoice';
      // }

      // else if (invoiceTop < scrollTop && (scrollTop < packagingTop)) {
      // 	this.activeTab = 'packaging';
      // }
      //  else if (coaTop < scrollTop && scrollTop < FreightTop) {
      // 	this.activeTab = 'coa';
      // } else if (FreightTop < scrollTop && scrollTop < packagingTop) {
      // 	this.activeTab = 'freight';
      // }
    }
  }
  public paymentSelected;
  changePaymentType(event: any): void {
    this.paymentSelected = event;
    this.activePayment = true;
    if (event != "") {
      this.orders.invoice[0].Inovice.payment_type = event;
    }
  }

  enableSave(event: any): void {
    this.activePayment = true;
  }

  changeIncoTerms(event: any): void {
    this.activePayment = true;
    if (event != "") {
      this.orders.invoice[0].Inovice.inco_terms_id = event;
    }
  }

  moveToActivity() {
    this.activateScroll = false;
    this.activeTab = "activity";
    this.ActivityLog = true;
    this.activity["nativeElement"].show = true;
    if (this.activity && this.activity["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.activity["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  cancelpay() {
    this.activePayment = false;
  }

  savePaymentType(form: any) {
    if (this.paymentSelected == "Advance") {
      this.disablePayment = true;
    } else {
      this.disablePayment = false;
    }
    this.updateKeyValue(form);
    this.activePayment = false;
  }
  moveToDetails() {
    this.activateScroll = false;
    this.activeTab = "details";
    if (this.details && this.details["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.details["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToPackaging() {
    this.activateScroll = false;
    this.ActivityLog = false;
    this.activeTab = "packaging";
    // if (this.is_automech && this.packaging && this.packaging['nativeElement'].offsetTop == 0) {
    // 	console.log(this.packaging,"automech")
    //     this.scrollContainer['nativeElement'].scrollTop = this.packaging['nativeElement'].offsetTop -74;
    // }
    if (this.packaging && this.packaging["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.packaging["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToUom() {
    this.activateScroll = false;
    this.ActivityLog = false;
    this.activeTab = "uom";

    if (this.uom && this.uom["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.uom["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToPrimaryPackage() {
    this.activateScroll = false;
    this.ActivityLog = false;
    this.activeTab = "primary-packaging";

    if (
      this.primaryPackaging &&
      this.primaryPackaging["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.primaryPackaging["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToInvoice() {
    this.activateScroll = false;
    this.activeTab = "invoice";
    if (this.invoice && this.invoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.invoice["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToSalesInvoice() {
    this.activateScroll = false;
    this.activeTab = "salescontract";
    this.activeTab = "commercialinvoice";
    if (this.invoice && this.invoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.invoice["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToInvoiceLut() {
    this.activateScroll = false;
    this.activeTab = "invoice-lut";
    if (this.invoice && this.invoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.invoice["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToTaxInvoice() {
    this.activateScroll = false;
    this.activeTab = "tax-invoice";
    if (this.taxinvoicetab && this.taxinvoicetab["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.taxinvoicetab["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToExportInvoice() {
    this.activateScroll = false;
    this.activeTab = "export-invoice";
    if (this.exportinvoice && this.exportinvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.exportinvoice["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToIGSTInvoice() {
    this.activateScroll = false;
    this.activeTab = "igst-invoice";
    if (this.igstinvoicetab && this.igstinvoicetab["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.igstinvoicetab["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToProfomaInvoice() {
    this.activateScroll = false;
    this.activeTab = "pro-invoice";
    if (this.proinvoicetab && this.proinvoicetab["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.proinvoicetab["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToCoa() {
    this.activateScroll = false;
    this.activeTab = "coa";
    if (this.coa && this.coa["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.coa["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToShipping() {
    this.activateScroll = false;
    this.activeTab = "shipping";
    if (this.shipping && this.shipping["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.shipping["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToFreight() {
    this.activateScroll = false;
    this.activeTab = "freight";
    if (this.freight && this.freight["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.freight["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToOtherOrder() {
    this.activateScroll = false;
    this.activeTab = "otherOrder";
    if (this.otherOrder && this.otherOrder["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.otherOrder["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToOtherCosts() {
    this.activateScroll = false;
    this.activeTab = "othercosts";
    if (this.othercosts && this.othercosts["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.othercosts["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToExportForm() {
    this.activateScroll = false;
    this.activeTab = "exportregister";
    if (this.exportregister && this.exportregister["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.exportregister["nativeElement"].offsetTop - 74;
    }
    // this.getAddedFiles();
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToMsdsForm() {
    this.activateScroll = false;
    this.activeTab = "msdsForm";
    if (this.msdsForm && this.msdsForm["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.msdsForm["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToIcttForm() {
    this.activateScroll = false;
    this.activeTab = "ictt";
    if (this.ictt && this.ictt["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.ictt["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToFEMADeclration() {
    this.activateScroll = false;
    this.activeTab = "FEMADeclration";
    if (this.FEMADeclration && this.FEMADeclration["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.FEMADeclration["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToDetailedSealedContainer() {
    this.activateScroll = false;
    this.activeTab = "SealedContainer";
    if (
      this.SealedContainer &&
      this.SealedContainer["nativeElement"].offsetTop
    ) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.SealedContainer["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToChaLetter() {
    this.activateScroll = false;
    this.activeTab = "ChaLetter";
    if (this.ChaLetter && this.ChaLetter["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.ChaLetter["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToRodTep() {
    this.activateScroll = false;
    this.activeTab = "ChaLetter";
    if (this.RodTep && this.RodTep["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.RodTep["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToVGM() {
    this.activateScroll = false;
    this.activeTab = "VGM";
    if (this.VGM && this.VGM["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.VGM["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToSIDraft() {
    this.activateScroll = false;
    this.activeTab = "SIDraft";
    if (this.SIDraft && this.SIDraft["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.SIDraft["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToNonHazardous() {
    this.activateScroll = false;
    this.activeTab = "nonHazardous";
    if (this.nonHazardous && this.nonHazardous["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.nonHazardous["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToFormSdf() {
    this.activateScroll = false;
    this.activeTab = "Formsdf";
    if (this.Formsdf && this.Formsdf["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Formsdf["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToExportValue() {
    this.activateScroll = false;
    this.activeTab = "Exportvalue";
    if (this.Exportvalue && this.Exportvalue["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Exportvalue["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToDeclaration() {
    this.activateScroll = false;
    this.activeTab = "Declaration";
    if (this.Declaration && this.Declaration["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.Declaration["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToSelfSeal() {
    this.activateScroll = false;
    this.activeTab = "selfsealcr";
    if (this.selfsealcr && this.selfsealcr["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.selfsealcr["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  moveToNonDgr() {
    this.activateScroll = false;
    this.activeTab = "nondgr";
    if (this.nondgr && this.nondgr["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.nondgr["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  public errormes;
  changePoNo(event: any) {
    this.closeEdit();

    let poNumber: any;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (event.target.innerText != "") {
        if (event.target.innerText.length <= 15) {
          poNumber = event.target.innerText;
          this.modPoNum = poNumber;
          this.OrdersService.changePoNumbr({
            order_product_id: this.productId,
            id: this.orders.selectedOrder.id,
            po_nbr: poNumber,
            po_date: this.orders.selectedOrder.po_date
              ? this.orders.selectedOrder.po_date
              : "",
            extra_col: this.orders.selectedOrder.extra_col
              ? this.orders.selectedOrder.extra_col
              : "",
            insurance: this.orders.selectedOrder.insurance
              ? this.orders.selectedOrder.insurance.replace(/,/g, "")
              : "",
            freight: this.orders.selectedOrder.freight
              ? this.orders.selectedOrder.freight.replace(/,/g, "")
              : "",
            discount: this.orders.selectedOrder.discount
              ? this.orders.selectedOrder.discount.replace(/,/g, "")
              : "",
          }).then((response) => {
            if (response.result.success) {
              this.productPriceChange();
              let toast: object;
              toast = {
                msg: "Order Details Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
            }
          });
        } else {
          let toast: object;
          toast = {
            msg: "PO Number should not exceed 15 characters. ",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      }
    }, 1500);
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  onDateSelected(picker: MatDatepicker<Date>, value?: any) {
    if ((value = 1)) {
      this.shippingActiveState = true;
      picker.open();
    }
    // this.shippingActiveState = true;
  }
  savePoDate() {
    this.closeEdit();

    let poDate: any;
    if (this.po_date2) {
      poDate = moment(this.po_date2).format("YYYY-MM-DD");
      this.OrdersService.changePoNumbr({
        id: this.orders.selectedOrder.id,
        po_nbr: this.modPoNum
          ? this.modPoNum
          : this.orders.selectedOrder.po_nbr,
        po_date: poDate,
        line_item: this.orders.selectedOrder.line_item
          ? this.orders.selectedOrder.line_item
          : "",
        insurance: this.orders.selectedOrder.insurance
          ? this.orders.selectedOrder.insurance.replace(/,/g, "")
          : "",
        freight: this.orders.selectedOrder.freight
          ? this.orders.selectedOrder.freight.replace(/,/g, "")
          : "",
        discount: this.orders.selectedOrder.discount
          ? this.orders.selectedOrder.discount.replace(/,/g, "")
          : "",
      }).then((response) => {
        if (response.result.success) {
          let toast: object;
          toast = {
            msg: "Order Details Updated Successfully",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
        }
      });
    }
  }

  getclientDocPermissions(): void {
    let id: any;
    id = this.orders.selectedOrder.id;
    this.OrdersService.getclientDocPermissions({
      orders_id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        this.isSampleDocs = response.result.data.is_sample_order;
      } else {
      }
    });
  }
  addConcernData(): void {
    let id: any;
    id = this.orders.selectedOrder.id;
    this.OrdersService.addOrdersConcern({
      orders_id: id,
      concern_data: this.concernData,
      id: this.getConcernData.id || 0,
    }).then((response) => {
      if (response.result.success) {
        this.concernEditable = false;
        this.getConcernData = response.result.data;
      }
    });
  }
  public saveAddLineItem = false;
  addCoaLineItem(): void {
    this.OrdersService.changePoNumbr({
      id: this.orders.selectedOrder.id,
      line_item: this.orders.selectedOrder.line_item,
      po_nbr: this.orders.selectedOrder.po_nbr
        ? this.orders.selectedOrder.po_nbr
        : "",
      po_date: this.orders.selectedOrder.po_date
        ? this.orders.selectedOrder.po_date
        : "",
      extra_col: this.orders.selectedOrder.extra_col
        ? this.orders.selectedOrder.extra_col
        : "",
      insurance: this.orders.selectedOrder.insurance
        ? this.orders.selectedOrder.insurance.replace(/,/g, "")
        : "",
      freight: this.orders.selectedOrder.freight
        ? this.orders.selectedOrder.freight.replace(/,/g, "")
        : "",
      discount: this.orders.selectedOrder.discount
        ? this.orders.selectedOrder.discount.replace(/,/g, "")
        : "",
      order_product_id: this.productId,
    }).then((response) => {
      if (response.result.success) {
        this.editable = false;

        this.coaLineItemEdit = false;
        this.orders.selectedOrder.line_item = response.result.data.line_item;
        this.saveAddLineItem = this.orders.selectedOrder.line_item
          ? true
          : false;
        this.coalineItem = response.result.data.line_item;
      }
    });
  }

  backToOrders(stepper: MatStepper) {
    this.router.navigate(["/orders"]);
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
      this.orders.selectedOrder.status_color_code = "#0000FF";
      if (this.isSampleDocs || this.is_automech) {
        // this.disableFreecharge = false;
        // this.getInvoiceData();
        this.generateInvoice("false");
      }
      this.getOrdersActivityDetails();
    });
  }

  editformCoa() {
    if (!this.editable) {
      this.editable = true;
    } else {
      this.editable = false;
    }
    if (this.orders.selectedOrder.line_item) {
      this.coaLineItemEdit = true;
    } else {
      this.coaLineItemEdit = false;
    }
  }
  onCoaLineItem(event: any) {
    this.coaLineItemEdit = true;
  }
  cancelCoaLineItem() {
    this.editable = false;
    this.coaLineItemEdit = false;
    this.orders.selectedOrder.line_item = this.coalineItem;
  }

  deleteUploads(file, i, flag) {
    this.OrdersService.deleteFileAttachments({
      id: file.id,
      att_id: file.att_id,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: "File Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
        if (flag == "origin") {
          this.originFileAttachments.splice(i, 1);
        } else if (flag == "insurance") {
          this.insuranceAttachments.splice(i, 1);
        } else if (flag == "shipping") {
          this.shippingAttachments.splice(i, 1);
        } else if (flag == "supplier") {
          this.suppllierDocuments.splice(i, 1);
        } else if (flag == "sales") {
          this.salesDocuments.splice(i, 1);
        } else if (flag == "otherOrderSupplier") {
          this.otherOrderAttachments.splice(i, 1);
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
    this.packageDescription = this.packageDescription.replace(/<br>/gi, "\n");
  }
  public editPkgDeclaration = false;
  pkgDeclarationEdit() {
    this.editPkgDeclaration = true;
    this.pkgDeclaration = this.pkgDeclaration.replace(/<br>/gi, "\n");
  }
  cancelPkgDeclaration() {
    this.getPackagingDetails();
    this.showPackageSavePanel = false;
    this.editPkgDeclaration = false;
  }
  editPackageDescription() {
    let param = {
      id: this.data.id,
      description: this.packageDescription,
      type: "marks_and_nos",
    };
    this.OrdersService.updateOrdersPackage(param).then((response) => {
      if (response.result.success) {
        this.packageDescription = this.packageDescription.replace(
          /\n/g,
          "<br>"
        );
        this.getSiDraft();
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

  editPakgDeclaration() {
    let param = {
      id: this.data.id,
      description: this.pkgDeclaration,
      type: "declaration",
    };
    this.OrdersService.updateOrdersPackage(param).then((response) => {
      if (response.result.success) {
        this.pkgDeclaration = this.pkgDeclaration.replace(/\n/g, "<br>");
        let toast: object;
        toast = {
          msg: "Package details updated successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.showPackageSavePanel = false;
        this.editPkgDeclaration = false;
      } else {
        let toast: object;
        toast = { msg: "Failed To Update", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  cancelPackageDescription() {
    this.getPackagingDetails();
    this.showPackageSavePanel = false;
    this.editDescription = false;
  }
  openPreview(file, i: number, flag): void {
    this.closeEdit();
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
      } else if (flag == "supplier") {
        this._lightbox.open(this.suppllierDocuments, i);
      } else if (flag == "sales") {
        this._lightbox.open(this.salesDocuments, i);
      } else if (flag == "otherOrderSupplier") {
        this._lightbox.open(this.otherOrderAttachments, i);
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
    this.icttItem.push(this.generateIcttDynamicForm(value));
    this.enableIcttSave = true;
  }
  cancelIctt() {
    this.enableIcttSave = false;
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

  setIcttForm(data) {
    if (data?.length > 0) {
      data.forEach((value) => {
        this.addRows(value);
      });
    }
  }
  uploadSupplier(flag?: any) {
    if (flag == "country") {
      this.getFileFlag = "country";
    }
    if (flag == "otherOrderSupplier") {
      this.getFileFlag = "otherOrderSupplier";
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
      data: { id: this.orders.selectedOrder.id, flage: flag },
      disableClose: true,
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
  descriptionupdate;
  descriptionvalue(event) {
    this.descriptionupdate = event.target.value;
  }
  saveupload(product: any, any, value: any) {
    this.OrdersService.generateSavefiles({
      orders_id: this.data.id,
      attachments_id: product.att_id,
      type: "sales",
      description: this.descriptionupdate,
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
        attachments_id: data.att_id,
        type: "supplier",
        order_type: true,
        id: data.id,
        discription: data.description,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.getAddedFiles("supplier");
        this.router.resetConfig(config);
        // let toast: object;
        // toast = { msg: "Successfully...", status: "success" };
        // this.snackbar.showSnackBar(toast);
      }
    });
  }
  //   getRolePermissions(){
  // 	this.adminService
  //           .getSelectedRole({ id: this.roles.id })
  //           .then(response=>{
  // 		  })
  //   }

  setOrderReady(event: any): void {
    // event.target.disabled = true;
    let status = 10;
    this.clickedPackageDetails = true;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: status,
      is_order_ready: true,
      confirm_sales: true,
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.is_order_ready = true;
        this.orders.selectedOrder.status = "10";
        this.selectedOrderStatus = "Order Ready";
        this.orders.selectedOrder.status_color_code = "#ce1c44";
        this.productPriceChange();
      } else {
        this.clickedPackageDetails = false;
      }
    });
  }

  confirmSales(event: any): void {
    event.target.disabled = true;
    let status = 9;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: status,
      confirm_sales: true,
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.confirm_sales = true;
        this.orders.selectedOrder.status = "9";
        this.selectedOrderStatus = "Order Confirmed";
        this.orders.selectedOrder.status_color_code = "#FFFF00";
        let toast: object;
        toast = {
          msg: "Sales Order Confirmed Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  generateCustomDocs(event: any): void {
    event.target.disabled = true;
    this.gentaxInvoice();

    this.getInvoiceData();

    // Updating the status to Customs clearance
    let status = this.is_automech ? 14 : 12;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: status,
      is_order_ready: true,
      confirm_sales: true,
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.orders_types_id = this.is_automech
          ? "14"
          : "12";
        this.selectedOrderStatus = this.is_automech
          ? "Docs Completed"
          : "Customs Clearance";
        this.orders.selectedOrder.status_color_code = this.is_automech
          ? "#08D6A0"
          : "#fa6";
        let toast: object;
        toast = {
          msg: "Documents Generated Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.customSidePannel = false;
        this.customDocs = true;
        if (this.is_automech) {
          this.preShipDocs = true;
          this.enableTaxInvoice = true;
          this.enableIgstInvoice = false;
          this.postShipDocs = true;
        } else {
          this.preShipDocs = true;
        }
      }
    });
  }

  generateCommercialDocs(event: any): void {
    event.target.disabled = true;
    let status = 14;
    this.disablegenrateCommercial = true;
    this.OrdersService.acceptOrder({
      id: this.orders.selectedOrder.id,
      orders_types_id: status,
      is_order_ready: true,
      confirm_sales: true,
    }).then((response) => {
      if (response.result.success) {
        //Api for creating Commercial Invoice record
        this.OrdersService.addCommercialInvoiceApi({
          id: this.orders.selectedOrder.id,
        }).then((response) => {
          if (response.result.success) {
            this.orders.selectedOrder.orders_types_id = "14";
            this.selectedOrderStatus = "Docs Completed";
            this.orders.selectedOrder.status_color_code = "#08D6A0";
            this.getSiDraft();
            setTimeout(() => {
              this.moveToPostCommercialInvoice();
            }, 2000);
            let toast: object;
            toast = {
              msg: "Commercial Documents Generated Successfully...",
              status: "success",
            };
            this.snackbar.showSnackBar(toast);
            this.preShipDocs = true;
            this.postShipDocs = true;
            this.disablegenrateCommercial = false;
          } else {
            this.disablegenrateCommercial = false;
          }
        });
      }
    });
  }

  getOtherCosts() {
    this.OrdersService.getOtherCosts({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.setOtherCosts(response.result.data);
        this.setcontainerFormOther(response.result?.data?.transport_charges);
      }
    });
  }

  setOtherCosts(data) {
    this.otherCosts.patchValue({
      carrier_charge: data?.carrier_charge,
      carrier_refrence: data?.carrier_refrence,
      cha_charge: data?.cha_charge,
      cha_refrence: data?.cha_refrence,
      cfs_charge: data?.cfs_charge,
      cfs_refrence: data?.cfs_refrence,
      option_charge: data?.option_charge,
      option_refrence: data?.option_refrence,
      insurance_cost: data?.insurance_cost,
      insurance_refrence: data?.insurance_refrence,
      coo_charge: data?.coo_charge,
      coo_refrence: data?.coo_refrence,
      palletization_cost: data?.palletization_cost,
      palletization_refrence: data?.palletization_refrence,
      vochar_cost: data?.vochar_cost,
      vochar_refrence: data?.vochar_refrence,
    });
    // for (let i = 0; i < data?.transport_charges.length; i++) {
    //   this.addRowsotherCost(data.transport_charges[i]);
    // }
  }
  Editdescription(product: any, event: any, value: any) {
    let productId: any;
    let description: any;
    productId = product.order_product_id;

    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (this.editUpdatedDescriptionValue != "") {
        if (value == 1) {
          description = this.editUpdatedDescriptionValue;
          this.OrdersService.EditDescription({
            product_id: productId,
            description: product.p_description,
            type: "order",
          }).then((response) => {
            if (response.result.success) {
              let toast: object;
              toast = {
                msg: response.result.message,
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.getInvoiceData();
              this.productPriceChange(response.result.data);

              this.package = !this.package;
              this.trigger.emit({ flag: "update" });
              this.editOrderDescription = null;
            } else {
              let toast: object;
              toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editOrderDescription = null;
            }
          });
        }
      }
    });

    // this.OrdersService
    // .EditDescription(productId)
  }
  public edittaxInvoiceBill = false;
  public showAddress = true;
  public closeIcon = false;
  public freightCost;
  public insuranceCost;
  public edittaxInvoicenotify1 = false;
  public showAddressnotify1 = true;
  public edittaxInvoicenotify2 = false;
  public showAddressnotify2 = true;
  customEdit() {
    this.closeEditTax();
    this.cancelCustomTerms();
    this.edittaxInvoiceBill = true;
    this.showAddress = false;
    if (this.buyerAdd) {
      var re = /<br>/gi;
      this.buyerAdd = this.buyerAdd.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.buyerTextarea1) {
        this.buyerTextarea1.nativeElement.focus();
      }
    }, 0);
  }
  customEditnotify1() {
    this.closeEditTax();
    this.cancelCustomTerms();
    this.edittaxInvoicenotify1 = true;
    this.showAddressnotify1 = false;
    if (this.customs_notify_address1) {
      var re = /<br>/gi;
      this.customs_notify_address1 = this.customs_notify_address1.replace(
        re,
        "\n"
      );
    }
    setTimeout(() => {
      if (this.notifyTextarea1) {
        this.notifyTextarea1.nativeElement.focus();
        console.log("notifyTextarea1");
      }
    }, 0);
  }
  customEditnotify2() {
    this.closeEditTax();
    this.cancelCustomTerms();
    this.edittaxInvoicenotify2 = true;
    this.showAddressnotify2 = false;
    if (this.customs_notify_address2) {
      var re = /<br>/gi;
      this.customs_notify_address2 = this.customs_notify_address2.replace(
        re,
        "\n"
      );
    }
    setTimeout(() => {
      if (this.notifyTextarea2) {
        this.notifyTextarea2.nativeElement.focus();
        console.log("notifyTextarea2");
      }
    }, 0);
  }
  valuBillEdit(event) {}
  public editTaxInvoiceshipping = false;
  public showAddressBill = true;
  customEditship() {
    this.closeEditTax();
    this.cancelCustomTerms();
    this.editTaxInvoiceshipping = true;
    this.showAddressBill = false;
    this.closeIcon = true;
    if (this.shipAdd) {
      var re = /<br>/gi;
      this.shipAdd = this.shipAdd.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.shipperTextarea1) {
        this.shipperTextarea1.nativeElement.focus();
      }
    }, 0);
  }
  editTaxinv(index: any, event: any, value: any) {
    let numberRegex = /[0-9.]/g;
    // if (
    //   numberRegex.test(event.key) ||
    //   event.key == "Backspace" ||
    //   event.key == "Delete"
    // ) {
    this.clickedIconId = value;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (
        this.taxInvoiceData[0].taxInvoice.invTaxAmounts[index]
        // ||
        // this.updatedTaxValueinsurance
      ) {
        if (value == "Freight") {
          this.freightCostvalue =
            this.updatedTaxFreight ||
            this.taxInvoiceData[0].taxInvoice.invTaxAmounts[index].value;
        }
        if (value == "Insurance") {
          this.InsuranceValue =
            this.updatedTaxValueinsurance ||
            this.taxInvoiceData[0].taxInvoice.invTaxAmounts[index].value;
        }

        this.OrdersService.saveTaxInvoice({
          orders_id: this.orders.selectedOrder.id,
          consignee_address: this.shipAdd.replace(/\n/g, "<br>"),
          buyers_address: this.buyerAdd.replace(/\n/g, "<br>"),
          freight: this.freightCostvalue.replace(/,/g, ""),
          insurance: this.InsuranceValue.replace(/,/g, ""),
          customs_notify_address1: this.customs_notify_address1,
          customs_notify_address2: this.customs_notify_address2,
          terms_cond_des: this.customTerms,
          productArr: this.productArra,
        }).then((response) => {
          if (response.result.success) {
            let toast: object;
            toast = { msg: response.result.message, status: "success" };
            this.snackbar.showSnackBar(toast);
            this.getTaxInv();
            this.getIgstInv();
            this.editTaxInvoiceshipping = false;
            this.edittaxInvoiceBill = false;
            this.showAddress = true;
            this.showAddressBill = true;
            this.extracolEdit.delete(this.saveKey);
            this.extracolEdit = new Set();
          } else {
            let toast: object;
            toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
            this.getTaxInv();
            this.getIgstInv();
            this.editTaxInvoiceshipping = false;
            this.edittaxInvoiceBill = false;
            this.showAddress = true;
            this.showAddressBill = true;
            this.extracolEdit.delete(this.saveKey);
            this.extracolEdit = new Set();
          }
        });
      }
    });
    // } else {
    //   return false;
    // }
  }
  updateNotify1() {
    this.showAddressnotify1 = true;
  }
  captureInitialValue(event: FocusEvent, field: number) {
    const target = event.target as HTMLTextAreaElement;
    this.initialValues = target.value;
    console.log(this.initialValues);
  }
  valuBillEditship(index: any, event: any, value: any) {
    let numberRegex = /[0-9.]/g;
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value.trim();
    const initialValue = this.initialValues ? this.initialValues.trim() : "";

    // Check if the value has changed
    if (newValue !== initialValue) {
      if (value == 2) {
        this.shipAdd = event.target.value;
        this.shipAdd = this.shipAdd.replace(/\n/g, "<br>");
      }
      if (value == 1) {
        this.buyerAdd = event.target.value;
        this.buyerAdd = this.buyerAdd.replace(/\n/g, "<br>");
      }
      if (value == 3) {
        this.customs_notify_address1 = event.target.value;
        this.customs_notify_address1 = this.customs_notify_address1.replace(
          /\n/g,
          "<br>"
        );
      }
      if (value == 4) {
        this.customs_notify_address2 = event.target.value;
        this.customs_notify_address2 = this.customs_notify_address2.replace(
          /\n/g,
          "<br>"
        );
      }
      if (value == "Freight") {
        this.freightCostvalue = event.target.innerText;
      }
      if (value == "Insurance") {
        this.InsuranceValue = event.target.innerText;
      }
      this.OrdersService.saveTaxInvoice({
        orders_id: this.orders.selectedOrder.id,
        consignee_address: this.shipAdd,
        buyers_address: this.buyerAdd,
        freight: this.freightCostvalue.replace(/,/g, ""),
        insurance: this.InsuranceValue.replace(/,/g, ""),
        productArr: this.productArra,
        customs_notify_address1: this.customs_notify_address1,
        customs_notify_address2: this.customs_notify_address2,
        terms_cond_des: this.customTerms,
      }).then((response) => {
        if (response.result.success) {
          this.getTaxInv();
          this.getIgstInv();
          this.editTaxInvoiceshipping = false;
          this.edittaxInvoiceBill = false;
          this.showAddress = true;
          this.showAddressBill = true;
          this.showAddressnotify1 = true;
          this.edittaxInvoicenotify1 = false;
          this.showAddressnotify2 = true;
          this.edittaxInvoicenotify2 = false;
          let toast: object;
          toast = { msg: response.result.message, status: "success" };
          this.snackbar.showSnackBar(toast);
        } else {
          this.getTaxInv();
          this.getIgstInv();
          this.editTaxInvoiceshipping = false;
          this.edittaxInvoiceBill = false;
          this.showAddress = true;
          this.showAddressBill = true;
          this.showAddressnotify1 = true;
          this.edittaxInvoicenotify1 = false;
          this.showAddressnotify2 = true;
          this.edittaxInvoicenotify2 = false;
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
      // }, 2000);
    } else {
      this.edittaxInvoicenotify2 = false;
      this.editTaxInvoiceshipping = false;
      this.edittaxInvoicenotify1 = false;
      this.edittaxInvoiceBill = false;
      this.showAddressnotify2 = true;
      this.showAddress = true;
      this.showAddressBill = true;
      this.showAddressnotify1 = true;
      setTimeout(() => {
        // this.getTaxInv();
      }, 100);
    }
  }
  // igstFreight(){
  // 	genIgstInvoice
  // }
  clickClose() {
    this.editTaxInvoiceshipping = false;
    this.closeIcon = false;
    this.showAddressBill = false;
  }
  changePonbr(product: any, event) {
    let numberRegex = /[A-Za-z0-9\s']/g;
    let poNumber: any;
    let productId: any;
    let quantity: any;
    let amount: any;
    this.clickedIconId = product.order_product_id;

    // if (
    //   numberRegex.test(event.key) ||
    //   event.key == "Backspace" ||
    //   event.key == "Delete"
    // ) {
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (product.po_nbr != "") {
        if (product.po_nbr != "") {
          if (product.po_nbr?.length <= 10) {
            // poNumber = this.editUpdatedPonoValue;
            poNumber = product.po_nbr;
            productId = product.order_product_id;
            //    this.modPoNum = poNumber;
            this.OrdersService.changePoNumbr({
              order_product_id: productId,
              id: this.orders.selectedOrder.id,
              po_nbr: poNumber,
              po_date: this.orders.selectedOrder.po_date
                ? this.orders.selectedOrder.po_date
                : "",
              line_item: this.orders.selectedOrder.line_item
                ? this.orders.selectedOrder.line_item
                : "",
              insurance: this.orders.selectedOrder.insurance
                ? this.orders.selectedOrder.insurance.replace(/,/g, "")
                : "",
              freight: this.orders.selectedOrder.freight
                ? this.orders.selectedOrder.freight.replace(/,/g, "")
                : "",
              discount: this.orders.selectedOrder.discount
                ? this.orders.selectedOrder.discount.replace(/,/g, "")
                : "",
              extra_col: this.orders.selectedOrder.extra_col
                ? this.orders.selectedOrder.extra_col
                : "",
            }).then((response) => {
              if (response.result.success) {
                let toast: object;
                toast = {
                  msg: "Order Details Updated Successfully",
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.package = !this.package;
                this.trigger.emit({ flag: "update" });
                this.editOrdersPONo = null;
                this.productPriceChange(response.result.data);
              }
            });
          } else {
            let toast: object;
            toast = {
              msg: "PO Number should not exceed 10 characters. ",
              status: "error",
            };
            this.snackbar.showSnackBar(toast);
            this.editOrdersPONo = null;
            this.productPriceChange();
          }
        }
      } else {
        this.editOrdersPONo = null;
        // this.productPriceChange();
      }
    });
    // }
    // else {
    //   return false;
    // }
  }
  addlineitemorders() {
    if (this.hasUnsavedEdits()) {
      this.closeEdit();
    }

    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        order_product_id: this.productId,
        id: this.orders.selectedOrder.id,
        po_nbr: this.orders.selectedOrder.po_nbr
          ? this.orders.selectedOrder.po_nbr
          : "",
        po_date: this.orders.selectedOrder.po_date
          ? this.orders.selectedOrder.po_date
          : "",
        line_item: this.orders.selectedOrder.line_item
          ? this.orders.selectedOrder.line_item
          : "",
        extra_col: this.orders.selectedOrder.extra_col,
        insurance: this.orders.selectedOrder.insurance
          ? this.orders.selectedOrder.insurance.replace(/,/g, "")
          : "",
        freight: this.orders.selectedOrder.freight
          ? this.orders.selectedOrder.freight.replace(/,/g, "")
          : "",
        discount: this.orders.selectedOrder.discount
          ? this.orders.selectedOrder.discount.replace(/,/g, "")
          : "",
        pannel: "order-details",
        key: "extra_col",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.orders.invoice = result.response.result.data.Invioce;
        let toast: object;
        this.orders.selectedOrder.extra_col =
          result.response.result.data.extra_col;
        this.orders.selectedOrder.total_amount =
          result.response.result.data.total_amount;
        if (
          this.orders.selectedOrder.orders_types_id >= "12" ||
          this.orders.selectedOrder.orders_types_id == "4" ||
          this.orders.selectedOrder.orders_types_id >= "6"
        ) {
          this.getTaxInv();
          this.getIgstInv();
        }
        toast = { msg: "Item Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  hasUnsavedEdits() {
    // Check for unsaved edits
    return (
      this.editOrdersQty !== null ||
      this.editOrderPriceState !== null ||
      this.editOrderDescription !== null ||
      this.editfreightState !== false ||
      this.editinsurancevalueState !== false ||
      this.editDescountstateState !== false
    );
  }
  deleteLineItemAccessOrders(index: any) {
    this.orders.selectedOrder.extra_col.splice(index, 1);
    let param = Object.assign({
      id: this.orders.selectedOrder.id,
      order_product_id: this.productId,
      po_nbr: "",
      po_date: this.orders.selectedOrder.po_date
        ? this.orders.selectedOrder.po_date
        : "",
      line_item: this.orders.selectedOrder.line_item
        ? this.orders.selectedOrder.line_item
        : "",
      extra_col: this.orders.selectedOrder.extra_col
        ? this.orders.selectedOrder.extra_col
        : "",
      insurance: this.orders.selectedOrder.insurance
        ? this.orders.selectedOrder.insurance.replace(/,/g, "")
        : "",
      freight: this.orders.selectedOrder.freight
        ? this.orders.selectedOrder.freight.replace(/,/g, "")
        : "",
      discount: this.orders.selectedOrder.discount
        ? this.orders.selectedOrder.discount.replace(/,/g, "")
        : "",
    });
    this.OrdersService.changePoNumbr(param).then((response) => {
      this.orders.selectedOrder.total_amount =
        response.result.data.total_amount;
      if (
        this.orders.selectedOrder.orders_types_id >= "12" ||
        this.orders.selectedOrder.orders_types_id == "4" ||
        this.orders.selectedOrder.orders_types_id >= "6"
      ) {
        this.getTaxInv();
        this.getIgstInv();
      }
      // this.orders.selectedOrder.extra_col = response.result.data.extra_col;
    });
  }
  deleteLineItemorderDetails(index: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.deleteLineItemAccessOrders(index);
        let toast: object;
        toast = { msg: " Item Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  canEditFreight(): boolean {
    // Add your condition logic here
    return !(
      this.orders.selectedOrder.status === "Cancelled" ||
      this.orders.selectedOrder.status === "Delivered"
    );
  }
  onTdInput(event: InputEvent) {
    const target = event.target as HTMLTableCellElement;
    if (!/^(\d+(\.\d{0,3})?)?$/.test(target.innerText)) {
      target.innerText = target.innerText.slice(0, -1);
      event.preventDefault();
    }
  }
  public discva;
  editDiscount(event, value, flag) {
    this.discva = event.target.innerText;
    if (this.discva <= Number(this.orders.selectedOrder.sub_total)) {
      this.editInsuranceFreight(event, value, flag);
    } else {
      let toast = { msg: "Updated Successfully.", status: "error" };
      this.snackbar.showSnackBar(toast);
    }
  }
  editInsuranceFreight(event, value, flag) {
    let insurance;
    let freight;
    let discount;
    let numberRegex = /[0-9.]/g;
    // if (
    //   numberRegex.test(event.key) ||
    //   event.key == "Backspace" ||
    //   event.key == "Delete"
    // ) {
    this.clickedIconId = flag;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (
        this.orders.selectedOrder.insurance ||
        this.orders.selectedOrder.freight ||
        this.orders.selectedOrder.discount
      ) {
        if (value == 1 || value == 2) {
          const innerTextWithoutCommas = event.target.innerText.replace(
            /,/g,
            ""
          );
          insurance =
            value == 1
              ? this.updatedValueinsurance ||
                this.orders.selectedOrder.insurance
              : this.orders.selectedOrder.insurance;
          freight =
            value == 2
              ? this.updatedFreight || this.orders.selectedOrder.freight
              : this.orders.selectedOrder.freight;
          discount = this.orders.selectedOrder.discount;

          let param = {
            id: this.orders.selectedOrder.id,
            po_nbr: this.orders.selectedOrder.po_nbr,
            po_date: this.orders.selectedOrder.po_date || "",
            line_item: this.orders.selectedOrder.line_item || "",
            extra_col: this.orders.selectedOrder.extra_col,
            insurance: insurance ? insurance.replace(/,/g, "") : "",
            freight: freight ? freight.replace(/,/g, "") : "",
            discount: discount ? discount.replace(/,/g, "") : "",
            order_product_id: this.productId,
            key: flag,
          };

          this.OrdersService.changePoNumbr(param).then((response) => {
            if (response.result.success) {
              this.orders.selectedOrder.insurance =
                response.result.data.insurance;
              this.orders.selectedOrder.freight = response.result.data.freight;
              this.orders.selectedOrder.discount =
                response.result.data.discount;
              this.orders.selectedOrder.total_amount =
                response.result.data.total_amount;
              if (
                this.orders.selectedOrder.orders_types_id >= "12" ||
                this.orders.selectedOrder.orders_types_id == "4" ||
                this.orders.selectedOrder.orders_types_id >= "6"
              ) {
                this.getTaxInv();
                this.getIgstInv();
              }
              let toast = {
                msg: "Order Details Updated Successfully.",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              this.productPriceChange(response.result.data);
            } else {
              let toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editinsurancevalueState = false;
              this.editfreightState = false;
            }
          });
        }

        if (value == 3) {
          discount =
            this.editdescountValue?.replace(/,/g, "") ||
            this.orders.selectedOrder.discount?.replace(/,/g, "");
          let a = parseFloat(
            this.orders.selectedOrder.sub_total.replace(/,/g, "")
          );

          if (parseFloat(discount) <= a) {
            let param = {
              id: this.orders.selectedOrder.id,
              po_nbr: this.orders.selectedOrder.po_nbr,
              po_date: this.orders.selectedOrder.po_date || "",
              line_item: this.orders.selectedOrder.line_item || "",
              extra_col: this.orders.selectedOrder.extra_col,
              insurance: this.orders.selectedOrder.insurance
                ? this.orders.selectedOrder.insurance.replace(/,/g, "")
                : "",
              freight: this.orders.selectedOrder.freight
                ? this.orders.selectedOrder.freight.replace(/,/g, "")
                : "",
              discount: discount ? discount.replace(/,/g, "") : "",
              order_product_id: this.productId,
              key: flag,
            };
            this.OrdersService.changePoNumbr(param).then((response) => {
              if (response.result.success) {
                this.orders.selectedOrder.insurance =
                  response.result.data.insurance;
                this.orders.selectedOrder.freight =
                  response.result.data.freight;
                this.orders.selectedOrder.discount =
                  response.result.data.discount;
                this.orders.selectedOrder.total_amount =
                  response.result.data.total_amount;
                if (
                  this.orders.selectedOrder.orders_types_id >= "12" ||
                  this.orders.selectedOrder.orders_types_id == "4" ||
                  this.orders.selectedOrder.orders_types_id >= "6"
                ) {
                  this.getTaxInv();
                  this.getIgstInv();
                }
                let toast = {
                  msg: "Order Details Updated Successfully.",
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.editDescountstateState = false;
                this.productPriceChange(response.result.data);
              } else {
                let toast = { msg: response.result.message, status: "error" };
                this.snackbar.showSnackBar(toast);
                this.editDescountstateState = false;
              }
            });
          } else {
            let toast = {
              msg: "Discount cannot exceed sub total.",
              status: "error",
            };
            this.editDescountstateState = false;
            this.snackbar.showSnackBar(toast);
            this.productPriceChange();
            event.target.innerText = this.orders.selectedOrder.discount;
          }
        }
      }
    });
    // } else {
    //   return false;
    // }
  }
  public orderOtherDetails: any;
  submitOtherOrderDetails(form) {
    let toast: object;
    if (!this.showLUT) {
      this.otherOrderDetailsForm.get("supplier_name")?.reset();
      this.otherOrderDetailsForm.get("supplier_invoice_no")?.reset();
      this.otherOrderDetailsForm.get("aapl_po_no")?.reset();
    }
    if (!this.showHAZ) {
      this.otherOrderDetailsForm.get("is_haz")?.reset();
    }
    let params = form.value;
    params.orders_id = this.orders.selectedOrder.id;
    params.id = this.orderOtherDetails?.id;
    params.is_save_other_details = true;
    if (form.valid) {
      this.othrOrdrDtlsSave = true;

      this.OrdersService.saveOtherOrderDetails(params).then((response) => {
        if (response.result.success) {
          if (this.is_automech) {
            this.displayScomet = true;
            if (this.orders.selectedOrder.orders_types_id == "11") {
              let status = 12;
              this.OrdersService.acceptOrder({
                id: this.orders.selectedOrder.id,
                orders_types_id: status,
                is_order_ready: true,
                confirm_sales: true,
              }).then((response) => {
                if (response.result.success) {
                  // if (this.orders.selectedOrder.orders_types_id < '12') {
                  this.orders.selectedOrder.orders_types_id = "12";
                  this.selectedOrderStatus = "Customs Clearance";
                  this.orders.selectedOrder.status_color_code = "#fa6";
                }
                // }
              });
              this.enableCustomDocs = true;
            }
          }
          if (response.result.data.id) {
            this.getIgstInv();
          }
          if (
            !this.is_automech &&
            this.orders.selectedOrder.orders_types_id == "11"
          ) {
            this.enableCustomDocs = true;
          }
          this.orderOtherDetails = response.result.data;
          if (this.orderOtherDetails.is_pharma) {
            this.displayAdc = true;
          } else {
            this.displayAdc = false;
          }

          if (this.orderOtherDetails.is_under_scomet) {
            this.displayScomet = true;
            this.displayNonScomet = false;
          } else {
            this.displayScomet = false;
            this.displayNonScomet = true;
          }

          if (this.orderOtherDetails.is_haz === "1") {
            this.displayAdcHaz = true;
            this.displayAdcNonHaz = false;
          } else if (this.orderOtherDetails.is_haz === "2") {
            this.displayAdcNonHaz = true;
            this.displayAdcHaz = false;
          } else {
            this.displayAdcNonHaz = this.displayAdcHaz = false;
          }
          this.otherOrderDetailsForm.markAsPristine();
          this.otherOrderDetailsState = false;
          toast = { msg: response.result.message, status: "success" };
          this.snackbar.showSnackBar(toast);
          this.othrOrdrDtlsSave = false;
        }
      });
    }
  }

  getOtherOrderDetails() {
    this.OrdersService.getOtherOrderDetails({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        this.orderOtherDetails = response.result.data;
        this.standard_declaration = response.result.data?.standard_declaration;
        if (
          !this.is_automech
            ? this.orders.selectedOrder.orders_types_id == "11" &&
              response.result.data?.is_save_other_details
            : this.orders.selectedOrder.orders_types_id == "12" &&
              response.result.data?.is_save_other_details
        ) {
          this.enableCustomDocs = true;
        }
        if (
          this.orderOtherDetails?.tax_type ===
            "Supply Meant for Export Under LUT" &&
          this.is_aapl
        ) {
          this.showLUT = true;
        }
        if (this.orderOtherDetails?.is_pharma === true) {
          this.showHAZ = true;
        }
        this.otherOrderDetailsForm.markAsPristine();
        this.setOtherOrderDetailsForm();
      }
    });
  }

  setOtherOrderDetailsForm() {
    let data = this.orderOtherDetails;
    this.otherOrderDetailsForm.patchValue({
      tax_type: data?.tax_type,
      standard_declaration: data?.standard_declaration,
      standard_declaration_tax: data?.standard_declaration_tax,

      is_under_scomet:
        data &&
        data.is_under_scomet !== null &&
        data.is_under_scomet !== undefined
          ? data.is_under_scomet == true
            ? "yes"
            : "no"
          : "",
      is_pharma:
        data && data.is_pharma !== null && data.is_pharma !== undefined
          ? data.is_pharma == true
            ? "yes"
            : "no"
          : "",
      is_haz:
        data && data.is_haz !== null && data.is_haz !== undefined
          ? data.is_haz === "0"
            ? ""
            : data.is_haz
          : "", //data?.is_haz,
      supplier_name: data?.supplier_name,
      supplier_invoice_no: data?.supplier_invoice_no,
      aapl_po_no: data?.aapl_po_no,
    });
  }
  updateWordCount(event): void {
    this.wordCount = this.textareaContent.length;
    this.wordCountotherinfo = this.textareaContents.length;
    this.wordCountStand1 = this.textCount.length;
  }

  public conversion_edit: boolean = false;
  public currency_conversion: number = 0;
  public conversion_value: boolean = false;
  originalCurrencyConversion: number;

  startEditing() {
    this.originalCurrencyConversion = this.currency_conversion;
    this.conversion_edit = true;
  }
  changeConversion(event: any) {
    this.conversion_value = true;
    const inputValue: string = event.target.value;
    const regex: RegExp = /^\d{1,4}(\.\d{0,2})?$/;

    if (!regex.test(inputValue)) {
      // Revert to the previous valid state of the input value
      const previousValue: string = inputValue.slice(0, -1);
      // event.target.value = Number(previousValue);
      // this.currency_conversion = previousValue;
      this.saveconverisonEnable = false; // You may want to adjust this based on your requirements
    } else {
      // Update the currency_conversion if the input is valid
      // this.currency_conversion = inputValue;
      this.saveconverisonEnable = true; // You may want to adjust this based on your requirements
    }
  }

  saveTaxConversion() {
    if (this.conversion_value) {
      let toast: object;
      this.OrdersService.saveTaxConversion({
        orders_id: this.orders.selectedOrder.id,
        currency_conversion: this.currency_conversion,
      }).then((response) => {
        if (response.result.success) {
          this.getIgstInv();
          toast = { msg: response.result.message, status: "success" };
          this.conversion_edit = false;
          this.conversion_value = false;
        } else {
          toast = { msg: response.result.message, status: "error" };
          this.conversion_edit = true;
        }
        this.snackbar.showSnackBar(toast);
      });
    } else {
      this.conversion_edit = false;
    }
  }
  closeConverionRate() {
    this.conversion_edit = false;
    this.currency_conversion = this.originalCurrencyConversion;
  }
  routingPac() {
    this.router.navigate(["/createOrders"]);
  }
  // adcForm() {
  // 	this.AdcForm = this.formBuilder.group({
  // 		batch_no:'',
  // 		manufacture_date:'',
  // 		expiry_date:''
  // 	})

  // }
  editAdcsheet() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  cancelAdc() {
    this.getSiDraft();
    this.editMode = false;
  }
  editAdcdeclaration() {
    if (!this.editModeAdc) {
      this.editModeAdc = true;
    } else {
      this.editModeAdc = false;
    }
  }
  cancelAdcdeclaration() {
    this.editModeAdc = false;
  }
  editSIDraft() {
    if (!this.editModeSIDraft) {
      this.editModeSIDraft = true;
    } else {
      this.editModeSIDraft = false;
    }
  }
  cancelSIDraft() {
    this.editModeSIDraft = false;
  }
  public adc_product;
  public adcProductsvalues = new Map();
  storeProduct_id(product) {
    this.adc_product = product.order_product_id;
  }
  selectedDate: Date;
  valueupdate(key, index, event) {
    const formatDate = (date) =>
      moment(date, "YYYY-MM-DD", true).isValid()
        ? moment(date).format("YYYY-MM-DD")
        : null;

    const updatedDate = this.selectedDate;

    if (key === "mfd_date" || key === "exp_date") {
      this.orders.invoice[0].ADCproductsData[index][key] = formatDate(
        event.target.value
      );
    } else {
      this.orders.invoice[0].ADCproductsData[index][key] = event.target.value; // Assign the formatted date to the property
    }
  }

  saveAdcDeclaration() {
    let toast: object;

    const formatDate = (date) =>
      moment(date, "DD-MM-YYYY", true).isValid()
        ? moment(date).format("DD-MM-YYYY")
        : null;
    this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "ADC_DECLARATION",
      context: {
        shipping_bill_date: formatDate(this.adcshipDate),
        shipping_bill_no: this.adcbillno,
      },

      // context:[{
      // batch_nbr: this.adcProductsvalues.get(this.adc_product).batch_nbr,
      //
      // manufacture_date: formatDate(this.adcSheet.manufacture_date) ,
      // expiry_date:formatDate(this.adcSheet.expiry_date),
      // product_id: this.adc_product
      // }]
    }).then((response) => {
      if (response.result.success) {
        this.editModeAdc = false;
        this.adcdeclaration = response.result.data.context;

        // this.getAdcshetValue = response.result.data?.context
        // const shippingInstructionData = response.result.data.type === "ADC_SHEET";
        // if (shippingInstructionData){
        // 	const context = response.result.data?.context
        // 			this.getAdcshetValue = context;
        // }
        // // const context = shippingInstructionData?.context
        // // this.getAdcshetValue = context;
        // console.log(this.getAdcshetValue)
        // this.getAdcshetValue = response.result.data
        toast = { msg: response.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
        toast = { msg: response.result.message, status: "error" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  saveAdcDocs(product_id) {
    let toast: object;

    const formatDate = (date) =>
      moment(date, "YYYY-MM-DD", true).isValid()
        ? moment(date).format("YYYY-MM-DD")
        : null;
    this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "ADC_SHEET",
      // context:[{
      // batch_nbr: this.adcProductsvalues.get(this.adc_product).batch_nbr,
      //
      // manufacture_date: formatDate(this.adcSheet.manufacture_date) ,
      // expiry_date:formatDate(this.adcSheet.expiry_date),
      // product_id: this.adc_product
      // }]
      context: this.orders.invoice[0].ADCproductsData,
    }).then((response) => {
      if (response.result.success) {
        this.editMode = false;
        this.orders.invoice[0].ADCproductsData = response.result.data?.context;
        // response.result.data?.context.some((data) => {
        //   this.getAdcshetValue.set(data.order_product_id, data);
        // });

        toast = { msg: response.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  // getAdcSheetinfo(): void {
  //   this.OrdersService.getAdcSheetinfo({
  //     orders_id: this.orders.selectedOrder.id,
  //   }).then((response) => {
  //     if (response.result.success) {
  //       if (response.result.data != null) {
  //         this.editMode = false;
  //         this.getAdcshetValue = response.result.data;
  //         this.adcSheet.batch_no = response.result.data.batch_no;
  //         this.adcSheet.manufacture_date =
  //           response.result.data.manufacture_date;
  //         this.adcSheet.expiry_date = response.result.data.expiry_date;
  //       } else {
  //         this.getAdcshetValue = ''
  //       }
  //     }
  //   });
  // }
  genrateAdcform() {
    this.adcForm = this.formBuilder.group({
      batch_no: [null],
      manufacture_date: [null],
      expiry_date: [null],
      product_id: [null],
    });
  }

  saveSiDraft() {
    let toast: object;
    this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "SHIPPING_INSTRUCTION_DRAFT",
      context: {
        vessel_no: this.siDraft.vessel_no,
        decription_of_goods: this.siDraft.decription_of_goods,
        gross_weight: this.siDraft.gross_weight,
        marks_and_nos: this.siDraft.marks_and_nos,
        no_of_packages: this.siDraft.no_of_packages,
      },
    }).then((response) => {
      if (response.result.success) {
        this.editModeSIDraft = false;
        // const shippingInstructionData = response.result.find(res => res.type === "SHIPPING_INSTRUCTION_DRAFT");
        this.getSiDraft();
        // const context = shippingInstructionData?.context
        this.getSidraft = response.result.data?.context;
        toast = { msg: response.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
      }
      toast = { msg: response.result.message, status: "success" };
      this.snackbar.showSnackBar(toast);
    });
  }
  public editinline: boolean = false;
  getSiDraft(): void {
    this.OrdersService.getOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
    }).then((response) => {
      if (response.result.success) {
        if (response.result.data != null) {
          this.commercialInvoiceData = response.result.data.find((item) => {
            return item?.type === "COMMERCIAL_INVOICE";
          })?.context;

          const shippingInstructionData = response.result.data.find(
            (res) => res?.type === "SHIPPING_INSTRUCTION_DRAFT"
          );
          const adcsheetData = response.result.data.find(
            (res) => res?.type === "ADC_SHEET"
          );
          if (this.orders.invoice[0]?.ADCproductsData) {
            this.orders.invoice[0].ADCproductsData = adcsheetData?.context;
          }

          const PackageList = response.result.data.find(
            (res) => res?.type === "PACKAGE_LIST"
          );
          this.inlineVGMData =
            response.result?.data?.find((res) => res?.type === "VGM")
              ?.context || {};
          this.inlineSelfSealData =
            response.result?.data?.find(
              (res) => res?.type === "SELF_SEAL_CERTIFICATE"
            )?.context || {};
          const contextPackage = PackageList?.context;

          this.scomataeditData = response.result.data.find(
            (res) => res?.type === "SCOMET"
          )?.context;
          this.nonScomatData = response.result.data.find(
            (res) => res?.type === "NON_SCOMET"
          )?.context;

          this.chaLetter = response.result.data.find(
            (res) => res?.type === "CHA_LETTER"
          )?.context;
          this.adcdeclaration = response.result.data.find(
            (res) => res?.type === "ADC_DECLARATION"
          )?.context;
          this.selfSelaContainer = response.result.data.find(
            (res) => res?.type === "SELF_SEALED_CONTAINER"
          )?.context;
          this.exportValueDecl = response.result.data.find(
            (res) => res?.type === "EXPORT_VALUE_DECLARATION"
          )?.context;
          this.ndpsData = response.result.data.find(
            (res) => res?.type === "NDPS_DECLARATION"
          )?.context;
          this.selectedOptions = this.exportValueDecl.relationship?.[0];
          this.selectedOptionsBuyer = this.exportValueDecl.seller_or_buyer?.[0];
          // console.log(this.exportValueDecl, "export");
          this.adcbillno = this.adcdeclaration?.shipping_bill_no;

          const dateString = this.adcdeclaration?.shipping_bill_date; // Assuming '14-11-202' is your date string
          const dateParts = dateString?.split("-");
          const day = parseInt(dateParts?.[0], 10);
          const month = parseInt(dateParts?.[1], 10) - 1; // Months are zero-based in JavaScript Date objects
          const year = parseInt(dateParts?.[2], 10);

          this.adcshipDate = new Date(year, month, day);

          // if(PackageList){
          this.packageEdit = contextPackage;
          // }
          const contextadc = adcsheetData?.context;

          // adcsheetData?.context?.some((data) => {
          //   this.getAdcshetValue.set(data.order_product_id, data);
          // });
          // this.getAdcshetValue = contextadc
          this.adcSheet.batch_no = contextadc?.batch_no;
          this.adcSheet.manufacture_date = contextadc?.manufacture_date;
          this.adcSheet.expiry_date = contextadc?.expiry_date;
          const context = shippingInstructionData?.context;
          this.getSidraft = context;
          this.siDraft.vessel_no = context?.vessel_no;
          this.siDraft.decription_of_goods = context?.decription_of_goods;
          this.siDraft.gross_weight = context?.gross_weight;
          this.siDraft.marks_and_nos = context?.marks_and_nos;
          this.siDraft.no_of_packages = context?.no_of_packages;

          const FormSdf = response.result.data.find(
            (res) => res?.type === "FORM_SDF"
          );
          if (this.Formsdf) {
            const contextSdf = FormSdf?.context;

            this.getSdfData = contextSdf;
            this.sdfFormDates.patchValue({
              entry_date: contextSdf?.entry_date,
              check_date: new Date(contextSdf?.check_date),
              shipping_bill_no: contextSdf?.shipping_bill_no,
            });
            this.getSdfData.shipping_bill_no = contextSdf?.shipping_bill_no;
            this.getSdfData.entry_date = contextSdf?.entry_date;
            // this.getSdfData?.entry_date=contextSdf?.entry_date
          }

          // if (Vgm) {
          //   this.inlineVGMData = Vgm?.context;
          // }
        } else {
          this.getSidraft = "";
        }
      }
    });
  }

  onArrivalDateChanged(event, dateType) {
    if (this.estimated_date && this.sailing_date) {
      const selectedDate: Date = dateType
        ? event.target.value
        : new Date(this.estimated_date);
      const currentDate: Date = dateType
        ? new Date(this.sailing_date)
        : event.target.value;

      // Calculate the time difference in milliseconds
      const timeDifferenceMs: number =
        selectedDate.getTime() - currentDate.getTime();

      // Convert milliseconds to days, hours, minutes, and seconds
      let daysDifference: number = Math.floor(
        timeDifferenceMs / (1000 * 60 * 60 * 24)
      );
      daysDifference = daysDifference < 0 ? 0 : daysDifference;
      const hoursDifference: number = Math.floor(
        (timeDifferenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutesDifference: number = Math.floor(
        (timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const secondsDifference: number = Math.floor(
        (timeDifferenceMs % (1000 * 60)) / 1000
      );
      if (hoursDifference > 4 || daysDifference === 0) {
        this.transistTime = daysDifference + 1 + " Days";
      } else this.transistTime = daysDifference + " Days";
    }
  }

  onSelectionChanged = (event) => {
    if (event.oldRange == null) {
      this.onFocus();
    }
    if (event.range == null) {
      // this.onBlur();
    }
  };

  onContentChanged = (event) => {
    // console.log(event, 453);
    // this.packageDescription = event.html;
  };

  onFocus = () => {};
  // onBlur = () => {};
  openActivityModal(type): void {
    // this.closeEdit();
    // this.closeEditTax();
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        type: type,
        orders_id: this.orderId,
      },
    });
  }

  public freightForm;
  public shippingform;
  getFormEvent(ev) {
    if (ev.module === "frieght_form") {
      this.freightForm = ev;
      if (ev.hasOwnProperty("stuffing") && ev?.stuffing == "Factory Stuffing") {
        this.showSSCON = true;
        this.showVGMD = true;
      } else {
        this.showSSCON = false;
        this.showVGMD = false;
      }
    } else if (ev.module === "shipping_details") {
      this.shippingform = ev;
    }
    if (ev.hasOwnProperty("enableCustomDocs"))
      this.enableCustomDocs = ev.enableCustomDocs;
    if (ev.hasOwnProperty("displayScomet"))
      this.displayScomet = ev.displayScomet;
    if (ev.hasOwnProperty("displayNonScomet"))
      this.displayNonScomet = ev.displayNonScomet;
    if (ev.hasOwnProperty("displayAdc")) this.displayAdcHaz = ev.displayAdcHaz;
    if (ev.hasOwnProperty("displayAdcNonHaz"))
      this.displayAdcNonHaz = ev.displayAdcNonHaz;
    if (ev.hasOwnProperty("displayAdc")) this.displayAdc = ev.displayAdc;
    if (ev.hasOwnProperty("selectedOrderStatus"))
      this.selectedOrderStatus = ev.selectedOrderStatus;
    if (ev.hasOwnProperty("orders_types_id"))
      this.orders.selectedOrder.orders_types_id = ev.orders_types_id;
    if (ev.hasOwnProperty("status_color_code"))
      this.orders.selectedOrder.status_color_code = ev.status_color_code;
  }

  public saveFreightFlag = 1;
  public saveShippedFlag = 1;
  public carrierFlag;
  getFormsInfo(ev) {
    this.saveFreight = ev?.saveFreight;
    this.carrierFlag = ev?.carrier_booking_rfno;
    if (ev.module === "other_order_details") {
      this.getIgstInv();
    }
    if (ev.module === "shipperDetails") {
      this.getSiDraft();
      this.getInvoiceData();
    }
    if (ev.module === "shipperDetails") {
      this.saveShippedFlag = this.saveShippedFlag + 1;
    } else {
      this.saveFreightFlag = this.saveFreightFlag + 1;
    }
    if (ev.hasOwnProperty("selectedOrderStatus"))
      this.selectedOrderStatus = ev.selectedOrderStatus;
    if (ev.hasOwnProperty("orders_types_id"))
      this.orders.selectedOrder.orders_types_id = ev.orders_types_id;
    if (ev.hasOwnProperty("showEditIcon")) this.showEditIcon = ev.showEditIcon;
    if (ev.hasOwnProperty("sendDocumentMails"))
      this.sendDocumentMails = ev.sendDocumentMails;
    if (ev.hasOwnProperty("shipping_data"))
      this.getSidraft.bol_no = ev.shipping_data.bol_id;
    if (ev.hasOwnProperty("carrier_booking_rfno")) {
      this.getSidraft.booking_no = ev.carrier_booking_rfno;
    }
    console.log(ev);
    if (
      ev.module == "freightandlogistics" &&
      ev.hasOwnProperty("stuffing") &&
      ev?.stuffing == "Factory Stuffing"
    ) {
      this.showSSCON = true;
      this.showVGMD = true;
    }
  }
  public moduleName = "";
  formEmitEvent(obj: any) {
    this.moduleName = obj.module;
  }

  parseDateStringToDate(dateString, limit?: boolean) {
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1; // Month in JavaScript starts from 0
    var year = parseInt(parts[2], 10);

    var date = new Date(year, month, day);

    if (limit) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }
  editCustomTerms() {
    this.editcusTermsCndt = true;

    if (this.customTerms) {
      var re = /<br>/gi;
      this.customTerms = this.customTerms.replace(re, "\n");
    }
    this.closeEditTax();
  }
  cancelCustomTerms() {
    this.editcusTermsCndt = false;
    this.customTerms = this.orginalCustomerTerms;
  }
  saveCustomTerms() {
    this.OrdersService.saveTaxInvoice({
      orders_id: this.orders.selectedOrder.id,
      product: this.productArra,
      terms_cond_des: this.customTerms.replace(/\n/g, "<br>"),
      consignee_address: this.shipAdd,
      buyers_address: this.buyerAdd,
      freight: this.freightCostvalue.replace(/,/g, ""),
      insurance: this.InsuranceValue.replace(/,/g, ""),
      customs_notify_address1: this.customs_notify_address1,
      customs_notify_address2: this.customs_notify_address2,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: response.result.message, status: "success" };
        this.snackbar.showSnackBar(toast);
        // this.getInvoiceData()
        this.editcusTermsCndt = false;
        this.getTaxInv();
      } else {
        let toast: object;
        toast = { msg: response.result.message, status: "error" };
        this.snackbar.showSnackBar(toast);
        this.getTaxInv();
        this.editcusTermsCndt = false;
      }
    });
  }
  async saveExportValueDeclaration() {
    if (this.exportValueDecl.shipping_date) {
      this.exportValueDecl.shipping_date = moment(
        this.exportValueDecl.shipping_date
      ).format("YYYY-MM-DD");
    }

    let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
      orders_id: this.orders.selectedOrder.id,
      type: "EXPORT_VALUE_DECLARATION",

      context: this.exportValueDecl,
    });
    if (response.result.success) {
      this.data = response.result.data.context;
      let toast: object;
      toast = {
        msg: "Export Value Declaration Updated Successfully",
        status: "success",
      };
      this.snackbar.showSnackBar(toast);
    } else {
      let toast: object;
      toast = {
        msg: "Export Value Declaration Update Failed",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
    }

    this.editExport = false;
  }
  // isCheckednature(item) {
  //   console.log(this.exportValueDecl, "675");
  //   // this.exportValueDecl.nature_of_traction.includes(item);
  // }
  // onNatureoftransactionChange(event, item) {
  //   console.log(this.exportValueDecl?.nature_of_traction, "change");
  //   if (event.checked) {
  //     this.exportValueDecl.nature_of_traction.push(item);
  //   } else {
  //     const index = this.exportValueDecl.nature_of_traction.indexOf(item);
  //     if (index >= 0) {
  //       this.exportValueDecl.nature_of_traction.splice(index, 1);
  //     }
  //   }
  // }
  isCheckednature(item: string): boolean {
    return this.exportValueDecl?.nature_of_traction?.includes(item) || false;
  }

  onNatureoftransactionChange(event, item: string) {
    if (event.checked) {
      this.exportValueDecl.nature_of_traction.push(item);
    } else {
      const index = this.exportValueDecl.nature_of_traction.indexOf(item);
      if (index >= 0) {
        this.exportValueDecl.nature_of_traction.splice(index, 1);
      }
    }
  }
  isCheckedmethod(item: string): boolean {
    return this.exportValueDecl?.method_of_valuation?.includes(item) || false;
  }

  onMethodOf(event, item: string) {
    if (event.checked) {
      this.exportValueDecl.method_of_valuation.push(item);
    } else {
      // this.exportValueDecl.method_of_valuation.remove(item);
      const index = this.exportValueDecl.method_of_valuation.indexOf(item);
      if (index >= 0) {
        this.exportValueDecl.method_of_valuation.splice(index, 1);
      }
    }
  }
  onSelectionChange(selectedOption: string) {
    // Clear the array and add the selected option
    // this.selectedOptions = [];
    if (selectedOption) {
      this.exportValueDecl.relationship[0] = selectedOption;
    }
  }
  onSelectionChangeSeller(selectedOption: string) {
    // Clear the array and add the selected option
    // this.selectedOptions = [];
    if (selectedOption) {
      this.exportValueDecl.seller_or_buyer[0] = selectedOption;
    }
  }
  onRadioButtonClicked(option: string) {
    // Update the selectedOptions model with the clicked option
    this.selectedOptions = option;
    // Perform any other necessary actions based on the selected option
  }
  closeEdit() {
    // this.orders.selectedOrder = JSON.parse(
    //   JSON.stringify(this.originalOrdersData)
    // ); // Restore the original invoice data
    // this.orders.productsData = JSON.parse(
    //   JSON.stringify(this.originalOrdersProductData)
    // );
    // Restore the original invoice data
    if (this.editOrdersQty || this.editOrderPriceState || this.editOrdersPONo) {
      this.orders.productsData.data = JSON.parse(
        JSON.stringify(this.originalOrdersProductData)
      );
    }
    if (
      this.editfreightState ||
      this.editinsurancevalueState ||
      this.editDescountstateState
    ) {
      this.orders.selectedOrder = { ...this.originalOrdersData };
    } // Restore the original invoice data
    this.editOrdersQty = null;
    this.editOrderPriceState = null;
    this.editOrderDescription = null;
    this.editfreightState = false;
    this.editinsurancevalueState = false;
    this.editDescountstateState = false;
    this.editOrdersPONo = null;
    this.updatedFreight = null;
    this.updatedValueinsurance = null;
    this.editdescountValue = null;
  }
  editQuntity(key, productId) {
    // this.originalOrdersProductData = JSON.parse(
    //   JSON.stringify(this.orders.productsData)
    // );
    this.orders.productsData.data = this.originalOrdersProductData.map(
      (product) => ({ ...product })
    );
    setTimeout(() => {
      this.orders.selectedOrder = { ...this.originalOrdersData };
      this.editfreightState = false;
      this.editinsurancevalueState = false;
      this.editDescountstateState = false;
      if (key === "quantity") {
        this.editOrdersQty = productId;
        this.editOrderPriceState = null;
        this.editOrderDescription = null;
        this.editOrdersPONo = null;
      } else if (key === "price") {
        this.editOrderPriceState = productId;
        this.editOrdersQty = null;
        this.editOrderDescription = null;
        this.editOrdersPONo = null;
      } else if (key === "description") {
        this.editOrderDescription = productId;
        this.editOrdersQty = null;
        this.editOrderPriceState = null;
        this.editOrdersPONo = null;
      } else if (key === "pono") {
        this.editOrdersPONo = productId;
        this.editOrderDescription = null;
        this.editOrdersQty = null;
        this.editOrderPriceState = null;
      }
    }, 100);
    setTimeout(() => {
      this.orderDetailEditInput.nativeElement.focus();
    }, 100);
  }
  saveEditQuntity($event, key, index?: any) {
    if (key === "quantity") {
      this.editUpdatedQtyValue = $event.target.value;
    } else if (key === "price") {
      this.editUpdatedPriceValue = $event.target.value;
    } else if (key === "description") {
      // this.editUpdatedDescriptionValue = $event.target.innerText;
      this.orders.productsData.data[index - 1]["p_description"] =
        $event.target.innerText;
    } else if (key == "pono") {
      this.editUpdatedPonoValue = $event.target.value;
      this.orders.productsData.data[index - 1]["po_nbr"] = $event.target.value;
    }
  }
  editInsurancefre(key) {
    // event.stopPropagation();
    this.orders.productsData.data = this.originalOrdersProductData.map(
      (product) => ({ ...product })
    );
    this.orders.selectedOrder = { ...this.originalOrdersData };
    this.editOrderDescription = null;
    this.editOrdersQty = null;
    this.editOrderPriceState = null;
    this.editOrdersPONo = null;
    setTimeout(() => {
      if (key == "freight") {
        this.editfreightState = true;
        this.editinsurancevalueState = false;
        this.editDescountstateState = false;
        setTimeout(() => {
          this.orderDetailEditFright.nativeElement.focus();
        }, 100);
      } else if (key == "insurance") {
        this.editinsurancevalueState = true;
        this.editfreightState = false;
        this.editDescountstateState = false;
        setTimeout(() => {
          this.orderDetailEditInsurance.nativeElement.focus();
        }, 100);
      } else if (key == "discount") {
        this.editDescountstateState = true;
        this.editfreightState = false;
        this.editinsurancevalueState = false;
        setTimeout(() => {
          this.orderDetailEditDiscount.nativeElement.focus();
        }, 100);
      }
    }, 100);
  }
  savefreighdescount(event, key) {
    if (key === "freight") {
      this.updatedFreight = event.target.value;
    } else if (key === "insurance") {
      this.updatedValueinsurance = event.target.value;
    } else if (key === "discount") {
      this.editdescountValue = event.target.value;
    }
  }
  extracolEdit = new Set();
  taxinvoiceEdit(key, productId?) {
    this.taxInvoiceData = JSON.parse(JSON.stringify(this.originalTaxInvData));
    this.extracolEdit = new Set();
    this.updatedTaxFreight = null;
    this.updatedTaxValueinsurance = null;

    if (this.extracolEdit.has(key)) {
      this.extracolEdit.delete(key);
    } else {
      this.extracolEdit.add(key);
    }
    if (key == "Freight") {
      this.editTaxInsurancevalueState = false;
      this.editTaxPrice = null;
      this.editTaxfreightState = true;
    } else if (key == "Insurance") {
      this.editTaxfreightState = false;
      this.editTaxInsurancevalueState = productId;
      this.editTaxPrice = null;
    } else if (key == "price") {
      this.editTaxfreightState = false;
      this.editTaxInsurancevalueState = false;
      this.editTaxPrice = productId;
    }
    this.cancelCustomTerms();
    setTimeout(() => {
      this.taxInvEditInput.nativeElement.focus();
    }, 100);
  }

  saveTaxfreighInsu(event, key) {
    this.saveKey = key;
    if (key === "Freight") {
      this.updatedTaxFreight = event.target.value;
    } else if (key === "Insurance") {
      this.updatedTaxValueinsurance = event.target.value;
    }
    if (key === "price") {
      this.UpdateTaxPriceValue = event.target.value;
    }
  }
  closeEditTax(key?: string) {
    if (this.taxInvoiceData.length) {
      this.taxInvoiceData[0].productsData = JSON.parse(
        JSON.stringify(this.originalTaxInvData[0].productsData)
      );
      this.taxInvoiceData[0].taxInvoice.invTaxAmounts = JSON.parse(
        JSON.stringify(this.originalTaxInvData[0].taxInvoice.invTaxAmounts)
      );
      this.extracolEdit = new Set();
      this.editTaxfreightState = false;
      this.editTaxInsurancevalueState = false;
      this.editTaxPrice = null;
      this.updatedTaxFreight = null;
      this.updatedTaxValueinsurance = null;
    }
    // this.getTaxInv();
  }
  removeCommas(event) {
    event.target.value = event.target.value.replace(/,/g, "");
  }

  openEditDescription(productData) {
    this.closeConverionRate();
    let dialogRef = this.dialog.open(EditDesciptionModelComponent, {
      width: "550px",
      data: {
        productData: productData,
        type: "order",
        toastMsg: "Order Details Updated Successfully",
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.getInvoiceData();
        this.productPriceChange();
      }
    });
  }
  public clickedIconId = null;

  onBlur(event: FocusEvent, productId: number): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (this.clickedIconId === productId || this.clickedIconId === "edit") {
      this.clickedIconId = null; // Reset the flag
      return;
    }

    this.closeEdit();
    this.closeEditTax();
  }
}
