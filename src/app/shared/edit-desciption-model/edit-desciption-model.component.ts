import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Images } from "../../images/images.module";
import { Lightbox } from "ngx-lightbox";
import { OrdersService } from "../../services/orders.service";
import { SnakbarService } from "../../services/snakbar.service";
declare var App: any;
const {
  language: {
    estimate: { value: estimate_name },
  },
} = App.env_configurations;
@Component({
  selector: "app-edit-desciption-model",
  templateUrl: "./edit-desciption-model.component.html",
  styleUrls: ["./edit-desciption-model.component.scss"],
})
export class EditDesciptionModelComponent implements OnInit {
  public updatedDescription = "";
  public images = Images;
  public disableSave = true;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditDesciptionModelComponent>,
    private _lightbox: Lightbox,
    private OrdersService: OrdersService,
    private snackbar: SnakbarService,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.type === "po") {
      this.updatedDescription = this.data.productData.description;
    } else {
      this.updatedDescription = this.data.productData.p_description;
    }
  }

  ngOnInit(): void {}
  changeDescription(ev) {
    this.disableSave = false;
    this.updatedDescription = ev.target.value;
  }
  getKeys(obj: any) {
    return Object.keys(obj);
  }

  openPreview(file, i: number, flag): void {
    if (flag === "product_image") {
      let imgObj = {
        src: file,
        thumb: "name",
      };
      this._lightbox.open([{ ...imgObj }], 0);
    }
  }
  public estimateslanguage = estimate_name;

  Editdescription() {
    let productId: any;
    if (this.data.type === "po") {
      this.OrdersService.updatePODescriptionApi({
        product_id: this.data.productData.po_product_id,
        description: this.updatedDescription,
      }).then((response) => {
        if (response.result.success) {
          let toast: object;
          toast = {
            msg: this.data.toastMsg,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close({ success: true });
        } else {
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    } else {
      this.OrdersService.EditDescription({
        product_id: this.data.productData.order_product_id,
        description: this.updatedDescription,
        type: this.data.type,
      }).then((response) => {
        if (response.result.success) {
          let toast: object;
          toast = {
            msg: this.data.toastMsg,
            status: "success",
          };
          this.snackbar.showSnackBar(toast);
          this.dialogRef.close({ success: true });
        } else {
          let toast: object;
          toast = { msg: response.result.message, status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });
    }
  }
}
