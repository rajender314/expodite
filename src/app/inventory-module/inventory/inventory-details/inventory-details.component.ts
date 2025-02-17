import { InventoryService } from "./../../../services/inventory.service";
import { Images } from "./../../../images/images.module";
import { DeleteInventoryComponent } from "./../../../dialogs/delete-inventory/delete-inventory.component";
import { SnakbarService } from "./../../../services/snakbar.service";
import { language } from "./../../../language/language.module";
import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Location } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl,
} from "@angular/forms";
// import { ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-inventory-details",
  templateUrl: "./inventory-details.component.html",
  styleUrls: ["./inventory-details.component.scss"],
  providers: [InventoryService, SnakbarService],
  // encapsulation: ViewEncapsulation.Emulated
})
export class InventoryDetailsComponent implements OnInit {
  // @Input() Inventory;
  @Output() trigger = new EventEmitter<object>();
  private images = Images;
  private language = language;
  batchList: any;
  productList: any[];
  editFormData: object;
  editable: boolean;
  editForm: FormGroup;
  selectedBatch: object;
  private id = 0;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private InventoryService: InventoryService,
    public dialog: MatDialog,
    private snackbar: SnakbarService,
    private router: Router
  ) {}

  ngOnInit() {
    //console.log(Router)
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.getDetail();
      this.createForm();
      //  this.setForm();
    });
  }
  goBack(): void {
    this.location.back();
  }

  getDetail(data?: any): void {
    this.InventoryService.BatchesList({ id: this.id })
      .then((response) => {
        if (response.result.success) {
          this.batchList = response.result.data.batchesDt;
          this.selectedBatch = this.batchList[0];
          // console.log(this.selectedBatch)
        }
      })
      .catch((error) => console.log(error));
  }
  batchDelete(): void {
    let inventoryDetails = this.getInventoryDetails();
    let dialogRef = this.dialog.open(DeleteInventoryComponent, {
      panelClass: "alert-dialog",
      width: "500px",
      // height: '240px',
      data: inventoryDetails,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        this.router.navigate(["inventory/list"]);
      }
    });
  }
  createForm(): void {
    this.editForm = this.fb.group({
      name: [null],
      product_name: "",
      product_types_id: "",
      batch_nbr: "",
      tot_qty: [null],
      remain_quan: [null],
      mfd_date: [null],
      exp_date: [null],
      id: this.id,
    });
  }
  setForm(data: any): void {
    this.editForm.patchValue({
      name: data.name,
      product_name: data.product_name,
      batch_nbr: data.batch_nbr,
      product_types_id: data.products_types_id,
      tot_qty: data.tot_qty,
      remain_quan: data.remain_quan,
      mfd_date: new Date(data.mfd_date),
      exp_date: new Date(data.exp_date),
      inv_id: this.id,
    });
  }
  getInventoryDetails(): Object {
    let details = {
      name: "",
      product_name: "",
      batch_nbr: "",
      product_types_id: "",
      tot_qty: "",
      remain_quan: "",
      mfd_date: "",
      exp_date: "",
      inv_id: this.id,
    };
    if (this.batchList && this.batchList.length)
      Object.assign(details, this.batchList[0]);

    return details;
  }
  editInventory(): void {
    if (!this.editable) this.editable = true;
    let inventoryDetails = this.getInventoryDetails();
    this.editFormData = inventoryDetails;
    this.setForm(inventoryDetails);
    this.InventoryService.BatchesList({ id: this.id })
      .then((response) => {
        if (response.result.success) {
          this.productList = response.result.data.productsDt;
        }
      })
      .catch((error) => console.log(error));
  }

  resetInventory(form: any) {
    this.editInventory();
    this.editable = false;
  }

  update(form: any): void {
    let toast: object;
    let data = Object.assign(this.editForm.value);
    // console.log(this.editForm.value)
    this.InventoryService.addBatch(this.editForm.value).then((response) => {
      if (response.result.success) {
        toast = {
          msg: "Batch Details Updated Successfully...",
          status: "success",
        };
        this.batchList.push(data);
        this.snackbar.showSnackBar(toast);
        this.editable = false;
        this.getDetail();
        // console.log(data)
      } else {
        toast = {
          msg: "Batch Details Updated Failed...",
          status: "success",
          success: "false",
        };
        this.snackbar.showSnackBar(toast);
        this.editable = false;
      }
    });
  }
}
