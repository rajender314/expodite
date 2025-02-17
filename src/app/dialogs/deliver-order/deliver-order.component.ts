// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject, EventEmitter } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
} from "@angular/forms";
import { OrdersService } from "../../services/orders.service";
import { FileUploader, FileUploaderOptions } from "ng2-file-upload";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import * as moment from "moment";
import { SnakbarService } from "../../services/snakbar.service";
import { OrdersComponent } from "../../orders-module/orders/orders.component";
declare var App: any;

@Component({
  selector: "app-deliver-order",
  templateUrl: "./deliver-order.component.html",
  styleUrls: ["./deliver-order.component.scss"],
  providers: [OrdersService, SnakbarService],
})
export class DeliverOrderComponent implements OnInit {
  result: true;
  success: boolean;
  sizeError: boolean;
  uploadImage = false;
  loading = false;
  showForm = true;
  public imagUploadFlag = "delivered";
  public deliveryDate: any;
  deliverOrderForm: FormGroup;
  uploadedFile: any;

  constructor(
    public dialog: MatDialog,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.uploader.onAfterAddingFile = (item: any) => {
      // this.uploadedFile = [];
      this.uploader.setOptions({
        url: `${App.base_url}fileUpload?module=delivery_form&related_to_id=${this.data.id}`,

        // "addFiles?orders_id=" +
        // this.data.id +
        // "&type=" +
        // this.imagUploadFlag,
      });
      let latestFile = this.uploader.queue[this.uploader.queue.length - 1];
      this.uploader.queue = [];
      this.uploader.queue.push(latestFile);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      // console.log(response)
      let obj = JSON.parse(response);
      if (obj.result.success) {
        let toastMsg: object;
        toastMsg = { msg: "File uploaded successfully", status: "success" };
        this.snackbar.showSnackBar(toastMsg);
        console.log(obj);
        this.uploadedFile = [obj.result.data];
        if (!obj.result.data.error_format) {
        }
      } else {
        let toastMsg: object;
        toastMsg = { msg: "Error while uploading", status: "error" };
        this.snackbar.showSnackBar(toastMsg);
      }
    };
    this.uploader.onWhenAddingFileFailed = (
      item: any,
      response: any,
      options: any
    ) => {
      let toast: object;
      // this.uploadImage = true;
      if (item.size >= options.maxFileSize) {
        this.sizeError = true;
        this.uploadImage = false;
        toast = { msg: "File Size Exceeds Max Limit 5mb", status: "error" };
        this.snackbar.showSnackBar(toast);
      } else {
        this.uploadImage = true;
        this.sizeError = false;
        toast = {
          msg: "You have selected an invalid file type. Only jpg, jpeg, png and pdf files are allowed.",
          status: "error",
        };
        this.snackbar.showSnackBar(toast);
      }
    };
  }
  public uploader: FileUploader = new FileUploader({
    allowedMimeType: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ],
    maxFileSize: 5 * 1024 * 1024,
    autoUpload: true,
  });

  public onFileSelected(event: EventEmitter<File[]>) {
    const file: File = event[0];
    // console.log(file);
  }
  createForm(): void {
    this.deliverOrderForm = this.formBuilder.group({
      delivery_date: [null, Validators.required],
    });
  }
  setForm(data: any, obj: any): void {
    let date = moment(data).format("YYYY-MM-DD");
    this.deliverOrderForm.patchValue({
      delivery_date: date,
    });
    this.uploadedFile = obj;
  }
  ngOnInit() {
    this.getDeliveryInfo();
    this.createForm();
    console.log(this.data);
  }
  openCalendar(picker: MatDatepicker<Date>) {
    picker.open();
  }
  getDeliveryInfo(): void {
    this.OrdersService.getDeliverDetails({ id: this.data.id }).then(
      (response) => {
        if (response.result.success) {
          this.deliveryDate = response.result.data.delivery_date;
          this.uploadedFile = response.result.data.attachments;
          this.setForm(this.deliveryDate, response.result.data.attachments);
        }
      }
    );
  }
  deleteUploads(item, i) {
    this.OrdersService.deleteFiles({ id: this.data.id, att_id: item.id }).then(
      (response) => {
        if (response.result.success) {
          let toast: object;
          toast = { msg: "File deleted successfully", status: "success" };
          this.snackbar.showSnackBar(toast);
          this.uploadedFile.splice(i, 1);
          // this.getProductTypesData();
        }
      }
    );
  }
  deliverOrder(): void {
    this.showForm = false;
    this.loading = true;
    let diveryDate = moment(this.deliverOrderForm.value.delivery_date).format(
      "YYYY-MM-DD"
    );
    // this.OrdersService.acceptOrder({
    //   id: this.data.id,
    //   orders_types_id: 4,
    //   delivery_date: diveryDate,
    // })

    this.OrdersService.updateEstimateApi({
      id: this.data.id,
      type: "shipment_delivered",
      delivery_date: diveryDate,
    }).then((response) => {
      this.success = true;
      if (response.result.success) {
        this.dialogRef.close({ success: true });
        let toast = { msg: "Order Marked As Delivered", status: "success" };
        this.snackbar.showSnackBar(toast);
      } else {
        let toast = { msg: response.result.message, status: "error" };
        this.snackbar.showSnackBar(toast);
      }
    });
  }
}
