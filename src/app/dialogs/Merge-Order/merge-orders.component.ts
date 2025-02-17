import { OrdersComponent } from '../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { Param } from '../../custom-format/param';
import { AdminService } from '../../services/admin.service';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-change-Merge-order',
  templateUrl: './merge-orders.component.html',
  styleUrls: ['./merge-orders.component.scss'],
  providers: [OrdersService,SnakbarService]
  
})
export class MergeOrderComponent implements OnInit {
  contactAddressList: Array<any> = [];
  OrdersList:Array<any>=[];
  shippingId:any;
  orderNo:any
  success:boolean;
  public disabledSave = true;
 constructor(public dialog: MatDialog,
    private OrdersService: OrdersService,
    private adminService: AdminService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {dialogRef.disableClose = true; }
    private param = {
      page: 1,
      perPage: 25,
      sort: 'ASC',
      search: '',
      flag: true
    }

  ngOnInit() {
    // this.getContacts(this.param);
    // console.log(this.data)
    this.data.MergeSelectOrders.map(value=>{
      this.OrdersList.push(value)
    })
    console.log(this.OrdersList,"MergeOrders")
  }
  // getContacts(param: object): void {
  // //  console.log("here")
  //   this.adminService
  //     .getContactsList(param)
  //     .then(response => {
  //       if (response.result.success) {
  //         let data = response.result.data.companyShpAddrDt;
  //         data.map(res => {
  //           res['selected'] = false;
  //           this.contactAddressList.push(res);
  //           // console.log( this.contactAddressList)
  //         });
  //       }
     
  //     })
  //     .catch(error => console.log(error))
  // }
  public primaryOrder = {};
//  const s:any
public secondaryOrder:any
  selectOrder(id: any, list): void{
    // this.shippingId = id;
    // this.selectedCategory = list;
    // this.contactAddressList.map(function(value){
    //   if(value.id==id){
    //     value['selected'] = true;
    //   }else{
    //     value['selected']=false;
    //   }
    // });
    let secondary
    this.primaryOrder=list.id
    // console.log(this.selectedCategory,"idddd")
    this.OrdersList.map(function(value){
      if (value.id == id){
        value['selected'] = true;
        // this.orderNo=value['order_no']
        // console.log(value.order_no,"primary Order")
      }else{
        value['selected']=false;
        // this.Orderno=value['order_no']
        secondary=value['id']
        // console.log(secondary,"secondary Order")
        }
        
    })
    this.secondaryOrder=secondary
// console.log(this.secondarOrder)
    this.disabledSave = false;

    // console.log(this.contactAddressList)
   //  console.log(this.shippingId)
  }
  MergeOrder(): void {
        this.dialogRef.close({success: true, data: this.primaryOrder});
      // console.log(this.Orderno,"orders")
      let final={
        master_order_id:this.primaryOrder,
        child_order_id:this.secondaryOrder
      }
console.log(final,"totalOrder")
        this.OrdersService
    
          .mergeOrder({  master_order_id:this.primaryOrder,
            child_order_id:this.secondaryOrder })
          .then(response => {
            if(response.result.success){
              this.success = true;
              this.dialogRef.close({ success: true, response: response.result.data.id });
              // console.log(response)
              console.log(response.result.data.id,"value")
              // console.log( this.dialogRef)
              let toast: object;
              toast = { msg: "Order merged successfully...", status: "success" };
              this.snackbar.showSnackBar(toast);
            }else{
              this.dialogRef.close({ success: false, response: response.result.data.id });
              let toast: object;
              toast = { msg:response.result.message, status: "success" };
              this.snackbar.showSnackBar(toast);
              console.log('dsfh')
            }
            
        })
      }

}
