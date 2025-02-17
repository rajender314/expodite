import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";

import { Images } from "../../images/images.module";
import { OrdersService } from "../../services/orders.service";
import { PostCommercialInvoiceModel } from "./postInvoice.model";
import { SnakbarService } from "../../services/snakbar.service";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";
import { MarkAsPaidComponent } from "../../dialogs/mark-as-paid/mark-as-paid.component";
import { AddressComponent } from "../../dialogs/address/address.component";
import { UtilsService } from "../../services/utils.service";
import { LeadsService } from "../../leads/leads.service";
import { CreateEinvoiceComponent } from "../../dialogs/create-einvoice/create-einvoice.component";
import { AdminService } from "../../services/admin.service";
import { CancelEinvoiceComponent } from "../../dialogs/cancel-einvoice/cancel-einvoice.component";
import { AddLineItemComponent } from "../../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../dialogs/delete-line-item/delete-line-item.component";
CreateEinvoiceComponent;
declare var App: any;

@Component({
  selector: "post-invoice",
  templateUrl: "./postInvoice.component.html",
  styleUrls: ["./postInvoice.component.scss"],
})
export class PostInvoice {
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
  @Input() einv_exist: any;
  @Output() updateInv: any = new EventEmitter();
  @Output() getViewDetails: any = new EventEmitter();
  @Output() showEinvoice = new EventEmitter<any>();
  @ViewChild("commercialInvEditInput") commercialInvEditInput: ElementRef;
  @ViewChild("billTextarea1") billTextarea1: ElementRef;
  @ViewChild("notifyTextarea1") notifyTextarea1: ElementRef;
  @ViewChild("shipTextarea1") shipTextarea1: ElementRef;
  @ViewChild("notifyTextarea2") notifyTextarea2: ElementRef;
  @Input() isEditPermission = true;
  @Input() custm_inv_id;
  public images = Images;
  public PrintIcon: string =
    App.public_url + "signatures/assets/images/printer-tool.svg";
  private stopgetEditedCall: boolean = false;
  public invoiceEdits: PostCommercialInvoiceModel =
    new PostCommercialInvoiceModel(false, false, false, false, "", "", "", "");
  editCommercialSate: any;
  updatedCommercialFreight: any;
  updatedCommercialValueinsurance: any;
  UpdateCommercialPriceValue: any;
  editStateUpdate: boolean;
  editFreightState: boolean;
  editDescountState: boolean;
  initialValues: string;
  genEinvLoading: boolean = false;
  editaddlineItem;
  private timestamp: any;
  // snackbar: any;

  constructor(
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private utilsService: UtilsService,
    private service: LeadsService
  ) {}

  ngOnInit() {
    this.originalInvoiceData = JSON.parse(JSON.stringify(this.invoiceData)); // Save the original invoice data
    // this.getPaymentInfo();
    this.show_edit = this.invoiceData?.commercial_invoice[0]?.show_edit;
    this.invoiceEdits.customs_notify_address1 =
      this.invoiceData?.customs_notify_address1 ||
      this.invoiceEdits.customs_notify_address1;

    this.invoiceEdits.customs_notify_address2 =
      this.invoiceData?.customs_notify_address2 ||
      this.invoiceEdits.customs_notify_address2;

    this.invoiceEdits.editedBillAddress =
      this.invoiceData?.editedBillAddress ||
      this.invoiceEdits.editedBillAddress;
    this.invoiceEdits.editedShipAddress =
      this.invoiceData?.editedShipAddress ||
      this.invoiceEdits.editedShipAddress;
  }
  ngOnChanges(): void {
    setTimeout(() => {
      this.originalInvoiceData = JSON.parse(JSON.stringify(this.invoiceData));
      this.show_edit = this.invoiceData?.commercial_invoice[0]?.show_edit;
    }, 100);
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
        } else if (type === "extra_col") {
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
    setTimeout(() => {
      if (type === "insurance") {
        this.editDescountState = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
        this.editStateUpdate = true;
        this.editaddlineItem = null;
      } else if (type === "freight") {
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editCommercialSate = null;
        this.editFreightState = true;
        this.editaddlineItem = null;
      } else if (type === "discount") {
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = null;
        this.editDescountState = true;
        this.editaddlineItem = null;
      } else if (type === "price") {
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = productId;
        this.editaddlineItem = null;
      } else if (type == "extra_col") {
        this.editDescountState = false;
        this.editStateUpdate = false;
        this.editFreightState = false;
        this.editCommercialSate = false;
        this.editaddlineItem = productId;
      }
      setTimeout(() => {
        this.commercialInvEditInput.nativeElement.focus();
      }, 100);
    }, 200);
  }
  public moduleName = "";
  saveCommercialEdit(msg, typeId, product?: any) {
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
    this.invoiceData = JSON.parse(JSON.stringify(this.originalInvoiceData)); // Restore the original invoice data
    setTimeout(() => {
      this.editStateUpdate = false;
      this.editDescountState = false;
      this.editFreightState = false;
      this.editaddlineItem = null;
      // this.editCommercialSate = null;
    }, 100);
  }
  showDiv: boolean = true;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  customEditnotify1() {
    this.invoiceEdits.edittaxInvoicenotify1 = true;
    if (this.invoiceEdits.customs_notify_address1) {
      var re = /<br>/gi;
      this.invoiceEdits.customs_notify_address1 =
        this.invoiceEdits.customs_notify_address1.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.notifyTextarea1) {
        this.notifyTextarea1.nativeElement.focus();
      }
    }, 0);
    this.closeEditcommercial();
  }
  customEditnotify2() {
    this.invoiceEdits.edittaxInvoicenotify2 = true;
    if (this.invoiceEdits.customs_notify_address2) {
      var re = /<br>/gi;
      this.invoiceEdits.customs_notify_address2 =
        this.invoiceEdits.customs_notify_address2.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.notifyTextarea2) {
        this.notifyTextarea2.nativeElement.focus();
      }
    }, 0);
    this.closeEditcommercial();
  }
  customBilltoParty() {
    this.invoiceEdits.editBilltoParty = true;
    if (this.invoiceEdits.editedBillAddress) {
      var re = /<br>/gi;
      this.invoiceEdits.editedBillAddress =
        this.invoiceEdits.editedBillAddress.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.billTextarea1) {
        this.billTextarea1.nativeElement.focus();
      }
    }, 0);
    this.closeEditcommercial();
  }

  customShiptoParty() {
    this.invoiceEdits.editShiptoParty = true;
    if (this.invoiceEdits.editedShipAddress) {
      var re = /<br>/gi;
      this.invoiceEdits.editedShipAddress =
        this.invoiceEdits.editedShipAddress.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.shipTextarea1) {
        this.shipTextarea1.nativeElement.focus();
      }
    }, 0);
    this.closeEditcommercial();
  }
  captureInitialValue(event: FocusEvent, field: number) {
    const target = event.target as HTMLTextAreaElement;
    this.initialValues = target.value;
  }
  async valuBillEditship(event?: any) {
    this.invoiceEdits.customs_notify_address1 =
      this.invoiceEdits.customs_notify_address1.replace(/\n/g, "<br>");
    this.invoiceEdits.customs_notify_address2 =
      this.invoiceEdits.customs_notify_address2.replace(/\n/g, "<br>");

    this.invoiceEdits.editedBillAddress =
      this.invoiceEdits.editedBillAddress.replace(/\n/g, "<br>");
    this.invoiceEdits.editedShipAddress =
      this.invoiceEdits.editedShipAddress.replace(/\n/g, "<br>");

    this.invoiceData.customs_notify_address1 =
      this.invoiceEdits.customs_notify_address1;
    this.invoiceData.customs_notify_address2 =
      this.invoiceEdits.customs_notify_address2;
    this.invoiceData.editedBillAddress = this.invoiceEdits.editedBillAddress;
    this.invoiceData.editedShipAddress = this.invoiceEdits.editedShipAddress;
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value.trim();
    const initialValue = this.initialValues ? this.initialValues.trim() : "";

    // Check if the value has changed
    if (newValue !== initialValue) {
      this.updateinvoice(this.invoiceData);
    }
    this.invoiceEdits.editBilltoParty = false;
    this.invoiceEdits.editShiptoParty = false;
    this.invoiceEdits.edittaxInvoicenotify1 = false;
    this.invoiceEdits.edittaxInvoicenotify2 = false;
  }

  // async getEditedContext() {
  //   let response = await this.OrdersService.getOrderDocumentSIDraftApi({
  //     orders_id: this.orderId,
  //   });
  //   if (response.result.success) {
  //     let data = response.result.data.find((item) => {
  //       return item?.type === "COMMERCIAL_INVOICE";
  //     });

  //     this.invoiceData = data?.context || {};
  //     this.invoiceEdits.customs_notify_address1 =
  //       data?.context?.customs_notify_address1 ||
  //       this.invoiceEdits.customs_notify_address1;

  //     this.invoiceEdits.customs_notify_address2 =
  //       data?.context?.customs_notify_address2 ||
  //       this.invoiceEdits.customs_notify_address2;

  //     this.invoiceEdits.editedBillAddress =
  //       data?.context?.editedBillAddress || this.invoiceEdits.editedBillAddress;
  //     this.invoiceEdits.editedShipAddress =
  //       data?.context?.editedShipAddress || this.invoiceEdits.editedShipAddress;
  //     this.stopgetEditedCall = true;
  //   }
  // }

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
    // data.package_products.forEach((item) => {
    //   item.rate_per_uom =
    //     item.rate_per_uom?.replace(/,/g, "") || item.rate_per_uom;
    //   item.quantity = item.quantity?.replace(/,/g, "") || item.quantity;
    // });
    let param = {
      form_data: {
        insurance:
          // data.subtotal_form[0].insurance?.replace(/,/g, "") ||
          data.subtotal_form[0].totals?.insurance.value,
        discount:
          // data.subtotal_form[0].discount?.replace(/,/g, "") ||
          data.subtotal_form[0].totals?.discount.value,
        freight:
          // data.subtotal_form[0].freight?.replace(/,/g, "") ||
          data.subtotal_form[0].totals?.freight.value,
      },
      id: data.subtotal_form[0].id,
      organization_id: this.invId,
      module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      moduleName: this.moduleName,
    };
    let toast: object;
    // let response = await this.OrdersService.saveOrderDocumentSIDraftApi({
    //   orders_id: this.orderId,
    //   type: "COMMERCIAL_INVOICE",
    //   context: data,
    // });
    this.utilsService.saveStoreAttribute(param).then((response) => {
      if (response.success) {
        // this.generateSubTotals.emit({
        //   type: "edit_product_in_commercial_inv",
        //   id: this.invId,
        // });

        this.updateInv.emit({
          type: "commercial_invoice_details",
          id: this.invId,
        });
        let toast: object;
        toast = {
          msg: `${msg}  Updated Successfully`,
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
          type: "commercial_invoice_details",
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
      width: "550px",
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
      if (ev.tableName == "commercialInvoice") {
        // this.getViewDetails.emit({
        //   type: "commercial_invoice_details",
        //   id: this.invId,
        // });
        this.updateInv.emit({
          type: "commercial_invoice_details",
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
          type: "commercial_invoice_details",
          id: this.invId,
        });
      }
    });
  }

  generateEinvoice() {
    this.genEinvLoading = true;
    this.adminService
      .generateEinvoice({ com_inv_id: this.invId })
      .then((response) => {
        if (response.result.success) {
          this.genEinvLoading = false;
          this.showEinvoice.emit();
          let toast: object;
          toast = {
            msg: "Generated E-Invoice Successfully",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
        }
      })
      .catch((error) => console.log(error));
  }

  createEInvoice() {
    let toast: object;
    let dialogRef = this.dialog.open(CreateEinvoiceComponent, {
      panelClass: "alert-dialog",
      width: "30%",
      data: {
        flag: "Generate E-Invoice",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.generateEinvoice();
      } else {
      }
    });
  }

  cancelEInvoice() {
    let toast: object;
    let dialogRef = this.dialog.open(CancelEinvoiceComponent, {
      panelClass: "cancel-einvoice-dialog",
      width: "500px",
      data: {
        com_inv_id: this.invId,
        flag: "Cancel E-Invoice",
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        let toast: object;
        this.showEinvoice.emit();
        // this.einvoice_status_cancelled = true;
        // this.einvoice_status_generated = false;
        toast = { msg: "Cancelled E-Invoice Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  addlineItemCommercial() {
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
          type: "commercial_invoice_details",
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
        this.updateInv.emit({
          type: "commercial_invoice_details",
          id: this.invId,
        });
        this.editaddlineItem = null;
        this.snackbar.showSnackBar({
          msg: "Add Line Item Update Successfully",
          status: "success",
        });
      } else {
        this.editaddlineItem = null;
        this.snackbar.showSnackBar({
          msg: res.message,
          status: "error",
        });
        this.updateInv.emit({
          type: "commercial_invoice_details",
          id: this.invId,
        });
      }
    });
  }
  deleteLineItemoCommercial(lineItem?: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        lineItem,
        type: "edit_product_in_commercial_inv",
        module_id: this.ordersInfo.selectedOrder.create_shipment[0].id,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.updateInv.emit({
          type: "commercial_invoice_details",
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
        this.invoiceData.commercial_invoice[0].invoice_no = this.updatedPoNo;
        this.updateInv.emit({
          type: "commercial_invoice_details",
          id: this.invId,
        });
        this.updateInv.emit({
          type: "customs_invoice_details",
          id: this.custm_inv_id,
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
