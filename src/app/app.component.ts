import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  RouterModule,
  NavigationStart,
  NavigationEnd,
} from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { language } from "./language/language.module";
import { ViewEncapsulation } from "@angular/core";
import { CreateOrderComponent } from "./dialogs/create-order/create-order.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { SnakbarService } from "./services/snakbar.service";
import { CookieService } from "ngx-cookie-service";
import { AdminService } from "./services/admin.service";
import { filter, map } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { NavigationServiceService } from "./services/navigation-service.service";

declare var App: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [CookieService],
})
export class AppComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;
  @ViewChild("menu", { static: true }) public menu: any;

  public language = language;
  private updateOrderList = [];
  public leftNav = {
    overview: true,
    contactMainView: true,
    estimates: true,
    orders: true,
    invoices: true,
    reports: true,
    clients: true,
    "My Profile": true,
    inventory: true,
    insurance: true,
    users: true,
    admin: true,
    superAdmin: true,
    order: true,
    vendors: true,
  };
  title: string = "Dashboard";
  public userDetails: any;
  public userImage: any;
  myProfile = true;
  public clientProfile: Array<any>;

  private headerLogo: string =
    App.public_url + "signatures/assets/images/ksm-662.png";
  public brandLogo: string = App.public_url + App["company_data"].menuIcon; //'signatures/assets/images/Logo-Hexponent-menu.svg';
  private overViewIcon: string =
    App.public_url + "signatures/assets/images/overview.svg";
  private ordersIcon: string =
    App.public_url + "signatures/assets/images/orders.svg";
  private invoicesIcon: string =
    App.public_url + "signatures/assets/images/invoice.svg";
  private reportsIcon: string =
    App.public_url + "signatures/assets/images/reports.svg";
  private clientsIcon: string =
    App.public_url + "signatures/assets/images/clients.svg";
  private vendorsIcon: string =
    App.public_url + "signatures/assets/images/vendor.svg";
  private inventoryIcon: string =
    App.public_url + "signatures/assets/images/inventory.svg";
  private usersIcon: string =
    App.public_url + "signatures/assets/images/users-icon.svg";
  private adminIcon: string =
    App.public_url + "signatures/assets/images/admin.svg";
  private plusIcon: string =
    App.public_url + "signatures/assets/images/add-square-button.svg";
  public placeholderIcon: string =
    App.public_url + "signatures/assets/images/user-icon.jpg";
  public contactsIcon: string =
    App.public_url + "signatures/assets/images/svg0.svg";

  public profileImage: string = App.loggedAs.profile_image_url;
  public ENVDATA: any;
  public firstName = "";
  public lastName = "";
  public isAdminScreen;
  private lastUnloadTime: number;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private cookie: CookieService,
    private snackbar: SnakbarService,
    public adminService: AdminService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private historyService: NavigationServiceService


  ) {
    window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
    window.addEventListener("load", this.onLoad.bind(this));
  }

  private onBeforeUnload(event: BeforeUnloadEvent) {
    localStorage.setItem("loadTime", new Date().getTime().toString());
  }

  private onLoad(event: Event) {
    this.lastUnloadTime = parseInt(localStorage.getItem("loadTime") || "0");
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - this.lastUnloadTime;
    if (elapsedTime > 30000 && this.lastUnloadTime != 0) {
      // window.location.href = App.base_url + "do-logout";
      localStorage.removeItem("loadTime");
    } else {
      localStorage.removeItem("loadTime");
    }
  }
  ngOnInit() {
    const path = window.location.pathname
    const parts = path.split("/").filter(Boolean);
    if(parts.length == 1) {
      this.adminService.setModuleId(parts[0])
    }
    this.adminService.getUserPermissionsApi();

    this.adminService.getPermissions().subscribe(() => {
      this.getEnvConfig();
    })
    // console.log(this.adminService)
    this.userDetails = App.user_details;
    this.userImage = App.loggedAs;
    this.getLeftNav();
    let profile: boolean;
    setTimeout(() => {
      App.user_roles_permissions.map(function (val) {
        if (val.code == "client_interface") {
          if (val.selected) {
            profile = true;
          } else {
            profile = false;
          }
        }
      });
      this.myProfile = profile;
    }, 1000);
    // this.checkClientProfilePermission();

    // console.log(App.user_details)
    if (App.user_details) {
      this.firstName = App.user_details.firstname;
      this.lastName = App.user_details.lastname;
    }

    this.adminService.loggedUserEmail = this.userDetails.email;
    //   console.log(this.adminService.loggedUserEmail)
    this.onResize({});
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // console.log(event.url);
        if (this.isAdminScreen) {
          this.showToggleMenu = true;
        } else {
          this.showToggleMenu = false;
        }
        this.isAdminScreen = event.url.match("admin") ? true : false;
      });

  }


  ngonChanges() {
    this.adminService.getBlue().subscribe(x => {
			console.log(212)
	
		  }) 
  }
  getLeftNav() {
    let me = this;
    App.user_roles_permissions.map(function (value) {
      me.leftNav[value.code] = value.selected;
      // console.log(value.user_roles_permissions.name)
    });
  }

  routePath(route, routepath) {
    // console.log(route, routepath)

    this.router.navigate(["/" + routepath]);
  }
  getEnvConfig() {
    let param = {};
    this.adminService.getEnvDetails(param).then((res) => {
      if (res["result"].success) {
        this.ENVDATA = res.result.data.env_config;
        this.authService.setEnvConfig(this.ENVDATA);
        this.adminService.instanceName = res.result.data.instance_name;
        this.brandLogo = res.result.data.logo_url;
        this.adminService.appFnvironment = res.result.data.app_environment;
        this.adminService.manageAccount = res.result.data.manage_account || "";

        // console.log(res);
      }
    });
  }

  toggleSideNav() {
    this.sidenav.toggle();
  }
  ordersPage() {
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate(["/orders"]);
  }
  estimatesPage() {
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate(["/estimates"]);
  }
  contactsPage() {
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate(["/contactMainView"]);
  }
  invoicePage() {
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate(["/invoices"]);
  }
  inventoryPage() {
    const config = this.router.config.map((route) => Object.assign({}, route));
    this.router.resetConfig(config);
    this.router.navigate(["/inventory"]);
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
        toast = { msg: "Order created successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  goToModule(obj) {
    this.router.navigate([`/${obj.routerlink}`]);
    this.adminService.setModuleId(obj.id)
    // this.adminService.getUserPermissionsApi();

  }
  logout(): void {
    window.location.href = App.base_url + "do-logout";
    localStorage.removeItem("poFilters");
    localStorage.removeItem("Order-Filters");
    localStorage.removeItem("PFI-Filters");
    localStorage.removeItem("loadTime");
  }
  goToChangePwd() {
    this.router.navigate(["/change-password"]);

  }

  showSubMenu = false;
  showToggleMenu = false;
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    // console.log(window.innerWidth);
    if (window.innerWidth < 1200) {
      this.showSubMenu = true;
      this.showToggleMenu = false;
    } else {
      this.showSubMenu = false;
      this.showToggleMenu = true;
    }
  }
}
