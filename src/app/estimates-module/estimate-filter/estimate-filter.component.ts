import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AddContactComponent } from "../../dialogs/add-contact/add-contact.component";
import { MatDatepicker } from "@angular/material/datepicker";
import { FormControl } from "@angular/forms";
import moment = require("moment");

@Component({
  selector: "app-estimate-filter",
  templateUrl: "./estimate-filter.component.html",
  styleUrls: ["./estimate-filter.component.scss"],
})
export class EstimateFilterComponent implements OnInit {
  slectedStatus = new FormControl([]);
  slectedCountries = new FormControl([]);
  slectedCatogories = new FormControl([]);
  slectedClients = new FormControl([]);
  slectedPolicyProviders = new FormControl([]);
  slectedPolicyTypes = new FormControl([]);
  selectedCurrencies = new FormControl([]);
  selectedDuration = new FormControl();
  selectedInvoiceNumber = new FormControl([]);
  start_date = new Date(new Date().getFullYear(), 0, 1);
  end_date = new Date();
  public minDate = new Date();
  public showFields = {
    start_date: false,
    end_date: false,
    status: false,
    country: false,
    category: false,
    clients: false,
    policy_providers: false,
    policy_types: false,
    currency: false,
    duration: false,
  };
  constructor(
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // console.log(this.data, this.start_date)
    if (this.data.module == "conversion_rates") {
      this.start_date = new Date();
      if(this.data.filterParams.selectedDate) {
        this.start_date = new Date(this.data.filterParams.selectedDate);
      }
    }
    if(this.data.filterParams.startDate) {
      this.start_date = new Date(this.data.filterParams.startDate);
    }
    if(this.data.filterParams.endDate) {
      this.end_date = new Date(this.data.filterParams.endDate);
    }
    this.setFilterValues(
      this.data.filterParams.selectedStatuses,
      this.data.statusList,
      this.slectedStatus,
      "id"
    );
    this.setFilterValues(
      this.data.filterParams.countryIds,
      this.data.countries,
      this.slectedCountries,
      "id"
    );
    this.setFilterValues(
      this.data.filterParams.categoryIds,
      this.data.catagiries,
      this.slectedCatogories,
      "id"
    );
    this.setFilterValues(
      this.data.filterParams.selectedClients,
      this.data.clients,
      this.slectedClients,
      "id"
    );
    this.setFilterValues(
      this.data.filterParams.policyProviderIds,
      this.data.policyProvider,
      this.slectedPolicyProviders,
      "id"
    );
    this.setFilterValues(
      this.data.filterParams.policyTypeIds,
      this.data.policyType,
      this.slectedPolicyTypes,
      "id"
    );
    // this.setFilterValues(
    //   this.data.filterParams.selectedDuration,
    //   this.data.durations,
    //   this.selectedDuration,
    //   "id"
    // );

    this.selectedDuration = new FormControl(this.data.filterParams.selectedDuration)
    this.setFilterValues(
      this.data.filterParams.selectedCurrency,
      this.data.currency,
      this.selectedCurrencies,
      "id"
    );
    this.manipulateFilterFields();
  }
  manipulateFilterFields() {
    if (this.data.module == "orders" || this.data.module == "invoices") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        status: true,
        country: true,
      };
    } else if (this.data.module == "payments_received") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
      };
    }  else if (this.data.module == "payments_due") {
      this.showFields = {
        ...this.showFields,
        end_date: true,
      };
    } else if (this.data.module == "product_sales") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        category: true,
      };
    } else if (this.data.module == "inventory") {
      this.showFields = {
        ...this.showFields,
        category: true,
      };
    } else if (this.data.module == "shipments") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        clients: true,
      };
    } else if (this.data.module == "export_register") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        status: true,
      };
    } else if (this.data.module == "firc_report") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        country: true,
      };
    }  else if (this.data.module == "insurance_report") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        status: true,
        policy_providers: true,
        policy_types: true
      };
    }  else if (this.data.module == "forex_report") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        currency: true,
        clients: true,
        duration: true,
      };
    } else if (this.data.module == "conversion_rates") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
      };
    }  else if (this.data.module == "three_months_forex_report") {
      this.showFields = {
        ...this.showFields,
        start_date: true,
        end_date: true,
        currency: true,
        clients: true,
      };
    } 


    
    


    
  }
  filterchecboxes;
  public disableFilter = false;
  public endDateMax: any= ""
  datePickerChange(ev, field) {
    this.disableBtn = false;

    if(field == "start_date") {
      this.endDateMax = moment(ev.value).add(1, "days").toDate();
      console.log(ev)
    }
  }

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  getClientName(clientId: string, options): string {
    const client = options.find((client) => client.id === clientId);
    return client ? client.name : "";
  }

  removeClient(clientId: string, selectedList): void {
    this.disableBtn = false;
    const selectedClients = selectedList.value.filter((id) => id !== clientId);
    selectedList.setValue(selectedClients);
  }
  applyFilters() {
    const obj = {
      start_date: this.start_date,
      end_date: this.end_date,
      status: this.slectedStatus.value,
      countryIds: this.slectedCountries.value,
      catogory: this.slectedCatogories.value,
      clients: this.slectedClients.value,
      policyProviders: this.slectedPolicyProviders.value,
      policyType: this.slectedPolicyTypes.value,
      duration: this.selectedDuration.value,
      currency: this.selectedCurrencies.value
    };
    this.dialogRef.close({ success: true, selectedFilters: obj });
  }

  setFilterValues(
    selectedIds: any[],
    itemList: any[],
    control: any,
    key: string
  ): void {
    const selectedValues = [];
    itemList &&
      itemList.forEach((item) => {
        if (selectedIds && selectedIds.includes(item[key])) {
          selectedValues.push(item[key]);
          item.selected = true;
        }
      });
    control.setValue(selectedValues);
  }
  public disableBtn = true;
  selectionChanged() {
    this.disableBtn = false;
  }
}
