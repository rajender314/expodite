import { EpiCurrencyPipe } from '../../pipes/epi-currency.pipe';
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
import { FileUploader } from 'ng2-file-upload';
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
import { Router } from '@angular/router';
import { PowerConversionPipe } from '../../pipes/power-conversion.pipe';
declare var App: any;
import {AccountsService}from '../../services/accounts.service'; 
import { ReceiveAmountComponent } from '../../dialogs/receive-amount/receive-amount.component';
import { AddCreditComponent } from '../../dialogs/add-credit/add-credit.component';
import { AddDebitComponent } from '../../dialogs/add-debit/add-debit.component';

declare var App: any;
@Component({
  selector: 'app-debit-note',
  templateUrl: './debit-note.component.html',
  styleUrls: ['./debit-note.component.scss'],
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

export class DebitNoteComponent implements OnInit {
	private css = '@page { size: landscape; }';
	private head = document.head || document.getElementsByClassName('adc-sheet');
	private style = document.createElement('style');
	private App = App;
	public userDetails: any;
	public orderButton: any;
	public collapseOut: any;
	public clientPermission: any;
	public factoryPermission: boolean = true;
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
	public showFilter = false;
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
	public showMsds: boolean = true;
	public showNonhazardous: boolean = true;
	public showSdf: boolean = true;
	public showExportvalue: boolean = true;
	public showDeclaration: boolean = true;
	public showShippers: boolean = true;
	public showAdcsheet: boolean = true;
	public showDeclarationIncentive: boolean = true;
	public showScomatDeclaration: boolean = true;
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

	displayedColumns = ['order_product_id', 'product_name', 'product_quantity', 'product_price', 'product_price_total'];
	params = {
		pageSize: 12,
		page: 1,
		search: ''
	}

	toppings = new FormControl();
	paymentType = [
		{ value: 'Advance', viewValue: 'Advance' },
		{ value: '30 days', viewValue: '30 days' },
		{ value: '45 days', viewValue: '45 days' },
		{ value: '60 days', viewValue: '60 days' }
	];
	public docsList = {
		standardLinks:[
			{ id: 0, name: "Activity", selected: true, class: "activity", function: 'moveToActivity', imgSrc: this.images.activity_small },
			{ id: 1, name: "Order Details", selected: true, class: "details", function: "moveToDetails", imgSrc: this.images.orders_small },
			{ id: 2, name: "Invoice", selected: true, class: "invoice", function: "moveToInvoice", imgSrc: this.images.invoice_small },
			{ id: 3, name: "Packing Details", selected: true, class: "packaging", function: "moveToPackaging", imgSrc: this.images.pkgDetails_small },
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
	data = {
		id: '',
		selectedStatuses: [],
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
	public createOrderPermission = false;
	public otherDocs = [];
	private param: any = {
		page: 1,
		perPage: 12,
		sort: 'ASC',
		search: '',
	}
	@ViewChild('stepper') stepper: TemplateRef<any>;
	@ViewChild('scrollContainer') scrollContainer: TemplateRef<any>;
	@ViewChild('activity') activity: TemplateRef<any>;
	@ViewChild('details') details: TemplateRef<any>;
	@ViewChild('packaging') packaging: TemplateRef<any>;
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
	public onLoadFiles = ['origin', 'insurance', 'shipping', 'Bill'];
	
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

	
	
	constructor(
		private titleService: Title,
		private InventoryService: InventoryService,
		private OrdersService: OrdersService,
		private organizationsService: OrganizationsService,
		private snackbar: SnakbarService,
		private formBuilder: FormBuilder,
		public dialog: MatDialog,
		private cookie: CookieService,
		private _lightbox: Lightbox,
		private router: Router,
		private AccountsService:AccountsService
		
	) {

		
	}

	
	ngOnInit() {
		this.titleService.setTitle('Expodite - Accounts');
			this.orderFormCompanyDetails = App['company_data'];

    this.getListDebitNotes(true)
    this.getNotesFilters()
		// this.myProfile = this.organizationsService.checkClientProfilePermission();
		
		this.getclientDocPermissions();
		// this.getShipperAddress();
		this.userDetails = App.user_details;
		let permission: boolean;
		let profile: boolean;
		let createOrder: boolean;
		let admin_profile: boolean;
		
		this.factoryPermission = true;
		this.clientPermission = profile;
		this.adminUser = admin_profile;

		this.downloadStatus = false;
		// this.totalSpinner = false
		// if (this.cookie.check('order_id')) {
		// 	let order_id = this.cookie.get('order_id');
		// 	this.assignDetailView(order_id);
		// 	// setTimeout(() => {
				
		// 	// 	this.stepper['selectedIndex'] = 1;
		// 	// }, 500);
		// 	this.cookie.delete('order_id');
		// 	this.searching = false;
		// } else {
			//this.getOrdersList(true);


		// }
		
		
		
		this.showFilter = false;
		this.ActivityLog = false;
		this.editShipping = true;

		this.clientsFilterCtrl.valueChanges
			.pipe(takeUntil(this._onDestroy))
			.subscribe(() => {
				this.searchOrganizations();
			});
		this.po_date2 = new Date(this.orders.selectedOrder.po_date ? this.orders.selectedOrder.po_date : "");
	}
	
	ngOnDestroy() {
		this._onDestroy.next();
		this._onDestroy.complete();
	}
	userDetailsType() {
		if (this.userDetails.log_type == 1) {
			this.blockContent = true
		} else {
			this.blockContent = false
		}
	}
	

	
  public clientFilters:any
  public invStatus:any
  getNotesFilters():void{
    this.AccountsService
    .getNotesFilters()
        .then(response => {
          // console.log(response)
          if(response.result.success) {
            this.clientFilters = response.result.data.organizations;
            console.log(this.clientFilters)
            this.invStatus = response.result.data.notes_status;
            this.invStatus .map(function (value) {
              value.selected = false;
            });
  
          }
        })
        
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
	setImageUrl() {
		this.imageUploadUrl = App.base_url + 'addOrderAtt?orders_id=' + this.orders.selectedOrder.id;
		this.uploader.setOptions({ url : this.imageUploadUrl})
	}
	setAddedFilesUrl(flag) {
		if(flag == 'origin') {
			this.imagUploadFlag = 'country';
		} else if(flag == 'insuranceFlag') {
			this.imagUploadFlag = 'insurance';
		}  else if(flag == 'shipping') {
			this.imagUploadFlag = 'shipping';
		}else{
			this.imagUploadFlag = 'Bill';
		}
		this.uploader.setOptions({ url : App.base_url + 'addFiles?orders_id=' + this.orders.selectedOrder.id + '&type='+ this.imagUploadFlag})
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
	deleteUploads(file, i, flag) {
		
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
	
	getAddedFiles(flag) {
		if(flag == 'origin') {
			this.getFileFlag = 'country';
		} else if(flag == 'insurance') {
			this.getFileFlag = 'insurance';
		} else if(flag == 'shipping'){
			this.getFileFlag = 'shipping';
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
					} else if(flag == 'insurance') {
						this.insuranceAttachments = response.result.data.OrdersAtt;
					} else if(flag == 'shipping'){
						this.shippingAttachments = response.result.data.OrdersAtt;
					} else{
						this.airwayAttachments = response.result.data.OrdersAtt;
					}
					
				} else {
					this.originFileAttachments = [];
				}
			});
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
	savePoDate() {
		let poDate: any;
		if (this.po_date2) {
			poDate = moment(this.po_date2).format('YYYY-MM-DD');
			this.OrdersService
				.changePoNumbr(
					{
						id: this.orders.selectedOrder.id,
						po_nbr: this.orders.selectedOrder.po_nbr ? this.orders.selectedOrder.po_nbr : '',
						po_date: poDate,
						line_item: this.orders.selectedOrder.line_item ? this.orders.selectedOrder.line_item : ''
					})
				.then(response => {
					//  this.orders.selectedOrder.po_date = response.result.data.po_date
				});
		}
	}

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
					this.coalineItem = response.result.data.line_item;
				}
			});
	}

	onCoaLineItem(event: any) {
		this.coaLineItemEdit = true
	}
	cancelCoaLineItem() {
		this.editable = false;
		this.coaLineItemEdit = false;
		this.orders.selectedOrder.line_item = this.coalineItem;
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
								}
							});

					}

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
				this.orders.productsData.data = selectedOrderDetails.productsData;

			});
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
	moveToLut() {
		this.activateScroll = false;
		this.activeTab = 'Lut';
		if (this.Lut && this.Lut['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Lut['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	moveToIec() {
		this.activateScroll = false;
		this.activeTab = 'Iec';
		if (this.Iec && this.Iec['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.Iec['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
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
	moveToSez() {
		this.activateScroll = false;
		this.activeTab = 'SezUnit';
		if (this.SezUnit && this.SezUnit['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.SezUnit['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
	}
	moveToTaxInvoice() {
		this.activateScroll = false;
		this.activeTab = 'taxInvoice';
		if (this.taxInvoice && this.taxInvoice['nativeElement'].offsetTop) {
			this.scrollContainer['nativeElement'].scrollTop = this.taxInvoice['nativeElement'].offsetTop - 46;
		}
		setTimeout(() => {
			this.activateScroll = true;
		}, 100);
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
	resetPrint() {
		if (this.packaging && this.packaging['nativeElement'])
			this.packaging['nativeElement'].print = false;

		if (this.invoice && this.invoice['nativeElement'])
			this.invoice['nativeElement'].print = false;

		if (this.details && this.details['nativeElement'])
			this.details['nativeElement'].print = false;

		if (this.shipping && this.shipping['nativeElement'])
			this.shipping['nativeElement'].print = false;
	}

	printOrderDetail() {
		this.resetPrint();
		this.details['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.details['nativeElement'].print = false;
		}, 1000);
	}
	printPackaging() {
		this.resetPrint();
		this.packaging['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.packaging['nativeElement'].print = false;
		}, 1000);
	}

	printInovice() {
		this.resetPrint();
		this.invoice['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.invoice['nativeElement'].print = false;
		}, 1000);
	}
	printTaxInovice() {
		this.resetPrint();
		this.taxInvoice['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.taxInvoice['nativeElement'].print = false;
		}, 1000);
	}
	printShipping() {
		this.shipping['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.shipping['nativeElement'].print = false;
		}, 1000);
	}

	printCoa() {
		this.coa['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.coa['nativeElement'].print = false;
		}, 1000);
	}
	printMsds() {
		this.msdsForm['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.msdsForm['nativeElement'].print = false;
		}, 1000);
	}

	printNonHazardous() {
		this.nonHazardous['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.nonHazardous['nativeElement'].print = false;
		}, 1000);
	}
	printSdf() {
		this.Formsdf['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Formsdf['nativeElement'].print = false;
		}, 1000);
	}
	printExportValue() {
		this.Exportvalue['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Exportvalue['nativeElement'].print = false;
		}, 1000);
	}
	printDeclaration() {
		this.Declaration['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Declaration['nativeElement'].print = false;
		}, 1000);
	}
	printShippersLetter() {
		this.Shippersletter['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Shippersletter['nativeElement'].print = false;
		}, 1000);
	}


	printAdcSheet() {
		this.Adcsheet['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Adcsheet['nativeElement'].print = false;
		}, 1000);
	}

	printIncentive() {
		this.Incentivedeclaration['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Incentivedeclaration['nativeElement'].print = false;
		}, 1000);
	}
	printScomat() {
		this.Scomatdeclaration['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Scomatdeclaration['nativeElement'].print = false;
		}, 1000);
	}
	printConcern() {
		this.Concern['nativeElement'].print = true;
		setTimeout(() => {
			window.print();
			this.Concern['nativeElement'].print = false;
		}, 1000);
	}
	printOrder() {
		if (this.packaging && this.packaging['nativeElement']) {
			this.packaging['nativeElement'].print = true;
		}

		if (this.invoice && this.invoice['nativeElement']) {
			this.invoice['nativeElement'].print = true;
		}


		if (this.details && this.details['nativeElement']) {
			this.details['nativeElement'].print = true;

		}

		if (this.shipping && this.shipping['nativeElement']) {
			this.shipping['nativeElement'].print = true;
		}


		if (this.coa && this.coa['nativeElement']) {
			this.coa['nativeElement'].print = true;
		}


		if (this.msdsForm && this.msdsForm['nativeElement']) {
			this.msdsForm['nativeElement'].print = true;
		}


		if (this.nonHazardous && this.nonHazardous['nativeElement']) {
			this.nonHazardous['nativeElement'].print = true;
		}


		if (this.Formsdf && this.Formsdf['nativeElement']) {
			this.Formsdf['nativeElement'].print = true;
		}


		if (this.Exportvalue && this.Exportvalue['nativeElement']) {
			this.Exportvalue['nativeElement'].print = true;
		}


		if (this.Declaration && this.Declaration['nativeElement']) {
			this.Declaration['nativeElement'].print = true;

		}

		if (this.Shippersletter && this.Shippersletter['nativeElement']) {
			this.Shippersletter['nativeElement'].print = true;
		}


		if (this.Incentivedeclaration && this.Incentivedeclaration['nativeElement']) {
			this.Incentivedeclaration['nativeElement'].print = true;

		}

		if (this.Scomatdeclaration && this.Scomatdeclaration['nativeElement']) {
			this.Scomatdeclaration['nativeElement'].print = true;

		}

		if (this.Concern && this.Concern['nativeElement']) {
			this.Concern['nativeElement'].print = true;
		}


		if (this.Adcode && this.Adcode['nativeElement']) {
			this.Adcode['nativeElement'].print = true;
		}


		if (this.Lut && this.Lut['nativeElement']) {
			this.Lut['nativeElement'].print = true;

		}

		if (this.Iec && this.Iec['nativeElement']) {
			this.Iec['nativeElement'].print = true;
		}


		if (this.Ssi && this.Ssi['nativeElement']) {
			this.Ssi['nativeElement'].print = true;
		}


		if (this.Otherdocs && this.Otherdocs['nativeElemet']) {
			this.Otherdocs['nativeElement'].print = true;

		}

		setTimeout(() => {
			window.print();
			this.packaging['nativeElement'].print = false;
			this.invoice['nativeElement'].print = false;
			this.details['nativeElement'].print = false;
			this.shipping['nativeElement'].print = false;
			this.coa['nativeElement'].print = false;
			this.msdsForm['nativeElement'].print = false;
			this.nonHazardous['nativeElement'].print = false;
			this.Formsdf['nativeElement'].print = false;
			this.Exportvalue['nativeElement'].print = false;
			this.Declaration['nativeElement'].print = false;
			this.Shippersletter['nativeElement'].print = false;
			this.Incentivedeclaration['nativeElement'].print = false;
			this.Scomatdeclaration['nativeElement'].print = false;
			this.Concern['nativeElement'].print = false;

		}, 1000);
	}

	backToOrders(stepper: MatStepper) {
		this.otherDocs = [];
		this.activeTab = 'activity'
		this.shippingForm.patchValue({
			transport_mode: 1,
			mode_transport_id: '',
			aws_number: '',
			bol_number: ''
		});
		this.shippingForm.markAsPristine();
		this.shippingForm.markAsUntouched();
		this.totalSpinner = true;
		stepper.previous();
		this.ActivityLog = false;
		this.params.page = 1;
		this.getOrdersList(true);
		this.orders.packageOrders['invStatus'] = 1
		this.activity['nativeElement'].show = false;
		this.totalSpinner = false;
		this.shippingActiveState = false;
	}
	selectState() {
		this.activeState = true;
	}
	selectShipping() {
		console.log(22222)
		this.shippingActiveState = true;
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

	orderDetails(stepper: MatStepper, data: any) {
		this.router.navigate(['/orders', data.orders.id]);
		return
		stepper.next();
		this.totalSpinner = true
		let showDocs;
		let tax;
		this.data.id = data.orders.id;
		this.fetchingData = true;
		this.selectedOrderStatus = '';
		this.orders.notifyAddr = {};
		// this.enableInvoice = false;
		// this.priceQuantityDisable = false;
		this.OrdersService
			.getOrdersList(this.data)
			.then(response => {
				this.totalSpinner = false;
				let selectedOrderDetails = response.result.data.totalordersDt[0].list[0];
				// console.log(selectedOrderDetails)
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

	checkboxChange(data: any): void {
		// console.log(data)
		data.selected = !data.selected;
		this.showFilter = true;
	}
	changefob(invoice: any, event: any) {
		this.organizationsService
			.addfobvalue({ invoice_id: invoice.id, fob_value: event.target.innerHTML })
			.then(response => {
				if (response.result.success) {
					this.timeout = setTimeout(() => {
						this.getInvoiceData();
					}, 1000);
				}
			});

	}
	clientChange() {
		// console.log("Client selected!");
		this.showFilter = true;
	}
	getOrganizations() {
		this.param.search = '';
		this.param['flag'] = 1;
		this.organizationsService
			.getOrganizationsList(this.param)
			.then(response => {
				if (response.result.success) {
					this.orders.organizations = response.result.data.organization;
					// console.log("Client selected!");

				}
			});
	}

	getShipperAddress() {
		this.OrdersService
			.getShipperAddress(this.getPagams())
			.then(response => {
				// console.log(response)
				if (response.result.success) {
					this.orders.shippingAddress = response.result.data.companyShpAddrDt;
					this.orders.shippingAddress.map(function (value) {
						value.selected = false;
					});
				}
			})
	}
	public listCount = 0;
	getOrdersList(clearList?: any): void {
		// console.log('called')
		if (clearList) {
			this.fetchingData = true;
		}
		this.OrdersService
			.getOrdersList(this.getPagams())
			.then(response => {
				this.fetchingData = false;
				this.filtersLoader = false;
				if (response.result.success) {

					if (clearList) {
						this.orders.data = [];
					}
					let data = response.result.data.totalordersDt;
				//	this.totalCount = response.result.data.total;
					//this.listCount = response.result.data ? response.result.data['pageCount'] : 0;
					data.map(res => {
						this.orders.data.push(res);
					});

					let res=[];
					this.orders.data.map(function(item){
						var existItem = res.find(x=>x.date==item.date);
						if(existItem) {
							res.forEach(item2 => {
								if(item2.date == item.date) {
									item2.list = item2.list.concat(item.list)
								}
							})
						} else {
							res.push(item);
						}
					});
					this.orders.data = res;
					
					this.searching = false;
					

				}
			});
	}

  public igstData:any
  getListDebitNotes(clearList?: any):void{
    if (clearList) {
			this.fetchingData = true;
		}
    this.AccountsService
    .getListDebitNotes(this.getPagams())
        .then(response => {
          // console.log(response)
          this.fetchingData = false;
          this.filtersLoader = false;
          if (response.result.success) {
            this.totalCount = response.result.data.total;
            if (clearList) {
              this.igstData= [];
            }
            let data = response.result.data.result;
          //	this.totalCount = response.result.data.total;
            this.listCount = response.result.data ? response.result.data['pageCount'] : 0;
            data.map(res => {
              this.igstData.push(res);
            });
  
            // let res=[];
            // this.igstData.map(function(item){
            //   var existItem = res.find(x=>x.client==item.client);
            //   if(existItem) {
            //     res.forEach(item2 => {
            //       if(item2.client == item.client) {
            //         item2.list = item2.list.concat(item.list)
            //       }
            //     })
            //   } else {
            //     res.push(item);
            //   }
            // });
            // this.igstData= res;
            
            this.searching = false;
            
  
          }
        })
        
	   }
	   addDebit() {
		let dialogRef = this.dialog.open(AddDebitComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			data: this.orders.selectedOrder.id,
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result ) {
				this.igstData =[]
				this.getListDebitNotes();
			}
		});
	}
	
	editCredit(data = {}) {
		console.log(data)
		let dialogRef = this.dialog.open(AddDebitComponent, {
		  panelClass: 'alert-dialog',
		  width: '500px',
		  data: {
			type:1,
			...data
		  }
		});
		dialogRef.afterClosed().subscribe(result => {
		  if (result) {
			this.igstData =[]
			this.getListDebitNotes();
		  }
		});
	  }
	getProductTypesData(): void {
		this.organizationsService
			.getProductsList({ org_id: this.App.user_details.org_id, flag: 1 })
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

	getPagams() {
		// console.log(moment(this.orders.mfg_date).add(1, 'days').format('"YYYY-MM-DD'))
		let data = {
			selectedStatuses: [],
			selectedProducts: [],
			selectedShippingAddress: [],
			selectedClients: this.orders.selectedClients.value,
			client_search: this.orders.client_search,
			manifacture_date: this.orders.mfg_date,
			search: this.params.search,
			pageSize: this.params.pageSize,
			page: this.params.page,
			sortBy: '',
			flag: 1
		};

		if(this.orders.mfg_date == '') {
			data.manifacture_date = '';
		} else {
			data.manifacture_date = moment(this.orders.mfg_date).format('YYYY-MM-DD');
		}	

		if(this.filterApplied) {
			this.invStatus.map(function (value) {
				if (value.selected) {
					data.selectedStatuses.push(value.id);
				}
			});

			this.orders.shippingAddress.map(function (value) {
				if (value.selected) {
					data.selectedShippingAddress.push(value.id);
				}
			});
			this.orders.productsList.map(function (value) {
				if (value.selected) {
					data.selectedProducts.push(value.id);
				}
			});
			this.orders.expectedDeliveryDate.map(function (value) {
				if (value.selected) {
					data.sortBy = 'exp_delivery_date'
				}
			})
		}
		
		
		return data;
	}
	changePrice1(product: any, event: any, value: any) {
console.log(product,event,value)
	}
	editAmount(data:any,type:any){
		console.log(data,"editdata")
		let dialogRef = this.dialog.open(ReceiveAmountComponent, {
			panelClass: 'alert-dialog',
			width: '400px',
			data: {
				type: type,
				...data
			  }
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result ) {
				this.igstData =[]
			this.getListDebitNotes()	
			}
		});

	}
	clearFilterData() {
		this.showFilter = false;
		this.filterApplied = false;
		this.invStatus.map(function (value) {
			value.selected = false;
		});
		this.orders.shippingAddress.map(function (value) {
			value.selected = false;
		});
		this.orders.productsList.map(function (value) {
			value.selected = false;
		});
		this.orders.expectedDeliveryDate.map(function (value) {
			value.selected = false;
		})
		this.activeState = false;
		this.orders.selectedClients = new FormControl([]);
		this.orders.client_search = '';
		this.orders.mfg_date = '';
		this.getListDebitNotes(true)
	}

	datePickerChange() {
		this.showFilter = true;
	}
	public filterApplied = false;
	applyFilterData() {
		this.filterApplied = true;
		this.params.page = 1;
		this.searching = true;
		let toast: object;
		toast = { msg: 'Filters applied successfully.', status: 'success' };
	//	this.getOrdersList(true);
    this.getListDebitNotes(true)
		this.snackbar.showSnackBar(toast);
	}

	searchOrders(search: string, event?: any): void {
		this.params.search = search;
		this.params.page = 1;
		this.searching = true;
		if (this.timeout) {
			clearTimeout(this.timeout);
		}
		this.timeout = setTimeout(() => {
			this.getListDebitNotes(true);
		}, 1000);
	}
	loadMore(event) {
	console.log(5)
		 this.params.pageSize = event.perPage,
		 this.params.page = event.page,
		this.getListDebitNotes(true);
	}

	onScroll(): void {
		console.log(2536)
		if (this.params.page < this.totalPages && this.totalPages != 0) {
			this.params.page++;
			this.getListDebitNotes();
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
	getInventoryDetails(data): void {
		this.orders.selectedOrder = data.orders;
		this.orders.billingAddr = data.billingAddr;
		this.orders.shippingAddr = data.shippingAddr;
		if (data.notifyingAddr) {
			this.orders.notifyAddr = Object.assign(data.notifyingAddr);
		}

	}
	openCalendar(picker: MatDatepicker<Date>) {
		picker.open();
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
	getOrdersActivityDetails(): void {
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
	checkOrders(): void {
		this.OrdersService
			.getCheckOrdersPdf({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.checkOrdersPdf.checkOrders = response.result.data;
					this.checkOrdersPdf.checkOrdersId = this.orders.selectedOrder.id;
				} else {
					this.checkOrdersPdf.checkOrdersId = this.orders.selectedOrder.id;
				}
			});
	}
	changePaymentType(event: any): void {
		this.activePayment = true;
		if (event != '') {
			// console.log(event)
			this.orders.invoice[0].Inovice.payment_type = event;
		}

	}
	cancelpay() {
		this.activePayment = false;
	}
	savePaymentType() {
		this.updateKeyValue();
		this.activePayment = false;
	}
	getPackagingDetails(): void {
		this.containerName = [];
		this.OrdersService
			.getPackagingOrderDetails({ id: this.orders.selectedOrder.id })
			.then(response => {
				if (response.result.success) {
					this.orders.packageOrders = response.result.data;
					this.orders.packing = response.result.data.packing;
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
						this.getInvoiceData();
						this.getOrdersActivityDetails();
						this.packageCompleted = true;
					} else {
						this.orders.packageOrders['invStatus'] = response.result.data.invStatus;
					}
					if (response.result.data.invStatus == '1') {
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
	cancelPackages(): void {
		this.OrdersService
			.acceptOrder({ id: this.orders.selectedOrder.id, orders_types_id: 5 })
			.then(response => {
				this.orders.selectedOrder.orders_types_id = '5';
				this.selectedOrderStatus = 'Cancelled';
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
				this.orders.selectedOrder.orders_types_id = '5';
				this.selectedOrderStatus = 'Cancelled';
				this.getOrdersActivityDetails();
			}
		});
	}
	deliverOrder(): void {
		let dialogRef = this.dialog.open(DeliverOrderComponent, {
			panelClass: 'alert-dialog',
			width: '550px',
			height: '300px',
			data: this.orders.selectedOrder.id
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
	acceptOrder(event: any): void {
		event.target.disabled = true;
		this.OrdersService
			.acceptOrder({ id: this.orders.selectedOrder.id, orders_types_id: 2 })
			.then(response => {
				this.orders.selectedOrder.orders_types_id = '2';
				this.selectedOrderStatus = 'Accepted';
				this.getOrdersActivityDetails();
			});
	}
	generateInvoice() {
		this.invoiceGenerateLoader = true;
		this.clickedGenerateInvoice = true;
		this.OrdersService
		
			.generateInvoice({ orders_id: this.orders.selectedOrder.id })
			.then(response => {
				
				this.hideShipperAddress = true;
				this.orders.selectedOrder.orders_types_id = '6';
				this.getInvoiceData();

				this.clickedGenerateInvoice = false;
				this.selectedOrderStatus = 'Processing';
			});
	}
	getInvoiceData() {
		this.enableInvoice = true;
		this.getOrdersActivityDetails();
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
	changeInvoiceExtraKey(index, event) {
		if (this.timestamp) clearTimeout(this.timestamp);
		this.timestamp = setTimeout(() => {
			if (event.target.innerText != '') {
				this.orders.invoice[0].Inovice.extra_col[index].key = event.target.innerText;
				this.updateKeyValue();
			}
		}, 1000);
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

	changeInvoiceExtraValue(index, event) {
		let numberRegex = /[0-9]/g;
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.extra_col[index].value = event.target.innerText;
					this.updateKeyValue();
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
	changeInvoiceTaxGst(index, event) {
		let numberRegex = /[0-9]/g;
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.tax_gst = event.target.innerText;
					this.updateKeyValue();
				}
			}, 1000);
		} else {
			return false;
		}
	}
	changeInvoiceTaxCgst(index, event) {
		let numberRegex = /[0-9]/g;
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.tax_csgt = event.target.innerText;
					this.updateKeyValue();
				}
			}, 1000);
		} else {
			return false;
		}
	}
	changeInvoiceTaxIgst(index, event) {
		let numberRegex = /[0-9]/g;
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.tax_igst = event.target.innerText;
					this.updateKeyValue();
				}
			}, 1000);
		} else {
			return false;
		}
	}
	changeInvoiceTaxOthers(index, event) {
		let numberRegex = /[0-9]/g;
		if (numberRegex.test(event.key) || event.key == 'Backspace' || event.key == 'Delete') {
			if (this.timestamp) clearTimeout(this.timestamp);
			this.timestamp = setTimeout(() => {
				if (event.target.innerText != '') {
					this.orders.invoice[0].Inovice.tax_others = event.target.innerText;
					this.updateKeyValue();
				}
			}, 1000);
		} else {
			return false;
		}
	}
	changeInvoiceExtraValueBak(index, event) {
		let currentVal = event.target.innerText.match(/[0-9]/g);
		if (currentVal) {
			event.target.innerText = currentVal.join('');
			this.orders.invoice[0].Inovice.extra_col[index].value = currentVal.join('');
		} else {
			event.target.innerText = '';
			this.orders.invoice[0].Inovice.extra_col[index].value = '';
		}
		if (this.timestamp) clearTimeout(this.timestamp);
		this.timestamp = setTimeout(() => {
			if (currentVal) {
				this.updateKeyValue();
			}
		}, 1000);

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
	generateShippingAddressForm(): void {
		this.shippingForm = this.formBuilder.group({
			aws_number: [null],
			bol_number: [null],
			terms: [],
			mode_transport_id: [null, Validators.required],
			transport_mode: [1, Validators.required]
		});
	}
	setUserCategoryValidators() {
		const AWSCtrl = this.shippingForm.get('aws_number');
		const BOLCtrl = this.shippingForm.get('bol_number');

		this.shippingForm.get('transport_mode').valueChanges
      .subscribe(userCategory => {  
		//   console.log(userCategory)
		if (userCategory == 1) {
			BOLCtrl.setValidators(null);
			AWSCtrl.setValidators([Validators.required]);

		} else {
			AWSCtrl.setValidators(null);
			BOLCtrl.setValidators([Validators.required]);
		}

		AWSCtrl.updateValueAndValidity();
		BOLCtrl.updateValueAndValidity();
	  })
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

	}
	getShippingAddressDetails(): void {
		console.log(123)
		this.OrdersService
			.getShippingDetails({
				invoice_id: this.orders.invoice.length ? this.orders.invoice[0].Inovice.id: ''
			})
			.then(response => {
				console.log(response)
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
				}
				// this.disableCancel = true;
			});
	}
	cancelShip() {
		this.shippingActiveState = false;
		this.getShippingAddressDetails();
		this.editShipping = true;
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
		let toast: object;
		if (form.valid) {
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
					bol_id: this.shippingForm.value.bol_number
				})
				.then(response => {
					this.invoiceGenerateLoader = false; 
					this.submitShippingForm = false;
					// this.totalSpinner = false;
					if (response.result.success) {
						this.sendDocumentMails = true;
						this.orders.shipping_id = response.result.data.shipDt.id;
						toast = { msg: 'Shipping Details saved successfully.', status: 'success' };
						this.snackbar.showSnackBar(toast);
						this.editShipping = false;
						this.getShippingAddressDetails();
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

					console.log(this.coaCompanyName);
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

	editShippingDetails() {
		console.log(11111)
		this.editShipping = true;
		this.shippingActiveState = true;

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
	checkboxDisable(event) {
		event.preventDefault();
	}
	addDrums() {
		let dialogRef = this.dialog.open(AddDrumsComponent, {
			panelClass: 'alert-dialog',
			width: '800px',
			data: this.orders.selectedOrder.id,
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				this.getPackagingDetails();
				this.downloadStatus = false;
				this.showDrumsList = true;
			}
		});
	}

	sendMails(data?: any): void {
		let dialogRef = this.dialog.open(EmailDocumentsComponent, {
			panelClass: 'alert-dialog',
			width: '640px',
			data: { order_id: this.orders.selectedOrder.id, invoice_id: this.orders.invoice[0].Inovice.id, other_docs: this.attachments}
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


	searchOrganizations() {
		if (this.matSelectOpen) {
			this.param.search = this.clientsFilterCtrl.value;
			// this.organizationsService
			// 	.getOrganizationsList(this.param)
			// 	.then(response => {
			// 		if (response.result.success) {
			// 			this.orders.organizations = response.result.data.organization;
			// 		}
			// 	});
		}
	}

	openedChange(opened: boolean) {
		this.matSelectOpen = opened ? true : false
	}

}

