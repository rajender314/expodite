import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import * as _ from 'lodash';
import { OrganizationsService } from '../../services/organizations.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
import { SnakbarService } from '../../services/snakbar.service';
import { AdminService } from '../../services/admin.service';
import { ViewEncapsulation } from '@angular/core';
@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss'],
	providers: [OrganizationsService, AdminService],
	// encapsulation: ViewEncapsulation.None,
})

export class AddressComponent implements OnInit {
	@Input() Organization;
	@Output() trigger = new EventEmitter<object>();
	public language = language;
	addressForm: FormGroup;
	address_type: any[];
	countries: any[];
	newAddress = "Add Address";
	states: any[];
	submitCountry = false;
	submitState = false;
	countriesStates: any;
	clientAddress: Array<any>;
	addressChecked: boolean;
	selected = -1;
	public disabledSave = false;
	public showSpinner = false;


	constructor(
		private organizationsService: OrganizationsService,
		public dialog: MatDialog,
		private fb: FormBuilder,
		private snackbar: SnakbarService,
		private adminService: AdminService,
		public dialogRef: MatDialogRef<AddressComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) { dialogRef.disableClose = true; }

	public noWhitespaceValidator(control: FormControl) {
		let isWhitespace = (control.value || '').trim().length === 0;
		let isValid = !isWhitespace;
		return isValid ? null : { 'whitespace': true };
	}
	public noZeroValidator(control: FormControl) {
		if (control.value == 0) {
			let isWhitespace = true;
			let isValid = !isWhitespace;
			return isValid ? null : { 'whitespace': true };
		}
	}
	generateAddressForm(): void {
		this.addressForm = this.fb.group({
			address_count:'',
			address_type_id: ["", Validators.required],
			company_name: "",
			address1: ["", [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
			address2: "",
			city: ["", [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
			postal_code: ["", [Validators.required, this.noWhitespaceValidator, this.noZeroValidator]],
			state_province_id: ["", Validators.required],
			country_id: ["", Validators.required],
			org_id: "",
			id: '',
			org_address_bill_id: '',
			organization_id: '',
			state: '',
			address_id: '',
			address_type: '',
			country_name: '',
			addCountry: '',
			addState: '',
		});
		this.addressForm.patchValue({
			org_id: this.data.address.org_id
		});
	}
	setform() {
		if (this.data.address.id) {
			this.newAddress = "Update Address";
			this.addressForm.patchValue({
				address_count:this.data.address.address_count,
				company_name: this.data.address.company_name,
				address1: this.data.address.address1,
				address2: this.data.address.address2,
				address_id: this.data.address.address_id,
				address_type: this.data.address.address_type,
				address_type_id: this.data.address.address_type_id,
				city: this.data.address.city,
				country_id: this.data.address.country_id,
				country_name: this.data.address.country_name,
				id: this.data.address.address_id,
				org_address_bill_id: this.data.address.org_address_bill_id,
				org_id: this.data.address.org_id,
				organization_id: this.data.address.organization_id,
				postal_code: this.data.address.postal_code,
				state: this.data.address.state,
				state_province_id: this.data.address.state_province_id
			});
		}
	}
	ngOnInit() {
		this.clientAddress = this.data.address.addressClientData;
		// console.log(this.clientAddress)
		this.getOrganizationDetails();
		this.generateAddressForm();
		this.setform();
		// console.log(this.data)
		
	}
	getOrganizationDetails(): void {
		this.organizationsService
			.getGlobalOrganizations()
			.then(response => {
				if (response.result.success) {
					this.address_type = response.result.data.address_types;
					this.countries = response.result.data.countries;
					this.countriesStates = response.result.data.countriesStates;
					this.states = response.result.data.states;
				}
			})
	}
	onCountryChange(data?: any, stateId?: any): void {
		if (this.addressForm.value.country_id) {
			this.submitCountry = false;
			this.states = this.countriesStates ? this.countriesStates[this.addressForm.value.country_id] : [];
			this.addressForm.patchValue({
				state_province_id: stateId ? stateId : this.states ? this.states[0].id : ''
			});
		} else {
			this.submitCountry = true;
		}
	}
	onStateChange() {
		if (this.addressForm.value.state_province_id) {
			this.submitState = false;
		} else {
			this.submitState = true;
		}
	}
	addAddress(form?: FormGroup,data?:any): void {
		this.disabledSave = true;
		console.log(2525)

		setTimeout(() => {
			let toast: object;
		this.addressForm.get('address_type_id').markAsTouched({ onlySelf: true });
		this.addressForm.get('address1').markAsTouched({ onlySelf: true });
		this.addressForm.get('country_id').markAsTouched({ onlySelf: true });
		this.addressForm.get('city').markAsTouched({ onlySelf: true });
		this.addressForm.get('postal_code').markAsTouched({ onlySelf: true });
		this.addressForm.get('state_province_id').markAsTouched({ onlySelf: true });

		if(this.data.type != 'edit') {
			form.value['address_count'] = this.data.address.addressClientData.length + 1;
		}
		if(this.addressForm.value.address_type_id == 4) {
			this.addressForm.value.address_type = "Shipping Address"
		}
		if(this.addressForm.value.address_type_id == 2) {
			this.addressForm.value.address_type = "Office/Billing Address"
		}
		if(this.addressForm.value.address_type_id == 11) {
			this.addressForm.value.address_type = "Notifying Address"
		}
		// return
		// this.addressForm.value.id = this.addressForm.value.address_id;
		// console.log(this.addressForm.value)
		if (form.valid) {
			this.disabledSave = true;
			this.showSpinner = true;
			this.organizationsService
				.OrganizationAddress(this.addressForm.value)
				.then(response => {
					if (response.result.success) {
						this.disabledSave = false;
						this.showSpinner = false;
						// console.log(form.valid)
						this.dialogRef.close({ success: true, response: response.result.data.address_organization[0] });
					} else {
						this.disabledSave = false;
						this.showSpinner = false;
						toast = { msg: response.result.message, status: 'error' };
					}
					// this.snackbar.showSnackBar(toast);
				})
				.catch(error => console.log(error))
		} else {
			this.disabledSave = false;
		}
		}, 500);
		
		
	}
	addCountry(country: any) {
		if (country.value.addCountry) {
			this.adminService
				.addCountry({ name: country.value.addCountry })
				.then(response => {
					if (response.result.success) {
						this.submitState = true;
						this.submitCountry = false;
						this.getOrganizationDetails();
						this.addressForm.patchValue({
							country_id: response.result.data.id,
							state_province_id: '',
						});
					}

				});
		}
	}

	addState(form: any) {
		if (form.value.addState) {
			this.adminService
				.addState({ name: form.value.addState, country_id: form.value.country_id })
				.then(response => {
					if (response.result.success) {
						this.submitState = false;
						this.getOrganizationDetails();
						this.addressForm.patchValue({
							state_province_id: response.result.data.id,
						});
					}

				});
		}
	}

	// checkboxValue: boolean;
	getAddress(data: any, list: any, type: any): void {
		// console.log(data)
		if (!data.selected) {
			this.setAddressForm(data);
		} else {
			this.addressForm.reset();
		}
		// address.id == data.address.id
		data.selected = !data.selected;
		list.map(function (value) {
			if (data.id != value.id) {
				// console.log(value)
				value['selected'] = false;
			}
		});
	}

	setAddressForm(address) {
		// console.log(address)
		if (address.address_type_id) {
			this.addressForm.patchValue({
				address_count:this.data.address.address_count,
				company_name: address.company_name,
				address1: address.address1,
				address2: address.address2,
				address_id: address.address_id,
				address_type: address.address_type,
				address_type_id: address.address_type_id,
				city: address.city,
				country_id: address.country_id,
				country_name: address.country_name,
				id: address.id || '',
				org_address_bill_id: address.org_address_bill_id || '',
				org_id: this.data.address.org_id,
				organization_id: address.organization_id,
				postal_code: address.postal_code,
				state: address.state,
				state_province_id: address.state_province_id
			});
		}


	}
}



// WEBPACK FOOTER //
// ./src/app/dialogs/address/address.component.ts