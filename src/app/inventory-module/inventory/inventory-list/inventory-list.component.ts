import { Images } from './../../../images/images.module';
import { Param } from './../../../custom-format/param';
import { InventoryService } from './../../../services/inventory.service';
import { AddInventoryComponent } from './../../../dialogs/add-inventory/add-inventory.component';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [InventoryService,Title]
})
export class InventoryListComponent implements OnInit {



  private images = Images;
  public batchList: Array<any> = [];
  private productList: Array<any> = [];
  private InvproductsArr: Array<any> = [];
  private timeout;
  public open = false;
  fetchingData: boolean;
  noBatches: boolean;
  searching: boolean;
  date: string = '';
  
 
  paginationScroll: boolean;
  totalPages: number = 0;
  totalCount: number = 0;
  
  private param: Param = {
     
      page: 1,
      perPage: 25,
      sort: 'ASC',
      search: ''
    }



  constructor(
    private InventoryService: InventoryService,
    public dialog: MatDialog
  ) { }

  displayedColumns = ['batch_nbr', 'mfd_date', 'exp_date', 'tot_qty', 'remain_quan'];

  ngOnInit() {
    this.getBatchList(this.param);
    
  }

  getBatchList(param: object, flag?: string, cb?): void {
    if (flag == 'pagination') this.paginationScroll = true;
    this.searching = true;
    this.InventoryService
      .BatchesList(this.param)
      .then(response => {
        this.searching = false;
         this.paginationScroll = false;
         if(cb) this.searching = false;
        if (response.result.success) {
          if(cb) this.batchList= [];
          let data = response.result.data.batchesDt
          data.map(res => {
            this.batchList.push(res);
          });
          this.productList = response.result.data.productsDt;
          this.batchList = response.result.data.batchesDt;
        }
        
      })
      .catch(error => console.log(error))
  }

 getInventoryDetails(data: any): void{
    // console.log(data)
  }
  addInventory(): void {
    let dialogRef = this.dialog.open(AddInventoryComponent, {
      panelClass: 'alert-dialog',
      width: '400px',
      data: { productList: this.productList }
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      if (result.success) {
        this.getBatchList(this.param);

      }
    });
  }

 
  searchBatches(filterValue: string, event?: any) {
    let param = {
      pageNo: 1,
      pageSize: 25,
      search: filterValue
    }
    this.searching = true;
     this.param.search = filterValue;
    if (this.timeout){ clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      
      this.searching = false;
      this.InventoryService
      .BatchesList(param)
      .then(response => {
        if (response.result.success) {
          this.noBatches = false;
          this.batchList = response.result.data.batchesDt;
        }
        
      })
    }, 1000);
  }else{
    this.noBatches = true;
  }
  }
   productChange(data: any): void{
    data.selected = !data.selected;
  }

  filterInventory(): void{
    let selectedIds = [];
    this.productList.map(function(value,index){
      if(value.selected){
        selectedIds.push(value.id);
      }
    });
    this.InventoryService
    .BatchesList({InvproductsArr:selectedIds,date:this.date})
    .then(response => {
        if(response.result.success){
          this.batchList = response.result.data.batchesDt;
          
        }
    })
    .catch(error => console.log(error))
  }

  clearInventory(): void {
    this.date = null;
    this.productList.forEach((product) => {
    product.selected = false;
  })
  }

onScroll(): void {
 
        // console.log('scrolled!!')

    // if (this.param.page < this.totalPages && this.totalPages != 0) {
    //   this.param.page++;
    //   this.getBatchList(this.param, 'pagination');
    // }
  }
  noRecords(): void {
    this.noBatches = true;
  }
}
