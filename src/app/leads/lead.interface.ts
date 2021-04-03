import { FormControl } from '@angular/forms';

export class MyErrorStateMatcher implements MyErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {
      return (control && control.invalid);
    }
  }