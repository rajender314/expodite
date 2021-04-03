import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import * as _ from 'lodash';
import { OrganizationsService } from '../../services/organizations.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { language } from '../../language/language.module';
import { SnakbarService } from '../../services/snakbar.service';
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    providers: [OrganizationsService]
})
export class ContactsComponent implements OnInit {
    @Input() Organization;
    @Output() trigger = new EventEmitter<object>();
    @Output() itemDeleted = new EventEmitter<{ index: number }>();
    contactsForm: FormGroup;
    checkedArr = [];
    mailListArray: FormArray;
    checkedStatus:any = {};
    deletedEmailArray = [];
    deletedPhoneNumberArray = [];
    numberListArray: FormArray;
    public language = language;
    designationData: any[];
    emailTypes: any[];
    contactTypes: any[];
    showError : boolean;
    selected = 1;
    selectedN = 2;
    mailNumberParse: string;
    panelOpenState: boolean = false;
     public errorMsg;
     public disabledSave = false;
    private phoneNumberPattern = /^[0-9]{10}$/;
    private emailPattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    public showSpinner = false;


    constructor(
        private formBuilder: FormBuilder,
        private organizationsService: OrganizationsService,
        public dialog: MatDialog,
        private snackbar: SnakbarService,
        public dialogRef: MatDialogRef<ContactsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        // console.log(this.data)
        dialogRef.disableClose = true;
        if (data.groupsArr) {
            this.defaultChecked( data.groupsArr);
            this.checkedArr = data.groupsArr;
        }
    }

    defaultChecked( checkedArr): void {
      
            _.map(checkedArr, (group) => {
           this.checkedStatus[group] = true;

        })

    }
    ngOnInit() {
        this.generateContactForm(this.data);
        console.log(this.data)
        
    }
    public noWhitespaceValidator(control: FormControl) {
 
        let isWhitespace = (control.value || '').trim().length === 0;
        let isValid = !isWhitespace;
        // [Validators.required , this.noWhitespaceValidator]]
        return isValid ? null : { 'whitespace': true };
    }
    public noZeroValidator(control: FormControl) {
       //  console.log(control.value)
        if(control.value == 0 ){
          let isWhitespace = true;
          let isValid = !isWhitespace;
          return isValid ? null : { 'whitespace': true };
        }
      }
    generateContactForm(data): void {
        // let emailsList = [],
        //     emailDelList = [],
        //     phoneNumberList = [];
        let fb = this.formBuilder;

        if (this.data.emailArr && this.data.emailArr.length) {
            this.data.emailArr.map(function (value, index) {
                value.invalid = false;
                // emailsList.push(fb.group(value));
            });
        } else {
            // emailsList.push(fb.group({
            //     email_address: "",
            //     email_address_type_id: 1,
            //     email_id: "",
            //     c_e_id: "0",
            //     invalid: false
            // }));
        }
        if (this.data.phoneArr && this.data.phoneArr.length) {
            this.data.phoneArr.map(function (value, index) {
                // phoneNumberList.push(fb.group(value));
                value.invalid = false;
            });
        } else {
            // phoneNumberList.push(fb.group({
            //     phone_number: "",
            //     phone_number_type_id: 2,
            //     phone_id: "",
            //     c_p_id: "0",
            //     invalid: false
            // }));
        }
        
        this.contactsForm = this.formBuilder.group({
            first_name: [data.contact.first_name, [Validators.required]],
            last_name: [data.contact.last_name, [Validators.required]],
            middle_name: data.contact.middle_name,
            primary_email: [data.contact.primary_email, [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            primary_phone: [data.contact.primary_phone, [Validators.required, Validators.pattern('^[0-9]*$')]],
            ext: [data.contact.ext, [Validators.pattern('^[0-9]*$')]],
            designation_name: data.contact.designation_name,
            // emailArr: this.formBuilder.array(emailsList),
            // phoneArr: this.formBuilder.array(phoneNumberList),

        });
        // this.numberListArray = this.contactsForm.get('phoneArr') as FormArray;
        // this.mailListArray = this.contactsForm.get('emailArr') as FormArray;
    }
    updateChecked(groupname, event) {
        if (event.checked) {
            this.checkedArr.push(groupname.id)
            this.showError = false;
        } else {
            let index = this.checkedArr.indexOf(groupname.id)
            if (index > -1) {
                this.checkedArr.splice(index, 1)
            }

        }
        // console.log(this.checkedArr)

    }
    priceValidation(event: any) {
        const pattern = /^[0-9]{0,7}?.[0-9]{0,1}$/;
        if (event.target.value.length > 0) {
            if (pattern.test(event.target.value)) {
                // console.log('valid')
                return true;
            } else {
                // console.log('invalid')
                event.preventDefault();
            }
        }
    }
    public isUserAccess = 0;
    giveUserAccess(event) {
        // console.log(event)
        this.disableSave = false;
        this.isUserAccess = event.checked ? 1 : 0;
    }
    public disableSave =true;
    valChanged() {
        this.disableSave = false;
    }

    addContact(form: any): void {
        // console.log(form)
        let toast: object;
        this.disabledSave = true;
        form.get('primary_email').markAsTouched({ onlySelf: true });
        form.get('primary_phone').markAsTouched({ onlySelf: true });
        form.get('first_name').markAsTouched({ onlySelf: true });
        form.get('last_name').markAsTouched({ onlySelf: true });
        // if(!this.checkedArr.length) {
        //     this.showError = true;
        // }else {
        //     this.showError = false;
        // }
        let validForm = true;
        
        // console.log(this.data.contact)
        if (form.valid && validForm) {
            this.showSpinner = true;
            this.disabledSave = true;
            this.showError = false;
            let param = Object.assign(this.data.contact, this.contactsForm.value, { groupsArr: this.checkedArr,
                 organization_id: this.data.contact.org_id ?  this.data.contact.org_id :  this.data.contact.organization_id, 'isuserAccess': this.isUserAccess });
            this.organizationsService
                .OrganizationContacts(param)
                .then(response => {
                    if (response.result.success) {
                        this.showSpinner = false;
                        this.errorMsg = '';
                        this.disabledSave = false;
                        this.dialogRef.close({ success: true, response: response.result.data[0] });
                    }  else {
                        this.showSpinner = false;
                        this.disabledSave = false;
                        this.errorMsg = response.result.message;
                        toast = { msg: response.result.message, status: 'error' };
                      }
                    //   this.snackbar.showSnackBar(toast);
                })
                .catch(error => console.log(error))
        } else {
            this.disabledSave = false;
        }
    }

    changeTaxrate(value: string) {
        let match = value.match(/0\.\d{1,3}/);
        if (!match) { return; }
    }
    emailValidation(event: any) {
        if (event.value.email_address == '' || this.emailPattern.test(event.value.email_address)) {
            event.value.invalid = false;
        } else {
            event.value.invalid = true;
        }
    }

    phoneNumberValidation(event: any, list: any) {
        const pattern = /[0-9\+\-\ ]/;
        let inputChar = String.fromCharCode(event.charCode);
       
        if (list.value.phone_number == '') {
            list.value.invalid = true;
        } else {
            list.value.invalid = false;
        }
        if (event.keyCode != 8 && !this.phoneNumberPattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    public phoneValue;
    public phoneErrorMsg = false;
    phonenumber(event: any) {
        // const pattern = /^[0-9-]*$/;
        // let inputChar = String.fromCharCode(event.charCode);
        // if (event.keyCode != 8 && !pattern.test(inputChar)) {
        //     event.preventDefault();
        // }

        this.phoneValue = event.target.value;
        //  console.log(this.phoneValue)
    
         var numbers = /^[0-9 ()+-]+$/;
         if (this.phoneValue != '' && !this.phoneValue.match(numbers))
         {
           this.phoneErrorMsg = true;
        //  alert('Your Registration number has accepted....');
         } else {
          this.phoneErrorMsg = false;
         }
    }
    public extValue;
    public extErrorMsg = false;
    onExtChanges(event) {
        //  console.log( event)
         this.extValue = event.target.value;
        //  console.log(this.phoneValue)
    
         var numbers = /^[0-9 ()+-]+$/;
         if ( this.extValue != '' && !this.extValue.match(numbers))
         {
           this.extErrorMsg = true;
        //  alert('Your Registration number has accepted....');
         } else {
          this.extErrorMsg = false;
         }
        }
        public phoneNoValue;
        public phoneNoErrorMsg = false;
        onPhoneChanges(event) {
            //  console.log( event)
             this.phoneNoValue = event.target.value;
            //  console.log(this.phoneValue)
        
             var numbers = /^[0-9 ()+-]+$/;
             if ( this.phoneNoValue != '' && !this.phoneNoValue.match(numbers))
             {
               this.phoneNoErrorMsg = true;
            //  alert('Your Registration number has accepted....');
             } else {
              this.phoneNoErrorMsg = false;
             }
            }

}