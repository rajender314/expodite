import { AbstractControl, FormControl, ValidatorFn } from "@angular/forms";

export class CustomValidation {
  static notZeroValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value !== null && value !== undefined && value !== 0) {
        return null; // Value is valid
      } else {
        return { notZero: true }; // Value is not valid
      }
    };
  }

  static MatchPassword(AC: AbstractControl) {
    let password = AC.get("newPassword").value;
    let confirmPassword = AC.get("confirmPassword").value;
    if (password != confirmPassword) {
      AC.get("confirmPassword").setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }

  static oneUppercase(FC: FormControl) {
    let password = FC.value;
    let pwdHasUppercaseLetter;
    if (!password) return null;
    pwdHasUppercaseLetter =
      password && /(?=.*[A-Z])/.test(password) ? true : false;
    if (!pwdHasUppercaseLetter) return { upperCase: true };
    else return null;
  }

  static oneLowercase(FC: FormControl) {
    let password = FC.value;
    let pwdHasLowercaseLetter;
    if (!password) return null;
    pwdHasLowercaseLetter =
      password && /(?=.*[a-z])/.test(password) ? true : false;
    if (!pwdHasLowercaseLetter) return { lowerCase: true };
    else return null;
  }

  static oneDigit(FC: FormControl) {
    let password = FC.value;
    let pwdHasNumber;
    if (!password) return null;
    pwdHasNumber = password && /(?=.*\d)/.test(password) ? true : false;
    if (!pwdHasNumber) return { number: true };
    else return null;
  }

  /*static PasswordValidation(FC: FormControl) {
        let password = FC.value;
        let pwdValidLength, pwdHasUppercaseLetter, pwdHasLowercaseLetter, pwdHasNumber;
        pwdValidLength = (password && password.length >= 8 && password.length <= 20 ? true : false);
        pwdHasUppercaseLetter = (password && /(?=.*[A-Z])/.test(password)) ? true : false;
        pwdHasLowercaseLetter = (password && /(?=.*[a-z])/.test(password)) ? true : false;
        pwdHasNumber = (password && /(?=.*\d)/.test(password)) ? true : false;
        if (!pwdValidLength) return { validLength: true }
        if (!pwdHasUppercaseLetter) return { upperCase: true }
        if (!pwdHasLowercaseLetter) return { lowerCase: true }
        if (!pwdHasNumber) return { number: true }
        else return null;
    }*/

  // static noWhitespaceValidator(control: FormControl) {
  //   let isWhitespace = (control.value || "").trim().length === 0;
  //   let isValid = !isWhitespace;
  //   // [Validators.required , this.noWhitespaceValidator]]
  //   return isValid ? null : { whitespace: true };
  // }

  static noWhitespaceValidator(control: FormControl) {
    if (typeof control.value == "string" && control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  static noZeroValidator(control: FormControl) {
    if (control.value == 0) {
      let isWhitespace = true;
      let isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }
  static nameValidator(control: FormControl) {
    const nameRegexp: RegExp = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (control.value && nameRegexp.test(control.value)) {
      return { specialcharacters: true };
    }
  }
  static numericValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && isNaN(value)) {
      return { numeric: true }; // Error for non-numeric input
    }
    return null; // No error for numeric input
  }
  static numericAndSpecialCharValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^[0-9!@#$%^&*()_+=\-[\]{};:~`\'",.<>?/\\|]*$/.test(value)) {
      return { numericSpecialChar: true }; // Error for non-numeric and non-special characters
    }
    return null; // No error for numeric and special characters
  }

  static alphaValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && !/^[a-zA-Z]*$/.test(value)) {
      return { alpha: true }; // Error for non-alphabetic characters
    }
    return null; // No error for alphabetic characters
  }
  static EMAIL_REGEX =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  static websitePattern =
    /^(((ht|f)tp(s?))\:\/\/)?(w{3}\.|[a-z]+\.)([A-z0-9_-]+)(\.[a-z]{2,6}){1,2}(\/[a-z0-9_]+)*$/;
  static phonePattern = "^[0-9]*$";
}
