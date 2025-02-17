import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Images } from "../../images/images.module";
import { SnakbarService } from "../../services/snakbar.service";
import { OrganizationsService } from "../../services/organizations.service";
import { OrdersService } from "../../services/orders.service";
import { ImportDocumentComponent } from "../../dialogs/import-document/import.component";
import { MatDialog } from "@angular/material/dialog";
import { FileUploader, FileUploadModule } from "ng2-file-upload";
import { Router } from "@angular/router";
import { DescriptionUpload } from "../../dialogs/description/add-description.component";
import { PdfPreviewComponent } from "../../dialogs/pdf-preview/pdf-preview.component";
import { Lightbox } from "ngx-lightbox";
import { SendEmailComponent } from "../../dialogs/send-email/send-email.component";
import { EditDesciptionModelComponent } from "../../shared/edit-desciption-model/edit-desciption-model.component";
import { LeadsService } from "../../leads/leads.service";
import { UtilsService } from "../../services/utils.service";
import { AddLineItemComponent } from "../../dialogs/add-line-item/add-line-item.component";
import { DeleteLineItemComponent } from "../../dialogs/delete-line-item/delete-line-item.component";
import { OrderActivityLogComponent } from "../../orders-module/order-activity-log/order-activity-log.component";
import { POCreateComponent } from "../po-create/po-create.component";
import { AdminService } from "../../services/admin.service";
declare var App: any;

@Component({
  selector: "app-po-invoice",
  templateUrl: "./po-invoice.component.html",
  styleUrls: ["./po-invoice.component.scss"],
})
export class PoInvoiceComponent implements OnInit {
  @Input() poDetails;
  @Input() isSampleDocs;
  @Input() factoryPermission;
  @Input() clientPermission;
  @Input() salesDocuments;
  @Input() data;
  @Input() adminUser;
  @Input() editClosed;
  @Output() updateParentData: EventEmitter<any> = new EventEmitter<any>();
  @Output() dataEvent = new EventEmitter<string>();
  @Output() generatePo: any = new EventEmitter();
  @Input() viewActivityLogIcon;
  showProfInvoice: boolean = true;
  printProfInvoice: boolean = true;
  public images = Images;
  private timestamp: any;
  originFileAttachments: any[];
  userDetails: any;
  conformorderButton: boolean;
  activateScroll: boolean;
  public acceptbutton: boolean = true;
  public activeTab = "activity";
  @ViewChild("pfiinvoice") pfiinvoice: TemplateRef<any>;
  @ViewChild("scrollContainer") scrollContainer: TemplateRef<any>;
  @ViewChild("poInvEditInput") poInvEditInput: ElementRef;
  @ViewChild("poInvEditLineInput") poInvEditLineInput: ElementRef;
  public newColumnAdded = false;
  openUploadFile: boolean = false;
  public disableAccept: boolean = false;
  totalSpinner: boolean;
  editingPOProductId: any;
  editingPOProductIdQ: null;
  editingPODesId: null;
  editPODescountstate: boolean;
  updatedValueQty: any;
  updatedValuePrice: any;
  editPOdescr: any;
  editdescountValue: any;
  originalPOInvoiceData: any;
  editaddlineItem: any;

  // data: any;
  constructor(
    private OrdersService: OrdersService,
    private organizationsService: OrganizationsService,
    private snackbar: SnakbarService,
    public dialog: MatDialog,
    private router: Router,
    private _lightbox: Lightbox,
    private service: LeadsService,
    private utilsService: UtilsService,
    public adminService: AdminService
  ) {}

  ngOnInit(): void {
    // this.getAddedFiles();
    this.adminService.getPermissions().subscribe(res => {
      this.adminService.rolePermissions = res.role_details.roles_permissions;
    })
    this.userDetails = this.data;
    this.originalPOInvoiceData = JSON.parse(JSON.stringify(this.poDetails));
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.editClosed) {
      this.closeEdit();
    }
    // console.log("ngOnChanges called with changes:", changes);
  }
  getPo() {
    // this.fetchingData = true;

    this.OrdersService.getPoApi({
      id: this.data.id,
    }).then(async (response) => {
      if (response.result) {
        if (response.result.data) {
          // this.showNoDatFound = false;
          // this.fetchingData = false;
          // this.proformaInvData = response.result.data;
          // this.enableProforma = true;
          this.poDetails = response.result.data;
          this.originalPOInvoiceData = JSON.parse(
            JSON.stringify(response.result.data)
          );

          // this.getOrdersActivityDetails();
        } else {
          // this.showNoDatFound = true;
        }
      }
    });
  }
  toggleProformaInvoice() {
    this.showProfInvoice = !this.showProfInvoice;
    this.printProfInvoice = !this.printProfInvoice;
  }
  onTdInput(event: InputEvent) {
    const target = event.target as HTMLTableCellElement;
    if (!/^(\d+(\.\d{0,2})?)?$/.test(target.innerText)) {
      target.innerText = target.innerText.slice(0, -1);
      event.preventDefault();
    }
  }
  editInsurance(index, event, value) {
    let insurance;
    let va;
    let numberRegex = /[0-9.]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.value != "") {
          if (value == 1) {
            insurance = event.target.value?.includes(",")
              ? event.target.value.replace(/,/g, "")
              : event.target.value;
            // console.log(productId,"xfdf");

            this.OrdersService.updatePOInsuranceApi({
              po_id: this.data.id,
              insurance: insurance.replace(/,/g, ""),
            }).then((response) => {
              if (response.result.success) {
                let toast: object;
                toast = {
                  msg: " PO Details Updated Successfully.",
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.getPo();
              } else {
                let toast: object;
                toast = { msg: response.result.message, status: "error" };
                this.snackbar.showSnackBar(toast);
              }
            });
          }
        }
      }, 1000);
    } else {
      return false;
    }
  }
  editFreight(index, event, value) {
    let freightCharges;
    let numberRegex = /[0-9.]/g;
    if (
      numberRegex.test(event.key) ||
      event.key == "Backspace" ||
      event.key == "Delete"
    ) {
      if (this.timestamp) clearTimeout(this.timestamp);
      this.timestamp = setTimeout(() => {
        if (event.target.value != "") {
          if (value == 0) {
            freightCharges = event.target.value?.includes(",")
              ? event.target.value.replace(/,/g, "")
              : event.target.value;
            // freightCharges = freightCharges.replace(/[,\.00]/g, '');
            freightCharges = event.target.value.replace(/,/g, "");

            if (freightCharges === "") {
              freightCharges = "0";
            }
            // console.log(productId,"xfdf");
            this.OrdersService.updatePOFreightApi({
              po_id: this.data.id,
              freight: freightCharges,
            }).then((response) => {
              if (response.result.success) {
                let toast: object;
                toast = {
                  msg: " PO Details Updated Successfully.",
                  status: "success",
                };
                this.snackbar.showSnackBar(toast);
                this.getPo();
              } else {
                let toast: object;
                toast = { msg: response.result.message, status: "error" };
                this.snackbar.showSnackBar(toast);
              }
            });
          }
        }
      }, 1000);
    } else {
      return false;
    }
  }

  editDiscount(event) {
    let discount;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (this.poDetails.po_subtotal_form[0].discount != "") {
        discount = this.poDetails.po_subtotal_form[0].discount?.includes(",")
          ? this.poDetails.po_subtotal_form[0].discount.replace(/,/g, "")
          : this.poDetails.po_subtotal_form[0].discount;
        if (
          parseFloat(discount) <
          parseFloat(this.poDetails?.po_subtotal_form[0]?.subtotal)
        ) {
          let param = {
            form_data: { ...this.prefillObject, discount: discount },
            discount: discount,
            id: this.poDetails.po_subtotal_form[0].id,
            organization_id: this.data.id,
            module_id: this.data.id,
          };
          let toast: object;
          this.utilsService.saveStoreAttribute(param).then((res) => {
            if (res.success) {
              toast = {
                msg: "Discount Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.updateParentData.emit();
            } else {
              toast = {
                msg: res.message ? res.message : "Unable to Update",
                status: "error",
              };
              this.snackbar.showSnackBar(toast);
            }
          });
        } else {
          let toast = {
            msg: "Discount Cannot Exceed Sub Total.",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
          this.updateParentData.emit();

          // this.getProformaInvoiceData();
          this.editPODescountstate = false;
        }
      }
    });
    // } else {
    //   return false;
    // }
  }

  changePrice(product: any, event: any, value: any) {
    const numberRegex = /^[0-9.]+$/;
    const inputValue = event.target.innerText.trim();
    let price: any;
    let productId: any;
    let quantity: any;
    const single_piece = product.single_piece;

    // if (
    //   numberRegex.test(event.target.value) ||
    //   event.key === "Backspace" ||
    //   event.key === "Delete"
    // ) {
    if (this.updatedValueQty === "0") {
    }
    this.timestamp = setTimeout(() => {
      if (this.updatedValueQty !== "0") {
        productId = product.po_product_id;

        const updateData: any = {
          po_product_id: productId,
          single_piece: single_piece,
        };

        if (value == 0) {
          price = product.price?.replace(/,/g, "") || product.price;
          updateData.price = price;
          updateData.quantity =
            product.quantity?.replace(/,/g, "") || product.quantity;
        } else if (value == 1) {
          quantity = inputValue;
          updateData.quantity = quantity;
          updateData.price = product.product_price_number;
        } else if (value == 2) {
          quantity = product.quantity?.replace(/,/g, "") || product.quantity;
          updateData.quantity = quantity;
          updateData.price = product.price?.replace(/,/g, "") || product.price;
        }

        this.OrdersService.updatePOProductPriceApi(updateData).then(
          (response) => {
            if (response.result.success) {
              this.getPo();
              let toast: object;
              toast = {
                msg: "PO Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.editingPOProductIdQ = null;
              this.editingPOProductId = null;
            } else {
              let toast: object;
              toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editingPOProductIdQ = null;
              this.editingPOProductId = null;
            }
          }
        );
      } else {
        let toast: object;
        toast = {
          msg: " None of the PO value cannot be zero",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
        this.getPo();
        this.editingPOProductIdQ = null;
        this.editingPOProductId = null;
      }
    });
    // } else {
    //   return false;
    // }
  }
  // public imageUploadUrl =
  //   App.base_url + "addOrderAtt?orders_id=" + this.data.id;
  private uploader: FileUploader = new FileUploader({
    // url: App.base_url + "addOrderAtt?orders_id=" + this.userDetails.id,
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });
  // userDetails;
  Editdescription(product: any, event: any, value: any) {
    let productId: any;
    let description: any;
    productId = product.po_product_id;
    if (this.timestamp) clearTimeout(this.timestamp);
    this.timestamp = setTimeout(() => {
      if (product.description != "") {
        if (value == 1) {
          description = this.editPOdescr;
          this.OrdersService.updatePODescriptionApi({
            product_id: productId,
            description: product.description,
          }).then((response) => {
            if (response.result.success) {
              let toast: object;
              toast = {
                msg: "PO Details Updated Successfully",
                status: "success",
              };
              this.snackbar.showSnackBar(toast);
              this.getPo();
              this.editingPODesId = null;
            } else {
              let toast: object;
              toast = { msg: response.result.message, status: "error" };
              this.snackbar.showSnackBar(toast);
              this.editingPODesId = null;
            }
          });
        }
      }
    });
  }
  getAddedFiles() {
    this.OrdersService.getPOAttachmentsApi({
      id: this.data.id,
    }).then((response) => {
      if (response.result.success) {
        response.result.data.forEach((element) => {
          this.salesDocuments = response.result.data;
          this.salesDocuments.map((x) => {});
        });
      } else {
        this.originFileAttachments = [];
      }
    });
  }
  // setAddedFilesUrl(flag) {
  //   this.uploader.setOptions({
  //     url: App.base_url + "addFiles?po_id=" + this.data.id + "&type=" + "po",
  //   });
  // }
  uploadSupplier(flag?: any) {
    // this.setAddedFilesUrl(flag);
    this.uploader.setOptions({
      url: App.base_url + "addFiles?po_id=" + this.data.id + "&type=" + "po",
    });

    let toast: object;
    let dialogRef = this.dialog.open(ImportDocumentComponent, {
      width: "550px",
      data: {
        id: this.data.id,
        flage: "po",
        order_type: false,
        component: "po",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success == true) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        this.router.resetConfig(config);
        // this.getAddedFiles();
        //  this.getOrganizationsList(this.param);
      }
    });
  }
  deleteUploads(file, i, flag) {
    this.OrdersService.deletePOAttachmentsApi({
      id: file.id,
      att_id: file.att_id,
    }).then((response) => {
      if (response.result.success) {
        let toast: object;
        toast = { msg: "File deleted successfully", status: "success" };
        this.snackbar.showSnackBar(toast);

        this.salesDocuments.splice(i, 1);
      }
    });
  }

  downloadFile(file, i, flag) {
    var downloadUrl =
      App.base_url +
      "downloadFile?link_url=" +
      file.link_url +
      "&original_name=" +
      file.original_name;
    window.open(downloadUrl, "_blank");
  }
  SaveDescription(data: any) {
    let toast: object;
    let dialogRef = this.dialog.open(DescriptionUpload, {
      panelClass: "alert-dialog",
      width: "300px",
      data: {
        orders_id: this.data.id,
        estimate_id: this.data.id,
        attachments_id: data.att_id,
        type: "sales",
        order_type: false,
        id: data.id,
        discription: data.description,
        component: "po",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        const config = this.router.config.map((route) =>
          Object.assign({}, route)
        );
        // this.getAddedFiles();
        this.router.resetConfig(config);
      }
    });
  }

  moveToPFI() {
    this.activateScroll = false;
    this.activeTab = "pfiinvoice";
    if (this.pfiinvoice && this.pfiinvoice["nativeElement"].offsetTop) {
      this.scrollContainer["nativeElement"].scrollTop =
        this.pfiinvoice["nativeElement"].offsetTop - 400;
    }
    setTimeout(() => {
      this.activateScroll = true;
    }, 100);
  }
  confirmSales(event: any): void {
    this.conformorderButton = true;
    // event.target.disabled = true;

    this.OrdersService.updatePOStatusApi({
      po_id: this.data.id,
      type: "po_approved",
    }).then((response) => {
      if (response.result.success) {
        // this.orders.selectedOrder.confirm_sales = true;
        this.moveToPFI();
        this.updateParentData.emit(response.result.data);
        // this.poDetails.status = response.result.data.status;
        // this.poDetails.color_code = response.result.data.color_code;

        let toast: object;
        toast = {
          msg: "Sales Estimate Confirmed Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
        this.conformorderButton = false;
      }
      this.conformorderButton = false;
    });
  }
  CancelPO() {
    this.closeEdit();
    this.OrdersService.updateEstimateApi({
      id: this.data.id,
      type: "po_cancelled",
    }).then((response) => {
      if (response.result.success === true) {
        this.openUploadFile = false;
        // this.selectedOrderStatus = response.result.data.name;
        this.updateParentData.emit(response.result.data);
        // this.poDetails.status_id = response.result.data.id;
        // this.poDetails.status_color_code = response.result.data.color_code;
        // this.poDetails.status = response.result.data.id;
        let toast: object;
        toast = { msg: "PO Cancelled Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }

  acceptPo() {
    this.openUploadFile = true;
    this.acceptbutton = false;
    this.updateEstimateSatus();
    this.closeEdit();
  }
  updateEstimateSatus() {
    let toast: object;
    this.disableAccept = true;
    this.totalSpinner = true;
    this.OrdersService.updateEstimateApi({
      id: this.data.id,
      type: "po_accepted",
    }).then((response) => {
      if (response.result.success) {
        this.totalSpinner = false;
        this.getPo();
        this.updateParentData.emit(response.result.data);
        // this.orders.selectedOrder.status = response.result.data.id;
        this.disableAccept = false;
        toast = { msg: " PO Accepted Successfully...", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
        this.disableAccept = false;
        this.totalSpinner = false;
        toast = { msg: " PO Failed Accepted ", status: "error" };
        this.snackbar.showSnackBar(toast);
      }
    });
    this.closeEdit();
  }
  openPreview(file, i: number, flag): void {
    this.closeEdit();
    if (flag === "product_image") {
      let imgObj = {
        src: file,
        thumb: "name",
      };
      this._lightbox.open([{ ...imgObj }], 0);
    } else if (
      file.link_url.lastIndexOf(".pdf") == -1 &&
      file.link_url.lastIndexOf(".doc") == -1 &&
      file.link_url.lastIndexOf(".docx") == -1 &&
      file.link_url.lastIndexOf(".xlsx") == -1
    ) {
      this._lightbox.open(this.salesDocuments, i);
    } else {
      let dialogRef = this.dialog.open(PdfPreviewComponent, {
        width: "850px",
        data: file,
      });
    }
  }
  SendEmail() {
    this.closeEdit();
    let data = {
      details: this.poDetails,
      id: this.data.id,
    };
    let dialogRef = this.dialog.open(SendEmailComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.getPo();
        this.updateParentData.emit(result.data);
        // let toast: object;
        // toast = {
        //   msg: " Sent Email Successfully.",
        //   status: "success",
        // };
        // this.snackbar.showSnackBar(toast);
      } else {
        // let toast: object;
        // toast = {
        //   msg: "  Failed to Send Email...",
        //   status: "error",
        // };
        // this.snackbar.showSnackBar(toast);
      }
    });
    this.closeEdit();
  }
  closeEdit() {
    // this.getProformaInvoiceData();
    // this.updateParentData.emit();
    console.log(this.poDetails, "update");
    setTimeout(() => {
      this.poDetails.po_subtotal_form[0].discount =
        this.originalPOInvoiceData.po_subtotal_form[0].discount;
      this.poDetails.add_line_items = JSON.parse(
        JSON.stringify(this.originalPOInvoiceData.add_line_items)
      );
    });
    this.editPODescountstate = false;
    this.editaddlineItem = null;
    // this.getPo();
  }

  public existingAttributesData = [];
  public form_id = "";
  async getOrgStoreAttribute() {
    await this.service
      .getOrgStoreAttributeList({
        module: "po_subtotal_form",
      })
      .then(async (response) => {
        if (response.result.success) {
          this.existingAttributesData =
            response.result.data.attributes.base_attributes;

          this.form_id = response.result.data.attributes.form_id;
          this.getAttributesPrefillData();
        }
      })
      .catch((error) => console.log(error));
  }

  public prefillObject: any;
  async getAttributesPrefillData() {
    let data;
    let isSaveFreight: string;
    await this.service
      .getAttributes({
        module: this.form_id,
        id: this.data.estimate_id,
      })
      .then(async (response) => {
        if (response.result.success && response.result.data) {
          data = response.result.data[0]?.meta_data;
          this.prefillObject = data;
        }
      });
  }
  editpoQPD(key, productId) {
    this.getOrgStoreAttribute();
    setTimeout(() => {
      if (key == "discount") {
        this.editPODescountstate = true;
        this.editingPOProductId = null;
        this.editingPODesId = null;
        this.editingPOProductIdQ = null;
        setTimeout(() => {
          this.poInvEditInput.nativeElement.focus();
        }, 100);
        this.editaddlineItem = null;
      } else if (key == "add_line_items") {
        this.editPODescountstate = false;
        this.editingPOProductId = null;
        this.editingPODesId = null;
        this.editaddlineItem = productId;
        setTimeout(() => {
          this.poInvEditLineInput.nativeElement.focus();
        }, 100);
      }
    }, 100);

    // this.getPo();
  }
  public moduleName = "";
  savechangesPO(event, key, index?: any) {
    this.moduleName = "po_subtotal_form";

    if (key === "quantity") {
      this.updatedValueQty = event.target.value;
    } else if (key === "price") {
      this.updatedValueQty = event.target.value;
    } else if (key === "description") {
      // this.editPOdescr = event.target.innerText;
      this.poDetails.products[index].description = event.target.innerText;
    } else if (key === "discount") {
      this.editdescountValue = event.target.value;
    } else if (key === "add_line_items") {
      // this.editPOdescr = event.target.innerText;
      this.poDetails[key][index].value = event.target.value;
    }
    // this.changePrice();
  }
  removeCommas(event) {
    event.target.value = event.target.value.replace(/,/g, "");
  }
  public clickedIconId = null;

  onBlur(event: FocusEvent, productId: any): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (this.clickedIconId == productId) {
      this.clickedIconId = null; // Reset the flag
      return;
    }
    this.closeEdit();
  }
  openEditDescription(productData) {
    let dialogRef = this.dialog.open(EditDesciptionModelComponent, {
      width: "550px",
      data: {
        productData: productData,
        type: "po",
        toastMsg: " PO details updated successfully",
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.getPo();
      }
    });
  }
  triggerGridEvent(event) {
    this.updateParentData.emit();
  }
  addlineitemspo() {
    let dialogRef = this.dialog.open(AddLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",
      data: {
        id: this.data.id,
        pannel: "order-details",
        key: "extra_col",
        module_id: this.data.id,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        // this.orders.invoice = result.response.result.data.Invioce;
        let toast: object;
        // this.generateSubTotals("add_product_in_create", this.data.id);

        toast = { msg: "Line Item Added Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
        this.generatePo.emit({
          type: "po_product_details",
          id: this.data.id,
        });
      }
    });
  }
  deleteLineItemopoDetails(lineItem?: any) {
    let dialogRef = this.dialog.open(DeleteLineItemComponent, {
      panelClass: "alert-dialog",
      width: "550px",

      data: { lineItem, type: "add_products_in_po", module_id: this.data.id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.success) {
        this.generatePo.emit({
          type: "po_product_details",
          id: this.data.id,
        });

        // this.deleteLineItemAccessOrders(index);
        let toast: object;
        toast = { msg: "Line Item Deleted Successfully", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
  openActivityModal(type): void {
    const dialogRef = this.dialog.open(OrderActivityLogComponent, {
      width: "50%", // Set the width to 50% of the viewport
      height: "100%", // Set the height to 100% of the viewport
      panelClass: "half-page-dialog", // Apply custom styling for the half-page modal
      position: {
        right: "0", // Align the modal to the right side of the viewport
      },
      data: {
        module: type,
        id: this.poDetails.add_po[0].id,
      },
    });
  }
  saveAddline(column: any, colIndex: number) {
    let params = {
      form_data: {
        line_item: column.line_item,
        value: column.value,
      },
      organization_id: this.data.id,
      id: column.id,
      form_id: "43",
      module_id: this.data.id,
      moduleName: this.moduleName,
    };
    this.utilsService.saveStoreAttribute(params).then((res) => {
      if (res.success) {
        this.generatePo.emit({
          type: "po_product_details",
          id: this.data.id,
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
      }
    });
  }

  CreatePO() {
    let toast: object;
    let dialogRef = this.dialog.open(POCreateComponent, {
      panelClass: "alert-dialog",
      width: "800px",
      data: {
        flag: "Create PO",
        id: this.data.id,
        isEditMode: true,
        title: "Edit PO",
        order_id: this.data.id,
      },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.updateParentData.emit();
        this.newColumnAdded = true;
        setTimeout(() => {
          this.newColumnAdded = false;
        }, 500);
        let toast: object;
        toast = {
          msg: " PO Created Successfully...",
          status: "success",
        };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
