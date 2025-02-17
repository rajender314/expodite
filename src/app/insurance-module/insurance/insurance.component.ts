import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { language } from "../../language/language.module";
import { FormControl } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import { trigger, style, transition, animate } from "@angular/animations";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { CookieService } from "ngx-cookie-service";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Router } from "@angular/router";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { AddInsuranceComponent } from "../add-insurance/add-insurance.component";
import { OrdersService } from "../../services/orders.service";
import { MatTableDataSource } from "@angular/material/table";
import moment = require("moment");
import { LeadsService } from "../../leads/leads.service";
import { AdminService } from '../../services/admin.service';
declare var App: any;

@Component({
  selector: "app-insurance",
  templateUrl: "./insurance.component.html",
  styleUrls: ["./insurance.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger("insuranceAnimate", [
      transition(":enter", [
        style({ transform: "translateX(-100px)", opacity: 0 }),
        animate("500ms cubic-bezier(0.35, 1, 0.25, 1)", style("*")),
      ]),
    ]),
  ],
})
export class InsuranceComponent implements OnInit {
  public language = language;
  public images = Images;
  public showFilter = false;
  public disableFilter = false;
  totalSpinner: boolean;
  totalCount: any;
  public listCount = 0;
  adminUser: boolean;
  public clientPermission: any;
  public factoryPermission: boolean = true;
  public insurancePermission = false;
  public userDetails: any;
  downloadStatus: boolean;
  activeState: boolean;
  blockContent: boolean = true;
  filtersLoader = true;
  public open = false;
  searching: boolean;
  totalPages: number = 2500;
  fetchingData = true;
  public matSelectOpen = false;
  params = {
    pageSize: 12,
    page: 1,
    search: "",
  };

  private App = App;
  public multiActOrdersId = [];

  public formBuilderBatchList = new MatTableDataSource();
  // displayedColumns = ["policy_number", "mfd_date", "exp_date", "tot_qty", "status_name"];
  displayedColumns = [
    "policy_number",
    "policy_name",
    "policy_provider",
    "policy_type",
    "policy_end_date",
    "balance_amount",
    "coverage_amount",
  ];

  constructor(
    private titleService: Title,
    private router: Router,
    public dialog: MatDialog,
    private cookie: CookieService,
    private snackbar: SnakbarService,
    private OrdersService: OrdersService,
    private leadService: LeadsService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.titleService.setTitle(App["company_data"].insuranceTitle);
    this.userDetails = App.user_details;
    let permission: boolean;
    let profile: boolean;
    let insurance: boolean;
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
        case "insurance":
          if (value.selected === true) {
            insurance = true;
          } else {
            insurance = false;
          }
          break;
      }
    });
    this.insurancePermission = insurance;

    this.factoryPermission = true;
    this.clientPermission = profile;
    this.adminUser = admin_profile;

    this.downloadStatus = false;
    this.getOrdersList();
    this.orderFilterData();
  }
  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
    flag: "insurance",
  };
  public insurance = {
    packageStatus: "",
    data: [],
    status: [],
    shippingAddress: [],
    productsList: [],
    organizations: [],
    shipping_data: [],
    accountManagerList: [],
    expectedDeliveryDate: [
      {
        id: 1,
        name: "Expected Delivery Date",
        selected: false,
      },
    ],
  };
  public filterApplied = false;

  orderFilterData() {
    this.OrdersService.getOrderFilterData(this.param).then((response) => {
      if (response.result.success) {
        // this.insurances.statuses = response.result.data.statuses;
        // this.insurances.statuses.map(function (value) {
        //   value.selected = false;
        // });
        this.insurances.providerList = response.result.data.policy_provider;
        this.insurances.providerList.map(function (value) {
          value.selected = false;
        });

        this.insurances.typesList = response.result.data.policy_types;
        // this.insurance.selectedClients = response.result.data.organization;
        this.insurances.typesList.map(function (value) {
          value.selected = false;
        });
      }
    });
  }
  orderDetails(stepper: MatStepper, data: any) {
    this.router.navigate([
      "/insurance",
      // 213
      data.id,
    ]);
    return;
  }
  getPagams() {
    let data = {
      selectedType: this.insurances.selectedType.value,
      selectedManager: this.insurances.selectedProvider.value,
      search: this.params.search,
      pageSize: this.params.pageSize,
      page: this.params.page,
      sortBy: "",
      start_date: this.insurances.selectStartDate
        ? this.insurances.selectStartDate
        : "",
      end_date: this.insurances.selectedEndDate
        ? this.insurances.selectedEndDate
        : "",
    };

    // this.insurances.providerList.map(function (value) {
    //   console.log(value);
    //   if (value.selected) {
    //     data.selectedManager.push(value.name);
    //   }
    // });

    // this.insurances.typesList.map(function (value) {
    //   if (value.selected) {
    //     data.selectedType.push(value.name);
    //   }
    // });
    return data;
  }
  public pageNumber = false;
  getOrdersList(clearList?: any): void {
    if (clearList) {
      this.fetchingData = true;
    }
    const obj = this.getPagams();
    const params = {
      ...obj,
      name: "insurance",
      page: this.params.page,
      perPage: this.params.pageSize,
      search: this.params.search,
    };
    this.leadService.getGridList(params).then((response) => {
      this.fetchingData = false;
      this.filtersLoader = false;
      this.disableFilter = false;
      if (response.result.success) {
        if (clearList) {
          this.insurance.data = [];
        }
        // let data = response.result.data.totalordersDt;
        let data = response.result.data.total_data;
        this.totalCount = response.result.data?.total
          ? response.result.data.total
          : 0;

        this.listCount = data ? data.length : 0;
        data.map((res) => {
          this.insurance.data.push(res);
        });

        let res: any = [];
        this.insurance.data.map(function (item) {
          res.push(item);
        });
        this.formBuilderBatchList = res;
        this.searching = false;
      }
    });
  }

  public insurances: any = {
    data: [],
    status: [],
    providerList: [],
    typesList: [],
    selectedStatus: new FormControl([]),
    selectStartDate: "",
    selectedEndDate: "",
    selectedProvider: new FormControl([]),
    selectedType: new FormControl([]),
  };

  filterchecboxes;
  checkboxChange(data?: any, value?: any): void {
    data.selected = !data.selected;
    // const selectedCountriesLength = this.insurance.selectedCountry.value.length;
  }

  updateShowFilter() {
    const storedData = localStorage.getItem("Order-Filters");
    if (storedData) {
      const savedFilterData = JSON.parse(localStorage.getItem("Order-Filters"));

      const hasData = Object.values(savedFilterData).some(
        (value) => Array.isArray(value) && value.length > 0
      );

      // this.showFilter = hasData ? true : this.insurances.mfg_date ? true : false;
    } else {
      this.showFilter = false;
    }
  }

  updateFilter() {
    const selectedStatuscount = this.insurances.selectedStatus.value.length;

    this.filterchecboxes = selectedStatuscount;

    if (this.filterchecboxes != 0) {
      this.showFilter = true;
      this.disableFilter = false;
    } else {
      this.disableFilter = true;
    }
  }

  selectState() {
    this.activeState = true;
    this.updateShowFilter();
  }

  openStartCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  openEndCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  datePickerChange() {
    this.showFilter = true;
  }

  NumberChange(event) {
    this.showFilter = true;
  }
  userDetailsType() {
    if (this.userDetails.log_type == 1) {
      this.blockContent = true;
    } else {
      this.blockContent = false;
    }
  }

  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }

  clearFilterData() {
    this.showFilter = false;
    this.filterApplied = false;
    this.insurances.providerList?.map(function (value) {
      value.selected = false;
    });
    this.insurances.typesList?.map(function (value) {
      value.selected = false;
    });
    this.activeState = false;
    // this.orders.selectedClients = new FormControl([]);
    // this.getclientDocPermissions()
    this.insurances.selectedType.setValue([]);
    this.insurances.selectedProvider.setValue([]);
    this.insurances.selectStartDate = "";
    this.insurances.selectedEndDate = "";
    // this.selectedClientsChipsId = [];
    // this.selectedClientsChips = [];
    // this.orders.client_search = "";
    // this.orders.mfg_date = "";
    // this.getOrdersList(true);
    // this.orderFilterData();
    this.getOrdersList(true);
    this.showFilter = false;
  }

  applyFilterData() {
    this.filterApplied = true;
    let toast: object;
    this.params.page = 1;
    this.disableFilter = true;
    // this.showFilter = false;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrdersList(true);
      toast = { msg: "Filters Applied Successfully...", status: "success" };
      this.snackbar.showSnackBar(toast);
    }, 500);
  }
  getInsuranceList(clearList?: any): void {}

  InsuranceDetails(stepper: MatStepper, data: any) {
    this.router.navigate(["/po", data.id]);
    return;
  }

  loadMore(event) {
    (this.params.pageSize = event.perPage),
      (this.params.page = event.page),
      this.getOrdersList(true);
    this.getInsuranceList(true);
  }

  onScroll(): void {
    if (this.params.page < this.totalPages && this.totalPages != 0) {
      this.params.page++;
      this.getInsuranceList();
    }
  }

  addInsurance() {
    let dialogRef = this.dialog.open(AddInsuranceComponent, {
      panelClass: "alert-dialog",
      width: "1000px",
      data: {
        title: "Add",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        this.cookie.set("insurance", result.response.id);
        this.router.navigate(["/insurance", result.response.id]);
      }
    });
  }
  public timeout;
  searchInsurances(search: string, event?: any): void {
    this.params.search = search;
    this.params.page = 1;
    this.searching = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.getOrdersList(true);
    }, 1000);
  }
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id == clientId);
    return client ? client.name : "";
  }
  removeClient(clientId: string, selectedList): void {
    const selectedClients = selectedList.value.filter((id) => id !== clientId);
    selectedList.setValue(selectedClients);
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
}
