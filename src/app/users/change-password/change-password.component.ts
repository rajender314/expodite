import { AdminService } from './../../../../../dashboard/src/app/services/admin.service';
import { Component, OnInit, ViewChild, ElementRef, OnChanges, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { CustomValidation } from '../../custom-format/custom-validation';
import { SnakbarService } from '../../services/snakbar.service';
import { UsersService } from '../../services/users.service';
import { language } from '../../language/language.module';
import { DomSanitizer, Title } from '@angular/platform-browser';

declare var App: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [UsersService]
})
export class ChangePasswordComponent implements OnInit {
  
  @ViewChild('myInput') inputEl : ElementRef;
  changePasswordForm: FormGroup;
  server_msg: string;
  public language = language;
  enterInputDisable:boolean;
  public inputFocus = false;
  public urlPath ;
  constructor(
    private renderer : Renderer2,
    private fb: FormBuilder,
    private location: Location,
    private snackbar: SnakbarService,
    private userService: UsersService,
    public adminService: AdminService,
    private _sanitizer: DomSanitizer,
    private titleService: Title,
    ) { 
    }

  ngOnInit() {
    // const element = this.renderer.selectRootElement('#changePwd');
    // setTimeout(() => element.focus(), 0);
    // this.createForm();
    // console.log(this.adminService.manageAccount)
    this.urlPath = this._sanitizer.bypassSecurityTrustResourceUrl(this.adminService.manageAccount);
    this.titleService.setTitle('Expodite - Manage Account');
  }
  
  createForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, [
        Validators.required, Validators.minLength(8),
        Validators.maxLength(20),
        CustomValidation.oneUppercase, CustomValidation.oneLowercase,
        CustomValidation.oneDigit]],
      confirmPassword: [null, Validators.required]
    }, {
        validator: CustomValidation.MatchPassword
      });
      this.enterInputDisable = false;
      // this.inputEl.nativeElement.focus();
  }

  changePassword(form: any): void {

    if (!form.valid) return;
    let param = Object.assign({}, form.value);
    param.id = App.user_details.id;
    let toast: object;
    this.userService
      .changePassword(param)
      .then(response => {
        if (response.result.data.success) {
          toast = { status: 'success', msg: response.result.message };
          this.server_msg = '';
          this.snackbar.showSnackBar(toast);
          setTimeout(() => {
            this.location.back();
          }, 1500);
        }
        else this.server_msg = response.result.data.messageCode;
      })
      .catch(error => console.log(error));
  }


  reset(): void {
      this.createForm();
      this.enterInputDisable = false;
  }


  
  EnterInput(event): void {
    this.enterInputDisable = true;
    // if(this.changePasswordForm.value.length === 0) {
    //   this.enterInput = false;
    //   console.log(123);
    // }else(this.changePasswordForm.value.length > 0) {
    //   this.enterInput = true;
    // }
  }

}
