// import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { language } from '../../language/language.module';
import { ContactsViewService } from '../../services/contacts-view.service';
import { SnakbarService } from '../../services/snakbar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  public contactForm;
  public Types = [{id: 1, name: 'Admin'},{id: 2, name: 'Client'},  {id: 4, name: 'Lead'}, {id: 3, name: 'Vendor'}];
  public Roles = [];
  public companyList = [];
  public language = language;
  public showRoleField = true;
    public emailPattern = /^\w+(\.\w+)*@[a-zA-Z]+\.[a-zA-Z]{2,6}$/;

    showError : boolean;

  public showComapnyField = false;
  public disableContactBtn = true;
  public updateLocalstorageVal = true;
  public disabledSave = false;

  public param = {
    org_type: 1, 
    search: ''
  }
  public selectedtype;
  checkedStatus:any = {};
  checkedArr = [];
  searchCtrl = new FormControl();
  public modelData: any = {};
  constructor(private formBuilder: FormBuilder,
    public contactsViewService: ContactsViewService,
    private snackbar: SnakbarService,
    public dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
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

  ngOnInit(): void {
    console.log(this.data)
    this.selectedtype = this.Types[0].id;
    this.getRoles(this.param);
    this.createContactForm();

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
  createContactForm() {
   
    this.contactForm = this.formBuilder.group({
      log_type: [null, Validators.required]  ,
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      designation_name: [null],
      org_id: [null],
      email: [null, [Validators.required,  Validators.pattern(EMAIL_REGEX)]],
      primary_phone: [null],
      extension_number: [null],
      roles_id: [null, [Validators.required]],
     
    
    });
  }
  public showNoOrgFound = false;
  getRoles(param) {
    // console.log(param)
    this.contactsViewService.getRolesList(param)
    .then(response => {
      // console.log(response)

      if(response && response.result.success) {
       
        this.Roles = response.result.data.roles;
        this.companyList = response.result.data.organization;
        this.companyList.map(obj => {
          obj.name = obj.name.toUpperCase();
        }) 

        console.log(this.updateLocalstorageVal)
        if(this.updateLocalstorageVal) {
          console.log(252525)
          localStorage.setItem('companies', JSON.stringify(this.companyList));
        }
       

      }
      if((!this.companyList.length && param.org_type == 2 ) ||(!this.companyList.length && param.org_type == 3)) {
        this.showNoOrgFound = true;
        console.log(param)
      } else {
        this.showNoOrgFound = false;
       
      }
    })
  }


  selectType(event) {
    // console.log(event)
    this.param.search = '';
    this.updateLocalstorageVal = true;
    this.selectedtype = event.value;
   
      if(event.value == 1 || event.value == 4) {
        this.showComapnyField = false;
     
        this.contactForm.get('roles_id').setValidators([Validators.required])
        this.contactForm.get('roles_id').updateValueAndValidity();


        this.contactForm.get('org_id').clearValidators();
        this.contactForm.get('org_id').updateValueAndValidity();


        this.contactForm.controls['org_id'].value = null;
    this.contactForm.value['org_id'] = null;
   
      
      } else {
        this.contactForm.get('roles_id').clearValidators();
        this.contactForm.get('roles_id').updateValueAndValidity();

        this.modelData.name = '';
        this.modelData.name = null;

        this.contactForm.get('org_id').setValidators([Validators.required])
        this.contactForm.get('org_id').updateValueAndValidity();
        this.showComapnyField = true;
      }
  
      

    this.param.org_type = event.value;

   this.getRoles(this.param);
   

   
  }
  public errorMsg;
  public showorgError = false;
  public cloneCompanyList = [];
  createAddContact(formdata) {
 
    console.log(formdata,   this.showNoOrgFound)
    // console.log(typeof formdata.value['org_id'])
    formdata.get('firstname').markAsTouched({ onlySelf: true });
    formdata.get('lastname').markAsTouched({ onlySelf: true });
    // formdata.get('designation_name').markAsTouched({ onlySelf: true });
    formdata.get('email').markAsTouched({ onlySelf: true });
    // formdata.get('primary_phone').markAsTouched({ onlySelf: true });
    formdata.get('roles_id').markAsTouched({ onlySelf: true });
    formdata.get('org_id').markAsTouched({ onlySelf: true });

    if((typeof formdata.value['org_id'] == 'string') ||
    ((typeof formdata.value['org_id'] == 'string') && formdata.value['org_id'].trim() == '')) {
      let array =  formdata.value['org_id'].toUpperCase() ;
      this.cloneCompanyList = JSON.parse(localStorage.getItem('companies'));
      this.cloneCompanyList.map(obj => {
        obj.name = obj.name.toUpperCase();
      }) 
      console.log(this.cloneCompanyList)
      let idx = _.findIndex(this.cloneCompanyList, {
        name: array
      });
      if(idx > -1) {
        this.showNoOrgFound = false;
        formdata.value['org_id'] = this.cloneCompanyList[idx].id
        this.errorMsg = '';
      } else {
        this.showNoOrgFound = true;
        this.errorMsg = '';
      }
    
    //  console.log(123222)
    } else {
      this.showNoOrgFound = false;
    }
  
    if(formdata.value.log_type == 2 || formdata.value.log_type == 3) {
      if(!this.checkedArr.length) {
        this.showError = true;
        this.errorMsg = '';
        // console.log(1)
        }else {
            this.showError = false;
        }
    } else {
      this.showError = false;
    }
    if(this.showNoOrgFound) {
      return;
    }
    if (formdata.valid   ) {
    let toast: object;
   
    let param = Object.assign(this.contactForm.value, { groupsArr: this.checkedArr});
    this.disabledSave = true;
    this.contactsViewService.createContact(param)
    .then(response => {
      // console.log(response)
      let newdata = response.result.data;

     if(response.result.success) {
      toast = { msg: 'Contact added successfully', status: 'success' };
      this.snackbar.showSnackBar(toast);
      this.dialogRef.close({response: newdata, success: true })
     } else {
       this.errorMsg = response.result.message;
      toast = { msg: 'Failed to add contact', status: 'error' };
     }

   
    })
  } else {
    this.errorMsg = '';
  }
  }
  public selectedClients(event:any) {
    // this.showError = false;
    // this.selectAuto = true;
    this.updateLocalstorageVal = false;
    this.param.search = event.target.value;
  

    this.getRoles(this.param);


    setTimeout(() => {
      if(event.value == 1) {
        this.showComapnyField = false;
      } else {
        this.showComapnyField = true;
      }
  
      // if(event.value == 2 || event.value == 3) {
      //   this.showRoleField = false;
      // } else {
      //   this.showRoleField = true;
      // }
    }, 500);


   
  }
  public clear() {
    this.modelData.id = null;
    this.modelData.name = null;
    this.modelData.name = '';
    this.searchCtrl.setValue(null);
    this.param.search = '';
    this.contactForm.controls['org_id'].value = null;
    this.contactForm.value['org_id'] = null;
    this.contactForm.value['org_id'] = '';
    this.showNoOrgFound = true;
    this.contactForm.controls['org_id'].value = '';
    this.getRoles(this.param);
   }
   public phoneValue;
   public phoneErrorMsg = false;
   onPhoneChanges(event) {
    //  console.log( event)
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
    //  if(name == 'phone') {
    //   if(event.target.value.length == 15 || event.key==='e' ) {
    //     event.preventDefault();
    //     return false;
    //   }
     
    //  } else {
    //   if(event.target.value.length == 5) {
    //     event.preventDefault();
    //     return false;
    //   }
    //   if( event.key==='e'){
    //     event.preventDefault();
    //   }
    //  }
   
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

    onlyNumber(evt) {
      console.log(evt)
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57)){
            return false;
        }
    return true;
}

giveUserAccess(event) {
  console.log(event)
}

selectionChange(data) {
  this.modelData.id = data.id;
  this.modelData.name = data.name;

  this.searchCtrl.setValue(data.name);
}
allowNumber(event: any, name) {
  // const pattern = /^[0-9-]*$/;
  const pattern = /^-?[0-9]+(\.[0-9]*){0,1}$/g;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}
}
