import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { Param } from './../../custom-format/param';
import { AdminService } from './../../services/admin.service';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-change-shipper-address',
  templateUrl: './change-shipper-address.component.html',
  styleUrls: ['./change-shipper-address.component.scss'],
  providers: [OrdersService,SnakbarService]
  
})
export class ChangeShipperAddressComponent implements OnInit {
  contactAddressList: Array<any> = [];
  shippingId:any;
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
    this.getContacts(this.param);
  }
  getContacts(param: object): void {
  //  console.log("here")
    this.adminService
      .getContactsList(param)
      .then(response => {
        if (response.result.success) {
          let data = response.result.data.companyShpAddrDt;
          data.map(res => {
            res['selected'] = false;
            this.contactAddressList.push(res);
            // console.log( this.contactAddressList)
          });
        }
     
      })
      .catch(error => console.log(error))
  }
  public selectedCategory = {};
  selectAddress(id: any, list): void{
    this.shippingId = id;
    this.selectedCategory = list;
    this.contactAddressList.map(function(value){
      if(value.id==id){
        value['selected'] = true;
      }else{
        value['selected']=false;
      }
    });
    this.disabledSave = false;

    // console.log(this.contactAddressList)
   //  console.log(this.shippingId)
  }
  changeShipperAdd(): void {
        this.dialogRef.close({success: true, data: this.contactAddressList});
        this.OrdersService
    
          .acceptOrder({ id: this.data, shipper_id: this.shippingId })
          .then(response => {
              this.success = true;
              this.dialogRef.close({success: true, data: this.contactAddressList});
              let toast: object;
              toast = { msg: "Shipper Address Changed successfully...", status: "success" };
              this.snackbar.showSnackBar(toast);
        })
      }

}
