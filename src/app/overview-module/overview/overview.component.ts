import { CreatePurchaseOrderComponent } from "./../../dialogs/create-purchase-order/create-purchase-order.component";
import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { MatCardModule } from "@angular/material/card";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEncapsulation } from "@angular/core";
import { OrdersService } from "../../services/orders.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
} from "@angular/animations";
import { Images } from "../../images/images.module";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CreateOrderComponent } from "../../dialogs/create-order/create-order.component";
import { SnakbarService } from "../../services/snakbar.service";
import {
  Router,
  ActivatedRoute,
  RouterModule,
  NavigationStart,
} from "@angular/router";
// import { language } from '../../language/language.module';
import { CookieService } from "ngx-cookie-service";
import { AdminService } from "../../services/admin.service";
import { MatStepper } from "@angular/material/stepper";
declare var App: any;

@Component({
  selector: "[app-overview]",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [OrdersService, CookieService],
  animations: [
    trigger("overviewAnimate", [
      transition(":enter", [
        query("*", [
          style({ transform: "translateX(-100px)", opacity: 0 }),
          stagger(10, [
            animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
          ]),
        ]),
      ]),
    ]),

    trigger("overviewAnimateLeft", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),

    trigger("zoomAnimate", [
      transition(":enter", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("300ms ease-in", style({ transform: "scale(1)", opacity: 1 })),
      ]),
    ]),

    trigger("overviewFadeAnimate", [
      transition(":enter", [
        query("*", [
          style({ opacity: 0 }),
          stagger(5, [
            animate("1000ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class OverviewComponent implements OnInit {
  private images = Images;
  private App = App;
  fetchingData = true;
  private emptyOrdersData: boolean = true;
  public createOrderPermission: boolean;
  public invoicePermission: boolean;
  public ordersPermission: boolean;
  private emptyInvoiceData: boolean = true;
  public clientPermission: any;
  public newOrdersCount: number;
  overViewCompanyData: any;
  public appFnvironment = "";
  public stock_available = [];
  public today = new Date();
  public is_automech = App.env_configurations.is_automech;
  orders = {
    ordersList: [],
    invoicesList: [],
    newOrders: "",
    total_orders_count: "",
    ordersCount: "",
    deliversToday: "",
    totalDue: "",
    totalPastDue: " ",
    totalDueINR: "",
    totalPastDueINR: "",
    veganRemaining: [],
    spectrumRemaining: [],
    prod1: [],
    prod1Name: [],
    prod2Name: [],
    prod2: [],
    due: [],
    overdue: [],
    currency_type: { currency_type: "", id: "" },
  };
  ngOnInit() {
    this.titleService.setTitle(App["company_data"].overviewTitle);
    this.overViewCompanyData = App["company_data"];
    this.getListOverview();
    let createOrder: boolean;
    let clientView: boolean;
    let orderPermism: boolean;
    let invPermisn: boolean;

    // this.getEnvConfig();

    if (!this.is_automech) {
      this.displayedColumns.splice(2, 0, "po_nbr");
    }
    App.user_roles_permissions.map(function (value) {
      switch (value.code) {
        case "order":
          if (value.selected === true) {
            createOrder = true;
          } else {
            createOrder = false;
          }
          break;
        case "client_interface":
          if (value.selected === true) {
            clientView = true;
          } else {
            clientView = false;
          }
          break;
        case "orders":
          if (value.selected === true) {
            orderPermism = true;
          } else {
            orderPermism = false;
          }
          break;
        case "invoices":
          if (value.selected == true) {
            invPermisn = true;
          } else {
            invPermisn = false;
          }
          break;
      }
    });
    this.clientPermission = clientView;
    // console.log(this.clientPermission)
    this.invoicePermission = invPermisn;
    this.ordersPermission = orderPermism;
    this.createOrderPermission = createOrder;
  }
  constructor(
    private titleService: Title,
    private router: Router,
    private cookie: CookieService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private OrdersService: OrdersService,
    public adminService: AdminService
  ) {}
  displayedColumns = [
    "order_no",
    "client_name",
    "date_added",
    "total_amount",
    "order_status",
  ];
  displayedClientColumns = [
    "po_nbr",
    "total_quantity",
    "total_amount",
    "order_status",
  ];
  displayedOrderList = [
    "inv_nbr",
    "client_name",
    "total_amount",
    "order_status",
  ];
  dataSource = new MatTableDataSource();
  invoiceDataSource = new MatTableDataSource();
  getEnvConfig() {
    let param = {};
    this.adminService.getEnvDetails(param).then((res) => {
      if (res["result"].success) {
        this.adminService.instanceName = res.result.data.instance_name;
        this.adminService.appFnvironment = res.result.data.app_environment;
        // console.log(this.adminService.instanceName)
      }
    });
  }
  getListOverview(): void {
    this.fetchingData = true;
    const today = new DatePipe("en-US").transform(
      this.today,
      "dd-MM-yyyy h:mm a"
    );

    this.OrdersService.getOverviewList({ date: today }).then((response) => {
      this.fetchingData = false;
      if (response.result.success) {
        this.stock_available = response.result.data.stock_available;
        this.orders.veganRemaining = response.result.data.stock_available.length
          ? response.result.data.stock_available[0].sum
          : 0;

        // this.orders.prod1 = response.result.data.stock_available.length ? response.result.data.stock_available[0].name: '';
        // this.orders.prod1Name = response.result.data.stock_available.length ? response.result.data.stock_available[0].uom_name: '';
        // this.orders.prod2Name = response.result.data.stock_available.length ? response.result.data.stock_available[1].uom_name: '';

        // console.log(response.result.data.stock_available[1])
        this.orders.prod2 =
          response.result.data.stock_available[1] != undefined
            ? response.result.data.stock_available[1].name
            : "";
        this.orders.spectrumRemaining =
          response.result.data.stock_available[1] != undefined
            ? response.result.data.stock_available[1].sum
            : 0;
        // this.orders.veganRemaining = response.result.data.vegan_total_remaining;
        // this.orders.spectrumRemaining = response.result.data.spectrum_total_remaining;
        this.orders.due = response.result.data.dueAndOverdueList
          ? response.result.data.dueAndOverdueList.Due
          : "";
        this.orders.overdue = response.result.data.dueAndOverdueList
          ? response.result.data.dueAndOverdueList.Overdue
          : "";
        //console.log(this.orders.due,  this.orders.overdue)
        this.orders.ordersList = response.result.data.odersDt;
        this.newOrdersCount = response.result.data.receivedCount;
        this.orders.newOrders = response.result.data.newOrders;
        this.orders.total_orders_count =
          response.result.data.total_orders_count;
        this.orders.invoicesList = response.result.data.invoice;
        this.orders.deliversToday = response.result.data.deliveryOrders;
        this.orders.totalDue = response.result.data.totalDue;
        this.orders.totalPastDue = response.result.data.totalPastDue;
        this.orders.totalPastDueINR = response.result.data.totalPastDueINR;
        this.orders.totalDueINR = response.result.data.totalDueINR;
        this.dataSource.data = response.result.data.odersDt;
        this.invoiceDataSource.data = response.result.data.invoice;
        if (this.orders.ordersList && this.orders.ordersList.length) {
          this.emptyOrdersData = false;
        } else {
          this.emptyOrdersData = true;
        }
        // this.orders.currency_type.currency_type = response.result.data.currency_type.currency_type;

        if (this.orders.invoicesList && this.orders.invoicesList.length) {
          this.emptyInvoiceData = false;
        } else {
          this.emptyInvoiceData = true;
        }
      }
    });
  }

  createOrder() {
    let toast: object;
    let dialogRef = this.dialog.open(CreateOrderComponent, {
      panelClass: "alert-dialog",
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("order_id", result.response);
        this.router.navigate(["/orders"]);
        let toast: object;
        toast = { msg: "Order Created Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  createPurchaseOrder() {
    let toast: object;
    let dialogRef = this.dialog.open(CreatePurchaseOrderComponent, {
      panelClass: "alert-dialog",
      width: "600px",
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("order_id", result.response);
        this.router.navigate(["/orders"]);
        let toast: object;
        toast = { msg: "Order Created Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  orderDetail(row) {
    // console.log(row)
    this.cookie.set("order_id", row.orders.id);
    this.router.navigate(["/orders", row.orders.id]);
  }

  invoiceDetail(row) {
    this.cookie.set("invoice_id", row.Inovice.id);
    this.router.navigate(["/invoices", row.Inovice.id]);
  }
  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate([
      "/orders",
      // 213
      data.id,
    ]);
    return;
  }
}
