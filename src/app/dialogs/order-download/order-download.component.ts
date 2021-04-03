import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { trigger,style,state, transition,animate,keyframes,query,stagger } from '@angular/animations';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-order-download',
  templateUrl: './order-download.component.html',
  styleUrls: ['./order-download.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers:[OrdersService],
  animations: [
    trigger('stepTransition', [
      state('previous', style({height: '100px', visibility: 'hidden'})),
      state('next', style({height: '100px', visibility: 'hidden'})),
      state('current', style({height: '*', visibility: 'visible'})),
      transition('* <=> current', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]

})
export class OrderDownloadComponent implements OnInit {
  
  constructor( public dialogRef: MatDialogRef<OrdersComponent>,
   
    @Inject(MAT_DIALOG_DATA) public data: any, 
    
    private OrdersService: OrdersService, private snackbar: SnakbarService,) { dialogRef.disableClose = true;}

 
   
    orderDownload = true;
  
  ngOnInit() {
    console.log(this.data)
  }
 
  
  exportPdf(stepper: MatStepper): void {
    this.dialogRef.close();
    let toast: object;
    toast = { msg: 'The documents are being processed, Download will begin shortly...', status: 'success' };
    this.snackbar.showSnackBar(toast); 
    this.OrdersService
      .exportOrdersPdf({ id: this.data.checkOrdersId, invoice_id: this.data.inovice_id })
      .then(response => {
        if (response.result.success) {
          // setTimeout(() => {

          //   this.dialogRef.close();
          // }, 3000)
          
        }
        else {
          toast = { msg: 'Error in Downloading documents.', status: "error" };
          this.snackbar.showSnackBar(toast);
        }
      });    
      
  }
}
