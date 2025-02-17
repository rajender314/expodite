import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { AddressComponent } from "../../dialogs/address/address.component";
import { UtilsService } from "../../services/utils.service";
import { LeadsService } from "../../leads/leads.service";
import { AddLineItemComponent } from "../../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../dialogs/delete-line-item/delete-line-item.component";
declare var App: any;

@Component({
  selector: "app-customs-pricing",
  templateUrl: "./customs-pricing.component.html",
  styleUrls: ["./customs-pricing.component.scss"],
})
export class CustomsPricingComponent implements OnInit, OnChanges {
  // @Input() invoiceDetails: any;
  originalInvoiceData: any = {};
  @Input() orderId: any;
  // @Input() packageDetails: any;
  @Input() originFileAttachments: any;
  @Input() ordersInfo: any;
  @Input() editClosePOPup;
  @Input() viewActivityLogIcon;
  @Input() viewExcelIcon;
  @Input() invoiceData: any;
  @Input() invId: any;
  @Input() currency_conversion;
  @Input() currency_type;
  @Input() order_Permissions;
  @Input() isEditPermission;
  @Output() updateInv: any = new EventEmitter();
  @Output() generateSubTotals: any = new EventEmitter();
  @Output() getOrderDocuments: any = new EventEmitter();
  @ViewChild("commercialInvEditInput") commercialInvEditInput: ElementRef;
  @ViewChild("billTextarea1") billTextarea1: ElementRef;
  @ViewChild("notifyTextarea1") notifyTextarea1: ElementRef;
  @ViewChild("shipTextarea1") shipTextarea1: ElementRef;
  @ViewChild("notifyTextarea2") notifyTextarea2: ElementRef;
  @Input() com_inv_id;
  public images = Images;
  private stopgetEditedCall: boolean = false;
  public PrintIcon: string =
    App.public_url + "signatures/assets/images/printer-tool.svg";
  editCommercialSate: any;
  updatedCommercialFreight: any;
  updatedCommercialValueinsurance: any;
  UpdateCommercialPriceValue: any;
  editStateUpdate: boolean;
  editFreightState: boolean;
  editDescountState: boolean;
  initialValues: string;
  editExtraCol;
  timestamp: number;
  // snackbar: any;

  constructor(
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private utilsService: UtilsService,
    private service: LeadsService
  ) {}

  ngOnInit() {
    this.originalInvoiceData = JSON.parse(JSON.stringify(this.invoiceData)); // Save the original invoice data
    // this.getPaymentInfo();
    // this.show_edit = this.invoiceData?.customs_invoice[0]?.show_edit;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.show_edit = !this.order_Permissions.disable_edit_customs_invoice;
    this.originalInvoiceData = JSON.parse(JSON.stringify(this.invoiceData));
    if (this.editClosePOPup) {
      this.closeEditcommercial();
    }
  }
  isCursorCustom = true;

  onMouseEnter() {
    this.isCursorCustom = true;
  }

  onMouseLeave() {
    this.isCursorCustom = false;
  }
  timeoutId;
  numaricChange(e: any, type: string, index?: number) {
    let numberRegex = /[0-9.]/g;

    if (numberRegex.test(e.key) || e.key == "Backspace" || e.key == "Delete") {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        let { value } = e.target;
        if (type === "rate_per_uom") {
          this.invoiceData.package_products[index][type] = value;
        } else if (type === "add_line_items") {
          this.invoiceData[type][index].value = value;
        } else {
          this.invoiceData[type] = value;
        }
        // this.saveCommercialEdit(this.invoiceData);
      }, 500);
    }
  }
  editCommercial(type, productId?) {
    this.getOrgStoreAttribute();
    this.isCursorCustom = false;
    this.invoiceData = JSON.parse(JSON.stringify(this.originalInvoiceData));
    // this.invoiceData.add_line_items = JSON.parse(
    //   JSON.stringify(this.originalInvoiceData.add_line_items)
    // );

    setTimeout(() => {
      if (type === "insurance") {
        this.editDescountState = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
        this.editStateUpdate = true;
      } else if (type === "freight") {
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editCommercialSate = null;
        this.editFreightState = true;
        this.editExtraCol = null;
      } else if (type === "discount") {
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
        this.editDescountState = true;
        this.editExtraCol = null;
      } else if (type === "price") {
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editExtraCol = null;
        this.editCommercialSate = productId;
      } else if (type === "extra_col") {
        this.editCommercialSate = null;
        this.editFreightState = false;
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editExtraCol = productId;
      }
      setTimeout(() => {
        this.commercialInvEditInput.nativeElement.focus();
      }, 100);
    }, 200);
  }
  public moduleName = "";
  saveCommercialEdit(msg, typeId, product?: any) {
    // localStorage.setItem("moduleName", "subtotal_form");
    this.moduleName = "subtotal_form";

    if (product && product.rate_per_uom == 0) {
      let toast: object;
      toast = {
        msg: "Rate per UOM should be greater than zero",
        status: "error",
      };
      this.snackbar.showSnackBar(toast);
      return;
    }
    this.clickedIconId = typeId;
    this.updateinvoice(this.invoiceData, msg);
  }
  closeEditcommercial(type?: any) {
    // this.editCommercialSate.delete(type);

    setTimeout(() => {
      this.editStateUpdate = false;
      this.editDescountState = false;
      this.editFreightState = false;
      this.editExtraCol = null;
      this.invoiceData = JSON.parse(JSON.stringify(this.originalInvoiceData)); // Restore the original invoice data
      // this.invoiceData.add_line_items = JSON.parse(
      //   JSON.stringify(this.originalInvoiceData.add_line_items)
      // );
      // this.editCommercialSate = null;
    }, 100);
  }
  showDiv: boolean = true;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  captureInitialValue(event: FocusEvent, field: number) {
    const target = event.target as HTMLTextAreaElement;
    this.initialValues = target.value;
  }

  ngAfterViewChecked(): void {}

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
          // this.getAttributesPrefillData();
        }
      })
      .catch((error) => console.log(error));
  }
  async updateinvoice(data, msg?: any) {
    let param = {
      form_data: {
        insurance: data.subtotal_form[0].totals?.insurance.value,
        discount: data.subtotal_form[0].totals?.discount.value,
        freight: data.subtotal_form[0].totals?.freight.value,
      },
      id: data.subtotal_form[0].id,
      organization_id: this.invId,
      module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      moduleName: this.moduleName,
    };
    let toast: object;

    this.utilsService.saveStoreAttribute(param).then((response) => {
      if (response.success) {
        // this.generateSubTotals.emit({
        //   type: "edit_product_in_commercial_inv",
        //   id: this.invId,
        // });

        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
        let toast: object;
        toast = {
          msg: `${msg} Updated Successfully`,
          status: "success",
        };

        setTimeout(() => {
          this.originalInvoiceData = JSON.parse(
            JSON.stringify(this.invoiceData)
          );
        }, 100);
        this.snackbar.showSnackBar(toast);
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
      } else {
        this.snackbar.showSnackBar({
          msg: response.message,
          status: "error",
        });
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
      }
    });
  }
  openActivityModal(type): void {
    this.closeEditcommercial();
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        module: type,
        id: this.invId,
      },
    });
  }
  public invoice_status;
  public show_edit = true;

  paidInvoice() {
    this.closeEditcommercial();
    let dialogRef = this.dialog.open(MarkAsPaidComponent, {
      width: "700px",
      data: {
        orders_id: this.orderId || "",
        invoice_id: this.invId,
        invoiceData: this.invoiceData,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        // this.getPaymentInfo();
        let toast: object;
        toast = { msg: "Payment Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  public clickedIconId = null;

  onBlur(event: FocusEvent, productId: any): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (this.clickedIconId === productId || this.clickedIconId === "edit") {
      this.clickedIconId = null; // Reset the flag
      return;
    }
    this.closeEditcommercial();
  }
  removeCommasHandler(event: any) {
    event.target.value = event.target.value.replace(/,/g, "");
  }
  triggerGridEvent(ev) {
    if (ev.editdone) {
      if (ev.tableName == "customsInvoice") {
        // this.generateSubTotals.emit({
        //   type: "edit_product_in_customs_inv",
        //   id: this.invId,
        // });
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
      }
    }
  }

  updateAddress(moduleType: string, data?: any): void {
    let type: any;
    let address = {
      address1: "",
      address2: "",
      address_type_id: "",
      city: "",
      country_id: "",
      id: data.id,
      organization_id: "",
      org_id: "",
      addressClientData: "",
    };
    if (data) {
      // Object.assign(address, data);
      type = "edit";
    } else {
      type = "add";
    }
    console.log(data.id, 456);
    let toast: object;
    let dialogRef = this.dialog.open(AddressComponent, {
      panelClass: "alert-dialog",
      width: "600px",
      disableClose: true,
      data: {
        address: address,
        type: "edit",
        module: moduleType,
        org_id: this.invId,
        // org_id: data.id,
        id: data.id,
      },
    });
    // console.log(this.organizationDetails)
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
      }
    });
  }

  public conversion_edit: boolean = false;
  public conversion_value: boolean = false;
  originalCurrencyConversion: number;

  startEditing() {
    this.originalCurrencyConversion = this.currency_conversion;
    this.conversion_edit = true;
  }
  closeConverionRate() {
    this.conversion_edit = false;
    this.currency_conversion = this.originalCurrencyConversion;
  }

  saveTaxConversion() {
    if (this.currency_conversion) {
      let toast: object;
      this.OrdersService.saveTaxConversion({
        shipment_id: this.orderId,
        tax_conversion_value: this.currency_conversion,
      }).then((response) => {
        if (response.result.success) {
          toast = { msg: response.result.message, status: "success" };
          this.conversion_edit = false;
          this.conversion_value = false;
          this.getOrderDocuments.emit();
        } else {
          toast = { msg: response.result.message, status: "error" };
          this.conversion_edit = true;
        }
        this.snackbar.showSnackBar(toast);
      });
    } else {
      this.conversion_edit = false;
    }
  }
  addlineitemCustoms() {
    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      disableClose: true,
      data: {
        id: this.invId,
        module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.generateSubTotals("add_product_in_create", this.data.estimate_id);
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
        let toast: object;
        toast = { msg: "Line Item Added  Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
      }
    });
  }
  saveAddline(column: any, colIndex: number) {
    let params = {
      form_data: {
        line_item: column.line_item,
        value: column.value,
      },
      organization_id: this.invId,
      id: column.id,
      form_id: "43",
      module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(params).then((res) => {
      if (res.success) {
        this.editExtraCol = null;
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
        this.snackbar.showSnackBar({
          msg: "Add Line Item Update Successfully",
          status: "success",
        });
      } else {
        this.editExtraCol = null;
        this.snackbar.showSnackBar({
          msg: res.message,
          status: "error",
        });
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
      }
    });
  }
  deleteLineItemCustomPricing(lineItem) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        lineItem,
        type: "edit_product_in_customs_inv",
        module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
        let toast: object;
        toast = { msg: "Line Item Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  validateDecimalInput(event) {
    const input = event.target;
    let value = input.value;

    // Remove any non-numeric characters except the decimal point
    value = value.replace(/[^0-9.]/g, "");

    // Ensure there is only one decimal point
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("");
    }

    // Limit to 3 decimal places
    if (parts.length === 2 && parts[1].length > 3) {
      value = parts[0] + "." + parts[1].slice(0, 3);
    }

    // Only update the value if it has changed
    if (input.value !== value) {
      input.value = value;
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }

    // Angular's two-way binding should automatically update the model,
    // no need to manually dispatch input events unless you have a specific need for it.
  }

  public editQuoteNoState = false;
  editQuoteNo(ev) {
    let toast: object;
    this.editQuoteNoState = false;
    this.OrdersService.editInvoiceNumber({
      id: this.orderId,
      number_series: this.updatedPoNo,
    }).then(async (response) => {
      if (response.result.success) {
        toast = {
          msg: response.result.message,
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.invoiceData.customs_invoice[0].invoice_no = this.updatedPoNo;
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.invId,
        });
        this.updateInv.emit({
          type: "commercial_invoice_details",
          id: this.com_inv_id,
        });
      } else {
        toast = {
          msg: response.result.message,
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  closeNumberEdit() {
    this.editQuoteNoState = false;
  }
  public updatedPoNo = "";
  savechangesPO(ev) {
    this.updatedPoNo = ev.target.value;
  }
  editpoQPD() {
    this.editQuoteNoState = true;
  }

}
