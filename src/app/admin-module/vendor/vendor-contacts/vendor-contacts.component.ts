import { ContactsViewService } from './../../../services/contacts-view.service';
import { Component, OnChanges, Input, Output, EventEmitter, SimpleChange, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import  { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';

import { FileUploader } from 'ng2-file-upload';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminService } from '../../../services/admin.service';
import { AddressComponent } from '../../../dialogs/address/address.component';
import { VendorAddressComponent } from '../../../dialogs/vendor-address/vendor-address.component';

import { AlertMessageComponent } from '../../../dialogs/alert-message/alert-message.component';
import { OrganizationsService } from '../../../services/organizations.service';
import { ContactsComponent } from '../../../dialogs/contacts/contacts.component';
import { ContactDeleteAlertComponent } from '../../../dialogs/contact-delete-alert/contact-delete-alert.component';
import { AddressDeleteComponent } from '../../../dialogs/address-delete/address-delete.component';
import { UsersService } from '../../../services/users.service';
import { SnakbarService } from '../../../services/snakbar.service';
import { language } from '../../../language/language.module';
import { ViewEncapsulation } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { MoreEmailsComponent } from '../../../dialogs/more-emails/more-emails.component';
import { ClientInstructionComponent } from '../../../dialogs/client-instruction/client-instruction.component';
import { DeleteInstructionsComponent } from '../../../dialogs/delete-instructions/delete-instructions.component';
import { ViewInstructionComponent } from '../../../dialogs/view-instruction/view-instruction.component';
import { VendorDelteInstrnsComponent } from '../../../dialogs/vendor-delte-instrns/vendor-delte-instrns.component';
import { VendorInstructionsComponent } from '../../../dialogs/vendor-instructions/vendor-instructions.component';

declare var App: any;
@Component({
  selector: 'app-vendor-contacts',
  templateUrl: './vendor-contacts.component.html',
  styleUrls: ['./vendor-contacts.component.scss'],
  encapsulation: ViewEncapsulation.None,
	animations: [
		trigger('contactsAnimate', [
			transition(':enter', [
				style({ transform: 'scale(0.8)', opacity: 0 }),
				animate('300ms ease-in', style({ transform: 'scale(1)', opacity: 1 }))
			])
		])
	],

})

export class VendorContactsComponent implements OnChanges {

	@Input() Contacts;
	@Input() Organization;
	@Output() trigger = new EventEmitter<object>();
	@Output() change: EventEmitter<MatSlideToggleChange>;

	@ViewChild(MatTabGroup) tabGroup: MatTabGroup;


	selectedOrganizations: object;
	public specialInstruction: Array<any> = [];
	public organizationDetails: Array<any> = [];
	private websitePattern = /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
	detailsForm: FormGroup;
	private language = language;
	uploads = [];
	status: Array<object> = [
		{ id: 1, value: 'Active', param: true },
		{ id: 0, value: 'Inactive', param: false }
	];
	currencyX: any[];
	fetchingData: boolean;
	activestate: boolean;
	uploadError = false;
	emptyContactsData: boolean = false;
	emptyAddressData: boolean = false;
	removeTabs: boolean = false;
	pointerEvent: boolean;
	submitCountry = false;
	countries: any;
	contactsList: Array<any> = [];
	contactDesignations: Array<any> = [];
	emailAddressTypes: Array<any> = [];
	phoneNumberTypes: Array<any> = [];
	groupArray: Array<any> = [];
	moreMails: boolean;
	sizeError: boolean;
	noInstructions: boolean;
	clientCurrency: any;
	myProfile: boolean;
	adminUser: boolean;
	factoryProfile: boolean;
	public productsList: Array<any>;
	loading = true;
	public currencyabc: any;
	countriesStates: any;
	states: any[];
	submitState = false;
	saveProduct = true;
	public companyDetails: any;
	public selectedTabIndex = 0;

	// public abc : any;
	private imageUploadUrl = App.base_url + 'uploadOrgImage';

	private hasDropZoneOver: boolean = false;
	private uploader: FileUploader = new FileUploader({
		url: this.imageUploadUrl,
		allowedMimeType: ['image/png', 'image/jpeg', 'image/jpg'],
		maxFileSize: 5 * 1024 * 1024,
		autoUpload: true
	});

	constructor(
		public dialog: MatDialog,
		private userService: UsersService,
		private formBuilder: FormBuilder,
		private organizationsService: OrganizationsService,
		private http: HttpClient,
		private snackbar: SnakbarService,
		private adminService: AdminService,
		public contactsViewService: ContactsViewService
	) {
	
		this.uploader
			.onAfterAddingFile = (item: any) => {
				// this.pointerEvent = true;
			}

		this.uploader.onWhenAddingFileFailed = (item: any, filter: any, options: any) => {
			if (item.size >= options.maxFileSize) {
				// console.log('largeFile')
				this.sizeError = true
				this.uploadError = false;
			} else {
				this.uploadError = true;
				this.sizeError = false
			}

		};
		this.uploader
			.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
				let obj = JSON.parse(response);
				if (obj.result.success) {
					this.uploadError = false;
					this.sizeError = false;
					this.uploads = [];

					this.activestate = true
					this.uploads.push(obj.result.data);
				}
			}
	}

	deleteItem(index: number): void {
		// this.pointerEvent = false;
		this.activestate = true;
		this.uploads.splice(index, 1);
	}

	fileOverBase(event): void {
		this.hasDropZoneOver = event;
	}

	fileDrop(event): void {
	}
	setDirty(): void {
		this.detailsForm.markAsDirty();
	}
	fileSelected(event): void {
	}

	ngOnInit() {
		// this.tabGroup.selectedIndex = 0;
		this.factoryProfile = true;
		this.generateDetailsForm();
		this.getOrganization();
		this.getOrganizationDetails();
		this.companyDetails = App['company_data'];
		this.activestate = false;
		let profile: boolean;
		let factory_profile: boolean;
		this.organizationsService.productsList.subscribe((productsListData) => {
			this.productsList = productsListData;
			// console.log(this.productsList)
		})

		this.organizationsService.clientCurrency.subscribe(message => {this.clientCurrency = message
			// console.log(message);
		});
		this.loading = false;
		// console.log(this.clientCurrency)
		setTimeout(() => {
			let admin_profile: boolean;
			// App.user_roles_permissions.map(function (val) {
			// 	if (val.code == 'client_interface') {
			// 		if (val.selected) {
			// 			profile = false;
			// 		} else {
			// 			profile = true;
			// 		}
			// 	}
			// 	if (val.code == 'factory_user') {
			// 		if (val.selected) {
			// 			factory_profile = true;
			// 		} else {
			// 			factory_profile = false;
			// 		}
			// 	}
			// 	if (val.code == 'admin') {
			// 		if (val.selected) {
			// 			admin_profile = true;
			// 		} else {
			// 			admin_profile = false;
			// 		}
			// 	}
			// })
			this.myProfile = profile;
			this.factoryProfile = factory_profile;
			this.adminUser = admin_profile;
			// console.log(this.factoryProfile)
			this.loading = false;
		}, 1000);
		console.log(this.contactsViewService.contactRowdata)

		setTimeout(() => {
			if(this.contactsViewService.contactRowdata && this.contactsViewService.contactRowdata['org_id'] != undefined) {
				this.selectedTabIndex = 1;
			} else {
				this.selectedTabIndex = 0;
			}
		}, 1000);
	
	}

	// "factory_user"
	specialInstructionsList(): void {
		this.organizationsService
			.getlistOrgSpclIns({ org_id: this.Contacts.id })
			.then(response => {
				if (response.result.success) {
					this.specialInstruction = response.result.data.special_instructions;
					// console.log(this.specialInstruction.length)
				}
			})
			.catch(error => console.log(error))
	}

	public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
		console.log(tabChangeEvent);
		if (tabChangeEvent.index != 0) {
			this.activestate = false;
		}
	}
	getOrganization(): void {
		let param = {
			page: '',
			perPage: '',
			sort: 'ASC',
			search: ''
		}
		this.organizationsService
			.getOrganizationsList(param)
			.then(response => {
				if (response.result.success) {
					this.currencyX = response.result.data.currencyDt;
				}
			})
			.catch(error => console.log(error))
	}
	public noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
	public noZeroValidator(control: FormControl) {
		//console.log(control.value)
		if (control.value == 0) {
			let isWhitespace = true;
			let isValid = !isWhitespace;
			return isValid ? null : { 'whitespace': true };
		}

	}

	generateDetailsForm(): void {
		this.detailsForm = this.formBuilder.group({
			company_name: [null, [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
			website: [null, [Validators.required, Validators.pattern(this.websitePattern)]],
			status: [null, Validators.required],
			attachments_id: "",
			country_id: [null, Validators.required],
			currency_id: [null, Validators.required],
			addCountry: [null],
		});
	}

	cancel(form: any): void {
		this.uploadError = false;
		this.sizeError = false;
		form.markAsPristine();
		this.setForm(this.Contacts);
		this.activestate = false;
		this.submitCountry = false;
	}

	setForm(data: any): void {
		this.detailsForm.patchValue({
			company_name: data.name,
			website: data.website,
			status: data.status,
			country_id: data.country_id,
			attachments_id: data.attachments_id,
			currency_id: data.currency_id,
		});
		this.uploads = [];
		// this.pointerEvent = false;
		if (data.company_logo) {
			// this.pointerEvent = true;
			let obj = {
				filename: data.company_logo,
				source_path: data.company_logo,
				original_name: data.company_logo
			}
			this.uploads.push(obj);
		}
	}

	getOrganizationDetails(): void {
		this.organizationsService
			.getGlobalOrganizations()
			.then(response => {
				if (response.result.success) {
					this.countries = response.result.data.countries;
					
				}
			})
			.catch(error => console.log(error))
	}
	updateProducts(id) {
		this.saveProduct = false
		setTimeout(() => {
			this.saveProduct = true
		}, 0);
	}

	updateOrganization(form?: any): void {
		console.log(this.Contacts)
		if (form.valid) {
			let toast: object;
			// console.log(form.valid);
			let param = Object.assign({}, form.value);
			param.id = this.Contacts ? this.Contacts.id : '';
			// param.status = this.Contacts.status;
			if (this.uploads.length) {
				param.filename = this.uploads[0].filename;
				param.original_name = this.uploads[0].original_name;
				param.src_name = this.uploads[0].source_path;
			}
			this.organizationsService
				.addorganizations(param)
				.then(response => {
					if (response.result.success) {
						// console.log(123)
						toast = { msg: "Organization Details updated successfully.", status: "success" };
						this.snackbar.showSnackBar(toast);
						this.Contacts = response.result.data[0];
						this.activestate = false;
						this.uploadError = false;
						this.sizeError = false;
						this.setForm(this.Contacts);
						this.trigger.emit({ flag: this.Contacts.id, data: this.Contacts });
					
					}
				})
				.catch(error => console.log(error))

		}
	}

	onStatusChange(data?: any): void {
		
		//  this.Contacts.status = data.value;
		this.activestate = true;
		// console.log(this.activestate)
		//this.updateOrganization(this.detailsForm);
	}
	onCountryChange(data?: any): void {
		if (!this.detailsForm.value.country_id) {
			this.submitCountry = true;
		} else {
			this.submitCountry = false;
		}
		// this.Contacts.country_id = data.value;
		this.activestate = true;
	}
	ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
		this.getOrganizationDetails();
		this.uploadError = false;
		this.sizeError = false;
		this.fetchingData = true;
		this.activestate = false;
		this.organizationDetails = [];
		this.contactsList = [];
		setTimeout(() => {
			this.fetchingData = false;
		}, 300);
		if (this.Contacts) {
			this.removeTabs = false;
			if (this.Contacts.id) {
				this.emptyContactsData = false;
				this.emptyAddressData = false;
				this.noInstructions = false;
			
				this.generateDetailsForm();
				this.specialInstructionsList();
				this.setForm(this.Contacts);
				this.organizationsService
					.ListAddress({ org_id: this.Contacts.id })
					.then(response => {
						this.fetchingData = false;
						this.removeTabs = false;
						if (response.result.data.address_organization) {
							this.organizationDetails = response.result.data.address_organization;
						} else {
							this.organizationDetails = []
						}
					})
					.catch(error => console.log(error));
				this.organizationsService
					.listContacts({ org_id: this.Contacts.id })
					.then(response => {
						if (response.result.data.contactsData) {
							this.contactsList = response.result.data.contactsData;
						} else {
							this.contactsList = [];
						}
						if (response.result.data.designationsDt) {
							this.contactDesignations = response.result.data.designationsDt;
						} else {
							this.contactDesignations = [];
						}
						if (response.result.data.emailAddressTypesDt) {
							this.emailAddressTypes = response.result.data.emailAddressTypesDt;
						} else {
							this.emailAddressTypes = [];
						}
						if (response.result.data.phoneNumberTypesDt) {
							this.phoneNumberTypes = response.result.data.phoneNumberTypesDt;
						} else {
							this.phoneNumberTypes = [];
						}
						if (response.result.data.groupsDt) {
							this.groupArray = response.result.data.groupsDt;
						} else {
							this.groupArray = [];
						}
					}).catch(error => console.log(error))
			} else {
				this.emptyContactsData = true;
				this.emptyAddressData = true;
				this.noInstructions = true;
				this.removeTabs = true;

				console.log(this.removeTabs)
				console.log(this.loading)
			}
		}

	
	}

	deleteOrganizationAddress(data?: any): void {

		let address = {
			address1: "",
			address2: "",
			address_type_id: "",
			city: "",
			country_id: "",
			id: "",
			attachments_id: "",
			organization_id: "",
			addCountry: "",
			org_id: this.Contacts.id
		};
		if (data)
			Object.assign(address, data);

		let toast: object;
		let dialogRef = this.dialog.open(AddressDeleteComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			// height: '240px',
			data: address
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.success) {
				this.organizationsService
					.deleteOrgAddress({ org_id: this.Contacts.id, id: address.id })
					.then(response => {
						if (response.result.success) {
							toast = { msg: "Address deleted successfully.", status: "success" };
							// console.log(this.organizationDetails);
							this.organizationDetails = this.organizationDetails.filter(function (value) {
								if (value.id == address.id) {
									return false;
								}
								return true;
							});
							this.snackbar.showSnackBar(toast);
						}
					})
					.catch(error => console.log(error))
			}
		});
	}

	updateAddress(data?: any): void {
		
		let type :any;
		let address = {
			address1: "",
			address2: "",
			address_type_id: "",
			city: "",
			country_id: "",
			id: "",
			organization_id: "",
			org_id: this.Contacts.id,
			addressClientData: this.organizationDetails,
		};
		if (data) {
			Object.assign(address, data)
			type='edit'
		}else {
			type="add"
		}
		let toast: object;
		let dialogRef = this.dialog.open(VendorAddressComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			data: { address: address,type: type }
		});
		// console.log(this.organizationDetails)
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				if (address.id) {
					toast = { msg: "Address updated successfully.", status: "success" };
					let organizationsList = [];
					this.organizationDetails.map(function (value) {

						if (value.id == result.response.id) {
							organizationsList.push(result.response);
						} else {
							organizationsList.push(value);
						}
					});
					this.organizationDetails = organizationsList;
				} else {
					toast = { msg: "Address added successfully.", status: "success" };
					this.organizationDetails.push(result.response);
				}
				this.snackbar.showSnackBar(toast);
			}
			
		});
	}




	/* Contacts Module */

	updateOrganizationContacts(data?: any): void {

		let contacts = {
			id: "",
			contact: {
				description: "",
				first_name: "",
				last_name: "",
				middle_name: "",
				designation_id: 0,
				primary_email: "",
				designation_name: "",
				primary_phone: "",
				contact_id: 0,
				org_id: this.Contacts.id,
				vendor_cont :true
			},
			emailArr: {
				email_address: "",
				email_address_type_id: 1,
				email_id: "",
				email_type: "",
				invalid: false,
			},
			phoneArr: {
				phone_number: "",
				phone_number_type_id: 2,
				phone_id: "",
				invalid: false
			},
			contactDesignations: this.contactDesignations,
			emailAddressTypes: this.emailAddressTypes,
			phoneNumberTypes: this.phoneNumberTypes,
			groupArray: this.groupArray
		};
		if (data)
			Object.assign(contacts, data)

		let toast: object;

		let dialogRef = this.dialog.open(ContactsComponent, {
			panelClass: 'alert-dialog',
			width: '540px',
			data: contacts
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				if (contacts.contact.contact_id) {
					toast = { msg: "Contact updated successfully.", status: "success" };
					let organisationContactsList = [];
					this.contactsList.map(function (value) {
						if (value.contact.contact_id == contacts.contact.contact_id) {
							organisationContactsList.push(result.response);
						} else {
							organisationContactsList.push(value);
						}
					});
					this.contactsList = organisationContactsList;
					// console.log(this.contactsList)
				} else {
					toast = { msg: "Contact added successfully.", status: "success" };
					this.contactsList.push(result.response);
				}
				this.snackbar.showSnackBar(toast);
			}
		});
	}

	deleteOrganizationsContact(data?: any, index?: any): void {
		let contacts = {
			contact: {
				description: "",
				first_name: "",
				last_name: "",
				middle_name: "",
				designation_id: 0,
				primary_email: "",
				designation_name: "",
				primary_phone: "",
				contact_id: 0,
				organization_id: this.Contacts.id,
			},
			emailArr: {
				email_address: "",
				email_address_type_id: 1,
				email_id: "",
				email_type: "",
				invalid: false,
			},
			phoneArr: {
				phone_number: "",
				phone_number_type_id: 2,
				phone_id: "",
				invalid: false
			},
			contactDesignations: this.contactDesignations,
			emailAddressTypes: this.emailAddressTypes,
			phoneNumberTypes: this.phoneNumberTypes,
			groupArray: this.groupArray
		};
		let toast: object;
		let dialogRef = this.dialog.open(ContactDeleteAlertComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			data: data
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.success) {
				toast = { msg: "Contact Deleted Successfully...", status: "success" };
				// console.log('dialog close')
				this.snackbar.showSnackBar(toast);
				this.contactsList = this.contactsList.filter(function (value) {
					if (value.contact.contact_id == data.contact_id) {
						return false;
					}
					return true;
				});
			}
		});
	}
	selectDetail() {
		this.activestate = true;
	}

	moreEmail(data?: any, index?: any) {
		let toast: object;
		let dialogRef = this.dialog.open(MoreEmailsComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			// height: '240px',
			// data: data
		});
		dialogRef.afterClosed().subscribe(result => {

		});
	}
	addCountry(country: any) {
		if (country.value.addCountry) {
			this.adminService
				.addCountry({ name: country.value.addCountry })
				.then(response => {
					if (response.result.success) {
						this.submitCountry = false;
						this.getOrganizationDetails();
						this.detailsForm.patchValue({
							country_id: response.result.data.id,
						});
					}

				});
		}
	}


	addInstruction(data) {
		// console.log('nafhalif' ,data.id)
		let contacts = {
			org_id: this.Contacts.id,
			id: ((data && data.id) ? data.id : 0),
			name: data.name,
		}
		let toast: object;
		let dialogRef = this.dialog.open(VendorInstructionsComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			data: contacts,
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				this.specialInstructionsList();

			}
		});
	}


	deleteIns(data?: any) {
		let toast: object;
		let contacts = {
			id: data.id,
		}
		let dialogRef = this.dialog.open(VendorDelteInstrnsComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result.success) {
				toast = { msg: "Special Instruction deleted successfully.", status: "success" };
				this.snackbar.showSnackBar(toast);
				this.organizationsService
					.getDeleteOrgSpclInsApi({ id: contacts.id })
					.then(response => {
						if (response.result.success) {
							this.specialInstructionsList();
						}
					})

			}
		});
	}
	viewIns(data) {
		let contacts = {
			name: data.name
		}
		let toast: object;
		let dialogRef = this.dialog.open(ViewInstructionComponent, {
			panelClass: 'alert-dialog',
			width: '500px',
			data: contacts,
		});
		// console.log(contacts)
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.success) {
				this.specialInstructionsList();

			}
		});
	}

}
