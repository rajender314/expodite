import { OrdersComponent } from './../../orders-module/orders/orders.component';
// import { OrdersComponent } from './../../orders-module/orders.component';
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { OrdersService } from '../../services/orders.service';
import *as _ from 'lodash';
@Component({
	selector: 'app-add-drums',
	templateUrl: './add-drums.component.html',
	styleUrls: ['./add-drums.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AddDrumsComponent implements OnInit {
	drumCounts: FormGroup;
	drumList: Array<any>;
	drumsArray: FormArray;
	public sample: Array<any>;
	bathcList : Array<any>;
	drumData = false;
	public params = {
		orders_id : '',
		drumsArray:  [],
}
	constructor(
		private fb: FormBuilder,
		private OrdersService: OrdersService,
		public dialogRef: MatDialogRef<OrdersComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { dialogRef.disableClose = true; }

	ngOnInit() {
		this.createForm();
		this.drumListDetail();
	}
	createForm() {
		this.drumCounts = this.fb.group({
			drumsArray: this.fb.array([this.drumGroup()])
		})
	}

	drumListArray(indx = 0) {
		return (<FormGroup>(<FormArray>this.drumCounts.get('drumsArray')).controls[indx]).controls.drumList as FormArray;
	}

	drumGroup() {
		return this.fb.group({
			drumName: '',
			drumList: this.fb.array([]),
			drumCount:'',
			container_list:'',
			batch  : ''

		})
		
	}
	drumListDetail() {
		this.OrdersService
			.getPackageDetailsList({ orders_id: this.data })
			.then(response => {
				if (response.result.success) {
					this.drumList = response.result.data.packageDetails;
					this.bathcList = response.result.data.batchDetails;
					// this.drumListArray.controls.map((o, i) => {
					// 	this.drumListArray.removeAt(i);
					// })
					this.drumList.map(o => {
						this.drumListArray(0).push(this.fb.group({
							value: o.value,
							quantity: o.quantity,
							id: o.id
						}))
					})
					// console.log(this.drumListArray)
					// console.log(this.drumList);
					// let sample2 = [];
					// _.map(this.drumList, function (list) {
					// 	_.map(list, function (item) {
					// 		sample2.push(item);
					// 	})
					// })
					// this.sample = sample2;
					// console.log(this.sample);
				}
			})
		}
	addDrums() {
		const control = <FormArray>this.drumCounts.controls['drumsArray'];
		control.push(this.drumGroup());
		this.drumList.map(o => {
						this.drumListArray(control.length - 1).push(this.fb.group({
							value: o.value,
							quantity: o.quantity,
							id: o.id
						}))
					})
	}
	saveDrums(form) {
		console.log(form);
		this.params.orders_id = this.data;
		let drumlistValues = this.drumList;
	    const formvalues = form;
		
		console.log(this.params);
		form.value.drumsArray.map(val => {
			if(!val.drumList){
             val['drumList'] = drumlistValues;
			} 
			console.log(val);
            
			val.drumList.map(drumcount => {
				// console.log(val);
				// console.log(drumcount);
				val.container_list.map(containerValue => {
					if(containerValue.id === drumcount.id) {
						containerValue.quantity = drumcount.quantity
					}
				})
                
			})

		})
		// console.log(form.value);
		this.params.drumsArray = form.value.drumsArray;
		this.params.drumsArray.map(val => {
			delete val.drumList
		});
		this.OrdersService
			.saveDrumDetail(this.params)
			.then(response => {
				if(response.result.data) {
					this.dialogRef.close({ success: true, response: response });
				}else {
				
					this.drumData = true;

				}
			})
	}
	selectedValue(value) {
// console.log(value);
// console.log()
	}
	removeDrums(index: number) {
		const control = <FormArray>this.drumCounts.controls['drumsArray'];
		control.removeAt(index);
	}
}
// 