import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-auto-attibute',
  templateUrl: './add-auto-attibute.component.html',
  styleUrls: ['./add-auto-attibute.component.scss']
})
// export class AddAutoAttibuteComponent implements OnInit {
//   autoSuggestForm: FormGroup;
//   noWhitespaceValidator: any;

//   constructor(
//     private fb: FormBuilder,
//   ) { }

//   ngOnInit(): void {
//     this.createAutoSuggestForm();
//   }
//   createAutoSuggestForm = () => {
//     //this.loader = false;
//     this.autoSuggestForm = this.fb.group({
//       label: ['', [Validators.required, this.noWhitespaceValidator]],
//     })
//   }
// }

export class AddAutoAttibuteComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddAutoAttibuteComponent>,
    private fb: FormBuilder,
   // public snackbar: SnakbarService,
   // private organisationService: OrganisationServiceService,
   // private attributesService: AttributesService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  attributeForm: FormGroup;
  autoSuggestForm: FormGroup;
  formFields: any;
  formSubmit = false;
  disableAdd = false;
  dialogType = this.data.flag?this.data.flag:'';
  selectedAttribute = this.data.selectedAttribute;
  duplicateError: any;
  autoSuggestError = false;
  loader = true;

  public params = {
    base_field: false,
    org_id: this.data.orgId,
    client_org_id : this.data.orgId,
    label: '',
    ui_element_id: ''
  };

  ngOnInit() {
    
      this.createAutoSuggestForm();
    
  }

  public noWhitespaceValidator(control: FormControl) {
    let isWhitespace = (control.value || '').trim().length === 0;
    let isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  public minMaxValidator(control: FormControl) {
    if(!(control.value || '').trim().length){
      return null;
    }
    let isValidLabel = (control.value || '').trim().length > 2 && (control.value || '').trim().length <= 100;
    return isValidLabel ? null : { 'minMaxLength': true };
  }

  createAttributeForm = () => {
    this.loader = false;
    this.attributeForm = this.fb.group({
      label: ['', [Validators.required, this.noWhitespaceValidator]],
      ui_element_id: ['', Validators.required],
    })
  }

  createAutoSuggestForm = () => {
    this.loader = false;
    this.autoSuggestForm = this.fb.group({
      label: ['', [Validators.required, this.noWhitespaceValidator]],
    })
  }

  
  addAutoSuggestValue(form) {
   // console.log(form)
    this.formSubmit = true;
    this.loader = true;
    if (form.valid) {
      const value_index = this.selectedAttribute.option.findIndex((a) => {
        return a.value.trim().toLowerCase() === form.value.label.trim().toLowerCase();
      });
      if (value_index > -1) {
        this.autoSuggestError = true;
      } else {
        this.autoSuggestError = false;
        this.dialogRef.close({
          success: true,
          data: form.value.label
        });
      }
    }
  }

  closeDialog = () => {
    this.dialogRef.close();
  }



}