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
import { AddLineItemComponent } from "../../../app/dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../../app/dialogs/delete-line-item/delete-line-item.component";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { CookieService } from "ngx-cookie-service";
import { CancelOrderComponent } from "../../../app/dialogs/cancel-order/cancel-order.component";
import { DeliverOrderComponent } from "../../../app/dialogs/deliver-order/deliver-order.component";
import { ChangeShipperAddressComponent } from "../../../app/dialogs/change-shipper-address/change-shipper-address.component";
import { EmailDocumentsComponent } from "../../../app/dialogs/email-documents/email-documents.component";
import { Subject } from "rxjs";
import { Lightbox } from "ngx-lightbox";
import * as $ from "jquery";
import { Router, ActivatedRoute } from "@angular/router";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { DescriptionUpload } from "../../dialogs/description/add-description.component";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { LeadsService } from "../../leads/leads.service";
import { UtilsService } from "../../services/utils.service";
import { ErrorDialogComponent } from "../../dialogs/error-dialog/error-dialog.component";
import { NewCreateShipmentComponent } from "../new-create-shipment/new-create-shipment.component";
import { POCreateComponent } from "../../po-module/po-create/po-create.component";
import { OrdersCreateComponent } from "../order-create/order-create.component";
declare var App: any;

const {
  language: {
    orders: { value: commercial_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-new-layout-order-details",
  templateUrl: "./new-layout-order-details.component.html",
  styleUrls: ["./new-layout-order-details.component.scss"],

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
export class NewLayoutOrderDetailsComponent implements OnInit {
  @Output() trigger = new EventEmitter<object>();
  public commercialName = commercial_name;
  @Input() roles;
  private App = App;
  public userDetails: any;
  public orderButton: any;
  public collapseOut: any;
  public clientPermission: any;
  public factoryPermission: boolean;
  containsMilk: boolean;
  public containerError;
  public language = language;
  public images = Images;
  public open = false;
  blockContent: boolean;
  isSampleDocs: boolean = false;
  checked: boolean;
  totalSpinner: boolean;
  private timeout;
  public sailing_date;
  public carrier_data;
  packagePrint: boolean;
  buttonName: boolean;
  packageCompleted: boolean;
  disablePayment = true;
  fetchingData = true;
  fetchOrder: boolean;
  downloadStatus: boolean;
  showDrumsList = false;
  filtersLoader = true;
  public show: boolean = true;
  public activePayment = false;
  public showNoDatFound = false;
  activeState: boolean;
  shippingActiveState: boolean;
  freightandlogisticsState: boolean = false;
  othersCostState: boolean;
  public modPoNum: any;
  public selectedOrderStatus: any;
  searching: boolean;
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
  containerId: any;
  public imagUploadFlag: any;
  public getFileFlag: any;
  public refreshShow = true;
  public enableCustomDocs = false;
  public customSidePannel: boolean = true;
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
  public packageEdit;
  public PostpackageData;
  public freightDataPack;
  public inlineVGMData;
  public inlineSelfSealData;
  public commercialInvoiceData: any;
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  maxCharLimit = 10;
  toppings = new FormControl();

  private timestamp: any;
  enableInvoice: boolean = false;
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

  public paymentStatus = false;
  public showNotifyAddress = false;

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
  @ViewChild("items") item: TemplateRef<any>;
  @ViewChild("shipments") shipment: TemplateRef<any>;
  @ViewChild("uploadSales") uploadSale: TemplateRef<any>;

  @ViewChild("freight") freight: TemplateRef<any>;
  @ViewChild("payments") payment: TemplateRef<any>;
  @ViewChild("Specs") specs: TemplateRef<any>;

  @ViewChild("orderDetailEditInput") orderDetailEditInput: ElementRef;
  @ViewChild("orderDetailEditInsurance") orderDetailEditInsurance: ElementRef;
  @ViewChild("orderDetailEditFright") orderDetailEditFright: ElementRef;
  @ViewChild("orderDetailEditDiscount") orderDetailEditDiscount: ElementRef;
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
  sendDocumentMails: boolean = false;
  adminUser: boolean;
  admin_access: boolean;
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
  estimated_date: Date;
  selectedOptions: any;
  selectedOptionsBuyer: any;
  saveKey: any;
  originalOrdersData: any;
  originalOrdersProductData: any;
  originalTaxInvData: any;
  editClosePOPup: boolean = false;
  editOrdersPONo: any;
  editUpdatedPonoValue: any;
  initialValues: any;
  disablegenrateCommercial: boolean;
  updatedValueinsurance: any;
  updatedFreight: any;
  editdescountValue: any;
  editinsurancevalueState: boolean;
  editfreightState: boolean;
  editDescountstateState: boolean;
  selectedUom: any;
  paymentForm: any;
  disbleChangeShipper: boolean = true; // disable for change shipper address for api fail
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
  updatedGetViewDetails(type: string, updateProduct?: any) {
    this.data.id = this.orders.selectedOrder.id;
    this.OrdersService.getViewDetails({
      id: this.data.id,
      type: type,
    }).then((response) => {
      let selectedOrderDetails = response.result.data;
      if (type === "order_details") {
        this.orders.selectedOrder = {
          ...selectedOrderDetails.subtotal_form[0],
          ...selectedOrderDetails.create_order[0],
          extra_col: selectedOrderDetails.add_line_items || [],
        };
        this.originalOrdersData = {
          ...selectedOrderDetails.subtotal_form[0],
          ...selectedOrderDetails.create_order[0],
          extra_col: selectedOrderDetails.add_line_items || [],
        };
        this.orders.companyShpAddrDt =
          selectedOrderDetails.create_order[0].shipper_address;
        this.timeout = setTimeout(() => {
          this.selectedOrderStatus = this.orders.selectedOrder.status;
        }, 100);
        this.getDynamicDocuments();
        if (!updateProduct) this.updatedGetViewDetails("order_product_details");
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
  changeAddress(): void {
    this.closeEdit();
    let dialogRef = this.dialog.open(ChangeShipperAddressComponent, {
      width: "550px",
      data: { module_id: this.orders.selectedOrder.id, type: "order" },
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

  updateKeyValue(pvmForm: any = null) {
    let toast: object;
    let param = Object.assign({}, this.orders.invoice[0].Inovice);
    param.pack_charge = param.pack_charge.toString().split(",").join("");
    param.tax_csgt = param.tax_csgt.toString().split(",").join("");
    param.tax_gst = param.tax_gst.toString().split(",").join("");
    param.tax_igst = param.tax_igst.toString().split(",").join("");
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

  public order_Permissions: any = {};

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
    private sanitizer: DomSanitizer
  ) {
    this.now.setDate(this.now.getDate() + 1);
    this.now.setHours(0, 0, 0, 0);
  }
  public acceptOrderbutton: boolean = false;
  public generatesalesContract: boolean = false;
  public purchaseOrder: boolean = false;
  public setReadybutton: boolean = false;
  public viewActivityLogIcon: boolean = false;
  public viewExcelIcon: boolean = false;
  public getInputValidationTypes = [];

  async ngOnInit() {
    this.getValidationTypes();
    this.threeMonthsAgo.setMonth(this.now.getMonth() - 3);
    this.currentDate = new Date();
    this.activatedRoute.params.subscribe((param) => (this.data.id = param.id));
    this.titleService.setTitle(App["company_data"].ordersTitle);
    this.orderFormCompanyDetails = App["company_data"];
    this.getViewDetails(this.data.id, "order_details");
    this.orderShipments();
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
    this.userDetailsType();
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
    let permission: boolean;
    App.user_roles_permissions.map(function (val) {
      if (val.code == "inventory") {
        permission = val.selected;
      }
    });
    this.isMerchantExporter = App.isMerchantExporter;
    this.orderPermissions(false);
    this.getOrderProducts();
    this.getPoProducts();
  }

  async getValidationTypes() {
    await this.service.getValidationTypes().then((res) => {
      if (res.result && res.result.success) {
        this.getInputValidationTypes = res.result.data;
      }
    });
  }

  order_shipments = [];
  orderShipments() {
    this.OrdersService.orderShipments(this.data.id).then((response) => {
      console.log(response);
      if (response.result.success) {
        this.order_shipments = response.result.data;
        console.log(this.order_shipments);
      }
    });
  }
  orderPermissions(notOnInit: boolean) {
    this.OrdersService.getOrderPermissions({ id: this.data.id, type: "order" })
      .then((response) => {
        console.log(response);
        if (response.result.success) {
          this.order_Permissions = response.result.data;
          console.log(notOnInit, 888);
          if (notOnInit) this.updatedGetViewDetails("order_details");
        }
      })
      .catch((error) => console.log(error));
  }
  receivedData: string;
  public disabledSave = false;
  deliverOrder(): void {
    this.editClosePOPup = true;

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
  public nameValidators(control: FormControl) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { specialcharacters: true };
    }
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

  public displayTabs = {
    order_details: true,
    shipments: true,

    items: true,
  };

  hideTabs(tabName: string) {
    this.displayTabs[tabName] = !this.displayTabs[tabName];
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
          });
        } else if (flag == "sales") {
          this.salesDocuments = response.result.data.OrdersAtt;
          this.salesDocuments.map((x) => {
            this.supplierDescr = x;
          });
        } else if (flag == "otherOrderSupplier") {
          this.otherOrderAttachments = response.result.data.OrdersAtt;
        }
      } else {
        this.originFileAttachments = [];
      }
    });
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

  public allowProductEditing = true;
  public volWeight = false;
  public batchesdataArray = [];
  public productArray = [];
  public container_strg;
  public sum_ofGross;
  public PackageVerifiedGross;
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
  printInvoice: boolean;

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
        this.orders.selectedOrder.status_slug = "cancelled";

        this.orders.selectedOrder.status_id = "5";
        this.selectedOrderStatus = "Cancelled";
        this.orders.selectedOrder.status == "Cancelled";
        this.getOrdersActivityDetails();
      }
      this.editClosePOPup = false;
    });
  }
  public batchshow = false;
  public filteredProducts = [];
  public productTax;
  public Prcurrency;
  public showtaxinvoiceinaapl: boolean = true;
  public extraColumninvoice;
  public ordersInvoiceData;
  jsonDataString: string;
  valuesArray;
  shipArray;
  concatenatedString: string;
  concateShip: string;
  public freightCostvalue;
  public InsuranceValue;
  public productArra = [];

  public Packagetax;
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
      let packagingTop =
        this.packaging &&
        this.packaging["nativeElement"] &&
        this.packaging["nativeElement"].offsetTop
          ? this.packaging["nativeElement"].offsetTop
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
      }
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
    this.removeDocHighlight = true
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
  public removeDocHighlight = false;
  moveToElement(elementRef: any, tabName: string, offset: number = 74) {
    this.removeDocHighlight = true
    // Deactivate scroll temporarily
    this.activateScroll = false;

    // Change the active tab, if provided
    this.activeTab = tabName;

    // Check if elementRef is defined and has an offsetTop
    if (elementRef && elementRef["nativeElement"]?.offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        elementRef["nativeElement"].offsetTop - offset;
      console.log(elementRef, tabName);
    }

    // Re-activate the scroll after a short delay
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }

  moveToDetails() {
    this.removeDocHighlight = true
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

    if (this.packaging && this.packaging["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.packaging["nativeElement"].offsetTop - 74;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  public errormes;
  editInLineitems(value: any, key: string, id: number) {
    this.closeEdit();

    console.log(value);

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
                this.updatedGetViewDetails("order_details", true);
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
    console.log(event);
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
  public saveAddLineItem = false;

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
      this.getOrdersActivityDetails();
    });
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
  setOrderReady(): void {
    // event.target.disabled = true;
    let status = 10;
    this.clickedPackageDetails = true;
    this.OrdersService.updateEstimateApi({
      id: this.orders.selectedOrder.id,
      type: "order_confirmed",
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

  public closeIcon = false;
  captureInitialValue(event: FocusEvent, field: number) {
    const target = event.target as HTMLTextAreaElement;
    this.initialValues = target.value;
    console.log(this.initialValues);
  }
  addlineitemorders() {
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
        // this.generateSubTotals("add_product_in_create", this.data.id);
        this.updatedGetViewDetails("order_details", true);
        this.orders.selectedOrder.extra_col.push(result.response);
        toast = { msg: "Item Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  deleteLineItemorderDetails(lineItem: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: { lineItem, type: "add_product_in_order" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.updatedGetViewDetails("order_details", true);

        // this.deleteLineItemAccessOrders(index);
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
  editInsuranceFreight(event, value, flag) {
    let insurance;
    let freight;
    let discount;
    let numberRegex = /[0-9.]/g;

    this.clickedIconId = flag;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (
        this.orders.selectedOrder.insurance ||
        this.orders.selectedOrder.freight ||
        this.orders.selectedOrder.discount
      ) {
        if (value == 1 || value == 2 || value == 3) {
          const innerTextWithoutCommas = event.target.innerText.replace(
            /,/g,
            ""
          );

          localStorage.setItem("moduleName", "subtotal_form");

          let insurance = this.getFormattedValue(
            this.updatedValueinsurance,
            this.orders.selectedOrder.insurance
          );
          let freight = this.getFormattedValue(
            this.updatedFreight,
            this.orders.selectedOrder.freight
          );
          let discount = this.getFormattedValue(
            this.editdescountValue,
            this.orders.selectedOrder.discount
          );

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
          };
          let toast: object;
          this.utilsService.saveStoreAttribute(param).then((res) => {
            if (res.success) {
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              this.orders.selectedOrder.insurance = insurance;
              this.orders.selectedOrder.discount = discount;
              this.orders.selectedOrder.freight = freight;
              this.editinsurancevalueState = false;
              this.editfreightState = false;
              this.editDescountstateState = false;
              // this.generateSubTotals("add_product_in_create", this.data.id);

              this.updatedGetViewDetails("order_details", true);

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
              this.snackbar.showSnackBar(toast);
            }
          });
        }
      }
    });
  }
  public orderOtherDetails: any;

  updateWordCount(event): void {
    this.wordCount = this.textareaContent.length;
    this.wordCountotherinfo = this.textareaContents.length;
    this.wordCountStand1 = this.textCount.length;
  }
  routingPac() {
    this.router.navigate(["/createOrders"]);
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
    // if (ev.module === "frieght_form") {
    //   this.freightForm = ev;
    //   if (ev.hasOwnProperty("stuffing") && ev?.stuffing == "Factory Stuffing") {
    //   }
    // } else if (ev.module === "shipping_details") {
    //   this.shippingform = ev;
    // }
    // if (ev.hasOwnProperty("enableCustomDocs"))
    //   this.enableCustomDocs = ev.enableCustomDocs;
    // if (ev.hasOwnProperty("displayScomet"))
    //   this.displayScomet = ev.displayScomet;
    // if (ev.hasOwnProperty("displayNonScomet"))
    //   this.displayNonScomet = ev.displayNonScomet;
    // if (ev.hasOwnProperty("displayAdc")) this.displayAdcHaz = ev.displayAdcHaz;
    // if (ev.hasOwnProperty("displayAdcNonHaz"))
    //   this.displayAdcNonHaz = ev.displayAdcNonHaz;
    // if (ev.hasOwnProperty("displayAdc")) this.displayAdc = ev.displayAdc;
    // if (ev.hasOwnProperty("selectedOrderStatus"))
    //   this.selectedOrderStatus = ev.selectedOrderStatus;
    // if (ev.hasOwnProperty("status_id"))
    //   this.orders.selectedOrder.status_id = ev.status_id;
    // if (ev.hasOwnProperty("status_color_code"))
    //   this.orders.selectedOrder.status_color_code = ev.status_color_code;
  }

  public saveFreightFlag = 1;
  public saveShippedFlag = 1;
  public carrierFlag;

  formEmitEvent(obj: any) {
    localStorage.setItem("moduleName", obj.module);
    obj.parentform.markAsDirty();
    if (obj.form.invalid === true) {
      obj.parentform.setErrors({ invalid: true });
    } else {
      obj.parentform.setErrors(null);
      obj.parentform.updateValueAndValidity();
    }
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
  onRadioButtonClicked(option: string) {
    // Update the selectedOptions model with the clicked option
    this.selectedOptions = option;
    // Perform any other necessary actions based on the selected option
  }
  closeEdit() {
    if (
      this.editfreightState ||
      this.editinsurancevalueState ||
      this.editDescountstateState
    ) {
      this.orders.selectedOrder = { ...this.originalOrdersData };
    } // Restore the original invoice data
    this.editfreightState = false;
    this.editinsurancevalueState = false;
    this.editDescountstateState = false;
    this.editOrdersPONo = null;
    this.updatedFreight = null;
    this.updatedValueinsurance = null;
    this.editdescountValue = null;
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
  editInsurancefre(key) {
    this.getOrgStoreAttribute();
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
    localStorage.setItem("moduleName", "subtotal_form");

    if (key === "freight") {
      this.updatedFreight = event.target.value;
    } else if (key === "insurance") {
      this.updatedValueinsurance = event.target.value;
    } else if (key === "discount") {
      this.editdescountValue = event.target.value;
    }
  }
  extracolEdit = new Set();

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
    this.OrdersService.getOrderDocuments({
      id: this.data.id,
      type: "order",
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
        let concatedArray = [];
        this.orderDocuments.forEach((items, key) => {
          console.log(items, 7895, key);
          concatedArray = concatedArray.concat(items);

          // this.dymanicdocumentdata = this.dymanicdocumentdata.concat(items);
        });
        this.dymanicdocumentdata = [...concatedArray];
        this.dynamicDocLoader = true;
      })
      .catch((error) => console.log(error));
  }

  com_inv_id;
  orderInfo;
  getViewDetails(id, type: string) {
    // stepper.next();

    let showDocs;
    let tax;
    // this.data.id = this.data.id;
    if (type === "order_details") {
      this.fetchingData = true;
      this.totalSpinner = true;
      this.selectedOrderStatus = "";
    }
    this.orders.notifyAddr = {};
    // this.enableInvoice = false;
    // this.priceQuantityDisable = false;
    this.OrdersService.getViewDetails({ id, type }).then(async (response) => {
      if (response.result.success) {
        if (type === "order_details") {
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
          this.commercialInvoiceData = response.result.data;
        } else if (type === "order_details") {
          if (response.result.data) {
            this.showNoDatFound = false;
          } else {
            this.showNoDatFound = true;
          }
          let selectedOrderDetails = response.result.data;
          // this.order_no_po = selectedOrderDetails.orders;
          this.orderId = selectedOrderDetails.create_order[0].id;
          this.subToatlId = response.result.data.subtotal_form[0].id;
          this.totalorderdetails = {
            ...response.result.data.create_order[0],
            ...response.result.data.subtotal_form[0],
          };
          if (selectedOrderDetails.create_order[0].line_item) {
            this.saveAddLineItem = true;
          } else {
            this.saveAddLineItem = false;
          }
          this.orderDatapassing = { ...selectedOrderDetails.create_order[0] };
          this.orders.companyShpAddrDt = this.orderDatapassing.shipper_address;
          this.orders.selectedOrder = {
            ...selectedOrderDetails.subtotal_form[0],
            ...selectedOrderDetails.create_order[0],
            extra_col: selectedOrderDetails.add_line_items || [],
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
          setTimeout(() => {
            if (selectedOrderDetails.add_notify_address.length) {
              this.showNotifyAddress = true;

              this.orders.notifyAddr =
                selectedOrderDetails.add_notify_address[0];
            } else {
              this.showNotifyAddress = false;
              this.orders.notifyAddr = {};
            }
          }, 1000);
          this.getOrdersActivityDetails();

          if (selectedOrderDetails.shipper_id) {
            this.orders.companyShpAddrDt = selectedOrderDetails.shipper_id;
          }

          this.getDynamicDocuments();
          // }
          this.orderInfo = {
            selectedOrder: selectedOrderDetails,
          };
          // this.getViewDetails(this.data.id, "commercial_invoice");

          this.getViewDetails(this.data.id, "order_product_details");
        } else if (type === "order_product_details") {
          this.totalSpinner = false;
          this.fetchingData = false;
          this.productDetails = response.result.data.row_data;
          this.orders.productsData.data = response.result.data.row_data;
          console.log(response.result.data.row_data);
          this.originalOrdersProductData = response.result.data.row_data.map(
            (data: any) => ({ ...data })
          );
        } else {
          console.log(response);
        }
      }
    });
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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
          this.updatedGetViewDetails("order_details", true);
        }
      }
    });
  }
  triggerGridEvent(ev) {
    if (ev.editdone) {
      if (ev.tableName == "orderDetail") {
        // this.generateSubTotals("add_product_in_create", this.data.id);
        this.updatedGetViewDetails("order_details", true);
      } else if (ev.tableName == "customInvoice") {
        // this.getTaxInv();
        // this.getIgstInv();
      } else if (ev.tableName == "commercialInvoice") {
      }
    }
  }
  public fetchingShipments = false;
  public shipmentsList = [];
  shipmentsDetailsRoute(stepper: MatStepper, data: any) {
    this.router.navigate([
      "/orders",
      // 213
      data.id,
    ]);
    return;
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
      // this.onCancleRecordActions();
    });
  }
  conformshipment() {
    this.service
      .verifyShipment({
        selected_order_ids: [this.data.id],
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
  shipmetOrderProducts;
  createShipment() {
    let arr = [];
    arr.push({ id: this.orders.selectedOrder.id });
    let dialogRef = this.dialog.open(
      NewCreateShipmentComponent,
      // CreateShipmentComponent,
      {
        panelClass: "alert-dialog",
        width: "100%",
        data: {
          title: "Create Shipment",
          flag: "Create Shipment",
          orders: arr,
          ordersId: [this.data.id],
          shipmetOrderProducts: this.shipmetOrderProducts,
          selectedCurrency: { type: this.orderDatapassing?.currency_type },
        },
        disableClose: true,
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("shipments_id", result.response);
        this.router.navigate([
          `/orders/${this.data.id}/shipments`,
          result.response,
        ]);
        let toast: object;
        toast = { msg: "Shipment Created Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  paymentformEmitEvent(obj) {
    localStorage.setItem("moduleName", obj.module);
    this.paymentForm = obj.form;
  }

  createPO() {
    let toast: object;
    let dialogRef = this.dialog.open(POCreateComponent, {
      panelClass: "alert-dialog",
      width: "60%",
      data: {
        flag: "Create PO",
        ordersId: [this.data.id],
        shipmetOrderProducts: this.poProducts,
        // productArr:
        //   this.invoiceProducts.length !== 0 ? this.invoiceProducts : null,
        order_id: this.orders.selectedOrder.id,
        // po_suffix: this.orders.selectedOrder.po_suffix,
        // rowIds: this.rowIds,
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

  getOrderProducts() {
    this.service
      .getOrderProducts({
        order_id: this.data.id,
      })
      .then((response) => (this.shipmetOrderProducts = response))
      .catch((error) => console.log(error));
  }

  public poProducts = [];
  getPoProducts() {
    this.service
      .getPoProducts({
        order_id: this.data.id,
      })
      .then((response) => (this.poProducts = response))
      .catch((error) => console.log(error));
  }

  minimizeAll = false;
  setMinimizeAll() {
    this.minimizeAll = true;
    this.displayTabs = {
      order_details: false,
      shipments: false,
      items: false,
    };
  }
  editOrderBtn: boolean = false;
  editOrder() {
    this.openEditOrderDialog("Edit");
  }
  public newColumnAdded = false;
  // public editDone = true;

  openEditOrderDialog(title) {
    let toast: object;
    let dialogRef = this.dialog.open(OrdersCreateComponent, {
      panelClass: "alert-dialog",
      width: "100%",
      data: {
        estimate_id: this.data.id,
        title: title,
        type: "edit",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.editOrderBtn = false;
      if (result && result.success) {
        toast = {
          msg: "Order Updated Successfully",

          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.getViewDetails(this.data.id, "order_details");
        this.newColumnAdded = true;
        setTimeout(() => {
          this.newColumnAdded = false;
        }, 100);

        // this.editDone = false;
        // setTimeout(() => {
        //   this.editDone = true;
        // }, 50);
      } else if (result && !result.success) {
        toast = {
          msg: "Failed to Update Order ",
          status: "error",
        };

        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
