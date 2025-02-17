import { OrdersComponent } from './../../orders-module/orders/orders.component';
import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatStepper, MatStepperModule } from "@angular/material/stepper";
import { Images } from "../../images/images.module";
import { InventoryService } from "../../services/inventory.service";
import { AdminService } from "../../services/admin.service";
import { OrdersService } from "../../services/orders.service";
import { Param } from "../../../app/custom-format/param";

@Component({
  selector: "app-add-batch-number",
  templateUrl: "./add-batch-number.component.html",
  styleUrls: ["./add-batch-number.component.scss"],
  providers: [InventoryService, AdminService, OrdersService],
  encapsulation: ViewEncapsulation.None
})
export class AddBatchNumberComponent implements OnInit {
  searching: boolean;
  private param: Param = {
    page: 1,
    perPage: 25,
    sort: "ASC",
    search: ""
  };
  private timeout;
  private images = Images;
  batchError: boolean;
  noBatches: boolean;
  public noAddBatches: boolean = true;
  public disableBtn: boolean = false;
  public batchCategoryName: string;
  public title: string = '';
  public order = {
    fetchingBatches: true,
    batches: [],
    fetchingContainers: true,
    containers: [],
    selectesBatchList: false,
    totalQuantity: 0,
    disableContainerAdd: false,
    selectedBatch: []
  };
  public showSpinner = false;
  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<OrdersComponent>,
    private InventoryService: InventoryService,
    private adminService: AdminService,
    private ordersService: OrdersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.data.isMerchantExporter ? this.getContainers() : this.getBatchesList();
    this.noBatches = false;
    console.log(this.data)
    let prefix = (this.data.flag == 'edit' ? 'Edit' : 'Add');
    this.title = this.data.isMerchantExporter ? prefix + ' Packing' : prefix + ' Batch Quantity';
  }

  getBatchesList(): void {
    this.order.fetchingBatches = true;

    if (this.data.product.batch_nbr && this.data.product.batch_nbr.length) {
      this.InventoryService.BatchesList({
        product_id: this.data.product.order_product_id,
        type: "merge",
        batch_nbr: this.data.product.batch_nbr,
        quantity: this.data.product.product_quantity
      })
        .then(response => {
          this.order.fetchingBatches = false;
          this.order.batches = response.result.data.batchesDt;
          if (this.order.batches && this.order.batches.length) {
            this.noAddBatches = false;
            this.batchCategoryName = this.order.batches[0].category_name;
            this.order.batches.map(function (value) {
              value["selected"] = false;
            });
          } else {
            this.noAddBatches = true;
          }
        })
        .catch(error => console.log(error));
    } else {
      this.order.fetchingBatches = true;
      this.InventoryService.BatchesList({
        product_id: this.data.product.order_product_id,
        type: "merge",
        quantity: this.data.product.product_quantity
      })
        .then(response => {
          this.order.fetchingBatches = false;
          this.order.batches = response.result.data.batchesDt;
          if (this.order.batches && this.order.batches.length) {
            this.noAddBatches = false;
            this.batchCategoryName = this.order.batches[0].category_name;
            this.order.batches.map(function (value) {
              value["selected"] = false;
            });
          } else {
            this.noAddBatches = true;
          }
        })
        .catch(error => console.log(error));
    }
  }

  selectBatch(batch) {
    batch.selected = !batch.selected;
    this.order.batches.map(function (value) {
      if (batch.id != value.id) {
        // value['selected'] = false;
      }
    });
  }
  searchBatches(filterValue: string, event?: any) {
    let param = {
      page: 1,
      pageSize: 25,
      product_id: this.data.product.order_product_id,
      quantity: this.data.product.product_quantity,
      type: "merge",
      search: filterValue
    };
    this.searching = true;
    this.param.search = filterValue;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.InventoryService.BatchesList(param).then(response => {
        if (response.result.success) {
          this.order.fetchingBatches = false;
          this.order.batches = response.result.data.batchesDt;
          this.noBatches = !this.order.batches.length;
          this.order.batches.map(function (value) {
            value["selected"] = false;
          });
        }
        this.searching = false;
      });
    }, 1000);
  }

  valueDecriment(batch: any, container: any) {
    if (batch.quantity[container.id] != "0") {
      batch.quantity[container.id] = parseInt(batch.quantity[container.id]) - 1;
      this.order.totalQuantity =
        this.order.totalQuantity - parseInt(container.type_name);
    }
    this.calculateTotalQuantity(batch);
  }

  calculateTotalQuantity(batch) {
    let totalQuantity = 0;
    let batchQuantity = 0;
    let disable: boolean;

    let orders = this.order.containers;

    orders.map(function (value) {
      totalQuantity =
        totalQuantity +
        parseInt(value.type_name) * parseInt(batch.quantity[value.id] || 0);
    });

    if (batch.remain_quan <= totalQuantity) {
      batch.disableContainerAdd = true;
    } else {
      batch.disableContainerAdd = false;
    }
  }

  onChange(event, batch, container) {
    let totalQuantity = 0;

    let orders = this.order.containers;


    this.order.selectedBatch.map(batchData => {
      orders.map(function (value) {
        if (value.id === container.id) {
          totalQuantity =
            totalQuantity +
            (parseInt(value.type_name) || 0) * (parseInt(batchData.quantity[value.id]) || 0);
        } else {
          totalQuantity =
            totalQuantity +
            (parseInt(value.type_name) || 0) * (parseInt(batchData.quantity[value.id]) || 0);
        }

      });
    })

    this.order.totalQuantity = totalQuantity;
    this.calculateTotalQuantity(batch);
  }
  valueIncriment(batch: any, container: any) {
    let totalQuantity = 0;

    let orders = this.order.containers;

    orders.map(function (value) {
      totalQuantity =
        totalQuantity +
        parseInt(value.type_name) * parseInt(batch.quantity[value.id] || 0);
    });

    if (totalQuantity + parseInt(container.type_name) >
      (this.data.isMerchantExporter ? this.data.product.product_quantity : batch.remain_quan)) {
      return false;
    }

    if (!batch.disableContainerAdd) {
      if (
        this.order.totalQuantity + parseInt(container.type_name) <=
        this.data.product.product_quantity
      ) {
        batch.quantity[container.id] =
          parseInt(batch.quantity[container.id] || 0) + 1;
        this.order.totalQuantity =
          this.order.totalQuantity + parseInt(container.type_name);
      }
    }

    this.calculateTotalQuantity(batch);
  }

  getContainers(): void {
    this.order.fetchingContainers = true;
    this.showSpinner = true;
    this.adminService
      .getContainersList({ status: 1 })
      .then(response => {
        this.order.fetchingContainers = false;
        if (response.result.success) {
          this.order.containers = response.result.data.ContainersDt;
          let selectedBatch = this.data.isMerchantExporter ? [{ 'selected': true, "quantity": {}, "id": 0 }] : this.order.selectedBatch;
          this.order.totalQuantity = (this.data.flag == 'edit' && this.data.isMerchantExporter) ? this.data.product.product_quantity : 0;
          let selectedContainers = this.data.isMerchantExporter ? this.data.containers : [];
          let isMerchant = this.data.isMerchantExporter
          this.order.containers.map(function (value) {
            selectedBatch.map(function (batch) {
              batch["quantity"][value.id] = 0;
              selectedBatch["disableContainerAdd"] = false;
              if (isMerchant) {
                selectedContainers.map(function (container) {
                  if (batch["quantity"][value.id] == 0 && container.container_id == value.id) {
                    batch["quantity"][value.id] = container.qty;
                  } else {
                    return;
                  }
                })
              }
            });
            value["quantity"] = 0;
          }, selectedContainers);
          this.order.selectedBatch = selectedBatch;
          this.order.batches = selectedBatch
        }
        this.showSpinner = false;
      })
      .catch(error => console.log(error));
  }

  addOrderBatch(stepper: MatStepper) {
    let selectedBatch = [];
    let selectedList = [];
    let sum = 0;
    selectedList = this.order.batches.map(function (value) {
      if (value.selected) {
        value.quantity = {};
        selectedBatch.push(value);
        return true;
      }
      return false;
    });
    this.order.selectedBatch = selectedBatch;

    selectedBatch.map(function (value) {
      sum = sum + value.remain_quan;
    });
    if (sum >= this.data.product.product_quantity) {
      this.batchError = false;
      if (selectedList.length) {
        this.getContainers();
        stepper.next();
      }
      if (!selectedList.length) {
        this.order.selectesBatchList = true;
      } else {
        this.order.selectesBatchList = false;
      }
    } else {
      this.batchError = true;
    }
  }

  addBatchNumber() {
    this.showSpinner = true;
    let containersList = [];
    let containers = this.order.containers;
    this.disableBtn = true;

    this.order.batches.map(function (batch) {
      if (batch.selected) {
        let container = {};
        container["batch_id"] = batch.id;
        container["container"] = [];
        containers.map(function (value) {
          if (batch.quantity[value.id] != "0") {
            let obj = {};
            obj["container_types_id"] = value.id;
            obj["quantity"] = batch.quantity[value.id];
            obj["quantity_type"] = value.type_name;
            container["container"].push(obj);
          }
        });
        containersList.push(container);
      }
    });
    if (this.data.flag == "proforma") {
      this.ordersService
        .saveProformaBatchNumber({
          orders_products_id: this.data.product.order_product_id,
          packing_id: this.data.container,
          orders_id: this.data.selectedOrder.id,
          container: containersList,

        })
        .then(response => {
          this.showSpinner = false;
          this.dialogRef.close({ success: true, result: response });
        })
        .catch(error => console.log(error));
    } else {
      this.ordersService
        .saveBatchNumber({
          orders_products_id: this.data.product.order_product_id,
          packing_id: this.data.container,
          orders_id: this.data.selectedOrder.id,
          container: containersList,

        })
        .then(response => {
          this.showSpinner = false;
          this.dialogRef.close({ success: true });
        })
        .catch(error => console.log(error));
    }


  }

  goToPrev(stepper: MatStepper) {
    stepper.previous();
  }
  goToInv(): void {
    this.dialogRef.close();
  }
}
