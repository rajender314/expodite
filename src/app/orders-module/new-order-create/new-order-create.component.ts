import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormArray, FormGroup } from "@angular/forms";
import { AdminService } from "../../services/admin.service";
import { OrganizationsService } from "../../services/organizations.service";
import { OrdersService } from "../../services/orders.service";
import { trigger, transition, style, animate } from "@angular/animations";
import { MatDialogRef } from "@angular/material/dialog";
import { LeadsService } from "../../leads/leads.service";
import { SnakbarService } from "../../services/snakbar.service";
import { Router } from "@angular/router";
declare var App: any;

@Component({
  selector: "app-new-order-create",
  templateUrl: "./new-order-create.component.html",
  styleUrls: ["./new-order-create.component.scss"],
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
export class NewOrderCreateComponent implements OnInit {
  productsForm: FormGroup;
  productsDynamicForm: FormGroup;
  public productItem: FormArray;
  public showError: boolean = false;
  public newClientadded: boolean = false;
  public newClient: boolean = false;
  public inClient: boolean = false;
  public showNoProdFound: boolean = false;
  public showBillingAddress: boolean = false;
  public createbtnDisabled: boolean = false;
  public isAddProduct: boolean = false;
  public discountPercent: number = 0;
  public createOrderIcon: string =
    App.base_url + "dashboard/assets/images/create-order.png";
  public newItemIcon: string =
    App.base_url + "dashboard/assets/images/new-plus.png";
  public freightamt: number = 0;
  public insuranceValue: number = 0;
  public fetchingData: boolean = false;
  public order = {
    selectedProducts: [],
    selectedProductsError: false,
    selectedBillingError: false,
    selectedShippingError: false,
    selectedNotifyError: false,
    clientAddress: [],
    companyAddress: [],
    notifyAddress: [],
    clientContacts: [],
    addressType: "",
    currency: "",
    inco_terms_id: 0,
  };
  public shippingAddressDetails = {};
  public billingAddressDetails = {};
  public notifyAddressDetails = {};
  public checkedArr: any = {};
  public clientAddressSame: any = [];
  public organizationDetails: Array<any> = [];
  public newClientid: any;
  public clientSelectedId;
  public productError: boolean = false;
  public discountError: boolean;

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<NewOrderCreateComponent>,
    private router: Router,
    private leadservice: LeadsService
  ) { }

  ngOnInit(): void { }

  public validationErrors: any = {
    selectedBillingError: false,
    selectedShippingError: false,
    productError: false,
    discountError: false,
    productselecterror: false,
  };
  validateAddress() {
    this.validationErrors = {
      selectedBillingError: false,
      selectedShippingError: false,
      productError: false,
      discountError: false,
      productselecterror: false,
    };
    let clientAddress = [];
    if (!this.productItem) {
      this.validationErrors.productError = true;
    }
    if (this.order.clientAddress.length) {
      clientAddress = this.order.clientAddress.filter(function (value) {
        if (value["selected"]) {
          return value["selected"];
        }
        return false;
      });
      if (!clientAddress.length) {
        this.validationErrors.selectedShippingError = true;
      } else {
        this.validationErrors.selectedShippingError = false;
      }
    } else if (!this.order.clientAddress.length) {
      this.validationErrors.selectedShippingError = false;
    }
    let companyAddress = [];
    if (this.order.companyAddress.length) {
      companyAddress = this.order.companyAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      if (!companyAddress.length) {
        this.validationErrors.selectedBillingError = true;
      } else {
        this.validationErrors.selectedBillingError = false;
      }
    } else if (!this.order.companyAddress.length) {
      this.validationErrors.selectedBillingError = false;
    }
    let notifyAddress = [];
    if (this.order.notifyAddress.length) {
      if (this.order.notifyAddress.length) {
        notifyAddress = this.order.notifyAddress.filter(function (value) {
          if (value["selected"]) {
            return true;
          }
          return false;
        });
      }
    }
    let selectedProducts = [];
    if (this.productItem) {
      this.productItem.value.map(function (value) {
        if (value.price && value.quantity && value.id) {
          selectedProducts.push({
            price: Number(value.price),
            quantity: Number(value.quantity),
            products_types_id: value.id,
          });
        }
      });
      this.order.selectedProducts = selectedProducts;

      if (!this.productItem) {
        this.validationErrors.productselecterror = true;
        this.validationErrors.productError = false;
      }

      if (this.productItem.value.length != selectedProducts.length) {
        setTimeout(() => {
          let scrollTag = document.querySelector(".error-msg");
          if (scrollTag) {
            scrollTag.scrollIntoView();
          }
        }, 1000);
      }
      if (!this.productItem.value.length) {
        this.validationErrors.productError = true;
      }
      if (this.productItem.value.length && !selectedProducts.length) {
        this.validationErrors.productselecterror = true;
      }
    } else {
      this.validationErrors.productError = false;
      this.validationErrors.discountError = false;
    }

    if (this.discountError) {
      setTimeout(() => {
        let scrollTag = document.querySelector(".scroll-error");
        if (scrollTag) {
          scrollTag.scrollIntoView();
        }
      }, 1000);
    }
    this.leadservice.formValidationErrors.next(this.validationErrors);
    return !(
      this.validationErrors.selectedBillingError ||
      this.validationErrors.selectedShippingError ||
      this.validationErrors.productError ||
      this.validationErrors.discountError ||
      this.validationErrors.productselecterror
    ); // NOR operator
  }
  createOrderConfirm() {
    if (this.validateAddress()) {
      this.createbtnDisabled = true;
      this.fetchingData = true;

      let clientAddress = this.order.clientAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      let companyAddress = this.order.companyAddress.filter(function (value) {
        if (value["selected"]) {
          return true;
        }
        return false;
      });
      let notifyAddress = [];
      if (this.order.notifyAddress.length) {
        notifyAddress = this.order.notifyAddress.filter(function (value) {
          if (value["selected"]) {
            return true;
          }
          return false;
        });
      }
      this.OrdersService.createOrder({
        organization_id:
          App.user_details.log_type == "2"
            ? App.user_details.org_id
            : !this.newClientadded
              ? this.productsForm.controls.storeCustomAttributes.value[0]
                .organization_id
              : this.newClientid,
        org_address_bill_id: companyAddress.length
          ? companyAddress[0].org_address_bill_id
          : "",
        company_shipping_id: clientAddress.length
          ? clientAddress[0].org_address_bill_id
          : "",
        org_notify_addr_id: notifyAddress.length
          ? notifyAddress[0].org_address_bill_id
          : null,
        special_instructions:
          this.productsForm.controls?.special_instructions?.value,
        email: this.productsForm.controls.storeCustomAttributes.value[0].email,
        phone: this.productsForm.controls.storeCustomAttributes.value[0].phone,
        ext: this.productsForm.controls.storeCustomAttributes.value[0].ext,
        kindAttn:
          this.productsForm.controls.storeCustomAttributes.value[0].kindAttn,
        delivery_date:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .delivery_date,
        productArr: this.order.selectedProducts,
        client_new: this.newClient ? true : false,
        is_order: true,
        inco_terms_id:
          this.order.inco_terms_id ||
          this.productsForm.controls.storeCustomAttributes.value[0]
            .inco_terms_id,
        transport_id:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .transport_id,
        customer_notes:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .customer_notes,
        terms_cond_des:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .terms_conditions,
        discount: this.discountPercent,
        account_manager:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .account_manager,
        other_delivery_terms:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .other_delivery_terms?.value,
        freight: this.freightamt,
        insurance: this.insuranceValue,
        port_of_loading:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .port_of_loading,
        port_of_discharge:
          this.productsForm.controls.storeCustomAttributes.value[0]
            .port_of_discharge,
        final_destination:
          this.productsForm.controls.storeCustomAttributes?.value[0]
            ?.final_destination,
        payment_terms:
          this.productsForm.controls.storeCustomAttributes?.value[0]
            ?.payment_terms,
      }).then((response) => {
        if (response.result.success) {
          this.createbtnDisabled = false;
          this.fetchingData = false;
          this.dialogRef.close({
            success: true,
            response: response.result.data.id,
          });
          this.router.navigate(["/orders", response.result.data.id]);
        } else {
          let toast: object;
          this.dialogRef.close({ success: false });
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      return;
    }
  }
  public moduleName = ""
  formEmitEvent(obj: any) {
    this.moduleName = obj.module;
    this.productsForm = obj.form;
  }
}
