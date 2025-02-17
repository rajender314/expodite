import {
  Component,
  HostListener,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Title } from "@angular/platform-browser";
import { FormControl } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
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
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AddInventoryComponent } from "../../dialogs/add-inventory/add-inventory.component";
import { language } from "../../language/language.module";
import { AddLineItemComponent } from "../../../app/dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../../app/dialogs/delete-line-item/delete-line-item.component";
import { SnakbarService } from "../../../app/services/snakbar.service";
import { CookieService } from "ngx-cookie-service";
import { Router, ActivatedRoute } from "@angular/router";
import { Pipe, PipeTransform } from "@angular/core";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { AdminService } from "../../services/admin.service";
const padding = "000000";

declare var App: any;

@Pipe({
  name: "epiCurrency",
})
export class EpiCurrencyPipe implements PipeTransform {
  private prefix: string;
  private decimal_separator: string;
  private thousands_separator: string;
  private suffix: string;

  constructor() {
    this.prefix = "";
    this.suffix = "";
    this.decimal_separator = ".";
    this.thousands_separator = ",";
  }
  //{{ user.name | uselessPipe:"Mr.":"the great" }}
  transform(
    value: string,
    currency: any = "USD",
    showCurrency: any = false,
    fractionSize: number = 2
  ): string {
    value = parseFloat(value).toFixed(2);

    if (parseFloat(value) % 1 != 0) {
      fractionSize = 2;
    }
    let [integer, fraction = ""] = (parseFloat(value).toString() || "")
      .toString()
      .split(".");

    fraction =
      fractionSize > 0
        ? this.decimal_separator +
          (fraction + padding).substring(0, fractionSize)
        : "";

    if (currency == "USD") {
      integer = integer.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        this.thousands_separator
      );
    } else if (currency == "INR") {
      integer = parseInt(integer).toLocaleString("en-IN");
    } else {
      integer = integer.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        this.thousands_separator
      );
    }

    if (isNaN(parseFloat(integer))) {
      integer = "0";
    }

    this.prefix = showCurrency ? currency + " " : "";
    return this.prefix + integer + fraction + this.suffix;
  }
}

@Component({
  selector: "app-invoice-details",
  templateUrl: "./invoice-details.component.html",
  styleUrls: ["./invoice-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    InventoryService,
    OrdersService,
    OrganizationsService,
    SnakbarService,
    CookieService,
  ],
  animations: [
    trigger("slideLeftAnimate", [
      transition(":enter", [
        //query('*', [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        //stagger(10, [
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
        //])
        //])
      ]),
    ]),
  ],
})
export class InvoiceDetailsComponent implements OnInit {
  public language = language;
  public images = Images;
  disablePayment = false;
  public open = false;
  public userDetails: any;
  blockContent: boolean;
  public productList: Array<any> = [];
  public timeout;
  fetchingData: boolean = true;
  public clientPermission: any;
  public activePayment = false;
  public statusSpinner = true;
  public timestamp: any;
  public showFilter = false;
  filtering = false;
  searching: boolean;
  totalCount: any;
  companyInvoiceDetails_com: any;
  totalPages: number = 2500;
  displayedColumns = [
    "order_product_id",
    "product_name",
    "product_quantity",
    "product_price",
    "product_price_total",
  ];
  params = {
    pageSize: 25,
    page: 1,
    search: "",
  };
  paymentType = [];
  public invoiceData = {
    id: "",
  };
  public id;

  public invoices = {
    data: [],
    status: [],
    productsList: [],
    organizations: [],
    selectedClients: new FormControl([]),
    client_search: "",
    mfg_date: "",
    invoiceData: {},
    selectedInvoice: {
      invoice: {
        tax_gst: "",
        tax_csgt: "",
        tax_igst: "",
        pack_charge: "",
        tax_others: "",
      },
      billingAddr: {
        bill_address1: "",
        bill_address2: "",
        bill_countrty: "",
        bill_postal_code: "",
        bill_state: "",
        company_name: "",
      },
      shippingAddr: {
        ship_address1: "",
        ship_address2: "",
        ship_countrty: "",
        ship_postal_code: "",
        ship_state: "",
        company_name: "",
      },
      totalSum: "",
      ksmAddr: [],

      productsData: [],
    },
    productsData: [],
    statusFilter: [],

    showDetailView: false,
  };

  public current_date: Date = new Date();

  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    public dialog: MatDialog,
    private cookie: CookieService,
    private snackbar: SnakbarService,
    private router: Router,
    private route: ActivatedRoute,
    public adminService: AdminService
  ) {}
  public viewExcelIcon: boolean = false;
  public orders_id;
  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.titleService.setTitle("Expodite - Invoices");
    let profile: boolean;
    this.companyInvoiceDetails_com = App["company_data"];
    let viewExcelDownload: boolean;
    App.user_roles_permissions.map(function (value) {
      switch (value.code) {
        case "client_interface":
          if (value.selected) {
            profile = true;
          } else {
            profile = false;
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
    this.clientPermission = profile;
    this.viewExcelIcon = viewExcelDownload;
    // if (this.cookie.check('invoice_id')) {
    // 	let invoice_id = this.cookie.get('invoice_id');
    // 	// this.assignDetailView(invoice_id);
    // 	this.cookie.delete('invoice_id');
    // 	this.searching = false;
    // } else {
    // 	this.getOrdersList(true);

    // }

    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.orders_id = params.orders_id;
      // this.assignDetailView(this.id);
      this.getViewDetails(this.id, "commercial_invoice");
      //  this.setForm();
    });

    this.showFilter = false;
    this.userDetails = App.user_details;
    this.userDetailsType();
    // this.getPaymentTypes();
  }

  orderDetail(orderId?: any) {
    // if (orderId) {
    // this.router.navigate([
    //   "/orders",
    //   this.orders_id,
    //   "shipments",
    //   this.orders_id,
    // ]);
    this.router.navigate([
      "/orders",
      encodeURIComponent(this.orders_id),
      "shipments",
      encodeURIComponent(this.id),
    ]);

    return;
    // }
    // this.cookie.set("order_id", this.orderId);
    // this.router.navigate(['/orders']);
    // this.router.navigate(["/orders", this.id]);
  }

  getPaymentTypes() {
    this.OrdersService.getPaymentTypes().then((response) => {
      // console.log(response)
      if (response.result.success) {
        this.paymentType = response.result.data;
      }
    });
  }
  public invoiceName = "";
  public bankDetailUrl = "";
  public selectedInvoiceCount;
  public orderId = "";
  public invoice_status = "";
  public InvoiceDetails;
  public show_edit = false;

  // assignDetailView(data: any) {
  //   this.invoiceData.id = data;
  //   this.fetchingData = true;
  //   this.OrdersService.getCommercialInvoiceListApi(this.invoiceData).then(
  //     (response) => {
  //       this.selectedInvoiceCount = response.result.data;

  //       if (this.selectedInvoiceCount != 0) {
  //         let selectedInvoiceDetails = response.result.data;
  //         this.invoice_status = response.result.data.payment_status;

  //         this.InvoiceDetails = response.result.data;
  //         this.invoiceName = selectedInvoiceDetails.inv_number;
  //         this.orderId = selectedInvoiceDetails.orders_id;
  //         this.bankDetailUrl = "";
  //         this.invoices.selectedInvoice.invoice = selectedInvoiceDetails;
  //         this.invoices.selectedInvoice.productsData =
  //           selectedInvoiceDetails.productsData;
  //         this.invoices.selectedInvoice.totalSum =
  //           selectedInvoiceDetails.totalSum;
  //         if (this.invoices.selectedInvoice.invoice["status"] == "Paid") {
  //           this.disablePayment = true;
  //         } else {
  //           this.disablePayment = false;
  //         }
  //         this.fetchingData = false;
  //       } else {
  //         this.fetchingData = false;
  //       }
  //     }
  //   );
  // }
  newInvoiceData: any = {};
  com_inv_id;
  orderData;
  getViewDetails(id, type) {
    this.invoiceData.id = id;
    this.fetchingData = true;
    this.OrdersService.getViewDetails({
      id,
      type: type,
    }).then(async (response) => {
      if (response.result.success) {
        if (type === "commercial_invoice") {
          this.orderData = response.result.data;
          this.getViewDetails(
            response.result.data.commercial_invoice[0].id,
            "commercial_invoice_details"
          );
          this.com_inv_id = response.result.data.commercial_invoice[0].id;
        } else if (type == "commercial_invoice_details") {
          this.newInvoiceData = response.result.data;
          this.fetchingData = false;
        }
      }
    });
  }

  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate(["/invoices", data.Inovice.id]);
    return;
  }

  checkboxChange(data: any): void {
    data.selected = !data.selected;
    this.showFilter = true;
  }

  getOrdersList(clearList?: any): void {
    if (clearList) {
      this.invoices.data = [];
      this.params.page = 1;
    }
    this.OrdersService.getInvoiceList(this.getPagams()).then((response) => {
      if (response.result.success) {
        let data = response.result.data.Invioce;
        this.invoiceName = data.Invoice.inv_nbr;
        this.totalCount = response.result.data.total;
        data.map((res) => {
          this.invoices.data.push(res);
        });

        // if(this.cookie.check('invoice_id')){
        //   let invoice_id = this.cookie.get('invoice_id');
        //   let selectedInvoice = false;
        //   this.invoices.data.map(function(value,index){console.log(value,invoice_id)
        //     if(value.Inovice.id==invoice_id){
        //       console.log(value)
        //       selectedInvoice = value;
        //     }
        //   });
        //   this.assignDetailView(selectedInvoice);
        //   this.stepper['selectedIndex'] = 1;
        //   this.cookie.delete('invoice_id');
        //   this.searching = false;
        // }
        this.searching = false;
        if (!this.invoices.statusFilter.length) {
          this.invoices.statusFilter = response.result.data.invoictStatus;
          this.invoices.statusFilter.map(function (value) {
            value.selected = false;
          });
          this.statusSpinner = false;
        }
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.filtering = false;
        }, 1000);
      }
    });
  }

  getPagams() {
    let data = {
      selectedStatus: [],
      search: this.params.search,
      pageSize: this.params.pageSize,
      page: this.params.page,
    };
    this.invoices.statusFilter.map(function (value) {
      if (value.selected) {
        data.selectedStatus.push(value.id);
      }
    });

    return data;
  }

  clearFilterData() {
    this.filtering = true;
    this.invoices.statusFilter.map(function (value) {
      value.selected = false;
    });
    this.showFilter = false;
    this.getOrdersList(true);
  }
  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }

  applyFilterData() {
    let toast: object;
    this.params.page = 1;
    this.filtering = true;
    // this.showFilter = false;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrdersList(true);
    }, 500);
    toast = { msg: "Filters Applied Successfully...", status: "success" };
    this.snackbar.showSnackBar(toast);
  }

  searchOrders(search: string, event?: any): void {
    this.params.search = search;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrdersList(true);
    }, 1000);
  }

  onScroll(): void {
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      this.params.page++;
      this.getOrdersList();
    }
  }

  addLineItem(): void {
    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: { invoice: this.invoices.selectedInvoice.invoice },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.invoices.selectedInvoice.invoice =
          result.response.result.data.Invioce[0].Inovice;
        this.invoices.selectedInvoice.totalSum =
          result.response.result.data.Invioce[0].totalSum;
      }
    });
  }

  changeInvoiceExtraKey(index, event) {
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      // if (event.target.innerText != '') {
      this.invoices.selectedInvoice.invoice["extra_col"][index].key =
        event.target.innerText;
      this.updateKeyValue();
      // }
    }, 1000);
  }
  public paymentSelected;
  changePaymentType(event: any): void {
    // console.log(event)
    this.activePayment = true;
    this.paymentSelected = event;
    if (event != "") {
      this.invoices.selectedInvoice.invoice["payment_type"] = event;
    }
  }
  cancelpay() {
    this.activePayment = false;
  }
  savePaymentType() {
    this.updateKeyValue();
    this.activePayment = false;
    if (this.paymentSelected == "Advance") {
      this.disablePayment = true;
    } else {
      this.disablePayment = false;
    }
  }

  updateKeyValue() {
    let param = Object.assign({}, this.invoices.selectedInvoice.invoice);
    param.pack_charge = param.pack_charge.toString().split(",").join("");
    param.tax_csgt = param.tax_csgt.toString().split(",").join("");
    param.tax_gst = param.tax_gst.toString().split(",").join("");
    param.tax_igst = param.tax_igst.toString().split(",").join("");
    param.tax_others = param.tax_others.toString().split(",").join("");
    this.OrdersService.generateInvoice(param).then((response) => {
      this.invoices.selectedInvoice.invoice =
        response.result.data.Invioce[0].Inovice;
      this.invoices.selectedInvoice.totalSum =
        response.result.data.Invioce[0].totalSum;
    });
  }

  changeInvoiceExtraValue(index, event) {
    // console.log(event.key)
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice["extra_col"][index].value =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }
  changeInvoiceTaxGst(index, event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice.tax_gst =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }
  changeInvoiceTaxCgst(index, event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice.tax_csgt =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }
  changeInvoiceTaxIgst(index, event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice.tax_igst =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }
  changeInvoicePackCharge(index, event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice.pack_charge =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }
  changeInvoiceTaxOthers(index, event) {
    let numberRegex = /[0-9]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.innerText != "") {
          this.invoices.selectedInvoice.invoice.tax_others =
            event.target.innerText;
          this.updateKeyValue();
        }
      }, 1000);
    } else {
      return false;
    }
  }

  deleteLineItemAccess(index: any) {
    this.invoices.selectedInvoice.invoice["extra_col"].splice(index, 1);
    //this.attachments.splice(index, 1);
    let param = Object.assign({}, this.invoices.selectedInvoice.invoice);
    this.OrdersService.generateInvoice(param).then((response) => {
      this.invoices.selectedInvoice.invoice =
        response.result.data.Invioce[0].Inovice;
    });
  }

  deleteLineItem(index: any) {
    // return;
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

  backToOrders() {
    this.router.navigate(["/invoices"]);
  }

  paidInvoice() {
    let dialogRef = this.dialog.open(MarkAsPaidComponent, {
      width: "550px",
      data: {
        orders_id: this.orderId,
        invoice_id: this.com_inv_id,
        shipment_id: this.id,
        invoiceData: this.newInvoiceData,
        balance_amount:
          this.newInvoiceData?.commercial_invoice[0]?.balance_amount,
        currency: this.orderData?.create_shipment[0]?.currency_type,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.getViewDetails(this.com_inv_id, "commercial_invoice_details");
        let toast: object;
        toast = { msg: "Payment Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  showOrders = false;

  toggleOrders() {
    this.showOrders = !this.showOrders;
  }

  getOrdersHeight() {
    const numOrders = this.InvoiceDetails?.associated_orders.length;
    if (this.showOrders) {
      return numOrders * 40;
    } else {
      return 0;
    }
  }

  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;
    if (targetElement && !targetElement.closest(".heading")) {
      this.showOrders = false;
    }
  }
  triggerGridEvent(ev) {}
}
