import { language } from './../../language/language.module';
import { Param } from './../../custom-format/param';
import { SnakbarService } from './../../services/snakbar.service';
import { AddInventoryComponent } from './../../dialogs/add-inventory/add-inventory.component';
import { InventoryService } from './../../services/inventory.service';
import { Images } from './../../images/images.module';
import { DeleteInventoryComponent } from './../../dialogs/delete-inventory/delete-inventory.component';
import { Component, OnInit, ViewChild, ElementRef, Input, Inject, NgZone } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatepicker } from '@angular/material/datepicker';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject ,  Observable } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
// import { DeleteInventoryComponent } from '../../app/dialogs/delete-inventory/delete-inventory.component';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
// import { MatPaginator, MatSort } from '@angular/material';

import * as _ from 'lodash';
declare var $: any;
declare var App: any;


@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [InventoryService, Title, SnakbarService, CookieService],
	animations: [
		trigger('inventoryAnimate', [
			transition(':enter', [
				style({ transform: 'translateX(-100px)', opacity: 0 }),
				animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
			])
		])
	]
})


export class InventoryComponent implements OnInit {
	@ViewChild('stepper') stepper: MatStepper;
	@ViewChild('removeFocus') private removeFocus: ElementRef;
	// @ViewChild(MatPaginator) paginator: MatPaginator;
	//@ViewChild("manufactureDate", {static: false}) inputEl: ElementRef;
	public language = language;
	private images = Images;
	private batchList = new MatTableDataSource();
	public categoryList: Array<any> = [];
	private statusList: Array<any> = [];
	private InvproductsArr: Array<any> = [];
	private batchStatusArr: Array<any> = [];
	public addInventoryPermission: boolean;
	private mergePermission: boolean;
	orderPermission: boolean;
	public coaSpinner: boolean;
	public open: boolean;
	public selectedClientDetail: Array<any> = [];
	public selectedBatchList = [];
	public selectedBatch = {};
	private timeout;
	private id = 0;
	public showFilter = false;
	public selectedOrdersListBatch = [];
	public minMonth = 'MinMonth';
	public maxMonth = 'MaxMonth';
	private param = {
		page: 1,
		perPage: 12,
		sort: 'ASC',
		search: ''
	
	}

	public reports = {
		batchReportDt: {},
		batchesCoaDt: [],
		batch_id: ''
	};

	allCoaDetails : any = [];

	editForm: FormGroup;
	public reportsFooter: boolean = false;
	fetchingData: boolean;
	fetchingFiltersData: boolean = true;
	searching: boolean;
	fromDate: any = '';
	toDate: any = '';
	abc: boolean;
	editFormData: object;
	editable: boolean;
	table: boolean;
	noBatches: boolean;
	totalCount: number = 0;
	public listCount = 0;
	public submitForm : boolean  =false;
	public remainingQtyMsg: boolean;
	particalSize: boolean;
	addParticalIndex: any;

	constructor(
		@Inject(DOCUMENT) private document: any,
		private titleService: Title,
		private InventoryService: InventoryService,
		private location: Location,
		public dialog: MatDialog,
		private fb: FormBuilder,
		private snackbar: SnakbarService,
		private router: Router,
		private cookie: CookieService,
		zone: NgZone,

	) {
		this.inventoryPermissions();
		// zone.runOutsideAngular(() => {
		// 	setInterval(() => {
		// 		this.result_label_val = 
		// 	})
		// })
	}
	totalPages = 500;
	private perPage = 0;
	displayedColumns = ['name', 'mfd_date', 'exp_date', 'tot_qty', 'status_name'];
	params = {
		perPage: 12,
		page: 1,
		search: '',
		InvproductsArr: [],
		batchStatusArr: [],
		fromDate: ''
	}
	private timestamp: any;
	public showAddButton = false;
	ngOnInit() {
		this.titleService.setTitle(App['company_data'].InventoryTitle);
		this.getBatchList(true);
		this.showFilter = false;
		this.createForm();

		// console.log(App.user_roles_permissions)
		// const index = _.findIndex(App.user_roles_permissions, { category_id: event.value });

		// App.user_roles_permissions.forEach(obj => {
		// 	if(obj.code == 'add_inventory' && obj.selected) {
		// 		this.showAddButton = true;
		// 	} else {
		// 		this.showAddButton = false;
		// 	}
		// })
	}

	inventoryPermissions() {
		let Addinventory: boolean
		let merge: boolean
		let orderForBatch: boolean
		App.user_roles_permissions.map(function (value) {
			switch (value.code) {
				case "add_inventory":

					if (value.selected == true) {
						Addinventory = true
					} else {
						Addinventory = false

					}

					break;
				case "merge_inventory":
					if (value.selected == true) {
						merge = true
					} else {
						merge = false

					}
					break;
				case "order":
					if (value.selected == true) {
						orderForBatch = true
					} else {
						orderForBatch = false
					}

			}

		});
		this.orderPermission = orderForBatch
		this.mergePermission = merge
		this.addInventoryPermission = Addinventory
		// console.log(this.mergePermission, this.addInventoryPermission)

	}
	// ngAfterViewInit() {
	// 	this.batchList.paginator = this.paginator;
	//   }
	orderDetail(row) {
		// console.log(row)
		this.cookie.set('order_id', row.id);
		this.router.navigate(['/orders']);
	}

	goBack(stepper: MatStepper, indx?: number) {
		if (indx >= 0) stepper.selectedIndex = indx;
		else stepper.previous();
		this.editable = false;
	}

	goNext(stepper: MatStepper) {
		stepper.next();
	}

	// changeReportResult(data: any, event: any): void {
	// 	data.result_label_val = event.target.innerText;
	// 	this.reportsFooter = true;
	// }
	// changeReportLimit(data: any, event: any): void {
	// 	data.limits_label_val = event.target.innerText;
	// 	this.reportsFooter = true;
	// }
	// changeBatchReport(data: any, type: any, event: any): void {
	// 	data[type] = event.target.innerText;
	// 	this.reportsFooter = true;
	// 	// console.log(event)
	// }

	ValueChangeHandler(data?: any, powerData?: any, limitValue?: any): void {
		// console.log(data,powerData,limitValue)
		this.reportsFooter = true;
		let html;
		// data.name_value = html;
		let text = powerData.value.split('<span class="kpc">');
		if(text && text.length){
				html = powerData.value.replace('&nbsp;','').trim();
				text.forEach(function(res){
					html = html.replace('<span class="kpc">', '(').replace('<sup>','^').replace('</sup></span>',') ');
				});
				//to replace less than and greater than symbols and spaces with html code
				html = html.replace(new RegExp("&nbsp;", 'g'), "").replace(new RegExp("&lt;", 'g'), "<").replace(new RegExp("&gt;", 'g'), ">");
	        }else{
				html = powerData.value;
			} 
			html.trim();
		if (limitValue && powerData.value) {
			data.limits_label_val = html;
		} else {
			data.result_label_val = html;
		}

	}

	getInventoryDetails(stepper: MatStepper, row: any) {
		// console.log(row)
		// this.InventoryService.selectedBatch = row;
		// console.log(this.InventoryService.selectedBatch)
		// console.log(Object.assign(this.InventoryService.selectedBatch, row))
		// this.InventoryService.selectedBatch = Object.assign(this.InventoryService.selectedBatch, row)
		setTimeout(() => {
			this.router.navigate(['/inventory', row.id]);
			
		}, 1000);
		
		return
		stepper.next();
		this.selectedBatch = row;
		this.getDetail();
		this.getReportsData();
		this.getOrderDetails();
	}

	getReportsData(data?: any): void {
		this.InventoryService
			.getBatchCoa({ batch_id: this.selectedBatch['id'] })
			.then(response => {
				if (response.result.success) {
					this.reports.batchReportDt = response.result.data.batchReportDt;
					this.reports.batchesCoaDt = response.result.data.batchesCoaDt;
					this.reports.batch_id = response.result.data.batch_id;
				}
			});
	}
	fromDateChange(data) {
		// console.log(data)
		this.showFilter = true;
		this.fromDate = data.date;
	}
	toDateChange(data) {
		// console.log(data)
		this.showFilter = true;
		this.toDate = data.date;
	}
	cancelReportsTable(data?: any): void {
		this.getReportsData();
		this.reportsFooter = false;
	}

	saveReportsTable(data?: any): void {
		// console.log(this.reports);
		this.coaSpinner = true;
		let params = {
			batchReportDt:this.reports.batchReportDt,
			batch_id:this.reports.batch_id,
			batchesCoaDt:[]
		}
		
		this.reports.batchesCoaDt.forEach(function(res){

				res.limits_label_val = res.limitsLabelVal ? res.limitsLabelVal: res.limits_label_val;
				res.result_label_val = res.resultLabelVal ? res.resultLabelVal: res.result_label_val;
				res.name = res.nameLabelVal ? res.nameLabelVal: res.name;
				params.batchesCoaDt.push(res); 
		})

		let toast: object;
		this.InventoryService
			.saveReportData(params)
			.then(response => {
				if (response.result.success) {
					// console.log(this.reports.batchesCoaDt)
					toast = { msg: "Batch Report saved successfully.", status: "success" };
					this.snackbar.showSnackBar(toast);
					this.reportsFooter = false;
					this.getReportsData(false);
					this.coaSpinner = false;
				}
			});
	}
	public filterProdList = [];
	public prodName = '';
	getDetail(data?: any): void {
		this.InventoryService
			.BatchesList({ id: this.selectedBatch['id'] })
			.then(response => {
				if (response.result.success) {
					this.selectedBatchList = response.result.data.batchesDt;
					this.productList = response.result.data.productsDt;
					let prodId = this.selectedBatchList[0].product_types_id;
					let catId = this.selectedBatchList[0].category_id;

					this.filterProdList = this.productList.filter(obj => {
						return obj.category_id == catId
					  })

					this.productList.map(obj => {
						if(obj.id == prodId) {
							// console.log(obj.name)
							this.prodName = obj.name
						} 
					})



					// console.log(this.selectedBatchList)
				}
			})
			.catch(error => console.log(error))
		this.getBatchClientDetail();
	}
	getBatchClientDetail(data?: any): void {
		this.InventoryService
			.getBatchClientDetails({ batch_id: this.selectedBatch['id'] })
			.then(response => {
				if (response.result.success) {
					this.selectedClientDetail = response.result.data;
				}
			})
			.catch(error => console.log(error))
	}
	onScroll(): void {
		if (this.params.page < this.perPage && this.perPage != 0) {
			this.params.page++;
			this.getBatchList(false);
		}
	}
	public pagedata;

	getBatchList(clear: any, flag?: any): void {
		if (clear) {
			this.fetchingData = true;
		}
		if(flag == 'pagination') {
			this.pagedata = this.getPagams(this.paramsList, 'pagination');
			console.log(this.paramsList)
		} else {
			this.params.page = 1;
			this.pagedata = this.getPagams();
			console.log(this.paramsList)

		}
		this.InventoryService
			.BatchesList(this.pagedata)
			.then(response => {
				this.fetchingData = false;
				this.fetchingFiltersData = false;
				if (response.result.success) {
					this.totalCount = response.result.data.count;
					this.listCount = response.result.data.pageCount;
					this.perPage = response.result.data.lastpage;
					if (clear) {
						this.batchList.data = [];
					}
					let pre = this.batchList.data;
					let next = response.result.data.batchesDt;
					this.batchList.data = pre.concat(next);
					// console.log(this.batchList.data)

					if(flag != 'pagination') {
						this.categoryList = response.result.data.categoryDt;
						this.productList = response.result.data.productsDt;
	
						this.statusList = response.result.data.BatchStausDt;
					} 
				
				}
				this.fetchingData = false;
				this.fetchingFiltersData = false;
			})
			.catch(error => console.log(error))
	}
	public paramsList;
	loadMore(event) {
		console.log(event)
		this.paramsList = event;
		

		
		this.getBatchList(true, 'pagination');
	}

	getPagams(params?, flag?) {
		let data;
		if(flag == 'pagination') {
			 data = {
				batchStatusArr: [],
				search: params.search,
				perPage: params.perPage,
				page: params.page,
				InvproductsArr: [],
				fromDate: this.fromDate
			};
		} else {
		 data = {
			batchStatusArr: [],
			search: this.params.search,
			perPage: this.params.perPage,
			page: this.params.page,
			InvproductsArr: [],
			fromDate: this.fromDate
		};
	
		
	}
	if(this.filterApplied) {
		this.statusList.map(function (value) {
			if (value.selected) {
				data.batchStatusArr.push(value.id);
			}
		});
		this.categoryList.map(function (value, index) {
			if (value.selected) {
				data.InvproductsArr.push(value.id);
			}
		});
	}


		return data;
	}

	noRecords() {
		this.noBatches = true;
	}
	addInventory(data?: any, cb?): void {
		let dialogRef = this.dialog.open(AddInventoryComponent, {
			panelClass: 'alert-dialog',
			width: '580px',
			// height: '550px',
			data: {
				categoryList: this.categoryList,
				statusList: this.statusList,
				title: 'Add Batch',
				fieldsData: (data ? data : {})
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result.success) {
				if (cb) cb();
				let toast: object;
				this.getBatchList(true);
				toast = { msg: "Batch added successfully.", status: "success" };
				this.snackbar.showSnackBar(toast);

			}
		});
	}

	public remQty = '';
	onTotqtychanged(event) {
		// console.log(event)
		// this.remQty = event.target.value;

		this.editForm.patchValue({
			
		
			remain_quan:  event.target.value
		
		})
	}


	applyFilter(filterValue: string) {
		let param = {
			page: 1,
			perPage: 12,
			search: filterValue
		}
		this.fetchingData = true;
		this.searching = true;
		this.params.search = filterValue;

		if (this.timeout) clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			this.InventoryService
				.BatchesList(param)
				.then(response => {
					if (response.result.success) {
						this.batchList.data = response.result.data.batchesDt;
					}
					this.fetchingData = false;
					this.searching = false;
				})
		}, 1000);
	}

	productChange(data: any): void {
		data.selected = !data.selected;
		this.showFilter = true;
	}
	public filterApplied = false;
	filterInventory(): void {
		let selectedIds = [];
		this.filterApplied = true;
		let batchStatus_selectedIds = [];
		let toast: object;
		this.fetchingData = true;
		this.categoryList.map(function (value, index) {
			if (value.selected) {
				selectedIds.push(value.id);
			}
		});

		this.statusList.map(function (value, index) {
			if (value.selected) {
				batchStatus_selectedIds.push(value.id);
			}
		});

		this.InventoryService
			.BatchesList({ InvproductsArr: selectedIds, batchStatusArr: batchStatus_selectedIds, 
				fromDate: this.fromDate, toDate: this.toDate,
				 search: this.param.search,
				page: this.params.page,
				perPage: this.params.perPage
			 })
			.then(response => {
				if (response.result.success) {
					this.batchList.data = response.result.data.batchesDt;
					this.totalCount = response.result.data.count;
					this.listCount = response.result.data.pageCount;
					// console.log(this.batchList.data)
					// this.totalCount = response.result.data.count;
					toast = { msg: "Filters applied successfully.", status: "success" };
					this.snackbar.showSnackBar(toast);
				} else {
					this.noBatches = true;
				}
				this.fetchingData = false;
					this.searching = false;
			})
			.catch(error => console.log(error))
	}
	clearInventory(): void {
		this.showFilter = false;
		this.filterApplied = false;
		this.fromDate = '';
		this.param.page = 1;
		this.toDate = '';
		this.categoryList.forEach((product) => {
			product.selected = false;
		})

		this.statusList.forEach((product) => {
			product.selected = false;
		})
		this.getBatchList(true);
	}

	batchDelete(stepper: MatStepper): void {
		let inventoryDetails = this.getInvDetails();
		let dialogRef = this.dialog.open(DeleteInventoryComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			// height: '240px',
			data: inventoryDetails
		});

		dialogRef.afterClosed().subscribe(result => {
			this.removeFocus['_elementRef'].nativeElement
				.classList.remove('cdk-program-focused');
			if (result.success) {
				let toast: object;
				toast = { msg: "Batch deleted successfully.", status: "success" };
				// this.router.navigate(['inventory/list']); 
				// this.batchList.data = [];
				this.snackbar.showSnackBar(toast);

				this.getBatchList(true);
				stepper.previous();

				return true;

			}
		});
	}
	// datePicker():void {
	// 	this.removeFocus['_elementRef'].nativeElement
	//     			.classList.remove('cdk-program-focused');
	// }
	// goBack(stepper: MatStepper){
	//     stepper.previous();
	// }
	createForm(): void {
		this.editForm = this.fb.group({
			name: [null],
			product_name: '',
			products_types_id: '',
			category_id: '',
			product_types_id: '',
			batch_nbr: [null, Validators.required],
			tot_qty: [null, Validators.required],
			remain_quan: [null, Validators.required],
			mfd_date: [null, Validators.required],
			exp_date: [null],
			special_instructions: '',
			batch_status_id: [null],
			id: this.selectedBatch['id']
		})
	}
	setForm(data: any): void {
		// console.log(data)
		this.editForm.patchValue({
			name: data.name,
			product_name: data.product_name,
			batch_nbr: data.batch_nbr,
			products_types_id: data.products_types_id,
			category_id: data.category_id,
			product_types_id: data.product_types_id,
			tot_qty: data.tot_qty,
			remain_quan: data.remain_quan,
			mfd_date: new Date(data.mfd_date),
			special_instructions: data.special_instructions,
			batch_status_id: data.batch_status_id,
			exp_date: new Date(data.exp_date),
			id: this.selectedBatch['id']
		})
	}
	getInvDetails(): Object {
		let details = {
			name: '',
			product_name: '',
			batch_nbr: '',
			products_types_id: '',
			category_id: '',
			tot_qty: '',
			remain_quan: '',
			status_name: '',
			mfd_date: '',
			exp_date: '',
			special_instructions: '',
			id: this.selectedBatch['id']
		}
		if (this.selectedBatchList && this.selectedBatchList.length)
			Object.assign(details, this.selectedBatchList[0]);

		return details;
	}
	public productList = [];
	editInventory(): void {
		if (!this.editable)
			this.editable = true;
		let inventoryDetails = this.getInvDetails();
		this.editFormData = inventoryDetails;
		this.setForm(inventoryDetails);
		this.InventoryService
			.BatchesList({ id: this.selectedBatch['id'] })
			.then(response => {
				if (response.result.success) {
					this.categoryList = response.result.data.categoryDt;
					this.productList = response.result.data.productsDt;
					this.statusList = response.result.data.BatchStausDt;

					let catId = this.selectedBatchList[0].category_id;
					let prodId = this.selectedBatchList[0].product_types_id;

					// this.filterProdList = this.productList.filter(obj => {
					// 	return obj.category_id == catId
					//   })

					this.filterProdList = this.productList.filter(obj => {
						return obj.category_id == catId
					  })

					  this.editForm.patchValue({
			
		
						product_types_id:  prodId
					
					})

					// console.log(this.filterProdList)

					if(this.statusList && this.statusList.length) {
						this.statusList = this.statusList.filter(obj => {
						  return obj.name != "Exhausted";
						})
					  }
				}
			})
			.catch(error => console.log(error))

	}
	public arr = [];
	selectType(event) {
		// console.log(event)
		// this.showProdDrpdown = true;
		this.arr = [];
		// const index = _.findIndex(this.productsList, { category_id: event.value });
	
	   this.filterProdList = this.productList.filter(obj => {
		  return obj.category_id == event.value
		})
	
	
	  // this.selectedProduct = this.productsList[index].category_id;
	//   console.log(this.filterProdList)
	
	
	  }
	  
	  selectProduct(event) {
		// console.log(event)
		this.arr = [];
	
		this.arr.push(event.value)
		// console.log(this.arr)
		if(this.arr.length) {
			this.showProdErrorMsg = false;
		} else {
			this.showProdErrorMsg = true;
		}
	
	  
	  // console.log( this.removeDuplicates(this.arr))
	
	  }

	resetInventory(form: any) {

		this.editInventory();
		this.editable = false;
	}

	addParticalSize(data) {
		//let index = this.reports.batchesCoaDt.indexOf(data);
		let index = _.findIndex(this.reports.batchesCoaDt, (obj:any)=>{ return obj.id == data.id; })
		// console.log(index,'data id');		
		this.particalSize = true
		let addPartical = {
			batch_id : App.batchId,
			coa_id: '',
			flag: false,
			id: '',
			is_editable: true,
			items_default: '',
			level: '',
			limits_label_val: '',
			name: '',
			result_label_val: '',
			powerConvert: true,
			powerConvertLimit: true
		}
		
		// this.allCoaDetails = this.reports.batchesCoaDt;
		if(index > -1){
			this.allCoaDetails = this.reports.batchesCoaDt.splice(index+1,0,addPartical);
		}
		
		// this.addParticalIndex = index+1
		// console.log(this.addParticalIndex)
	}
	public showProdErrorMsg = false;
	update(form: any) {
		let toast: object;
		let inventoryDetails = this.getInvDetails();
		let i = Object.assign(inventoryDetails)
		let data = Object.assign(this.editForm.value);
		// data.product_types_id = this.arr;
		this.editForm.value['product_types_id'] = this.arr;
		// if(i.tot_qty < data.remain_quan) {
		// 	this.remainingQtyMsg = true;
		// 	return false;
		// }
		// console.log(form)
		// console.log(form.value.product_types_id)
		if(!form.value.product_types_id.length) {
			this.showProdErrorMsg = true;
			return;
		} else {
			this.showProdErrorMsg = false;
		}
		
		if (form.valid) {
			this.InventoryService
				.addBatch(this.editForm.value)
				.then(response => {
					if (response.result.success) {
						toast = { msg: "Batch Details updated successfully.", status: "success" };
						this.batchList.data.push(data);
						this.selectedBatch = data;
						this.snackbar.showSnackBar(toast);
						this.editable = false;
						this.getDetail();
						this.getBatchList(true);

					} else {
						toast = { msg: response.result.message, status: "error", success: 'false' };
						this.snackbar.showSnackBar(toast);

					}
				})
		}
	}
	searchBatches(filterValue: string, event?: any) {
		
		let param = {
			page: 1,
			perPage: 12,
			search: filterValue
		}
		this.params.search = filterValue;
		this.pagedata = this.getPagams()
		this.searching = true;
		this.param.search = filterValue;
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => {
			this.InventoryService
				.BatchesList(this.pagedata)
				.then(response => {
					if (response.result.success) {
						// this.noBatches = false;
						this.batchList.data = response.result.data.batchesDt;
						this.totalCount = response.result.data.count;
						this.listCount = response.result.data.pageCount;
					}
					this.searching = false;
					// else this.noRecords();
				})
		}, 1000);
	}
	openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
	}
	datePickerChange() {
		this.showFilter = true;
	}
	reportsDatePickerChange() {
		this.reportsFooter = true;
	}
	/* Merge Inventory */
	mergeInventory(stepper: MatStepper): void {
		// this.router.navigate(['/inventory-merge']);
		// stepper.selectedIndex = 2
	}
	//new line a

	addBatch(data): void {
		this.addInventory(data, () => {
			this.stepper.selectedIndex = 0;
		})
	}

	getOrderDetails(data?: any): void {
		this.InventoryService
			.OrdersListBatch({ batches_id: this.selectedBatch['id'] })
			.then(response => {
				if (response.result.success) {
					this.selectedOrdersListBatch = response.result.data.batchesDt;
				}
			});
	}

	changeBatchReport(data: any, type: any, event: any): void{
		data[type] = event.target.innerText;
		this.reportsFooter = true;
	}

	changeReportResult(data: any, event: any): void{
		this.reportsFooter = true;
		let name = event.target.innerText;
		data.name = "";
		this.timeout = setTimeout(() => {
			data.name = name;
		},1000);
	}

	
	onKey(event: any) {
		this.reportsFooter = true;		
	  }
	  powerConversion(coa) {		
		  coa.powerConvert = true;
	  }
	  powerConvertLimitLabel(coa) {
		coa.powerConvertLimit = true
	  }
	  hideDiv(coa) {
		coa.powerConvert = false;
	  }
	  hideDivLimitLable(coa) {
		coa.powerConvertLimit = false
	  }
}
