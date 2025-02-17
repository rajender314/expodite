import { language } from "./../../../language/language.module";
import { AddInventoryComponent } from "./../../../dialogs/add-inventory/add-inventory.component";
import { SnakbarService } from "./../../../services/snakbar.service";
import { Images } from "./../../../images/images.module";
import { InventoryService } from "./../../../services/inventory.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  Output,
  EventEmitter,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import * as _ from "lodash";

@Component({
  selector: "app-inventory-merge",
  templateUrl: "./inventory-merge.component.html",
  styleUrls: ["./inventory-merge.component.scss"],
  providers: [InventoryService],
})
export class InventoryMergeComponent implements OnInit, OnChanges {
  @Input("categories") categoryList: Array<any> = [];
  @Output() back = new EventEmitter<any>();
  @Output() addBatch = new EventEmitter<object>();

  public fetchingData: boolean = false;
  private selectAll: boolean = false;
  public pagination = {
    totalCount: 1,
    pageSize: 1,
  };
  private params = {
    pageSize: 10,
    page: 1,
    search: "",
    InvproductsArr: [],
    fromDate: "",
    toDate: "",
    type: "merge",
  };
  private images = Images;
  private language = language;
  public selectedCategory: any = {};
  public checkedBatches = [];
  private batchList = new MatTableDataSource();
  public activeState: boolean = false;
  private totalQuatity = 0;
  private displayedColumns = [
    "checkbox",
    "name",
    "mfd_date",
    "exp_date",
    "tot_qty",
  ];
  public statusList = [];

  constructor(
    private InventoryService: InventoryService,
    private router: Router,
    public dialog: MatDialog,
    private snackbar: SnakbarService
  ) {}

  ngOnInit() {
    this.activeState = false;
    this.getBatchList();
  }
  getBatchList() {
    this.InventoryService.BatchesList(this.params)
      .then((response) => {
        this.fetchingData = false;
        if (response.result.success) {
          this.categoryList = response.result.data.categoryDt;
          this.categoryList.map((obj) => {
            obj["selected"] = false;
          });
          this.selectCategory(this.categoryList[0]);
        }
      })
      .catch((error) => console.log(error));
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (this.categoryList != undefined) {
      if (!_.isEmpty(this.categoryList)) {
        this.selectCategory(this.categoryList[0]);
      }
    }
  }

  resetGrid(category): void {
    this.batchList.data = [];
    this.checkedBatches = [];
    this.totalQuatity = 0;
    this.pagination = {
      totalCount: 1,
      pageSize: 1,
    };
    this.params.page = 1;
    if (!category["selected"]) {
      this.params.InvproductsArr = [];
    } else {
      this.params.InvproductsArr[0] = category.id;
    }
  }

  selectState(event) {
    // console.log(event)
  }
  public copyBatchData = [];
  selectCategory(category?: any, flag?: boolean, eve?: any): void {
    // console.log(category)
    // console.log(this.selectedCategory.id , category.id)
    this.checkedLength = [];

    this.categoryList.map((obj) => {
      if (obj.id == category.id) {
        category["selected"] = !category["selected"];
      } else {
        obj.selected = false;
      }
    });
    // category['selected'] = !category['selected'];
    // console.log(category)
    this.fetchingData = true;
    this.selectAll = false;
    this.selectedCategory = category;
    if (!flag) this.resetGrid(category);
    this.InventoryService.BatchesList(this.params).then((response) => {
      this.fetchingData = false;
      if (response.result.success) {
        this.pagination.totalCount = response.result.data.count;
        this.pagination.pageSize = response.result.data.lastpage;
        this.statusList = response.result.data.BatchStausDt;
        // category['selected'] = !category['selected'];
        if (this.pagination.totalCount == 0) {
          this.batchList.data = [];
        } else {
          let pre = this.batchList.data;
          let next = response.result.data.batchesDt;
          this.batchList.data = pre.concat(next);
          this.copyBatchData = this.batchList.data;

          _.map(this.batchList.data, (batch: any) => {
            batch.isChecked = false;
          });
        }
      }
    });
  }

  isSelectAll(isAll: boolean): void {
    // console.log(isAll)
    this.totalQuatity = 0;

    if (isAll) {
      this.checkedLength = [];
      this.activeState = true;
      _.map(this.batchList.data, (batch: any) => {
        batch.isChecked = true;

        this.checkedBatches.push(batch);

        this.checkedLength.push(batch);
        this.checkedLength.map((obj) => {
          obj.selected = true;
        });
        this.totalQuatity += batch.remain_quan;
      });
    } else {
      _.map(this.batchList.data, (batch: any) => {
        batch.isChecked = false;
        this.checkedBatches = [];
        this.checkedLength = [];
      });
    }
  }
  public checkedLength = [];
  isChecked(event, batch, i): void {
    // batch.selected = !batch.selected;
    if (event.checked) {
      batch.selected = true;
      this.checkedLength.push(batch);
    } else {
      batch.selected = false;
    }
    this.checkedLength = this.checkedLength.filter((obj) => {
      return obj.selected;
    });
    // this.copyBatchData = this.copyBatchData.filter(obj => {
    //   return obj.selected;
    // })
    // console.log(this.copyBatchData)
    let indx = this.checkedBatches.indexOf(batch);
    this.activeState = true;
    if (indx > -1) {
      this.checkedBatches.splice(indx, 1);
      this.totalQuatity -= batch.remain_quan;
    } else {
      this.checkedBatches.push(batch);
      this.totalQuatity += batch.remain_quan;
      // console.log(this.totalQuatity)
    }

    if (this.checkedLength.length == this.batchList.data.length) {
      this.selectAll = true;
      // console.log(this.checkedBatches.length, this.batchList.data.length, this.selectAll)
    } else {
      this.selectAll = false;
      // console.log(this.selectAll)
    }

    // console.log(this.checkedLength.length, this.batchList.data.length)
  }

  createMerge(): void {
    // let obj = {
    //   mergeIds: this.checkedBatches,
    //   totQty: this.totalQuatity,
    //   categoryId: this.selectedCategory.id,
    //   title: 'Merge Batch'
    // }
    // this.activeState = false;

    // this.addBatch.emit(obj)

    let dialogRef = this.dialog.open(AddInventoryComponent, {
      panelClass: "alert-dialog",
      width: "580px",
      disableClose: true,
      // height: '550px',
      data: {
        fieldsData: {
          mergeIds: this.checkedBatches,
          totQty: this.totalQuatity,
          categoryId: this.selectedCategory.id,
          title: "Merge Batch",
        },
        statusList: this.statusList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.success) {
        let toast: object;
        // this.getBatchList(true);
        toast = { msg: "Batches Merged successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
        setTimeout(() => {
          this.router.navigate(["/inventory"]);
        }, 800);
      }
    });
  }

  cancelMerge(): void {
    this.router.navigate(["/inventory"]);
    this.back.emit();
    this.activeState = false;
  }

  onScroll(): void {
    if (
      this.params.page < this.pagination.pageSize &&
      this.pagination.pageSize != 0
    ) {
      this.params.page++;

      this.selectCategory(this.selectedCategory, true);
    }
  }
}
