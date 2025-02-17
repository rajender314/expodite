import { MatTableDataSource } from "@angular/material/table";
import { AdminService } from "./../../services/admin.service";
import { MatDialog } from "@angular/material/dialog";
import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { SnakbarService } from "../../services/snakbar.service";
import { FormBuilder, Validators } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import * as moment from "moment";
import { AddCurrencyConversionComponent } from "./add-currency-conversion/add-currency-conversion.component";
import { Images } from "../../images/images.module";
import { EstimateFilterComponent } from "../../estimates-module/estimate-filter/estimate-filter.component";

@Component({
  selector: "app-conversion-rates",
  templateUrl: "./conversion-rates.component.html",
  styleUrls: ["./conversion-rates.component.scss"],
})
export class ConversionRatesComponent implements OnInit {
  @ViewChild("myInput") inputEl: ElementRef;
  displayedColumns = [];
  public exchRates = new MatTableDataSource();
  public allowApiRequest = false;
  public today = new Date();
  public editExchRateFlag = false;
  public curr_edit: boolean = false;
  public toDayDate = new Date();

  updated_on: any;
  edit_id: any;
  apiData: any;
  public images = Images;
  gridParams = {};

  constructor(
    public adminService: AdminService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.adminService.getPermissions().subscribe((res) => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    });
    this.gridParams["selectedDate"] = moment(this.toDayDate).toLocaleString();
    this.getIcegateExchRates();
    if(this.adminService.rolePermissions.edit_conversion_rates == 1) {
      this.displayedColumns = ["from", "value", "to", "edit"];
      console.log(this.adminService.rolePermissions.edit_conversion_rates)
    } else {
      this.displayedColumns = ["from", "value", "to"];
      console.log(this.adminService.rolePermissions.edit_conversion_rates)

    }
  }

  getIcegateExchRates(): void {
    this.adminService
      .icegateExchRateApi(this.gridParams)
      .then((response) => {
        if (response.result.success) {
          this.apiData = response.result.data;
          this.exchRates = response.result.data.exchDetails;
          this.updated_on = response.result.data.updated_on;
        }
      })
      .catch((error) => console.log(error));
  }

  onKeyUp(event) {
    // console.log(event)
    var inputKeyCode = event.keyCode ? event.keyCode : event.which;

    if (inputKeyCode != null) {
      if (inputKeyCode == 45) event.preventDefault();
    }
    if (event.target.value.length > 5) {
      event.preventDefault();
    }
    if (event.key != "Tab") {
      this.allowApiRequest = true;
    }
  }

  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }

  public extErrorMsg = false;
  public converionId = false;
  onValueChanges(conversion, event) {
    this.converionId = conversion.id;

    var numbers = /^[0-9.]*$/;
    if (event.target.value != "" && !event.target.value.match(numbers)) {
      this.extErrorMsg = true;
      let toast = { msg: "Please enter valid value", status: "error" };
      this.snackbar.showSnackBar(toast);
      //  alert('Your Registration number has accepted....');
    } else {
      this.extErrorMsg = false;
    }
    if (this.allowApiRequest && !this.extErrorMsg) {
      let param = {
        id: conversion.id,
        value: event.target.value,
      };

      this.adminService
        .updateConvRates(param)
        .then((response) => {
          if (response.result.success) {
            this.allowApiRequest = false;
            let toast = { msg: response.result.message, status: "success" };
            this.snackbar.showSnackBar(toast);
          } else {
            let toast = { msg: response.result.message, status: "error" };
            this.snackbar.showSnackBar(toast);
          }
        })
        .catch((error) => console.log(error));
    }
  }

  addCurrencyConversion() {
    let dialogref = this.dialog.open(AddCurrencyConversionComponent, {
      width: "800px",
      data: { exchRates: this.exchRates },
    });
    dialogref.afterClosed().subscribe((response) => {
      if (response.success) {
        this.getIcegateExchRates();
        let toast = {
          msg: "Currency Exchange Rate Added Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  editExchRate(data) {
    this.curr_edit = true;
    this.edit_id = data;
    this.editExchRateFlag = true;
    let dialogref = this.dialog.open(AddCurrencyConversionComponent, {
      width: "800px",
      data: {
        exchRates: this.exchRates,
        curr_edit: this.curr_edit,
        edit_id: this.edit_id,
      },
    });
    dialogref.afterClosed().subscribe((response) => {
      if (response.success) {
        this.getIcegateExchRates();
        let toast = {
          msg: "Currency Exchange Rate Updated Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  clearFilters(e): void {
    e.stopPropagation();
    this.gridParams["selectedDate"] = "";

    this.filterCount = "";
  }
  public filterCount: any = "";
  openFilters() {
    let dialogRef = this.dialog.open(EstimateFilterComponent, {
      width: "20%",
      height: "100vh",
      position: { right: "0" },
      disableClose: true,
      data: { module: "conversion_rates", filterParams: this.gridParams },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.success) {
        this.filterCount = 1;
        this.gridParams["selectedDate"] = moment(
          res.selectedFilters.start_date
        ).toLocaleString();
        this.getIcegateExchRates();
        let toast = {
          msg: "Filters Applied Successfully",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
