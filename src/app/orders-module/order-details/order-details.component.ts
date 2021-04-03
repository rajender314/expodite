import { Component, OnInit, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource } from '@angular/material/table';
import { ViewEncapsulation } from '@angular/core';







import { Images } from '../../images/images.module';
import { InventoryService } from '../../services/inventory.service';
import { OrdersService } from '../../services/orders.service';
import { OrganizationsService } from '../../services/organizations.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddInventoryComponent } from '../../dialogs/add-inventory/add-inventory.component';
import { SnakbarService } from '../../services/snakbar.service';
import { FileUploader, FileUploadModule } from 'ng2-file-upload';
import { language } from '../../language/language.module';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { AddBatchNumberComponent } from '../../../app/dialogs/add-batch-number/add-batch-number.component';
import { AddLineItemComponent } from '../../../app/dialogs/add-line-item/add-line-item.component';
import { DeleteLineItemComponent } from '../../../app/dialogs/delete-line-item/delete-line-item.component';
import { MarkAsPaidComponent } from '../../../app/dialogs/mark-as-paid/mark-as-paid.component';
import { OrderDownloadComponent } from '../../../app/dialogs/order-download/order-download.component';
import { PdfPreviewComponent } from '../../dialogs/pdf-preview/pdf-preview.component';
import { CookieService } from 'ngx-cookie-service';
import { MatExpansionModule } from '@angular/material/expansion';
import { CancelOrderComponent } from '../../../app/dialogs/cancel-order/cancel-order.component';
import { DeliverOrderComponent } from '../../../app/dialogs/deliver-order/deliver-order.component';
import { ChangeShipperAddressComponent } from '../../../app/dialogs/change-shipper-address/change-shipper-address.component';
import { AddDrumsComponent } from '../../../app/dialogs/add-drums/add-drums.component';
import { EmailDocumentsComponent } from '../../../app/dialogs/email-documents/email-documents.component';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { validateBasis, CLASS_NAME } from '@angular/flex-layout';
import { Lightbox } from 'ngx-lightbox';
import * as $ from 'jquery';
import { CreateOrderComponent } from '../../dialogs/create-order/create-order.component';
import { Router, ActivatedRoute } from '@angular/router';
declare var App: any;



@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('ordersAnimate', [
			transition(':enter', [
				style({ transform: 'translateX(-100px)', opacity: 0 }),
				animate('500ms cubic-bezier(0.35, 1, 0.25, 1)', style('*'))
			])
		])
	]
})
export class OrderDetailsComponent implements OnInit {

  private css = '@page { size: landscape; }';
	private head = document.head || document.getElementsByClassName('adc-sheet');
	private style = document.createElement('style');
	private App = App;
	public userDetails: any;
	public orderButton: any;
	public collapseOut: any;
	public clientPermission: any;
	public factoryPermission: boolean;
	containsMilk: boolean;
	getExportData: any;
	totalCount: any;
	public submitShippingForm: boolean = false;
	public language = language;
	public images = Images;
	public open = false;
	blockContent: boolean;
	private productList: Array<any> = [];
	batchNum: string;
	batchNumArray: Array<any>
	getSdfData: any;
	getConcernData: any;
	checked: boolean;
	totalSpinner: boolean;
	private timeout;
	packagePrint: boolean;
	buttonName: boolean;
	packageCompleted: boolean;
	disablePayment = true;
	private showFilter = false;
	fetchingData = true;
	fetchOrder: boolean;
	downloadStatus: boolean;
	showDrumsList = false;
	filtersLoader = true;
	public icon: boolean = false;
	public postIcon:boolean = false;
	public show: boolean = true;
	public activePayment = false;
	public showPackage: boolean = true;
	public showShipping: boolean = true;
	public showUom: boolean = true;
	public showMsds: boolean = true;
	public showNonhazardous: boolean = true;
	public showSdf: boolean = true;
	public showExportvalue: boolean = true;
	public showDeclaration: boolean = true;
	public showShippers: boolean = true;
	public showAdcsheet: boolean = true;
	public showDeclarationIncentive: boolean = true;
	public showScomatDeclaration: boolean = true;
	public showNoDatFound = false;
	public concern: boolean = true;
	invoiceGenerateLoader:boolean = false;
	noShippingBill = false;
	noShippingExportBill = false;
	noShippingExportDate = false;
	noShippingDate = false;
	activeState: boolean;
	editable: boolean;
	editExport: boolean;
	coaShow: any;
	editCoa: boolean;
	concernEditable: boolean;
	shippingActiveState: boolean;
	public modPoNum:any
	public showInvoice = true;
	public showTaxInvoice = true;
	public showCoa: boolean = true;
	public showOrigin: boolean = true;
	public showinsurance: boolean = true;
	public showAirway: boolean = true;
	public selectedOrderStatus: any;
	searching: boolean;
	shippingForm: FormGroup;
	totalPages: number = 2500;
	ActivityLog: boolean;
	editShipping: boolean = true;
	disableCancel: boolean;
	ordersDownload: boolean;
	added: boolean;
	hideShipperAddress: boolean = false;
	public matSelectOpen = false;
	orderFormCompanyDetails: any;
	public hidePaidBtn: boolean = true;
	// priceQuantityDisable: boolean = false;
	containerId: any;
	public imagUploadFlag: any;
	public getFileFlag: any;

	displayedColumns = ['order_product_id', 'product_name', 'product_quantity', 'product_uom', 'product_price', 'product_price_total'];
	params = {
		pageSize: 25,
		page: 1,
		search: ''
	}

	toppings = new FormControl();
	paymentType = [
		
	];
	public docsList = {
		standardLinks:[
			{ id: 0, name: "Activity", selected: true, class: "activity", function: 'moveToActivity', imgSrc: this.images.activity_small },
			{ id: 1, name: "Order Details", selected: true, class: "details", function: "moveToDetails", imgSrc: this.images.orders_small },
			{ id: 2, name: "Invoice", selected: true, class: "invoice", function: "moveToInvoice", imgSrc: this.images.invoice_small },
			{ id: 3, name: "Packing Details", selected: true, class: "packaging", function: "moveToPackaging", imgSrc: this.images.pkgDetails_small },
			{ id: 5, name: "UOM", selected: true, class: "uom", function: "moveToUom", imgSrc: this.images.pkgDetails_small },
			{ id: 5, name: "moveToPackaging", selected: true, class: "moveToPackaging", function: "moveToPackaging", imgSrc: this.images.pkgDetails_small },

			{ id: 4, name: "COA", selected: true, class: "coa", function: "moveToCoa", imgSrc: this.images.coa_small },
			{ id: 99, name: "Shipping Details", selected: true, class: "shipping", function: "moveToShipping", imgSrc: this.images.shippingDetails_small },
		],
		preShip:[
			{ id: 5, name: "MSDS Form", selected: true, class: "msdsForm", function: "moveToMsdsForm", imgSrc: this.images.pdf_download },
			{ id: 6, name: "Non Hazardous Certificate", selected: true, class: "nonHazardous", function: "moveToNonHazardous", imgSrc: this.images.pdf_download },
			{ id: 7, name: "Form SDF", selected: true, class: "Formsdf", function: "moveToFormSdf", imgSrc: this.images.pdf_download },
			{ id: 8, name: "Export Value Declaration", selected: false, class: "Exportvalue", function: "moveToExportValue", imgSrc: this.images.pdf_download },
			{ id: 9, name: "Declaration", selected: false, class: "Declaration", function: "moveToDeclaration", imgSrc: this.images.pdf_download },
			{ id: 10, name: "Shipper's Letter", selected: false, class: "Shipperletter", function: "moveToShipperLetter", imgSrc: this.images.pdf_download },
			{ id: 11, name: "ADC Sheet", selected: false, class: "Adcsheet", function: "moveToAdcSheet", imgSrc: this.images.pdf_download },
			{ id: 12, name: "Declaration For Incentive", selected: false, class: "Incentivedeclaration", function: "moveToIncentive", imgSrc: this.images.pdf_download },
			{ id: 13, name: "Scomat Declaration", selected: false, class: "Scomatdeclaration", function: "moveToScomat", imgSrc: this.images.pdf_download },
			{ id: 14, name: "Turn Over Declaration", selected: false, class: "Concern", function: "moveToConcern", imgSrc: this.images.pdf_download },
			{ id: 15, name: "Ad Code", selected: false, class: "Adcode", function: "moveToAdcode", imgSrc: this.images.pdf_download },
			{ id: 16, name: "SSI", selected: false, class: "Ssi", function: "moveToSsi", imgSrc: this.images.pdf_download },
			{ id: 17, name: "Check List", selected: false, class: "Unit", function: "moveToUnit", imgSrc: this.images.pdf_download },
		],
		postShip: [
			{ id: 15, name: "Country Of Origin", selected: true, class: "Origin", function: "moveToOrigin", imgSrc: this.images.pdf_download },
			{ id: 16, name: "Insurance", selected: true, class: "insurance", function: "moveToInsurance", imgSrc: this.images.pdf_download },
			{ id: 17, name: "Shipping Bill", selected: true, class: "airway", function: "moveToAirway", imgSrc: this.images.pdf_download }]
	};
	private timestamp: any;
	enableInvoice: boolean = false;
	clickedGenerateInvoice: boolean = false;
	showDocuments = false;
	taxInvoiceDocument = true;
	public orders = {
		packageStatus: '',
		data: [],
		status: [],
		shippingAddress: [],
		productsList: [],
		organizations: [],
		shipping_data: [],
		expectedDeliveryDate: [
			{
				id: 1,
				name: 'Expected Delivery Date',
				selected: false
			}
		],
		selectedClients: new FormControl([]),
		client_search: '',
		mfg_date: '',
		selectedOrder: {
			client_name: '',
			client_image: '',
			date_added: '',
			id: '',
			order_no: '',
			image: '',
			po_nbr: '',
			po_url: '',
			product_name: '',
			status: '',
			total_amount: '',
			total_quantity: '',
			orders_types_id: '',
			tareWeight: 0,
			netWeight: 0,
			grossWeight: 0,
			special_instructions: '',
			po_date: '',
			line_item: ''
		},
		billingAddr: {
			bill_address1: '',
			bill_address2: '',
			bill_countrty: '',
			bill_postal_code: '',
			bill_state: ''
		},
		shippingAddr: {
			ship_address1: '',
			ship_address2: '',
			ship_countrty: '',
			ship_postal_code: '',
			ship_state: ''
		},
		notifyAddr: {},
		companyShpAddrDt: {
			ksm_address1: '',
			ksm_address2: '',
			ksm_city: '',
			ksm_state: '',
			ksm_countrty: '',
			ksm_postal_code: '',
			ksm_gstin_no: '',
		},
		productsData: new MatTableDataSource(),
		showDetailView: false,
		packageOrders: [],
		packing: [],
		sum: {},
		invoice: [],
		shipping_id: 0,
		mode_transport_ids: [],
		mode_of_transport:[],
		CoaDetails: [],

		activityDetails: []
	};
	public transportModeList = [
		{id: 1, name: 'Air'},
		{id: 2, name: 'Sea'}
	]
	public paymentStatus = false;
	public showNotifyAddress = false;
	public CoaDetails = [];
	public reports = {
		batchReportDt: {},
		batchesCoaDt: [],
		batch_id: ''
	};
	private checkOrdersPdf = {
		checkOrders: [],
		checkOrdersId: ''
	}
	private sdfData = {
		shipping_bill_no: '',
		orders_id: this.orders.selectedOrder.id || 0,
		entry_date: '',
		check_date: '',
		id: ''
	};
	public sdfFormDates: FormGroup;
	public exportValue = {
		e_shipping_bill_no: '',
		orders_id: this.orders.selectedOrder.id || 0,
		e_entry_date: '',

	}
	public packageDescription;
	data = {
		id: '',
		selectedStatus: [],
		selectedProducts: [],
		selectedClients: this.orders.selectedClients.value,
		client_search: this.orders.client_search,
		manifacture_date: this.orders.mfg_date,
		search: this.params.search,
		pageSize: this.params.pageSize,
		page: this.params.page,
	};
	private concernData = {
		price: '',
		year1: '',
		year2: '',
		export1: '',
		export2: '',
		domestic1: '',
		domestic2: ''
	}


	public clientsFilterCtrl: FormControl = new FormControl();
	protected _onDestroy = new Subject<void>();
	public activeTab = 'activity';
	reportsFooter: boolean;
	private activateScroll = true;
	public otherDocs = [];
	private param: any = {
		page: 1,
		perPage: 25,
		sort: 'ASC',
		search: '',
	}
	@ViewChild('stepper') stepper: TemplateRef<any>;
	@ViewChild('scrollContainer') scrollContainer: TemplateRef<any>;
	@ViewChild('activity') activity: TemplateRef<any>;
	@ViewChild('details') details: TemplateRef<any>;
	@ViewChild('packaging') packaging: TemplateRef<any>;
	@ViewChild('uom') uom: TemplateRef<any>;
	@ViewChild('primaryPackaging') primaryPackaging: TemplateRef<any>;
	@ViewChild('invoice') invoice: TemplateRef<any>;
	@ViewChild('coa') coa: TemplateRef<any>;
	@ViewChild('shipping') shipping: TemplateRef<any>;
	@ViewChild('msdsForm') msdsForm: TemplateRef<any>;
	@ViewChild('nonHazardous') nonHazardous: TemplateRef<any>;
	@ViewChild('Formsdf') Formsdf: TemplateRef<any>;
	@ViewChild('Exportvalue') Exportvalue: TemplateRef<any>;
	@ViewChild('Declaration') Declaration: TemplateRef<any>;
	@ViewChild('Shippersletter') Shippersletter: TemplateRef<any>;
	@ViewChild('Adcsheet') Adcsheet: TemplateRef<any>;
	@ViewChild('Incentivedeclaration') Incentivedeclaration: TemplateRef<any>;
	@ViewChild('Scomatdeclaration') Scomatdeclaration: TemplateRef<any>;
	@ViewChild('Concern') Concern: TemplateRef<any>;
	@ViewChild('Adcode') Adcode: TemplateRef<any>;
	@ViewChild('Lut') Lut: TemplateRef<any>;
	@ViewChild('Iec') Iec: TemplateRef<any>;
	@ViewChild('Ssi') Ssi: TemplateRef<any>;
	@ViewChild('Unit') Unit: TemplateRef<any>;
	@ViewChild('SezUnit') SezUnit: TemplateRef<any>;

	@ViewChild('taxInvoice') taxInvoice: TemplateRef<any>;
	@ViewChild('Otherdocs') Otherdocs: TemplateRef<any>;

	@ViewChild('origin') origin: TemplateRef<any>;
	@ViewChild('insurance') insurance: TemplateRef<any>;
	@ViewChild('airway') airway: TemplateRef<any>;
	attachments = [];
	originFileAttachments = [];
	insuranceAttachments = [];
	airwayAttachments = [];
	shippingAttachments = [];
	pointerEvent: boolean;
	invalidText: boolean;
	uploadError: boolean;
	sizeError: boolean;
	public onLoadFiles = ['origin', 'insuranceFlag', 'shipping', 'Bill', 'landing'];
	
	// public imageUploadUrl = "";
	public fileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/xlsx',];
	public imageUploadUrl = App.base_url + 'addOrderAtt?orders_id=' + this.orders.selectedOrder.id;
	// public screenOrientation: any;
	private hasDropZoneOver: boolean = false;
	private uploader: FileUploader = new FileUploader({
		url: this.imageUploadUrl,
		// allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
		maxFileSize: 5 * 1024 * 1024,
		autoUpload: true
	});
	


	public containerName: any = [];
	public coaCompanyName: any;
	sendDocumentMails: boolean = false;
	adminUser: boolean;
	admin_access: boolean;
	coaLineItemEdit: boolean = false;
	poDate: boolean = true;
	coalineItem: any;
	shipperId: any;
	public po_date2 = new Date(this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : "");

	fileOverBase(event): void {
		this.hasDropZoneOver = event;
	}

	fileDrop(event): void {
	}
	fileSelected(event): void {
		console.log(event)
	}
	setImageUrl() {
		this.imageUploadUrl = App.base_url + 'addOrderAtt?orders_id=' + this.orders.selectedOrder.id;
		this.uploader.setOptions({ url : this.imageUploadUrl})
	}

	addLineItem(): void {
		let dialogRef = this.dialog.open(AddLineItemComponent, {
			panelClass: 'alert-dialog',
			width: '550px',
			data: { invoice: this.orders.invoice[0].Inovice }
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				this.orders.invoice = result.response.result.data.Invioce;
			}
		});
	}

	deleteAttachment(index: number, file: any): void {
		this.OrdersService
			.deleteAttachment({ id: file.id, att_id: file.att_id })
			.then(response => {
				if (response.result.success) {
					this.pointerEvent = false;
					this.attachments.splice(index, 1);
				}
			});
	}
	moveToOtherdocs(file: any) {
		// console.log(file);
		this.otherDocs.push(file);
		// console.log(this.otherDocs)
		this.activateScroll = false;
		this.activeTab = 'Otherdocs';
		if (this.Otherdocs && this.Otherdocs['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Otherdocs['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	changePrice(product: any, event: any, value: any) {
		let numberRegex = /[0-9]/g;
		let price: any;
		let productId: any;
		let quantity: any;
		let amount: any;
		// console.log(product)
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					if (value == 0) {
						price = event.target.innerText;
						productId = product.order_product_id
						this.OrdersService
							.changePrice({ price: price, order_product_id: productId, quantity: product.product_quantity })
							.then(response => {
								if (response.result.success) {
									this.productPriceChange(response.result.data)
									this.getInvoiceData();
									let toast: object;
									toast = { msg: 'Updated Succesfully', status: 'success' };
									this.snackbar.showSnackBar(toast); 
								} 
								else {
									let toast: object;
									toast = { msg: 'Failed to Update', status: 'error' };
									this.snackbar.showSnackBar(toast); 
								}
							});
					} else if (value == 1) {
						quantity = event.target.innerText;
						productId = product.order_product_id
						this.OrdersService
							.changePrice({ quantity: quantity, order_product_id: productId, price: product.product_price_number })
							.then(response => {
								if (response.result.success) {
									this.productPriceChange(response.result.data)
									this.getInvoiceData();
									let toast: object;
									toast = { msg: 'Updated Succesfully', status: 'success' };
									this.snackbar.showSnackBar(toast); 
								}
								else {
									let toast: object;
									toast = { msg: response.result.message, status: 'error' };
									this.snackbar.showSnackBar(toast); 
								}
							});

					}

				}
			}, 1000);
		} else {
			return false;
		}
	}
	changeInvoicePackCharge(index, event) {
		let numberRegex = /[0-9]/g
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.pack_charge = event.target.innerText;
					this.updateKeyValue();
				}
			}, 1000);
		} else {
			return false;
		}
	}

	productPriceChange(data: any) {
		this.data.id = data.orders_id;
		this.OrdersService
			.getOrdersList(this.data)
			.then(response => {
				let selectedOrderDetails = response.result.data.totalordersDt[0].list[0]
				this.orders.selectedOrder = selectedOrderDetails.orders;
				console.log(this.orders.selectedOrder)
				this.orders.productsData.data = selectedOrderDetails.productsData;
				// console.log(this.orders.productsData)

			});
	}
	public compnayDetails: any;
	getComapnyDetails() {
		this.organizationsService
			.getCompanyDetails()
			.then(response => {
				if(response.result.success) {
					this.compnayDetails = response.result.data;	
				}
				// console.log(this.orders.productsData)

			});
	}
	cancelsdf() {
		this.editable = false
		// this.noShippingBill = false;
		// this.noShippingDate = false;
	}
	cancelShip() {
		this.shippingActiveState = false;
		this.getShippingAddressDetails();
		this.editShipping = true;
	}
	cancelConcern() {
		this.concernEditable = false
	}
	cancelExport() {
		this.editExport = false
		this.noShippingExportBill = false;
		this.noShippingExportDate = false;
	}
	changeCoaData(coaIndex: any) {
		// console.log(coaIndex);
		this.editCoa = false;
		this.coaShow = 'Show';
		// console.log(this.orders.selectedOrder.po_date)
		this.OrdersService
			.changePoNumbr(
				{
					id: this.orders.selectedOrder.id,
					flag: coaIndex,
					po_nbr: this.orders.selectedOrder.po_nbr ? this.orders.selectedOrder.po_nbr : '',
					line_item: this.orders.selectedOrder.line_item ? this.orders.selectedOrder.line_item : '',
					po_date: this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : '',
				})
			.then(response => {
				this.getReportsData();
			});

	}
	changeAddress(): void {
		let dialogRef = this.dialog.open(ChangeShipperAddressComponent, {
			width: '550px',
			data: this.orders.selectedOrder.id
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.success) {
				let shippingAddress = { address1: '', address2: '', city: '', state: '', country_name: '', postal_code: '', gstin_no: '' };

				result.data.map(function (value) {
					if (value.selected) {
						shippingAddress = value;

					}
				});
				// console.log(shippingAddress)
				this.orders.companyShpAddrDt.ksm_address1 = shippingAddress.address1;
				this.orders.companyShpAddrDt.ksm_address2 = shippingAddress.address2;
				this.orders.companyShpAddrDt.ksm_city = shippingAddress.city;
				this.orders.companyShpAddrDt.ksm_state = shippingAddress.state;
				this.orders.companyShpAddrDt.ksm_countrty = shippingAddress.country_name;
				this.orders.companyShpAddrDt.ksm_postal_code = shippingAddress.postal_code;
				this.orders.companyShpAddrDt.ksm_gstin_no = shippingAddress.gstin_no;
			}
			let showTax = this.orders.companyShpAddrDt.ksm_postal_code
			if (showTax == '500001') {
				this.taxInvoiceDocument = true;
			} else {
				this.taxInvoiceDocument = false;
			}

		});
	}

	updateKeyValue() {
		let param = Object.assign({}, this.orders.invoice[0].Inovice);
		param.pack_charge = param.pack_charge.toString().split(',').join('');
		param.tax_csgt = param.tax_csgt.toString().split(',').join('');
		param.tax_gst = param.tax_gst.toString().split(',').join('');
		param.tax_igst = param.tax_igst.toString().split(',').join('');
		param.tax_others = param.tax_others.toString().split(',').join('');

		this.OrdersService
			.generateInvoice(param)
			.then(response => {
				this.orders.invoice = response.result.data.Invioce;
			});
			if (param.payment_type == 'Advance') {
				this.hidePaidBtn = false;
				// console.log("false")
			} else {
				this.hidePaidBtn = true;
				// console.log("true")
			}
	}

  constructor(
    private titleService: Title,
		private InventoryService: InventoryService,
		private OrdersService: OrdersService,
		private organizationsService: OrganizationsService,
		private snackbar: SnakbarService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
    private cookie: CookieService,
    private activatedRoute: ActivatedRoute,
		private _lightbox: Lightbox,
		private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(param => this.data.id = param.id);
	this.titleService.setTitle(App['company_data'].ordersTitle);
	this.orderFormCompanyDetails = App['company_data'];
	this.orderDetails();
	this.sdfFormData();
	this.getComapnyDetails();
	this.getPaymentTypes();
     	this.sdfFormData();
		this.getclientDocPermissions();
		this.userDetails = App.user_details;
		let permission: boolean;
		let profile: boolean;
		let admin_profile: boolean;
		App.user_roles_permissions.map(function (value) {
			switch (value.code) {
				case 'factory_user':
					if (value.selected) {
						permission = false;
					} else {
						permission = true;
					}
					break;
				case 'client_interface':
					if (value.selected) {
						profile = true;
					} else {
						profile = false;
					}
					break;
				case 'admin':
					if (value.selected) {
						admin_profile = true;
					} else {
						admin_profile = false;
					}
					break;


			}

		})

	this.factoryPermission = true;
		this.clientPermission = profile;
		this.adminUser = admin_profile;

		this.downloadStatus = false;

		// if (this.cookie.check('order_id')) {
		// 	let order_id = this.cookie.get('order_id');
		// 	this.assignDetailView(order_id);
		// 	setTimeout(() => {
				
		// 		this.stepper['selectedIndex'] = 1;
		// 	}, 500);
		// 	this.cookie.delete('order_id');
		// 	this.searching = false;
		// } else {
		// 	this.getOrdersList(true);


		// }

	this.generateShippingAddressForm();
	this.setUserCategoryValidators();
	this.userDetailsType();
	this.getOrganizations();
	this.getProductTypesData();
	
	// console.log(this.activatedRoute)
	
	this.uploader.onSuccessItem = (item, response, status, headers) => {
		this.getAddedFiles(this.shipmentType);
		this.getAttachmentsList();
	} 

	setTimeout(() => {
		this.getUomData();
		
	}, 1000);


  }
  public UomData = [];
  getUomData() {
	this.OrdersService
	.getUomData({  })
	.then(response => {
		if(response.result.success) {
			this.UomData = response.result.data;
			this.selectedUom = this.UomData[2].id;
			this.getPrimaryPackageData();

		}
		
	});
  }
  public selectedUom;
  public showUOMSavePanel = false;
  changeUomType(uom) {
	this.selectedUom = uom.id;
	this.showUOMSavePanel = true;
  }
  editformSdf() {
	if (!this.editable) {
		this.editable = true;
	} else {
		this.editable = false;
	}

}
saveUomData() {
	this.getPrimaryPackageData();
	this.showUOMSavePanel = false;
}
cancelUomChange() {
	this.selectedUom = this.UomData[2].id;
	this.showUOMSavePanel = false;

}
public primaryPackageData = [];
getPrimaryPackageData() {
	let param = {
		uom_id: this.selectedUom ,
		orders_id: this.orders.selectedOrder.id
	}
	this.OrdersService
	.getPrimaryPackageData(param)
	.then(response => {
		if(response.result.success) {
			this.primaryPackageData = response.result.data;
		}
		
	});
}
public disabledSave = false;
cancelPackages(): void {
	this.disabledSave = true;
	this.OrdersService
		.acceptOrder({ id: this.orders.selectedOrder.id, orders_types_id: 5 })
		.then(response => {
			if(response.result.success) {
				this.orders.selectedOrder.orders_types_id = '5';
				this.selectedOrderStatus = 'Cancelled';
			} else {
				this.disabledSave = false;
			}
			
		});
}
editExportValue() {
	if (!this.editExport) {
		this.editExport = true;
	} else {
		this.editExport = false;
	}

}
  deliverOrder(): void {
	//   console.log(1)
	let dialogRef = this.dialog.open(DeliverOrderComponent, {
		panelClass: 'alert-dialog',
		width: '550px',
		height: '300px',
		data: {
			id: this.orders.selectedOrder.id,
			flag: this.selectedOrderStatus
		}
	});
	dialogRef.afterClosed().subscribe(result => {
		if (result.success) {
			
			this.selectedOrderStatus = 'Delivered';
			this.getOrdersActivityDetails();
			this.disablePayment = true;
			this.orders.selectedOrder.orders_types_id = '4';
		}
	});
}
sendMails(data?: any): void {
	let dialogRef = this.dialog.open(EmailDocumentsComponent, {
		panelClass: 'alert-dialog',
		width: '640px',
		data: { order_id: this.orders.selectedOrder.id, invoice_id: this.orders.invoice.length ? this.orders.invoice[0].Inovice.id : '', other_docs: this.attachments}
	});
	dialogRef.afterClosed().subscribe(result => {
		if (result && result.success) {
			// let toast: object;
			// toast = { msg: 'The documents are being processed, we will notify you once the email has been sent.', status: 'success' };
			// this.snackbar.showSnackBar(toast);
			// this.OrdersService
			// 	.sendDocumentsMail({ orders_id: this.orders.selectedOrder.id, invoice_id: this.orders.invoice[0].Inovice.id })
			// 	.then(response => {
			// 		if (response.result.success) {
			// 			toast = { msg: 'Email has been sent successfully.', status: 'success' };
			// 			this.snackbar.showSnackBar(toast);
			// 		} else {
			// 			toast = { msg: 'Error Sending Email.', status: "error" };
			// 			this.snackbar.showSnackBar(toast);
			// 		}
			// 	});
		}
	});
	
}

orderDownload() {
	let toast: object;
	toast = { msg: 'The documents are being processed, Download will begin shortly...', status: 'success' };
	this.snackbar.showSnackBar(toast); 
	let params = { id: this.orders.selectedOrder.id, invoice_id: this.orders.invoice[0].Inovice.id }
	this.OrdersService
		.exportOrdersPdf(params)
		.then(response => {
			if (response.result.success) {
				if (response.result.data){
					let downloadPath = response.result.data;
					window.open(downloadPath, '_blank');
				}
			}
			else {
				toast = { msg: 'Error in Downloading documents.', status: "error" };
				this.snackbar.showSnackBar(toast);
			}
		});

		// this.checkOrders();
		// // let modelData = this.checkOrdersPdf;
		// let modelData = this.orders.selectedOrder.id;
		// let invoice_id =  this.orders.invoice[0].Inovice.id;
		// let dialogRef = this.dialog.open(OrderDownloadComponent, {
		// 	width: '550px',
		// 	data: { modelData, invoice_id}
		// });
		// dialogRef.afterClosed().subscribe(result => {
		// 	setTimeout(() => {
		// 		this.ordersDownload = false;
	
		// 	}, 3000);
		// });
}

  addBatchNumber(product: any): void {
	this.orders.packing.forEach((n) => {
		let batchData = n.batchesData;
		batchData.map((i) => {
			let container_name = i.contains;
			container_name.map((v) => {
				if (v.packing_id == product.packing_id)
					this.containerId = v.packing_id
			})

		})
	})
	let dialogRef = this.dialog.open(AddBatchNumberComponent, {
		panelClass: 'alert-dialog',
		width: '550px',
		data: { product: product, selectedOrder: this.orders.selectedOrder, container: this.containerId }
	});
	dialogRef.afterClosed().subscribe(result => {
		if (result && result.success) {
			// this.priceQuantityDisable = false;
			this.showDrumsList = true;
			this.getPackagingDetails();
			this.downloadStatus = true;
		}
	});
}
public transportMode;
selectShipping() {
	this.shippingActiveState = true;
}
selectShippingMode(transportName) {
	console.log(transportName);
	this.transportMode = transportName.name;
	this.shippingActiveState = true;
}

  generateShippingAddressForm(): void {
	this.shippingForm = this.formBuilder.group({
		aws_number: [null],
		bol_number: [null],
		road_number: [null],
		terms: [],
		mode_transport_id: [null, Validators.required],
		transport_mode: [1, Validators.required]
	});
}
getProductTypesData(): void {
	this.organizationsService
		.getProductsList({ org_id: this.App.user_details.org_id })
		.then(response => {
			if (response.result.success) {
				this.orders.productsList = response.result.data.productTypesDt;
				this.orders.productsList.map(function (value) {
					value.selected = false;
				});

			}
		})

		.catch(error => console.log(error));
	// console.log(this.orders.productsList);
}

moveToSsi() {
	this.activateScroll = false;
	this.activeTab = 'Ssi';
	if (this.Ssi && this.Ssi['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Ssi['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
moveToUnit() {
	this.activateScroll = false;
	this.activeTab = 'Unit';
	if (this.Unit && this.Unit['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Unit['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToShipperLetter() {
	this.activateScroll = false;
	this.activeTab = 'Shippersletter';
	if (this.Shippersletter && this.Shippersletter['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Shippersletter['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToAdcSheet() {
	this.activateScroll = false;
	this.activeTab = 'Adcsheet';
	if (this.Adcsheet && this.Adcsheet['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Adcsheet['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToIncentive() {
	this.activateScroll = false;
	this.activeTab = 'Incentivedeclaration';
	if (this.Incentivedeclaration && this.Incentivedeclaration['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Incentivedeclaration['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
moveToScomat() {
	this.activateScroll = false;
	this.activeTab = 'Scomatdeclaration';
	if (this.Scomatdeclaration && this.Scomatdeclaration['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Scomatdeclaration['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToConcern() {
	this.activateScroll = false;
	this.activeTab = 'Concern';
	if (this.Concern && this.Concern['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Concern['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToAdcode() {
	this.activateScroll = false;
	this.activeTab = 'Adcode';
	if (this.Adcode && this.Adcode['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.Adcode['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
public shipmentType;
setAddedFilesUrl(flag) {
	if(flag == 'origin') {
		this.imagUploadFlag = 'country';
		this.shipmentType = flag;
		// console.log(2)
	} else if(flag == 'insuranceFlag') {
		this.imagUploadFlag = 'insurance';
		this.shipmentType = flag;
	}  else if(flag == 'shipping') {
		this.imagUploadFlag = 'shipping';
		this.shipmentType = flag;
	}
	else if(flag == 'landing') {
		this.imagUploadFlag = 'landing';
		this.shipmentType = flag;
	}
	else{
		this.imagUploadFlag = 'Bill';
		this.shipmentType = flag;
	}
	this.uploader.setOptions({ url : App.base_url + 'addFiles?orders_id=' + this.orders.selectedOrder.id + '&type='+ this.imagUploadFlag})

	
}

fileUpload() {
	
}
public showEditIcon = true;
saveShippingAddress(form): void {
	// console.log(form)
	this.setUserCategoryValidators();
	this.submitShippingForm = true;
	this.shippingForm.get('transport_mode').markAsTouched({ onlySelf: true });
	this.shippingForm.get('mode_transport_id').markAsTouched({ onlySelf: true });
	this.shippingForm.get('aws_number').markAsTouched({ onlySelf: true });
	this.shippingForm.get('bol_number').markAsTouched({ onlySelf: true });
	this.shippingForm.get('road_number').markAsTouched({ onlySelf: true });
	let toast: object;
	if (form.valid) {
		console.log(this.shippingForm.value.bol_number)
		console.log(this.shippingForm.value.road_number)

		this.totalSpinner = true;
		this.shippingActiveState = false;
		this.invoiceGenerateLoader = true;
		this.OrdersService
			.addInvoiceShipping({
				id: this.orders.shipping_id,
				invoice_id: this.orders.invoice[0].Inovice.id,
				terms: this.shippingForm.value.terms,
				transport_mode: this.shippingForm.value.transport_mode,
				mode_transport_id: this.shippingForm.value.mode_transport_id,
				shipping_id: this.shippingForm.value.aws_number,
				bol_id: this.transportMode == 'Sea' ? this.shippingForm.value.bol_number : this.shippingForm.value.road_number,
			})
			.then(response => {
				this.invoiceGenerateLoader = false; 
				
				this.submitShippingForm = false;
				// this.totalSpinner = false;
				if (response.result.success) {
					this.totalSpinner = false;
					this.sendDocumentMails = true;
					this.orders.shipping_id = response.result.data.shipDt.id;
					toast = { msg: 'Shipping Details saved successfully.', status: 'success' };
					this.snackbar.showSnackBar(toast);
					this.editShipping = false;
					this.getShippingAddressDetails();
					this.orders.selectedOrder.status = 'In-transit';
					this.showEditIcon = false;
				} else {
					this.sendDocumentMails = true;
					this.showEditIcon = true;
					this.editShipping = false;
					this.getShippingAddressDetails();
				}
			});
	} 
}
generateInvoice() {
	this.invoiceGenerateLoader = true;
	this.clickedGenerateInvoice = true;
	this.totalSpinner = true;
	this.OrdersService
	
		.generateInvoice({ orders_id: this.orders.selectedOrder.id })
		.then(response => {
			
			this.hideShipperAddress = true;
			this.totalSpinner = false;
			this.orders.selectedOrder.orders_types_id = '6';
			this.getInvoiceData();

			this.clickedGenerateInvoice = false;
			this.selectedOrderStatus = 'Processing';
		});
}

paidInvoice() {
	let dialogRef = this.dialog.open(MarkAsPaidComponent, {
		width: '550px',
		data: ''
	});
	dialogRef.afterClosed().subscribe(result => {
		if (result.success) {
			this.OrdersService
				.invoiceStatus({ id: this.orders.invoice[0].Inovice.id })
				.then(response => {
					if (response.result.success) {
						this.paymentStatus = true;
						this.orders.invoice[0].Inovice.status = 'Paid';
						this.added = true;
						this.disablePayment = true;
						let toast: object;
						toast = { msg: 'Paid Successfully...', status: 'success' };
						this.snackbar.showSnackBar(toast);
					}
				});
		}
	});
}
getOrganizations() {
	this.param.search = '';
	this.organizationsService
		.getOrganizationsList(this.param)
		.then(response => {
			if (response.result.success) {
				this.orders.organizations = response.result.data.organization;
			}
		});
}

setUserCategoryValidators() {
	const AWSCtrl = this.shippingForm.get('aws_number');
	const BOLCtrl = this.shippingForm.get('bol_number');
	const ROADCtrl = this.shippingForm.get('road_number');

	this.shippingForm.get('transport_mode').valueChanges
  .subscribe(userCategory => {  
	//   console.log(userCategory)
	if (userCategory == 1) {
		BOLCtrl.setValidators(null);
		AWSCtrl.setValidators([Validators.required]);
		ROADCtrl.setValidators(null);
	} else if (userCategory == 15 || userCategory == 16) {
		BOLCtrl.setValidators(null);
		AWSCtrl.setValidators(null);
		ROADCtrl.setValidators([Validators.required]);
	} else {
		AWSCtrl.setValidators(null);
		BOLCtrl.setValidators([Validators.required]);
		ROADCtrl.setValidators(null);
	}

	AWSCtrl.updateValueAndValidity();
	BOLCtrl.updateValueAndValidity();
  })
}
userDetailsType() {
	if (this.userDetails.log_type == 1) {
		this.blockContent = true
	} else {
		this.blockContent = false
	}
}
public productDetails = '';
  orderDetails() {
	//   console.log(2)
		// stepper.next();
		this.totalSpinner = true
		let showDocs;
		let tax;
		this.data.id = this.data.id;
		this.fetchingData = true;
		this.selectedOrderStatus = '';
		this.orders.notifyAddr = {};
		// this.enableInvoice = false;
		// this.priceQuantityDisable = false;
		this.OrdersService
			.getOrdersList(this.data)
			.then(response => {
				this.totalSpinner = false;
				if(response.result.data.totalordersDt.length) {
					this.showNoDatFound = false;
				} else {
					this.showNoDatFound = true;
				}
				let selectedOrderDetails = response.result.data.totalordersDt[0].list[0];
				this.productDetails = selectedOrderDetails ? selectedOrderDetails.productsDetails : '';
				// console.log(selectedOrderDetails)
				if (selectedOrderDetails.orders.line_item) {
					this.saveAddLineItem = true;
				} else {
					this.saveAddLineItem = false;
				}
				let showTax = response.result.data.totalordersDt[0].list[0].ksmAddr.ksm_postal_code
				this.orders.selectedOrder = selectedOrderDetails.orders;
				// console.log(this.orders.selectedOrder);
				this.po_date2 = new Date(this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : "");
				this.timeout = setTimeout(() => {
					this.selectedOrderStatus = this.orders.selectedOrder.status;
				}, 100);
				this.orders.billingAddr = selectedOrderDetails.billingAddr;
				this.orders.shippingAddr = selectedOrderDetails.shippingAddr;
				if (selectedOrderDetails.notifyingAddr) {
					this.showNotifyAddress = true;
					this.orders.notifyAddr = Object.assign(selectedOrderDetails.notifyingAddr);
					// console.log(this.orders.notifyAddr)
				} else {
					this.showNotifyAddress = false;
					this.orders.notifyAddr = {}
				}
				this.orders.productsData.data = selectedOrderDetails.productsData;
				// console.log(this.orders.productsData.data)
				selectedOrderDetails.productsData.map(function (value) {
					if (
						value.category_name.includes('Vegan') ||
						value.category_name.includes('Organic KSM-66 Ashwagandha Extract - 80 Mesh' ||
							value.category_name.includes('Organic KSM-66 Ashwagandha Extract -300 Mesh'))) {
						showDocs = true
					}
					if (value.category_name.includes('spectrum')) {
						// this.containsMilk = true;
					}
				});
				if (showDocs == true) {
					this.showDocuments = showDocs;
				}
				if (showTax == 500001) {
					this.taxInvoiceDocument = true;
				} else {
					this.taxInvoiceDocument = false;
				}
				this.orders.companyShpAddrDt = selectedOrderDetails.ksmAddr;

				this.getAttachmentsList();
				this.onLoadFiles.forEach(element => {
					this.getAddedFiles(element);
				});
				this.getReportsData();

				this.getOrdersActivityDetails();
				this.getOrdersSdf();
				this.getOrdersExport();
				this.getOrdersConcern();


				if (this.orders.selectedOrder.orders_types_id != '1') {
					this.getPackagingDetails();
				}
				if (this.orders.selectedOrder.orders_types_id == '6') {
					this.getInvoiceData();
				}
				this.fetchingData = false
				if (this.selectedOrderStatus != 'In-transit' && this.selectedOrderStatus != 'cancel' && this.selectedOrderStatus != 'Delivered') {
					this.disablePayment = false;
				} else {
					this.disablePayment = true;
				}

				if (this.orders.selectedOrder.orders_types_id == '1' || this.orders.selectedOrder.orders_types_id == '2' || this.orders.selectedOrder.orders_types_id == '6') {
					this.sendDocumentMails = false;
				} else {
					this.sendDocumentMails = true
				}
			});
  }
  
  getAttachmentsList() {
	//   console.log(256556)
		this.OrdersService
			.getAttachmentsList({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.attachments = response.result.data.OrdersAtt;
					this.downloadStatus = response.result.data.dwmStatus;
				} else {
					this.attachments = [];
				}
			});
  }
  getAddedFiles(flag) {
	//   console.log(flag)
		if(flag == 'origin') {
			this.getFileFlag = 'country';
		} else if(flag == 'insuranceFlag') {
			this.getFileFlag = 'insurance';
		} else if(flag == 'shipping'){
			this.getFileFlag = 'shipping';
		}else if(flag == 'landing'){
			this.getFileFlag = 'landing';
		}else{
			this.getFileFlag = 'Bill';
		}
		
		this.OrdersService
			.getoriginFileAttachments({ id: this.orders.selectedOrder.id, type: this.getFileFlag })
			.then(response => {
				if (response.result.success) {
					response.result.data.OrdersAtt.forEach(element => {
						element.src = '';
						
						if(element.link_url.lastIndexOf('.pdf') > -1) {
							element.src = this.images.pdf_download;
						} else if(element.link_url.lastIndexOf('.doc') > -1 || 
						element.link_url.lastIndexOf('.docx') > -1 || element.link_url.lastIndexOf('.xlsx') > -1){
							// element.link_url = 'https://expodite.enterpi.com/storage/app/public/uploads/AddedFiles/1603190571.xlsx';
							// element.src = 'http://docs.google.com/gview?url='+ element.link_url +'&embedded=true';
						}  else {
							element.src = element.link_url;
						}
						
					});
					if(flag == 'origin') {
						this.originFileAttachments = response.result.data.OrdersAtt;
					}  if(flag == 'insuranceFlag') {
						// console.log('ggggg')
						this.insuranceAttachments = response.result.data.OrdersAtt;
					}  if(flag == 'shipping'){
						this.shippingAttachments = response.result.data.OrdersAtt;
					} else if(flag == 'landing'){
						this.airwayAttachments = response.result.data.OrdersAtt;
					}
					
				} else {
					this.originFileAttachments = [];
				}
			});
  }
  
  getReportsData(data?: any): void {
		let hideHplc: boolean;
		this.OrdersService
			.OrderCoaData({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.CoaDetails = response.result.data.coa;
					// console.log(this.CoaDetails)
					// this.coaCompanyName = response.result.data.company_name  ;
					// this.coaCompanyName = response.result.data.coa.length ? response.result.data.coa[0].batchDt.product_name : '';
					this.coaCompanyName = response.result.data.coa.length ? response.result.data.coa[0].batchDt.client_name : '';

					// console.log(this.coaCompanyName);
					this.CoaDetails.map(function (value) {
						value.batchCoaDt.map(function (coapermission) {
							// console.log(coapermission)
							if (coapermission.id == 34) {
							}
						})
					});
					// this.CoaDetails.map(function (value) {
					// 	value.batchDt.map(function () {

					// 	})
					// });

				}
			});
  }

  moveToOrigin() {
	this.activateScroll = false;
	this.activeTab = 'origin';
	if (this.origin && this.origin['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.origin['nativeElement'].offsetTop - 46;
	}
	// this.getAddedFiles();
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToAirway() {
	this.activateScroll = false;
	this.activeTab = 'airway';
	if (this.airway && this.airway['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.airway['nativeElement'].offsetTop - 46;
	}
	// this.getAddedFiles();
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
moveToInsurance() {
	this.activateScroll = false;
	this.activeTab = 'insurance';
	if (this.insurance && this.insurance['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.insurance['nativeElement'].offsetTop - 46;
	}
	// this.getAddedFiles();
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
  getOrdersActivityDetails(): void {
	//   console.log('calleddd')
		this.OrdersService
			.getActivtyDetails({ id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.orders.activityDetails = response.result.data;
				} else {
					this.orders.activityDetails = [];
				}
			});
  }
  getOrdersSdf(): void {
		this.OrdersService
			.getOrdersSdf({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					// if (response.result.data.length > 0) {
						this.editable = false
						this.getSdfData = response.result.data;
						this.sdfFormDates.patchValue({
							entry_date: new Date(this.getSdfData.entry_date),
							check_date: new Date(this.getSdfData.check_date),
							shipping_bill_no: this.getSdfData.shipping_bill_no
						})
						if (response.result.data.length > 0) {
						this.sdfData.entry_date = moment(response.result.data.entry_date.value).format('"YYYY-MM-DD');
						this.sdfData.check_date = moment(response.result.data.check_date.value).format('"YYYY-MM-DD');
						this.sdfData.shipping_bill_no = response.result.data.shipping_bill_no.value;
						}
						// console.log(response.result.data, 'Hi');
					// } else {
					// 	this.getSdfData = ''

					// }

				}
			});
  }

  sdfFormData() {
	this.sdfFormDates = this.formBuilder.group({
		entry_date: '',
		check_date: '',
		shipping_bill_no: ''
	})

}
addSdfData(): void {
	// this.noShippingBill = true;
	// this.noShippingDate = true;
	this.sdfData.check_date = this.sdfFormDates.controls.check_date ? this.sdfFormDates.controls.check_date.value : "";
	this.sdfData.entry_date = this.sdfFormDates.controls.entry_date ? this.sdfFormDates.controls.entry_date.value : "";
	this.sdfData.shipping_bill_no = this.sdfFormDates.controls.shipping_bill_no.value;
	this.sdfData.orders_id = this.orders.selectedOrder.id
	this.OrdersService
		.addOrdersSdf({ orders_id: this.sdfData.orders_id, shipping_bill_no: this.sdfData.shipping_bill_no, check_date: this.sdfData.check_date, entry_date: this.sdfData.entry_date, id: this.getSdfData.id || 0 })
		.then(response => {
			if (response.result.success) {
				this.editable = false
				this.getSdfData = response.result.data
				// console.log(this.getSdfData)
			}
		});
}
  getOrdersExport(): void {
		this.OrdersService
			.getOrdersExport({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					if (response.result.data != null) {
						this.editExport = false
						this.getExportData = response.result.data;

					} else {
						this.getExportData = ''

					}

				}
			});
  }
  getOrdersConcern(): void {
		this.OrdersService
			.getOrdersConcern({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					if (response.result.data.concern_data) {
						this.concernEditable = false
						this.getConcernData = response.result.data
					} else {
						this.getConcernData = {
							concern_data: {
								price: '',
								year1: '',
								year2: '',
								export1: '',
								export2: '',
								domestic1: '',
								domestic2: ''
							}
						}
					}

				}
			});
  }
  public allowProductEditing = true;
  getPackagingDetails(): void {
		this.containerName = [];
		this.OrdersService
			.getPackagingOrderDetails({ id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.orders.packageOrders = response.result.data;
					this.packageDescription = response.result.data.description;
					this.orders.packing = response.result.data.packing;
					if(response.result.data.packing.length) {
						this.allowProductEditing = false;
					} else {
						this.allowProductEditing = true;
					}
					console.log(this.allowProductEditing)

					this.orders.packing.forEach((n) => {
						let batchData = n.batchesData;
						batchData.map((i) => {
							let container_name = i.contains;
							container_name.map((v) => {
								this.containerName.push(v);
								this.containerName.map((child, i) => {
									if(child.packing_id== v.packing_id) {
										v.itemCount = i+1;
									}
								})
							})

						})
					})

					if (response.result.data.packing.length) {
						this.showDrumsList = false;
					} else {
						this.showDrumsList = true;
					}
					if (response.result.data.invStatus == '2') {
						// console.log(3)
						this.getInvoiceData();
						this.getOrdersActivityDetails();
						this.packageCompleted = true;
					} else {
						this.orders.packageOrders['invStatus'] = response.result.data.invStatus;
					}
					if (response.result.data.invStatus == '1') {
						// console.log(4)
						this.packageCompleted = true
						this.selectedOrderStatus = 'Processing';
						this.getOrdersActivityDetails();
					}
				} else {
					this.orders.packageOrders = [];
					this.orders.sum = {};
					this.orders.packing = [];
				}
			});
  }
  deleteLineItemAccess(index: any) {
	this.orders.invoice[0].Inovice.extra_col.splice(index, 1);
	let param = Object.assign({}, this.orders.invoice[0].Inovice);
	this.OrdersService
		.generateInvoice(param)
		.then(response => {
			this.orders.invoice = response.result.data.Invioce;
		});
}
toggle() {
	this.show = !this.show;
	if (this.show) {
		this.orderButton = 'Hide';
	} else {
		this.orderButton = 'Show';
	}
	this.collapseOut = !this.collapseOut;
}
printCertificate: boolean;
printInvoice: boolean;
printTaxInvoice: boolean;
printPackage: boolean;
printMsdsForm: boolean;
printhazardous: boolean;
printFormSdf: boolean;
printExport: boolean;
printDecl: boolean;
printShipper: boolean;
printAdc: boolean;
printInc: boolean;
printSco: boolean;
printCon: boolean;
printOrigin: boolean;
printInsurance: boolean;
printAirway: boolean;
public printPrimaryPackage: boolean;
public showPrimaryPackage: boolean = true;
toggleCoa() {
	this.showCoa = !this.showCoa;
	this.printCertificate = !this.printCertificate;
}
toggleInvoice() {
	this.showInvoice = !this.showInvoice;
	this.printInvoice = !this.printInvoice;
}
toggleTaxInvoice() {
	this.showTaxInvoice = !this.showTaxInvoice;
	this.printTaxInvoice = !this.printTaxInvoice;
}
togglePackage() {
	this.showPackage = !this.showPackage;
	this.printPackage = !this.printPackage;
}
togglePrimaryPackage() {
	this.showPrimaryPackage = !this.showPrimaryPackage;
	this.printPrimaryPackage = !this.printPrimaryPackage;
}
toggleUom() {
	this.showUom = !this.showUom;
}
toggleShipping() {
	this.showShipping = !this.showShipping;
}
toggleMsds() {
	this.showMsds = !this.showMsds;
	this.printMsdsForm = !this.printMsdsForm;
}

toggleNonHazardus() {
	this.showNonhazardous = !this.showNonhazardous;
	this.printhazardous = !this.printhazardous;
}
toggleSdf() {
	this.showSdf = !this.showSdf;
	this.printFormSdf = !this.printFormSdf;
}
toggleExportValue() {
	this.showExportvalue = !this.showExportvalue;
	this.printExport = !this.printExport;
}
toggleDeclaration() {
	this.showDeclaration = !this.showDeclaration;
	this.printDecl = !this.printDecl;
}
toggleShippers() {
	this.showShippers = !this.showShippers;
	this.printShipper = !this.printShipper;
}
toggleAdcsheet() {
	this.showAdcsheet = !this.showAdcsheet;
	this.printAdc = !this.printAdc;
}
toggleDeclarationIncentive() {
	this.showDeclarationIncentive = !this.showDeclarationIncentive;
	this.printInc = !this.printInc;
}
toggleScomatDeclaration() {
	this.showScomatDeclaration = !this.showScomatDeclaration;
	this.printSco = !this.printSco;
}
toggleConcern() {
	this.concern = !this.concern;
	this.printCon = !this.printCon;
}
toggleOrigin() {
	this.showOrigin = !this.showOrigin;
	this.printOrigin = !this.printOrigin;
}
toggleInsurance() {
	this.showinsurance = !this.showinsurance;
	this.printInsurance = !this.printInsurance;
}
toggleAirway() {
	this.showAirway = !this.showAirway;
	this.printAirway = !this.printAirway;
}
deleteLineItem(index: any) {
	let dialogRef = this.dialog.open(DeleteLineItemComponent, {
		panelClass: 'alert-dialog',
		width: '550px',
		data: {}
	});

	dialogRef.afterClosed().subscribe(result => {
		if (result && result.success) {
			this.deleteLineItemAccess(index);
		}
	});
}
checkboxDisable(event) {
	event.preventDefault();
}
editConcern() {
	if (!this.concernEditable) {
		this.concernEditable = true;
	} else {
		this.concernEditable = false;
	}

}
getPaymentTypes() {
	this.OrdersService
	.getPaymentTypes()
	.then(response => {
		// console.log(response)
		if(response.result.success) {
			this.paymentType = response.result.data;
		}
	})
  }
addExportValueData(): void {
	this.exportValue.orders_id = this.orders.selectedOrder.id
	this.OrdersService
		.addOrdersExp({ orders_id: this.exportValue.orders_id, e_entry_date: this.exportValue.e_entry_date, e_shipping_bill_no: this.exportValue.e_shipping_bill_no || 0 })
		.then(response => {
			if (response.result.success) {
				this.editExport = false
				this.getExportData = response.result.data
			}
		});
}
  cancelAllOrder(): void {
	let dialogRef = this.dialog.open(CancelOrderComponent, {
		panelClass: 'alert-dialog',
		width: '550px',
		data: this.orders.selectedOrder.id
	});
	dialogRef.afterClosed().subscribe(result => {
		if (result.success) {
			console.log(5)
			this.orders.selectedOrder.orders_types_id = '5';
			this.selectedOrderStatus = 'Cancelled';
			this.orders.selectedOrder.status == 'Cancelled';
			this.getOrdersActivityDetails();
			this.orderDetails();
		}
	});
}
  getInvoiceData() {
	// console.log(6)
		this.enableInvoice = true;
		// this.getOrdersActivityDetails();
		// this.selectedOrderStatus = 'Processing';
		
		this.OrdersService
			.getInvoiceData({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.invoiceGenerateLoader = false;
					this.hideShipperAddress = true;
					this.orders.invoice = response.result.data.Invioce;
					if(response.result.data.Invioce.length) {
						this.batchNum = response.result.data.Invioce[0].productsData[0].batch_nbr;

					}
					if (this.batchNum != null) {
						this.batchNumArray = this.batchNum.split(',');
						this.batchNumArray = this.batchNumArray && this.batchNumArray.length ? this.batchNumArray : []
					}

					// if(this.orders.invoice[0].productsData[0].batch_nbr == null) {
					// 	this.priceQuantityDisable = true;
					// } else {
					// 	this.priceQuantityDisable = false;
					// }

					// console.log(this.priceQuantityDisable)

					// this.batchNum=this.batchNum.split(',').join('\n');
					// console.log(this.batchNumArray)

					// console.log(this.orders.invoice)
					this.orders.packageStatus = response.result.data.packageStatus
					if (this.orders.invoice.length && this.orders.invoice[0].Inovice.status == 'Paid') {
						this.disablePayment = true
					}
					if (this.orders.packageStatus == '2') {
						this.downloadStatus = true;
					} else {
						this.downloadStatus = false
					}
					this.getReportsData();
					this.getShippingAddressDetails();
				}
			});
  }
  getShippingAddressDetails(): void {
		// console.log(123)
		this.OrdersService
			.getShippingDetails({
				invoice_id: this.orders.invoice.length ? this.orders.invoice[0].Inovice.id: ''
			})
			.then(response => {
				// console.log(response)
				if (response.result.success) {
					if (response.result.data.shipDt && response.result.data.shipDt.id) {
						this.orders.shipping_id = response.result.data.shipDt.id;
						this.orders.shipping_data = response.result.data.shipDt;
						this.setShippingAddressForm(response.result.data.shipDt);
						this.disableCancel = true;
						this.editShipping = true;
						this.selectedOrderStatus = 'In-transit';
						this.downloadStatus = true;
						this.disablePayment = true
						if (this.orders.selectedOrder.orders_types_id == '4') {
							this.selectedOrderStatus = 'Delivered';
						}
					} else {
						this.editShipping = true;
						this.disableCancel = false;
					}
					this.orders.mode_transport_ids = response.result.data.modeTransportDt;
					this.orders.mode_of_transport = response.result.data.transportType;

					
				}
				// this.disableCancel = true;
			});
  }
  setShippingAddressForm(data: any): void {
		this.shippingForm.patchValue({
			aws_number: data.shipping_id
		});
		this.shippingForm.patchValue({
			terms: data.terms
		});
		this.shippingForm.patchValue({
			mode_transport_id: data.mode_transport_id
		});
		this.shippingForm.patchValue({
			transport_mode: data.transport_mode
		});
		this.shippingForm.patchValue({
			bol_number: data.bol_id
		});
		this.shippingForm.patchValue({
			road_number: data.bol_id
		});

  }
  
  scrollOrdersContainer(event) {
		// console.log(this.scrollContainer)
		if (this.activateScroll) {
			let scrollTop = ((this.scrollContainer && this.scrollContainer['nativeElement'] && this.scrollContainer['nativeElement'].scrollTop) ? this.scrollContainer['nativeElement'].scrollTop : 0);
			let activityTop = ((this.activity && this.activity['nativeElement'] && this.activity['nativeElement'].offsetTop) ? this.activity['nativeElement'].offsetTop : 0);
			let detailsTop = ((this.details && this.details['nativeElement'] && this.details['nativeElement'].offsetTop) ? this.details['nativeElement'].offsetTop : 0);
			let packagingTop = ((this.packaging && this.packaging['nativeElement'] && this.packaging['nativeElement'].offsetTop) ? this.packaging['nativeElement'].offsetTop : 0);
			let invoiceTop = ((this.invoice && this.invoice['nativeElement'] && this.invoice['nativeElement'].offsetTop) ? this.invoice['nativeElement'].offsetTop : 0);
			let coaTop = ((this.coa && this.coa['nativeElement'] && this.coa['nativeElement'].offsetTop) ? this.coa['nativeElement'].offsetTop : 0);
			let shippingTop = ((this.shipping && this.shipping['nativeElement'] && this.shipping['nativeElement'].offsetTop) ? this.shipping['nativeElement'].offsetTop : 0);
			let msdsFormTop = ((this.msdsForm && this.msdsForm['nativeElement'] && this.msdsForm['nativeElement'].offsetTop) ? this.msdsForm['nativeElement'].offsetTop : 0);
			let nonHazardousTop = ((this.nonHazardous && this.nonHazardous['nativeElement'] && this.nonHazardous['nativeElement'].offsetTop) ? this.nonHazardous['nativeElement'].offsetTop : 0);
			let FormsdfTop = ((this.Formsdf && this.Formsdf['nativeElement'] && this.Formsdf['nativeElement'].offsetTop) ? this.Formsdf['nativeElement'].offsetTop : 0);
			let ExportvalueTop = ((this.Exportvalue && this.Exportvalue['nativeElement'] && this.Exportvalue['nativeElement'].offsetTop) ? this.Exportvalue['nativeElement'].offsetTop : 0);
			let DeclarationTop = ((this.Declaration && this.Declaration['nativeElement'] && this.Declaration['nativeElement'].offsetTop) ? this.Declaration['nativeElement'].offsetTop : 0);
			let ShippersletterTop = ((this.Shippersletter && this.Shippersletter['nativeElement'] && this.Shippersletter['nativeElement'].offsetTop) ? this.Shippersletter['nativeElement'].offsetTop : 0);
			let AdcsheetTop = ((this.Adcsheet && this.Adcsheet['nativeElement'] && this.Adcsheet['nativeElement'].offsetTop) ? this.Adcsheet['nativeElement'].offsetTop : 0);
			let IncentivedeclarationTop = ((this.Incentivedeclaration && this.Incentivedeclaration['nativeElement'] && this.Incentivedeclaration['nativeElement'].offsetTop) ? this.Incentivedeclaration['nativeElement'].offsetTop : 0);
			let ScomatdeclarationTop = ((this.Scomatdeclaration && this.Scomatdeclaration['nativeElement'] && this.Scomatdeclaration['nativeElement'].offsetTop) ? this.Scomatdeclaration['nativeElement'].offsetTop : 0);
			let ConcernTop = ((this.Concern && this.Concern['nativeElement'] && this.Concern['nativeElement'].offsetTop) ? this.Concern['nativeElement'].offsetTop : 0);
		// console.log(shippingTop)
			if (scrollTop <= activityTop) {
				this.activeTab = 'activity';
			} else if (activityTop < scrollTop && (scrollTop < detailsTop || detailsTop == 0)) {
				this.activeTab = 'details';
			} else if (detailsTop < scrollTop && (scrollTop < invoiceTop || invoiceTop == 0)) {
				this.activeTab = 'invoice';
			} else if (invoiceTop < scrollTop && (scrollTop < packagingTop)) {
				this.activeTab = 'packaging';
			} else if (coaTop < scrollTop && scrollTop < shippingTop) {
				this.activeTab = 'coa';
			} else if (shippingTop < scrollTop && scrollTop < msdsFormTop) {
				this.activeTab = 'shipping';
			} else if (shippingTop < scrollTop && scrollTop < nonHazardousTop) {
				this.activeTab = 'msdsForm';
			} else if ((shippingTop + 1000 )< scrollTop && scrollTop < FormsdfTop) {
				console.log(shippingTop)
				console.log(scrollTop)	// console.log(scrollTop)
				console.log(FormsdfTop)
				console.log('===========')
				this.activeTab = 'nonHazardous';
				// this.moveToNonHazardous();
			} else if (shippingTop < scrollTop && scrollTop < ExportvalueTop) {
				this.activeTab = 'Formsdf';
			} else if (shippingTop < scrollTop && scrollTop < DeclarationTop) {
				this.activeTab = 'Exportvalue';
			} else if (shippingTop < scrollTop && scrollTop < ShippersletterTop) {
				this.activeTab = 'Declaration';
			} else if (shippingTop < scrollTop && scrollTop < AdcsheetTop) {
				this.activeTab = 'Shippersletter';
			} else if (shippingTop < scrollTop && scrollTop < IncentivedeclarationTop) {
				this.activeTab = 'Adcsheet';
			} else if (shippingTop < scrollTop && scrollTop < ScomatdeclarationTop) {
				this.activeTab = 'Incentivedeclaration';
			} else if (shippingTop < scrollTop && scrollTop < ConcernTop) {
				this.activeTab = 'Scomatdeclaration';
			} else if (ConcernTop < scrollTop) {
				this.activeTab = 'Concern';
			}
		}
  }
  public paymentSelected;
  changePaymentType(event: any): void {
	//   console.log(event)
	  this.paymentSelected = event;
	this.activePayment = true;
	if (event != '') {
		// console.log(event)
		this.orders.invoice[0].Inovice.payment_type = event;
	}

}
  
  moveToActivity() {
		this.activateScroll = false;
		this.activeTab = 'activity';
		this.ActivityLog = true;
		this.activity['nativeElement'].show = true;
		if (this.activity && this.activity['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.activity['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}

	savePaymentType() {
		// console.log(this.paymentSelected)
		if(this.paymentSelected == 'Advance') {
			this.disablePayment = true;
		} else {
			this.disablePayment = false;
		}
		this.updateKeyValue();
		this.activePayment = false;
	}
	moveToDetails() {
		this.activateScroll = false;
		this.activeTab = 'details';
		if (this.details && this.details['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.details['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}

	moveToPackaging() {
		this.activateScroll = false;
		this.ActivityLog = false;
		this.activeTab = 'packaging';

		if (this.packaging && this.packaging['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.packaging['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
  }

  moveToUom() {
	this.activateScroll = false;
	this.ActivityLog = false;
	this.activeTab = 'uom';

	if (this.uom && this.uom['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.uom['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}

moveToPrimaryPackage() {
	this.activateScroll = false;
	this.ActivityLog = false;
	this.activeTab = 'primary-packaging';

	if (this.primaryPackaging && this.primaryPackaging['nativeElement'].offsetTop) {
		this.scrollContainer['nativeElement'].scrollTop = this.primaryPackaging['nativeElement'].offsetTop - 46;
	}
	setTimeout(() => {
		this.activateScroll = true;
	}, 100);
}
  
  moveToInvoice() {
		this.activateScroll = false;
		this.activeTab = 'invoice';
		if (this.invoice && this.invoice['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.invoice['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
  }
  moveToCoa() {
		this.activateScroll = false;
		this.activeTab = 'coa';
		if (this.coa && this.coa['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.coa['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
  }
  
  moveToShipping() {
		this.activateScroll = false;
		this.activeTab = 'shipping';
		if (this.shipping && this.shipping['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.shipping['nativeElement'].offsetTop - 46;
		}
		// this.getAddedFiles();
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
		
	}
	
	moveToMsdsForm() {
		this.activateScroll = false;
		this.activeTab = 'msdsForm';
		if (this.msdsForm && this.msdsForm['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.msdsForm['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}

	moveToNonHazardous() {
		this.activateScroll = false;
		this.activeTab = 'nonHazardous';
		if (this.nonHazardous && this.nonHazardous['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.nonHazardous['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	moveToFormSdf() {
		this.activateScroll = false;
		this.activeTab = 'Formsdf';
		if (this.Formsdf && this.Formsdf['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Formsdf['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	moveToExportValue() {
		this.activateScroll = false;
		this.activeTab = 'Exportvalue';
		if (this.Exportvalue && this.Exportvalue['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Exportvalue['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	moveToDeclaration() {
		this.activateScroll = false;
		this.activeTab = 'Declaration';
		if (this.Declaration && this.Declaration['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Declaration['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	changePoNo(event: any) {
		let poNumber: any;
		
		if (this.timestamp) clearTimeout(this.timestamp);
		this.timestamp = setTimeout(() => {
			if (event.target.innerText != '') {
				
				poNumber = event.target.innerText;
				this.modPoNum =poNumber;
				this.OrdersService
					.changePoNumbr(
						{
							id: this.orders.selectedOrder.id,
							po_nbr: poNumber,
							po_date: this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : '',
							line_item: this.orders.selectedOrder.line_item ? this.orders.selectedOrder.line_item : ''
						})
					.then(response => {
						// this.orders.selectedOrder.po_nbr = response.result.data.po_nbr
					});
			}
		}, 1500);
	}
	openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
	}
	savePoDate() {
		// console.log(2525)
		let poDate: any;
		if (this.po_date2) {
			poDate = moment(this.po_date2).format('YYYY-MM-DD');
			this.OrdersService
				.changePoNumbr(
					{
						id: this.orders.selectedOrder.id,
						po_nbr: this.modPoNum ?this.modPoNum : this.orders.selectedOrder.po_nbr,
						po_date: poDate,
						line_item: this.orders.selectedOrder.line_item ? this.orders.selectedOrder.line_item : ''
					})
				.then(response => {
					//  this.orders.selectedOrder.po_date = response.result.data.po_date
				});
		}
	}

	getclientDocPermissions(): void{
		this.OrdersService
			.getclientDocPermissions({ id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					// console.log(response.result.data);
				} else {
					// console.log('failed');
				}
			});
	}
	addConcernData(): void {
		let id: any
		id = this.orders.selectedOrder.id
		this.OrdersService
			.addOrdersConcern({ orders_id: id, concern_data: this.concernData, id: this.getConcernData.id || 0 })
			.then(response => {
				if (response.result.success) {
					this.concernEditable = false
					this.getConcernData = response.result.data
				}
			});
	}
	public saveAddLineItem = false;
	addCoaLineItem(): void {
		this.OrdersService
			.changePoNumbr(
				{
					id: this.orders.selectedOrder.id,
					line_item: this.orders.selectedOrder.line_item,
					po_nbr: this.orders.selectedOrder.po_nbr ? this.orders.selectedOrder.po_nbr : '',
					po_date: this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : ''

				})
			.then(response => {
				if (response.result.success) {
					this.editable = false;
					
					this.coaLineItemEdit = false;
					this.orders.selectedOrder.line_item = response.result.data.line_item;
					this.saveAddLineItem = this.orders.selectedOrder.line_item ? true : false;
					this.coalineItem = response.result.data.line_item;
				}
			});
	}

  backToOrders(stepper: MatStepper) {
    this.router.navigate(['/orders']);
	}

  acceptOrder(event: any): void {
		event.target.disabled = true;
		this.OrdersService
			.acceptOrder({ id: this.orders.selectedOrder.id, orders_types_id: 2 })
			.then(response => {
				// console.log(7)
				this.orders.selectedOrder.orders_types_id = '2';
				this.selectedOrderStatus = 'Accepted';
				this.getOrdersActivityDetails();
			});
	}

	editformCoa() {
		if (!this.editable) {
			this.editable = true;
		} else {
			this.editable = false;
		}
		if (this.orders.selectedOrder.line_item) {
			this.coaLineItemEdit = true;
		} else {
			this.coaLineItemEdit = false;
		}
	}
	onCoaLineItem(event: any) {
		// console.log(event)
		this.coaLineItemEdit = true
	}
	cancelCoaLineItem() {
		this.editable = false;
		this.coaLineItemEdit = false;
		this.orders.selectedOrder.line_item = this.coalineItem;
	}

	deleteUploads(file, i, flag) {
		// console.log(flag)
		this.OrdersService
			.deleteFileAttachments({ id: file.id, att_id: file.att_id })
			.then(response => {
				if (response.result.success) {
					let toast: object;
					toast = { msg: 'File deleted successfully', status: 'success' };
					this.snackbar.showSnackBar(toast);
					if(flag == 'origin') {
						this.originFileAttachments.splice(i, 1);
					} else if(flag == 'insurance') {
						this.insuranceAttachments.splice(i, 1);
					} else if (flag == 'shipping'){
						this.shippingAttachments.splice(i, 1)
					} else {
						this.airwayAttachments.splice(i, 1);
					};
				}
			})
		
	}
	public editDescription = false;
	public showPackageSavePanel = false;
	valChanged(event) {
		// console.log(event)
		this.showPackageSavePanel = true;
		this.packageDescription = event.target.value;
	}
	descriptionEdit() {
		this.editDescription = true;
	}
	editPackageDescription() {
		// console.log(this.data)
		let param = {
			id: this.data.id,
			description: this.packageDescription
		}
		this.OrdersService
			.updateOrdersPackage(param)
			.then(response => {
				if (response.result.success) {
					let toast: object;
					toast = { msg: 'Package details updated successfully', status: 'success' };
					this.snackbar.showSnackBar(toast);
					this.showPackageSavePanel = false;
					this.editDescription = false;
				} else {
					let toast: object;
					toast = { msg: 'Failed To Update', status: 'success' };
					this.snackbar.showSnackBar(toast);
				}
			})
	}
	cancelPackageDescription() {
		this.getPackagingDetails();
		this.showPackageSavePanel = false;
		this.editDescription = false;
	}
	openPreview(file, i: number, flag): void {console.log(file.link_url)
		if(file.link_url.lastIndexOf('.pdf') == -1 && file.link_url.lastIndexOf('.doc') == -1 && file.link_url.lastIndexOf('.docx') == -1 && file.link_url.lastIndexOf('.xlsx') == -1) {
			if(flag == 'origin') {
				this._lightbox.open(this.originFileAttachments, i);
			} else if(flag == 'insurance') {
				this._lightbox.open(this.insuranceAttachments, i);
			} else if (flag == 'shipping'){
				this._lightbox.open(this.shippingAttachments, i);
			} else {
				this._lightbox.open(this.airwayAttachments, i);
			};
		} else {
			let dialogRef = this.dialog.open(PdfPreviewComponent, {
				width: '850px',
				data: file
			});
		}
		
	}
	downloadFile(file, i, flag) {
		var downloadUrl = App.base_url + 'downloadFile?link_url='+ file.link_url + '&original_name=' + file.original_name;
        window.open(downloadUrl, '_blank');
		
		
	}
}
