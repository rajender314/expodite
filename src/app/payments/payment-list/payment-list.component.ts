import { trigger, transition, style, animate } from "@angular/animations";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { PaymentsService } from "../../services/payments-service.service";
import { MatTableDataSource } from "@angular/material/table";
import { Images } from "../../images/images.module";
import { MatDialog } from "@angular/material/dialog";
import { AddPaymentsComponent } from "../add-payments/add-payments.component";
import { Router } from "@angular/router";
import { MatStepper } from "@angular/material/stepper";
import { OrdersService } from "../../services/orders.service";
import { FormControl } from "@angular/forms";
import { language } from "../../language/language.module";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDatepicker } from "@angular/material/datepicker";
import { AdminService } from "../../services/admin.service";

import moment = require("moment");
import { Z } from "@angular/cdk/keycodes";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-payment-list",
  templateUrl: "./payment-list.component.html",
  styleUrls: ["./payment-list.component.scss"],
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
export class PaymentListComponent implements OnInit {
  params = {
    pageSize: 12,
    page: 1,
    search: "",
  };
  fetchingData = true;
  public open = false;
  public images = Images;
  public totalSpinner = false;
  filtersLoader = true;
  private param: any = {
    page: 1,
    perPage: 12,
    sort: "ASC",
    search: "",
    flag: "payments",
  };
  public payments = {
    data: [],
    status: [],
    currencyList: [],
    clientList: [],
    selectedStatus: new FormControl([]),
    selectStartDate: "",
    selectedCurrency: new FormControl([]),
    selectedClients: new FormControl([]),
    mfg_date: "",
  };
  matSelectOpen: boolean;
  public language = language;
  filterApplied: boolean = false;
  filterchecboxes: any;
  disableFilter: boolean;
  activeState: boolean;
  once: boolean = true;

  constructor(
    private paymentsService: PaymentsService,
    public dialog: MatDialog,
    private router: Router,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private titleService: Title,
    public adminService: AdminService
  ) {
    this.titleService.setTitle("Expodite - Payments");
  }

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.paymentsFilterData();
    this.getOrdersList();
    const storedData = localStorage.getItem("payments-Filters");
    if (!storedData) {
      this.getOrdersList(true);
    }
  }
  navigateToShipment(orderId: number, shipmentId: number, invoiceNo: string) {
    this.router.navigate(["/orders", orderId, "shipments", shipmentId], {
      state: { source: "payments" },
    });
  }
  getPagams() {
    // if (this.filterApplied === true) {
    let data = {
      selectedStatus: this.payments.selectedStatus.value,
      selectedCurrency: this.payments.selectedCurrency.value,
      selectedClients: this.payments.selectedClients.value,
      search: this.params.search,
      pageSize: this.params.pageSize,
      page: this.params.page,
      // manifacture_date: this.payments.mfg_date
      //   ? moment(this.payments.mfg_date).format("YYYY-MM-DD")
      //   : "",
      manifacture_date: this.payments.mfg_date ? this.payments.mfg_date : "",
      sortBy: "",
      // start_date: this.insurances.selectStartDate
      //   ? moment(this.insurances.selectStartDate).format("DD-MM-YYYY")
      //   : "",
      // end_date: this.insurances.selectedEndDate
      //   ? moment(this.insurances.selectedEndDate).format("DD-MM-YYYY")
      //   : "",
    };
    // if (this.payments.mfg_date == "") {
    //   data.manifacture_date = "";
    // } else {
    //   data.manifacture_date = moment(this.payments.mfg_date).format(
    //     "YYYY-MM-DD"
    //   );
    // }
    // }
    // return data;

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
  public totalCount = 0;
  public formBuilderBatchList = new MatTableDataSource();
  searching: boolean;
  public orders = {
    data: [],
  };
  public listCount = 0;
  public showFilter = false;
  getOrdersList(clearList?: any): void {
    const obj = this.getPagams();
    const params = {
      ...obj,
      name: "payments",
      page: this.params.page,
      perPage: this.params.pageSize,
      search: this.params.search,
    };
    this.paymentsService.getGridList(params).then((response) => {
      this.fetchingData = false;
      this.filtersLoader = false;

      if (response.result.success) {
        this.orders.data = [];
        // let data = response.result.data.totalordersDt;
        let data = response.result.data.total_data;
        this.totalCount =
          response.result.data.total || response.result.data.count;
        this.listCount = response.result.data
          ? response.result.data["per_page_total"]
          : 0;
        data.map((res) => {
          this.orders.data.push(res);
        });

        let res = [];
        this.orders.data.map(function (item) {
          var existItem = res.find((x) => x.date == item.date);
          if (existItem) {
            res.forEach((item2) => {
              if (item2.date == item.date) {
                item2.list = item2.list.concat(item.list);
              }
            });
          } else {
            res.push(item);
          }
        });
        this.orders.data = res;

        this.searching = false;
        if (this.once) {
          this.preFillFiltersData();
          this.once = false;
        }
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
      const savedFilterData = JSON.parse(
        localStorage.getItem("payments-Filters")
      );
      if (savedFilterData) {
        savedFilterData["client_search"] = this.params.search;
        localStorage.setItem(
          "payments-Filters",
          JSON.stringify(savedFilterData)
        );
      } else {
        localStorage.setItem(
          "payments-Filters",
          JSON.stringify({ client_search: this.params.search })
        );
      }
    }, 1000);
  }
  addInsurance() {
    let dialogRef = this.dialog.open(AddPaymentsComponent, {
      panelClass: "alert-dialog",
      width: "1000px",
      data: {
        title: "Add",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.getOrdersList();
      }
    });
  }
  loadMore(event) {
    (this.params.pageSize = event.perPage),
      (this.params.page = event.page),
      this.getOrdersList(true);
  }
  paymentDetails(stepper: MatStepper, data: any) {
    this.router.navigate(["/payments", data.id]);
    return;
  }
  paymentsFilterData() {
    this.OrdersService.getOrderFilterData(this.param).then((response) => {
      if (response.result.success) {
        this.payments.status = response.result.data.status;
        this.payments.status &&
          this.payments.status.map(function (value) {
            value.selected = false;
          });
        this.payments.clientList = response.result.data.client;
        this.payments.clientList &&
          this.payments.clientList.map(function (value) {
            value.selected = false;
          });
        this.payments.currencyList = response.result.data.currency;
        this.payments.currencyList &&
          this.payments.currencyList.map(function (value) {
            value.selected = false;
          });
      }
    });
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.name : "";
  }
  openedChange(opened: boolean) {
    this.matSelectOpen = opened ? true : false;
  }
  clientChange() {
    this.showFilter = true;
  }
  removeClient(clientId: string): void {
    const selectedClients = this.payments.selectedClients.value.filter(
      (id) => id !== clientId
    );
    this.payments.selectedClients.setValue(selectedClients);
  }
  removestatus(clientId: string): void {
    const selectedStatus = this.payments.selectedClients.value.filter(
      (id) => id !== clientId
    );
    this.payments.selectedClients.setValue(selectedStatus);
  }
  removeCurreny(clientId: string): void {
    const selectedCurrency = this.payments.selectedCurrency.value.filter(
      (id) => id !== clientId
    );
    this.payments.selectedCurrency.setValue(selectedCurrency);
  }
  preFillFiltersData(): void {
    const storedData = localStorage.getItem("payments-Filters");
    if (!storedData) {
      return;
    }

    const parsedData = JSON.parse(storedData);
    if (parsedData.selectedCurrency && parsedData.selectedCurrency.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedCurrency,
        this.payments.currencyList,
        this.payments.selectedCurrency,
        "id"
      );
    }
    if (parsedData.selectedClients && parsedData.selectedClients.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedClients,
        this.payments.clientList,
        this.payments.selectedClients,
        "id"
      );
    }

    if (parsedData.selectedStatus && parsedData.selectedStatus.length > 0) {
      this.showFilter = true;
      this.setFilterValues(
        parsedData.selectedStatus,
        this.payments.status,
        this.payments.selectedStatus,
        "id"
      );
    }

    if (parsedData.created_date && parsedData.created_date != "") {
      this.showFilter = true;
      this.payments.mfg_date = parsedData.created_date;
    }
    if (parsedData.client_search && parsedData.client_search != "") {
      this.params.search = parsedData.client_search;
    }
    this.filterApplied = true;
    // this.getOrdersList(true);
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
  clearFilterData() {
    this.showFilter = false;
    this.filterApplied = false;
    // this.payments.selectedClients.map(function (value) {
    //   value.selected = false;
    // });
    this.activeState = false;
    this.payments.selectedClients.setValue([]);
    this.payments.selectedCurrency.setValue([]);
    this.payments.selectedStatus.setValue([]);
    this.payments.mfg_date = "";
    this.params.page = 1;
    this.paymentsFilterData();
    this.getOrdersList(true);
    this.saveFiltersData();
  }
  updateShowFilter() {
    this.showFilter = true;
    const storedData = localStorage.getItem("payments-Filters");
    if (storedData) {
      const savedFilterData = JSON.parse(
        localStorage.getItem("payments-Filters")
      );
      const hasData = Object.values(savedFilterData).some(
        (value) => Array.isArray(value) && value.length > 0
      );
      // this.showFilter = hasData ? true : this.orders.mfg_date ? true : false;
    } else {
      this.showFilter = false;
    }
  }
  saveFiltersData() {
    const data = {
      selectedCurrency: this.payments.selectedClients.value,
      selectedStatus: this.payments.selectedStatus.value,
      selectedClients: this.payments.selectedClients.value,
      // selectedCountry: this.orders.selectedCountry.value,
      client_search: this.params.search,
      created_date: this.payments.mfg_date,
    };
    console.log(this.payments, "created_date");
    localStorage.setItem("payments-Filters", JSON.stringify(data));
  }
  checkboxChange(data: any): void {
    data.selected = !data.selected;
    this.updateShowFilter();
    this.updateFilter();
  }
  updateFilter(name?): void {
    const selectedClientsCount = this.payments.selectedClients.value.length;
    const selectedCurrencyCount = this.payments.selectedCurrency.value.length;
    const selectedStatuscount = this.payments.selectedStatus.value.length;
    // const selectedExpctcount = this.orders.selectExpectdate.value.length;
    this.filterchecboxes =
      selectedClientsCount + selectedStatuscount + selectedCurrencyCount;
    if (this.filterchecboxes != 0 || this.payments.mfg_date) {
      this.showFilter = true;
      this.disableFilter = false;
    } else {
      this.disableFilter = true;
    }
  }
  applyFilterData() {
    this.filterApplied = true;
    this.params.page = 1;
    // this.searching = true;
    let toast: object;
    toast = { msg: " Filters Applied Successfully.", status: "success" };
    this.getOrdersList(true);
    this.snackbar.showSnackBar(toast);
    this.saveFiltersData();
    this.updateShowFilter();
    this.pageNumber = !this.pageNumber;
  }
  datePickerChange() {
    this.showFilter = true;
    this.updateFilter();
  }
}
