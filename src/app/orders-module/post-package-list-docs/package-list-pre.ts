import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Images } from "../../images/images.module";
import { Title } from "@angular/platform-browser";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { OrderActivityLogComponent } from "../order-activity-log/order-activity-log.component";

@Component({
  selector: "post-package",
  templateUrl: "./package-list-pre.html",
  styleUrls: ["./package-list-pre.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class PackageListDoc implements OnInit {
  @Input() PackageList: any;
  @Input() order_id: any;
  @Input() inlineData;
  @Input() PackageData;
  @Input() freightData;
  @Input() shippingData;
  @Input() companyDetails;
  @Input() container_nbr;
  @Input() custom_seal_nbr;
  @Input() carrier_seal_nbr;
  @Input() ordersData;
  @Input() viewActivityLogIcon;
  @Input() viewExcelIcon;
  public editBillPackage = false;
  public editConsigne = false;
  public editNotify = false;
  public showBill = true;
  public showConsigne = true;
  public showNotify = true;
  public buyer;
  public consignee;
  public notify;
  @ViewChild("consigneeTextarea1") consigneeTextarea1: ElementRef;
  @ViewChild("notifyTextarea1") notifyTextarea1: ElementRef;
  @ViewChild("buyerTextarea1") buyerTextarea1: ElementRef;

  public images = Images;
  public showPackage: boolean = true;
  initialValues: string;
  constructor(
    private titleService: Title,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private formBuilder: FormBuilder, // public dialog: MatDialog,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnChanges(): void {
    if (this.order_id && this.PackageList?.taxInvoice)
      this.buyer = this.inlineData?.buyers_address;

    // ? this.inlineData.buyers_address
    // : this.PackageList?.taxInvoice?.consignee_address;
    this.consignee = this.inlineData?.consignee_address;
    // ? this.inlineData.consignee_address
    // : this.PackageList?.taxInvoice?.buyers_address;
    // this.notify = this.inlineData?.customs_notify_address1;
    this.notify = this.inlineData?.notify_address;
    // ? this.inlineData.customs_notify_address1
    // : this.PackageList?.taxInvoice?.customs_notify_address1;
  }
  customBillParty() {
    this.editBillPackage = true;
    this.showBill = false;
    if (this.buyer) {
      var re = /<br>/gi;
      this.buyer = this.buyer.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.buyerTextarea1) {
        this.buyerTextarea1.nativeElement.focus();
      }
    }, 0);
  }
  editBill() {}
  consigneEdit() {
    this.editConsigne = true;
    this.showConsigne = false;
    if (this.consignee) {
      var re = /<br>/gi;
      this.consignee = this.consignee.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.consigneeTextarea1) {
        this.consigneeTextarea1.nativeElement.focus();
      }
    }, 0);
  }
  EditNotifyParty() {
    this.editNotify = true;
    this.showNotify = false;
    if (this.notify) {
      var re = /<br>/gi;
      this.notify = this.notify.replace(re, "\n");
    }
    setTimeout(() => {
      if (this.notifyTextarea1) {
        this.notifyTextarea1.nativeElement.focus();
      }
    }, 0);
  }
  togglePackage() {
    this.showPackage = !this.showPackage;
    // this.printAdcaapl = !this.printAdcaapl;
  }
  captureInitialValue(event: FocusEvent, field: number) {
    const target = event.target as HTMLTextAreaElement;
    this.initialValues = target.value;
  }
  SaveAddress(flag, event) {
    // if (this.buyer) {
    //   var re = /<br>/gi;
    //   this.buyer = this.buyer.replace(re, "\n");
    // }

    // if (this.consignee) {
    //   var re = /<br>/gi;
    //   this.consignee = this.consignee.replace(re, "\n");
    // }

    // if (this.notify) {
    //   var re = /<br>/gi;
    //   this.notify = this.notify.replace(re, "\n");
    // }
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value.trim();
    const initialValue = this.initialValues ? this.initialValues.trim() : "";

    // Check if the value has changed
    if (newValue !== initialValue) {
      this.OrdersService.saveOrderDocumentSIDraftApi({
        orders_id: this.order_id,
        type: "PACKAGE_LIST",
        context: {
          buyers_address: this.buyer ? this.buyer.replace(/\n/g, "<br>") : "",
          consignee_address: this.consignee
            ? this.consignee.replace(/\n/g, "<br>")
            : "",
          notify_address: this.notify ? this.notify.replace(/\n/g, "<br>") : "",
        },
      }).then((response) => {
        if (response.result.success) {
          this.editConsigne = this.editNotify = this.editBillPackage = false;
          this.showConsigne = this.showNotify = this.showBill = true;
          this.buyer = response.result.data.context.buyers_address;
          this.consignee = response.result.data.context.consignee_address;
          this.notify = response.result.data.context.notify_address;
          this.inlineData = response.result.data.context;
          let toast: object;
          toast = {
            msg: "Packing List Updated Successfully",
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
        } else {
          let toast: object;
          toast = {
            msg: "Failed To Update ",
            status: "error",
          };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      this.buyer = this.inlineData?.buyers_address;
      this.editConsigne = this.editNotify = this.editBillPackage = false;
      this.showConsigne = this.showNotify = this.showBill = true;
      this.consignee = this.inlineData?.consignee_address;
      // ? this.inlineData.consignee_address
      // : this.PackageList?.taxInvoice?.buyers_address;
      this.notify = this.inlineData?.notify_address;
    }
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
        type: type,
        orders_id: this.order_id,
      },
    });
  }
}
