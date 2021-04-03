import { AbstractControl, FormControl } from '@angular/forms';

export class CustomValidation {

    static MatchPassword(AC: AbstractControl) {
        let password = AC.get('newPassword').value;
        let confirmPassword = AC.get('confirmPassword').value;
        if (password != confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true })
        } else {
            return null
        }
    }

    static oneUppercase(FC: FormControl) {
        let password = FC.value;
        let pwdHasUppercaseLetter;
        if(!password) return null;
        pwdHasUppercaseLetter = (password && /(?=.*[A-Z])/.test(password)) ? true : false;
        if (!pwdHasUppercaseLetter) return { upperCase: true };
        else return null;
    }

    static oneLowercase(FC: FormControl) {
        let password = FC.value;
        let pwdHasLowercaseLetter;
        if(!password) return null;
        pwdHasLowercaseLetter = (password && /(?=.*[a-z])/.test(password)) ? true : false;
        if (!pwdHasLowercaseLetter) return { lowerCase: true };
        else return null;
    }

    static oneDigit(FC: FormControl){
        let password = FC.value;
        let pwdHasNumber;
        if(!password) return null;
        pwdHasNumber = (password && /(?=.*\d)/.test(password)) ? true : false;
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

}
