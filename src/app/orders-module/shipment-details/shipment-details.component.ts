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

import { FormControl } from "@angular/forms";
import * as moment from "moment";
import { DomSanitizer, SafeHtml, Title } from "@angular/platform-browser";
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
import { AgProductEditComponent } from "../../shared/components/ag-product-edit/ag-product-edit.component";
import { LeadsService } from "../../leads/leads.service";
import { UtilsService } from "../../services/utils.service";
import { HttpClient } from "@angular/common/http";
declare var App: any;

const {
  language: {
    orders: { value: commercial_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-shipment-details",
  templateUrl: "./shipment-details.component.html",
  styleUrls: ["./shipment-details.component.scss"],

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
export class ShipmentDetailsComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  public commercialName = commercial_name;
  @Input() roles;
  private css = "@page { size: landscape; }";
  private head = document.head || document.getElementsByClassName("adc-sheet");
  private style = document.createElement("style");
  private App = App;
  public userDetails: any;
  public orderButton: any;
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean;
  containsMilk: boolean;
  public containerError;
  getExportData: any;
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
  public showItems = true;
  public activePayment = false;
  public showPackage: boolean = true;
  public showShipping: boolean = true;
  public shippingDocs: boolean = true;
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
  public customsInvoiceData: any;
  public tax_conversion_value: any = 0;
  // public typeStuffing = [
  //   { name: "Dock Stuffing", id: "1" },
  //   { name: "Factory Stuffing", id: "2" },
  //   { name: "On-wheel Stuffing", id: "3" },
  // ];
  // public typeOfContainer = [
  //   { name: "Dock LCL", id: "1" },
  //   { name: "20’STD", id: "2" },
  //   { name: "20’RFR", id: "3" },
  //   { name: "40’HC", id: "4" },
  //   { name: "40’STD", id: "5" },
  //   { name: "40’RFR", id: "6" },
  // ];
  // public freightCostCurrency = [
  //   { name: "INR", id: "1" },
  //   { name: "USD", id: "2" },
  //   { name: "EURO", id: "3" },
  // ];
  // public precarriage = [
  //   { name: "Road", id: "Road" },
  //   { name: "Rail", id: "Rail" },
  // ];
  // public receiptCarrier = [
  //   { name: "Pune ", id: "Pune" },
  //   { name: "Pithampur", id: "Pithampur" },
  // ];

  public taxType;

  // displayedColumns = [
  //   "order_product_id",
  //   "product_name",
  //   "product_description",
  //   "product_quantity",
  //   "product_uom",
  //   "product_price",
  //   "product_price_total",
  // ];

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
  // public docsList = {
  //   standardLinks: [
  //     {
  //       id: 0,
  //       name: "Activity",
  //       selected: true,
  //       class: "activity",
  //       function: "moveToActivity",
  //       imgSrc: this.images.activity_small,
  //     },
  //     {
  //       id: 1,
  //       name: "Order Details",
  //       selected: true,
  //       class: "details",
  //       function: "moveToDetails",
  //       imgSrc: this.images.orders_small,
  //     },
  //     {
  //       id: 2,
  //       name: "Invoice",
  //       selected: true,
  //       class: "invoice",
  //       function: "moveToInvoice",
  //       imgSrc: this.images.invoice_small,
  //     },
  //     {
  //       id: 2,
  //       name: "Invoice LUT",
  //       selected: true,
  //       class: "invoiceLUT",
  //       function: "moveToInvoiceLut",
  //       imgSrc: this.images.invoice_small,
  //     },
  //     {
  //       id: 3,
  //       name: "Packing Details",
  //       selected: true,
  //       class: "packaging",
  //       function: "moveToPackaging",
  //       imgSrc: this.images.pkgDetails_small,
  //     },
  //     {
  //       id: 5,
  //       name: "UOM",
  //       selected: true,
  //       class: "uom",
  //       function: "moveToUom",
  //       imgSrc: this.images.pkgDetails_small,
  //     },
  //     {
  //       id: 5,
  //       name: "moveToPackaging",
  //       selected: true,
  //       class: "moveToPackaging",
  //       function: "moveToPackaging",
  //       imgSrc: this.images.pkgDetails_small,
  //     },

  //     {
  //       id: 4,
  //       name: "COA",
  //       selected: true,
  //       class: "coa",
  //       function: "moveToCoa",
  //       imgSrc: this.images.coa_small,
  //     },
  //     {
  //       id: 99,
  //       name: "Shipping Details",
  //       selected: true,
  //       class: "shipping",
  //       function: "moveToShipping",
  //       imgSrc: this.images.shippingDetails_small,
  //     },
  //   ],
  //   preShip: [
  //     {
  //       id: 5,
  //       name: "MSDSss Form",
  //       selected: true,
  //       class: "msdsForm",
  //       function: "moveToMsdsForm",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 6,
  //       name: "ICTT - DECLARATION",
  //       selected: true,
  //       class: "ictt",
  //       function: "moveToIcttForm",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 7,
  //       name: "Non Hazardous Certificate",
  //       selected: true,
  //       class: "nonHazardous",
  //       function: "moveToNonHazardous",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 8,
  //       name: "Form SDF",
  //       selected: true,
  //       class: "Formsdf",
  //       function: "moveToFormSdf",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 9,
  //       name: "Export Value Declaration",
  //       selected: false,
  //       class: "Exportvalue",
  //       function: "moveToExportValue",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 10,
  //       name: "Declaration",
  //       selected: false,
  //       class: "Declaration",
  //       function: "moveToDeclaration",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 11,
  //       name: "Shipper's Letter",
  //       selected: false,
  //       class: "Shipperletter",
  //       function: "moveToShipperLetter",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 12,
  //       name: "ADC Sheet",
  //       selected: false,
  //       class: "Adcsheet",
  //       function: "moveToAdcSheet",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 13,
  //       name: "Declaration For Incentive",
  //       selected: false,
  //       class: "Incentivedeclaration",
  //       function: "moveToIncentive",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 14,
  //       name: "Scomat Declaration",
  //       selected: false,
  //       class: "Scomatdeclaration",
  //       function: "moveToScomat",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 15,
  //       name: "Turn Over Declaration",
  //       selected: false,
  //       class: "Concern",
  //       function: "moveToConcern",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 16,
  //       name: "Ad Code",
  //       selected: false,
  //       class: "Adcode",
  //       function: "moveToAdcode",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 17,
  //       name: "SSI",
  //       selected: false,
  //       class: "Ssi",
  //       function: "moveToSsi",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 18,
  //       name: "Check List",
  //       selected: false,
  //       class: "Unit",
  //       function: "moveToUnit",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 19,
  //       name: "Self Sealed Report",
  //       selected: false,
  //       class: "SealedReport",
  //       function: "moveToSealed",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 20,
  //       name: "DRAFT BL",
  //       selected: false,
  //       class: "DraftBl",
  //       function: "moveToDraftBl",
  //       imgSrc: this.images.pdf_download,
  //     },
  //   ],
  //   postShip: [
  //     {
  //       id: 15,
  //       name: "Country Of Origin",
  //       selected: true,
  //       class: "Origin",
  //       function: "moveToOrigin",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 16,
  //       name: "Insurance",
  //       selected: true,
  //       class: "insurance",
  //       function: "moveToInsurance",
  //       imgSrc: this.images.pdf_download,
  //     },
  //     {
  //       id: 17,
  //       name: "Shipping Bill",
  //       selected: true,
  //       class: "airway",
  //       function: "moveToAirway",
  //       imgSrc: this.images.pdf_download,
  //     },
  //   ],
  // };
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
  // public icttData = {
  //   quantity: "",
  //   net_weight: "",
  //   gross_weight: "",
  //   cm: "",
  //   destination: "",
  //   country: "",
  //   vessel_name: "",
  //   export_address1: "",
  //   export_address2: "",
  //   export_country: "",
  //   export_state: "",
  //   export_city: "",
  //   export_postal: "",
  //   shipping_no: "",
  //   date_added: "",
  //   product_name: "",
  //   items: [],
  // };
  public orders: any = {
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
      status_id: "",
      status_slug: "",
      tareWeight: 0,
      netWeight: 0,
      grossWeight: 0,
      special_instructions: "",
      po_date: "",
      line_item: "",
      is_order_ready: false,
      confirm_sales: false,
      status_color_code: "",
      add_line_items: [],
      freight: "",
      insurance: "",
      discount: "",
      sub_total: "",
      totals: {},
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
  // public transportModeList = [
  //   { id: 1, name: "Air" },
  //   { id: 2, name: "Sea" },
  // ];
  public paymentStatus = false;
  public showNotifyAddress = false;
  public CoaDetails = [];
  // public reports = {
  //   batchReportDt: {},
  //   batchesCoaDt: [],
  //   batch_id: "",
  // };
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
  // public exportValue = {
  //   e_shipping_bill_no: "",
  //   orders_id: this.orders.selectedOrder.id || 0,
  //   e_entry_date: "",
  //   e2_entry_date: "",
  // };
  // public adcSheet = {
  //   batch_no: "",
  //   manufacture_date: "",
  //   expiry_date: "",
  // };
  // public siDraft = {
  //   vessel_no: "",
  //   marks_and_nos: "",
  //   no_of_packages: "",
  //   decription_of_goods: "",
  //   gross_weight: "",
  // };
  // public getSdfData = {
  //   shipping_bill_no: "",
  //   entry_date: "",
  //   check_date: "",
  // };
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
  public editaddlineItem: any;
  @ViewChild("stepper") stepper: TemplateRef<any>;
  @ViewChild("scrollContainer") scrollContainer: TemplateRef<any>;
  @ViewChild("activity") activity: TemplateRef<any>;

  @ViewChild("details") details: TemplateRef<any>;
  @ViewChild("items") items: TemplateRef<any>;
  @ViewChild("Specs") specs: TemplateRef<any>;
  @ViewChild("payments") payment: TemplateRef<any>;

  @ViewChild("Packaging") packaging: TemplateRef<any>;
  @ViewChild("Containers") shipmentContainers: TemplateRef<any>;

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

  @ViewChild("customsInvoice") customsInvoice: TemplateRef<any>;
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
  @ViewChild("stuffing") stuffing: TemplateRef<any>;
  @ViewChild("shipping_docs") shipping_docs: TemplateRef<any>;
  @ViewChild("paymentDetails") paymentDetails: TemplateRef<any>;
  @ViewChild("otherDocuments") otherDocument: TemplateRef<any>;
  @ViewChild("generatePreDocs") generatePreDocs: TemplateRef<any>;
  @ViewChild("generatePostDoc") generatePostDocs: TemplateRef<any>;
  @ViewChild("shippingBill") shippingBill: TemplateRef<any>;
  @ViewChild("prePostDocuments") prePostDocument: TemplateRef<any>;
  @ViewChild("orderDetailEditAddline") orderDetailEditAddline: ElementRef<any>;
  @ViewChild("dutyDrawback") dutyDrawback: TemplateRef<any>;
  @ViewChild("rodTep") rodTep: TemplateRef<any>;

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
  private hasDropZoneOver: boolean = false;
  public isMerchantExporter: boolean = true;
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
  public preShipDocs: boolean = false;
  public postShipDocs: boolean = false;
  public customDocs: boolean = false;

  public po_date2 = new Date(
    this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ""
  );
  public selectedOrderData = {};
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
  source: any;
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
        toast = { msg: "Line Item Added Successfully", status: "success" };
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

  // changePrice(product: any, event: any, value: any) {
  //   let numberRegex = /[0-9.]/g;
  //   let price: any;
  //   let productId: any;
  //   let quantity: any;
  //   let amount: any;
  //   let single_piece;
  //   this.clickedIconId = product.order_product_id;

  //   if (this.timestamp) clearTimeout(this.timestamp);
  //   this.timestamp = setTimeout(() => {
  //     if (value == 0) {
  //       if (
  //         this.editUpdatedPriceValue != "" ||
  //         this.editUpdatedPriceValue != ""
  //       ) {
  //         price = product.product_price_number;
  //         if (price == 0) {
  //           let toast: object;
  //           toast = {
  //             msg: "Price should be greater than Zero",
  //             status: "error",
  //           };
  //           this.snackbar.showSnackBar(toast);
  //           this.editOrderPriceState = null;
  //           this.closeEdit();
  //           this.updatedGetViewDetails("shipment_details");
  //           return;
  //         }
  //         productId = product.order_product_id;
  //         this.OrdersService.changePrice({
  //           price:
  //             product.product_price_number?.replace(/,/g, "") ||
  //             product.product_price_number,
  //           order_product_id: productId,
  //           quantity:
  //             product.product_quantity?.replace(/,/g, "") ||
  //             product.product_quantity,
  //           single_piece: product.single_piece,
  //         }).then((response) => {
  //           if (response.result.success) {
  //             this.updatedGetViewDetails("shipment_details");
  //             this.getInvoiceData();
  //             let toast: object;
  //             toast = {
  //               msg: "Order Details Updated Successfully",
  //               status: "success",
  //             };
  //             this.snackbar.showSnackBar(toast);
  //             this.editOrderPriceState = null;
  //           } else {
  //             let toast: object;
  //             toast = { msg: "Failed to Update", status: "error" };
  //             this.snackbar.showSnackBar(toast);
  //             this.editOrderPriceState = null;
  //             this.updatedGetViewDetails("shipment_details");
  //           }
  //         });
  //       }
  //     } else if (value == 1) {
  //       if (this.editUpdatedQtyValue != "") {
  //         quantity =
  //           product.product_quantity?.replace(/,/g, "") ||
  //           product.product_quantity;
  //         productId = product.order_product_id;
  //         this.OrdersService.changePrice({
  //           quantity: quantity,
  //           order_product_id: productId,
  //           price:
  //             product.product_price_number?.replace(/,/g, "") ||
  //             product.product_price_number,
  //           single_piece: product.single_piece,
  //         }).then((response) => {
  //           if (response.result.success) {
  //             this.updatedGetViewDetails("shipment_details");
  //             this.getInvoiceData();
  //             let toast: object;
  //             toast = {
  //               msg: "Order Details Updated Successfully",
  //               status: "success",
  //             };
  //             this.snackbar.showSnackBar(toast);
  //             this.editOrdersQty = null;
  //           } else {
  //             let toast: object;
  //             toast = { msg: response.result.message, status: "error" };
  //             this.snackbar.showSnackBar(toast);
  //             this.editOrdersQty = null;
  //             this.closeEdit();
  //             this.updatedGetViewDetails("shipment_details");
  //           }
  //         });
  //       }
  //     }
  //   });
  // }

  updatedGetViewDetails(type: string, updateProduct?: any) {
    // this.data.id = this.orders.selectedOrder.id;
    this.OrdersService.getViewDetails({
      id: this.data.id,
      type: type,
    }).then((response) => {
      let selectedOrderDetails = response.result.data;
      if (type === "shipment_details") {
        this.orders.selectedOrder = {
          ...selectedOrderDetails.subtotal_form[0],
          ...selectedOrderDetails.create_shipment[0],
          add_line_items: selectedOrderDetails.add_line_items || [],
        };
        this.originalOrdersData = {
          ...selectedOrderDetails.subtotal_form[0],
          ...selectedOrderDetails.create_shipment[0],
          add_line_items: selectedOrderDetails.add_line_items || [],
        };
        this.orders.companyShpAddrDt =
          selectedOrderDetails.create_shipment[0].shipper_address;
        this.timeout = setTimeout(() => {
          this.selectedOrderStatus = this.orders.selectedOrder.status;
        }, 100);
        if (this.order_Permissions.generate_pre_shipping_documents)
          this.getOrderDocuments();

        if (!updateProduct)
          this.updatedGetViewDetails("shipment_product_details");
      } else {
        this.orders.productsData.data = selectedOrderDetails.row_data;
        this.originalOrdersProductData = selectedOrderDetails.row_data.map(
          (data: any) => ({ ...data })
        );
      }
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
  }
  // cancelShip() {
  //   this.shippingActiveState = false;
  //   this.shippingForm.markAsPristine();
  //   this.shippingContainer.markAsPristine();
  //   while (this.shippingContainerArray.length !== 0) {
  //     this.shippingContainerArray.removeAt(0);
  //   }
  //   this.getShippingAddressDetails();
  //   this.editShipping = true;
  // }

  cancelConcern() {
    this.concernEditable = false;
  }

  changeAddress(): void {
    this.closeEdit();
    let dialogRef = this.dialog.open(ChangeShipperAddressComponent, {
      width: "550px",
      data: { module_id: this.orders.selectedOrder.id, type: "shipment" },
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
        this.orderPermissions(true);
      }
      let showTax = this.orders.companyShpAddrDt.ksm_postal_code;
      if (showTax == "500001") {
        this.taxInvoiceDocument = true;
      } else {
        this.taxInvoiceDocument = false;
      }
    });
  }

  public now: Date = new Date();
  public threeMonthsAgo: Date = new Date(this.now);

  public transistTime;

  public order_Permissions: any = {};

  constructor(
    private http: HttpClient,
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
    public adminService: AdminService,
    private service: LeadsService,
    private utilsService: UtilsService,
    private sanitizer: DomSanitizer
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
  public getInputValidationTypes = [];

  async ngOnInit() {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
    this.activatedRoute.params.subscribe(
      (param) => (this.data.id = param.shipmentId)
    );
    this.source = history.state?.source || null;
    if (this.source === "payments") {
      setTimeout(() => {
        this.moveToPostCommercialInvoice();
      }, 3000);
    }
    this.getValidationTypes();
    this.threeMonthsAgo.setMonth(this.now.getMonth() - 3);

    this.icttForm = new FormGroup({
      icttItem: new FormArray([]),
    });

    this.currentDate = new Date();

    this.titleService.setTitle(App["company_data"].shipmentsTitle);
    this.orderFormCompanyDetails = App["company_data"];
    await this.orderPermissions(false);
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

    // this.generateShippingAddressForm();
    // this.generateFrieghtandlogistics();
    // this.generateOthercost();
    // this.generateExportregister();
    // this.generateOtherOrderDetails();
    // this.generateSupplierDescription();
    // this.setUserCategoryValidators();
    this.userDetailsType();
    // this.getOrganizations();
    // this.getProductTypesData();
    // this.getShipments();
    // this.getTaxType();

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
    this.getUnassignedPackages();
    // setTimeout(() => {
    // this.getUomData();
    // this.getExportregister();
    // if (
    //   this.orders.selectedOrder.status_slug == "docs_completed" ||
    //   this.orders.selectedOrder.status_slug == "delivered" ||
    //   this.orders.selectedOrder.status_slug == "in_transit" ||
    //   this.orders.selectedOrder.status_slug == "processed"
    // ) {
    // this.getOtherCosts();
    // }
    // }, 1000);
    let permission: boolean;
    App.user_roles_permissions.map(function (val) {
      if (val.code == "inventory") {
        permission = val.selected;
      }
    });
    this.isMerchantExporter = App.isMerchantExporter;
  }
  async getValidationTypes() {
    await this.service.getValidationTypes().then((res) => {
      if (res.result && res.result.success) {
        this.getInputValidationTypes = res.result.data;
      }
    });
  }

  orderPermissions(notOnInit?: boolean) {
    this.OrdersService.getOrderPermissions({
      id: this.data.id,
      type: "shipment",
    })
      .then((response) => {
        if (response.result.success) {
          this.order_Permissions = response.result.data;
          if (notOnInit === true)
            this.updatedGetViewDetails("shipment_details", true);
          else if (notOnInit === false)
            this.getViewDetails(this.data.id, "shipment_details");
          this.getOrdersActivityDetails();
        }
      })
      .catch((error) => console.log(error));
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
      status_id: 5,
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.status_slug = "cancelled";
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
  deliverOrder(deliveryInfo?: boolean): void {
    this.editClosePOPup = true;

    let dialogRef = this.dialog.open(DeliverOrderComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      height: "300px",
      data: {
        id: this.orders.selectedOrder.id,
        flag: deliveryInfo ? deliveryInfo : false,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.selectedOrderStatus = result.name;
        this.orders.selectedOrder.status_color_code = result.color_code;
        this.orders.selectedOrder.status_slug = result.slug;
        this.orders.selectedOrder.status = result.name;
        // this.updatedGetViewDetails("shipment_details", true);
        this.orderPermissions(true);
        // this.getOrdersActivityDetails();
        this.disablePayment = true;
        this.orders.selectedOrder.status_slug = "delivered";
      }
      this.editClosePOPup = false;
    });
  }
  sendMails(data?: any): void {
    this.editClosePOPup = true;

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
  }
  public packageData = [];
  public containers = [];
  public defaultContainer = [];
  public defaultPackage = [];

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
  // submmitExportRegister(form, event) {
  //   let toast: object;
  //   let params = form.value;
  //   if (params.leo_date)
  //     params.leo_date = moment(params?.leo_date).format("YYYY-MM-DD");
  //   params.orders_id = this.orders.selectedOrder.id;
  //   if (form.valid) {
  //     this.OrdersService.saveExportRegister(params).then((response) => {
  //       if (response.result.success) {
  //         this.exportRegisterForm.markAsPristine();
  //         toast = { msg: response.result.message, status: "success" };
  //         this.snackbar.showSnackBar(toast);
  //         this.getExportregister();
  //       }
  //     });
  //   }
  // }
  // getExportregister() {
  //   this.OrdersService.getexportRegister({
  //     orders_id: this.orders.selectedOrder.id,
  //   }).then((response) => {
  //     if (response.result.success) {
  //       this.exportRegisterForm.markAsPristine();
  //       this.setExportRegisterForm(response.result.data);
  //     }
  //   });
  // }
  // setExportRegisterForm(data) {
  //   this.exportRegisterForm.patchValue({
  //     draw_back_amount: data?.draw_back_amount,
  //     epcg_authorization_nbr: data?.epcg_authorization_nbr,
  //     exchange_rate_shippingbill: data?.exchange_rate_shippingbill,
  //     fob_fcc: data?.fob_fcc,
  //     fob_inr: data?.fob_inr,
  //     plant: data?.plant,
  //     port_code: data?.port_code,
  //     rodtep_amount_sanctioned: data?.rodtep_amount_sanctioned,
  //     leo_date:
  //       data?.leo_date != undefined
  //         ? moment(data?.leo_date).format("YYYY-MM-DD")
  //         : "",
  //   });
  // }
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
    params.orders_id = this.orders.selectedOrder.id;
    let status = 6;
    if (form.valid && this.otherContainerFormValid()) {
      this.OrdersService.saveOtherCosts(params).then((response) => {
        if (response.result.success) {
          if (this.orders.selectedOrder.status_slug == "docs_completed") {
            this.OrdersService.acceptOrder({
              id: this.orders.selectedOrder.id,
              status_id: status,
              is_order_ready: true,
              confirm_sales: true,
            }).then((response) => {
              if (response.result.success) {
                this.freightContainerForm.markAsPristine();
                this.orders.selectedOrder.status_slug = "processed";
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

  // generateSupplierDescription() {
  //   this.suppllierDocumentss = this.formBuilder.group({
  //     description: [null],
  //   });
  // }
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
  // generateFrieghtandlogistics(): void {
  //   this.freightandlogistics = this.formBuilder.group({
  //     transport_mode: [null, Validators.required],
  //     carrier: [null],
  //     location_stuffing: [null, Validators.required],
  //     precarriage_by: [null, this.is_automech ? [Validators.required] : null],
  //     place_of_reciept_pre_carrier: [
  //       null,
  //       this.is_automech ? [Validators.required] : null,
  //     ],
  //     epcg_lic: [
  //       null,
  //       this.is_automech
  //         ? [
  //             Validators.required,
  //             Validators.pattern(
  //               /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //             ),
  //           ]
  //         : null,
  //     ],
  //     drawback_no: [
  //       null,
  //       this.is_automech
  //         ? [
  //             Validators.required,
  //             Validators.pattern(
  //               /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //             ),
  //           ]
  //         : null,
  //     ],
  //     carrier_booking_rfno: [
  //       null,
  //       [
  //         Validators.pattern(
  //           /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //         ),
  //       ],
  //     ],
  //     port_of_loading: [
  //       null,
  //       [Validators.required, CustomValidation.noZeroValidator],
  //     ],
  //     port_of_discharge: [
  //       null,
  //       [Validators.required, CustomValidation.noZeroValidator],
  //     ],
  //     total_freight_cost: [null, [Validators.pattern(/^[0-9.]+$/)]],
  //     transport_vehicle_number: [
  //       null,
  //       this.is_automech
  //         ? [
  //             Validators.required,
  //             Validators.pattern(
  //               /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //             ),
  //           ]
  //         : null,
  //     ],
  //     final_destination: [
  //       null,
  //       [Validators.required, CustomValidation.noZeroValidator],
  //     ],
  //     sailing_date: [null],
  //     freight_cost_currency: [null],
  //     transporter_name: [
  //       null,

  //       this.is_aapl
  //         ? [
  //             Validators.pattern(
  //               /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //             ),
  //           ]
  //         : null,
  //     ],
  //     number_of_trucks: [
  //       null,
  //       !this.is_automech ? [Validators.pattern(/^[0-9]+$/)] : null,
  //     ],
  //     freight_forwarder: [
  //       null,
  //       this.is_aapl
  //         ? [
  //             Validators.pattern(
  //               /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //             ),
  //           ]
  //         : null,
  //     ],
  //     number_of_containers: [null, [CustomValidation.notZeroValidator]],
  //     tax_other_information: [null],
  //     self_seal_number: [
  //       null,
  //       [
  //         Validators.pattern(
  //           /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //         ),
  //       ],
  //     ],
  //   });
  // }
  // generateOthercost(): void {
  //   this.otherCosts = this.formBuilder.group({
  //     carrier_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     cha_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     cfs_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     insurance_cost: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     coo_charge: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     coo_refrence: [null],
  //     palletization_cost: [
  //       null,
  //       [CustomValidation.numericAndSpecialCharValidator],
  //     ],
  //     palletization_refrence: [null],
  //     vochar_cost: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     vochar_refrence: [null],
  //     carrier_refrence: [null],
  //     cha_refrence: [null],
  //     cfs_refrence: [null],
  //     insurance_refrence: [null],
  //   });
  // }

  // generateExportregister(): void {
  //   this.exportRegisterForm = this.formBuilder.group({
  //     leo_date: [null],
  //     fob_inr: [null, [CustomValidation.numericAndSpecialCharValidator]],
  //     fob_fcc: [
  //       null,
  //       [
  //         Validators.pattern(
  //           /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //         ),
  //       ],
  //     ],
  //     exchange_rate_shippingbill: [
  //       null,
  //       [CustomValidation.numericAndSpecialCharValidator],
  //     ],
  //     epcg_authorization_nbr: [
  //       null,
  //       Validators.pattern(
  //         /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //       ),
  //     ],
  //     port_code: [
  //       null,
  //       Validators.pattern(
  //         /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //       ),
  //     ],
  //     draw_back_amount: [
  //       null,
  //       [CustomValidation.numericAndSpecialCharValidator],
  //     ],
  //     rodtep_amount_sanctioned: [
  //       null,
  //       [CustomValidation.numericAndSpecialCharValidator],
  //     ],
  //     plant: [
  //       null,
  //       [
  //         Validators.pattern(
  //           /^[a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~/\\|][a-zA-Z0-9!@#$%^&*()_+=\-[\]{};:'"`,.<>?~ /\\|]*$/
  //         ),
  //       ],
  //     ],
  //   });
  // }

  // generateOtherOrderDetails(): void {
  //   this.otherOrderDetailsForm = this.formBuilder.group({
  //     standard_declaration: [null],
  //     standard_declaration_tax: [null],

  //     tax_type: [null, [Validators.required]],
  //     is_under_scomet: [null, this.is_aapl ? Validators.required : null],
  //     is_pharma: [null, this.is_aapl ? Validators.required : null],
  //     is_haz: [null],
  //     supplier_name: [null],
  //     supplier_invoice_no: [null],
  //     aapl_po_no: [null],
  //   });
  // }

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

  moveToStuffing() {
    this.activateScroll = false;
    this.activeTab = "stuffing";
    if (this.stuffing && this.stuffing["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.stuffing["nativeElement"].offsetTop - 74;
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
    } else if (flag == "shipping_docs") {
      this.imagUploadFlag = "shipping_docs";
    } else {
      this.imagUploadFlag = "Bill";
    }
    this.shipmentType = flag;
    this.uploader.setOptions({
      url:
        App.base_url +
        "addFiles?form_data_id=" +
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

  public saveSubmmitFreight;

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

  getContainerTypes(containers: any[]): string {
    // Use optional chaining (?) to handle potential null or undefined values
    return containers
      ?.map((container) => container?.container_number)
      .join(", ");
  }
  public showEditIcon = true;
  public shipContainer;

  public shipingDate;
  public disableSaveShipping;

  public disableFreecharge = true;

  public clickedProformaInvoice = false;

  public proformaInvData = [];
  public enableProforma = false;
  public inv_placement;

  public bankDetails;

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
    } else if (flag == "shipping_docs") {
      this.getFileFlag = "shipping_docs";
    } else {
      this.getFileFlag = "bill";
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
        } else if (flag == "shipping_docs") {
          this.airwayAttachments = response.result.data.OrdersAtt;
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
    this.OrdersService.getEstimateActivtyDetails({
      id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        this.orders.activityDetails = response.result.data;
      } else {
        this.orders.activityDetails = [];
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

  deleteLineItemAccess(index: any) {
    this.orders.invoice[0].Inovice.add_line_items.splice(index, 1);
    let param = Object.assign({}, this.orders.invoice[0].Inovice);
    this.OrdersService.generateInvoice(param).then((response) => {
      this.orders.invoice = response.result.data.Invioce;
    });
  }
  moveToElement(elementRef: any, tabName: string, offset: number = 74) {
    this.removeDocHighlight = true;
    // Deactivate scroll temporarily
    this.activateScroll = false;

    // Change the active tab, if provided
    this.activeTab = tabName;
    // Check if elementRef is defined and has an offsetTop
    console.log(elementRef);

    if (elementRef && elementRef["nativeElement"]?.offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        elementRef["nativeElement"].offsetTop - offset;
    }

    // Re-activate the scroll after a short delay

    // setTimeout(() => {
    //   this.activeTab = tabName;

    // }, 2000);

    setTimeout(() => {
      this.activateScroll = true;
    }, 2000);
  }

  toggleItems() {
    this.showItems = !this.showItems;
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
  toggleShippingDocs() {
    this.shippingDocs = !this.shippingDocs;
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
        toast = { msg: "Line Item Deleted Successfully", status: "success" };
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

  cancelAllOrder(): void {
    this.editClosePOPup = true;
    // this.closeEditTax();
    // this.closeEdit();
    let dialogRef = this.dialog.open(CancelOrderComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        id: this.orders.selectedOrder.id,
        module: "Shipment",
        type: "shipment_cancelled",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.orders.selectedOrder.status_slug = "cancelled";

        this.orders.selectedOrder.status_color_code = result.color_code;
        this.orders.selectedOrder.status_id = "5";
        this.selectedOrderStatus = "Cancelled";
        this.orders.selectedOrder.status == "Cancelled";
        // this.getOrdersActivityDetails();
        this.orderPermissions(true);
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
      let itemsTop =
        this.items &&
        this.items["nativeElement"] &&
        this.items["nativeElement"].offsetTop
          ? this.items["nativeElement"].offsetTop
          : 0;

      let paymentTop =
        this.payment &&
        this.payment["nativeElement"] &&
        this.payment["nativeElement"].offsetTop
          ? this.payment["nativeElement"].offsetTop
          : 0;
      let specsTop =
        this.specs &&
        this.specs["nativeElement"] &&
        this.specs["nativeElement"].offsetTop
          ? this.specs["nativeElement"].offsetTop
          : 0;
      let packagingTop =
        this.packaging &&
        this.packaging["nativeElement"] &&
        this.packaging["nativeElement"].offsetTop
          ? this.packaging["nativeElement"].offsetTop
          : 0;
      let shipmentContainersTop =
        this.shipmentContainers &&
        this.shipmentContainers["nativeElement"] &&
        this.shipmentContainers["nativeElement"].offsetTop
          ? this.shipmentContainers["nativeElement"].offsetTop
          : 0;
      let FreightTop =
        this.freight &&
        this.freight["nativeElement"] &&
        this.freight["nativeElement"].offsetTop
          ? this.freight["nativeElement"].offsetTop
          : 0;
      let customsInvoiceTop =
        this.customsInvoice &&
        this.customsInvoice["nativeElement"] &&
        this.customsInvoice["nativeElement"].offsetTop
          ? this.customsInvoice["nativeElement"].offsetTop
          : 0;
      let generatePreDocsTop =
        this.generatePreDocs &&
        this.generatePreDocs["nativeElement"] &&
        this.generatePreDocs["nativeElement"].offsetTop
          ? this.generatePreDocs["nativeElement"].offsetTop
          : 0;
      let shippingBillTop =
        this.shippingBill &&
        this.shippingBill["nativeElement"] &&
        this.shippingBill["nativeElement"].offsetTop
          ? this.shippingBill["nativeElement"].offsetTop
          : 0;
      let shippingTop =
        this.shipping &&
        this.shipping["nativeElement"] &&
        this.shipping["nativeElement"].offsetTop
          ? this.shipping["nativeElement"].offsetTop
          : 0;
      let generatePostDocTop =
        this.generatePostDocs &&
        this.generatePostDocs["nativeElement"] &&
        this.generatePostDocs["nativeElement"].offsetTop
          ? this.generatePostDocs["nativeElement"].offsetTop
          : 0;
      let postCommercialInvoiceTop =
        this.postCommercialInvoice &&
        this.postCommercialInvoice["nativeElement"] &&
        this.postCommercialInvoice["nativeElement"].offsetTop
          ? this.postCommercialInvoice["nativeElement"].offsetTop
          : 0;
      let paymentDetailsTop =
        this.paymentDetails &&
        this.paymentDetails["nativeElement"] &&
        this.paymentDetails["nativeElement"].offsetTop
          ? this.paymentDetails["nativeElement"].offsetTop
          : 0;

      let dutyDrawbackTop =
        this.dutyDrawback &&
        this.dutyDrawback["nativeElement"] &&
        this.dutyDrawback["nativeElement"].offsetTop
          ? this.dutyDrawback["nativeElement"].offsetTop
          : 0;
      let rodTepTop =
        this.rodTep &&
        this.rodTep["nativeElement"] &&
        this.rodTep["nativeElement"].offsetTop
          ? this.rodTep["nativeElement"].offsetTop
          : 0;

      let prePostDocumentsTop =
        this.prePostDocument &&
        this.prePostDocument["nativeElement"] &&
        this.prePostDocument["nativeElement"].offsetTop
          ? this.prePostDocument["nativeElement"].offsetTop
          : 0;

      let otherDocumentsTop =
        this.otherDocument &&
        this.otherDocument["nativeElement"] &&
        this.otherDocument["nativeElement"].offsetTop
          ? this.otherDocument["nativeElement"].offsetTop
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
      } else if (
        detailsTop < scrollTop &&
        (scrollTop < itemsTop || itemsTop == 0)
      ) {
        this.activeTab = "items";
      } else if (
        itemsTop < scrollTop &&
        (scrollTop < paymentTop || paymentTop == 0)
      ) {
        this.activeTab = "payments";
      } else if (
        paymentTop < scrollTop &&
        (scrollTop < specsTop || specsTop == 0)
      ) {
        this.activeTab = "specs";
      } else if (
        specsTop < scrollTop &&
        (scrollTop < packagingTop || packagingTop == 0)
      ) {
        this.panelOpenState = true;
        this.activeTab = "Packaging";
      }
      // else if (
      //   packagingTop < scrollTop &&
      //   (scrollTop < shipmentContainersTop || shipmentContainersTop == 0)
      // ) {
      //   this.panelOpenState = true;
      //   this.activeTab = "Containers";
      // }
      else if (
        packagingTop < scrollTop &&
        (scrollTop < FreightTop || FreightTop == 0)
      ) {
        this.activeTab = "freight";
      } else if (
        FreightTop < scrollTop &&
        (scrollTop < customsInvoiceTop || customsInvoiceTop == 0)
      ) {
        this.activeTab = "customsInvoice";
      } else if (
        customsInvoiceTop < scrollTop &&
        scrollTop < generatePreDocsTop
      ) {
        this.activeTab = "generatePreDocs";
      } else if (
        generatePreDocsTop < scrollTop &&
        (scrollTop < shippingBillTop || shippingBillTop == 0)
      ) {
        this.activeTab = "shippingBill";
      } else if (
        shippingBillTop < scrollTop &&
        (scrollTop < shippingTop || shippingTop == 0)
      ) {
        this.activeTab = "shipping";
      } else if (
        // this.generatePostDocs != undefined &&
        shippingTop < scrollTop &&
        scrollTop < generatePostDocTop
        //   ||
        // generatePostDocTop == 0
      ) {
        this.activeTab = "generatePostDoc";
      } else if (
        generatePostDocTop < scrollTop &&
        scrollTop < postCommercialInvoiceTop
        // || postCommercialInvoiceTop == 0
      ) {
        this.activeTab = "postCommercialInvoice";
      } else if (
        postCommercialInvoiceTop < scrollTop &&
        scrollTop < paymentDetailsTop
        // || paymentDetailsTop == 0
      ) {
        this.activeTab = "paymentDetails";
      } else if (paymentDetailsTop < scrollTop && scrollTop < dutyDrawbackTop) {
        this.activeTab = "dutyDrawback";
      } else if (dutyDrawbackTop < scrollTop && scrollTop < rodTepTop) {
        this.activeTab = "rodTep";
      }

      //  else if (
      //   paymentDetailsTop < scrollTop &&
      //   (scrollTop < prePostDocumentsTop || prePostDocumentsTop == 0)
      // ) {
      //   this.activeTab = "prePostDocument";
      // } else if (
      //   prePostDocumentsTop < scrollTop &&
      //   (scrollTop < otherDocumentsTop || otherDocumentsTop == 0)
      // ) {
      //   this.activeTab = "otherDocuments";
      // }
      else {
        this.dymanicdocumentdata.forEach((item, index) => {
          const element = document.getElementById("invoice-" + item.id);

          const prvElement =
            index != 0
              ? document.getElementById(
                  "invoice-" + this.dymanicdocumentdata[index - 1]?.id
                )
              : null;

          if (!element) return;

          const elementTop = element.offsetTop || 0;
          const prvElementTop = prvElement ? prvElement.offsetTop || 0 : null;
          if (index == 0) {
            if (
              paymentDetailsTop < scrollTop &&
              (scrollTop < elementTop || elementTop == 0)
            ) {
              this.activeTab = item.id;
            }
          } else if (
            index &&
            prvElementTop < scrollTop &&
            (scrollTop < elementTop || elementTop == 0)
          ) {
            this.activeTab = item.id;
          }
        });
      }

      // if (scrollTop <= activityTop) {
      //   this.activeTab = "activity";
      // } else if (
      //   activityTop < scrollTop &&
      //   (scrollTop < detailsTop || detailsTop == 0)
      // ) {
      //   this.activeTab = "details";
      // } else if (detailsTop + 1000 < scrollTop && scrollTop < packagingTop) {
      //   this.activeTab = "packaging";
      // } else if (coaTop < scrollTop && scrollTop < packagingTop) {
      //   this.activeTab = "coa";
      // } else if (packagingTop < scrollTop && scrollTop < FreightTop) {
      //   this.activeTab = "freight";
      // } else if (FreightTop + 50 < scrollTop && scrollTop < OtherOrderTop) {
      //   this.activeTab = "otherOrder";
      // } else if (OtherOrderTop < scrollTop && scrollTop < shippingTop) {
      //   this.activeTab = "shipping";
      // } else if (shippingTop < scrollTop && scrollTop < othercostsTop) {
      //   this.activeTab = "othercosts";
      // } else if (othercostsTop < scrollTop && scrollTop < exportregisterTop) {
      //   this.activeTab = "exportregister";
      // } else if (
      //   exportregisterTop < scrollTop &&
      //   (scrollTop < invoiceTop || invoiceTop == 0)
      // ) {
      //   this.activeTab = "invoice";
      // } else if (shippingTop < scrollTop && scrollTop < adcdecltop) {
      //   this.activeTab = "AdcsheetAdcDocs";
      // } else if (shippingTop < scrollTop && scrollTop < NonscometDecltop) {
      //   this.activeTab = "AdcDecl";
      // } else if (shippingTop < scrollTop && scrollTop < NdpsDeclratiotop) {
      //   this.activeTab = "Nonscometdecl";
      // } else if (shippingTop < scrollTop && scrollTop < nonDgrTop) {
      //   this.activeTab = "NdpsDeclration";
      // } else if (shippingTop + 1000 < scrollTop && scrollTop < dgrTop) {
      //   this.activeTab = "nondgr";
      // } else if (shippingTop < scrollTop && scrollTop < msdsFormTop) {
      //   this.activeTab = "Dgrdecl";
      // } else if (shippingTop < scrollTop && scrollTop < icttTop) {
      //   this.activeTab = "msdsForm";
      // } else if (msdsFormTop < scrollTop && scrollTop < nonHazardousTop) {
      //   this.activeTab = "icttTop";
      // } else if (shippingTop + 1000 < scrollTop && scrollTop < FormsdfTop) {
      //   this.activeTab = "nonHazardous";
      // } else if (shippingTop < scrollTop && scrollTop < ExportvalueTop) {
      //   this.activeTab = "Formsdf";
      // } else if (shippingTop < scrollTop && scrollTop < DeclarationTop) {
      //   this.activeTab = "Exportvalue";
      // } else if (shippingTop < scrollTop && scrollTop < ShippersletterTop) {
      //   this.activeTab = "Declaration";
      // } else if (shippingTop < scrollTop && scrollTop < AdcsheetTop) {
      //   this.activeTab = "Shippersletter";
      // } else if (
      //   shippingTop < scrollTop &&
      //   scrollTop < IncentivedeclarationTop
      // ) {
      //   this.activeTab = "Adcsheet";
      // } else if (shippingTop < scrollTop && scrollTop < ScomatdeclarationTop) {
      //   this.activeTab = "Incentivedeclaration";
      // } else if (shippingTop < scrollTop && scrollTop < FEMADeclrationTop) {
      //   this.activeTab = "Scomatdeclaration";
      // } else if (shippingTop < scrollTop && scrollTop < VGMTop) {
      //   this.activeTab = "FEMADeclration";
      // } else if (shippingTop < scrollTop && scrollTop < SIDraftTop) {
      //   this.activeTab = "VGM";
      // } else if (shippingTop < scrollTop && scrollTop < ConcernTop) {
      //   this.activeTab = "SIDraft";
      // } else if (ConcernTop < scrollTop) {
      //   this.activeTab = "Concern";
      // }
    }
  }

  // scrollOrdersContainer(event?: any) {
  //   if (this.activateScroll) {
  //     const scrollTop = this.scrollContainer["nativeElement"].scrollTop || 0;
  //     const activityTop = this.activity["nativeElement"].offsetTop || 0;
  //     const detailsTop = this.details["nativeElement"].offsetTop || 0;
  //     const itemsTop = this.items["nativeElement"].offsetTop || 0;
  //     const paymentTop = this.payment["nativeElement"].offsetTop || 0;
  //     const specsTop = this.specs["nativeElement"].offsetTop || 0;
  //     const packagingTop = this.packaging["nativeElement"].offsetTop || 0;
  //     const FreightTop = this.freight["nativeElement"].offsetTop || 0;
  //     const customsInvoiceTop =
  //       this.customsInvoice["nativeElement"].offsetTop || 0;
  //     const generatePreDocsTop =
  //       this.generatePreDocs["nativeElement"].offsetTop || 0;
  //     const shippingBillTop = this.shippingBill["nativeElement"].offsetTop || 0;
  //     const shippingTop = this.shipping["nativeElement"].offsetTop || 0;
  //     const generatePostDocTop =
  //       this.generatePostDocs["nativeElement"].offsetTop || 0;
  //     const postCommercialInvoiceTop =
  //       this.postCommercialInvoice["nativeElement"].offsetTop || 0;
  //     const paymentDetailsTop =
  //       this.paymentDetails["nativeElement"].offsetTop || 0;

  //     if (scrollTop <= activityTop) {
  //       this.activeTab = "activity";
  //     } else if (scrollTop <= detailsTop) {
  //       this.activeTab = "details";
  //     } else if (scrollTop <= itemsTop) {
  //       this.activeTab = "items";
  //     } else if (scrollTop <= paymentTop) {
  //       this.activeTab = "payments";
  //     } else if (scrollTop <= specsTop) {
  //       this.activeTab = "specs";
  //     } else if (scrollTop <= packagingTop) {
  //       this.panelOpenState = true;
  //       this.activeTab = "Packaging";
  //     } else if (scrollTop <= FreightTop) {
  //       this.activeTab = "freight";
  //     } else if (scrollTop <= customsInvoiceTop) {
  //       this.activeTab = "customsInvoice";
  //     } else if (scrollTop <= generatePreDocsTop) {
  //       this.activeTab = "generatePreDocs";
  //     } else if (scrollTop <= shippingBillTop) {
  //       this.activeTab = "shippingBill";
  //     } else if (scrollTop <= shippingTop) {
  //       this.activeTab = "shipping";
  //     } else if (scrollTop <= generatePostDocTop) {
  //       this.activeTab = "generatePostDoc";
  //     } else if (scrollTop <= postCommercialInvoiceTop) {
  //       this.activeTab = "postCommercialInvoice";
  //     } else if (scrollTop <= paymentDetailsTop) {
  //       this.activeTab = "paymentDetails";
  //     } else {
  //       this.dymanicdocumentdata.forEach((item, index) => {
  //         const element = document.getElementById("invoice-" + item.id);
  //         const prvElement =
  //           index > 0
  //             ? document.getElementById(
  //                 "invoice-" + this.dymanicdocumentdata[index - 1]?.id
  //               )
  //             : null;

  //         if (!element) return;

  //         const elementTop = element.offsetTop || 0;
  //         const prvElementTop = prvElement?.offsetTop || 0;

  //         if (index === 0 && scrollTop <= elementTop) {
  //           this.activeTab = item.type;
  //         } else if (prvElementTop < scrollTop && scrollTop < elementTop) {
  //           this.activeTab = item.type;
  //         }
  //       });
  //     }
  //   }
  // }

  // scrollOrdersContainer(event?: any): void {
  //   if (!this.activateScroll) return;

  //   const scrollTop = this.scrollContainer["nativeElement"].scrollTop || 0;

  //   // Define elements and corresponding tab names
  //   const elements = [
  //     { element: this.activity, tab: "activity" },
  //     { element: this.details, tab: "details" },
  //     { element: this.items, tab: "items" },
  //     { element: this.payment, tab: "payments" },
  //     { element: this.specs, tab: "specs" },
  //     { element: this.packaging, tab: "Packaging", panelOpenState: true },
  //     { element: this.freight, tab: "freight" },
  //     { element: this.customsInvoice, tab: "customsInvoice" },
  //     { element: this.generatePreDocs, tab: "generatePreDocs" },
  //     { element: this.shippingBill, tab: "shippingBill" },
  //     { element: this.shipping, tab: "shipping" },
  //     { element: this.generatePostDocs, tab: "generatePostDoc" },
  //     { element: this.postCommercialInvoice, tab: "postCommercialInvoice" },
  //     { element: this.paymentDetails, tab: "paymentDetails" },
  //   ];
  //   console.log(this.dymanicdocumentdata);
  //   // Check static elements first
  //   for (let i = 0; i < elements.length; i++) {
  //     const currentElementTop =
  //       elements[i].element["nativeElement"].offsetTop || 0;
  //     const nextElementTop =
  //       elements[i + 1]?.element["nativeElement"].offsetTop || Infinity;

  //     if (scrollTop < nextElementTop) {
  //       this.activeTab = elements[i].tab;
  //       if (elements[i].panelOpenState) this.panelOpenState = true;
  //     }
  //   }
  //   // return;

  //   // Check dynamic document data
  //   for (let i = 0; i < this.dymanicdocumentdata.length; i++) {
  //     const currentElement = document.getElementById(
  //       "invoice-" + this.dymanicdocumentdata[i]?.id
  //     );
  //     const nextElement =
  //       i > 0
  //         ? document.getElementById(
  //             "invoice-" + this.dymanicdocumentdata[i - 1]?.id
  //           )
  //         : null;

  //     console.log(currentElement);

  //     if (!currentElement) continue;

  //     const currentElementTop = currentElement.offsetTop || 0;
  //     const nextElementTop = nextElement?.offsetTop || Infinity;
  //     if (i === 0 && scrollTop < currentElementTop) {
  //       console.log("object1");
  //       this.activeTab = this.dymanicdocumentdata[i]?.type;
  //     } else if (nextElementTop < scrollTop && scrollTop < currentElementTop) {
  //       console.log("object2");
  //       this.activeTab = this.dymanicdocumentdata[i]?.type;
  //     }
  //     // if (scrollTop >= currentElementTop && scrollTop < nextElementTop) {
  //     //   this.activeTab = this.dymanicdocumentdata[i].type;
  //     //   return;
  //     // }
  //   }
  // }

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
    this.removeDocHighlight = true;
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

  moveToDetails() {
    this.removeDocHighlight = true;
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
  moveToItems() {
    this.removeDocHighlight = true;
    this.activateScroll = false;
    this.activeTab = "items";
    if (this.items && this.items["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.items["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToPackaging() {
    this.activateScroll = false;
    this.ActivityLog = false;
    this.activeTab = "packaging";

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
  moveToCustomsInvoice() {
    this.activateScroll = false;
    this.activeTab = "customsInvoice";
    if (this.customsInvoice && this.customsInvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.customsInvoice["nativeElement"].offsetTop - 74;
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
  moveToShippingDocs() {
    this.activateScroll = false;
    this.activeTab = "shipping_docs";
    if (this.shipping_docs && this.shipping_docs["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.shipping_docs["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  public errormes;
  editInLineitems(value: any, key: string, id: number) {
    this.closeEdit();

    let poNumber: any;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (value != "") {
        if (value != "") {
          // poNumber = event.target.innerText;
          this.modPoNum = poNumber;
          // let value = event.target.value || event.target.innerText;
          let params = {
            id: id,
            key: key,
            value: value,
          };
          this.OrdersService.editInLine(params)
            .then((res: any) => {
              if (res.result.success) {
                let toast: object;
                toast = {
                  msg: res.result.message,
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.updatedGetViewDetails("shipment_details", true);
              }
            })
            .catch((error) => console.log(error));
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
  savePoDate(event) {
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
        insurance: this.orders.selectedOrder?.totals.insurance.value
          ? this.orders.selectedOrder?.totals.insurance.value.replace(/,/g, "")
          : "",
        freight: this.orders.selectedOrder?.totals.freight.value
          ? this.orders.selectedOrder?.totals.freight.value.replace(/,/g, "")
          : "",
        discount: this.orders.selectedOrder?.totals.discount.value
          ? this.orders.selectedOrder?.totals.discount.value.replace(/,/g, "")
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
      add_line_items: this.orders.selectedOrder.add_line_items
        ? this.orders.selectedOrder.add_line_items
        : "",
      insurance: this.orders.selectedOrder?.totals.insurance.value
        ? this.orders.selectedOrder?.totals.insurance.value.replace(/,/g, "")
        : "",
      freight: this.orders.selectedOrder?.totals.freight.value
        ? this.orders.selectedOrder?.totals.freight.value.replace(/,/g, "")
        : "",
      discount: this.orders.selectedOrder?.totals.discount.value
        ? this.orders.selectedOrder?.totals.discount.value.replace(/,/g, "")
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
      status_id: 2,
    }).then((response) => {
      this.orders.selectedOrder.status_id = "2";
      this.orders.selectedOrder.status_slug = "accepted";

      this.selectedOrderStatus = "Accepted";
      this.orders.selectedOrder.status_color_code = "#0000FF";
      if (this.isSampleDocs || this.is_automech) {
        // this.disableFreecharge = false;
        // this.getInvoiceData();
        // this.generateInvoice("false");
      }
      // this.getOrdersActivityDetails();
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
  // cancelPackageDescription() {
  //   this.getPackagingDetails();
  //   this.showPackageSavePanel = false;
  //   this.editDescription = false;
  // }
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
        "addFiles?form_data_id=" +
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
      }
    });
  }
  skippackage() {
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: "ready_for_dispatch",
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.is_order_ready = true;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.selectedOrderStatus = "Ready for Dispatch";
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orderPermissions(true);
      } else {
        this.clickedPackageDetails = false;
      }
    });
  }

  statusAfterShipping() {
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: "shipped_on_board",
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.is_order_ready = true;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.selectedOrderStatus = "SHIPPED ON BOARD";
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orderPermissions(true);
      } else {
        this.clickedPackageDetails = false;
      }
    });
  }
  setOrderReady(event: any): void {
    // event.target.disabled = true;
    let status = 10;
    this.clickedPackageDetails = true;
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: "order_ready",
    }).then((response) => {
      if (response.result.success) {
        this.orders.selectedOrder.is_order_ready = true;
        this.orders.selectedOrder.status_id = response.result.data.id;
        this.selectedOrderStatus = "Order Ready";
        this.orders.selectedOrder.status_color_code =
          response.result.data.color_code;
        this.orderPermissions(true);
      } else {
        this.clickedPackageDetails = false;
      }
    });
  }

  updateStatus(type) {
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: type,
    }).then((response) => {
      if (response.result.success) {
        this.orderPermissions(true);
      }
    });
  }
  disableGeneratePreShip = false;
  generateCustomDocs(event: any): void {
    event.target.disabled = true;
    this.disableGeneratePreShip = true;
    let status = this.is_automech ? 14 : 12;
    // generateCustomsInvoice
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: "customs_passing",
      // id: this.orders.selectedOrder.id,
      // status_id: status,
      // is_order_ready: true,
      // confirm_sales: true,
    }).then((response) => {
      if (response.result.success) {
        // this.orders.selectedOrder.status_id = this.is_automech ? "14" : "12";
        this.getViewDetails(this.data.id, "customs_invoice");
        this.orderPermissions();
        this.getOrderDocuments();

        // this.orders.selectedOrder.status_slug = this.is_automech
        //   ? "docs_completed"
        //   : "customs_clearance";

        // this.selectedOrderStatus = this.is_automech
        //   ? "Docs Completed"
        //   : "Customs Clearance";
        // this.orders.selectedOrder.status_color_code = this.is_automech
        //   ? "#08D6A0"
        //   : "#fa6";
        let toast: object;
        toast = {
          msg: "Documents Generated Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.customSidePannel = false;
        this.customDocs = true;
        this.orderPermissions(true);
        if (this.is_automech) {
          this.preShipDocs = true;
          this.enableTaxInvoice = true;
          this.enableIgstInvoice = false;
          this.postShipDocs = true;
        } else {
          this.preShipDocs = true;
        }
      } else {
        this.disableGeneratePreShip = false;

        let toast: object;
        toast = {
          msg: response.result.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  generateCommercialDocs(event: any): void {
    event.target.disabled = true;
    let status = 14;
    this.disablegenrateCommercial = true;
    this.OrdersService.generateCommercialInvoice({ id: this.data.id }).then(
      (res) => {
        if (res.result.success) {
          // this.getOrdersActivityDetails();

          this.getViewDetails(this.data.id, "commercial_invoice");
          // this.orders.selectedOrder.status_slug = "docs_completed";
          // this.selectedOrderStatus = "Docs Completed";
          // this.orders.selectedOrder.status_color_code = "#08D6A0";
          // this.getSiDraft();
          this.disablegenrateCommercial = false;

          setTimeout(() => {
            this.moveToPostCommercialInvoice();
          }, 1000);
          let toast: object;
          toast = {
            msg: "Commercial Documents Generated Successfully...",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.orderPermissions();
          this.getOrderDocuments();
        } else {
          setTimeout(() => {
            this.moveToPostCommercialInvoice();
          }, 1000);
          let toast: object;
          toast = {
            msg: res.result.message,
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      }
    );
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
              insurance: this.orders.selectedOrder?.totals.insurance.value
                ? this.orders.selectedOrder?.totals.insurance.value.replace(
                    /,/g,
                    ""
                  )
                : "",
              freight: this.orders.selectedOrder?.totals.freight.value
                ? this.orders.selectedOrder?.totals.freight.value.replace(
                    /,/g,
                    ""
                  )
                : "",
              discount: this.orders.selectedOrder?.totals.discount.value
                ? this.orders.selectedOrder?.totals.discount.value.replace(
                    /,/g,
                    ""
                  )
                : "",
              add_line_items: this.orders.selectedOrder.add_line_items
                ? this.orders.selectedOrder.add_line_items
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
                this.updatedGetViewDetails("shipment_details");
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
            this.updatedGetViewDetails("shipment_details");
          }
        }
      } else {
        this.editOrdersPONo = null;
        // this.updatedGetViewDetails();
      }
    });
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
        add_line_items: this.orders.selectedOrder.add_line_items,
        insurance: this.orders.selectedOrder?.totals.insurance.value
          ? this.orders.selectedOrder?.totals.insurance.value.replace(/,/g, "")
          : "",
        freight: this.orders.selectedOrder?.totals.freight.value
          ? this.orders.selectedOrder?.totals.freight.value.replace(/,/g, "")
          : "",
        discount: this.orders.selectedOrder?.totals.discount.value
          ? this.orders.selectedOrder?.totals.discount.value.replace(/,/g, "")
          : "",
        pannel: "order-details",
        key: "add_line_items",
        module_id: this.data.id,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.orders.invoice = result.response.result.data.Invioce;
        let toast: object;
        // this.generateSubTotals("add_product_in_create", this.data.id);
        this.updatedGetViewDetails("shipment_details", true);
        this.orders.selectedOrder.add_line_items.push(result.response);
        // =
        //   result.response.result.data.add_line_items;
        // this.orders.selectedOrder.total_amount =
        //   result.response.result.data.total_amount;
        // if (
        //   this.orders.selectedOrder.status_id >= "12" ||
        //   this.orders.selectedOrder.status_slug == "delivered" ||
        //   this.orders.selectedOrder.status_id >= "6"
        // ) {
        //   this.getTaxInv();
        //   this.getIgstInv();
        // }
        toast = { msg: "Line Item Added Successfully", status: "success" };
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
    this.orders.selectedOrder.add_line_items.splice(index, 1);
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
      add_line_items: this.orders.selectedOrder.add_line_items
        ? this.orders.selectedOrder.add_line_items
        : "",
      insurance: this.orders.selectedOrder?.totals.insurance.value
        ? this.orders.selectedOrder?.totals.insurance.value.replace(/,/g, "")
        : "",
      freight: this.orders.selectedOrder?.totals.freight.value
        ? this.orders.selectedOrder?.totals.freight.value.replace(/,/g, "")
        : "",
      discount: this.orders.selectedOrder?.totals.discount.value
        ? this.orders.selectedOrder?.totals.discount.value.replace(/,/g, "")
        : "",
    });
    this.OrdersService.changePoNumbr(param).then((response) => {
      this.orders.selectedOrder.total_amount =
        response.result.data.total_amount;
      if (
        this.orders.selectedOrder.status_id >= "12" ||
        this.orders.selectedOrder.status_slug == "delivered" ||
        this.orders.selectedOrder.status_id >= "6"
      ) {
        this.getTaxInv();
        this.getIgstInv();
      }
      // this.orders.selectedOrder.add_line_items = response.result.data.add_line_items;
    });
  }
  deleteLineItemorderDetails(lineItem: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        lineItem,
        type: "add_product_in_shipment",
        module_id: this.data.id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.updatedGetViewDetails("shipment_details", true);

        // this.deleteLineItemAccessOrders(index);
        let toast: object;
        toast = { msg: "Line Item Deleted Successfully", status: "success" };
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

  subToatlId;
  public moduleName = "";
  editInsuranceFreight(event, value, flag) {
    let insurance;
    let freight;
    let discount;
    let numberRegex = /[0-9.]/g;

    this.clickedIconId = flag;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (
        this.orders.selectedOrder?.totals.insurance.value ||
        this.orders.selectedOrder?.totals.freight.value ||
        this.orders.selectedOrder?.totals.discount.value
      ) {
        if (value == 1 || value == 2 || value == 3) {
          const innerTextWithoutCommas = event.target.innerText.replace(
            /,/g,
            ""
          );
          this.moduleName = "subtotal_form";

          let insurance = this.getFormattedValue(
            this.updatedValueinsurance,
            this.orders.selectedOrder?.totals.insurance.value
          );
          let freight = this.getFormattedValue(
            this.updatedFreight,
            this.orders.selectedOrder?.totals.freight.value
          );
          let discount = this.getFormattedValue(
            this.editdescountValue,
            this.orders.selectedOrder?.totals.discount.value
          );
          // let param = {
          //   id: this.orders.selectedOrder.id,
          //   po_nbr: this.orders.selectedOrder.po_nbr,
          //   po_date: this.orders.selectedOrder.po_date || "",
          //   line_item: this.orders.selectedOrder.line_item || "",
          //   add_line_items: this.orders.selectedOrder.add_line_items,
          //   insurance: insurance ? insurance.replace(/,/g, "") : "",
          //   freight: freight ? freight.replace(/,/g, "") : "",
          //   discount: discount ? discount.replace(/,/g, "") : "",
          //   order_product_id: this.productId,
          //   key: flag,
          // };

          let param = {
            form_data: {
              ...this.prefillObject,
              insurance,
              discount,
              freight,
            },
            id: this.subToatlId,
            organization_id:
              typeof this.data.id === "string"
                ? parseInt(this.data.id)
                : this.data.id,
            module_id: this.data.id,
            moduleName: this.moduleName,
          };
          let toast: object;
          this.utilsService.saveStoreAttribute(param).then((res) => {
            if (res.success) {
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              this.orders.selectedOrder.totals.insurance.value = insurance;
              this.orders.selectedOrder.totals.discount.value = discount;
              this.orders.selectedOrder.totals.freight.value = freight;
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              this.editDescountstateState = false;
              // this.generateSubTotals("add_product_in_create", this.data.id);
              this.updatedGetViewDetails("shipment_details", true);

              // this.updatedGetViewDetails("shipment_details", true);

              toast = {
                msg: res.message ? res.message : "Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
            } else {
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              toast = {
                msg: res.message ? res.message : "Unable to Update",
                status: "error",
              };
              this.updatedGetViewDetails("shipment_details", true);
              this.snackbar.showSnackBar(toast);
            }
          });
        }
      }
    });
    // } else {
    //   return false;
    // }
  }
  public orderOtherDetails: any;

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

      this.saveconverisonEnable = false; // You may want to adjust this based on your requirements
    } else {
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

  editAdcsheet() {
    if (!this.editMode) {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }
  // cancelAdc() {
  //   this.getSiDraft();
  //   this.editMode = false;
  // }
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
    }).then((response) => {
      if (response.result.success) {
        this.editModeAdc = false;
        this.adcdeclaration = response.result.data.context;

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

  genrateAdcform() {
    this.adcForm = this.formBuilder.group({
      batch_no: [null],
      manufacture_date: [null],
      expiry_date: [null],
      product_id: [null],
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
        module: type,
        id: this.orderId,
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
    if (ev.hasOwnProperty("status_id"))
      this.orders.selectedOrder.status_id = ev.status_id;
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
      // this.getIgstInv();
    }
    if (ev.module === "shipperDetails") {
      // this.getSiDraft();
      // this.getInvoiceData();
    }
    if (ev.module === "shipperDetails") {
      this.saveShippedFlag = this.saveShippedFlag + 1;
    } else {
      this.saveFreightFlag = this.saveFreightFlag + 1;
    }
    if (ev.hasOwnProperty("selectedOrderStatus"))
      this.selectedOrderStatus = ev.selectedOrderStatus;
    if (ev.hasOwnProperty("status_id"))
      this.orders.selectedOrder.status_id = ev.status_id;
    if (ev.hasOwnProperty("showEditIcon")) this.showEditIcon = ev.showEditIcon;
    if (ev.hasOwnProperty("sendDocumentMails"))
      this.sendDocumentMails = ev.sendDocumentMails;
    if (ev.hasOwnProperty("shipping_data"))
      this.getSidraft.bol_no = ev.shipping_data.bol_id;
    if (ev.hasOwnProperty("carrier_booking_rfno")) {
      this.getSidraft.booking_no = ev.carrier_booking_rfno;
    }
    if (
      ev.module == "freightandlogistics" &&
      ev.hasOwnProperty("stuffing") &&
      ev?.stuffing == "Factory Stuffing"
    ) {
      this.showSSCON = true;
      this.showVGMD = true;
    }
  }

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
    setTimeout(() => {
      this.orders.selectedOrder = { ...this.originalOrdersData };
      this.updatedGetViewDetails("shipment_details", true);
      // Restore the original invoice data
    }, 100);

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
    this.editaddlineItem = null;
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
        id: this.data.id,
      })
      .then(async (response) => {
        if (response.result.success && response.result.data) {
          data = response.result.data[0].meta_data;
          this.prefillObject = data;
        }
      });
  }
  editInsurancefre(key, colIndex) {
    this.getOrgStoreAttribute();
    // this.orders.productsData.data = this.originalOrdersProductData.map(
    //   (product) => ({ ...product })
    // );
    // this.orders.selectedOrder = { ...this.originalOrdersData };
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
      } else if (key == "add_line") {
        this.editDescountstateState = false;
        this.editfreightState = false;
        this.editinsurancevalueState = false;
        this.editaddlineItem = colIndex;
        setTimeout(() => {
          this.orderDetailEditAddline.nativeElement.focus();
        }, 100);
      }
    }, 100);
  }
  savefreighdescount(event, key) {
    this.moduleName = "subtotal_form";

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

  public clickedIconId = null;

  onBlur(event: FocusEvent, productId: number): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (this.clickedIconId === productId || this.clickedIconId === "edit") {
      this.clickedIconId = null; // Reset the flag
      return;
    }

    this.closeEdit();
    // this.closeEditTax();
  }
  com_inv_id;
  custm_inv_id;
  orderInfo;
  getViewDetails(id, type: string) {
    // stepper.next();

    let showDocs;
    let tax;
    // this.data.id = this.data.id;
    if (type === "shipment_details") {
      this.fetchingData = true;
      this.totalSpinner = true;
      this.selectedOrderStatus = "";
      this.orders.notifyAddr = {};
    }
    // this.enableInvoice = false;
    // this.priceQuantityDisable = false;
    this.OrdersService.getViewDetails({ id, type }).then(async (response) => {
      if (response.result.success) {
        if (type === "shipment_details") {
          this.fetchingData = false;
          this.totalSpinner = false;
        }
        if (type === "commercial_invoice") {
          this.getViewDetails(
            response.result.data.commercial_invoice[0].id,
            "commercial_invoice_details"
          );
          this.com_inv_id = response.result.data.commercial_invoice[0].id;
        } else if (type == "commercial_invoice_details") {
          this.commercialInvoiceData = { ...response.result.data };
          this.postShipDocs = true;
        } else if (type === "customs_invoice") {
          this.getViewDetails(
            response.result.data.customs_invoice[0].id,
            "customs_invoice_details"
          );

          this.custm_inv_id = response.result.data.customs_invoice[0].id;
          this.tax_conversion_value =
            response.result.data.customs_invoice[0].tax_conversion_value || 0;
        } else if (type == "customs_invoice_details") {
          this.customsInvoiceData = response.result.data;
          this.customDocs = true;
        } else if (type === "shipment_details") {
          if (response.result.data) {
            this.showNoDatFound = false;
          } else {
            this.showNoDatFound = true;
          }
          let selectedOrderDetails = response.result.data;
          // this.order_no_po = selectedOrderDetails.orders;
          this.orderId = selectedOrderDetails.create_shipment[0].id;
          this.subToatlId = response.result.data.subtotal_form[0].id;
          this.totalorderdetails = {
            ...response.result.data.create_shipment[0],
            ...response.result.data.subtotal_form[0],
          };

          if (selectedOrderDetails.create_shipment[0].line_item) {
            this.saveAddLineItem = true;
          } else {
            this.saveAddLineItem = false;
          }
          this.orderDatapassing = {
            ...selectedOrderDetails.create_shipment[0],
          };
          //     // this.package=!this.package
          //     let showTax =
          //       response.result.data.totalordersDt[0].list[0].ksmAddr.ksm_postal_code;
          this.orders.selectedOrder = {
            ...selectedOrderDetails.subtotal_form[0],
            ...selectedOrderDetails.create_shipment[0],
            add_line_items: selectedOrderDetails.add_line_items || [],
          };
          this.originalOrdersData = { ...this.orders.selectedOrder };
          this.po_date2 = new Date(
            this.orders.selectedOrder.po_date
              ? this.orders.selectedOrder.po_date
              : ""
          );
          this.timeout = setTimeout(() => {
            this.selectedOrderStatus = this.orders.selectedOrder.status;
          }, 100);
          this.orders.billingAddr = selectedOrderDetails.add_billing_address[0];
          this.orders.shippingAddr = selectedOrderDetails.add_address[0];
          this.orders.companyShpAddrDt = this.orderDatapassing.shipper_address;
          if (
            selectedOrderDetails?.add_notify_address &&
            selectedOrderDetails?.add_notify_address.length
          ) {
            this.showNotifyAddress = true;

            this.orders.notifyAddr = Object.assign(
              selectedOrderDetails.add_notify_address[0]
            );
          } else {
            this.showNotifyAddress = false;
            this.orders.notifyAddr = {};
          }
          // this.getOrdersActivityDetails();

          if (selectedOrderDetails.shipper_id) {
            this.orders.companyShpAddrDt = selectedOrderDetails.shipper_id;
          }

          this.getOrderDocuments();
          // }
          this.orderInfo = {
            selectedOrder: selectedOrderDetails,
          };
          if (
            this.orders.selectedOrder.status_slug == "docs_completed" ||
            this.orders.selectedOrder.status_slug == "processed"
          ) {
            this.disableCancel = true;
          } else {
            this.disableCancel = false;
          }

          if (this.order_Permissions.add_package) {
            this.getViewDetails(this.data.id, "customs_invoice");
          }
          if (this.order_Permissions.generate_commercial_documents)
            this.getViewDetails(this.data.id, "commercial_invoice");

          this.getAddedFiles("shipping_docs");
          this.getViewDetails(this.data.id, "shipment_product_details");
        } else if (type === "shipment_product_details") {
          this.totalSpinner = false;
          this.fetchingData = false;
          this.productDetails = response.result.data.row_data;
          this.orders.productsData.data = response.result.data.row_data;
          this.originalOrdersProductData = response.result.data.row_data.map(
            (data: any) => ({ ...data })
          );
        } else {
        }
      }
    });
  }
  emitFright() {
    this.saveFreight = true;
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
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  public orderDocuments = new Map();
  public orderDocumentsArr: any = [];
  public dynamicDocLoader = false;
  public docSpinner = false;
  dymanicdocumentdata: any = [];
  getOrderDocuments(): void {
    // this.dymanicdocumentdata = [];
    this.docSpinner = true;
    this.orderDocuments = new Map();
    this.OrdersService.getShipmentDocuments({
      id: this.data.id,
      type: "shipment",
    })
      .then((response) => {
        let data = response.result.data;
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
        this.orderDocumentsArr.some((key) => {
          if (key == 3) {
            let itemsArr = this.orderDocuments.get(key);

            this.orderDocuments.set(key, [
              ...itemsArr,
              {
                name: "Certificate of Origin",
                module: "certificate_of_origin",
                id: "certificate_of_origin",
                static: true,
                is_display :
                this.adminService.rolePermissions.view_post_shipping_docs == 1
                  ? true
                  : false
              },
              {
                name: "Draft BL",
                module: "draft_bl",
                id: "draft_bl",
                static: true,
                is_display :
                this.adminService.rolePermissions.view_post_shipping_docs == 1
                  ? true
                  : false
              },
            ]);
          }
        });

        let concatedArray = [];
        this.orderDocuments.forEach((items, key) => {
          concatedArray = concatedArray.concat(items);
          items.forEach((obj) => {
            if (obj.document_template_types_id === 2) {
              obj.is_display =
                this.adminService.rolePermissions.view_post_shipping_docs == 1
                  ? true
                  : false;
            } else if (obj.document_template_types_id === 3) {
              obj.is_display =
                this.adminService.rolePermissions.view_preshipping_docs == 1
                  ? true
                  : false;
            }
          });

          // this.dymanicdocumentdata = this.dymanicdocumentdata.concat(items);
        });
        this.dymanicdocumentdata = [...concatedArray];
        this.dynamicDocLoader = true;
        console.log(this.orderDocumentsArr);
        setTimeout(() => {
          this.docSpinner = false;
        }, 300);
      })
      .catch((error) => console.log(error));
  }

  generateSubTotals(type: string, id) {
    this.OrdersService.generateSubTotals({
      type: type,
      id: id,
    }).then((response) => {
      if (response.result.success) {
        if (type === "edit_product_in_commercial_inv") {
          this.getViewDetails(id, "commercial_invoice_details");
        }
        if (type === "add_product_in_create") {
          this.updatedGetViewDetails("shipment_details", true);
        }
        if (type === "edit_product_in_customs_inv") {
          this.getViewDetails(id, "customs_invoice_details");
        }
      }
    });
  }
  triggerGridEvent(ev) {
    if (ev.editdone) {
      if (ev.tableName == "shipmentDetail") {
        // this.generateSubTotals("add_product_in_create", this.data.id);
        this.orderPermissions(true);
      } else if (ev.tableName == "customInvoice") {
        // this.getTaxInv();
        // this.getIgstInv();
      } else if (ev.tableName == "commercialInvoice") {
      }
    }
  }
  packagesLength;
  public isOpenFormat = false;

  getPackageLength(event) {
    this.packagesLength = event.length;
    this.isOpenFormat = event?.isOpenFormat;
    if (this.packagesLength > 0 && !this.customsInvoiceData) {
      this.getViewDetails(this.data.id, "customs_invoice");
    }
    this.getUnassignedPackages();
    this.orderPermissions();
  }
  panelOpenState = false;

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
  }
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
        organization_id:
          typeof this.data.id === "string"
            ? parseInt(this.data.id)
            : this.data.id,
        id: column.id,
        form_id: "43",
        module_id: this.data.id,
        moduleName: this.moduleName,
      };
      this.utilsService.saveStoreAttribute(params).then((res) => {
        if (res.success) {
          this.updatedGetViewDetails("shipment_details", true);
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
          this.updatedGetViewDetails("shipment_details", true);
        }
      });
    });
  }
  editAddline(event, columnType: string, colIndex: number) {
    // Get the current value of the input field
    const inputValue = (event.target as HTMLInputElement).value;
    // Logic to update the value in your data structure
    this.orders.selectedOrder.add_line_items[colIndex].value = inputValue;

    // Optionally, you can trigger further actions, like API calls
  }

  validateDecimalInput(event) {
    const input = event.target;
    let value = input.value;

    // Remove any non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure there is only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 3 decimal places
    if (parts.length === 2 && parts[1].length > 3) {
      value = parts[0] + "." + parts[1].slice(0, 3);
    }

    // Only update the value if it has changed
    if (input.value !== value) {
      input.value = value;

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }

    // Angular's two-way binding should automatically update the model,
    // no need to manually dispatch input events unless you have a specific need for it.
  }

  isValidDate(date: any): boolean {
    return !isNaN(new Date(date).getTime());
  }

  public enableAddContainer = false;
  getUnassignedPackages() {
    let url = `getUnassignedPackages?id=${this.data.id}`;
    this.http
      .get(url)
      .toPromise()
      .then((response: any) => {
        if (response.result.success) {
          // Check if response.result.data is an array and its length
          if (Array.isArray(response.result.data)) {
            this.enableAddContainer = response.result.data.length > 0;
          }
          // If it's an object, set enableAddContainer to true
          else if (
            typeof response.result.data === "object" &&
            response.result.data !== null
          ) {
            this.enableAddContainer = true;
          } else {
            this.enableAddContainer = false;
          }
        } else {
          this.enableAddContainer = false;
        }
      })
      .catch((error: any) => {
        console.error("Error fetching unassigned packages:", error);
        this.enableAddContainer = false; // Fallback in case of error
      });
  }
}
