import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { language } from '../../language/language.module';
import { AdminService } from '../../services/admin.service';
import { SnakbarService } from '../../services/snakbar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  detailsForm: FormGroup;
  public language = language;
  packageNumber:any
  Contacts: any;
  submited: boolean;
  constructor(private formBuilder: FormBuilder,private adminService: AdminService,private snackbar: SnakbarService,) { }

  ngOnInit(): void {
    this.generateDetailsForm();
    this.getSettings()
  }
  
  getSettings(): void {
		this.adminService
			.getSettings()
			.then(response => {
				if (response.result.success) {
					this.Contacts = response.result.data;
					this.setForm(this.Contacts);	
				//	console.log(this.Contacts)
				}
			})
			.catch(error => console.log(error))
  }
  setForm(data: any): void {
    
		this.detailsForm.patchValue({	
      mailFlag:data.mailFlag==true?"true":"false",
      packageNumber:data.packageNumber		
		});
		
	}
  generateDetailsForm(): void {
		this.detailsForm = this.formBuilder.group({
			
			packageNumber:[null, Validators.required],
			
      mailFlag: [],
		});
	}

  updateOrganization(form?: any): void {
    if (form.valid) {
    let toast: object;
      this.submited =true
    let param = Object.assign({}, form.value);
    this.adminService
    .saveSettings(param)
    .then(response => {
      if (response.result.success) {
        form.markAsPristine();
        toast = { msg: "Settings updated successfully.", status: "success" };
        this.snackbar.showSnackBar(toast);
      }
    })
    .catch(error => console.log(error))
  }
  }
  cancel(form: any): void {
    this.setForm(this.Contacts);
    form.markAsPristine();
	}
}
