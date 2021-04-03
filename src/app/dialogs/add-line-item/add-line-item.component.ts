import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-add-line-item',
  templateUrl: './add-line-item.component.html',
  styleUrls: ['./add-line-item.component.scss'],
  providers: [OrdersService],
})
export class AddLineItemComponent implements OnInit {

  lineItemForm: FormGroup;
	public disabledSave = false;

  constructor(
    private fb: FormBuilder,
    private OrdersService: OrdersService,
    public dialogRef: MatDialogRef<OrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {dialogRef.disableClose = true; }

  ngOnInit() {
    this.generateLineItemForm();
  }
  public noWhitespaceValidator(control: FormControl) {
 
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    // [Validators.required , this.noWhitespaceValidator]]
    return isValid ? null : { 'whitespace': true };
}
  generateLineItemForm(): void {
    this.lineItemForm = this.fb.group({
      lineItem: [null, [Validators.required , this.noWhitespaceValidator]],
      lineItemValue: [null, Validators.required],
    });
  }

  addLineItem(form: any){
    this.disabledSave = true;
    setTimeout(() => {
      form.get('lineItem').markAsTouched({ onlySelf: true });
      form.get('lineItemValue').markAsTouched({ onlySelf: true });
      if(form.valid){
        this.disabledSave = true;
  
        this.generateInvoice();
      } else {
        this.disabledSave = false;
  
      }
    }, 500);
   
  }

  generateInvoice(){
    let config = {
      orders_id: 0
    }
    let param = Object.assign(config,this.data.invoice);
    let lineItem = {
      key: this.lineItemForm.value.lineItem,
      value: this.lineItemForm.value.lineItemValue
    };
    param.extra_col.push(lineItem);
    this.OrdersService
    .generateInvoice(param)
    .then(response => {
      this.dialogRef.close({ success: true, response: response });
    });
  }

}
