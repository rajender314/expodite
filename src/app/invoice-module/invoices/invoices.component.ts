import { EpiCurrencyPipe } from "../../pipes/epi-currency.pipe";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
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
import { Router } from "@angular/router";
import { LeadsService } from "../../leads/leads.service";
import { AdminService } from "../../services/admin.service";

declare var App: any;

@Component({
  selector: "app-invoices",
  templateUrl: "./invoices.component.html",
  styleUrls: ["./invoices.component.scss"],
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
export class InvoicesComponent implements OnInit {
  @ViewChild("stepper") stepper: TemplateRef<any>;
  public language = language;
  public images = Images;
  disablePayment = false;
  public open = false;
  public userDetails: any;
  blockContent: boolean;
  public productList: Array<any> = [];
  public timeout;
  fetchingData: boolean;
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
  params = {
    perPage: 12,
    page: 1,
    search: "",
  };
  paymentType = [];
  public invoiceData = {
    id: "",
    selectedStatus: new FormControl([]),
    search: this.params.search,
    perPage: this.params.perPage,
    page: this.params.page,
  };
  public invoices = {
    data: [],
    status: [],
    productsList: [],
    organizations: [],
    selectedClients: new FormControl([]),
    client_search: "",
    mfg_date: "",
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

  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private leadService: LeadsService,

    public dialog: MatDialog,
    private cookie: CookieService,
    private snackbar: SnakbarService,
    private router: Router,
    public adminService: AdminService
  ) {}

  ngOnInit() {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.titleService.setTitle("Expodite - Invoices");
    let profile: boolean;
    this.companyInvoiceDetails_com = App["company_data"];
    App.user_roles_permissions.map(function (value) {
      switch (value.code) {
        case "client_interface":
          if (value.selected) {
            profile = true;
          } else {
            profile = false;
          }
          break;
      }
    });
    this.clientPermission = profile;
    this.getOrdersList(true);
    this.showFilter = false;
    this.userDetails = App.user_details;
    this.userDetailsType();
    this.getInvoiceFilters();
  }

  public inputValidator(event: any) {
    //console.log(event.target.value);
    const pattern = /^[a-zA-Z0-9/]*$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9/]/g, "");
      return false;
    }
  }

  backToOrders(stepper: MatStepper) {
    this.getOrdersList(true);
    stepper.previous();
  }

  orderDetail() {
    this.cookie.set(
      "order_id",
      this.invoices.selectedInvoice.invoice["orders_id"]
    );
    this.router.navigate(["/orders"]);
  }

  getInvoiceFilters() {
    this.statusSpinner = true;

    let param = {
      page: 1,
      perPage: 12,
      sort: "ASC",
      search: "",
      flag: "invoices",
    };
    this.OrdersService.getOrderFilterData(param).then((response) => {
      if (response.result.success) {
        this.invoices.statusFilter = response.result.data.statuses;
        this.invoices.statusFilter.map((value) => {
          value.selected = false;
        });
        this.statusSpinner = false;
      }
    });
  }

  assignDetailView(data: any) {
    this.invoiceData.id = data;
    this.fetchingData = true;
    this.OrdersService.getInvoiceList(this.invoiceData).then((response) => {
      let selectedInvoiceDetails = response.result.data.Invioce[0];
      this.invoices.selectedInvoice.invoice = selectedInvoiceDetails.Inovice;
      this.invoices.selectedInvoice.billingAddr =
        selectedInvoiceDetails.billingAddr;
      this.invoices.selectedInvoice.shippingAddr =
        selectedInvoiceDetails.shippingAddr;
      this.invoices.selectedInvoice.productsData =
        selectedInvoiceDetails.productsData;
      this.invoices.selectedInvoice.totalSum = selectedInvoiceDetails.totalSum;
      if (this.invoices.selectedInvoice.invoice["status"] == "Paid") {
        this.disablePayment = true;
      } else {
        this.disablePayment = false;
      }
      this.fetchingData = false;
    });
  }

  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate(["/invoices", data.orders_id, data.shipment_id]);
    return;
  }

  checkboxChange(data: any): void {
    data.selected = !data.selected;
    this.showFilter = true;
    this.disableFilterBtn = false;
  }
  public paramsList;
  loadMore(event) {
    // console.log(event)
    this.paramsList = event;
    this.getOrdersList(true, "pagination");
  }
  public pagedata;
  public listCount;
  getOrdersList(clearList?: any, flag?): void {
    this.fetchingData = true;
    if (clearList) {
      this.invoices.data = [];
      this.params.page = 1;
    }
    if (flag == "pagination") {
      this.pagedata = this.getPagams(this.paramsList, "pagination");
    } else {
      this.params.page = 1;
      this.pagedata = this.getPagams();
    }
    const obj = this.getPagams();
    const params = {
      ...obj,
      name: "invoices",
      //   page: "",
      //   perPage: "",
      //   search: "",
      page: this.params.page,
      perPage: this.params.perPage,
      search: this.params.search,
    };
    this.leadService.getGridList(params).then((response) => {
      if (response.result.success) {
        this.fetchingData = false;
        let data = response.result.data.total_data;
        this.listCount = data ? data.length : 0;
        this.totalCount = response.result.data
          ? response.result.data.total || response.result.data.count
          : 0;
        if (data && data.length) {
          data.map((res) => {
            this.invoices.data.push(res);
          });
        }

        this.searching = false;

        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.filtering = false;
        }, 1000);
      }
    });

    // this.OrdersService.getCommercialInvoiceListApi(this.pagedata).then(
    //   (response) => {
    //     if (response.result.success) {
    //       this.fetchingData = false;
    //       let data = response.result.data.list;
    //       this.listCount = data ? data.length : 0;
    //       this.totalCount = response.result.data
    //         ? response.result.data.total_count
    //         : 0;
    //       if (data && data.length) {
    //         data.map((res) => {
    //           this.invoices.data.push(res);
    //         });
    //       }
    //       this.searching = false;
    //       if (this.timeout) clearTimeout(this.timeout);
    //       this.timeout = setTimeout(() => {
    //         this.filtering = false;
    //       }, 1000);
    //     }
    //   }
    // );
  }

  getPagams(params?, flag?) {
    let data;
    if (flag == "pagination") {
      data = {
        selectedStatus: this.invoiceData.selectedStatus.value,
        search: params.search,
        perPage: params.perPage,
        page: params.page,
      };
    } else {
      data = {
        selectedStatus: this.invoiceData.selectedStatus.value,
        search: this.params.search,
        perPage: this.params.perPage,
        page: this.params.page,
      };
    }

    // if (this.filterApplied) {
    //   this.invoices.statusFilter.map(function (value) {
    //     if (value.selected) {
    //       data.selectedStatus.push(value.id);
    //     }
    //   });
    // }
    return data;
  }

  clearFilterData() {
    this.filtering = true;
    this.filterApplied = false;
    this.invoices.statusFilter.map(function (value) {
      value.selected = false;
    });
    this.invoiceData.selectedStatus.setValue([]);
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
  public disableFilterBtn = false;
  public filterApplied = false;
  applyFilterData() {
    this.filterApplied = true;
    let toast: object;
    this.params.page = 1;
    this.disableFilterBtn = true;
    this.filtering = true;
    // this.showFilter = false;
    // this.searching = true;
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
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.name : "";
  }
  removeClient(clientId: string, selectedList): void {
    const selectedClients = selectedList.value.filter((id) => id !== clientId);
    selectedList.setValue(selectedClients);
  }
  public matSelectOpen = false;
  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }
  clientChange() {
    this.showFilter = true;
  }
  // addLineItem(): void {
  // 	let dialogRef = this.dialog.open(AddLineItemComponent, {
  // 		panelClass: 'alert-dialog',
  // 		width: '550px',
  // 		data: { invoice: this.invoices.selectedInvoice.invoice }
  // 	});

  // 	dialogRef.afterClosed().subscribe(result => {
  // 		if (result && result.success) {
  // 			this.invoices.selectedInvoice.invoice = result.response.result.data.Invioce[0].Inovice;

  // 		}
  // 	});
  // }

  // changeInvoiceExtraKey(index, event) {
  // 	if (this.timestamp) clearTimeout(this.timestamp);
  // 	this.timestamp = setTimeout(() => {
  // 		// if (event.target.innerText != '') {
  // 			this.invoices.selectedInvoice.invoice['extra_col'][index].key = event.target.innerText;
  // 			this.updateKeyValue();
  // 		// }
  // 	}, 1000);
  // }
  // changePaymentType(event: any): void {
  // 	this.activePayment = true;
  // 	if (event != '') {
  // 		this.invoices.selectedInvoice.invoice['payment_type'] = event;
  // 	}

  // }
  // cancelpay() {
  // 	this.activePayment = false;
  // }
  // savePaymentType() {
  // 	this.updateKeyValue();
  // 	this.activePayment = false;
  // }

  // updateKeyValue() {
  // 	let param = Object.assign({}, this.invoices.selectedInvoice.invoice);
  // 	param.pack_charge = param.pack_charge.toString().split(',').join('');
  // 	param.tax_csgt = param.tax_csgt.toString().split(',').join('');
  // 	param.tax_gst = param.tax_gst.toString().split(',').join('');
  // 	param.tax_igst = param.tax_igst.toString().split(',').join('');
  // 	param.tax_others = param.tax_others.toString().split(',').join('');
  // 	this.OrdersService
  // 		.generateInvoice(param)
  // 		.then(response => {
  // 			this.invoices.selectedInvoice.invoice = response.result.data.Invioce[0].Inovice;
  // 			this.invoices.selectedInvoice.totalSum = response.result.data.Invioce[0].totalSum;
  // 		});
  // }

  // changeInvoiceExtraValue(index, event) {
  // 	// console.log(event.key)
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {
  // 				this.invoices.selectedInvoice.invoice['extra_col'][index].value = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }
  // changeInvoiceTaxGst(index, event) {
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {

  // 				this.invoices.selectedInvoice.invoice.tax_gst = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }
  // changeInvoiceTaxCgst(index, event) {
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {
  // 				this.invoices.selectedInvoice.invoice.tax_csgt = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }
  // changeInvoiceTaxIgst(index, event) {
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {
  // 				this.invoices.selectedInvoice.invoice.tax_igst = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }
  // changeInvoicePackCharge(index, event) {
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {
  // 				this.invoices.selectedInvoice.invoice.pack_charge = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }
  // changeInvoiceTaxOthers(index, event) {
  // 	let numberRegex = /[0-9]/g;
  // 	if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
  // 		if (this.timestamp) clearTimeout(this.timestamp);
  // 		this.timestamp = setTimeout(() => {
  // 			if (event.target.innerText != '') {
  // 				this.invoices.selectedInvoice.invoice.tax_others = event.target.innerText;
  // 				this.updateKeyValue();
  // 			}
  // 		}, 1000);
  // 	} else {
  // 		return false;
  // 	}
  // }

  // deleteLineItemAccess(index: any) {
  // 	this.invoices.selectedInvoice.invoice['extra_col'].splice(index, 1);
  // 	//this.attachments.splice(index, 1);
  // 	let param = Object.assign({}, this.invoices.selectedInvoice.invoice);
  // 	this.OrdersService
  // 		.generateInvoice(param)
  // 		.then(response => {
  // 			this.invoices.selectedInvoice.invoice = response.result.data.Invioce[0].Inovice;
  // 		});
  // }

  // deleteLineItem(index: any) {
  // 	let dialogRef = this.dialog.open(DeleteLineItemComponent, {
  // 		panelClass: 'alert-dialog',
  // 		width: '550px',
  // 		data: {}
  // 	});

  // 	dialogRef.afterClosed().subscribe(result => {
  // 		if (result && result.success) {
  // 			this.deleteLineItemAccess(index);
  // 		}
  // 	});
  // }
}
